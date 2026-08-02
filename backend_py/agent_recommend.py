"""
Agent 推荐逻辑：菜品个性化推荐 + 优惠筛选
"""
import json
from mimo_client import _call_mimo, _call_mimo_text, _extract_json
from menu_loader import get_dishes, get_offers

DAILY_HIGHLIGHTS = [
    {"canteen": "2010餐厅·称重餐线", "location": "科技园CD栋", "dish": "蒜香烤猪颈肉", "note": "今日回归！蒜香浓郁外焦里嫩"},
    {"canteen": "称重自助餐线",       "location": "科技园AB栋", "dish": "照烧鸡腿肉",   "note": "今日推荐，汁多味美"},
]


async def recommend_food(taste_pref: list, budget: str, meal_time: str = "") -> dict:
    """
    根据用户口味偏好从真实菜品数据里个性化推荐。
    taste_pref: ["辣","米饭"] 等
    budget: "20-40" 等
    meal_time: "午餐"/"晚餐" 等
    """
    dishes = get_dishes()
    if not dishes:
        return {"recommendations": [], "highlights": DAILY_HIGHLIGHTS, "msg": "菜品数据加载中，请稍后再试"}

    # 本地预筛：按供应时段粗筛，最多传 60 条给 MiMo
    def matches_time(d):
        if not meal_time:
            return True
        mt = d["meal_time"]
        return meal_time in mt or mt in ("全天", "午餐/晚餐")

    filtered = [d for d in dishes if matches_time(d)] or dishes
    # 辣度偏好预筛
    spicy_pref = "辣" in taste_pref
    if spicy_pref:
        spicy_first = [d for d in filtered if d["spicy"]] + [d for d in filtered if not d["spicy"]]
        filtered = spicy_first
    filtered = filtered[:60]

    # 价格范围提取
    budget_hint = f"用户预算{budget}元" if budget else ""

    sys_p = (
        "你是小米园区食堂推荐助手。根据用户口味偏好，从候选菜品列表里挑选3-5道最适合的菜品推荐给用户。\n"
        "要求：\n"
        "- 优先匹配用户口味偏好\n"
        "- 如果列表里有今日亮点菜品（蒜香烤猪颈肉/照烧鸡腿肉），优先推荐\n"
        "- reason字段：一句话说明为什么推荐，口语化，不超过20字\n"
        "- 输出ONLY有效JSON，无多余说明\n"
        f'输出格式：{{"recommendations":[{{"dish":"","canteen":"","location":"","price":"","unit":"","reason":""}}]}}'
    )
    user_p = (
        f"用户口味偏好：{'、'.join(taste_pref) if taste_pref else '无特别偏好'}，{budget_hint}\n"
        f"今日亮点菜品：{'；'.join(h['dish'] for h in DAILY_HIGHLIGHTS)}\n"
        f"候选菜品列表：{json.dumps(filtered, ensure_ascii=False)}\n"
        "请从中推荐3-5道最适合的菜品："
    )

    try:
        raw = await _call_mimo(sys_p, user_p, 0.7)
        parsed = json.loads(_extract_json(raw))
        recs = parsed.get("recommendations", [])
        return {"recommendations": recs, "highlights": DAILY_HIGHLIGHTS}
    except Exception as e:
        print(f"[agent/food] MiMo 失败: {e}，降级本地筛选".encode('utf-8', errors='replace').decode('utf-8'))
        # 降级：本地关键词匹配
        scored = []
        for d in dishes[:30]:
            s = sum(1 for t in taste_pref if t in d["dish"] or t in d["spicy"])
            scored.append((s, d))
        scored.sort(key=lambda x: -x[0])
        recs = [
            {"dish": d["dish"], "canteen": d["canteen"], "location": d["location"],
             "price": d["price"], "unit": d["unit"], "reason": "符合你的口味偏好"}
            for _, d in scored[:4]
        ]
        return {"recommendations": recs, "highlights": DAILY_HIGHLIGHTS}


