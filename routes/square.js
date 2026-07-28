/**
 * 搭子广场 API
 */
const express = require('express');
const { pool } = require('../db');
const router = express.Router();

/** 获取搭子广场列表 */
router.get('/api/plaza/list', async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT sp.*, u.nickname, u.avatar_url
      FROM square_posts sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.status = 'open'
      ORDER BY sp.created_at DESC
    `);
    res.json({ code: 200, msg: 'ok', data: posts });
  } catch (err) {
    console.error('获取广场列表错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 发布搭子需求 */
router.post('/api/plaza/publish', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  const { scene, content, time_pref } = req.body;

  try {
    const [userRows] = await pool.query(
      'SELECT id FROM users WHERE feishu_id = ?',
      [user.feishu_id]
    );
    if (userRows.length === 0) {
      return res.json({ code: 400, msg: '请先登录', data: null });
    }

    await pool.query(
      'INSERT INTO square_posts (user_id, scene, content, time_pref) VALUES (?, ?, ?, ?)',
      [userRows[0].id, scene || 'lunch', content, time_pref]
    );

    res.json({ code: 200, msg: '发布成功', data: null });
  } catch (err) {
    console.error('发布需求错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

module.exports = router;
