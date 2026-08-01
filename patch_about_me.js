/**
 * 给所有用户补充 about_me 字段
 */
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost', port: 3306, user: 'root', password: '', database: 'mimeet'
});

const ABOUT_ME_LIST = [
  '喜欢AI和产品设计，平时爱刷技术博客，INTJ',
  '热爱旅行和摄影，喜欢尝试新餐厅，ENFP',
  '游戏玩家，技术宅，喜欢研究新技术，ISTJ',
  '设计师，追求极简美学，喜欢听独立音乐，INFP',
  '运营出身，热爱美食，爱养猫，ESFJ',
  '后端工程师，喜欢打球，周末爱爬山，INTP',
  '产品经理，喜欢电影和话剧，ENFJ',
  'UI设计师，喜欢画画和手工，ISFP',
  '数据分析，爱看纪录片，喜欢宠物，ESFP',
  '前端开发，喜欢骑行，爱玩桌游，ENTJ',
  '喜欢阅读和写作，偶尔跑步，INFJ',
  '算法工程师，AI爱好者，喜欢下棋，ENTP',
  '技术出身转产品，喜欢游戏和科幻小说，ISTP',
  '运营，喜欢旅行和美食探店，ISFJ',
  '产品设计，爱跑步健身，喜欢摇滚乐，ENFP',
  '前端工程师，喜欢骑行和冥想，INFP',
  '产品经理，AI产品方向，喜欢看电影，ENTJ',
  '后端架构，游戏玩家，喜欢健身，INTJ',
  '运营，喜欢宠物和烘焙，爱逛展览，ESFJ',
  '全栈工程师，喜欢音乐和旅行，ISTJ',
  '运营经理，电影爱好者，AI关注者，ENFJ',
  '业务运营，喜欢游戏和AI应用，ESTP',
  '产品设计，喜欢日料和旅行，爱宠物，ISFP',
  '算法工程师，喜欢骑行和运动，INTP',
  '产品经理，旅行爱好者，喜欢看书，ENFP',
  '技术研发，游戏玩家，AI爱好者，INTJ',
  '运营，爱美食和旅行，喜欢健身，ESFJ',
  '产品，音乐爱好者，爱看电影，ENFJ',
  '设计，旅行控，喜欢听爵士乐，INFP',
  '研发，喜欢运动和AI，爱读科技新闻，ISTP',
  '运营，AI产品爱好者，喜欢宠物，ENFP',
  '后端，游戏玩家，爱健身，ISTJ',
  '运营，美食探店达人，旅行爱好者，ESFP',
  '产品，AI方向，电影迷，ENTP',
  '技术，游戏宅，AI爱好者，INTJ',
  '设计师，喜欢音乐和养猫，ISFP',
  '研发，运动爱好者，喜欢自驾游，INTP',
  '运营，电影和旅行爱好者，ENFJ',
  '产品，AI爱好者，游戏玩家，ENTJ',
  '技术，喜欢运动和音乐，ISTP',
  '运营，AI关注者，喜欢宠物，ESFJ',
  '研发，游戏玩家，AI爱好者，INTJ',
  '运营，旅行和美食爱好者，ENFP',
  '设计，音乐和电影爱好者，ISFP',
  '产品，AI和旅行爱好者，ENTP',
  '技术，游戏和AI爱好者，INTP',
  '研发，运动和电影爱好者，ISTJ',
  '技术，喜欢骑行和AI，ISTP',
  '运营，喜欢美食和AI，ESFP',
  '产品，朝阳区通勤，喜欢旅行，INFJ',
  '技术，通州通勤，AI爱好者，INTJ',
  '技术，亦庄通勤，游戏玩家，ENTP',
  '研发，西二旗通勤，喜欢打车聊天，INTP',
  '技术，海淀通勤，喜欢骑行，ISTJ',
  '运营，回龙观通勤，顺风车爱好者，ENFP',
  '运营，回龙观通勤，喜欢聊AI，ESFJ',
  '运营，通州通勤，喜欢听播客，ISFP',
  '运营，亦庄通勤，喜欢看电影，ESFJ',
  '运营，顺义通勤，自驾上班，ENFP',
];

async function patch() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT id, feishu_id FROM users ORDER BY id');
    for (let i = 0; i < rows.length; i++) {
      const about = ABOUT_ME_LIST[i % ABOUT_ME_LIST.length];
      await conn.query('UPDATE users SET about_me = ? WHERE id = ?', [about, rows[i].id]);
    }
    console.log(`✅ 更新了 ${rows.length} 个用户的 about_me`);
  } finally {
    conn.release();
    await pool.end();
  }
}

patch().catch(err => { console.error('❌', err.message); process.exit(1); });