def _build_offers_context(commute_area: str) -> tuple:
    """
    返回 (所有优惠, 区域过滤后的优惠)
    area_offers 先以北京为范围初筛，再按具体区域关键词细化
    """
    offers = get_offers()

    # 第一步：北京初筛（排除明显不在北京的全国通用外的其他城市数据）
    beijing_offers = [
        o for o in offers
        if "北京" in (o["area"] or "") or "全国通用" in (o["area"] or "")
    ]
    if not beijing_offers:
        beijing_offers = offers

    # 第二步：按用户具体区域细化
    area_keywords = {
        "回龙观":   ["北京科技园", "元中心", "回龙观", "西二旗", "清河"],
        "上地":     ["北京科技园", "元中心", "上地", "西二旗", "清河"],
        "西二旗":   ["北京科技园", "元中心", "西二旗", "清河"],
        "科技园":   ["北京科技园", "元中心", "清河"],
        "小米公寓": ["北京科技园", "元中心", "回龙观", "西二旗", "清河"],
        "天通苑":   ["北京科技园", "元中心", "天通苑", "清河"],
        "望京":     ["北京科技园", "元中心", "望京", "朝阳"],
    }
    keywords = area_keywords.get(commute_area, ["北京科技园", "元中心", "清河"])
    keywords_with_national = keywords + ["全国通用"]

    filtered = [o for o in beijing_offers if any(k in (o["area"] or "") for k in keywords_with_national)]
    if not filtered:
        filtered = beijing_offers

    return offers, filtered


import random

async def offers_chat(messages: list, user_profile: dict = None, is_initial: bool = False) -> dict:
    """
    多轮对话式优惠查询。
    is_initial=True：初始推荐，随机抽取区域内10条，突出个性化匹配理由
    is_initial=False：追问，全量64条做知识库，全量搜索
    user_profile: {nickname, department, commute_area, interests, taste_pref, budget}
    """
    if user_profile is None:
        user_profile = {}

    commute_area = user_profile.get("commute_area", "")
    interests    = user_profile.get("interests", [])
    taste_pref   = user_profile.get("taste_pref", [])
    budget       = user_profile.get("budget", "")
    nickname     = user_profile.get("nickname", "同学")
    department   = user_profile.get("department", "")

    all_offers, area_offers = _build_offers_context(commute_area)

    # 用户画像描述
    interests_str = "、".join(interests) if interests else "无特别偏好"
    taste_str     = "、".join(taste_pref) if taste_pref else "无特别偏好"
    dept_short    = department.replace("中国区-", "").replace("手机部-", "") if department else ""
    profile_desc  = (
        f"用户：{nickname}，部门：{dept_short or '未知'}，"
        f"兴趣爱好：{interests_str}，"
        f"口味偏好：{taste_str}，"
        f"餐饮预算：{budget or '不限'}，"
        f"常去区域：{commute_area or '科技园'}"
    )

    if is_initial:
        # 初始推荐：从区域内随机抽10条，让 MiMo 根据用户画像选3条并说明匹配理由
        pool_offers = area_offers if len(area_offers) >= 5 else all_offers
        sample = random.sample(pool_offers, min(10, len(pool_offers)))
        offers_data = json.dumps(
            [{"id": i, "商家": o["merchant"], "分类": o["category"], "区域": o["area"],
              "优惠": o["discount"], "地址": o["address"], "使用方式": o["how_to_use"]}
             for i, o in enumerate(sample)], ensure_ascii=False
        )
        sys_p = (
            "你是小米员工福利助手，帮员工发现最适合自己的专属优惠。\n\n"
            f"{profile_desc}\n\n"
            "候选优惠（从员工所在区域随机挑选）：\n"
            f"{offers_data}\n\n"
            "任务：从候选优惠里选出3条最匹配该用户的，要求：\n"
            "- 每条必须明确说出「为什么推荐给你」，结合用户的兴趣/口味/部门/区域给出具体理由\n"
            "- 口语化，像朋友安利一样，适当用emoji\n"
            "- 说清楚优惠内容、地址和使用方式\n"
            "- 结尾引导用户进一步询问（如：想看更多餐饮/娱乐/酒店优惠可以告诉我）"
        )
        user_p = f"帮我看看有哪些适合我的员工优惠"

    else:
        # 追问：全量64条作知识库，根据用户问题全量搜索
        offers_data = json.dumps(
            [{"商家": o["merchant"], "分类": o["category"], "区域": o["area"],
              "优惠": o["discount"], "地址": o["address"], "使用方式": o["how_to_use"],
              "备注": o["note"] or ""}
             for o in all_offers], ensure_ascii=False
        )
        sys_p = (
            "你是小米员工福利助手，掌握完整的员工专属优惠数据库（共64条）。\n\n"
            f"{profile_desc}\n\n"
            "完整优惠数据库：\n"
            f"{offers_data}\n\n"
            "对话规则：\n"
            "- 根据用户提问从数据库里精准查找匹配的优惠\n"
            "- 每条推荐必须说明「为什么推荐给你」，结合用户画像给具体理由\n"
            "- 如果数据库里没有用户问的优惠，诚实告知\n"
            "- 口语化，适当用emoji，说清楚优惠详情和使用方式"
        )
        # 拼历史对话上下文
        history_str = ""
        if len(messages) > 1:
            for m in messages[:-1]:
                role_label = "用户" if m["role"] == "user" else "助手"
                history_str += f"{role_label}：{m['content']}\n"
        user_msg = messages[-1]["content"] if messages else ""
        user_p = f"对话历史：\n{history_str}\n用户：{user_msg}" if history_str else user_msg

    try:
        reply = await _call_mimo_text(sys_p, user_p, 0.8)
        return {"reply": reply}
    except Exception as e:
        safe_e = str(e).encode('ascii', errors='replace').decode('ascii')
        print(f"[agent/offers-chat] MiMo failed: {safe_e}, using fallback")
        # 降级
        fallback_pool = area_offers if area_offers else all_offers
        sample = random.sample(fallback_pool, min(3, len(fallback_pool)))
        reply = f"为你找到以下{commute_area or '附近'}优惠：\n" + "\n".join(
            f"• **{o['merchant']}**：{o['discount']}（{o['how_to_use']}）" for o in sample
        )
        return {"reply": reply, "offers": fallback}


