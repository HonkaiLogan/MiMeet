/**
 * 搭子广场 API
 */
const express = require('express');
const { pool } = require('../../database/db');
const { sendMessage, buildInviteCard } = require('../services/feishu');
const router = express.Router();

const MOCK_USER = { feishu_id: 'demo_user', nickname: 'Demo用户' };
function getUser(req) { return req.session.user || MOCK_USER; }

const MOCK_PLAZA = [
  { id: 1, user_id: 2,  nickname: '吴同学',   scene: 'lunch',   content: '12:30 想找清淡饭搭子，园区食堂', time_pref: '12:30', status: 'open', created_at: new Date(Date.now() - 3*60*1000) },
  { id: 2, user_id: 5,  nickname: '黄同学',   scene: 'commute', content: '明早8:30 回龙观出发，顺路拼车', time_pref: '08:30', status: 'open', created_at: new Date(Date.now() - 10*60*1000) },
  { id: 3, user_id: 7,  nickname: '周同学',   scene: 'lunch',   content: '12:00 楼下商圈，吃点好的有人吗', time_pref: '12:00', status: 'open', created_at: new Date(Date.now() - 25*60*1000) },
  { id: 4, user_id: 11, nickname: '刘同学',   scene: 'commute', content: '9:00 五道口地铁，聊AI同行', time_pref: '09:00', status: 'open', created_at: new Date(Date.now() - 40*60*1000) },
  { id: 5, user_id: 14, nickname: '冯同学',   scene: 'lunch',   content: '12:15 园区食堂，找安静吃饭的搭子', time_pref: '12:15', status: 'open', created_at: new Date(Date.now() - 60*60*1000) },
  { id: 6, user_id: 17, nickname: '杨同学',   scene: 'commute', content: '8:30 上地出发打车，分摊费用', time_pref: '08:30', status: 'open', created_at: new Date(Date.now() - 2*60*60*1000) },
  { id: 7, user_id: 21, nickname: '罗同学',   scene: 'lunch',   content: '12:00 想吃辣，有同好吗', time_pref: '12:00', status: 'open', created_at: new Date(Date.now() - 3*60*60*1000) },
  { id: 8, user_id: 25, nickname: '邓同学',   scene: 'commute', content: '9:00 望京地铁，聊产品/AI', time_pref: '09:00', status: 'open', created_at: new Date(Date.now() - 4*60*60*1000) },
];

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
    // 数据库无数据时返回 mock
    const data = posts.length > 0 ? posts : MOCK_PLAZA;
    res.json({ code: 200, msg: 'ok', data });
  } catch (err) {
    console.error('获取广场列表错误:', err.message);
    res.json({ code: 200, msg: 'ok', data: MOCK_PLAZA });
  }
});

/** 发布搭子需求 */
router.post('/api/plaza/publish', async (req, res) => {
  const user = getUser(req);

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

/** 响应搭子需求 */
router.post('/api/plaza/respond', async (req, res) => {
  const user = getUser(req);

  const { postId } = req.body;
  if (!postId) return res.json({ code: 400, msg: '缺少帖子 ID', data: null });

  try {
    // 查找帖子和作者
    const [posts] = await pool.query(`
      SELECT sp.*, u.feishu_id, u.nickname AS author_name
      FROM square_posts sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.id = ?
    `, [postId]);

    if (posts.length === 0) {
      return res.json({ code: 400, msg: '帖子不存在', data: null });
    }

    const post = posts[0];
    const sceneLabel = post.scene === 'lunch' ? '🍜 午餐拼桌' : '🚗 通勤拼车';
    const card = buildInviteCard(user.nickname, post.scene, `我对你发布的"${sceneLabel}"需求感兴趣！`);

    await sendMessage(post.feishu_id, card);

    res.json({ code: 200, msg: '已响应，已通知对方', data: null });
  } catch (err) {
    console.error('响应搭子错误:', err.message);
    res.json({ code: 500, msg: '服务器异常', data: null });
  }
});

module.exports = router;
