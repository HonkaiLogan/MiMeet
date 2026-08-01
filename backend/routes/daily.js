/**
 * 每日推荐 API
 *
 * 前端契约:
 *   { recommendation, funTag, suggestedBuddy:{uid,nickname,matchScore,reason},
 *     suggestedRestaurant:{name,distance,avgPrice}, suggestedDishes:[dishId] }
 *
 * 缓存策略: 同一用户同一天只调一次 MiMo,复用 daily_recommend 表
 */
const express = require('express');
const { pool } = require('../../database/mock-db');
const router = express.Router();

const FALLBACK_POOL = [
  {
    recommendation: '今日适合主动出击!推荐找一个同样喜欢川菜的饭搭子,中午一起去吃热乎乎的麻辣香锅。',
    funTag: '🌶️ 今日宜吃辣',
    suggestedBuddy: { uid: 'u006', nickname: '赵同学', matchScore: 88, reason: '都喜欢川菜,兴趣标签相似' },
    suggestedRestaurant: { name: '三楼食堂麻辣香锅', distance: '步行2分钟', avgPrice: '30元' },
    suggestedDishes: [21, 4, 12],
  },
  {
    recommendation: '今天适合轻松社交,找一个喜欢轻食的搭子,一起聊聊最近的 AI 工具。',
    funTag: '🥗 今日宜轻食',
    suggestedBuddy: { uid: 'u004', nickname: '王同学', matchScore: 85, reason: '都喜欢轻食,都是校招生' },
    suggestedRestaurant: { name: '二楼轻食区', distance: '步行3分钟', avgPrice: '25元' },
    suggestedDishes: [15, 16, 17],
  },
  {
    recommendation: '今天适合认识新朋友,找一个不同部门的搭子,拓宽视野。',
    funTag: '👋 今日宜社交',
    suggestedBuddy: { uid: 'u007', nickname: '周同学', matchScore: 82, reason: '不同部门,都有旅行兴趣' },
    suggestedRestaurant: { name: '一楼食堂', distance: '步行1分钟', avgPrice: '18元' },
    suggestedDishes: [6, 1, 9],
  },
];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

router.get('/api/daily/recommend', async (req, res) => {
  const user = req.session.user;

  try {
    // 命中当日缓存
    if (user) {
      const [rows] = await pool.query(`
        SELECT dr.content FROM daily_recommend dr
        JOIN users u ON dr.user_id = u.id
        WHERE u.feishu_id = ? AND dr.date = ?
      `, [user.feishu_id, todayStr()]);
      if (rows.length && rows[0].content) {
        const cached = typeof rows[0].content === 'string' ? JSON.parse(rows[0].content) : rows[0].content;
        return res.json({ code: 200, msg: 'ok', data: cached });
      }
    }

    // TODO: 接入 MiMo 生成个性化推荐;当前从 FALLBACK_POOL 里挑一条
    const pick = FALLBACK_POOL[Math.floor(Math.random() * FALLBACK_POOL.length)];
    const data = { ...pick };

    // 写缓存
    if (user) {
      try {
        const [uRows] = await pool.query('SELECT id FROM users WHERE feishu_id = ?', [user.feishu_id]);
        if (uRows.length) {
          await pool.query(`
            INSERT INTO daily_recommend (user_id, date, content) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE content = VALUES(content)
          `, [uRows[0].id, todayStr(), JSON.stringify(data)]);
        }
      } catch (e) {
        console.warn('写入每日推荐缓存失败(非致命):', e.message);
      }
    }

    res.json({ code: 200, msg: 'ok', data });
  } catch (err) {
    console.error('每日推荐错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

module.exports = router;
