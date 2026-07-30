/**
 * 匹配 API
 */
const express = require('express');
const { pool } = require('../../database/db');
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

  const { matchId, rating } = req.body; // rating: 'good' / 'bad'
  if (!matchId || !rating) {
    return res.json({ code: 400, msg: '缺少参数', data: null });
  }

  try {
    const [userRows] = await pool.query(
      'SELECT id FROM users WHERE feishu_id = ?',
      [user.feishu_id]
    );
    if (userRows.length === 0) {
      return res.json({ code: 400, msg: '用户不存在', data: null });
    }
    const userId = userRows[0].id;

    // 判断当前用户是 user_a 还是 user_b
    const [matchRows] = await pool.query(
      'SELECT * FROM matches WHERE id = ?',
      [matchId]
    );
    if (matchRows.length === 0) {
      return res.json({ code: 400, msg: '匹配记录不存在', data: null });
    }

    const match = matchRows[0];
    if (match.user_a_id === userId) {
      await pool.query('UPDATE matches SET feedback_a = ? WHERE id = ?', [rating, matchId]);
    } else if (match.user_b_id === userId) {
      await pool.query('UPDATE matches SET feedback_b = ? WHERE id = ?', [rating, matchId]);
    } else {
      return res.json({ code: 400, msg: '无权操作此匹配记录', data: null });
    }

    res.json({ code: 200, msg: '反馈已记录', data: null });
  } catch (err) {
    console.error('反馈错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 历史匹配记录 */
router.get('/api/match/history', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  try {
    const [userRows] = await pool.query(
      'SELECT id FROM users WHERE feishu_id = ?',
      [user.feishu_id]
    );
    if (userRows.length === 0) {
      return res.json({ code: 200, msg: 'ok', data: [] });
    }
    const userId = userRows[0].id;

    const [rows] = await pool.query(`
      SELECT m.*,
        CASE WHEN m.user_a_id = ? THEN ub.nickname ELSE ua.nickname END AS partner_name,
        CASE WHEN m.user_a_id = ? THEN m.feedback_a ELSE m.feedback_b END AS my_feedback
      FROM matches m
      JOIN users ua ON m.user_a_id = ua.id
      JOIN users ub ON m.user_b_id = ub.id
      WHERE m.user_a_id = ? OR m.user_b_id = ?
      ORDER BY m.created_at DESC
    `, [userId, userId, userId, userId]);

    res.json({ code: 200, msg: 'ok', data: rows });
  } catch (err) {
    console.error('历史记录错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

module.exports = router;
