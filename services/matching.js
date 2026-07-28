/**
 * 匹配引擎
 * 规则初筛（纯代码） + MiMo 精排
 */
const { pool } = require('../db');
const { matchCandidates, generateIcebreaker } = require('./mimo');

/**
 * 规则初筛：同场景 + 时间差≤30min + 排除自己，按规则分数排序取 Top10
 */
async function ruleFilter(userId, scene) {
  const [myRows] = await pool.query(
    'SELECT * FROM profiles WHERE user_id = ? AND scene = ?',
    [userId, scene]
  );
  if (myRows.length === 0) return [];
  const myProfile = myRows[0];

  const [candidates] = await pool.query(`
    SELECT p.*, u.nickname, u.department, u.avatar_url
    FROM profiles p
    JOIN users u ON p.user_id = u.id
    WHERE p.scene = ? AND p.user_id != ?
  `, [scene, userId]);

  const results = [];
  for (const c of candidates) {
    let score = 0;

    // 时间匹配 (30分)
    if (myProfile.time_pref && c.time_pref) {
      const diff = timeDiffMinutes(myProfile.time_pref, c.time_pref);
      if (diff !== null) {
        if (diff <= 15) score += 30;
        else if (diff <= 30) score += 15;
        else continue; // 时间差>30min，排除
      } else {
        score += 15;
      }
    }

    // 地点/路线匹配 (25分)
    if (myProfile.location_pref && c.location_pref) {
      if (myProfile.location_pref === c.location_pref) score += 25;
      else score += 10;
    }

    // 口味匹配 (15分)
    const myTaste = parseJSON(myProfile.taste_pref, []);
    const cTaste = parseJSON(c.taste_pref, []);
    if (myTaste.length && cTaste.length) {
      const overlap = myTaste.filter(t => cTaste.includes(t));
      if (overlap.length === myTaste.length) score += 15;
      else if (overlap.length > 0) score += 8;
    }

    // 兴趣标签匹配 (15分)
    const myInterests = parseJSON(myProfile.interests, []);
    const cInterests = parseJSON(c.interests, []);
    if (myInterests.length && cInterests.length) {
      const common = myInterests.filter(t => cInterests.includes(t));
      const total = [...new Set([...myInterests, ...cInterests])];
      if (total.length > 0) score += Math.floor(common.length / total.length * 15);
    }

    // 社交偏好匹配 (15分)
    if (myProfile.social_pref && c.social_pref) {
      if (myProfile.social_pref === c.social_pref) score += 15;
      else score += 8;
    }

    if (score > 0) {
      results.push({
        user_id: c.user_id,
        nickname: c.nickname,
        department: c.department,
        avatar_url: c.avatar_url,
        rule_score: score,
        profile: c,
      });
    }
  }

  results.sort((a, b) => b.rule_score - a.rule_score);
  return results.slice(0, 10);
}

/**
 * 完整匹配流程：规则初筛 → MiMo 精排 → 返回 Top3
 */
async function doMatch(userId, scene) {
  const candidates = await ruleFilter(userId, scene);
  if (candidates.length === 0) return [];

  const [myRows] = await pool.query(
    'SELECT * FROM profiles WHERE user_id = ? AND scene = ?',
    [userId, scene]
  );
  if (myRows.length === 0) return candidates.slice(0, 3);

  const mimoResults = await matchCandidates(myRows[0], candidates, scene);

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
  return mimoResults.slice(0, 3);
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
