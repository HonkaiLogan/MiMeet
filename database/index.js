/**
 * 数据库统一入口 — 根据 DB_MODE 环境变量选择 mock 或 mysql
 * 所有路由和 services 应从此文件导入 pool / initDB
 */

const DB_MODE = process.env.DB_MODE || 'mock';

let db;

if (DB_MODE === 'mysql') {
  db = require('./db');
  console.log('[DB] 使用 MySQL 数据库');
} else if (DB_MODE === 'auto') {
  // auto 模式：优先尝试 MySQL，连接失败则降级到 mock
  try {
    db = require('./db');
    console.log('[DB] 自动模式：尝试连接 MySQL...');
  } catch {
    db = require('./mock-db');
    console.log('[DB] 自动模式：MySQL 不可用，降级到 Mock');
  }
} else {
  db = require('./mock-db');
  console.log('[DB] 使用 Mock 内存数据库');
}

module.exports = { pool: db.pool, initDB: db.initDB, store: db.store || null };
