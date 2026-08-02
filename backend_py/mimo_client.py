"""
MiMo API 封装 — 与 Node backend/services/mimo.js 保持同步
"""
import os, re, json, sys
import httpx
from dotenv import load_dotenv

# Windows 控制台强制 UTF-8 输出，避免 GBK 编码错误
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

load_dotenv()

MIMO_API_URL = os.getenv("MIMO_API_URL", "https://api.xiaomimimo.com/v1")
MIMO_API_KEY = os.getenv("MIMO_API_KEY", "")

DAILY_HIGHLIGHTS = [
    {"canteen": "2010餐厅·称重餐线", "location": "科技园CD栋", "dish": "蒜香烤猪颈肉", "badge": "回归", "desc": "蒜香猪颈肉回归了！蒜香浓郁外焦里嫩"},
    {"canteen": "称重自助餐线",       "location": "科技园AB栋", "dish": "照烧鸡腿肉",   "badge": "推荐", "desc": "照烧鸡腿肉很好吃，汁多味美"},
]


async def _call_mimo_text(system_prompt: str, user_prompt: str, temperature: float = 0.7, max_tokens: int = 150) -> str:
    """自由文本输出，不强制 json_object 格式，用于对话场景"""
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{MIMO_API_URL}/responses",
            headers={"api-key": MIMO_API_KEY, "Content-Type": "application/json"},
            json={
                "model": "mimo-v2.5",
                "instructions": system_prompt,
                "input": user_prompt,
                "max_output_tokens": max_tokens,
                "reasoning": {"effort": "none"},
            },
        )
        resp.raise_for_status()
        data = resp.json()
        text = data.get("output_text") or (
            data.get("output", [{}])[0].get("content", [{}])[0].get("text", "")
        )
        safe_text = text[:200].encode('ascii', errors='replace').decode('ascii')
        print(f"[MIMO-TEXT] output: {safe_text}")
        return text


async def _call_mimo(system_prompt: str, user_prompt: str, temperature: float = 0.7) -> str:
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{MIMO_API_URL}/responses",
            headers={"api-key": MIMO_API_KEY, "Content-Type": "application/json"},
            json={
                "model": "mimo-v2.5",
                "instructions": system_prompt,
                "input": user_prompt,
                "max_output_tokens": 300,
                "reasoning": {"effort": "none"},
                "text": {"format": {"type": "json_object"}},
            },
        )
        resp.raise_for_status()
        data = resp.json()
        text = data.get("output_text") or (
            data.get("output", [{}])[0].get("content", [{}])[0].get("text", "")
        )
        safe_text = text[:200].encode('ascii', errors='replace').decode('ascii')
        print(f"[MIMO] output: {safe_text}")
        return text


def _extract_json(text: str) -> str:
    m = re.search(r"```json\s*([\s\S]*?)```", text) or re.search(r"(\[[\s\S]*\]|\{[\s\S]*\})", text)
    return m.group(1) if m and m.lastindex == 1 else (m.group(0) if m else text)


def _parse_arr(v):
    if isinstance(v, list):
        return v
    if isinstance(v, str) and v.startswith("["):
        try:
            return json.loads(v)
        except Exception:
            pass
    return []


# ① 每日推荐
async def daily_recommendation(date: str, zodiac: str) -> dict:
    sys_p = (
        'You are a daily inspiration assistant for "Mi搭子" workplace app.\n'
        "Generate fun daily recommendations for a Chinese workplace user.\n"
        "Output ONLY valid JSON, no explanation, no markdown.\n"
        'Output format: {"keywords":"2-3 Chinese social keywords for today",'
        '"recommended_food":"specific lunch recommendation with brief reason in Chinese ≤20 chars",'
        '"social_tip":"one practical fun Chinese social tip ≤30 chars",'
        '"lucky_number": a number 1-99}'
    )
    user_p = f"Today: {date}, User zodiac: {zodiac}\nGenerate daily recommendation:"
    try:
        return json.loads(_extract_json(await _call_mimo(sys_p, user_p, 0.9)))
    except Exception:
        return {"keywords": "", "recommended_food": "", "social_tip": "", "lucky_number": 0}


# ② 搭子匹配打分
async def match_candidates(profile_a: dict, candidates: list, scene: str) -> list:
    scene_desc = "commute carpool (通勤拼车)" if scene == "commute" else "lunch buddy (午餐拼桌)"
    weight_hint = (
        "route overlap 35%, departure time 35%, interests 15%, social style 15%"
        if scene == "commute"
        else "taste match 20%, meal time 30%, location 15%, interests 15%, social style 20%"
    )
    sys_p = (
        f'You are an intelligent matching engine for "Mi搭子" workplace social app.\n'
        f"Scene: {scene_desc}\nScoring weights: {weight_hint}\n"
        "Rules:\n- score: 0-100, realistic scores reflecting actual compatibility\n"
        "- reason: natural Chinese explanation mentioning specific common points, ≤20 chars, casual tone\n"
        "- commonTags: up to 3 specific shared tags\n"
        "Output ONLY a valid JSON array, no explanation."
    )
    user_p = (
        f"My profile: {json.dumps(profile_a, ensure_ascii=False)}\n"
        f"Candidates: {json.dumps(candidates, ensure_ascii=False)}\n"
        'Output: [{"candidate_id":"","score":0,"reason":"","commonTags":[]}]'
    )
    try:
        return json.loads(_extract_json(await _call_mimo(sys_p, user_p, 0.6)))
    except Exception:
        return []


