/**
 * 定时任务
 * - 广场需求过期自动隐藏（超过24小时）
 * - 菜单同步（TODO: 待接入米宴接口）
 */
const schedule = require('node-schedule');
const { pool } = require('../database/db');

function startScheduler() {
  // 每小时检查一次，将超过24小时的广场帖子标记为 expired
  schedule.scheduleJob('0 * * * *', async () => {
    try {
      const [result] = await pool.query(`
        UPDATE square_posts
        SET status = 'expired'
        WHERE status = 'open'
          AND created_at < NOW() - INTERVAL 24 HOUR
      `);
      if (result.affectedRows > 0) {
        console.log(`[定时任务] 已过期 ${result.affectedRows} 条广场需求`);
      }
    } catch (err) {
      console.error('[定时任务] 过期检查失败:', err.message);
    }
  });

  // TODO: 每天同步食堂菜单（待接入米宴接口）
  // schedule.scheduleJob('0 6 * * *', async () => { ... });

  console.log('[OK] 定时任务已启动');
}

module.exports = { startScheduler };
