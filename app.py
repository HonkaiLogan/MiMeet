"""
Mi搭子 - Flask 主应用
路由定义 + 启动入口
"""
import os
from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from models import get_db, init_db
from matching import do_match
from feishu_auth import auth_bp

app = Flask(__name__, static_folder='static', static_url_path='')
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')
CORS(app)

# 注册飞书登录蓝图
app.register_blueprint(auth_bp)


# ========== 静态文件 ==========

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


# ========== 用户画像 API ==========

@app.route('/api/profile', methods=['GET'])
def get_profile():
    """获取当前用户画像"""
    user = session.get('user')
    if not user:
        return jsonify({"code": 401, "msg": "未登录", "data": None})

    conn = get_db()
    profile = conn.execute(
        'SELECT * FROM profiles WHERE user_id = (SELECT id FROM users WHERE feishu_id = ?)',
        (user['feishu_id'],)
    ).fetchone()
    conn.close()

    if profile:
        return jsonify({"code": 200, "msg": "ok", "data": dict(profile)})
    return jsonify({"code": 200, "msg": "ok", "data": None})


@app.route('/api/profile', methods=['POST'])
def save_profile():
    """保存用户画像"""
    user = session.get('user')
    if not user:
        return jsonify({"code": 401, "msg": "未登录", "data": None})

    data = request.get_json()
    conn = get_db()

    # 确保用户存在
    conn.execute('''
        INSERT OR IGNORE INTO users (feishu_id, nickname, avatar_url)
        VALUES (?, ?, ?)
    ''', (user['feishu_id'], user.get('nickname'), user.get('avatar_url')))
    conn.commit()

    user_row = conn.execute(
        'SELECT id FROM users WHERE feishu_id = ?', (user['feishu_id'],)
    ).fetchone()
    user_id = user_row['id']

    # 更新或插入画像
    existing = conn.execute(
        'SELECT id FROM profiles WHERE user_id = ? AND scene = ?',
        (user_id, data.get('scene', 'lunch'))
    ).fetchone()

    if existing:
        conn.execute('''
            UPDATE profiles SET
                taste_pref = ?, time_pref = ?, location_pref = ?,
                budget = ?, social_pref = ?, interests = ?,
                commute_area = ?, commute_time = ?, transport = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            data.get('taste_pref'), data.get('time_pref'), data.get('location_pref'),
            data.get('budget'), data.get('social_pref'), data.get('interests'),
            data.get('commute_area'), data.get('commute_time'), data.get('transport'),
            existing['id']
        ))
    else:
        conn.execute('''
            INSERT INTO profiles (user_id, scene, taste_pref, time_pref, location_pref,
                budget, social_pref, interests, commute_area, commute_time, transport)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id, data.get('scene', 'lunch'),
            data.get('taste_pref'), data.get('time_pref'), data.get('location_pref'),
            data.get('budget'), data.get('social_pref'), data.get('interests'),
            data.get('commute_area'), data.get('commute_time'), data.get('transport')
        ))

    conn.commit()
    conn.close()
    return jsonify({"code": 200, "msg": "保存成功", "data": None})


# ========== 匹配 API ==========

@app.route('/api/match', methods=['POST'])
def match():
    """发起匹配，返回 Top3 推荐搭子"""
    user = session.get('user')
    if not user:
        return jsonify({"code": 401, "msg": "未登录", "data": None})

    data = request.get_json()
    scene = data.get('scene', 'lunch')

    conn = get_db()
    user_row = conn.execute(
        'SELECT id FROM users WHERE feishu_id = ?', (user['feishu_id'],)
    ).fetchone()
    conn.close()

    if not user_row:
        return jsonify({"code": 400, "msg": "请先填写画像", "data": None})

    results = do_match(user_row['id'], scene)
    return jsonify({"code": 200, "msg": "ok", "data": results})


# ========== 搭子广场 API ==========

@app.route('/api/square', methods=['GET'])
def get_square():
    """获取搭子广场列表"""
    conn = get_db()
    posts = conn.execute('''
        SELECT sp.*, u.nickname, u.avatar_url
        FROM square_posts sp
        JOIN users u ON sp.user_id = u.id
        WHERE sp.status = 'open'
        ORDER BY sp.created_at DESC
    ''').fetchall()
    conn.close()
    return jsonify({"code": 200, "msg": "ok", "data": [dict(p) for p in posts]})


@app.route('/api/square', methods=['POST'])
def publish_square():
    """发布搭子需求"""
    user = session.get('user')
    if not user:
        return jsonify({"code": 401, "msg": "未登录", "data": None})

    data = request.get_json()
    conn = get_db()
    user_row = conn.execute(
        'SELECT id FROM users WHERE feishu_id = ?', (user['feishu_id'],)
    ).fetchone()

    if not user_row:
        conn.close()
        return jsonify({"code": 400, "msg": "请先登录", "data": None})

    conn.execute('''
        INSERT INTO square_posts (user_id, scene, content, time_pref)
        VALUES (?, ?, ?, ?)
    ''', (user_row['id'], data.get('scene', 'lunch'), data['content'], data.get('time_pref')))
    conn.commit()
    conn.close()
    return jsonify({"code": 200, "msg": "发布成功", "data": None})


# ========== 匹配反馈 API ==========

@app.route('/api/feedback', methods=['POST'])
def feedback():
    """对匹配结果评分"""
    user = session.get('user')
    if not user:
        return jsonify({"code": 401, "msg": "未登录", "data": None})

    data = request.get_json()
    # TODO: 更新 matches 表中的 feedback_a/feedback_b
    return jsonify({"code": 200, "msg": "反馈已记录", "data": None})


# ========== 每日推荐 API ==========

@app.route('/api/daily', methods=['GET'])
def daily():
    """获取每日幸运推荐"""
    # TODO: 接入 MiMo 生成每日推荐
    return jsonify({
        "code": 200, "msg": "ok",
        "data": {
            "keywords": "社交指数 ★★★★★",
            "recommended_food": "推荐去B1吃轻食沙拉",
            "social_tip": "今天适合主动出击，找个饭搭子一起聊聊AI！"
        }
    })


# ========== 食堂菜单 API ==========

@app.route('/api/menu', methods=['GET'])
def menu():
    """获取食堂实时菜单"""
    # TODO: 接入米宴接口
    return jsonify({"code": 200, "msg": "ok", "data": []})


# ========== 优惠信息 API ==========

@app.route('/api/offers', methods=['GET'])
def offers():
    """获取优惠信息"""
    # TODO: 接入优惠屋接口
    return jsonify({"code": 200, "msg": "ok", "data": []})


# ========== 餐厅路线 API ==========

@app.route('/api/restaurant/route', methods=['GET'])
def restaurant_route():
    """获取餐厅路线"""
    # TODO: 接入地图API
    return jsonify({"code": 200, "msg": "ok", "data": None})


# ========== 启动 ==========

if __name__ == '__main__':
    init_db()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