async def recommend_offers(commute_area: str = "", category: str = "") -> dict:
    """
    根据用户所在区域筛选优惠。
    commute_area: "回龙观"/"上地"/"科技园" 等
    """
    offers = get_offers()
    if not offers:
        return {"offers": [], "msg": "优惠数据加载中"}

    # 区域关键词映射
    area_keywords = {
        "回龙观": ["北京科技园", "元中心", "回龙观", "西二旗"],
        "上地":   ["北京科技园", "元中心", "上地", "西二旗"],
        "西二旗": ["北京科技园", "元中心", "西二旗"],
        "科技园": ["北京科技园", "元中心"],
        "小米公寓": ["北京科技园", "元中心", "回龙观", "西二旗"],
    }
    keywords = area_keywords.get(commute_area, ["北京科技园", "元中心", "全国通用"])
    keywords.append("全国通用")

    filtered = [o for o in offers if any(k in (o["area"] or "") for k in keywords)]
    if not filtered:
        filtered = offers[:20]

    if category:
        cat_filtered = [o for o in filtered if category in o["category"]]
        if cat_filtered:
            filtered = cat_filtered

    sys_p = (
        "你是小米员工福利助手。从以下优惠列表里挑出3条最值得推荐的，用口语化的方式介绍给用户。\n"
        "summary字段：一句话总结优惠亮点，不超过25字，突出最吸引人的点\n"
        f'输出格式：{{"offers":[{{"merchant":"","discount":"","address":"","how_to_use":"","summary":""}}]}}'
    )
    user_p = (
        f"用户所在区域：{commute_area or '科技园'}\n"
        f"优惠列表：{json.dumps(filtered[:30], ensure_ascii=False)}\n"
        "请推荐3条最值得的优惠："
    )

    try:
        raw = await _call_mimo(sys_p, user_p, 0.7)
        parsed = json.loads(_extract_json(raw))
        return {"offers": parsed.get("offers", [])}
    except Exception as e:
        print(f"[agent/offers] MiMo 失败: {e}，降级本地筛选".encode('utf-8', errors='replace').decode('utf-8'))
        recs = [
            {"merchant": o["merchant"], "discount": o["discount"],
             "address": o["address"], "how_to_use": o["how_to_use"],
             "summary": o["discount"][:25] if o["discount"] else ""}
            for o in filtered[:3]
        ]
        return {"offers": recs}
