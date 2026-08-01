/**
 * 搭子广场 API
 *
 * 前端契约:
 *   GET /list?type=all|lunch|commute|weekend&page&pageSize
 *     → { total, list:[{ id,userId,nickname,type,publishTime,respondCount,content:{...} }] }
 *   POST /publish  接 { scene|type, content:{...嵌套}, time_pref? } — content 存 JSON
 *   POST /respond  接 { squareId } — 内部映射到 postId
 */
const express = require('express');
const { pool } = require('../../database/mock-db');
const { sendMessage, buildInviteCard } = require('../services/feishu');
const router = express.Router();

function parseJSON(val, fallback) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

function relativeTime(dt) {
  const diff = Math.max(0, Date.now() - new Date(dt).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return '刚刚';
  if (m < 60) return `${m}分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}小时前`;
  const d = Math.floor(h / 24);
  return `${d}天前`;
}

/** 获取广场列表 */
router.get('/api/plaza/list', async (req, res) => {
  const type = (req.query.type || 'all').toString();
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const size = Math.min(50, Math.max(1, parseInt(req.query.pageSize || '10', 10)));
  const offset = (page - 1) * size;

  const whereScene = type === 'all' ? '' : 'AND sp.scene = ?';
  const paramsCount = type === 'all' ? [] : [type];
  const paramsList = type === 'all' ? [size, offset] : [type, size, offset];

  try {
    const [totalRows] = await pool.query(
      `SELECT COUNT(*) AS n FROM square_posts sp WHERE sp.status = 'open' ${whereScene}`,
      paramsCount
    );
    const [posts] = await pool.query(`
      SELECT sp.id, sp.user_id, sp.scene, sp.content, sp.time_pref, sp.created_at,
             u.nickname, u.avatar_url,
             (SELECT COUNT(*) FROM square_responses sr WHERE sr.post_id = sp.id) AS respond_count
      FROM square_posts sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.status = 'open' ${whereScene}
      ORDER BY sp.created_at DESC
      LIMIT ? OFFSET ?
    `, paramsList);

    res.json({
      code: 200, msg: 'ok',
      data: {
        total: totalRows[0].n,
        list: posts.map(p => ({
          id: String(p.id),
          userId: String(p.user_id),
          nickname: p.nickname,
          avatar: p.avatar_url || '',
          type: p.scene,
          publishTime: relativeTime(p.created_at),
          respondCount: Number(p.respond_count) || 0,
          content: parseJSON(p.content, {}),
        })),
      },
    });
  } catch (err) {
    console.error('获取广场列表错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 发布搭子需求 */
router.post('/api/plaza/publish', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  const { scene, type, content, time_pref, timePref } = req.body || {};
  const finalScene = scene || type || 'lunch';
  const finalTime = time_pref || timePref || null;

  if (!content || typeof content !== 'object') {
    return res.json({ code: 400, msg: 'content 必须是对象', data: null });
  }

  try {
    const [userRows] = await pool.query('SELECT id FROM users WHERE feishu_id = ?', [user.feishu_id]);
    if (userRows.length === 0) return res.json({ code: 400, msg: '请先登录', data: null });

    const [result] = await pool.query(
      'INSERT INTO square_posts (user_id, scene, content, time_pref) VALUES (?, ?, ?, ?)',
      [userRows[0].id, finalScene, JSON.stringify(content), finalTime]
    );

    res.json({ code: 200, msg: '发布成功', data: { id: String(result.insertId) } });
  } catch (err) {
    console.error('发布需求错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

/** 响应搭子需求 */
router.post('/api/plaza/respond', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.json({ code: 401, msg: '未登录', data: null });

  const { postId, squareId, message } = req.body || {};
  const finalId = postId || squareId;
  if (!finalId) return res.json({ code: 400, msg: '缺少帖子 ID', data: null });

  try {
    const [posts] = await pool.query(`
      SELECT sp.*, u.feishu_id, u.nickname AS author_name
      FROM square_posts sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.id = ?
    `, [finalId]);
    if (posts.length === 0) return res.json({ code: 400, msg: '帖子不存在', data: null });
    const post = posts[0];

    const [meRows] = await pool.query('SELECT id FROM users WHERE feishu_id = ?', [user.feishu_id]);
    if (meRows.length === 0) return res.json({ code: 400, msg: '当前用户不存在', data: null });

    // 记录响应 (UNIQUE KEY 防重复)
    try {
      await pool.query(
        'INSERT INTO square_responses (post_id, user_id, message) VALUES (?, ?, ?)',
        [post.id, meRows[0].id, message || '']
      );
    } catch (e) {
      if (!/Duplicate/i.test(e.message)) throw e;
    }

    // 发飞书邀请卡片(未配置 feishu 时静默失败)
    try {
      const sceneLabel = post.scene === 'lunch' ? '🍜 午餐拼桌'
                     : post.scene === 'commute' ? '🚗 通勤拼车'
                     : '📢 搭子需求';
      const card = buildInviteCard(user.nickname, post.scene, `我对你发布的"${sceneLabel}"需求感兴趣!`);
      await sendMessage(post.feishu_id, card);
    } catch (e) {
      console.warn('发送飞书通知失败(非致命):', e.message);
    }

    res.json({ code: 200, msg: '已响应', data: { matchId: 'm' + post.id } });
  } catch (err) {
    console.error('响应搭子错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

module.exports = router;
