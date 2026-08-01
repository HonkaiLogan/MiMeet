/**
 * MiMo API 封装
 * 1. 画像理解  2. 匹配精排  3. 破冰话术  4. 每日推荐
 */
const axios = require('axios');

const MIMO_API_URL = process.env.MIMO_API_URL || '';
const MIMO_API_KEY = process.env.MIMO_API_KEY || '';

async function _callMiMo(prompt, temperature = 0.7) {
  // TODO: 接入真实 MiMo API
  // const resp = await axios.post(MIMO_API_URL, {
  //   prompt, temperature
  // }, {
  //   headers: { Authorization: `Bearer ${MIMO_API_KEY}` },
  //   timeout: 10000,
  // });
  // return resp.data.text;
  return '{"placeholder": "MiMo API 待接入"}';
}

/** ① 画像理解：将用户原始偏好整合为结构化画像 */
async function understandProfile(rawPrefs) {
  const prompt = `你是"Mi搭子"的画像理解引擎。
用户原始偏好：${JSON.stringify(rawPrefs)}
请输出结构化画像 JSON：persona, matchPriority, avoidTags`;
  try {
    return JSON.parse(await _callMiMo(prompt));
  } catch {
    return { persona: '', matchPriority: [], avoidTags: [] };
  }
}

/** ② 匹配精排：对初筛候选人打分排序，生成推荐理由
 *  MiMo 未接入时,fallback 用 rule_score 直接生成理由/标签
 */
async function matchCandidates(profileA, candidates, scene) {
  const hasMiMo = MIMO_API_URL && MIMO_API_KEY && !MIMO_API_KEY.startsWith('your-');
  if (!hasMiMo) {
    return candidates.map(c => ({
      candidate_id: c.user_id,
      score: c.rule_score,
      reason: buildFallbackReason(profileA, c, scene),
      commonTags: buildFallbackTags(profileA, c, scene),
    }));
  }

  const prompt = `你是"Mi搭子"的智能匹配引擎。用户正在找【${scene}】搭子。
用户画像：${JSON.stringify(profileA)}
候选人列表：${JSON.stringify(candidates)}
请为每位候选人打分(0-100)，输出 JSON 数组：candidate_id, score, reason, commonTags`;
  try {
    const parsed = JSON.parse(await _callMiMo(prompt));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return candidates.map(c => ({
      candidate_id: c.user_id, score: c.rule_score, reason: '', commonTags: [],
    }));
  }
}

function buildFallbackReason(me, c, scene) {
  const bits = [];
  const cp = c.profile || {};
  if (scene === 'lunch') {
    if (me.time_pref && cp.time_pref && me.time_pref === cp.time_pref) bits.push(`都在 ${me.time_pref} 用餐`);
    if (me.social_pref && cp.social_pref && me.social_pref === cp.social_pref) bits.push(`都喜欢${me.social_pref}`);
  } else if (scene === 'commute') {
    if (me.commute_area && cp.commute_area && me.commute_area === cp.commute_area) bits.push(`都住在${me.commute_area}`);
    if (me.transport && cp.transport && me.transport === cp.transport) bits.push(`都习惯${me.transport}`);
  }
  const parseArr = v => { try { return Array.isArray(v) ? v : JSON.parse(v || '[]'); } catch { return []; } };
  const overlap = parseArr(me.interests).filter(t => parseArr(cp.interests).includes(t));
  if (overlap.length) bits.push(`兴趣重合: ${overlap.slice(0, 3).join('、')}`);
  return bits.length ? bits.join(',') : '和 ta 试试看';
}

function buildFallbackTags(me, c, scene) {
  const tags = [];
  const cp = c.profile || {};
  const parseArr = v => { try { return Array.isArray(v) ? v : JSON.parse(v || '[]'); } catch { return []; } };
  if (scene === 'lunch') {
    const taste = parseArr(cp.taste_pref);
    if (taste.length) tags.push(`${taste[0]}口味`);
    if (cp.time_pref) tags.push(`${cp.time_pref}用餐`);
    if (cp.social_pref) tags.push(cp.social_pref);
  } else {
    if (cp.commute_area) tags.push(cp.commute_area);
    if (cp.commute_time) tags.push(`${cp.commute_time}出发`);
    if (cp.transport) tags.push(cp.transport);
  }
  return tags.slice(0, 3);
}

/** ③ 破冰话术生成 */
async function generateIcebreaker(profileA, profileB, scene) {
  const prompt = `你是职场轻社交破冰助手。
用户A：${JSON.stringify(profileA)}
用户B：${JSON.stringify(profileB)}
场景：${scene}
请输出 JSON：inviteMessage, icebreakerTopics`;
  try {
    return JSON.parse(await _callMiMo(prompt));
  } catch {
    return { inviteMessage: '', icebreakerTopics: [] };
  }
}

/** ④ 每日幸运推荐 */
async function dailyRecommendation(date, zodiac) {
  const prompt = `你是Mi搭子的每日推荐助手。今天是${date}，用户是${zodiac}座。
请输出 JSON：keywords, recommended_food, social_tip`;
  try {
    return JSON.parse(await _callMiMo(prompt));
  } catch {
    return { keywords: '', recommended_food: '', social_tip: '' };
  }
}

module.exports = { understandProfile, matchCandidates, generateIcebreaker, dailyRecommendation };
