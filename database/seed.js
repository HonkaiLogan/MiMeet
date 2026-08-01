/**
 * 种子数据导入
 *
 * 从 frontend/mock-data.js 抽出全局变量,写入 MySQL。
 * 用法: node database/seed.js
 * 幂等: 用户 feishu_id 已存在则跳过;菜单先清空再写。
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pool } = require('./db');

// -------- 加载 mock-data.js --------
// mock-data.js 用的是顶层 const,vm 里 const 不会挂到 sandbox。
// 把整个源码包在一个函数里,末尾 return 我们需要的变量。
const src = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'mock-data.js'), 'utf8');
const wrapped = `(function(){${src}\nreturn { MOCK_USERS, MOCK_PROFILES, MOCK_MENUS, MOCK_OFFERS, MOCK_SQUARE_POSTS };\n})()`;
const { MOCK_USERS, MOCK_PROFILES, MOCK_MENUS, MOCK_OFFERS, MOCK_SQUARE_POSTS } = vm.runInNewContext(wrapped);

// mock 里 uid 到 feishu_id 的稳定映射(种子用)
const feishuIdOf = (uid) => `seed_${uid}`;

async function seedUsers() {
  const conn = await pool.getConnection();
  try {
    for (const uid of Object.keys(MOCK_USERS)) {
      const u = MOCK_USERS[uid];
      await conn.query(`
        INSERT INTO users (feishu_id, nickname, department, join_date, role, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          nickname=VALUES(nickname), department=VALUES(department),
          join_date=VALUES(join_date), role=VALUES(role), avatar_url=VALUES(avatar_url)
      `, [feishuIdOf(uid), u.nickname, u.department, u.joinDate, u.role, u.avatar]);
    }
    const [rows] = await conn.query('SELECT COUNT(*) AS n FROM users');
    console.log(`[users] ${rows[0].n} 条`);
  } finally { conn.release(); }
}

async function seedProfiles() {
  const conn = await pool.getConnection();
  try {
    for (const uid of Object.keys(MOCK_PROFILES)) {
      const p = MOCK_PROFILES[uid];
      const [uRows] = await conn.query('SELECT id FROM users WHERE feishu_id = ?', [feishuIdOf(uid)]);
      if (!uRows.length) continue;
      const userId = uRows[0].id;
      const interestsJson = JSON.stringify(p.interestTags || []);

      if (p.lunchPreference) {
        const lp = p.lunchPreference;
        await conn.query(`
          INSERT INTO profiles (user_id, scene, taste_pref, time_pref, location_pref, budget, social_pref, interests)
          VALUES (?, 'lunch', ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            taste_pref=VALUES(taste_pref), time_pref=VALUES(time_pref),
            location_pref=VALUES(location_pref), budget=VALUES(budget),
            social_pref=VALUES(social_pref), interests=VALUES(interests)
        `, [userId, JSON.stringify(lp.taste || []), lp.time || '',
            lp.location || '', lp.budget || '', lp.socialMode || '', interestsJson]);
      }
      if (p.commutePreference) {
        const cp = p.commutePreference;
        await conn.query(`
          INSERT INTO profiles (user_id, scene, commute_area, commute_time, transport, interests)
          VALUES (?, 'commute', ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            commute_area=VALUES(commute_area), commute_time=VALUES(commute_time),
            transport=VALUES(transport), interests=VALUES(interests)
        `, [userId, cp.homeArea || '', cp.departureTime || '', cp.transportMode || '', interestsJson]);
      }
    }
    const [rows] = await conn.query('SELECT COUNT(*) AS n FROM profiles');
    console.log(`[profiles] ${rows[0].n} 条`);
  } finally { conn.release(); }
}

async function seedMenu() {
  const conn = await pool.getConnection();
  try {
    await conn.query('TRUNCATE TABLE menu');
    const today = new Date().toISOString().slice(0, 10);
    for (const m of MOCK_MENUS) {
      await conn.query(`
        INSERT INTO menu (date, canteen, location, meal_time, dish, tag, price, unit, spicy, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [today, m.canteen, m.location, m.mealTime, m.dish, m.tag,
          m.price, m.unit, m.spicy || 0, m.image || null]);
    }
    const [rows] = await conn.query('SELECT COUNT(*) AS n FROM menu');
    console.log(`[menu] ${rows[0].n} 条`);
  } finally { conn.release(); }
}

async function seedOffers() {
  const conn = await pool.getConnection();
  try {
    await conn.query('TRUNCATE TABLE offers');
    for (const o of MOCK_OFFERS) {
      await conn.query(`
        INSERT INTO offers (title, description, merchant, end_at, status)
        VALUES (?, ?, ?, ?, 'active')
      `, [o.title, o.desc, o.desc, o.expireDate + ' 23:59:59']);
    }
    const [rows] = await conn.query('SELECT COUNT(*) AS n FROM offers');
    console.log(`[offers] ${rows[0].n} 条`);
  } finally { conn.release(); }
}

async function seedSquare() {
  const conn = await pool.getConnection();
  try {
    // 清掉旧的种子广场数据(避免每次跑翻倍),再重导
    await conn.query('DELETE sr FROM square_responses sr JOIN square_posts sp ON sr.post_id = sp.id JOIN users u ON sp.user_id = u.id WHERE u.feishu_id LIKE ?', ['seed_%']);
    await conn.query('DELETE sp FROM square_posts sp JOIN users u ON sp.user_id = u.id WHERE u.feishu_id LIKE ?', ['seed_%']);

    for (const s of MOCK_SQUARE_POSTS) {
      const [uRows] = await conn.query('SELECT id FROM users WHERE feishu_id = ?', [feishuIdOf(s.userId)]);
      if (!uRows.length) continue;
      await conn.query(`
        INSERT INTO square_posts (user_id, scene, content, time_pref, status)
        VALUES (?, ?, ?, ?, 'open')
      `, [uRows[0].id, s.type, JSON.stringify(s.content), s.content?.time || null]);
    }
    const [rows] = await conn.query('SELECT COUNT(*) AS n FROM square_posts');
    console.log(`[square_posts] ${rows[0].n} 条`);
  } finally { conn.release(); }
}

(async () => {
  try {
    await seedUsers();
    await seedProfiles();
    await seedMenu();
    await seedOffers();
    await seedSquare();
    console.log('\n[OK] 种子数据导入完成');
  } catch (e) {
    console.error('种子导入失败:', e);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
