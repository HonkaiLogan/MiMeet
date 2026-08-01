/**
 * 飞书事件订阅 - 消息落库
 *
 * 飞书后台配置:
 *   1. 应用能力 > 添加机器人
 *   2. 事件与回调 > 事件订阅:
 *      - 回调 URL: https://<公网域名>/api/feishu/events
 *      - Encrypt Key: 随机 32 字节字符串,填到 .env FEISHU_ENCRYPT_KEY
 *      - Verification Token: 复制到 .env FEISHU_VERIFY_TOKEN
 *      - 订阅事件: im.message.receive_v1 (接收消息)
 *   3. 权限管理: im:message.group_at_msg (群里@机器人的消息)
 *                / im:message (读取全部消息,如果确实需要)
 *   4. 应用发布 > 创建版本发布
 *
 * localhost 无法收到飞书回调,必须用 ngrok / cloudflared 打隧道:
 *   ngrok http 5000   → 拿到 https://xxx.ngrok-free.app
 *   飞书回调 URL 填:   https://xxx.ngrok-free.app/api/feishu/events
 */
const express = require('express');
const crypto = require('crypto');
const { pool } = require('../../database/mock-db');
const router = express.Router();

const FEISHU_ENCRYPT_KEY = process.env.FEISHU_ENCRYPT_KEY || '';
const FEISHU_VERIFY_TOKEN = process.env.FEISHU_VERIFY_TOKEN || '';

/** AES-256-CBC 解密飞书回调 body (encrypt 字段) */
function decryptEvent(encryptedB64) {
  if (!FEISHU_ENCRYPT_KEY) throw new Error('未配置 FEISHU_ENCRYPT_KEY');
  const key = crypto.createHash('sha256').update(FEISHU_ENCRYPT_KEY).digest();
  const encrypted = Buffer.from(encryptedB64, 'base64');
  const iv = encrypted.slice(0, 16);
  const ciphertext = encrypted.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
}

/** 校验飞书回调签名(v2 事件订阅,如果后台开启了签名校验) */
function verifySignature(req, rawBody) {
  const signature = req.get('X-Lark-Signature');
  if (!signature) return true; // 未开启签名校验时飞书不发这个 header
  const timestamp = req.get('X-Lark-Request-Timestamp');
  const nonce = req.get('X-Lark-Request-Nonce');
  const encrypt = FEISHU_ENCRYPT_KEY;
  const raw = timestamp + nonce + encrypt + rawBody;
  const expected = crypto.createHash('sha256').update(raw).digest('hex');
  return expected === signature;
}

async function insertMessage(evt) {
  const m = evt.message || {};
  const s = evt.sender || {};
  const senderId = s.sender_id || {};
  const params = [
    m.message_id,
    m.chat_id || null,
    m.chat_type || null,
    senderId.open_id || null,
    s.sender_type || 'user',
    m.message_type || null,
    m.content || null,        // 飞书原文里 content 就是字符串(内部 JSON),直接存进 JSON 列
    m.mentions ? JSON.stringify(m.mentions) : null,
    m.root_id || null,
    m.parent_id || null,
    m.create_time ? new Date(Number(m.create_time)) : null,
  ];
  try {
    await pool.query(`
      INSERT INTO feishu_messages
        (msg_id, chat_id, chat_type, sender_open_id, sender_id_type, msg_type,
         content, mentions, root_id, parent_id, create_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, params);
  } catch (e) {
    if (/Duplicate/i.test(e.message)) {
      // 飞书 at-least-once,同一 msg_id 会重投,忽略
      return;
    }
    throw e;
  }
}

/** 飞书事件订阅回调入口 */
router.post('/api/feishu/events', express.json({ limit: '1mb', verify: (req, _res, buf) => { req.rawBody = buf.toString('utf8'); } }), async (req, res) => {
  try {
    let body = req.body;

    // 加密模式:body 里只有 encrypt 字段
    if (body && body.encrypt) {
      body = decryptEvent(body.encrypt);
    }

    // 签名校验(飞书后台勾了才发这个 header)
    if (!verifySignature(req, req.rawBody || JSON.stringify(req.body))) {
      console.warn('飞书签名校验失败');
      return res.status(401).json({ msg: 'invalid signature' });
    }

    // === URL 校验(飞书填回调 URL 后会推一次 challenge)===
    // v1 形式:  {type:"url_verification", challenge:"..."}
    // v2 形式:  {schema:"2.0", header:{event_type:"url_verification"|"..."}, event:{challenge:"..."}}
    //          或 直接顶层 challenge 字段
    if (body.type === 'url_verification' || body.challenge) {
      if (FEISHU_VERIFY_TOKEN && body.token && body.token !== FEISHU_VERIFY_TOKEN) {
        return res.status(401).json({ msg: 'invalid verify token' });
      }
      return res.json({ challenge: body.challenge });
    }
    if (body.schema && body.event && body.event.challenge) {
      return res.json({ challenge: body.event.challenge });
    }

    // === 正式事件 ===
    // v2 事件结构: { schema:"2.0", header:{event_type,event_id,...}, event:{...} }
    // v1 事件结构: { type:"event_callback", event:{type,message,...} }
    const evt = body.event || {};
    const eventType = (body.header && body.header.event_type) || evt.type || '';

    if (eventType === 'im.message.receive_v1') {
      await insertMessage(evt);
    } else {
      console.log('[飞书事件] 未处理的事件类型:', eventType);
    }

    // 飞书要求 2s 内返回,已入库就 200
    res.json({ code: 0, msg: 'ok' });
  } catch (err) {
    console.error('飞书事件处理错误:', err);
    // 即使失败也要 2xx,否则飞书会疯狂重投,写日志人肉排查更稳
    res.json({ code: 0, msg: 'ok (with error logged)' });
  }
});

/** 内部接口: 查看最新收到的消息(调试用) */
router.get('/api/feishu/messages/recent', async (req, res) => {
  const limit = Math.min(100, parseInt(req.query.limit || '20', 10));
  try {
    const [rows] = await pool.query(
      'SELECT * FROM feishu_messages ORDER BY id DESC LIMIT ?',
      [limit]
    );
    res.json({ code: 200, msg: 'ok', data: rows });
  } catch (err) {
    res.json({ code: 500, msg: err.message, data: null });
  }
});

module.exports = router;
