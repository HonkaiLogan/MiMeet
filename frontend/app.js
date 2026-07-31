/**
 * Mi搭子 - 前端应用（完整版）
 *
 * 技术栈：HTML5 + Tailwind CSS + 原生 JavaScript（SPA单页应用）
 * 后端：Node.js + Express（对接中）
 */

// ============ 配置 ============
const BASE_URL = "http://localhost:3000";
const APP_CONFIG = { appName: "Mi搭子", version: "1.0.0", maxTasteCount: 3, maxInterestCount: 5 };
const AVATARS = {
  '小米同学': './assets/avatar-01.jpg',
  '吴同学': './assets/avatar-02.jpg',
  '李同学': './assets/avatar-03.jpg',
  '王同学': './assets/avatar-04.jpg',
  '刘同学': './assets/avatar-05.jpg',
  '陈同学': './assets/avatar-06.jpg',
  '黄同学': './assets/avatar-05.jpg',
  '赵同学': './assets/avatar-06.jpg',
  '周同学': './assets/avatar-03.jpg',
  '张同学': './assets/avatar-02.jpg'
};

function avatarImg(name, cls = '') {
  const src = AVATARS[name] || AVATARS['小米同学'];
  return `<img src="${src}" alt="${name}头像" class="avatar-photo ${cls}">`;
}

function hydrateAvatarPhotos(root = document) {
  root.querySelectorAll('p').forEach(text => {
    if (text.textContent === '产品部 · 入职1年') text.textContent = '人力资源部 · 入职1年';
  });
  const labels = root.querySelectorAll('h2, h3, p');
  labels.forEach(label => {
    const name = Object.keys(AVATARS).find(candidate => label.textContent.includes(candidate));
    if (!name) return;
    const row = label.closest('.flex.items-center');
    const holder = row && row.querySelector('.rounded-full');
    if (holder && !holder.querySelector('img')) holder.innerHTML = avatarImg(name);
  });
  const ownAvatar = document.getElementById('user-avatar');
  if (ownAvatar && !ownAvatar.querySelector('img')) ownAvatar.innerHTML = avatarImg('小米同学');
  const navAvatar = document.getElementById('user-avatar-text');
  if (navAvatar && !navAvatar.querySelector('img')) navAvatar.innerHTML = avatarImg('小米同学');
}

// 选项数据
const TASTE_OPTIONS = [
  { value: "清淡", label: "清淡", icon: "🥗" },
  { value: "辣", label: "辣", icon: "🌶️" },
  { value: "米饭", label: "米饭", icon: "🍚" },
  { value: "面食", label: "面食", icon: "🍜" },
  { value: "轻食", label: "轻食", icon: "🥙" },
  { value: "火锅", label: "火锅", icon: "🍲" },
  { value: "西餐", label: "西餐", icon: "🍝" },
  { value: "日料", label: "日料", icon: "🍣" }
];
const TIME_OPTIONS = [{ value: "11:30", label: "11:30" }, { value: "12:00", label: "12:00" }, { value: "12:30", label: "12:30" }, { value: "13:00", label: "13:00" }];
const BUDGET_OPTIONS = [{ value: "20以内", label: "20元以内" }, { value: "20-40", label: "20-40元" }, { value: "40-60", label: "40-60元" }, { value: "60以上", label: "60元以上" }];
const INTEREST_OPTIONS = [
  { value: "AI", label: "AI", icon: "🤖" }, { value: "产品", label: "产品", icon: "📱" }, { value: "运营", label: "运营", icon: "📊" },
  { value: "技术", label: "技术", icon: "💻" }, { value: "设计", label: "设计", icon: "🎨" }, { value: "运动", label: "运动", icon: "⚽" },
  { value: "旅行", label: "旅行", icon: "✈️" }, { value: "电影", label: "电影", icon: "🎬" }, { value: "音乐", label: "音乐", icon: "🎵" },
  { value: "游戏", label: "游戏", icon: "🎮" }, { value: "宠物", label: "宠物", icon: "🐱" }, { value: "美食", label: "美食", icon: "🍕" }
];
const AREA_OPTIONS = [{ value: "回龙观", label: "回龙观" }, { value: "望京", label: "望京" }, { value: "通州", label: "通州" }, { value: "五道口", label: "五道口" }, { value: "天通苑", label: "天通苑" }, { value: "西二旗", label: "西二旗" }, { value: "上地", label: "上地" }];
const TRANSPORT_OPTIONS = [{ value: "打车", label: "打车", icon: "🚕" }, { value: "顺风车", label: "顺风车", icon: "🚗" }, { value: "地铁+打车", label: "地铁+打车", icon: "🚇" }, { value: "自驾", label: "自驾", icon: "🚙" }];

// ============ SVG 图标（替换 GUIDE 中约定的 6 个 emoji 图标） ============
// 用法：ICONS.bowl('w-6 h-6 text-orange-500')
const ICONS = {
  logo: (cls = 'w-10 h-10 text-white') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12a4 4 0 118 0M6 20h12M9 20v-4a3 3 0 016 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="8" r="2.5" stroke="currentColor" stroke-width="2"/></svg>`,
  bowl: (cls = 'w-6 h-6 text-orange-500') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11h18a9 9 0 01-9 9 9 9 0 01-9-9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 11V6m0 0a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 20h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  car: (cls = 'w-6 h-6 text-blue-500') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13l1.5-4.5A2 2 0 016.4 7h11.2a2 2 0 011.9 1.5L21 13v5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H6v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="16" r="1.5" fill="currentColor"/><circle cx="17" cy="16" r="1.5" fill="currentColor"/></svg>`,
  target: (cls = 'w-6 h-6 text-green-500') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`,
  robot: (cls = 'w-5 h-5 text-orange-500') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="16" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M12 8V4m0 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="13.5" r="1.3" fill="currentColor"/><circle cx="15" cy="13.5" r="1.3" fill="currentColor"/><path d="M9 17h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  chat: (cls = 'w-5 h-5 text-orange-500') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

// ============ 类型 -> 图标/配色 统一映射（首页、广场、发布页共用，避免重复维护）============
const TYPE_META = {
  lunch: { icon: ICONS.bowl, label: '午餐', bg: 'bg-orange-100', text: 'text-orange-600', btn: 'bg-orange-500', border: 'border-orange-500' },
  commute: { icon: ICONS.car, label: '通勤', bg: 'bg-blue-100', text: 'text-blue-600', btn: 'bg-blue-500', border: 'border-blue-500' },
  weekend: { icon: ICONS.target, label: '周末', bg: 'bg-green-100', text: 'text-green-600', btn: 'bg-green-500', border: 'border-green-500' }
};

// ============ 工具函数 ============
function showToast(msg, dur = 2000) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:10px 20px;border-radius:8px;font-size:14px;z-index:9999;max-width:80%;text-align:center;';
  t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, dur);
}
function setStorage(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function getStorage(k, d = null) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function removeStorage(k) { try { localStorage.removeItem(k); } catch (e) {} }
function setButtonLoading(btn, txt) { btn.disabled = true; btn.dataset.orig = btn.textContent; btn.textContent = txt; btn.style.opacity = '0.7'; }
function setButtonNormal(btn) { btn.disabled = false; btn.textContent = btn.dataset.orig || btn.textContent; btn.style.opacity = '1'; }

// 下拉刷新：touchArea 用于监听触摸手势（一般是页面主体 main），
// indicatorHost 是刷新指示条要插入到最前面的容器（一般是列表容器）。
// 页面是整体滚动的（没有内层 overflow 容器），所以用 window.scrollY 判断是否已到顶部。
function initPullToRefresh(touchArea, indicatorHost, callback) {
  if (!touchArea || !indicatorHost || touchArea.dataset.ptrBound) return;
  touchArea.dataset.ptrBound = '1';
  let startY = 0, pulling = false;
  const indicator = document.createElement('div');
  indicator.className = 'pull-indicator';
  indicator.innerHTML = '<div class="spinner"></div><span>松手刷新</span>';
  indicatorHost.prepend(indicator);
  touchArea.addEventListener('touchstart', (e) => {
    if (window.scrollY <= 0) { startY = e.touches[0].pageY; pulling = true; }
  }, { passive: true });
  touchArea.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    const dist = e.touches[0].pageY - startY;
    if (dist > 0) indicator.style.height = Math.min(dist, 60) + 'px';
  }, { passive: true });
  touchArea.addEventListener('touchend', () => {
    if (!pulling) return;
    pulling = false;
    const active = parseInt(indicator.style.height || '0', 10) >= 40;
    indicator.style.height = '0';
    if (active) callback();
  });
}

// 骨架屏卡片列表（列表/匹配页加载中占位，替代纯 spinner）
function skeletonCards(n = 3) {
  return Array.from({ length: n }).map(() => `<div class="skeleton-card flex items-center space-x-3"><div class="skeleton skeleton-avatar"></div><div class="flex-1"><div class="skeleton skeleton-line" style="width:60%"></div><div class="skeleton skeleton-line" style="width:90%"></div></div></div>`).join('');
}

// 简单表单校验：必须至少选中一项，否则显示错误提示并返回 false
function validateRequired(value, errEl) {
  const ok = Array.isArray(value) ? value.length > 0 : !!value;
  if (errEl) errEl.classList.toggle('show', !ok);
  return ok;
}

// ============ API 请求 ============
async function request(apiPath, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${apiPath}`, { headers: { "Content-Type": "application/json" }, ...options });
    const result = await res.json();
    if (result.code !== 200) { showToast(result.msg || '请求失败'); return null; }
    return result.data;
  } catch (error) { showToast('网络错误，请重试'); return null; }
}

// 用户相关
async function getUserProfile() { return await request('/api/user/getProfile', { method: 'GET' }); }
async function saveUserProfile(data) { return await request('/api/user/saveProfile', { method: 'POST', body: data }); }

// 匹配相关
async function executeMatch(type, pref) { return await request('/api/match/execute', { method: 'POST', body: { type, preference: pref } }); }
async function submitFeedback(data) { return await request('/api/match/feedback', { method: 'POST', body: data }); }
async function getMatchHistory(page, size) { return await request(`/api/match/history?page=${page}&pageSize=${size}`, { method: 'GET' }); }
async function sendInvite(targetUserId, inviteMessage) { return await request('/api/match/invite', { method: 'POST', body: { targetUserId, inviteMessage } }); }

// 搭子广场
async function getPlazaList(type, page, size) { return await request(`/api/plaza/list?type=${type}&page=${page}&pageSize=${size}`, { method: 'GET' }); }
async function publishToPlaza(data) { return await request('/api/plaza/publish', { method: 'POST', body: data }); }
async function respondToPlaza(squareId) { return await request('/api/plaza/respond', { method: 'POST', body: { squareId } }); }

// 每日推荐
async function getDailyRecommendation() { return await request('/api/daily/recommend', { method: 'GET' }); }

// 食物相关
async function getFoodMenu() { return await request('/api/food/menu', { method: 'GET' }); }
async function getFoodOffers() { return await request('/api/food/offers', { method: 'GET' }); }
async function getFoodRoute(origin, destination) { return await request(`/api/food/route?origin=${origin}&destination=${destination}`, { method: 'GET' }); }

// 飞书相关
async function getFeishuJSAPIConfig(url) { return await request(`/api/feishu/jsapi-config?url=${encodeURIComponent(url)}`, { method: 'GET' }); }

// ============ 路由系统 ============
const Router = {
  routes: {},
  init() { window.addEventListener('hashchange', () => this.handleRoute()); this.handleRoute(); },
  register(path, handler) { this.routes[path] = handler; },
  handleRoute() {
    const hash = window.location.hash.slice(1) || '/login';
    const [path, queryString] = hash.split('?');
    const params = {};
    if (queryString) queryString.split('&').forEach(pair => { const [k, v] = pair.split('='); params[decodeURIComponent(k)] = decodeURIComponent(v || ''); });
    const handler = this.routes[path];
    if (handler) handler(params); else this.navigateTo('/login');
  },
  navigateTo(path, params = {}) {
    let hash = `#${path}`;
    const qs = Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    if (qs) hash += `?${qs}`;
    window.location.hash = hash;
  },
  back() { window.history.back(); }
};

// ============ 登录页 ============
const LoginPage = {
  render() {
    return `<div class="bg-gray-50 min-h-screen flex items-center justify-center"><div class="w-full max-w-sm px-6"><div class="text-center mb-12"><div class="w-20 h-20 bg-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">${ICONS.logo('w-10 h-10 text-white')}</div><h1 class="text-2xl font-bold text-gray-900">Mi搭子</h1><p class="text-sm text-gray-500 mt-2">Meet 你的命中搭子</p></div><button id="login-btn" class="pressable w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><span>飞书一键登录</span></button><p class="text-center text-xs text-gray-400 mt-6">用飞书账号登录，30秒完成设置</p><div class="text-center mt-16"><p class="text-xs text-gray-300">小米人自己的轻社交平台</p></div></div></div>`;
  },
  init() {
    if (getStorage('userInfo')) { Router.navigateTo('/home'); return; }
    document.getElementById('login-btn').addEventListener('click', () => {
      const btn = document.getElementById('login-btn');
      setButtonLoading(btn, '登录中...');
      setTimeout(() => {
        setStorage('userInfo', { userId: 'u001', nickname: '小米同学', department: '中国区-新零售部', joinDate: '2025-07-01' });
        showToast('登录成功');
        setTimeout(() => Router.navigateTo(getStorage('userProfile') ? '/home' : '/profile-init'), 500);
      }, 1000);
    });
  }
};

