/**
 * 匹配 API
 */
const express = require('express');
const { pool } = require('../../database/db');
const { doMatch, buildFallbackIcebreakerPublic } = require('../services/matching');
const { generateLunchIcebreaker, generateCommuteIcebreaker } = require('../services/mimo');
const router = express.Router();

// 没有真实 session 时用 mock 用户兜底
function getUser(req) {
  return req.session.user || { feishu_id: 'demo_user', nickname: 'Demo用户' };
}

/** 发起匹配，返回 Top3 推荐搭子 */
router.post('/api/match/execute', async (req, res) => {
  const user = getUser(req);
  const { scene, seenUserIds = [] } = req.body;

  try {
    const [userRows] = await pool.query(
      'SELECT id FROM users WHERE feishu_id = ?',
      [user.feishu_id]
    );
    if (userRows.length === 0) {
      return res.json({ code: 400, msg: '请先填写画像', data: null });
    }

    const results = await doMatch(userRows[0].id, scene || 'lunch', seenUserIds);
    res.json({ code: 200, msg: 'ok', data: results });
  } catch (err) {
    console.error('匹配错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 获取破冰话术（异步轮询，match 记录生成后更新） */
router.get('/api/match/icebreaker/:matchId', async (req, res) => {
  const { matchId } = req.params;
  try {
    const [rows] = await pool.query('SELECT icebreaker FROM matches WHERE id = ?', [matchId]);
    if (rows.length === 0) return res.json({ code: 404, msg: '记录不存在', data: null });
    let ice = rows[0].icebreaker;
    if (typeof ice === 'string') {
      try { ice = JSON.parse(ice); } catch { ice = {}; }
    }
    if (!ice || typeof ice !== 'object') ice = {};
    const ready = !!(ice.inviteMessage);
    res.json({ code: 200, msg: 'ok', data: { ready, ...ice } });
  } catch (err) {
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 重新生成破冰话术（用户点"换一个"时调用） */
router.post('/api/match/icebreaker/:matchId/regenerate', async (req, res) => {
  const { matchId } = req.params;
  try {
    const [matchRows] = await pool.query(`
      SELECT m.*,
        ua.department AS a_dept, ua.about_me AS a_about,
        ub.department AS b_dept, ub.about_me AS b_about,
        pa.interests AS a_interests, pa.taste_pref AS a_taste, pa.time_pref AS a_time, pa.commute_time AS a_commute_time,
        pa.commute_area AS a_area, pa.transport AS a_transport, pa.social_pref AS a_social,
        pb.interests AS b_interests, pb.taste_pref AS b_taste, pb.time_pref AS b_time, pb.commute_time AS b_commute_time,
        pb.commute_area AS b_area, pb.transport AS b_transport, pb.social_pref AS b_social,
        ua.nickname AS a_nickname, ub.nickname AS b_nickname
      FROM matches m
      JOIN users ua ON m.user_a_id = ua.id
      JOIN users ub ON m.user_b_id = ub.id
      JOIN profiles pa ON pa.user_id = m.user_a_id AND pa.scene = m.scene
      JOIN profiles pb ON pb.user_id = m.user_b_id AND pb.scene = m.scene
      WHERE m.id = ?
    `, [matchId]);

    if (matchRows.length === 0) return res.json({ code: 404, msg: '记录不存在', data: null });

    const m = matchRows[0];
    const profileA = {
      nickname: m.a_nickname, department: m.a_dept, about_me: m.a_about,
      interests: m.a_interests, taste_pref: m.a_taste, time_pref: m.a_time, commute_time: m.a_commute_time,
      commute_area: m.a_area, transport: m.a_transport, social_pref: m.a_social,
    };
    const profileB = {
      nickname: m.b_nickname, department: m.b_dept, about_me: m.b_about,
      interests: m.b_interests, taste_pref: m.b_taste, time_pref: m.b_time, commute_time: m.b_commute_time,
      commute_area: m.b_area, transport: m.b_transport, social_pref: m.b_social,
    };

    const fallback = buildFallbackIcebreakerPublic(profileA, profileB, {}, m.scene);
    const iceFn = m.scene === 'commute' ? generateCommuteIcebreaker : generateLunchIcebreaker;
    const timeout = new Promise(resolve => setTimeout(() => resolve(null), 20000));
    let ice = await Promise.race([iceFn(profileA, profileB), timeout])
      .catch(() => null);
    if (!ice || !ice.inviteMessage || ice.inviteMessage === '嘿，要不要一起？') ice = fallback;

    await pool.query('UPDATE matches SET icebreaker = ? WHERE id = ?', [JSON.stringify(ice), matchId]);
    res.json({ code: 200, msg: 'ok', data: ice });
  } catch (err) {
    console.error('重新生成失败:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});


router.post('/api/match/feedback', async (req, res) => {
  const user = getUser(req);
  const { matchId, rating } = req.body;
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

    const [matchRows] = await pool.query('SELECT * FROM matches WHERE id = ?', [matchId]);
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
  const user = getUser(req);

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
