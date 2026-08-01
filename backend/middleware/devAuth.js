/**
 * 开发环境登录旁路
 *
 * 在 request 里出现 ?dev=<uid> 或 header X-Dev-User: <uid> 时,
 * 从数据库查出对应种子用户(feishu_id = seed_<uid>),注入到 req.session.user。
 *
 * 仅当 NODE_ENV !== 'production' 时生效,并要求 .env 里 ALLOW_DEV_AUTH=1。
 * 前端联调用: fetch('/api/user/getProfile?dev=u001')
 */
const { pool } = require('../../database/mock-db');

const cache = new Map(); // uid -> {feishu_id, nickname, avatar_url, department, seat_number}

async function loadDevUser(uid) {
  if (cache.has(uid)) return cache.get(uid);
  const feishuId = `seed_${uid}`;
  const [rows] = await pool.query(
    'SELECT feishu_id, nickname, avatar_url, department, seat_number FROM users WHERE feishu_id = ?',
    [feishuId]
  );
  if (!rows.length) return null;
  cache.set(uid, rows[0]);
  return rows[0];
}

function devAuthMiddleware() {
  const enabled =
    process.env.NODE_ENV !== 'production' &&
    (process.env.ALLOW_DEV_AUTH === '1' || !process.env.NODE_ENV);

  return async (req, res, next) => {
    if (!enabled) return next();

    const uid = req.query.dev || req.get('X-Dev-User');

    // 显式带 dev 参数时,永远覆盖(支持在浏览器里切换用户)
    if (uid) {
      try {
        const u = await loadDevUser(String(uid));
        if (u) {
          req.session.user = u;
          res.set('X-Dev-Auth', uid);
        }
      } catch (e) {
        console.warn('devAuth 注入失败:', e.message);
      }
      return next();
    }

    // 没带 dev 参数,已有 session 就用 session,没有就走真实登录流程(会 401)
    next();
  };
}

module.exports = { devAuthMiddleware };
