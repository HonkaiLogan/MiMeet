/**
 * MiMo API 封装
 * 1. 画像理解  2. 匹配精排  3. 破冰话术  4. 每日推荐
 */
const axios = require('axios');

const MIMO_API_URL = process.env.MIMO_API_URL || 'https://api.xiaomimimo.com/v1';
const MIMO_API_KEY = process.env.MIMO_API_KEY || '';

async function _callMiMo(systemPrompt, userPrompt, temperature = 0.7) {
  const resp = await axios.post(
    `${MIMO_API_URL}/responses`,
    {
      model: 'mimo-v2.5',
      instructions: systemPrompt,
      input: userPrompt,
      max_output_tokens: 300,
      reasoning: { effort: 'none' },
      text: { format: { type: 'json_object' } },
    },
    {
      headers: {
        'api-key': MIMO_API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );
  const text = resp.data.output_text || resp.data.output?.[0]?.content?.[0]?.text || '';
  console.log('[MIMO] output_text:', text.slice(0, 300));
  return text;
}

function _extractJSON(text) {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
  return match ? match[1] || match[0] : text;
}

/** ① About Me 画像解析：提取用户个性标签与匹配优先级 */
async function understandProfile(rawPrefs) {
  const sys = `You are a user profile analysis engine for "Mi搭子", a workplace social app.
Extract structured profile data from user preferences and About Me text.
Output ONLY valid JSON, no explanation, no markdown.
Output format: {"persona":"one sentence describing social style (Chinese, ≤20 chars)","matchPriority":["up to 3 from: 口味,时间,地点,社交风格,兴趣爱好,通勤路线"],"avoidTags":["up to 3 incompatible tags, or empty"],"personalityTags":["up to 5 personality tags from about_me"]}`;

  const user = `User data: ${JSON.stringify(rawPrefs)}
Output the JSON profile:`;

  try {
    return JSON.parse(_extractJSON(await _callMiMo(sys, user, 0.5)));
  } catch {
    return { persona: '', matchPriority: [], avoidTags: [], personalityTags: [] };
  }
}

/** ② 搭子匹配打分 + 生成推荐理由 */
async function matchCandidates(profileA, candidates, scene) {
  const sceneDesc = scene === 'commute' ? 'commute carpool (通勤拼车)' : 'lunch buddy (午餐拼桌)';
  const weightHint = scene === 'commute'
    ? 'route overlap 35%, departure time 35%, interests 15%, social style 15%'
    : 'taste match 20%, meal time 30%, location 15%, interests 15%, social style 20%';

  const sys = `You are an intelligent matching engine for "Mi搭子" workplace social app.
Scene: ${sceneDesc}
Scoring weights: ${weightHint}
Rules:
- score: 0-100, realistic scores reflecting actual compatibility, do NOT give everyone high scores
- reason: natural Chinese explanation mentioning specific common points, ≤20 chars, casual tone
- commonTags: up to 3 specific shared tags (e.g. "都爱火锅","地铁2号线")
Output ONLY a valid JSON array, no explanation.`;

  const user = `My profile: ${JSON.stringify(profileA)}
Candidates: ${JSON.stringify(candidates)}
Output: [{"candidate_id":"","score":0,"reason":"","commonTags":[]}]`;

  try {
    return JSON.parse(_extractJSON(await _callMiMo(sys, user, 0.6)));
  } catch {
    return [];
  }
}

// 当日亮点菜品（与 daily.js 保持同步）
const DAILY_HIGHLIGHTS = [
  { canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '蒜香烤猪颈肉', badge: '回归', desc: '蒜香猪颈肉回归了！蒜香浓郁外焦里嫩' },
  { canteen: '称重自助餐线', location: '科技园AB栋', dish: '照烧鸡腿肉', badge: '推荐', desc: '照烧鸡腿肉很好吃，汁多味美' },
];

/** ③-A 午餐破冰话术生成 */
async function generateLunchIcebreaker(profileA, profileB) {
  const parseArr = v => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string' && v.startsWith('[')) { try { return JSON.parse(v); } catch {} }
    return [];
  };
  const pick = p => ({
    dept: (p.department || '').replace('中国区-', '').replace('手机部-', ''),
    about: p.about_me || '',
    interests: parseArr(p.interests).join('/'),
    taste: parseArr(p.taste_pref).join('/'),
    time: p.time_pref || '',
  });
  const aP = pick(profileA);
  const bP = pick(profileB);

  const highlightHint = DAILY_HIGHLIGHTS.map(h => `${h.location}${h.canteen}的${h.dish}（${h.desc}）`).join('；');

  const sys = `你是职场社交App的话术生成器，帮用户写午餐邀请消息。
inviteMessage写法：像真人发微信一样自然，找到一个具体的共同点（口味/时间/兴趣/部门）作为邀请理由，语气轻松友好不客套，不超过40字，只聊吃饭，不提居住地或通勤。可以自然地提到今日亮点菜品，让邀请更有话题感。
icebreakerTopics写法：生成2个开放式问题，每个问题要基于某一个具体的共同点或对方的某个特点来提问，让对方有话说，像朋友之间自然聊天，不要泛泛问"你喜欢什么"这种，要有具体切入点。也可以用今日亮点菜品作为话题切入点。
今日亮点菜品：${highlightHint}`;

  const user = `发起人：部门=${aP.dept}，自我介绍=${aP.about}，兴趣=${aP.interests}，口味=${aP.taste}，用餐时间=${aP.time}
被邀请人：部门=${bP.dept}，自我介绍=${bP.about}，兴趣=${bP.interests}，口味=${bP.taste}，用餐时间=${bP.time}
输出：{"inviteMessage":"","icebreakerTopics":["",""]}`;

  try {
    const raw = await _callMiMo(sys, user, 0.8);
    console.log('[MIMO-LUNCH] raw:', raw?.slice(0, 300));
    const parsed = JSON.parse(_extractJSON(raw));
    if (!parsed.inviteMessage) throw new Error('empty inviteMessage');
    return parsed;
  } catch (e) {
    console.warn('[MIMO-LUNCH] 失败:', e.message);
    return { inviteMessage: '嘿，要不要一起？', icebreakerTopics: [] };
  }
}

/** ③-B 通勤拼车破冰话术生成 */
async function generateCommuteIcebreaker(profileA, profileB) {
  const parseArr = v => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string' && v.startsWith('[')) { try { return JSON.parse(v); } catch {} }
    return [];
  };
  const pick = p => ({
    dept: (p.department || '').replace('中国区-', '').replace('手机部-', ''),
    about: p.about_me || '',
    interests: parseArr(p.interests).join('/'),
    area: p.commute_area || '',
    time: p.commute_time || p.time_pref || '',
    transport: p.transport || '',
  });
  const aP = pick(profileA);
  const bP = pick(profileB);

  const sys = `你是职场社交App的话术生成器，帮用户写通勤拼车邀请消息。
inviteMessage写法：像真人发微信一样口语化，找到路线或时间上的具体共同点作为理由，可以提交通方式或顺路这件事，语气轻松随意不正式，不超过40字，只聊通勤，不提吃饭或食堂。
icebreakerTopics写法：生成2个开放式问题，从对方的兴趣/部门/通勤经历里找切入点来提问，让对方有话说，像路上随口聊起来的感觉，不要泛泛问"你平时喜欢什么"。`;

  const user = `发起人：部门=${aP.dept}，自我介绍=${aP.about}，兴趣=${aP.interests}，出发地=${aP.area}，出发时间=${aP.time}，交通方式=${aP.transport}
被邀请人：部门=${bP.dept}，自我介绍=${bP.about}，兴趣=${bP.interests}，出发地=${bP.area}，出发时间=${bP.time}，交通方式=${bP.transport}
输出：{"inviteMessage":"","icebreakerTopics":["",""]}（2个话题）`;

  try {
    const raw = await _callMiMo(sys, user, 0.8);
    console.log('[MIMO-COMMUTE] raw:', raw?.slice(0, 300));
    const parsed = JSON.parse(_extractJSON(raw));
    if (!parsed.inviteMessage) throw new Error('empty inviteMessage');
    return parsed;
  } catch (e) {
    console.warn('[MIMO-COMMUTE] 失败:', e.message);
    return { inviteMessage: '嘿，要不要一起？', icebreakerTopics: [] };
  }
}


/** ④ 每日幸运餐 / 星座趣味推荐 */
async function dailyRecommendation(date, zodiac) {
  const sys = `You are a daily inspiration assistant for "Mi搭子" workplace app.
Generate fun daily recommendations for a Chinese workplace user.
Output ONLY valid JSON, no explanation, no markdown.
Output format: {"keywords":"2-3 Chinese social keywords for today","recommended_food":"specific lunch recommendation with brief reason in Chinese ≤20 chars","social_tip":"one practical fun Chinese social tip ≤30 chars","lucky_number":a number 1-99}`;

  const user = `Today: ${date}, User zodiac: ${zodiac}
Generate daily recommendation:`;

  try {
    return JSON.parse(_extractJSON(await _callMiMo(sys, user, 0.9)));
  } catch {
    return { keywords: '', recommended_food: '', social_tip: '', lucky_number: 0 };
  }
}

module.exports = { understandProfile, matchCandidates, generateLunchIcebreaker, generateCommuteIcebreaker, dailyRecommendation };