# ③-A 午餐破冰话术
async def generate_lunch_icebreaker(profile_a: dict, profile_b: dict) -> dict:
    highlight_hint = "；".join(
        f"{h['location']}{h['canteen']}的{h['dish']}（{h['desc']}）" for h in DAILY_HIGHLIGHTS
    )

    def pick(p):
        return {
            "dept": p.get("department", "").replace("中国区-", "").replace("手机部-", ""),
            "about": p.get("about_me", ""),
            "interests": "/".join(_parse_arr(p.get("interests"))),
            "taste": "/".join(_parse_arr(p.get("taste_pref"))),
            "time": p.get("time_pref", ""),
        }

    a, b = pick(profile_a), pick(profile_b)
    sys_p = (
        "你是职场社交App的话术生成器，帮用户写午餐邀请消息。\n"
        "inviteMessage写法：像真人发微信一样自然，找到一个具体的共同点（口味/时间/兴趣/部门）作为邀请理由，"
        "语气轻松友好不客套，不超过40字，只聊吃饭，不提居住地或通勤。可以自然地提到今日亮点菜品。\n"
        "【重要】inviteMessage 是发起人写的第一人称消息，不能出现被邀请人的名字，直接说「你」或「一起」。\n"
        "icebreakerTopics写法：生成2个开放式问题，每个问题要基于某一个具体的共同点或对方的某个特点来提问，"
        "让对方有话说，像朋友之间自然聊天，不要泛泛问。也可以用今日亮点菜品作为话题切入点。\n"
        f"今日亮点菜品：{highlight_hint}"
    )
    user_p = (
        f"发起人：部门={a['dept']}，自我介绍={a['about']}，兴趣={a['interests']}，口味={a['taste']}，用餐时间={a['time']}\n"
        f"被邀请人：部门={b['dept']}，自我介绍={b['about']}，兴趣={b['interests']}，口味={b['taste']}，用餐时间={b['time']}\n"
        '输出：{"inviteMessage":"","icebreakerTopics":["",""]}'
    )
    try:
        raw = await _call_mimo_text(sys_p, user_p, 0.8)
        parsed = json.loads(_extract_json(raw))
        if not parsed.get("inviteMessage"):
            raise ValueError("empty inviteMessage")
        return parsed
    except Exception as e:
        print(f"[MIMO-LUNCH] 失败: {e}")
        return {"inviteMessage": "嘿，要不要一起吃饭？", "icebreakerTopics": []}


# ③-B 通勤破冰话术
async def generate_commute_icebreaker(profile_a: dict, profile_b: dict) -> dict:
    def pick(p):
        return {
            "dept": p.get("department", "").replace("中国区-", "").replace("手机部-", ""),
            "about": p.get("about_me", ""),
            "interests": "/".join(_parse_arr(p.get("interests"))),
            "area": p.get("commute_area", ""),
            "time": p.get("commute_time") or p.get("time_pref", ""),
            "transport": p.get("transport", ""),
        }

    a, b = pick(profile_a), pick(profile_b)
    sys_p = (
        "你是职场社交App的话术生成器，帮用户写通勤拼车邀请消息。\n"
        "inviteMessage写法：像真人发微信一样口语化，找到路线或时间上的具体共同点作为理由，"
        "可以提交通方式或顺路这件事，语气轻松随意不正式，不超过40字，只聊通勤，不提吃饭或食堂。\n"
        "【重要】inviteMessage 是发起人写的第一人称消息，不能出现被邀请人的名字，直接说「你」或「一起」。\n"
        "icebreakerTopics写法：生成2个开放式问题，从对方的兴趣/部门/通勤经历里找切入点来提问，"
        "让对方有话说，像路上随口聊起来的感觉。"
    )
    user_p = (
        f"发起人：部门={a['dept']}，自我介绍={a['about']}，兴趣={a['interests']}，出发地={a['area']}，出发时间={a['time']}，交通方式={a['transport']}\n"
        f"被邀请人：部门={b['dept']}，自我介绍={b['about']}，兴趣={b['interests']}，出发地={b['area']}，出发时间={b['time']}，交通方式={b['transport']}\n"
        '输出：{"inviteMessage":"","icebreakerTopics":["",""]}'
    )
    try:
        raw = await _call_mimo_text(sys_p, user_p, 0.8)
        parsed = json.loads(_extract_json(raw))
        if not parsed.get("inviteMessage"):
            raise ValueError("empty inviteMessage")
        return parsed
    except Exception as e:
        print(f"[MIMO-COMMUTE] 失败: {e}")
        return {"inviteMessage": "嘿，顺路要不要一起？", "icebreakerTopics": []}
