/**
 * MySQL 连接池 + 建表
 *
 * 表结构对齐三个飞书文档：
 *   ① Mi 搭子提交版 §4.5
 *   ② 前后端对接技术文档
 *   ③ Mi搭子超细化功能表 + 陈权 MiMo 支持范围
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

async function initDB() {
  const conn = await pool.getConnection();
  try {
    // ========== 用户 ==========
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        feishu_id   VARCHAR(128) UNIQUE NOT NULL,
        nickname    VARCHAR(64),
        department  VARCHAR(128),
        seat_number VARCHAR(64),
        about_me    TEXT,
        avatar_url  VARCHAR(512),
        join_date   DATE,
        role        VARCHAR(32),
        zodiac      VARCHAR(16),
        badge       VARCHAR(32) DEFAULT '',
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 兼容已有表：尝试添加 badge 列
    try { await conn.query('ALTER TABLE users ADD COLUMN badge VARCHAR(32) DEFAULT ""'); } catch {}

    // ========== 用户画像（按场景一行） ==========
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
        UNIQUE KEY uk_user_scene (user_id, scene),
        FOREIGN KEY (user_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ========== 匹配记录 ==========
    // feedback_a / feedback_b: 1-5 星整数,双方各自打分
    // status: pending / accepted / declined,邀请回执状态
    await conn.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_a_id   INT NOT NULL,
        user_b_id   INT NOT NULL,
        scene       VARCHAR(32) NOT NULL,
        score       INT DEFAULT 0,
        reason      TEXT,
        common_tags JSON,
        icebreaker  JSON,
        feedback_a  TINYINT,
        feedback_b  TINYINT,
        status      VARCHAR(16) DEFAULT 'pending',
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_a (user_a_id, created_at),
        INDEX idx_user_b (user_b_id, created_at),
        FOREIGN KEY (user_a_id) REFERENCES users(id),
        FOREIGN KEY (user_b_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ========== 搭子广场 ==========
    // content: JSON 字符串,前端提交嵌套对象 { time, taste, budget, socialMode } 或
    //          { homeArea, departureTime, transportMode } 或 { activity, location, ... }
    await conn.query(`
      CREATE TABLE IF NOT EXISTS square_posts (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_id     INT NOT NULL,
        scene       VARCHAR(32) NOT NULL,
        content     JSON NOT NULL,
        time_pref   VARCHAR(16),
        status      VARCHAR(16) DEFAULT 'open',
        expire_at   DATETIME,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status_scene (status, scene, created_at),
        FOREIGN KEY (user_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ========== 广场响应（谁响应了谁） ==========
    await conn.query(`
      CREATE TABLE IF NOT EXISTS square_responses (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        post_id     INT NOT NULL,
        user_id     INT NOT NULL,
        message     TEXT,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_post_user (post_id, user_id),
        INDEX idx_post (post_id),
        FOREIGN KEY (post_id) REFERENCES square_posts(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ========== 邀请 ==========
    await conn.query(`
      CREATE TABLE IF NOT EXISTS invites (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        match_id     INT,
        from_user_id INT NOT NULL,
        to_user_id   INT NOT NULL,
        scene        VARCHAR(32),
        message      TEXT,
        status       VARCHAR(16) DEFAULT 'sent',
        created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
        responded_at DATETIME,
        INDEX idx_from (from_user_id, status, created_at),
        INDEX idx_to (to_user_id, status, created_at),
        FOREIGN KEY (match_id) REFERENCES matches(id),
        FOREIGN KEY (from_user_id) REFERENCES users(id),
        FOREIGN KEY (to_user_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ========== 匹配反馈 ==========
    await conn.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        match_id    INT NOT NULL,
        user_id     INT NOT NULL,
        target_id   INT NOT NULL,
        rating      TINYINT,
        verdict     VARCHAR(16),
        comment     TEXT,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_match_user (match_id, user_id),
        INDEX idx_match (match_id),
        FOREIGN KEY (match_id) REFERENCES matches(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (target_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ========== 食堂菜单（每日同步） ==========
    // 字段对齐前端 mock-data.js 的 MOCK_MENUS 形状
    await conn.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        date         DATE,
        canteen      VARCHAR(128) NOT NULL,
        location     VARCHAR(128),
        meal_time    VARCHAR(64),
        dish         VARCHAR(128) NOT NULL,
        tag          VARCHAR(32),
        taste_tags   JSON,
        price        DECIMAL(6,2),
        unit         VARCHAR(32),
        spicy        TINYINT DEFAULT 0,
        calorie      INT,
        image        VARCHAR(255),
        created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_date_canteen (date, canteen),
        INDEX idx_tag (tag)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ========== 优惠信息 ==========
    await conn.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        title        VARCHAR(255) NOT NULL,
        description  TEXT,
        merchant     VARCHAR(128),
        discount     VARCHAR(64),
        start_at     DATETIME,
        end_at       DATETIME,
        status       VARCHAR(16) DEFAULT 'active',
        created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status_end (status, end_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ========== 每日推荐缓存（避免同一天重复调 MiMo） ==========
    await conn.query(`
      CREATE TABLE IF NOT EXISTS daily_recommend (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_id     INT NOT NULL,
        date        DATE NOT NULL,
        fortune     TEXT,
        lucky_food  VARCHAR(255),
        restaurant  VARCHAR(255),
        content     JSON,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_user_date (user_id, date),
        FOREIGN KEY (user_id) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ========== 飞书事件订阅收到的消息 ==========
    // 机器人在群里收到消息后,由 /api/feishu/events 落库,
    // msg_id 唯一约束用来做幂等(飞书可能重投)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS feishu_messages (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        msg_id         VARCHAR(64) UNIQUE NOT NULL,
        chat_id        VARCHAR(64),
        chat_type      VARCHAR(16),
        sender_open_id VARCHAR(128),
        sender_id_type VARCHAR(16),
        msg_type       VARCHAR(32),
        content        JSON,
        mentions       JSON,
        root_id        VARCHAR(64),
        parent_id      VARCHAR(64),
        create_time    DATETIME,
        received_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_chat_time (chat_id, create_time),
        INDEX idx_sender (sender_open_id),
        INDEX idx_msg_type (msg_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('[OK] MySQL 数据库初始化完成');
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDB };
