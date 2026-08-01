/**
 * 匹配引擎
 * 规则初筛（纯代码） + MiMo 精排
 */
const { pool } = require('../../database/mock-db');
const { matchCandidates, generateIcebreaker } = require('./mimo');

/**
 * 场景权重配置
 * lunch:   侧重口味+社交  时间30/地点15/口味20/兴趣15/社交20
 * commute: 侧重路线重合   时间35/地点35/口味0/兴趣15/社交15
 */
const WEIGHTS = {
  lunch:   { time: 30, location: 15, taste: 20, interest: 15, social: 20 },
  commute: { time: 35, location: 35, taste: 0,  interest: 15, social: 15 },
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

  // 通勤场景不查 department
  const userFields = isCommute
    ? 'u.nickname, u.avatar_url'
    : 'u.nickname, u.department, u.avatar_url';

  const [candidates] = await pool.query(`
    SELECT p.*, ${userFields}
    FROM profiles p
    JOIN users u ON p.user_id = u.id
    WHERE p.scene = ? AND p.user_id != ?
  `, [scene, userId]);

  const results = [];
  for (const c of candidates) {
    let score = 0;

    // 时间匹配
    if (myProfile.time_pref && c.time_pref) {
      const diff = timeDiffMinutes(myProfile.time_pref, c.time_pref);
      if (diff !== null) {
        if (diff <= 15) score += w.time;
        else if (diff <= 30) score += Math.floor(w.time / 2);
        else continue; // 时间差>30min，排除
      } else {
        score += Math.floor(w.time / 2);
      }
    }

    // 地点/路线匹配（通勤场景权重更高）
    if (myProfile.location_pref && c.location_pref) {
      if (myProfile.location_pref === c.location_pref) score += w.location;
      else score += Math.floor(w.location / 3);
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

    // 社交偏好匹配
    if (myProfile.social_pref && c.social_pref) {
      if (myProfile.social_pref === c.social_pref) score += w.social;
      else score += Math.floor(w.social / 2);
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
 * 完整匹配流程：规则初筛 → MiMo 精排 → 破冰生成 → 写入匹配记录 → 返回 Top3
 */
async function doMatch(userId, scene) {
  const candidates = await ruleFilter(userId, scene);
  if (candidates.length === 0) return [];

  const [myRows] = await pool.query(
    'SELECT * FROM profiles WHERE user_id = ? AND scene = ?',
    [userId, scene]
  );
  if (myRows.length === 0) return candidates.slice(0, 3);

  const myProfile = myRows[0];
  const mimoResults = await matchCandidates(myProfile, candidates, scene);

  // 合并规则分数和 MiMo 分数
  for (const r of mimoResults) {
    const matched = candidates.find(c => c.user_id === Number(r.candidate_id));
    if (matched) {
      r.rule_score = matched.rule_score;
      r.nickname = matched.nickname;
      r.avatar_url = matched.avatar_url;
    }
  }

  mimoResults.sort((a, b) => (b.score || 0) - (a.score || 0));
  const top3 = mimoResults.slice(0, 3);

  // 为每个匹配生成破冰话术 + 写入 matches 表
  for (const r of top3) {
    const candidateUserId = Number(r.candidate_id);
    const candidateProfile = candidates.find(c => c.user_id === candidateUserId)?.profile;

    // 生成破冰话术
    let icebreaker = { inviteMessage: '一起呀~', icebreakerTopics: [] };
    if (candidateProfile) {
      try {
        icebreaker = await generateIcebreaker(myProfile, candidateProfile, scene);
      } catch (e) {
        console.warn('破冰生成失败:', e.message);
      }
    }
    r.icebreaker = icebreaker;

    // 写入 matches 表
    try {
      const [insertResult] = await pool.query(`
        INSERT INTO matches (user_a_id, user_b_id, scene, score, reason, icebreaker)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        userId, candidateUserId, scene,
        r.score || r.rule_score || 0,
        r.reason || '',
        JSON.stringify(icebreaker),
      ]);
      r.match_id = insertResult.insertId;
    } catch (e) {
      console.warn('写入匹配记录失败:', e.message);
    }
  }

  return top3;
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

module.exports = { ruleFilter, doMatch };
