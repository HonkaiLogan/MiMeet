"""
匹配引擎
规则初筛（纯代码） + MiMo 精排
"""
import json
from datetime import datetime, timedelta
from models import get_db
from mimo_client import match_candidates, generate_icebreaker


def rule_filter(user_id: int, scene: str) -> list:
    """
    规则初筛：从数据库中筛选满足基本条件的候选人
    规则：同场景 + 时间差≤30min + 排除自己
    """
    conn = get_db()

    # 获取当前用户画像
    my_profile = conn.execute(
        'SELECT * FROM profiles WHERE user_id = ? AND scene = ?',
        (user_id, scene)
    ).fetchone()

    if not my_profile:
        conn.close()
        return []

    # 初筛：同场景 + 非自己 + 有画像
    candidates = conn.execute('''
        SELECT p.*, u.nickname, u.department, u.avatar_url
        FROM profiles p
        JOIN users u ON p.user_id = u.id
        WHERE p.scene = ? AND p.user_id != ?
    ''', (scene, user_id)).fetchall()

    results = []
    for c in candidates:
        score = 0

        # 时间匹配 (30分)
        if my_profile['time_pref'] and c['time_pref']:
            my_time = _parse_time(my_profile['time_pref'])
            c_time = _parse_time(c['time_pref'])
            if my_time and c_time:
                diff = abs((my_time - c_time).total_seconds()) / 60
                if diff <= 15:
                    score += 30
                elif diff <= 30:
                    score += 15
                else:
                    continue  # 时间差>30min，直接排除
            else:
                score += 15  # 无法解析，给半分

        # 地点/路线匹配 (25分)
        if my_profile['location_pref'] and c['location_pref']:
            if my_profile['location_pref'] == c['location_pref']:
                score += 25
            else:
                score += 10

        # 口味/预算匹配 (15分)
        my_taste = set(json.loads(my_profile['taste_pref'] or '[]'))
        c_taste = set(json.loads(c['taste_pref'] or '[]'))
        if my_taste and c_taste:
            overlap = my_taste & c_taste
            if overlap == my_taste:
                score += 15
            elif overlap:
                score += 8

        # 兴趣标签匹配 (15分)
        my_interests = set(json.loads(my_profile['interests'] or '[]'))
        c_interests = set(json.loads(c['interests'] or '[]'))
        if my_interests and c_interests:
            common = my_interests & c_interests
            total = my_interests | c_interests
            if total:
                score += int(len(common) / len(total) * 15)

        # 社交偏好匹配 (15分)
        if my_profile['social_pref'] and c['social_pref']:
            if my_profile['social_pref'] == c['social_pref']:
                score += 15
            else:
                score += 8

        if score > 0:
            results.append({
                'user_id': c['user_id'],
                'nickname': c['nickname'],
                'department': c['department'],
                'avatar_url': c['avatar_url'],
                'rule_score': score,
                'profile': dict(c)
            })

    conn.close()

    # 按规则分数排序，取 Top10
    results.sort(key=lambda x: x['rule_score'], reverse=True)
    return results[:10]


def do_match(user_id: int, scene: str) -> list:
    """
    完整匹配流程：规则初筛 → MiMo 精排 → 返回 Top3
    """
    # 步骤1：规则初筛
    candidates = rule_filter(user_id, scene)

    if not candidates:
        return []

    # 步骤2：MiMo 精排
    conn = get_db()
    my_profile = conn.execute(
        'SELECT * FROM profiles WHERE user_id = ? AND scene = ?',
        (user_id, scene)
    ).fetchone()

    if my_profile:
        profile_dict = dict(my_profile)
        mimo_results = match_candidates(profile_dict, candidates, scene)

        # 合并规则分数和 MiMo 分数
        for r in mimo_results:
            for c in candidates:
                if c['user_id'] == int(r.get('candidate_id', 0)):
                    r['rule_score'] = c['rule_score']
                    r['nickname'] = c['nickname']
                    r['avatar_url'] = c['avatar_url']

        # 按 MiMo 分数排序，取 Top3
        mimo_results.sort(key=lambda x: x.get('score', 0), reverse=True)
        conn.close()
        return mimo_results[:3]

    conn.close()
    return candidates[:3]


def _parse_time(time_str: str):
    """尝试解析时间字符串"""
    for fmt in ['%H:%M', '%H:%M:%S']:
        try:
            return datetime.strptime(time_str, fmt)
        except ValueError:
            continue
    return None
