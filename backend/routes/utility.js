/**
 * 食堂菜单 / 优惠 / 路线 / Agent 推荐 API
 */
const express = require('express');
const { pool } = require('../../database');
const router = express.Router();

const PYTHON_SVC = process.env.PYTHON_SVC_URL || 'http://localhost:8000';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseArr(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v); } catch { return []; }
}

router.get('/api/food/menu', async (req, res) => {
  const tag = req.query.tag && req.query.tag !== 'all' ? String(req.query.tag) : null;
  try {
    const where = tag ? 'WHERE tag = ?' : '';
    const params = tag ? [tag] : [];
    const [rows] = await pool.query(`
      SELECT id, canteen, location, meal_time AS mealTime, dish, tag, price, unit, spicy, image
      FROM menu ${where}
      ORDER BY canteen, price DESC
    `, params);
    res.json({ code: 200, msg: 'ok', data: { date: todayStr(), menus: rows } });
  } catch (err) {
    console.error('菜单错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

router.get('/api/food/offers', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, title, description AS \`desc\`, merchant, discount,
             DATE_FORMAT(end_at, '%Y-%m-%d') AS expireDate, status AS type
      FROM offers
      WHERE status = 'active'
      ORDER BY end_at ASC
    `);
    res.json({ code: 200, msg: 'ok', data: { offers: rows } });
  } catch (err) {
    console.error('优惠错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

router.get('/api/food/route', (req, res) => {
  const { origin, destination } = req.query;
  res.json({
    code: 200, msg: 'ok',
    data: { origin: origin || '', destination: destination || '', distance: '5.2km', duration: '15分钟', cost: '约18元' },
  });
});

/** Agent 个性化推荐 — 从 DB 取用户偏好，转发 Python 服务 */
router.post('/api/agent/recommend', async (req, res) => {
  const user = req.session.user || { feishu_id: 'demo_user' };
  const { type } = req.body; // "food" | "offers"

  try {
    // 查用户偏好
    const [uRows] = await pool.query('SELECT id FROM users WHERE feishu_id = ?', [user.feishu_id]);
    const userId = uRows.length ? uRows[0].id : null;

    let tastePref = [], budget = '', commuteArea = '', mealTime = '';
    if (userId) {
      const [pRows] = await pool.query(
        'SELECT taste_pref, budget, commute_area, time_pref FROM profiles WHERE user_id = ? AND scene = ?',
        [userId, 'lunch']
      );
      if (pRows.length) {
        tastePref  = parseArr(pRows[0].taste_pref);
        budget     = pRows[0].budget || '';
        mealTime   = pRows[0].time_pref ? (parseInt(pRows[0].time_pref) >= 15 ? '晚餐' : '午餐') : '';
      }
      const [cRows] = await pool.query(
        'SELECT commute_area FROM profiles WHERE user_id = ? AND scene = ?',
        [userId, 'commute']
      );
      if (cRows.length) commuteArea = cRows[0].commute_area || '';
    }

    let pyBody, pyPath;
    if (type === 'offers') {
      pyPath = '/agent/offers';
      pyBody = { commute_area: commuteArea };
    } else {
      pyPath = '/agent/food';
      pyBody = { taste_pref: tastePref, budget, meal_time: mealTime };
    }

    const pyRes = await fetch(`${PYTHON_SVC}${pyPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pyBody),
      signal: AbortSignal.timeout(20000),
    });
    const pyJson = await pyRes.json();
    res.json(pyJson);
  } catch (err) {
    console.error('agent/recommend 错误:', err.message);
    res.json({ code: 500, msg: 'Python 服务暂不可用', data: null });
  }
});

/** Agent 优惠多轮对话 */
router.post('/api/agent/offers-chat', async (req, res) => {
  const user = req.session.user || { feishu_id: 'demo_user' };
  const { messages, is_initial } = req.body;

  try {
    const [uRows] = await pool.query(
      'SELECT id, nickname, department FROM users WHERE feishu_id = ?',
      [user.feishu_id]
    );
    const userId = uRows.length ? uRows[0].id : null;
    const nickname = uRows.length ? uRows[0].nickname : '';
    const department = uRows.length ? uRows[0].department : '';

    let commuteArea = '', interests = [], tastePref = [], budget = '';
    if (userId) {
      const [pRows] = await pool.query(
        'SELECT taste_pref, budget, interests FROM profiles WHERE user_id = ? AND scene = ?',
        [userId, 'lunch']
      );
      if (pRows.length) {
        tastePref  = parseArr(pRows[0].taste_pref);
        budget     = pRows[0].budget || '';
        interests  = parseArr(pRows[0].interests);
      }
      const [cRows] = await pool.query(
        'SELECT commute_area FROM profiles WHERE user_id = ? AND scene = ?',
        [userId, 'commute']
      );
      if (cRows.length) commuteArea = cRows[0].commute_area || '';
    }

    const userProfile = { nickname, department, commute_area: commuteArea, interests, taste_pref: tastePref, budget };

    const pyRes = await fetch(`${PYTHON_SVC}/agent/offers-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, user_profile: userProfile, is_initial: !!is_initial }),
      signal: AbortSignal.timeout(20000),
    });
    const pyJson = await pyRes.json();
    res.json(pyJson);
  } catch (err) {
    console.error('agent/offers-chat 错误:', err.message);
    res.json({ code: 500, msg: 'Python 服务暂不可用', data: null });
  }
});

module.exports = router;
