/**
 * 匹配 API
 *
 * 前端契约:
 *   POST /execute  → { recommendations: [{ uid,name,dept,score,tags[],reason, ... }] }
 *   POST /feedback → 接 { matchId, rating(1-5) }
 *   GET  /history  → { total, list:[{ id,matchedUserId,nickname,type,matchScore,status,createdAt }] } 分页
 */
const express = require('express');
const { pool } = require('../../database/mock-db');
const { doMatch } = require('../services/matching');
const router = express.Router();

function parseJSON(val, fallback) {
  if (!val) return fallback;
  if (Array.isArray(val) || typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

/** 把 matching.js 输出的一条 candidate 转成前端字段 */
function toRecommendation(r, scene) {
  const tags = parseJSON(r.common_tags, r.tags || []);
  const rec = {
    uid: String(r.candidate_id ?? r.user_id ?? ''),
    matchId: r.match_id || null,
    name: r.nickname || '',
    dept: r.department || '',
    avatar: r.avatar_url || '',
    score: r.score || r.rule_score || 0,
    tags: Array.isArray(tags) ? tags : [],
    reason: r.reason || '',
  };
  if (scene === 'commute') {
    // matching.js 目前没吐路线字段,先给占位;后续 MiMo 精排里补
    rec.overlap = r.overlap || '';
    rec.saving = r.saving || '';
    rec.time = r.time || '';
    if (r.route) rec.route = r.route;
  }
  return rec;
}

/** 发起匹配,返回 Top3 推荐 */
router.post('/api/match/execute', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  const scene = req.body?.scene || 'lunch';

  try {
    const [userRows] = await pool.query('SELECT id FROM users WHERE feishu_id = ?', [user.feishu_id]);
    if (userRows.length === 0) return res.json({ code: 400, msg: '请先填写画像', data: null });

    const results = await doMatch(userRows[0].id, scene);
    res.json({
      code: 200, msg: 'ok',
      data: { recommendations: results.map(r => toRecommendation(r, scene)) },
    });
  } catch (err) {
    console.error('匹配错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 匹配反馈: rating 是 1-5 整数 */
router.post('/api/match/feedback', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  const { matchId, rating } = req.body || {};
  const r = parseInt(rating, 10);
  if (!matchId || !(r >= 1 && r <= 5)) {
    return res.json({ code: 400, msg: '参数错误(rating 需 1-5)', data: null });
  }

  try {
    const [userRows] = await pool.query('SELECT id FROM users WHERE feishu_id = ?', [user.feishu_id]);
    if (userRows.length === 0) return res.json({ code: 400, msg: '用户不存在', data: null });
    const userId = userRows[0].id;

    const [matchRows] = await pool.query('SELECT * FROM matches WHERE id = ?', [matchId]);
    if (matchRows.length === 0) return res.json({ code: 400, msg: '匹配记录不存在', data: null });

    const m = matchRows[0];
    if (m.user_a_id === userId) {
      await pool.query('UPDATE matches SET feedback_a = ? WHERE id = ?', [r, matchId]);
    } else if (m.user_b_id === userId) {
      await pool.query('UPDATE matches SET feedback_b = ? WHERE id = ?', [r, matchId]);
    } else {
      return res.json({ code: 400, msg: '无权操作此匹配记录', data: null });
    }
    res.json({ code: 200, msg: '反馈已记录', data: { success: true } });
  } catch (err) {
    console.error('反馈错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 历史匹配记录,支持分页 */
router.get('/api/match/history', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const size = Math.min(50, Math.max(1, parseInt(req.query.pageSize || '10', 10)));
  const offset = (page - 1) * size;

  try {
    const [userRows] = await pool.query('SELECT id FROM users WHERE feishu_id = ?', [user.feishu_id]);
    if (userRows.length === 0) return res.json({ code: 200, msg: 'ok', data: { total: 0, list: [] } });
    const userId = userRows[0].id;

    const [totalRows] = await pool.query(
      'SELECT COUNT(*) AS n FROM matches WHERE user_a_id = ? OR user_b_id = ?',
      [userId, userId]
    );
    const [rows] = await pool.query(`
      SELECT m.id, m.scene, m.score, m.status, m.created_at, m.feedback_a, m.feedback_b,
        m.user_a_id,
        CASE WHEN m.user_a_id = ? THEN m.user_b_id ELSE m.user_a_id END AS partner_id,
        CASE WHEN m.user_a_id = ? THEN ub.nickname ELSE ua.nickname END AS partner_name
      FROM matches m
      JOIN users ua ON m.user_a_id = ua.id
      JOIN users ub ON m.user_b_id = ub.id
      WHERE m.user_a_id = ? OR m.user_b_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, userId, userId, userId, size, offset]);

    // 前端 filter(r => r.status === 'accepted') 语义映射:
    //   sent / matched / 已有己方反馈 → accepted
    //   declined → declined
    //   其他 → pending
    const deriveStatus = (r) => {
      if (r.status === 'declined') return 'declined';
      if (r.status === 'sent' || r.status === 'matched') return 'accepted';
      const mine = r.user_a_id === userId ? r.feedback_a : r.feedback_b;
      if (mine != null) return 'accepted';
      return 'pending';
    };

    res.json({
      code: 200, msg: 'ok',
      data: {
        total: totalRows[0].n,
        list: rows.map(r => ({
          id: String(r.id),
          matchedUserId: String(r.partner_id),
          nickname: r.partner_name,
          type: r.scene,
          matchScore: r.score,
          status: deriveStatus(r),
          rawStatus: r.status || 'pending',
          createdAt: r.created_at,
        })),
      },
    });
  } catch (err) {
    console.error('历史记录错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

module.exports = router;
