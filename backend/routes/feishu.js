/**
 * 飞书相关路由
 * - JSAPI config
 * - 一键邀请发消息
 */
const express = require('express');
const { pool } = require('../../database/db');
const { getJsapiConfig, sendMessage, buildInviteCard } = require('../services/feishu');
const router = express.Router();

const MOCK_USER = { feishu_id: 'u001', nickname: '小米同学' };
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

/** 一键邀请：给候选人发飞书消息 */
router.post('/api/match/invite', async (req, res) => {
  const user = getUser(req);

  const { candidateId, scene, message } = req.body;
  if (!candidateId) {
    return res.json({ code: 400, msg: '缺少候选人 ID', data: null });
  }

  try {
    // 查找候选人的 feishu_id
    const [rows] = await pool.query(
      'SELECT feishu_id, nickname FROM users WHERE id = ?',
      [candidateId]
    );
    if (rows.length === 0) {
      return res.json({ code: 400, msg: '候选人不存在', data: null });
    }

    const candidate = rows[0];
    const card = buildInviteCard(user.nickname, scene || 'lunch', message);

    await sendMessage(candidate.feishu_id, card);

    res.json({ code: 200, msg: '邀请已发送', data: null });
  } catch (err) {
    console.error('发送邀请错误:', err.message);
    res.json({ code: 500, msg: '发送失败', data: null });
  }
});

module.exports = router;
