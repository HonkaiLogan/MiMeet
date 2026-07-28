/**
 * MySQL 数据库连接池 + 建表
 */
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mimeet',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * 初始化数据库表结构
 */
async function initDB() {
  const conn = await pool.getConnection();
  try {
    // 用户表
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        feishu_id   VARCHAR(128) UNIQUE NOT NULL,
        nickname    VARCHAR(64),
        department  VARCHAR(128),
        avatar_url  VARCHAR(512),
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 用户画像表
    await conn.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        user_id         INT NOT NULL,
        scene           VARCHAR(32) NOT NULL DEFAULT 'lunch',
        taste_pref      JSON,
        time_pref       VARCHAR(16),
        location_pref   VARCHAR(128),
        budget          VARCHAR(32),
        social_pref     VARCHAR(32),
        interests       JSON,
        commute_area    VARCHAR(128),
        commute_time    VARCHAR(16),
        transport       VARCHAR(32),
        created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 匹配记录表
    await conn.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_a_id   INT NOT NULL,
        user_b_id   INT NOT NULL,
        scene       VARCHAR(32) NOT NULL,
        score       INT DEFAULT 0,
        reason      TEXT,
        icebreaker  JSON,
        feedback_a  VARCHAR(32),
        feedback_b  VARCHAR(32),
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_a_id) REFERENCES users(id),
        FOREIGN KEY (user_b_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 搭子广场表
    await conn.query(`
      CREATE TABLE IF NOT EXISTS square_posts (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_id     INT NOT NULL,
        scene       VARCHAR(32) NOT NULL,
        content     TEXT NOT NULL,
        time_pref   VARCHAR(16),
        status      VARCHAR(16) DEFAULT 'open',
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('[OK] MySQL 数据库初始化完成');
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDB };
