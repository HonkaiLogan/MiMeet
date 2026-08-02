/**
 * 匹配引擎
 * 规则初筛（纯代码） + Python MiMo 精排 + 破冰话术生成
 */
const { pool } = require('../../database');
// 破冰话术统一走 Python 服务，Node mimo.js 仅作降级备用
const { generateLunchIcebreaker, generateCommuteIcebreaker } = require('./mimo');

const PYTHON_SVC = process.env.PYTHON_SVC_URL || 'http://localhost:8000';

// 真实园区食堂，按口味标签分组
const CANTEENS = [
  { name: '2010餐厅·称重餐线', location: '科技园CD栋', tags: ['清淡', '米饭', '轻食'], avgPrice: '20-35元', walk: '步行3分钟' },
  { name: '米宴北京·餐线',     location: '科技园AB栋', tags: ['米饭', '清淡'],         avgPrice: '25-40元', walk: '步行5分钟' },
  { name: '星辰大海·餐线',     location: '科技园B2',   tags: ['面食', '清淡', '米饭'], avgPrice: '20-35元', walk: '步行4分钟' },
  { name: '轻食餐线·卤肉饭',   location: '科技园B1',   tags: ['轻食', '沙拉', '清淡'], avgPrice: '30-45元', walk: '步行2分钟' },
  { name: '清河大排档·麻辣烫', location: '园区南门',   tags: ['辣', '面食'],           avgPrice: '25-40元', walk: '步行8分钟' },
  { name: '清河大排档·铁板',   location: '园区南门',   tags: ['辣', '米饭'],           avgPrice: '30-45元', walk: '步行8分钟' },
  { name: '小吃岛',            location: '科技园C栋',  tags: ['轻食', '面食', '沙拉'], avgPrice: '15-30元', walk: '步行6分钟' },
  { name: '襄阳牛肉面档口',    location: '科技园B1',   tags: ['面食', '辣'],           avgPrice: '20-30元', walk: '步行2分钟' },
];

function recommendCanteen(tastePrefs) {
  const tastes = Array.isArray(tastePrefs) ? tastePrefs : [];
  if (tastes.length === 0) return CANTEENS[0];
  const scored = CANTEENS.map(c => ({
    ...c,
    score: tastes.filter(t => c.tags.includes(t)).length,
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

/**
 * 场景权重配置
 * lunch:   时间30/地点25/口味15/兴趣15/社交15
 * commute: 时间35/地点35/口味0/兴趣15/社交15
 */
const WEIGHTS = {
  lunch:   { time: 30, location: 25, taste: 15, interest: 15, social: 15 },
  commute: { time: 40, location: 25, transport: 20, interest: 10, social: 5 },
};

/**
 * 规则初筛：同场景 + 时间差≤30min + 排除自己，按规则分数排序取 Top10
 * 通勤场景：隐藏部门信息，侧重路线重合度
 * 午餐场景：侧重口味与社交偏好
 */
async function ruleFilter(userId, scene) {
  const [myRows] = await pool.query(
    'SELECT * FROM profiles WHERE user_id = ? AND scene = ?',
    [userId, scene]
  );
  if (myRows.length === 0) return [];
  const myProfile = myRows[0];

  const w = WEIGHTS[scene] || WEIGHTS.lunch;
  const isCommute = scene === 'commute';

  const userFields = 'u.nickname, u.department, u.avatar_url, u.about_me';

  const [candidates] = await pool.query(`
    SELECT p.*, ${userFields}
    FROM profiles p
    JOIN users u ON p.user_id = u.id
    WHERE p.scene = ? AND p.user_id != ?
  `, [scene, userId]);

  const results = [];
  for (const c of candidates) {
    let score = 0;

    // 时间匹配：≤15min满分，15-30min递减，>30min排除
    if (myProfile.time_pref && c.time_pref) {
      const diff = timeDiffMinutes(myProfile.time_pref, c.time_pref);
      if (diff !== null) {
        if (diff <= 15) score += w.time;
        else if (diff <= 30) score += Math.round(w.time * (1 - (diff - 15) / 15));
        else continue;
      } else {
        score += Math.floor(w.time / 2);
      }
    }

    // 地点/路线匹配：通勤场景用 commute_area，出发地不同直接排除
    if (isCommute) {
      if (!myProfile.commute_area || !c.commute_area || myProfile.commute_area !== c.commute_area) continue;
      score += w.location;

      // 交通方式匹配：相同满分，可拼车（打车/顺风车）半分
      if (w.transport > 0 && myProfile.transport && c.transport) {
        const carpool = ['打车', '顺风车'];
        if (myProfile.transport === c.transport) {
          score += w.transport;
        } else if (carpool.includes(myProfile.transport) && carpool.includes(c.transport)) {
          score += Math.floor(w.transport / 2);
        }
      }
    } else if (myProfile.location_pref && c.location_pref) {
      if (myProfile.location_pref === c.location_pref) {
        score += w.location;
      } else if (isAdjacentArea(myProfile.location_pref, c.location_pref)) {
        score += Math.floor(w.location / 2);
      }
    }

    // 口味匹配（通勤场景跳过）
    if (w.taste > 0) {
      const myTaste = parseJSON(myProfile.taste_pref, []);
      const cTaste = parseJSON(c.taste_pref, []);
      if (myTaste.length && cTaste.length) {
        const overlap = myTaste.filter(t => cTaste.includes(t));
        if (overlap.length === myTaste.length) score += w.taste;
        else if (overlap.length > 0) score += Math.floor(w.taste / 2);
      }
    }

    // 兴趣标签匹配
    const myInterests = parseJSON(myProfile.interests, []);
    const cInterests = parseJSON(c.interests, []);
    if (myInterests.length && cInterests.length) {
      const common = myInterests.filter(t => cInterests.includes(t));
      const total = [...new Set([...myInterests, ...cInterests])];
      if (total.length > 0) score += Math.floor(common.length / total.length * w.interest);
    }

    // 社交偏好：一致满分，兼容半分，冲突0分
    if (myProfile.social_pref && c.social_pref) {
      if (myProfile.social_pref === c.social_pref) score += w.social;
      else if (!isConflictSocial(myProfile.social_pref, c.social_pref)) score += Math.floor(w.social / 2);
    }

    if (score > 0) {
      const entry = {
        user_id: c.user_id,
        nickname: c.nickname,
        avatar_url: c.avatar_url,
        rule_score: score,
        profile: c,
      };
      // 只有午餐场景才返回部门信息
      if (!isCommute) entry.department = c.department;
      results.push(entry);
    }
  }

  results.sort((a, b) => b.rule_score - a.rule_score);
  return results.slice(0, 10);
}

/**
 * 完整匹配流程：规则初筛 → MiMo 精排 → 去重 → 60%按分+40%随机 → 破冰生成 → 写入记录
 * @param {number} userId
 * @param {string} scene
 * @param {number[]} seenUserIds - 本次会话已推过的 user_id，用于去重
 */
async function doMatch(userId, scene, seenUserIds = []) {
  const candidates = await ruleFilter(userId, scene);
  if (candidates.length === 0) return [];

  const [myRows] = await pool.query(
    `SELECT p.*, u.department, u.about_me FROM profiles p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = ? AND p.scene = ?`,
    [userId, scene]
  );
  if (myRows.length === 0) return candidates.slice(0, 3);

  const myProfile = myRows[0];

  // 调 Python MiMo 服务精排，失败则保留规则分数
  let mimoScores = null;
  try {
    const pyRes = await fetch(`${PYTHON_SVC}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_profile: myProfile,
        candidates: candidates.map(c => ({
          candidate_id: String(c.user_id),
          nickname: c.nickname,
          department: c.department,
          about_me: c.profile?.about_me || '',
          interests: c.profile?.interests || [],
          taste_pref: c.profile?.taste_pref || [],
          time_pref: c.profile?.time_pref || '',
          commute_area: c.profile?.commute_area || '',
          transport: c.profile?.transport || '',
          social_pref: c.profile?.social_pref || '',
        })),
        scene,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const pyJson = await pyRes.json();
    if (pyJson.code === 200 && Array.isArray(pyJson.data) && pyJson.data.length > 0) {
      mimoScores = pyJson.data;
    }
  } catch (e) {
    console.warn('[matching] Python MiMo 精排失败，降级规则分数:', e.message);
  }

  const mimoResults = candidates.map(c => {
    const cProfile = c.profile || c;
    const myTastes = parseJSON(myProfile.taste_pref, []);
    const cTastes = parseJSON(cProfile.taste_pref, []);
    const combinedTastes = [...new Set([...myTastes, ...cTastes])];
    const canteen = scene === 'lunch' ? recommendCanteen(combinedTastes) : null;
    const commuteInfo = scene === 'commute' ? {
      area: cProfile.commute_area || '',
      time: cProfile.time_pref || '',
      transport: cProfile.transport || '打车',
    } : null;

    // 用 Python MiMo 精排分数覆盖规则分数（若有）
    const mimoEntry = mimoScores && mimoScores.find(m => String(m.candidate_id) === String(c.user_id));
    const finalScore = mimoEntry ? mimoEntry.score : c.rule_score;
    const finalReason = mimoEntry?.reason || buildReason(myProfile, cProfile, scene);
    const finalTags = mimoEntry?.commonTags?.length ? mimoEntry.commonTags : buildCommonTags(myProfile, cProfile);

    return {
      candidate_id: String(c.user_id),
      score: finalScore,
      reason: finalReason,
      commonTags: finalTags,
      rule_score: c.rule_score,
      nickname: c.nickname,
      avatar_url: c.avatar_url,
      department: c.department,
      recommended_canteen: canteen,
      commute_info: commuteInfo,
    };
  });

  // 去重：过滤掉本次会话已推过的
  const seen = new Set(seenUserIds.map(Number));
  const filtered = mimoResults.filter(r => !seen.has(Number(r.candidate_id)));

  // 候选不足时放开去重限制，避免空结果
  const pool_ = filtered.length >= 3 ? filtered : mimoResults;

  // 排序
  pool_.sort((a, b) => (b.score || 0) - (a.score || 0));

  // 60% 按分高递减（前 ceil(3*0.6)=2 名），40% 随机补充（1 名）
  const topCount = Math.ceil(3 * 0.6); // 2
  const randCount = 3 - topCount;      // 1

  const top = pool_.slice(0, topCount);
  const rest = pool_.slice(topCount);
  const random = rest.sort(() => Math.random() - 0.5).slice(0, randCount);

  const pick3 = [...top, ...random];

  // 写入 matches 表，MiMo 异步生成话术（15s 超时），失败用 fallback 兜底
  for (const r of pick3) {
    const candidateUserId = Number(r.candidate_id);
    const candidateProfile = candidates.find(c => c.user_id === candidateUserId)?.profile;
    r.icebreaker = { inviteMessage: '', icebreakerTopics: [] };

    try {
      const [insertResult] = await pool.query(`
        INSERT INTO matches (user_a_id, user_b_id, scene, score, reason, icebreaker)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        userId, candidateUserId, scene,
        r.score || r.rule_score || 0,
        r.reason || '',
        '{}',
      ]);
      r.match_id = insertResult.insertId;

      if (candidateProfile) {
        const matchId = insertResult.insertId;
        const fallbackIce = buildFallbackIcebreaker(myProfile, candidateProfile, r, scene);

        // 优先走 Python 服务生成破冰话术
        const pyIcePromise = fetch(`${PYTHON_SVC}/icebreaker`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_a: myProfile, profile_b: candidateProfile, scene }),
          signal: AbortSignal.timeout(15000),
        })
          .then(r => r.json())
          .then(j => (j.data && j.data.inviteMessage) ? j.data : null)
          .catch(() => null);

        // Python 失败时降级到 Node mimo.js
        const iceFn = scene === 'commute' ? generateCommuteIcebreaker : generateLunchIcebreaker;
        const nodeIcePromise = pyIcePromise.then(ice => {
          if (ice) return ice;
          return Promise.race([
            iceFn(myProfile, candidateProfile),
            new Promise(resolve => setTimeout(() => resolve(null), 12000)),
          ]).then(ice => (ice && ice.inviteMessage) ? ice : fallbackIce).catch(() => fallbackIce);
        });

        nodeIcePromise.then(ice => {
          pool.query('UPDATE matches SET icebreaker = ? WHERE id = ?', [JSON.stringify(ice), matchId])
            .catch(e => console.warn('[ICE] DB写入失败:', e.message));
        });
      }
    } catch (e) {
      console.warn('写入匹配记录失败:', e.message);
    }
  }

  return pick3;
}

// --- 工具函数 ---

function timeDiffMinutes(t1, t2) {
  const m1 = parseTime(t1);
  const m2 = parseTime(t2);
  if (m1 === null || m2 === null) return null;
  return Math.abs(m1 - m2);
}

function parseTime(str) {
  if (!str) return null;
  const parts = str.split(':');
  if (parts.length < 2) return null;
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function parseJSON(val, fallback) {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

function buildCommonTags(a, b) {
  const ai = parseJSON(a.interests, []);
  const bi = parseJSON(b.interests, []);
  return ai.filter(t => bi.includes(t)).slice(0, 3);
}

function buildReason(a, b, scene) {
  const tags = buildCommonTags(a, b);
  if (scene === 'commute') {
    if (a.commute_area && a.commute_area === b.commute_area) return `同在${a.commute_area}出发`;
    if (tags.length) return `都喜欢${tags[0]}`;
    return '路线相近';
  }
  const at = parseJSON(a.taste_pref, []);
  const bt = parseJSON(b.taste_pref, []);
  const common = at.filter(t => bt.includes(t));
  if (common.length) return `口味都偏${common[0]}`;
  if (tags.length) return `都喜欢${tags[0]}`;
  if (a.time_pref === b.time_pref) return `都${a.time_pref}吃饭`;
  return '偏好相近';
}

function buildFallbackIcebreaker(a, b, matchResult, scene) {
  const tags = matchResult.commonTags || buildCommonTags(a, b);
  const tag0 = tags[0] || '';
  const aDept = (a.department || '').replace('中国区-', '').replace('手机部-', '');
  const bDept = (b.department || '').replace('中国区-', '').replace('手机部-', '');
  // 从自我介绍里提取第一个"喜欢X"的关键词
  const bAbout = b.about_me || '';
  const bHobbyMatch = bAbout.match(/喜欢([^，,。！]+)/);
  const bHobby = bHobbyMatch ? bHobbyMatch[1].split('和')[0].trim() : '';
  const bMbti = (bAbout.match(/[A-Z]{4}/) || [])[0] || '';
  const seed = Math.abs(((a.user_id || 1) * 7) ^ ((b.user_id || 3) * 13)) % 3;

  if (scene === 'commute') {
    const area = a.commute_area || b.commute_area || '';
    const time = a.time_pref || '早上';
    const transport = a.transport || '打车';
    const commonTagCount = (matchResult.commonTags || buildCommonTags(a, b)).length;
    const msgs = [
      area ? `我每天大概${time}从${area}出发，看你方向也差不多，要不要拼个${transport}？路上也有个人说话` : `嗨，我们出发时间差不多，要不要一起通勤？`,
      bHobby ? `看到你喜欢${bHobby}，我们可以${transport}路上聊聊，要不要一起？` : (area ? `我也是${area}出发，${time}左右，要不要一起${transport}上班？` : `嗨，我们通勤路线相近，要不要一起${transport}？`),
      commonTagCount > 0 ? `嗨，我们有${commonTagCount}个共同兴趣标签，感觉合得来，${time}一起通勤认识一下？` : `嗨，看你${time}也要出发，要不要搭个伴？`,
    ];
    const topics = bHobby
      ? [`你提到喜欢${bHobby}，最近有没有什么新发现？`, `你们${bDept}平时和${aDept}有合作机会吗？`]
      : (tag0 ? [`你在${tag0}上最近有什么新想法？`, `通勤一般要多久？`] : [`你在${bDept}主要做什么方向？`, `通勤一般要多久？`]);
    return { inviteMessage: msgs[seed], icebreakerTopics: topics };
  }

  const aTaste = parseJSON(a.taste_pref, []);
  const taste = aTaste[0] || '好吃的';
  const time = a.time_pref || '中午';
  const commonTagCount = (matchResult.commonTags || buildCommonTags(a, b)).length;

  const tagMsgs = {
    'AI':   [
      `嗨，看到你也关注AI，我们${time}一起去食堂吃饭聊聊？`,
      bHobby ? `看到你喜欢${bHobby}，我们在AI上也有共同兴趣，${time}一起吃饭？` : `你好，我们都在关注AI，${time}一起去吃${taste}的认识一下？`
    ],
    '产品': [
      `你好，我们都做产品，${time}一起吃饭聊聊各自遇到的坑？`,
      bHobby ? `看到你喜欢${bHobby}，感觉挺有意思，${time}一起吃饭聊聊？` : `嗨，${time}找到产品搭子了，一起去吃${taste}的？`
    ],
    '技术': [
      `你好，${aDept}和${bDept}的技术人，${time}一起吃饭交流一下？`,
      bMbti ? `看到你是${bMbti}，感觉聊得来，${time}一起吃饭？` : `嗨，${time}和${bDept}的技术同学一起吃饭，互相学习一下~`
    ],
    '旅行': [
      `你好，我们都喜欢旅行，${time}一起吃饭聊聊下一站去哪？`,
      bHobby ? `看到你喜欢${bHobby}和旅行，感觉挺合得来，${time}一起吃饭？` : `嗨，${time}吃${taste}，顺便交流旅行心得？`
    ],
    '设计': [
      `你好，看到你做设计，${time}一起吃饭取取经？`,
      `嗨，${time}找到设计搭子了，一起去吃饭互相交流~`
    ],
  };

  const tagTopics = {
    'AI':   [`你们${bDept}在AI上最近有什么新方向？`, bHobby ? `你是怎么把${bHobby}和AI结合的？` : `你觉得${bDept}和${aDept}在AI上最大的差异是什么？`],
    '产品': [`你们${bDept}的产品节奏和${aDept}有什么不同？`, `你们现在最难啃的是什么功能？`],
    '技术': [`你们${bDept}主要用什么技术栈？`, bMbti ? `${bMbti}的工程师一般怎么处理需求不清晰的时候？` : `你们${bDept}代码审查怎么做的？`],
    '旅行': [bHobby && bHobby !== '旅行' ? `你喜欢${bHobby}，旅行时会特意去体验相关的吗？` : `最近有没有好的路线推荐？`, `你倾向一个人还是组团出行？`],
    '设计': [`你们${bDept}怎么平衡设计美感和需求？`, `最近有没有让你眼前一亮的界面？`],
  };

  const defaultMsgs = [
    bHobby ? `嗨，看到你喜欢${bHobby}，感觉挺有意思，${time}一起去吃${taste}的聊聊？` : `你好，我们都在${time}吃饭，口味也相近，要一起去食堂吗？`,
    commonTagCount > 0 ? `嗨，我们有${commonTagCount}个共同兴趣标签，感觉合得来，发个邀请试试～` : `你好，我们出发时间差不多，${time}一起去食堂，不用一个人占位子等~`,
    `嗨，看到你也偏好${taste}，我们${time}一起去食堂吧？`,
  ];
  const defaultTopics = [
    bHobby ? `你之前提到喜欢${bHobby}，最近有没有什么推荐的？` : `你在食堂有发现什么隐藏好吃的吗？`,
    `你们${bDept}最近在做什么方向？感觉和我们有点交叉`,
  ];

  const msgs = (tag0 && tagMsgs[tag0]) ? tagMsgs[tag0] : defaultMsgs;
  const topics = (tag0 && tagTopics[tag0]) ? tagTopics[tag0] : defaultTopics;

  return { inviteMessage: msgs[seed % msgs.length], icebreakerTopics: topics };
}

// 相邻区域定义（北京地铁沿线）
const ADJACENT_AREAS = {
  '回龙观': ['上地', '西二旗', '天通苑'],
  '上地':   ['回龙观', '西二旗', '五道口'],
  '西二旗': ['回龙观', '上地'],
  '天通苑': ['回龙观', '望京'],
  '望京':   ['天通苑', '五道口'],
  '五道口': ['上地', '望京'],
};

function isAdjacentArea(a, b) {
  return (ADJACENT_AREAS[a] || []).includes(b);
}

// 冲突社交偏好：想聊天 vs 安静吃饭
function isConflictSocial(a, b) {
  const conflictPairs = [['轻松聊天', '安静吃饭'], ['想认识新朋友', '安静吃饭'], ['轻松聊天', '安静'], ['想认识新朋友', '安静']];
  return conflictPairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

module.exports = { ruleFilter, doMatch, buildFallbackIcebreakerPublic: buildFallbackIcebreaker };
