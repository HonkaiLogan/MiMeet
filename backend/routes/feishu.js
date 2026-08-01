/**
 * 飞书相关路由
 * - JSAPI config
 * - 一键邀请发消息
 */
const express = require('express');
const { pool } = require('../../database/mock-db');
const { getJsapiConfig, sendMessage, buildInviteCard } = require('../services/feishu');
const router = express.Router();

const MOCK_USER = { feishu_id: 'demo_user', nickname: 'Demo用户' };
function getUser(req) { return req.session.user || MOCK_USER; }

/** 获取 JSAPI 配置（前端初始化 h5sdk 用） */
router.get('/api/feishu/jsapi-config', async (req, res) => {
  try {
    const url = req.query.url || `${req.protocol}://${req.get('host')}/`;
    const config = await getJsapiConfig(url);
    res.json({ code: 200, msg: 'ok', data: config });
  } catch (err) {
    console.error('JSAPI config 错误:', err.message);
    res.json({ code: 500, msg: '获取 JSAPI 配置失败', data: null });
  }
});

/** 一键邀请：给候选人发飞书消息 + 写 invites + 把 match.status 改成 sent
 *  前端 sendInvite(targetUserId, inviteMessage) → { targetUserId, inviteMessage, scene?, matchId? }
 *  兼容旧字段 candidateId / message
 */
router.post('/api/match/invite', async (req, res) => {
  const user = getUser(req);

  const { targetUserId, candidateId, inviteMessage, message, scene, matchId } = req.body || {};
  const uid = targetUserId || candidateId;
  const msg = inviteMessage || message || '';
  if (!uid) return res.json({ code: 400, msg: '缺少目标用户 ID', data: null });

  try {
    const [rows] = await pool.query(
      'SELECT feishu_id, nickname FROM users WHERE id = ?',
      [uid]
    );
    if (rows.length === 0) return res.json({ code: 400, msg: '候选人不存在', data: null });

    const [meRows] = await pool.query('SELECT id FROM users WHERE feishu_id = ?', [user.feishu_id]);
    if (meRows.length === 0) return res.json({ code: 400, msg: '当前用户不存在', data: null });
    const myId = meRows[0].id;

    // 写 invites + 把匹配置为 sent
    try {
      await pool.query(
        'INSERT INTO invites (match_id, from_user_id, to_user_id, scene, message) VALUES (?, ?, ?, ?, ?)',
        [matchId || null, myId, uid, scene || 'lunch', msg]
      );
      if (matchId) {
        await pool.query('UPDATE matches SET status = ? WHERE id = ?', ['sent', matchId]);
      }
    } catch (e) {
      console.warn('写 invites 失败(非致命):', e.message);
    }

    // 未配置飞书时静默失败,不阻塞主流程
    try {
      const card = buildInviteCard(user.nickname, scene || 'lunch', msg);
      await sendMessage(rows[0].feishu_id, card);
    } catch (e) {
      console.warn('发送飞书邀请失败(非致命):', e.message);
    }

    res.json({ code: 200, msg: '邀请已发送', data: { success: true } });
  } catch (err) {
    console.error('发送邀请错误:', err.message);
    res.json({ code: 500, msg: '发送失败', data: null });
  }
});

module.exports = router;
