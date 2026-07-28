"""
数据库模型定义 - SQLite
"""
import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')


def get_db():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # 返回字典风格
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """初始化数据库表结构"""
    conn = get_db()
    cursor = conn.cursor()

    # 用户表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            feishu_id   TEXT UNIQUE NOT NULL,
            nickname    TEXT,
            department  TEXT,
            avatar_url  TEXT,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 用户画像表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id         INTEGER NOT NULL,
            scene           TEXT NOT NULL DEFAULT 'lunch',
            taste_pref      TEXT DEFAULT '[]',
            time_pref       TEXT,
            location_pref   TEXT,
            budget          TEXT,
            social_pref     TEXT,
            interests       TEXT DEFAULT '[]',
            commute_area    TEXT,
            commute_time    TEXT,
            transport       TEXT,
            created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # 匹配记录表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS matches (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_a_id   INTEGER NOT NULL,
            user_b_id   INTEGER NOT NULL,
            scene       TEXT NOT NULL,
            score       INTEGER DEFAULT 0,
            reason      TEXT,
            icebreaker  TEXT DEFAULT '{}',
            feedback_a  TEXT,
            feedback_b  TEXT,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_a_id) REFERENCES users(id),
            FOREIGN KEY (user_b_id) REFERENCES users(id)
        )
    ''')

    # 搭子广场表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS square_posts (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            scene       TEXT NOT NULL,
            content     TEXT NOT NULL,
            time_pref   TEXT,
            status      TEXT DEFAULT 'open',
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    conn.commit()
    conn.close()
    print("[OK] 数据库初始化完成")


if __name__ == '__main__':
    init_db()
