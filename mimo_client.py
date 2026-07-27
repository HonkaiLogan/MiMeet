"""
MiMo API 封装
负责调用 Xiaomi MiMo 大模型完成：
  1. 画像理解（结构化用户偏好）
  2. 匹配精排（打分 + 推荐理由）
  3. 破冰话术生成
  4. 每日幸运推荐
"""
import os
import json
import requests


MIMO_API_URL = os.getenv('MIMO_API_URL', '')
MIMO_API_KEY = os.getenv('MIMO_API_KEY', '')


def _call_mimo(prompt: str, temperature: float = 0.7) -> str:
    """通用 MiMo 调用（占位，待接入真实 API 后替换）"""
    # TODO: 接入真实 MiMo API
    # 示例：
    # response = requests.post(
    #     MIMO_API_URL,
    #     headers={"Authorization": f"Bearer {MIMO_API_KEY}"},
    #     json={"prompt": prompt, "temperature": temperature}
    # )
    # return response.json()["text"]
    return '{"placeholder": "MiMo API 待接入"}'


def understand_profile(raw_prefs: dict) -> dict:
    """① 画像理解：将用户原始偏好整合为结构化画像"""
    prompt = f"""你是"Mi搭子"的画像理解引擎。
用户原始偏好：{json.dumps(raw_prefs, ensure_ascii=False)}
请输出结构化画像 JSON：persona, matchPriority, avoidTags"""
    result = _call_mimo(prompt)
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        return {"persona": "", "matchPriority": [], "avoidTags": []}


def match_candidates(profile_a: dict, candidates: list, scene: str, context: dict = None) -> list:
    """② 匹配精排：对初筛候选人打分排序，生成推荐理由"""
    prompt = f"""你是"Mi搭子"的智能匹配引擎。用户正在找【{scene}】搭子。
用户画像：{json.dumps(profile_a, ensure_ascii=False)}
候选人列表：{json.dumps(candidates, ensure_ascii=False)}
请为每位候选人打分(0-100)，输出 JSON 数组：candidate_id, score, reason, commonTags"""
    result = _call_mimo(prompt)
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        return []


def generate_icebreaker(profile_a: dict, profile_b: dict, scene: str) -> dict:
    """③ 破冰话术生成"""
    prompt = f"""你是职场轻社交破冰助手。
用户A：{json.dumps(profile_a, ensure_ascii=False)}
用户B：{json.dumps(profile_b, ensure_ascii=False)}
场景：{scene}
请输出 JSON：inviteMessage, icebreakerTopics"""
    result = _call_mimo(prompt)
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        return {"inviteMessage": "", "icebreakerTopics": []}


def daily_recommendation(date: str, zodiac: str) -> dict:
    """④ 每日幸运推荐"""
    prompt = f"""你是Mi搭子的每日推荐助手。今天是{date}，用户是{zodiac}座。
请输出 JSON：keywords, recommended_food, social_tip"""
    result = _call_mimo(prompt)
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        return {"keywords": "", "recommended_food": "", "social_tip": ""}
