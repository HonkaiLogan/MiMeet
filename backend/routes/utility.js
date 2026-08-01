/**
 * 食堂菜单 / 优惠 / 路线 API
 *
 * 前端契约:
 *   GET /menu?tag=xxx  → { date, menus:[{id,canteen,location,dish,tag,price,unit,spicy,mealTime,image}] }
 *   GET /offers        → { offers:[{id,title,desc,expireDate,type}] }
 *   GET /route         → { distance, duration, cost }
 */
const express = require('express');
const { pool } = require('../../database/mock-db');
const router = express.Router();

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
  // TODO: 接入地图 API;当前给一份合理占位
  const { origin, destination } = req.query;
  res.json({
    code: 200, msg: 'ok',
    data: {
      origin: origin || '',
      destination: destination || '',
      distance: '5.2km',
      duration: '15分钟',
      cost: '约18元',
    },
  });
});

module.exports = router;
