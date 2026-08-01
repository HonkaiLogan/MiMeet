/**
 * 用户画像 API
 */
const express = require('express');
const { pool } = require('../../database/db');
const { understandProfile } = require('../services/mimo');
const router = express.Router();

const MOCK_USER = { feishu_id: 'u001', nickname: '小米同学', avatar_url: '' };
function getUser(req) { return req.session.user || MOCK_USER; }

/** 获取当前用户画像 */
router.get('/api/user/getProfile', async (req, res) => {
  const user = getUser(req);

  try {
    const [rows] = await pool.query(`
      SELECT p.* FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE u.feishu_id = ?
    `, [user.feishu_id]);

    res.json({ code: 200, msg: 'ok', data: rows[0] || null });
  } catch (err) {
    console.error('获取画像错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 保存用户画像 */
router.post('/api/user/saveProfile', async (req, res) => {
  const user = getUser(req);

  const data = req.body;
  const conn = await pool.getConnection();

  try {
    // 确保用户存在
    await conn.query(
      'INSERT IGNORE INTO users (feishu_id, nickname, avatar_url) VALUES (?, ?, ?)',
      [user.feishu_id, user.nickname, user.avatar_url]
    );

    const [userRows] = await conn.query(
      'SELECT id FROM users WHERE feishu_id = ?',
      [user.feishu_id]
    );
    const userId = userRows[0].id;

    const scene = data.scene || 'lunch';

    // 检查是否已有画像
    const [existing] = await conn.query(
      'SELECT id FROM profiles WHERE user_id = ? AND scene = ?',
      [userId, scene]
    );

    const tasteJson = typeof data.taste_pref === 'string'
      ? JSON.stringify(data.taste_pref.split(',').map(s => s.trim()))
      : JSON.stringify(data.taste_pref || []);
    const interestsJson = typeof data.interests === 'string'
      ? JSON.stringify(data.interests.split(',').map(s => s.trim()))
      : JSON.stringify(data.interests || []);

    if (existing.length > 0) {
      await conn.query(`
        UPDATE profiles SET
          taste_pref = ?, time_pref = ?, location_pref = ?,
          budget = ?, social_pref = ?, interests = ?,
          commute_area = ?, commute_time = ?, transport = ?,
          updated_at = NOW()
        WHERE id = ?
      `, [
        tasteJson, data.time_pref, data.location_pref,
        data.budget, data.social_pref, interestsJson,
        data.commute_area, data.commute_time, data.transport,
        existing[0].id,
      ]);
    } else {
      await conn.query(`
        INSERT INTO profiles (user_id, scene, taste_pref, time_pref, location_pref,
          budget, social_pref, interests, commute_area, commute_time, transport)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, scene,
        tasteJson, data.time_pref, data.location_pref,
        data.budget, data.social_pref, interestsJson,
        data.commute_area, data.commute_time, data.transport,
      ]);
    }

    res.json({ code: 200, msg: '保存成功', data: null });

    // Async: run MiMo profile analysis and store parsed tags (non-blocking)
    const rawPrefs = { ...data, nickname: user.nickname, about_me: user.about_me || '' };
    understandProfile(rawPrefs).then(parsed => {
      if (parsed && parsed.personalityTags) {
        pool.query(
          'UPDATE users SET mimo_profile = ? WHERE feishu_id = ?',
          [JSON.stringify(parsed), user.feishu_id]
        ).catch(() => {});
      }
    }).catch(() => {});
  } catch (err) {
    console.error('保存画像错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  } finally {
    conn.release();
  }
});

module.exports = router;
