/**
 * 用户画像 API
 *
 * 前端契约:
 *   GET  返回 { lunchPreference:{time,taste,budget,location,socialMode},
 *              commutePreference:{homeArea,departureTime,transportMode},
 *              interestTags[], mbti, constellation }
 *   POST 接受同样的嵌套结构,按场景拆行写入 profiles(user_id,scene 唯一)
 */
const express = require('express');
const { pool } = require('../../database/mock-db');
const router = express.Router();

function parseJSON(val, fallback) {
  if (!val) return fallback;
  if (Array.isArray(val) || typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

function rowsToProfile(rows) {
  const out = {
    lunchPreference: null,
    commutePreference: null,
    interestTags: [],
  };
  for (const r of rows) {
    const interests = parseJSON(r.interests, []);
    if (interests.length && !out.interestTags.length) out.interestTags = interests;

    if (r.scene === 'lunch') {
      out.lunchPreference = {
        time: r.time_pref || '',
        taste: parseJSON(r.taste_pref, []),
        budget: r.budget || '',
        location: r.location_pref || '',
        socialMode: r.social_pref || '',
      };
    } else if (r.scene === 'commute') {
      out.commutePreference = {
        homeArea: r.commute_area || '',
        departureTime: r.commute_time || '',
        transportMode: r.transport || '',
      };
    }
  }
  return out;
}

/** 获取当前用户画像 */
router.get('/api/user/getProfile', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  try {
    const [rows] = await pool.query(`
      SELECT p.* FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE u.feishu_id = ?
    `, [user.feishu_id]);

    if (rows.length === 0) return res.json({ code: 200, msg: 'ok', data: null });
    res.json({ code: 200, msg: 'ok', data: rowsToProfile(rows) });
  } catch (err) {
    console.error('获取画像错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 保存用户画像:接嵌套结构,拆两行 upsert */
router.post('/api/user/saveProfile', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  const { lunchPreference, commutePreference, interestTags } = req.body || {};
  const conn = await pool.getConnection();

  try {
    await conn.query(
      'INSERT IGNORE INTO users (feishu_id, nickname, avatar_url) VALUES (?, ?, ?)',
      [user.feishu_id, user.nickname, user.avatar_url]
    );
    const [userRows] = await conn.query('SELECT id FROM users WHERE feishu_id = ?', [user.feishu_id]);
    const userId = userRows[0].id;
    const interestsJson = JSON.stringify(Array.isArray(interestTags) ? interestTags : []);

    if (lunchPreference) {
      await conn.query(`
        INSERT INTO profiles (user_id, scene, taste_pref, time_pref, location_pref, budget, social_pref, interests)
        VALUES (?, 'lunch', ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          taste_pref=VALUES(taste_pref), time_pref=VALUES(time_pref),
          location_pref=VALUES(location_pref), budget=VALUES(budget),
          social_pref=VALUES(social_pref), interests=VALUES(interests)
      `, [
        userId,
        JSON.stringify(lunchPreference.taste || []),
        lunchPreference.time || '',
        lunchPreference.location || '',
        lunchPreference.budget || '',
        lunchPreference.socialMode || '',
        interestsJson,
      ]);
    }

    if (commutePreference) {
      await conn.query(`
        INSERT INTO profiles (user_id, scene, commute_area, commute_time, transport, interests)
        VALUES (?, 'commute', ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          commute_area=VALUES(commute_area), commute_time=VALUES(commute_time),
          transport=VALUES(transport), interests=VALUES(interests)
      `, [
        userId,
        commutePreference.homeArea || '',
        commutePreference.departureTime || '',
        commutePreference.transportMode || '',
        interestsJson,
      ]);
    }

    res.json({ code: 200, msg: '保存成功', data: { userId } });
  } catch (err) {
    console.error('保存画像错误:', err.message, err.stack);
    res.json({ code: 500, msg: '服务器异常: ' + err.message, data: null });
  } finally {
    conn.release();
  }
});

module.exports = router;
