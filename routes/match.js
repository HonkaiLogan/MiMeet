/**
 * 匹配 API
 */
const express = require('express');
const { pool } = require('../db');
const { doMatch } = require('../services/matching');
const router = express.Router();

/** 发起匹配，返回 Top3 推荐搭子 */
router.post('/api/match/execute', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  const { scene } = req.body;

  try {
    const [userRows] = await pool.query(
      'SELECT id FROM users WHERE feishu_id = ?',
      [user.feishu_id]
    );
    if (userRows.length === 0) {
      return res.json({ code: 400, msg: '请先填写画像', data: null });
    }

    const results = await doMatch(userRows[0].id, scene || 'lunch');
    res.json({ code: 200, msg: 'ok', data: results });
  } catch (err) {
    console.error('匹配错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 匹配反馈 */
router.post('/api/match/feedback', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  // TODO: 更新 matches 表中的 feedback_a/feedback_b
  res.json({ code: 200, msg: '反馈已记录', data: null });
});

module.exports = router;