// ============ 首页 ============
const HomePage = {
  render() {
    return `<div class="bg-gray-50 min-h-screen pb-20"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><h1 class="text-lg font-semibold text-gray-900">Mi搭子</h1><div class="flex items-center space-x-3"><button class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg></button><button id="avatar-btn" class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><span id="user-avatar-text" class="text-sm font-medium text-orange-600">小</span></button></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-4 space-y-4"><div class="bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-4 text-white shadow-md"><div class="flex items-center justify-between mb-2"><span class="text-sm opacity-90">🔮 今日推荐</span><button id="refresh-rec" class="text-sm opacity-90 hover:opacity-100">换一个</button></div><p id="rec-text" class="text-base mb-3 leading-relaxed">"今日适合主动出击！推荐你找一个同样喜欢川菜的饭搭子，中午一起去吃热乎乎的麻辣香锅。"</p><div class="flex items-center justify-between"><span id="fun-tag" class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs">🌶️ 今日宜吃辣</span><button id="view-rec" class="pressable text-sm font-medium hover:underline">去看看 →</button></div></div><div class="grid grid-cols-2 gap-3"><a href="#/match-lunch" class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">${ICONS.bowl('w-6 h-6 text-orange-500')}</div><h3 class="text-base font-semibold text-gray-900 mb-1">找饭搭子</h3><p class="text-xs text-gray-500">12:00 想找清淡饭搭子</p></a><a href="#/match-commute" class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">${ICONS.car('w-6 h-6 text-blue-500')}</div><h3 class="text-base font-semibold text-gray-900 mb-1">找拼车搭子</h3><p class="text-xs text-gray-500">8:30 回龙观到科技园</p></a></div><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900">📢 搭子广场</h3><a href="#/square" class="text-sm text-orange-500">查看全部</a></div><div id="square-preview" class="space-y-3"><div class="flex items-center justify-center py-4"><div class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div></div></div></main><nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"><div class="max-w-md mx-auto px-4 h-16 flex items-center justify-around"><a href="#/home" class="flex flex-col items-center space-y-1 tab-item active"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span class="text-xs font-medium">首页</span></a><a href="#/square" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg><span class="text-xs">广场</span></a><a href="#/profile" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span class="text-xs">我的</span></a></div></nav></div>`;
  },
  init() {
    if (!getStorage('userInfo')) { Router.navigateTo('/login'); return; }
    const u = getStorage('userInfo');
    if (u.nickname) document.getElementById('user-avatar-text').textContent = u.nickname.charAt(0);
    document.getElementById('refresh-rec').addEventListener('click', () => showToast('已刷新推荐'));
    document.getElementById('view-rec').addEventListener('click', () => Router.navigateTo('/daily'));
    document.getElementById('avatar-btn').addEventListener('click', () => Router.navigateTo('/profile'));
    document.getElementById('square-preview').innerHTML = [
      { n: '王同学', t: 'lunch', p: '3分钟前', c: '12:30 想找清淡饭搭子' },
      { n: '刘同学', t: 'commute', p: '10分钟前', c: '明早8:30 回龙观到科技园' }
    ].map(p => `<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div class="flex items-center space-x-3"><div class="w-8 h-8 ${p.t === 'lunch' ? 'bg-orange-100' : 'bg-blue-100'} rounded-full flex items-center justify-center"><span class="text-sm ${p.t === 'lunch' ? 'text-orange-600' : 'text-blue-600'}">${p.n.charAt(0)}</span></div><div><p class="text-sm font-medium text-gray-900">${p.n}</p><p class="text-xs text-gray-500">${p.c}</p></div></div><span class="text-xs text-gray-400">${p.p}</span></div>`).join('');
  }
};

// ============ 画像填写页 ============
const ProfileInitPage = {
  state: { step: 1, time: '12:00', tastes: ['清淡', '米饭'], budget: '20-40', interests: [] },
  render() {
    return `<div class="bg-gray-50 min-h-screen"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="skip-btn" class="text-sm text-gray-500">跳过</button><div class="flex items-center space-x-2"><div id="step-1" class="w-8 h-1 bg-orange-500 rounded-full"></div><div id="step-2" class="w-8 h-1 bg-gray-200 rounded-full"></div></div><div class="w-10"></div></div></nav><main id="page-1" class="max-w-md mx-auto px-4 pt-20 pb-24"><div class="mb-8"><h1 class="text-2xl font-bold text-gray-900">Hi，小米同学！</h1><p class="text-base text-gray-500 mt-2">30秒完成设置，找到你的命中搭子</p></div><div class="space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-3">用餐时间</label><div id="time-opts" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-3">口味偏好（最多选3个）</label><div id="taste-opts" class="flex flex-wrap gap-2"></div><p id="taste-err" class="field-error">请至少选择1个口味偏好</p></div><div><label class="block text-sm font-medium text-gray-700 mb-3">预算范围</label><div id="budget-opts" class="flex flex-wrap gap-2"></div></div></div></main><main id="page-2" class="max-w-md mx-auto px-4 pt-20 pb-24 hidden"><div class="mb-8"><h1 class="text-2xl font-bold text-gray-900">你对什么感兴趣？</h1><p class="text-base text-gray-500 mt-2">选几个标签，帮你找到同频搭子</p></div><div><label class="block text-sm font-medium text-gray-700 mb-3">兴趣标签（最多选5个）</label><div id="interest-opts" class="flex flex-wrap gap-2"></div><p id="interest-err" class="field-error">请至少选择1个兴趣标签</p></div></main><div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50"><button id="next-btn" class="w-full h-12 bg-orange-500 text-white font-medium rounded-lg">下一步</button></div></div>`;
  },
  init() {
    // 草稿回填：如果之前填写到一半时刷新/离开，重新进来自动恢复
    const draft = getStorage('profileDraft');
    if (draft) this.state = Object.assign({}, this.state, draft, { step: 1 });
    this.renderOpts();
    document.getElementById('skip-btn').addEventListener('click', () => Router.navigateTo('/home'));
    document.getElementById('next-btn').addEventListener('click', () => {
      if (this.state.step === 1) {
        if (!validateRequired(this.state.tastes, document.getElementById('taste-err'))) { showToast('请至少选择1个口味偏好'); return; }
        this.state.step = 2;
        document.getElementById('page-1').classList.add('hidden');
        document.getElementById('page-2').classList.remove('hidden');
        document.getElementById('step-1').className = 'w-8 h-1 bg-gray-200 rounded-full';
        document.getElementById('step-2').className = 'w-8 h-1 bg-orange-500 rounded-full';
        document.getElementById('next-btn').textContent = '完成，开始探索';
      } else {
        if (!validateRequired(this.state.interests, document.getElementById('interest-err'))) { showToast('请至少选择1个兴趣标签'); return; }
        setStorage('userProfile', { lunchPreference: { time: this.state.time, taste: this.state.tastes, budget: this.state.budget }, interestTags: this.state.interests });
        removeStorage('profileDraft');
        showToast('保存成功');
        setTimeout(() => Router.navigateTo('/home'), 500);
      }
    });
  },
  saveDraft() {
    // 本地临时保存，刷新页面/中途退出不丢失已填写内容
    setStorage('profileDraft', { time: this.state.time, tastes: this.state.tastes, budget: this.state.budget, interests: this.state.interests });
  },
  renderOpts() {
    document.getElementById('time-opts').innerHTML = TIME_OPTIONS.map(o => `<button data-v="${o.value}" class="otime px-4 py-2 rounded-full text-sm ${o.value === this.state.time ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('taste-opts').innerHTML = TASTE_OPTIONS.map(o => `<button data-v="${o.value}" class="otaste px-4 py-2 rounded-full text-sm ${this.state.tastes.includes(o.value) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.getElementById('budget-opts').innerHTML = BUDGET_OPTIONS.map(o => `<button data-v="${o.value}" class="obudget px-4 py-2 rounded-full text-sm ${o.value === this.state.budget ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('interest-opts').innerHTML = INTEREST_OPTIONS.map(o => `<button data-v="${o.value}" class="ointerest px-4 py-2 rounded-full text-sm ${this.state.interests.includes(o.value) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.querySelectorAll('.otime').forEach(b => b.addEventListener('click', (e) => { this.state.time = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
    document.querySelectorAll('.otaste').forEach(b => b.addEventListener('click', (e) => { const v = e.target.dataset.v; const i = this.state.tastes.indexOf(v); i > -1 ? this.state.tastes.splice(i, 1) : this.state.tastes.length < 3 ? this.state.tastes.push(v) : showToast('最多3个'); this.renderOpts(); this.saveDraft(); }));
    document.querySelectorAll('.obudget').forEach(b => b.addEventListener('click', (e) => { this.state.budget = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
    document.querySelectorAll('.ointerest').forEach(b => b.addEventListener('click', (e) => { const v = e.target.dataset.v; const i = this.state.interests.indexOf(v); i > -1 ? this.state.interests.splice(i, 1) : this.state.interests.length < 5 ? this.state.interests.push(v) : showToast('最多5个'); this.renderOpts(); this.saveDraft(); }));
  }
};

// ============ 午餐匹配页 ============
const MatchLunchPage = {
  render() {
    return `<div class="bg-gray-50 min-h-screen"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">找饭搭子</h1><div class="w-10"></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-24"><div class="bg-white rounded-xl shadow-sm p-4 mb-4"><div class="flex items-center justify-between mb-2"><span class="text-sm text-gray-500">当前需求</span><button id="edit-pref" class="text-sm text-orange-500">修改</button></div><div class="flex flex-wrap gap-2"><span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">12:00</span><span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">清淡</span><span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">20-40元</span></div></div><div class="mb-4"><h2 class="text-base font-semibold text-gray-900 mb-3">为你推荐 3 位搭子</h2><div id="match-results" class="space-y-3"><div id="loading">${skeletonCards(2)}</div><div id="results" class="space-y-3 hidden"></div></div></div><button id="change-btn" class="pressable w-full h-12 bg-white border border-orange-500 text-orange-500 font-medium rounded-lg mb-3">换一批搭子</button><button id="publish-btn" class="pressable w-full h-12 bg-white border border-gray-300 text-gray-600 font-medium rounded-lg">发布到搭子广场</button></main></div>`;
  },
  init(params = {}) {
    // 演示用：地址栏加 ?empty=1 可预览"无匹配/人数不足"兜底页，例如 #/match-lunch?empty=1
    this.forceEmpty = params && params.empty === '1';
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.getElementById('edit-pref').addEventListener('click', () => Router.navigateTo('/profile-init'));
    document.getElementById('change-btn').addEventListener('click', () => { document.getElementById('loading').classList.remove('hidden'); document.getElementById('loading').innerHTML = skeletonCards(2); document.getElementById('results').classList.add('hidden'); this.loadResults(); });
    document.getElementById('publish-btn').addEventListener('click', () => Router.navigateTo('/publish', { type: 'lunch' }));
    this.loadResults();
  },
  async loadResults() {
    const mock = this.forceEmpty ? [] : [
      { uid: 'u002', name: '吴同学', dept: '人力资源部 · 入职1年', score: 92, tags: ['清淡口味', '12:30午餐', 'AI爱好者'], reason: '你们都偏好清淡口味，午餐时间都在12:30左右，而且都对AI工具感兴趣，适合一起轻松交流。' },
      { uid: 'u003', name: '李同学', dept: '手机部-硬件工程部 · 入职2年', score: 85, tags: ['米饭爱好者', '12:00午餐'], reason: '你们午餐时间一致，都对产品设计感兴趣，可以边吃边聊。' },
      { uid: 'u004', name: '王同学', dept: '手机部-新业务部 · 入职3个月', score: 78, tags: ['轻食爱好者', '想认识新朋友'], reason: '你们都喜欢轻食，而且都希望认识新朋友，适合一起探索新餐厅。' }
    ];
    setTimeout(() => {
      document.getElementById('loading').classList.add('hidden');
      const c = document.getElementById('results');
      c.classList.remove('hidden');
      if (mock.length === 0) {
        c.innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">🍽️</div><p class="empty-text mb-1">暂时没有匹配到合适的饭搭子</p><p class="empty-text mb-4 text-xs">可能是候选人较少，试试发布到广场主动招募</p><button id="empty-to-square" class="pressable btn btn-primary btn-sm">去搭子广场看看</button></div>`;
        document.getElementById('empty-to-square').addEventListener('click', () => Router.navigateTo('/square'));
        return;
      }
      c.innerHTML = mock.map(i => `<div class="bg-white rounded-xl shadow-sm p-4 card-appear"><div class="flex items-center justify-between mb-3"><div class="flex items-center space-x-3"><div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><span class="text-lg font-medium text-orange-600">${i.name.charAt(0)}</span></div><div><h3 class="text-base font-semibold text-gray-900">${i.name}</h3><p class="text-sm text-gray-500">${i.dept}</p></div></div><div class="text-right"><span class="text-2xl font-bold text-orange-500">${i.score}%</span><p class="text-xs text-gray-500">匹配度</p></div></div><div class="flex flex-wrap gap-2 mb-3">${i.tags.map(t => `<span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">✓ ${t}</span>`).join('')}</div><p class="text-sm text-gray-600 mb-4">${i.reason}</p><div class="flex space-x-3"><button data-uid="${i.uid}" class="invite-btn pressable flex-1 h-10 bg-orange-500 text-white text-sm font-medium rounded-lg">邀请搭子</button><button data-uid="${i.uid}" class="detail-btn pressable flex-1 h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">查看详情</button></div></div>`).join('');
      c.querySelectorAll('.invite-btn,.detail-btn').forEach(b => b.addEventListener('click', (e) => Router.navigateTo('/invite', { userId: e.target.dataset.uid })));
    }, 1000);
  }
};

// ============ 通勤匹配页 ============
const MatchCommutePage = {
  render() {
    return `<div class="bg-gray-50 min-h-screen"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">找拼车搭子</h1><div class="w-10"></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-24"><div class="bg-white rounded-xl shadow-sm p-4 mb-4"><div class="flex items-center justify-between mb-2"><span class="text-sm text-gray-500">当前需求</span><button id="edit-pref" class="text-sm text-blue-500">修改</button></div><div class="flex flex-wrap gap-2"><span class="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">08:30</span><span class="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">回龙观</span><span class="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">打车</span></div></div><div class="mb-4"><h2 class="text-base font-semibold text-gray-900 mb-3">为你推荐 3 位搭子</h2><div id="match-results" class="space-y-3"><div id="loading">${skeletonCards(2)}</div><div id="results" class="space-y-3 hidden"></div></div></div><button id="change-btn" class="pressable w-full h-12 bg-white border border-blue-500 text-blue-500 font-medium rounded-lg mb-3">换一批搭子</button><button id="publish-btn" class="pressable w-full h-12 bg-white border border-gray-300 text-gray-600 font-medium rounded-lg">发布到搭子广场</button></main></div>`;
  },
  init(params = {}) {
    // 演示用：地址栏加 ?empty=1 可预览"无匹配/人数不足"兜底页，例如 #/match-commute?empty=1
    this.forceEmpty = params && params.empty === '1';
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.getElementById('edit-pref').addEventListener('click', () => Router.navigateTo('/profile-init'));
    document.getElementById('change-btn').addEventListener('click', () => { document.getElementById('loading').classList.remove('hidden'); document.getElementById('loading').innerHTML = skeletonCards(2); document.getElementById('results').classList.add('hidden'); this.loadResults(); });
    document.getElementById('publish-btn').addEventListener('click', () => Router.navigateTo('/publish', { type: 'commute' }));
    this.loadResults();
  },
  async loadResults() {
    const mock = this.forceEmpty ? [] : [
      { uid: 'u005', name: '黄同学', score: 95, overlap: '90%', saving: '15元/天', time: '08:20-08:40', reason: '你们都住在回龙观附近，路线重合度较高，适合拼车。' },
      { uid: 'u006', name: '赵同学', score: 88, overlap: '85%', saving: '12元/天', time: '08:00-08:30', reason: '你们出发时间相近，可以固定拼车节省费用。' },
      { uid: 'u007', name: '周同学', score: 82, overlap: '80%', saving: '10元/天', time: '08:30-09:00', reason: '你们住在同一片区，可以尝试拼车。' }
    ];
    setTimeout(() => {
      document.getElementById('loading').classList.add('hidden');
      const c = document.getElementById('results');
      c.classList.remove('hidden');
      if (mock.length === 0) {
        c.innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">🚗</div><p class="empty-text mb-1">附近暂时没有同路线的拼车搭子</p><p class="empty-text mb-4 text-xs">可以先发布到广场，等待其他人响应</p><button id="empty-to-square" class="pressable btn btn-secondary btn-sm">去搭子广场看看</button></div>`;
        document.getElementById('empty-to-square').addEventListener('click', () => Router.navigateTo('/square'));
        return;
      }
      c.innerHTML = mock.map(i => `<div class="bg-white rounded-xl shadow-sm p-4 card-appear"><div class="flex items-center justify-between mb-3"><div class="flex items-center space-x-3"><div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><span class="text-lg font-medium text-blue-600">${i.name.charAt(0)}</span></div><div><h3 class="text-base font-semibold text-gray-900">${i.name}</h3><p class="text-sm text-gray-500">回龙观 → 科技园</p></div></div><div class="text-right"><span class="text-2xl font-bold text-blue-500">${i.score}%</span><p class="text-xs text-gray-500">匹配度</p></div></div><div class="grid grid-cols-3 gap-2 mb-3"><div class="text-center p-2 bg-gray-50 rounded-lg"><p class="text-xs text-gray-500">出发时间</p><p class="text-sm font-medium">${i.time}</p></div><div class="text-center p-2 bg-gray-50 rounded-lg"><p class="text-xs text-gray-500">路线重合</p><p class="text-sm font-medium">${i.overlap}</p></div><div class="text-center p-2 bg-gray-50 rounded-lg"><p class="text-xs text-gray-500">预估节省</p><p class="text-sm font-medium text-green-600">${i.saving}</p></div></div><p class="text-sm text-gray-600 mb-4">${i.reason}</p><div class="flex space-x-3"><button data-uid="${i.uid}" class="invite-btn pressable flex-1 h-10 bg-blue-500 text-white text-sm font-medium rounded-lg">邀请拼车</button><button data-uid="${i.uid}" class="detail-btn pressable flex-1 h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">查看详情</button></div></div>`).join('');
      c.querySelectorAll('.invite-btn,.detail-btn').forEach(b => b.addEventListener('click', (e) => Router.navigateTo('/invite', { userId: e.target.dataset.uid })));
    }, 1000);
  }
};

// ============ 邀请详情页 ============
const InvitePage = {
  render() {
    return `<div class="bg-gray-50 min-h-screen"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">邀请搭子</h1><div class="w-10"></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-24 space-y-4"><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center space-x-4"><div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center"><span class="text-2xl font-medium text-orange-600">吴</span></div><div class="flex-1"><h2 class="text-xl font-semibold text-gray-900">吴同学</h2><p class="text-sm text-gray-500 mt-1">产品部 · 入职1年</p><p class="text-sm text-gray-500 mt-1">兴趣：AI、产品、旅行</p></div><div class="text-right"><span class="text-3xl font-bold text-orange-500">92%</span><p class="text-xs text-gray-500">匹配度</p></div></div></div><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900 flex items-center gap-1.5">${ICONS.robot('w-5 h-5 text-orange-500')}<span>AI帮你写好了邀请话术</span></h3><button id="refresh-invite" class="text-sm text-orange-500">换一个</button></div><div id="invite-msg" class="bg-orange-50 rounded-lg p-4 mb-3"><p class="text-sm text-gray-700 leading-relaxed">"我今天12:30准备去B1吃饭，看到我们都喜欢清淡口味，也都对AI工具挺感兴趣，要不要一起拼个饭？"</p></div><button id="copy-invite" class="w-full h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg flex items-center justify-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg><span>复制话术</span></button></div><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900 flex items-center gap-1.5">${ICONS.chat('w-5 h-5 text-orange-500')}<span>破冰话题</span></h3><button id="refresh-ice" class="text-sm text-orange-500">换一批</button></div><div id="ice-topics" class="space-y-3"><div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">1</span><p class="text-sm text-gray-700">你最近有没有用到比较好用的AI工具？</p></div><div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">2</span><p class="text-sm text-gray-700">你觉得园区附近哪家店最不踩雷？</p></div><div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">3</span><p class="text-sm text-gray-700">入职以来你印象最深的一件事是什么？</p></div></div><button id="copy-ice" class="w-full h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg flex items-center justify-center space-x-2 mt-3"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg><span>复制话题</span></button></div><button id="send-invite" class="w-full h-12 bg-orange-500 text-white font-medium rounded-lg shadow-md">发送邀请给吴同学</button></main></div>`;
  },
  init() {
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.getElementById('copy-invite').addEventListener('click', () => { navigator.clipboard.writeText(document.getElementById('invite-msg').textContent); showToast('已复制到剪贴板'); });
    document.getElementById('copy-ice').addEventListener('click', () => { navigator.clipboard.writeText('1. 你最近有没有用到比较好用的AI工具？\n2. 你觉得园区附近哪家店最不踩雷？\n3. 入职以来你印象最深的一件事是什么？'); showToast('已复制到剪贴板'); });
    document.getElementById('send-invite').addEventListener('click', () => { showToast('邀请已发送'); setTimeout(() => Router.navigateTo('/home'), 2000); });
  }
};

// ============ 搭子广场页 ============
const SquarePage = {
  state: { filter: 'all' },
  render() {
    return `<div class="bg-gray-50 min-h-screen pb-20"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">搭子广场</h1><button id="pub-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg></button></div></nav><div class="fixed top-14 left-0 right-0 bg-white border-b border-gray-200 z-40"><div class="max-w-md mx-auto px-4 flex"><button data-t="all" class="ftab flex-1 py-3 text-sm font-medium text-orange-500 border-b-2 border-orange-500">全部</button><button data-t="lunch" class="ftab flex-1 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent flex items-center justify-center gap-1">${ICONS.bowl('w-4 h-4')}<span>午餐</span></button><button data-t="commute" class="ftab flex-1 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent flex items-center justify-center gap-1">${ICONS.car('w-4 h-4')}<span>通勤</span></button><button data-t="weekend" class="ftab flex-1 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent flex items-center justify-center gap-1">${ICONS.target('w-4 h-4')}<span>周末</span></button></div></div><main id="square-main" class="max-w-md mx-auto px-4 pt-28 pb-4"><div id="square-list" class="space-y-3">${skeletonCards(3)}</div></main><nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"><div class="max-w-md mx-auto px-4 h-16 flex items-center justify-around"><a href="#/home" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span class="text-xs">首页</span></a><a href="#/square" class="flex flex-col items-center space-y-1 tab-item active"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg><span class="text-xs font-medium">广场</span></a><a href="#/profile" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span class="text-xs">我的</span></a></div></nav></div>`;
  },
  init() {
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.getElementById('pub-btn').addEventListener('click', () => Router.navigateTo('/publish'));
    document.querySelectorAll('.ftab').forEach(b => b.addEventListener('click', (e) => {
      this.state.filter = e.currentTarget.dataset.t;
      document.querySelectorAll('.ftab').forEach(b2 => {
        const active = b2.dataset.t === this.state.filter;
        const layout = b2.dataset.t === 'all' ? '' : ' flex items-center justify-center gap-1';
        b2.className = `ftab flex-1 py-3 text-sm font-medium border-b-2 ${active ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent'}${layout}`;
      });
      this.loadPosts();
    }));
    initPullToRefresh(document.getElementById('square-main'), document.getElementById('square-list'), () => { showToast('已刷新'); this.loadPosts(); });
    this.loadPosts();
  },
  async loadPosts() {
    const mock = [
      { id: 's001', name: '王同学', type: 'lunch', time: '3分钟前', content: '12:30 想找清淡饭搭子，预算20-40元' },
      { id: 's002', name: '刘同学', type: 'commute', time: '10分钟前', content: '明早8:30 回龙观到科技园，找拼车搭子' },
      { id: 's003', name: '陈同学', type: 'lunch', time: '30分钟前', content: '12:00 想找辣味饭搭子，想认识新朋友' },
      { id: 's004', name: '张同学', type: 'weekend', time: '1小时前', content: '周六想找爬山搭子，轻松路线' }
    ];
    const filtered = this.state.filter === 'all' ? mock : mock.filter(p => p.type === this.state.filter);
    const listEl = document.getElementById('square-list');
    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">🔍</div><p class="empty-text mb-4">这个分类下暂时没有搭子需求</p><button id="empty-publish-btn" class="pressable btn btn-primary btn-sm">我来发布第一条</button></div>`;
      document.getElementById('empty-publish-btn').addEventListener('click', () => Router.navigateTo('/publish'));
      return;
    }
    listEl.innerHTML = filtered.map(p => { const c = TYPE_META[p.type]; return `<div class="bg-white rounded-xl shadow-sm p-4 card-appear"><div class="flex items-center justify-between mb-3"><div class="flex items-center space-x-3"><div class="w-10 h-10 ${c.bg} rounded-full flex items-center justify-center"><span class="text-sm ${c.text}">${p.name.charAt(0)}</span></div><div><h3 class="text-sm font-semibold text-gray-900">${p.name}</h3><p class="text-xs text-gray-500">${p.time}发布</p></div></div><span class="px-2 py-1 rounded-full text-xs ${c.bg} ${c.text} flex items-center gap-1">${c.icon('w-3.5 h-3.5')}<span>${c.label}</span></span></div><p class="text-sm text-gray-700 mb-3">${p.content}</p><button data-id="${p.id}" class="respond-btn pressable w-full h-9 ${c.btn} text-white text-sm font-medium rounded-lg">我要加入</button></div>`; }).join('');
    document.querySelectorAll('.respond-btn').forEach(b => b.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (btn.disabled) return; // 防止重复响应
      btn.disabled = true;
      btn.textContent = '已响应，等待确认';
      btn.classList.add('opacity-60');
      showToast('响应成功，等待对方确认');
    }));
  }
};

// ============ 个人中心页 ============
const ProfilePage = {
  render() {
    return `<div class="bg-gray-50 min-h-screen pb-20"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">个人中心</h1><button id="edit-btn" class="text-sm text-orange-500 font-medium">编辑</button></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-4 space-y-4"><div class="bg-white rounded-xl shadow-sm p-6 text-center"><div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"><span id="user-avatar" class="text-3xl font-medium text-orange-600">小</span></div><h2 id="user-name" class="text-xl font-semibold text-gray-900 mb-1">小米同学</h2><p id="user-dept" class="text-sm text-gray-500">产品部</p><div class="flex justify-center space-x-8 mt-6"><div class="text-center"><p class="text-2xl font-bold text-gray-900">12</p><p class="text-xs text-gray-500">匹配次数</p></div><div class="text-center"><p class="text-2xl font-bold text-gray-900">8</p><p class="text-xs text-gray-500">成功约饭</p></div><div class="text-center"><p class="text-2xl font-bold text-gray-900">5</p><p class="text-xs text-gray-500">搭子好友</p></div></div></div><div class="bg-white rounded-xl shadow-sm p-4"><h3 class="text-base font-semibold text-gray-900 mb-3">📋 我的需求</h3><div class="p-3 bg-gray-50 rounded-lg"><p class="text-sm font-medium text-gray-900">午餐需求：12:00 / 清淡</p><p class="text-xs text-gray-500">状态：匹配中</p></div></div><div class="bg-white rounded-xl shadow-sm p-4"><h3 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-1.5">${ICONS.logo('w-5 h-5 text-orange-500')}<span>我的搭子</span></h3><div class="space-y-3"><div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"><span class="text-sm text-orange-600">吴</span></div><div><p class="text-sm font-medium text-gray-900">吴同学 · 午餐搭子</p><p class="text-xs text-gray-500">上次匹配：今天</p></div></div><button id="view-buddy-btn" data-name="吴同学" class="pressable text-sm text-orange-500 font-medium">查看</button></div></div></div><button id="logout-btn" class="w-full h-12 bg-white text-red-500 font-medium rounded-lg shadow-sm">退出登录</button></main><nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"><div class="max-w-md mx-auto px-4 h-16 flex items-center justify-around"><a href="#/home" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span class="text-xs">首页</span></a><a href="#/square" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg><span class="text-xs">广场</span></a><a href="#/profile" class="flex flex-col items-center space-y-1 tab-item active"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span class="text-xs font-medium">我的</span></a></div></nav></div>`;
  },
  init() {
    const u = getStorage('userInfo');
    if (!u) { Router.navigateTo('/login'); return; }
    if (!u.department || u.department === '产品部') {
      u.department = '中国区-新零售部';
      setStorage('userInfo', u);
    }
    if (u.nickname) document.getElementById('user-avatar').textContent = u.nickname.charAt(0);
    document.getElementById('user-name').textContent = u.nickname || '小米同学';
    document.getElementById('user-dept').textContent = u.department || '中国区-新零售部';
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.getElementById('edit-btn').addEventListener('click', () => showToast('编辑功能开发中'));
    document.getElementById('view-buddy-btn').addEventListener('click', (e) => showFeedbackModal({ name: e.currentTarget.dataset.name || '搭子', matchId: 'm001' }));
    document.getElementById('logout-btn').addEventListener('click', () => { removeStorage('userInfo'); removeStorage('userProfile'); Router.navigateTo('/login'); });
  }
};

// ============ 发布页 ============
const PublishPage = {
  state: { type: 'lunch', lunch: { time: '12:00', taste: [], budget: '20-40' }, commute: { area: '', time: '08:30', transport: '打车' } },
  render() {
    return `<div class="bg-gray-50 min-h-screen"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">发布需求</h1><div class="w-10"></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-24"><div class="bg-white rounded-xl shadow-sm p-4 mb-4"><label class="block text-sm font-medium text-gray-700 mb-3">发布类型</label><div class="grid grid-cols-3 gap-3"><button data-t="lunch" class="tbtn p-3 rounded-lg border-2 border-orange-500 bg-orange-50 text-center">${ICONS.bowl('w-7 h-7 text-orange-500 mx-auto')}<p class="text-sm font-medium text-orange-600 mt-1">午餐</p></button><button data-t="commute" class="tbtn p-3 rounded-lg border-2 border-gray-200 bg-white text-center">${ICONS.car('w-7 h-7 text-gray-400 mx-auto')}<p class="text-sm font-medium text-gray-600 mt-1">通勤</p></button><button data-t="weekend" class="tbtn p-3 rounded-lg border-2 border-gray-200 bg-white text-center">${ICONS.target('w-7 h-7 text-gray-400 mx-auto')}<p class="text-sm font-medium text-gray-600 mt-1">周末</p></button></div></div><div id="form-lunch" class="space-y-4"><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">用餐时间</label><div id="ftime" class="flex flex-wrap gap-2"></div></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">口味偏好</label><div id="ftaste" class="flex flex-wrap gap-2"></div><p id="ftaste-err" class="field-error">请至少选择1个口味偏好</p></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">预算范围</label><div id="fbudget" class="flex flex-wrap gap-2"></div></div></div><div id="form-commute" class="space-y-4 hidden"><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">居住区域</label><div id="farea" class="flex flex-wrap gap-2"></div><p id="farea-err" class="field-error">请选择居住区域</p></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">出发时间</label><div id="fctime" class="flex flex-wrap gap-2"></div></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">交通方式</label><div id="ftransport" class="flex flex-wrap gap-2"></div></div></div></main><div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50"><button id="pub-btn" class="pressable w-full h-12 bg-orange-500 text-white font-medium rounded-lg">发布到搭子广场</button></div></div>`;
  },
  init() {
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.querySelectorAll('.tbtn').forEach(b => b.addEventListener('click', (e) => { this.state.type = e.currentTarget.dataset.t; this.updateForm(); }));
    document.getElementById('pub-btn').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (btn.disabled) return; // 防止重复提交
      // 校验必填项：午餐至少选1个口味；通勤必须选居住区域
      if (this.state.type === 'lunch' && !validateRequired(this.state.lunch.taste, document.getElementById('ftaste-err'))) { showToast('请至少选择1个口味偏好'); return; }
      if (this.state.type === 'commute' && !validateRequired(this.state.commute.area, document.getElementById('farea-err'))) { showToast('请选择居住区域'); return; }
      setButtonLoading(btn, '发布中...');
      setTimeout(() => { showToast('发布成功'); Router.navigateTo('/square'); }, 500);
    });
    this.renderOpts();
  },
  updateForm() {
    document.querySelectorAll('.tbtn').forEach(b => { b.className = b.dataset.t === this.state.type ? 'tbtn p-3 rounded-lg border-2 border-orange-500 bg-orange-50 text-center' : 'tbtn p-3 rounded-lg border-2 border-gray-200 bg-white text-center'; });
    document.getElementById('form-lunch').classList.toggle('hidden', this.state.type !== 'lunch');
    document.getElementById('form-commute').classList.toggle('hidden', this.state.type !== 'commute');
    this.renderOpts();
  },
  renderOpts() {
    document.getElementById('ftime').innerHTML = TIME_OPTIONS.map(o => `<button data-v="${o.value}" class="otime px-4 py-2 rounded-full text-sm ${o.value === this.state.lunch.time ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('ftaste').innerHTML = TASTE_OPTIONS.map(o => `<button data-v="${o.value}" class="otaste px-4 py-2 rounded-full text-sm ${this.state.lunch.taste.includes(o.value) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.getElementById('fbudget').innerHTML = BUDGET_OPTIONS.map(o => `<button data-v="${o.value}" class="obudget px-4 py-2 rounded-full text-sm ${o.value === this.state.lunch.budget ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('farea').innerHTML = AREA_OPTIONS.map(o => `<button data-v="${o.value}" class="oarea px-4 py-2 rounded-full text-sm ${o.value === this.state.commute.area ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('fctime').innerHTML = [{ v: '07:30' }, { v: '08:00' }, { v: '08:30' }, { v: '09:00' }].map(o => `<button data-v="${o.v}" class="octime px-4 py-2 rounded-full text-sm ${o.v === this.state.commute.time ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.v}</button>`).join('');
    document.getElementById('ftransport').innerHTML = TRANSPORT_OPTIONS.map(o => `<button data-v="${o.value}" class="otransport px-4 py-2 rounded-full text-sm ${o.value === this.state.commute.transport ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.querySelectorAll('.otime').forEach(b => b.addEventListener('click', (e) => { this.state.lunch.time = e.target.dataset.v; this.renderOpts(); }));
    document.querySelectorAll('.otaste').forEach(b => b.addEventListener('click', (e) => { const v = e.target.dataset.v; const i = this.state.lunch.taste.indexOf(v); i > -1 ? this.state.lunch.taste.splice(i, 1) : this.state.lunch.taste.length < 3 ? this.state.lunch.taste.push(v) : showToast('最多3个'); this.renderOpts(); }));
    document.querySelectorAll('.obudget').forEach(b => b.addEventListener('click', (e) => { this.state.lunch.budget = e.target.dataset.v; this.renderOpts(); }));
    document.querySelectorAll('.oarea').forEach(b => b.addEventListener('click', (e) => { this.state.commute.area = e.target.dataset.v; this.renderOpts(); }));
    document.querySelectorAll('.octime').forEach(b => b.addEventListener('click', (e) => { this.state.commute.time = e.target.dataset.v; this.renderOpts(); }));
    document.querySelectorAll('.otransport').forEach(b => b.addEventListener('click', (e) => { this.state.commute.transport = e.target.dataset.v; this.renderOpts(); }));
  }
};

// ============ 每日推荐页 ============
const DailyPage = {
  render() {
    return `<div class="bg-gray-50 min-h-screen pb-6"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">今日推荐</h1><div class="w-10"></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-4 space-y-4">
      <div class="bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-4 text-white shadow-md card-appear">
        <div class="flex items-center justify-between mb-2"><span class="text-sm opacity-90">🔮 今日运势</span><button id="refresh-daily" class="pressable text-sm opacity-90 hover:opacity-100">换一个</button></div>
        <p id="daily-text" class="text-base mb-3 leading-relaxed">"今日适合主动出击！推荐你找一个同样喜欢川菜的饭搭子，中午一起去吃热乎乎的麻辣香锅。"</p>
        <span class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs">🌶️ 今日宜吃辣</span>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 card-appear">
        <div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900">🍱 食堂今日菜单</h3><div id="menu-filter" class="flex gap-2"></div></div>
        <div id="menu-list" class="space-y-2">${skeletonCards(2)}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 card-appear">
        <h3 class="text-base font-semibold text-gray-900 mb-3">🏷️ 园区优惠</h3>
        <div id="offer-list" class="space-y-2"></div>
      </div>
    </main></div>`;
  },
  init() {
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.getElementById('refresh-daily').addEventListener('click', () => showToast('已为你重新生成推荐'));
    this.state = { menuFilter: 'all' };
    this.loadMenu();
    this.loadOffers();
  },
  loadMenu() {
    const mock = [
      { id: 'm1', canteen: 'B1食堂', dish: '麻辣香锅', tag: '辣', price: '18元' },
      { id: 'm2', canteen: 'B1食堂', dish: '清蒸鲈鱼套餐', tag: '清淡', price: '22元' },
      { id: 'm3', canteen: '2号楼食堂', dish: '日式咖喱饭', tag: '西餐', price: '20元' }
    ];
    const filters = ['all', '辣', '清淡', '西餐'];
    document.getElementById('menu-filter').innerHTML = filters.map(f => `<button data-f="${f}" class="mfilter px-2 py-1 rounded-full text-xs ${f === this.state.menuFilter ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${f === 'all' ? '全部' : f}</button>`).join('');
    document.querySelectorAll('.mfilter').forEach(b => b.addEventListener('click', (e) => { this.state.menuFilter = e.currentTarget.dataset.f; this.loadMenu(); }));
    const filtered = this.state.menuFilter === 'all' ? mock : mock.filter(m => m.tag === this.state.menuFilter);
    const listEl = document.getElementById('menu-list');
    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">🍽️</div><p class="empty-text">今天这个口味暂时没有菜单</p></div>`;
      return;
    }
    listEl.innerHTML = filtered.map(m => `<div class="list-item"><div><p class="text-sm font-medium text-gray-900">${m.dish}</p><p class="text-xs text-gray-500">${m.canteen} · ${m.tag}</p></div><span class="text-sm font-semibold text-orange-500">${m.price}</span></div>`).join('');
  },
  loadOffers() {
    const mock = [
      { id: 'o1', title: '优惠屋｜第二杯半价', desc: '园区1号门咖啡店，工作日14:00前' },
      { id: 'o2', title: '大众点评｜满30减8', desc: '2号楼旁小面馆，仅限堂食' }
    ];
    document.getElementById('offer-list').innerHTML = mock.map(o => `<div class="p-3 bg-gray-50 rounded-lg"><p class="text-sm font-medium text-gray-900">${o.title}</p><p class="text-xs text-gray-500 mt-1">${o.desc}</p></div>`).join('');
  }
};

// ============ 反馈打分弹窗（董芳潇负责的UI，提交逻辑由吴嘉润的接口承接）============
function showFeedbackModal(info) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal card-appear">
    <p class="modal-title">这次和 ${info.name} 的用餐怎么样？</p>
    <div class="flex gap-3 mb-4">
      <div class="rate-option" data-v="good"><span class="rate-emoji">👍</span><span class="rate-label">合适，还想再约</span></div>
      <div class="rate-option" data-v="bad"><span class="rate-emoji">👎</span><span class="rate-label">不太合适</span></div>
    </div>
    <textarea id="feedback-note" class="input textarea mb-4" placeholder="（选填）说说具体感受，帮助AI下次匹配更准"></textarea>
    <div class="modal-actions">
      <button id="feedback-skip" class="btn btn-ghost btn-block">暂不评价</button>
      <button id="feedback-submit" class="btn btn-primary btn-block">提交</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  let rating = null;
  overlay.querySelectorAll('.rate-option').forEach(el => el.addEventListener('click', () => {
    overlay.querySelectorAll('.rate-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    rating = el.dataset.v;
  }));
  const close = () => overlay.remove();
  overlay.querySelector('#feedback-skip').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('#feedback-submit').addEventListener('click', async () => {
    if (!rating) { showToast('请先选择一个评价'); return; }
    const btn = overlay.querySelector('#feedback-submit');
    setButtonLoading(btn, '提交中...');
    await submitFeedback({ matchId: info.matchId, rating, note: overlay.querySelector('#feedback-note').value });
    showToast('感谢反馈，会用来优化下次匹配');
    close();
  });
}

// ============ 应用初始化 ============
document.addEventListener('DOMContentLoaded', function() {
  const avatarObserver = new MutationObserver(() => hydrateAvatarPhotos());
  avatarObserver.observe(document.getElementById('app'), { childList: true, subtree: true });
  Router.register('/login', () => renderPage(LoginPage));
  Router.register('/home', () => renderPage(HomePage));
  Router.register('/profile-init', () => renderPage(ProfileInitPage));
  Router.register('/match-lunch', (params) => renderPage(MatchLunchPage, params));
  Router.register('/match-commute', (params) => renderPage(MatchCommutePage, params));
  Router.register('/invite', () => renderPage(InvitePage));
  Router.register('/square', () => renderPage(SquarePage));
  Router.register('/profile', () => renderPage(ProfilePage));
  Router.register('/publish', () => renderPage(PublishPage));
  Router.register('/daily', (params) => renderPage(DailyPage, params));
  Router.init();
});

function renderPage(page, params = {}) {
  const app = document.getElementById('app');
  app.classList.remove('route-fade');
  void app.offsetWidth; // 强制重排，确保动画能重新触发
  app.innerHTML = page.render(params);
  app.classList.add('route-fade');
  setTimeout(() => {
    page.init(params);
    hydrateAvatarPhotos(app);
  }, 0);
}
