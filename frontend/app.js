/**
 * Mi搭子 - 前端应用（完整版）
 *
 * 技术栈：HTML5 + Tailwind CSS + 原生 JavaScript（SPA单页应用）
 * 后端：Node.js + Express（对接中）
 */

// ============ 配置 ============
const BASE_URL = "http://localhost:5000";
const APP_CONFIG = { appName: "Mi搭子", version: "0.0.1", maxTasteCount: 3, maxInterestCount: 5 };
function getAvatarSrc(nameOrId) {
  if (typeof MOCK_USERS !== 'undefined') {
    // 优先按 userId 查
    const byId = MOCK_USERS[nameOrId];
    if (byId) return byId.avatar;
    // 再按 nickname 查
    const byName = Object.values(MOCK_USERS).find(u => u.nickname === nameOrId);
    if (byName) return byName.avatar;
  }
  // 三批演示候选人分别使用头像 1-9 和 11-19。
  const demoId = Number(nameOrId);
  if (Number.isFinite(demoId) && demoId >= 101 && demoId <= 209) {
    const avatarNo = demoId >= 200 ? demoId - 190 : demoId - 100;
    return `./assets/avatars/${avatarNo === 10 ? '10.png' : `${avatarNo}.jpg`}`;
  }
  if (typeof MatchLunchPage !== 'undefined' && typeof MatchCommutePage !== 'undefined') {
    const demoCandidate = [...MatchLunchPage.demoBatches.flat(), ...MatchCommutePage.demoBatches.flat()]
      .find(candidate => candidate.nickname === nameOrId);
    if (demoCandidate) return getAvatarSrc(demoCandidate.candidate_id);
  }
  return './assets/avatars/28.jpg';
}

function avatarImg(nameOrId, cls = '') {
  const src = getAvatarSrc(nameOrId);
  return `<img src="${src}" alt="${nameOrId}头像" class="avatar-photo ${cls}">`;
}

function hydrateAvatarPhotos(root = document) {
  root.querySelectorAll('p').forEach(text => {
    if (text.textContent === '产品部 · 入职1年') text.textContent = '人力资源部 · 入职1年';
  });
  const allNicknames = typeof MOCK_USERS !== 'undefined'
    ? Object.values(MOCK_USERS).map(u => u.nickname)
    : [];
  if (typeof MatchLunchPage !== 'undefined' && typeof MatchCommutePage !== 'undefined') {
    allNicknames.push(...MatchLunchPage.demoBatches.flat().map(u => u.nickname), ...MatchCommutePage.demoBatches.flat().map(u => u.nickname));
  }
  const labels = root.querySelectorAll('h2, h3, p');
  labels.forEach(label => {
    const name = allNicknames.find(candidate => label.textContent.includes(candidate));
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
const AREA_OPTIONS = [
  { value: "回龙观", label: "回龙观" }, { value: "天通苑", label: "天通苑" }, { value: "西二旗", label: "西二旗" },
  { value: "上地", label: "上地" }, { value: "望京", label: "望京" }, { value: "五道口", label: "五道口" },
  { value: "通州", label: "通州" }, { value: "亦庄", label: "亦庄" }, { value: "朝阳", label: "朝阳" },
  { value: "海淀", label: "海淀" }, { value: "顺义", label: "顺义" }, { value: "昌平", label: "昌平" },
  { value: "小米公寓", label: "小米公寓" }, { value: "其他", label: "其他" }
];
const TRANSPORT_OPTIONS = [
  { value: "打车", label: "打车", icon: "🚕" }, { value: "顺风车", label: "顺风车", icon: "🚗" },
  { value: "地铁", label: "地铁", icon: "🚇" }, { value: "地铁+打车", label: "地铁+打车", icon: "🚇" },
  { value: "自驾", label: "自驾", icon: "🚙" }, { value: "骑行", label: "骑行", icon: "🚲" },
  { value: "其他", label: "其他", icon: "🚌" }
];
const LOCATION_OPTIONS = [{ value: "一楼食堂", label: "一楼食堂" }, { value: "二楼食堂", label: "二楼食堂" }, { value: "三楼食堂", label: "三楼食堂" }, { value: "楼下商圈", label: "楼下商圈" }, { value: "都可以", label: "都可以" }];
const SOCIAL_OPTIONS = [{ value: "轻松聊天", label: "轻松聊天", icon: "💬" }, { value: "想认识新朋友", label: "想认识新朋友", icon: "👋" }, { value: "安静吃饭", label: "安静吃饭", icon: "🤫" }];

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
function renderTopNavbar(title = '', showBackBtn = false, rightContent = '') {
  return `<nav class="fixed top-0 left-0 right-0 z-50">
    <div class="max-w-lg mx-auto h-14 flex items-center justify-between" style="padding-left:16px;padding-right:0">
      <div class="flex items-center">
        ${showBackBtn ? `<button id="back-btn" class="w-10 h-10 flex items-center justify-center -ml-2"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>` : `<h1 class="text-lg font-semibold text-gray-900">${title}</h1>`}
      </div>
      <div class="flex items-center space-x-3">
        ${rightContent}
        <button id="msg-btn" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center relative"><svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg><span id="msg-dot" class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span></button>
        <button id="avatar-btn" class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer border border-orange-200"><span id="user-avatar-text" class="text-sm font-medium text-orange-600">小</span></button>
      </div>
    </div>
  </nav>`;
}

function initTopNavbar() {
  // 返回按钮由各页面自行处理，不在这里统一绑定
  const avatarBtn = document.getElementById('avatar-btn');
  if (avatarBtn) avatarBtn.addEventListener('click', () => Router.navigateTo('/profile'));
  const msgBtn = document.getElementById('msg-btn');
  if (msgBtn) msgBtn.addEventListener('click', () => Router.navigateTo('/notification'));
}

function relativeTime(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return `${Math.floor(diff / 86400)}天前`;
}

function showToast(msg, dur = 2000) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:10px 20px;border-radius:8px;font-size:14px;z-index:9999;max-width:80%;text-align:center;';
  t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, dur);
}

// 入场动画
function showEntranceAnimation(onComplete) {
  const overlay = document.createElement('div');
  overlay.className = 'entrance-overlay';
  overlay.innerHTML = `
    <div style="text-align:center">
      <div class="entrance-logo">
        <img src="./assets/logo_mimeet.png" alt="Mi搭子" style="width:60px;height:60px;border-radius:16px">
      </div>
      <div class="entrance-text">Mi搭子</div>
    </div>
  `;
  document.body.appendChild(overlay);
  // 立即切换页面，动画只作为过渡遮罩
  if (onComplete) onComplete();
  // 动画结束后移除遮罩
  setTimeout(() => overlay.remove(), 1500);
}

// 背景动效 HTML
function renderBgEffects() {
  return `<div class="about-bg-effects">
    <div class="floating-shape shape-1"></div>
    <div class="floating-shape shape-2"></div>
    <div class="floating-shape shape-3"></div>
    <div class="floating-shape shape-4"></div>
    <div class="floating-shape shape-5"></div>
    <div class="floating-shape shape-6"></div>
  </div>`;
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

// 轮询等待 MiMo 生成话术后更新卡片
// 打字机效果
function typewriterEffect(element, text, speed = 30) {
  element.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
  return timer;
}

// 话题标签逐个显示
function staggerTopics(container, topics, delay = 150) {
  container.innerHTML = '';
  topics.forEach((topic, i) => {
    const span = document.createElement('span');
    span.className = 'px-2 py-0.5 bg-white rounded-full text-xs text-purple-700 border border-purple-200';
    span.style.opacity = '0';
    span.style.transform = 'translateY(8px)';
    span.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    span.textContent = topic;
    container.appendChild(span);
    setTimeout(() => {
      span.style.opacity = '1';
      span.style.transform = 'translateY(0)';
    }, delay * (i + 1));
  });
}

function pollIcebreaker(matchId, accentColor) {
  const maxAttempts = 10; // 最多 20s
  const interval = 2000;
  let attempts = 0;
  const timer = setInterval(async () => {
    attempts++;
    const el = document.querySelector(`.ice-section[data-match-id="${matchId}"]`);
    if (!el) { clearInterval(timer); return; }
    try {
      const res = await request(`/api/match/icebreaker/${matchId}`, { method: 'GET' });
      if (res && res.inviteMessage) {
        clearInterval(timer);
        const topics = Array.isArray(res.icebreakerTopics) ? res.icebreakerTopics : [];
        const color = accentColor === 'commute' ? 'blue' : 'orange';
        el.innerHTML = `
          <div class="p-3 bg-${color}-50 rounded-lg mb-3">
            <p class="text-xs text-${color}-500 mb-1">💬 邀请话术（可直接发送）</p>
            <p class="text-sm text-${color}-800" id="typewriter-${matchId}"></p>
          </div>
          ${topics.length > 0 ? `<div class="p-3 bg-purple-50 rounded-lg mb-3">
            <p class="text-xs text-purple-500 mb-1.5">🎯 破冰话题</p>
            <div class="flex flex-wrap gap-1.5" id="topics-${matchId}"></div>
          </div>` : ''}`;
        // 打字机效果显示话术
        typewriterEffect(document.getElementById(`typewriter-${matchId}`), res.inviteMessage, 30);
        // 话题逐个显示
        if (topics.length > 0) {
          const topicsEl = document.getElementById(`topics-${matchId}`);
          if (topicsEl) staggerTopics(topicsEl, topics, 200);
        }
      }
    } catch {}
    if (attempts >= maxAttempts) clearInterval(timer);
  }, interval);
}

// 简单表单校验：必须至少选中一项，否则显示错误提示并返回 false
function validateRequired(value, errEl) {
  const ok = Array.isArray(value) ? value.length > 0 : !!value;
  if (errEl) errEl.classList.toggle('show', !ok);
  return ok;
}

// ============ 增强工具函数 ============
function getDaysRemaining(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function calcBudgetOverlap(a, b) {
  const ranges = { '20以内': [0, 20], '20-40': [20, 40], '40-60': [40, 60], '60以上': [60, 100], '25-35': [25, 35], '30-50': [30, 50] };
  const ra = ranges[a] || [20, 40], rb = ranges[b] || [20, 40];
  const overlap = Math.max(0, Math.min(ra[1], rb[1]) - Math.max(ra[0], rb[0]));
  const total = Math.max(ra[1], rb[1]) - Math.min(ra[0], rb[0]);
  return total > 0 ? Math.round((overlap / total) * 100) : 50;
}

function spicyIcons(level) {
  if (!level) return '';
  const count = Math.min(level, 3);
  return '🌶️'.repeat(count);
}

function starRating(rating) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return '<span class="star-rating">' + '★'.repeat(full) + '☆'.repeat(empty) + '</span>';
}

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

const WEEKEND_ACTIVITY_OPTIONS = [
  { value: '爬山', label: '爬山', icon: '🏔️' },
  { value: '骑行', label: '骑行', icon: '🚴' },
  { value: '看电影', label: '看电影', icon: '🎬' },
  { value: '展览', label: '展览', icon: '🖼️' },
  { value: '桌游', label: '桌游', icon: '🎲' },
  { value: '运动', label: '运动', icon: '⚽' },
  { value: '其他', label: '其他', icon: '✨' }
];

// ============ API 请求 ============
// Mock 数据标记：后端可用时自动切换，不可用时降级到 mock
let useMockData = false;
let mockDataCheckDone = false;

// 检测后端是否可用
async function checkBackend() {
  if (mockDataCheckDone) return;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    await fetch(`${BASE_URL}/api/user/getProfile`, { 
      method: 'GET',
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    useMockData = false;
  } catch (e) {
    console.log('后端未启动，使用Mock数据模式');
    useMockData = true;
  }
  mockDataCheckDone = true;
}

async function request(apiPath, options = {}) {
  // 首次请求时检测后端
  if (!mockDataCheckDone) {
    await checkBackend();
  }
  
  // 如果后端不可用，返回Mock数据
  if (useMockData) {
    return getMockData(apiPath, options);
  }
  
  try {
    const headers = { "Content-Type": "application/json", ...options.headers };
    // 开发环境自动带 dev auth header
    const userInfo = getStorage('userInfo');
    if (userInfo && userInfo.userId) {
      headers['X-Dev-User'] = userInfo.userId;
    }
    const fetchOptions = { ...options, headers };
    if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }
    const res = await fetch(`${BASE_URL}${apiPath}`, fetchOptions);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const result = await res.json();
    
    if (result.code !== 200) {
      const msg = result.msg || '请求失败';
      showToast(msg);
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error(`API Error [${apiPath}]:`, error);
    
    // 网络错误时切换到Mock模式
    if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
      useMockData = true;
      showToast('后端未连接，使用演示数据');
      return getMockData(apiPath, options);
    }
    
    showToast(error.message || '请求失败，请重试');
    return null;
  }
}

// Mock 数据映射 - 使用 mock-data.js 中的数据
function getMockData(apiPath, options) {
  const basePath = apiPath.split('?')[0];
  const method = options.method || 'GET';
  
  console.log(`[Mock] ${method} ${apiPath}`);
  
  switch (basePath) {
    // 用户相关
    case '/api/user/getProfile':
      return MOCK_PROFILES['u001'] || null;
    
    case '/api/user/saveProfile':
      return { userId: 'u001' };
    
    // 匹配相关
    case '/api/match/execute': {
      const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};
      const type = body.scene || body.type || 'lunch';
      const pref = body.preference || {};
      const seenIds = new Set((body.seenUserIds || []).map(String));
      const results = [];

      for (const [uid, user] of Object.entries(MOCK_USERS)) {
        if (uid === 'u001') continue; // 排除自己
        if (seenIds.has(uid)) continue;
        const profile = MOCK_PROFILES[uid];
        if (!profile) continue;
        let score = 0;

        if (type === 'commute') {
          const cp = profile.commutePreference || {};
          // 居住区域匹配
          if (pref.homeArea && cp.homeArea) {
            if (pref.homeArea === cp.homeArea) score += 40;
            else {
              const adj = {
                '昌平':  ['回龙观','天通苑','顺义'],
                '回龙观':['昌平','西二旗','天通苑','上地'],
                '天通苑':['昌平','回龙观','望京','顺义'],
                '顺义':  ['昌平','天通苑','望京'],
                '西二旗':['回龙观','上地','海淀'],
                '上地':  ['西二旗','回龙观','五道口','海淀'],
                '望京':  ['天通苑','五道口','朝阳','顺义'],
                '五道口':['上地','望京','海淀','朝阳'],
                '海淀':  ['西二旗','上地','五道口'],
                '朝阳':  ['望京','五道口','通州'],
                '通州':  ['朝阳','亦庄'],
                '亦庄':  ['通州','朝阳'],
              };
              if ((adj[pref.homeArea] || []).includes(cp.homeArea)) score += 20;
            }
          }
          // 出发时间匹配
          if (pref.departureTime && cp.departureTime) {
            const [h1, m1] = pref.departureTime.split(':').map(Number);
            const [h2, m2] = cp.departureTime.split(':').map(Number);
            const diff = Math.abs((h1 * 60 + m1) - (h2 * 60 + m2));
            if (diff <= 15) score += 35;
            else if (diff <= 30) score += 20;
            else if (diff <= 60) score += 5; // 时间差大但区域近，降分保留
            // diff > 60 不加分，但不排除，让区域分决定是否入选
          } else {
            score += 20;
          }
          // 交通方式匹配
          if (pref.transportMode && cp.transportMode) {
            if (pref.transportMode === cp.transportMode) score += 15;
            else if (
              (['打车','顺风车'].includes(pref.transportMode) && ['打车','顺风车'].includes(cp.transportMode)) ||
              (['地铁','地铁+打车'].includes(pref.transportMode) && ['地铁','地铁+打车'].includes(cp.transportMode))
            ) score += 8;
          }
          // 兴趣标签
          const myTags = (getStorage('userProfile') || {}).interestTags || [];
          const theirTags = profile.interestTags || [];
          const common = myTags.filter(t => theirTags.includes(t));
          score += Math.min(10, common.length * 4);

          if (score > 0) {
            const commutePref = cp;
            results.push({
              candidate_id: uid, uid,
              nickname: user.nickname, name: user.nickname,
              avatar_url: user.avatar,
              department: user.department, dept: user.department,
              score, rule_score: score,
              commonTags: common.slice(0, 3),
              tags: common.slice(0, 3),
              reason: pref.homeArea && cp.homeArea === pref.homeArea ? `同在${cp.homeArea}出发` : '路线相近',
              commute_info: { area: commutePref.homeArea || '', time: commutePref.departureTime || '', transport: commutePref.transportMode || '' },
            });
          }
        } else {
          // 午餐匹配
          const lp = profile.lunchPreference || {};
          // 用餐时间
          if (pref.time && lp.time) {
            const [h1, m1] = pref.time.split(':').map(Number);
            const [h2, m2] = lp.time.split(':').map(Number);
            const diff = Math.abs((h1 * 60 + m1) - (h2 * 60 + m2));
            if (diff <= 15) score += 30;
            else if (diff <= 30) score += 15;
            else continue;
          } else {
            score += 15;
          }
          // 口味匹配
          const myTaste = Array.isArray(pref.taste) ? pref.taste : [];
          const theirTaste = Array.isArray(lp.taste) ? lp.taste : [];
          const tasteCommon = myTaste.filter(t => theirTaste.includes(t));
          if (myTaste.length > 0) {
            if (tasteCommon.length === myTaste.length) score += 25;
            else if (tasteCommon.length > 0) score += 12;
          } else {
            score += 12;
          }
          // 兴趣标签
          const myTags = (getStorage('userProfile') || {}).interestTags || [];
          const theirTags = profile.interestTags || [];
          const common = myTags.filter(t => theirTags.includes(t));
          score += Math.min(15, common.length * 5);
          // 社交偏好
          if (pref.socialMode && lp.socialMode && pref.socialMode === lp.socialMode) score += 15;

          if (score > 0) {
            results.push({
              candidate_id: uid, uid,
              nickname: user.nickname, name: user.nickname,
              avatar_url: user.avatar,
              department: user.department, dept: user.department,
              score, rule_score: score,
              commonTags: common.slice(0, 3),
              tags: common.slice(0, 3),
              reason: tasteCommon.length ? `口味都偏${tasteCommon[0]}` : (common.length ? `都喜欢${common[0]}` : '偏好相近'),
              recommended_canteen: { name: '二楼轻食区', walk: '步行3分钟', avgPrice: '25-40元' },
            });
          }
        }
      }

      results.sort((a, b) => b.score - a.score);
      // 取前2高分 + 1随机
      const top2 = results.slice(0, 2);
      const rest = results.slice(2);
      const rand = rest.length > 0 ? [rest[Math.floor(Math.random() * rest.length)]] : [];
      return [...top2, ...rand].slice(0, 3);
    }
    
    case '/api/match/feedback':
      return { success: true };
    
    case '/api/match/history': {
      const urlParams = new URLSearchParams(apiPath.split('?')[1] || '');
      const page = parseInt(urlParams.get('page') || '1');
      const size = parseInt(urlParams.get('pageSize') || '10');
      const start = (page - 1) * size;
      const end = start + size;
      return {
        total: MOCK_MATCH_HISTORY.length,
        list: MOCK_MATCH_HISTORY.slice(start, end)
      };
    }
    
    case '/api/match/invite':
      return { success: true };
    
    // 搭子广场
    case '/api/plaza/list': {
      const urlParams = new URLSearchParams(apiPath.split('?')[1] || '');
      const type = urlParams.get('type') || 'all';
      const page = parseInt(urlParams.get('page') || '1');
      const size = parseInt(urlParams.get('pageSize') || '10');
      
      let filtered = MOCK_SQUARE_POSTS;
      if (type !== 'all') {
        filtered = MOCK_SQUARE_POSTS.filter(p => p.type === type);
      }
      
      const start = (page - 1) * size;
      const end = start + size;
      
      return {
        total: filtered.length,
        list: filtered.slice(start, end)
      };
    }
    
    case '/api/plaza/publish':
      return { id: 's' + Date.now() };
    
    case '/api/plaza/respond':
      return { matchId: 'm' + Date.now() };
    
    // 每日推荐
    case '/api/daily/recommend': {
      const randomIndex = Math.floor(Math.random() * MOCK_DAILY_RECOMMENDATIONS.length);
      return MOCK_DAILY_RECOMMENDATIONS[randomIndex];
    }
    
    // 食物相关
    case '/api/food/menu': {
      const urlParams = new URLSearchParams(apiPath.split('?')[1] || '');
      const tag = urlParams.get('tag');
      
      let menus = MOCK_MENUS;
      if (tag && tag !== 'all') {
        menus = MOCK_MENUS.filter(m => m.tag === tag);
      }
      
      return {
        date: new Date().toISOString().split('T')[0],
        menus: menus
      };
    }
    
    case '/api/food/offers':
      return { offers: MOCK_OFFERS };
    
    case '/api/food/route':
      return { distance: '5.2km', duration: '15分钟', cost: '约18元' };
    
    default:
      console.warn(`[Mock] 未找到Mock数据: ${apiPath}`);
      return null;
  }
}

// 带重试按钮的Toast
function showRetryToast(message, retryFn) {
  const existing = document.querySelector('.toast-retry');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast-retry';
  toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.9);color:white;padding:12px 20px;border-radius:10px;font-size:14px;z-index:9999;max-width:85%;text-align:center;display:flex;flex-direction:column;gap:8px;';
  toast.innerHTML = `
    <span>${message}</span>
    <button id="retry-btn" style="background:#FF6700;color:white;border:none;padding:6px 16px;border-radius:6px;font-size:13px;cursor:pointer;">点击重试</button>
  `;
  document.body.appendChild(toast);
  
  document.getElementById('retry-btn').addEventListener('click', () => {
    toast.remove();
    if (retryFn) retryFn();
  });
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// 全局错误边界
window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

// 用户相关
async function getUserProfile() { return await request('/api/user/getProfile', { method: 'GET' }); }
async function saveUserProfile(data) { return await request('/api/user/saveProfile', { method: 'POST', body: data }); }

// 匹配相关
async function executeMatch(type, pref, seenUserIds = []) { return await request('/api/match/execute', { method: 'POST', body: { scene: type, preference: pref, seenUserIds } }); }
async function submitFeedback(data) { return await request('/api/match/feedback', { method: 'POST', body: data }); }
async function getMatchHistory(page, size) { return await request(`/api/match/history?page=${page}&pageSize=${size}`, { method: 'GET' }); }
async function sendInvite(targetUserId, inviteMessage) { return await request('/api/match/invite', { method: 'POST', body: { targetUserId, inviteMessage } }); }

// 搭子广场
async function getPlazaList(type, page, size) { return await request(`/api/plaza/list?type=${type}&page=${page}&pageSize=${size}`, { method: 'GET' }); }
async function publishToPlaza(data) { return await request('/api/plaza/publish', { method: 'POST', body: data }); }
async function respondToPlaza(squareId) { return await request('/api/plaza/respond', { method: 'POST', body: { postId: squareId } }); }

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
  currentPage: null,

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  register(path, handler) {
    this.routes[path] = handler;
  },

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/login';
    const [path, queryString] = hash.split('?');
    const params = {};
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        params[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }

    // 登录页和画像填写页隐藏侧边栏
    const HIDE_SIDEBAR_PAGES = ['/login', '/profile-init'];
    document.body.classList.toggle('hide-sidebar', HIDE_SIDEBAR_PAGES.includes(path));

    const handler = this.routes[path];
    if (handler) {
      this.renderPage(handler, params);
    } else {
      this.navigateTo('/home');
    }
  },

  renderPage(handler, params) {
    const app = document.getElementById('app');
    app.style.opacity = '0';
    app.style.transform = 'translateY(10px)';
    setTimeout(() => {
      app.innerHTML = handler.render(params);
      if (handler.init) handler.init(params);
      if (typeof hydrateAvatarPhotos === 'function') hydrateAvatarPhotos(app);
      if (typeof initTopNavbar === 'function' && handler !== LoginPage) initTopNavbar();
      requestAnimationFrame(() => {
        app.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
        app.style.opacity = '1';
        app.style.transform = 'translateY(0)';
      });
      this.currentPage = handler;
    }, 150);
  },

  navigateTo(path, params = {}) {
    let hash = `#${path}`;
    const qs = Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    if (qs) hash += `?${qs}`;
    window.location.hash = hash;
  },

  back() {
    window.history.back();
  }
};

// ============ 首页 ============
const HomePage = {
  recommendations: [
    { text: '今日适合主动出击！推荐你找一个同样喜欢川菜的饭搭子，中午一起去吃热乎乎的麻辣香锅。', tag: '🌶️ 今日宜吃辣' },
    { text: '午后的灵感来自一顿轻松的午餐，约上同样爱产品和摄影的同事聊聊新鲜事吧。', tag: '📷 今日宜分享' },
    { text: '今天的好运在通勤路上，找一位路线相近的搭子，早高峰也能变得从容。', tag: '🚗 今日宜同行' },
  ],
  render() {
    return `<div class="about-page min-h-screen pb-20 relative overflow-hidden">${renderBgEffects()}${renderTopNavbar('Mi搭子', false)}<main class="max-w-md mx-auto px-4 pt-18 pb-4 space-y-4 relative z-10"><div class="shimmer-card bg-gradient-to-r from-orange-400 to-orange-300 rounded-xl p-4 text-white shadow-md relative overflow-hidden"><div class="sparkle-container"><span class="sparkle star" style="top:10%;left:5%;animation-delay:0s">✦</span><span class="sparkle heart" style="top:20%;right:10%;animation-delay:0.5s">♥</span><span class="sparkle star" style="top:60%;left:15%;animation-delay:1.2s">✧</span><span class="sparkle heart" style="top:40%;right:20%;animation-delay:0.8s">♡</span><span class="sparkle star" style="top:75%;left:70%;animation-delay:1.5s">✦</span><span class="sparkle heart" style="top:15%;left:60%;animation-delay:2s">♥</span><span class="sparkle star" style="top:85%;right:30%;animation-delay:0.3s">✧</span><span class="sparkle heart" style="top:50%;left:80%;animation-delay:1.8s">♡</span></div><div class="flex items-center justify-between mb-2"><span class="text-sm opacity-90">🔮 今日推荐</span><button id="refresh-rec" class="text-sm opacity-90 hover:opacity-100">换一个</button></div><p id="rec-text" class="text-base mb-3 leading-relaxed">"今日适合主动出击！推荐你找一个同样喜欢川菜的饭搭子，中午一起去吃热乎乎的麻辣香锅。"</p><div class="flex items-center justify-between"><span id="fun-tag" class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs">🌶️ 今日宜吃辣</span><button id="view-rec" class="pressable text-sm font-medium hover:underline">去看看 →</button></div></div><div class="grid grid-cols-2 gap-3"><a href="#/match-lunch" class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">${ICONS.bowl('w-6 h-6 text-orange-500')}</div><h3 class="text-base font-semibold text-gray-900 mb-1">找饭搭子</h3><p id="home-lunch-desc" class="text-xs text-gray-500">12:00 想找清淡饭搭子</p></a><a href="#/match-commute" class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">${ICONS.car('w-6 h-6 text-blue-500')}</div><h3 class="text-base font-semibold text-gray-900 mb-1">找拼车搭子</h3><p id="home-commute-desc" class="text-xs text-gray-500">8:30 回龙观到科技园</p></a></div><div class="grid grid-cols-2 gap-3"><a href="#/menu" class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3"><span class="text-2xl">🍱</span></div><h3 class="text-base font-semibold text-gray-900 mb-1">今日菜单</h3><p class="text-xs text-gray-500">三层食堂实时菜品</p></a><a href="#/daily" class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3"><span class="text-2xl">🔮</span></div><h3 class="text-base font-semibold text-gray-900 mb-1">玄学抽卡</h3><p class="text-xs text-gray-500">今日幸运菜系 · 星座运势</p></a></div><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900">📢 搭子广场</h3><a href="#/square" class="text-sm text-orange-500">查看全部</a></div><div id="square-preview" class="space-y-3"><div class="flex items-center justify-center py-4"><div class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div></div></div></main><nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"><div class="max-w-md mx-auto px-4 h-16 flex items-center justify-around"><a href="#/home" class="flex flex-col items-center space-y-1 tab-item active"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span class="text-xs font-medium">首页</span></a><a href="#/square" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg><span class="text-xs">广场</span></a></div></nav></div>`;
  },
  init() {
    if (!getStorage('userInfo')) { Router.navigateTo('/login'); return; }
    const profile = getStorage('userProfile');
    if (!profile || (!profile.lunchPreference && !profile.commutePreference)) {
      Router.navigateTo('/profile-init'); return;
    }
    const u = getStorage('userInfo');
    if (u.nickname) document.getElementById('user-avatar-text').textContent = u.nickname.charAt(0);

    // 根据用户 profile 更新首页卡片描述
    const lp = profile.lunchPreference;
    const cp = profile.commutePreference;
    if (lp) {
      const taste = Array.isArray(lp.taste) && lp.taste.length ? lp.taste.join('/') : '清淡';
      document.getElementById('home-lunch-desc').textContent = `${lp.time || '12:00'} 想找${taste}饭搭子`;
    }
    if (cp) {
      document.getElementById('home-commute-desc').textContent = `${cp.departureTime || '8:30'} ${cp.homeArea || '回龙观'}到科技园`;
    }
    this.recommendationIndex = 0;
    document.getElementById('refresh-rec').addEventListener('click', () => {
      this.recommendationIndex = (this.recommendationIndex + 1) % this.recommendations.length;
      const rec = this.recommendations[this.recommendationIndex];
      document.getElementById('rec-text').textContent = `"${rec.text}"`;
      document.getElementById('fun-tag').textContent = rec.tag;
    });
    document.getElementById('view-rec').addEventListener('click', () => Router.navigateTo('/daily'));

    // 根据已读状态控制红点
    try {
      const ar = JSON.parse(localStorage.getItem('mimeet_ann_read') || '{}');
      const is = JSON.parse(localStorage.getItem('mimeet_invite_status') || '{}');
      const annIds = ['ann_001', 'ann_002', 'ann_003', 'ann_004'];
      const invIds = ['inv_001', 'inv_002', 'inv_003', 'inv_004', 'inv_005', 'inv_006'];
      const hasUnread = annIds.some(id => !ar[id]) || invIds.some(id => (is[id] || 'pending') === 'pending');
      if (!hasUnread) document.getElementById('msg-dot').classList.add('hidden');
    } catch {}

    // 加载搭子广场预览
    this.loadSquarePreview();

    // 后台静默预计算，结果缓存到 sessionStorage
    this.preloadAll();
  },

  async loadSquarePreview() {
    try {
      const result = await request('/api/plaza/list', { method: 'GET' });
      const list = Array.isArray(result) ? result : [];
      const el = document.getElementById('square-preview');
      if (!el) return;
      if (list.length === 0) {
        el.innerHTML = '<p class="text-sm text-gray-400 text-center py-3">暂无动态</p>';
        return;
      }
      el.innerHTML = list.slice(0, 3).map(p => {
        const isLunch = p.scene === 'lunch';
        const name = p.nickname || '匿名';
        const timeAgo = p.created_at ? relativeTime(p.created_at) : '';
        const content = p.content || (isLunch ? '想找饭搭子' : '想找拼车搭子');
        return `<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 ${isLunch ? 'bg-orange-100' : 'bg-blue-100'} rounded-full flex items-center justify-center">
              <span class="text-sm ${isLunch ? 'text-orange-600' : 'text-blue-600'}">${name.charAt(0)}</span>
            </div>
            <div><p class="text-sm font-medium text-gray-900">${name}</p><p class="text-xs text-gray-500">${content}</p></div>
          </div>
          <span class="text-xs text-gray-400">${timeAgo}</span>
        </div>`;
      }).join('');
    } catch (e) {
      // 静默失败，保留骨架
    }
  },

  async preloadAll() {
    const today = new Date().toISOString().slice(0, 10);

    // 1. 每日推荐（当天只算一次）
    const dailyKey = `preload_daily_${today}`;
    if (!sessionStorage.getItem(dailyKey)) {
      getDailyRecommendation().then(rec => {
        if (rec) {
          sessionStorage.setItem(dailyKey, JSON.stringify(rec));
          // 更新首页推荐卡片文字
          const el = document.getElementById('rec-text');
          if (el && rec.social_tip) el.textContent = `"${rec.social_tip}"`;
          const tag = document.getElementById('fun-tag');
          if (tag && rec.recommended_food) tag.textContent = `🍽️ ${rec.recommended_food}`;
        }
      }).catch(() => {});
    } else {
      // 已有缓存，直接更新首页卡片
      try {
        const rec = JSON.parse(sessionStorage.getItem(dailyKey));
        const el = document.getElementById('rec-text');
        if (el && rec.social_tip) el.textContent = `"${rec.social_tip}"`;
        const tag = document.getElementById('fun-tag');
        if (tag && rec.recommended_food) tag.textContent = `🍽️ ${rec.recommended_food}`;
      } catch (e) {}
    }

    // 2. 午餐匹配预计算（本次会话无缓存才计算）
    if (!sessionStorage.getItem('preload_lunch')) {
      const _lp = (getStorage('userProfile') || {}).lunchPreference || {};
      executeMatch('lunch', _lp, []).then(result => {
        if (result && result.length > 0) {
          sessionStorage.setItem('preload_lunch', JSON.stringify(result));
        }
      }).catch(() => {});
    }

    // 3. 通勤匹配预计算
    if (!sessionStorage.getItem('preload_commute')) {
      const _cp = (getStorage('userProfile') || {}).commutePreference || {};
      executeMatch('commute', _cp, []).then(result => {
        if (result && result.length > 0) {
          sessionStorage.setItem('preload_commute', JSON.stringify(result));
        }
      }).catch(() => {});
    }
  }
};

// ============ 画像填写页 ============
const ProfileInitPage = {
  state: { step: 1, time: '12:00', tastes: ['清淡', '米饭'], budget: '20-40', location: '都可以', social: '轻松聊天', commuteArea: '回龙观', commuteTime: '08:30', transport: '打车', interests: [], aboutMe: '' },
  render() {
    return `<div class="login-page-bg min-h-screen">
      <div class="login-activities">
        <div class="activity-icon">🚗</div>
        <div class="activity-icon">🍜</div>
        <div class="activity-icon">🏔️</div>
        <div class="activity-icon">🎬</div>
        <div class="activity-icon">🚴</div>
        <div class="activity-icon">☕</div>
        <div class="activity-icon">🎲</div>
        <div class="activity-icon">🎵</div>
        <div class="activity-icon">📷</div>
        <div class="activity-icon">🎮</div>
        <div class="activity-icon">✈️</div>
        <div class="activity-icon">🍽️</div>
      </div>
      <nav class="fixed top-0 left-0 right-0 z-50 bg-transparent"><div class="max-w-md mx-auto h-14 flex items-center justify-between px-4"><button id="skip-btn" class="text-sm text-gray-500 hover:text-gray-700">跳过</button><div class="flex items-center gap-1.5"><div id="step-1" class="step-dot active"></div><div class="step-line"></div><div id="step-2" class="step-dot"></div><div class="step-line"></div><div id="step-3" class="step-dot"></div></div><div class="flex items-center space-x-3"><button id="msg-btn" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center relative"><svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg><span id="msg-dot" class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span></button><button id="avatar-btn" class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer border border-orange-200"><span id="user-avatar-text" class="text-sm font-medium text-orange-600">小</span></button></div></div></nav><main id="page-1" class="max-w-md mx-auto px-4 pt-20 pb-24 relative z-10"><div class="mb-8"><h1 class="text-2xl font-bold text-gray-900">Hi，小米同学！</h1><p class="text-base text-gray-500 mt-2">30秒完成设置，找到你的命中搭子</p></div><div class="profile-init-card space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-3">用餐时间</label><div id="time-opts" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-3">口味偏好（最多选3个）</label><div id="taste-opts" class="flex flex-wrap gap-2"></div><p id="taste-err" class="field-error">请至少选择1个口味偏好</p></div><div><label class="block text-sm font-medium text-gray-700 mb-3">预算范围</label><div id="budget-opts" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-3">用餐地点</label><div id="location-opts" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-3">社交偏好</label><div id="social-opts" class="flex flex-wrap gap-2"></div></div></div></main><main id="page-2" class="max-w-md mx-auto px-4 pt-20 pb-24 hidden relative z-10"><div class="mb-8"><h1 class="text-2xl font-bold text-gray-900">通勤偏好</h1><p class="text-base text-gray-500 mt-2">帮你找到同路的通勤搭子</p></div><div class="profile-init-card space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-3">居住区域</label><div id="area-opts" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-3">出发时间</label><div id="commute-time-opts" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-3">交通方式</label><div id="transport-opts" class="flex flex-wrap gap-2"></div></div></div></main><main id="page-3" class="max-w-md mx-auto px-4 pt-20 pb-24 hidden relative z-10"><div class="mb-8"><h1 class="text-2xl font-bold text-gray-900">你对什么感兴趣？</h1><p class="text-base text-gray-500 mt-2">选几个标签，帮你找到同频搭子</p></div><div class="profile-init-card"><div><label class="block text-sm font-medium text-gray-700 mb-3">兴趣标签（最多选5个）</label><div id="interest-opts" class="flex flex-wrap gap-2"></div><p id="interest-err" class="field-error">请至少选择1个兴趣标签</p></div><div class="mt-6"><label class="block text-sm font-medium text-white/90 mb-1">About Me 文档链接</label><p class="text-xs text-gray-400 mb-3">可选，填写后其他用户可在你的主页查看</p><input id="about-me-input" type="url" placeholder="https://..." class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 bg-white text-gray-900 placeholder-gray-400" /></div></div></main><div class="fixed bottom-0 left-0 right-0 p-4 z-50"><button id="next-btn" class="w-full h-12 font-medium rounded-xl transition-all">下一步</button></div></div>`;
  },
  init(params = {}) {
    const returnTo = params.from || 'home';
    const draft = getStorage('profileDraft');
    if (draft) this.state = Object.assign({}, this.state, draft, { step: 1 });
    this.renderOpts();
    document.getElementById('skip-btn').addEventListener('click', () => Router.navigateTo('/' + returnTo));
    document.getElementById('next-btn').addEventListener('click', () => {
      if (this.state.step === 1) {
        if (!validateRequired(this.state.tastes, document.getElementById('taste-err'))) { showToast('请至少选择1个口味偏好'); return; }
        this.state.step = 2;
        const page1 = document.getElementById('page-1');
        const page2 = document.getElementById('page-2');
        page1.classList.add('page-fade-out');
        setTimeout(() => {
          page1.classList.add('hidden');
          page1.classList.remove('page-fade-out');
          page2.classList.remove('hidden');
          page2.classList.add('page-fade-in');
          setTimeout(() => page2.classList.remove('page-fade-in'), 300);
        }, 300);
        document.getElementById('step-1').className = 'step-dot completed';
        document.getElementById('step-2').className = 'step-dot active';
        document.getElementById('next-btn').textContent = '下一步';
        this.renderOpts();
      } else if (this.state.step === 2) {
        this.state.step = 3;
        const page2 = document.getElementById('page-2');
        const page3 = document.getElementById('page-3');
        page2.classList.add('page-fade-out');
        setTimeout(() => {
          page2.classList.add('hidden');
          page2.classList.remove('page-fade-out');
          page3.classList.remove('hidden');
          page3.classList.add('page-fade-in');
          setTimeout(() => page3.classList.remove('page-fade-in'), 300);
        }, 300);
        document.getElementById('step-2').className = 'step-dot completed';
        document.getElementById('step-3').className = 'step-dot active';
        document.getElementById('next-btn').textContent = '完成，开始探索';
        this.renderOpts();
      } else {
        if (!validateRequired(this.state.interests, document.getElementById('interest-err'))) { showToast('请至少选择1个兴趣标签'); return; }
        const aboutInput = document.getElementById('about-me-input');
        if (aboutInput) this.state.aboutMe = aboutInput.value.trim();
        const s = this.state;
        setStorage('userProfile', {
          lunchPreference: { time: s.time, taste: s.tastes, budget: s.budget, location: s.location, socialMode: s.social },
          commutePreference: { homeArea: s.commuteArea, departureTime: s.commuteTime, transportMode: s.transport },
          interestTags: s.interests,
          aboutMe: s.aboutMe
        });
        // 同步后端：lunch scene
        saveUserProfile({
          scene: 'lunch',
          time_pref: s.time, taste_pref: s.tastes, budget: s.budget,
          location_pref: s.location, social_pref: s.social, interests: s.interests,
          commute_area: s.commuteArea, commute_time: s.commuteTime, transport: s.transport,
        }).catch(() => {});
        // 同步后端：commute scene
        saveUserProfile({
          scene: 'commute',
          time_pref: s.commuteTime, commute_area: s.commuteArea,
          commute_time: s.commuteTime, transport: s.transport, interests: s.interests,
        }).catch(() => {});
        removeStorage('profileDraft');
        // 异步生成称号
        if (s.aboutMe) {
          request('/api/user/generate-badge', { method: 'POST', body: { aboutMeUrl: s.aboutMe } }).catch(() => {});
        }
        // 显示入场动画
        showEntranceAnimation(() => Router.navigateTo('/' + returnTo));
      }
    });
  },
  saveDraft() {
    setStorage('profileDraft', { time: this.state.time, tastes: this.state.tastes, budget: this.state.budget, location: this.state.location, social: this.state.social, commuteArea: this.state.commuteArea, commuteTime: this.state.commuteTime, transport: this.state.transport, interests: this.state.interests, aboutMe: this.state.aboutMe });
  },
  renderOpts() {
    if (document.getElementById('time-opts')) {
      document.getElementById('time-opts').innerHTML = TIME_OPTIONS.map(o => `<button data-v="${o.value}" class="otime px-4 py-2 rounded-full text-sm ${o.value === this.state.time ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${o.label}</button>`).join('');
      document.getElementById('taste-opts').innerHTML = TASTE_OPTIONS.map(o => `<button data-v="${o.value}" class="otaste px-4 py-2 rounded-full text-sm ${this.state.tastes.includes(o.value) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${o.icon} ${o.label}</button>`).join('');
      document.getElementById('budget-opts').innerHTML = BUDGET_OPTIONS.map(o => `<button data-v="${o.value}" class="obudget px-4 py-2 rounded-full text-sm ${o.value === this.state.budget ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${o.label}</button>`).join('');
      document.getElementById('location-opts').innerHTML = LOCATION_OPTIONS.map(o => `<button data-v="${o.value}" class="olocation px-4 py-2 rounded-full text-sm ${o.value === this.state.location ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${o.label}</button>`).join('');
      document.getElementById('social-opts').innerHTML = SOCIAL_OPTIONS.map(o => `<button data-v="${o.value}" class="osocial px-4 py-2 rounded-full text-sm ${o.value === this.state.social ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${o.icon} ${o.label}</button>`).join('');
      document.querySelectorAll('.otime').forEach(b => b.addEventListener('click', (e) => { this.state.time = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
      document.querySelectorAll('.otaste').forEach(b => b.addEventListener('click', (e) => { const v = e.target.dataset.v; const i = this.state.tastes.indexOf(v); i > -1 ? this.state.tastes.splice(i, 1) : this.state.tastes.length < 3 ? this.state.tastes.push(v) : showToast('最多3个'); this.renderOpts(); this.saveDraft(); }));
      document.querySelectorAll('.obudget').forEach(b => b.addEventListener('click', (e) => { this.state.budget = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
      document.querySelectorAll('.olocation').forEach(b => b.addEventListener('click', (e) => { this.state.location = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
      document.querySelectorAll('.osocial').forEach(b => b.addEventListener('click', (e) => { this.state.social = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
    }
    if (document.getElementById('area-opts')) {
      const COMMUTE_TIME_OPTIONS = [{ value: '07:00', label: '7:00' }, { value: '07:30', label: '7:30' }, { value: '08:00', label: '8:00' }, { value: '08:30', label: '8:30' }, { value: '09:00', label: '9:00' }];
      document.getElementById('area-opts').innerHTML = AREA_OPTIONS.map(o => `<button data-v="${o.value}" class="oarea px-4 py-2 rounded-full text-sm ${o.value === this.state.commuteArea ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${o.label}</button>`).join('');
      document.getElementById('commute-time-opts').innerHTML = COMMUTE_TIME_OPTIONS.map(o => `<button data-v="${o.value}" class="octime px-4 py-2 rounded-full text-sm ${o.value === this.state.commuteTime ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${o.label}</button>`).join('');
      document.getElementById('transport-opts').innerHTML = TRANSPORT_OPTIONS.map(o => `<button data-v="${o.value}" class="otransport px-4 py-2 rounded-full text-sm ${o.value === this.state.transport ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${o.icon} ${o.label}</button>`).join('');
      document.querySelectorAll('.oarea').forEach(b => b.addEventListener('click', (e) => { this.state.commuteArea = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
      document.querySelectorAll('.octime').forEach(b => b.addEventListener('click', (e) => { this.state.commuteTime = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
      document.querySelectorAll('.otransport').forEach(b => b.addEventListener('click', (e) => { this.state.transport = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
    }
    if (document.getElementById('interest-opts')) {
      document.getElementById('interest-opts').innerHTML = INTEREST_OPTIONS.map(o => `<button data-v="${o.value}" class="ointerest px-4 py-2 rounded-full text-sm ${this.state.interests.includes(o.value) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${o.icon} ${o.label}</button>`).join('');
      document.querySelectorAll('.ointerest').forEach(b => b.addEventListener('click', (e) => { const v = e.target.dataset.v; const i = this.state.interests.indexOf(v); i > -1 ? this.state.interests.splice(i, 1) : this.state.interests.length < 5 ? this.state.interests.push(v) : showToast('最多5个'); this.renderOpts(); this.saveDraft(); }));
      const aboutInput = document.getElementById('about-me-input');
      if (aboutInput && this.state.aboutMe) aboutInput.value = this.state.aboutMe;
      aboutInput?.addEventListener('input', () => { this.state.aboutMe = aboutInput.value.trim(); this.saveDraft(); });
    }
  }
};

// ============ 关于我们页 ============
const AboutPage = {
  render() {
    return `<div class="about-page min-h-screen relative overflow-hidden">
      <!-- 背景动效粒子 -->
      <div class="about-bg-effects">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
        <div class="floating-shape shape-5"></div>
        <div class="floating-shape shape-6"></div>
        <canvas id="particle-canvas" class="absolute inset-0 pointer-events-none"></canvas>
      </div>
      
      ${renderTopNavbar('关于我们', false)}
      
      <main class="max-w-md mx-auto px-4 pt-18 pb-8 relative z-10">
        <!-- Logo 区域 -->
        <div class="text-center mb-8 about-hero">
          <div class="about-logo-wrap mx-auto mb-4">
            <div class="about-logo-glow"></div>
            <div class="w-24 h-24 rounded-2xl overflow-hidden mx-auto shadow-xl relative z-10 border-2 border-white/50">
              <img src="./assets/logo_mimeet.png" alt="Mi搭子" class="w-full h-full object-cover">
            </div>
          </div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">Mi搭子</h1>
          <p class="text-sm text-gray-500">Meet 你的命中搭子</p>
          <span class="inline-block mt-3 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-lg shadow-orange-500/30">v${APP_CONFIG.version}</span>
        </div>
        
        <!-- 开发团队 -->
        <div class="about-card mb-4">
          <h2 class="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </span>
            开发团队
          </h2>
          <div class="grid grid-cols-2 gap-3">
            <div class="dev-card dev-card-1 group cursor-pointer">
              <div class="dev-avatar-wrap">
                <div class="dev-avatar-ring ring-orange"></div>
                <div class="w-16 h-16 rounded-full overflow-hidden relative z-10">
                  <img src="./assets/touxiang_hyc.png" alt="黄羽婵" class="w-full h-full object-cover">
                </div>
              </div>
              <p class="text-sm font-medium text-gray-900 mt-2">黄羽婵</p>
              <div class="dev-card-particles"></div>
            </div>
            <div class="dev-card dev-card-2 group cursor-pointer">
              <div class="dev-avatar-wrap">
                <div class="dev-avatar-ring ring-blue"></div>
                <div class="w-16 h-16 rounded-full overflow-hidden relative z-10">
                  <img src="./assets/touxiang_dfx.png" alt="董芳潇" class="w-full h-full object-cover">
                </div>
              </div>
              <p class="text-sm font-medium text-gray-900 mt-2">董芳潇</p>
              <div class="dev-card-particles"></div>
            </div>
            <div class="dev-card dev-card-3 group cursor-pointer">
              <div class="dev-avatar-wrap">
                <div class="dev-avatar-ring ring-purple"></div>
                <div class="w-16 h-16 rounded-full overflow-hidden relative z-10">
                  <img src="./assets/touxiang-cq.png" alt="陈权" class="w-full h-full object-cover">
                </div>
              </div>
              <p class="text-sm font-medium text-gray-900 mt-2">陈权</p>
              <div class="dev-card-particles"></div>
            </div>
            <div class="dev-card dev-card-4 group cursor-pointer">
              <div class="dev-avatar-wrap">
                <div class="dev-avatar-ring ring-green"></div>
                <div class="w-16 h-16 rounded-full overflow-hidden relative z-10">
                  <img src="./assets/touxiang_wjr.png" alt="吴嘉润" class="w-full h-full object-cover">
                </div>
              </div>
              <p class="text-sm font-medium text-gray-900 mt-2">吴嘉润</p>
              <div class="dev-card-particles"></div>
            </div>
          </div>
        </div>

        <!-- 关于项目 -->
        <div class="about-card mb-4">
          <h2 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </span>
            关于项目
          </h2>
          <p class="text-sm text-gray-600 leading-relaxed mb-4">Mi搭子是小米人自己的轻社交平台，基于 Xiaomi MiMo AI 技术，帮助小米同学们找到志同道合的饭搭子、通勤搭子和周末搭子。</p>
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="tech-tag">Tailwind CSS</span>
            <span class="tech-tag">原生 JavaScript</span>
            <span class="tech-tag">Express</span>
            <span class="tech-tag">MySQL</span>
            <span class="tech-tag">FastAPI</span>
            <span class="tech-tag">Uvicorn</span>
            <span class="tech-tag">MiMo AI</span>
          </div>
          <div class="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
            <span>Made with ❤️ by MiMeet Team</span>
            <span>v${APP_CONFIG.version}</span>
          </div>
        </div>

        <div class="text-center mt-8">
          <p class="text-xs text-gray-400">© 2025 MiMeet Team. All rights reserved.</p>
        </div>
      </main>
    </div>`;
  },
  init() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.addEventListener('click', () => Router.back());
    this.initParticles();
  },
  initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const particles = [];
    const colors = ['#FF6700', '#FF4D6A', '#6366F1', '#3B82F6', '#22C55E'];
    
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }
};

// ============ 登录页 ============
const LoginPage = {
  render() {
    return `<div class="login-page-bg min-h-screen flex items-center justify-center">
      <div class="login-activities">
        <div class="activity-icon">🚗</div>
        <div class="activity-icon">🍜</div>
        <div class="activity-icon">🏔️</div>
        <div class="activity-icon">🎬</div>
        <div class="activity-icon">🚴</div>
        <div class="activity-icon">☕</div>
        <div class="activity-icon">🎲</div>
        <div class="activity-icon">🎵</div>
        <div class="activity-icon">📷</div>
        <div class="activity-icon">🎮</div>
        <div class="activity-icon">✈️</div>
        <div class="activity-icon">🍽️</div>
      </div>
      <div class="w-full max-w-sm px-6 relative z-10"><div class="text-center mb-12"><div class="login-logo-glow w-20 h-20 rounded-2xl mx-auto mb-4 overflow-hidden shadow-lg"><img src="./assets/logo_mimeet.png" alt="Mi搭子" class="w-full h-full object-cover"></div><h1 class="text-2xl font-bold text-gray-900">Mi搭子</h1><p class="text-sm text-gray-500 mt-2">Meet 你的命中搭子</p></div><button id="login-btn" class="pressable w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-md"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><span>飞书一键登录</span></button><p class="text-center text-xs text-gray-400 mt-6">用飞书账号登录，30秒完成设置</p><div class="text-center mt-16"><p class="text-xs text-gray-300">v${APP_CONFIG.version} · 小米人自己的轻社交平台</p></div></div></div>`;
  },
  init() {
    document.getElementById('login-btn').addEventListener('click', () => {
      localStorage.removeItem('mimeet_ann_read');
      localStorage.removeItem('mimeet_invite_status');
      window._updateSidebarMsgCount?.();
      setStorage('userInfo', { userId: 'u001', nickname: '小米同学', department: '中国区-新零售部', joinDate: '2025-07-01' });
      showToast('登录成功');
      setTimeout(() => Router.navigateTo('/profile-init'), 400);
    });
  }
};

// ============ 午餐匹配页 ============
const MatchLunchPage = {
  demoBatches: [
    [
      { candidate_id: 101, nickname: '林晓', department: '产品部', score: 96, commonTags: ['川菜', '摄影'], reason: '口味和午餐时间都很合拍' },
      { candidate_id: 102, nickname: '陈默', department: '研发部', score: 92, commonTags: ['清淡', 'AI'], reason: '都偏爱安静轻松的午餐氛围' },
      { candidate_id: 103, nickname: '周可', department: '设计部', score: 89, commonTags: ['日料', '旅行'], reason: '预算相近，还有不少共同话题' },
    ],
    [
      { candidate_id: 104, nickname: '苏然', department: '市场部', score: 94, commonTags: ['粤菜', '跑步'], reason: '用餐地点近，时间完全一致' },
      { candidate_id: 105, nickname: '顾言', department: '运营部', score: 90, commonTags: ['面食', '电影'], reason: '都喜欢边吃边聊最近的电影' },
      { candidate_id: 106, nickname: '唐宁', department: '财务部', score: 87, commonTags: ['轻食', '健身'], reason: '健康饮食偏好高度一致' },
    ],
    [
      { candidate_id: 107, nickname: '沈一', department: '法务部', score: 95, commonTags: ['湘菜', '音乐'], reason: '都想尝试园区新开的湘菜馆' },
      { candidate_id: 108, nickname: '叶青', department: '人力资源部', score: 91, commonTags: ['素食', '阅读'], reason: '午餐节奏和社交偏好很接近' },
      { candidate_id: 109, nickname: '许星', department: '销售部', score: 88, commonTags: ['烧烤', '游戏'], reason: '兴趣相投，午餐一定不会冷场' },
    ],
  ],
  render() {
    return `<div class="bg-gray-50 min-h-screen">${renderTopNavbar('找饭搭子', true)}<main class="max-w-md mx-auto px-4 pt-18 pb-24"><div class="bg-white rounded-xl shadow-sm p-3 mb-3"><div class="flex items-center justify-between mb-2"><span class="text-xs text-gray-500">当前需求</span><button id="edit-pref" class="text-xs text-orange-500">修改</button></div><div id="pref-tags" class="flex flex-wrap gap-2"></div></div><div class="mb-3"><h2 class="text-sm font-semibold text-gray-900 mb-2">为你推荐 <span id="match-count">3</span> 位搭子</h2><div id="match-results" class="space-y-3"><div id="loading">${skeletonCards(2)}</div><div id="results" class="space-y-3 hidden"></div></div></div><button id="change-btn" class="pressable w-full h-10 bg-white border border-orange-500 text-orange-500 text-sm font-medium rounded-lg mb-2">换一批搭子</button><button id="publish-btn" class="pressable w-full h-10 bg-white border border-gray-300 text-gray-600 text-sm font-medium rounded-lg">发布到搭子广场</button></main>
<!-- 修改偏好弹窗 -->
<div id="pref-drawer">
  <div id="pref-overlay" style="position:absolute;inset:0;"></div>
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:16px;padding:20px;width:calc(100% - 32px);max-width:360px;">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-900">修改午餐偏好</h3>
      <button id="drawer-close" class="w-8 h-8 flex items-center justify-center text-gray-400 text-xl">×</button>
    </div>
    <div class="mb-4">
      <p class="text-sm text-gray-500 mb-2">用餐时间</p>
      <div id="drawer-time" class="flex flex-wrap gap-2"></div>
    </div>
    <div class="mb-4">
      <p class="text-sm text-gray-500 mb-2">口味偏好（最多3个）</p>
      <div id="drawer-taste" class="flex flex-wrap gap-2"></div>
    </div>
    <div class="mb-5">
      <p class="text-sm text-gray-500 mb-2">预算范围</p>
      <div id="drawer-budget" class="flex flex-wrap gap-2"></div>
    </div>
    <button id="drawer-confirm" class="pressable w-full h-12 bg-orange-500 text-white font-medium rounded-xl">确认，重新匹配</button>
  </div>
</div>
</div>`;
  },
  init(params = {}) {
    this.forceEmpty = params && params.empty === '1';
    this.seenUserIds = [];
    this.batchIndex = 0;
    document.getElementById('pref-drawer').style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,0.4);';
    document.getElementById('back-btn').addEventListener('click', () => Router.navigateTo('/home'));
    document.getElementById('edit-pref').addEventListener('click', () => this.openDrawer());
    document.getElementById('change-btn').addEventListener('click', () => { this.batchIndex = (this.batchIndex + 1) % this.demoBatches.length; this.loadResults(); });
    document.getElementById('publish-btn').addEventListener('click', () => Router.navigateTo('/publish', { type: 'lunch' }));
    this.updatePrefDisplay();
    this.loadResults();
  },
  updatePrefDisplay() {
    const profile = getStorage('userProfile') || {};
    const pref = profile.lunchPreference || {};
    const tags = document.getElementById('pref-tags');
    if (tags) {
      tags.innerHTML = `<span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">${pref.time || '12:00'}</span><span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">${(pref.taste || ['清淡']).join('·')}</span><span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">${pref.budget || '20-40'}元</span>`;
    }
  },
  openDrawer() {
    const profile = getStorage('userProfile') || {};
    const pref = profile.lunchPreference || { time: '12:00', taste: ['清淡'], budget: '20-40' };
    const draft = { time: pref.time || '12:00', taste: [...(pref.taste || ['清淡'])], budget: pref.budget || '20-40' };

    const renderDrawer = () => {
      document.getElementById('drawer-time').innerHTML = TIME_OPTIONS.map(o =>
        `<button data-v="${o.value}" class="dt-time px-4 py-2 rounded-full text-sm ${draft.time === o.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`
      ).join('');
      document.getElementById('drawer-taste').innerHTML = TASTE_OPTIONS.map(o =>
        `<button data-v="${o.value}" class="dt-taste px-4 py-2 rounded-full text-sm ${draft.taste.includes(o.value) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`
      ).join('');
      document.getElementById('drawer-budget').innerHTML = BUDGET_OPTIONS.map(o =>
        `<button data-v="${o.value}" class="dt-budget px-4 py-2 rounded-full text-sm ${draft.budget === o.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`
      ).join('');
      document.querySelectorAll('.dt-time').forEach(b => b.addEventListener('click', e => { draft.time = e.target.dataset.v; renderDrawer(); }));
      document.querySelectorAll('.dt-taste').forEach(b => b.addEventListener('click', e => {
        const v = e.target.dataset.v;
        const i = draft.taste.indexOf(v);
        if (i > -1) draft.taste.splice(i, 1);
        else if (draft.taste.length < 3) draft.taste.push(v);
        else { showToast('最多选3个'); return; }
        renderDrawer();
      }));
      document.querySelectorAll('.dt-budget').forEach(b => b.addEventListener('click', e => { draft.budget = e.target.dataset.v; renderDrawer(); }));
    };

    const close = () => { document.getElementById('pref-drawer').style.display = 'none'; };
    document.getElementById('pref-drawer').style.display = 'block';
    renderDrawer();

    document.getElementById('pref-overlay').onclick = close;
    document.getElementById('drawer-close').onclick = close;
    document.getElementById('drawer-confirm').onclick = () => {
      const profile = getStorage('userProfile') || {};
      profile.lunchPreference = Object.assign(profile.lunchPreference || {}, { time: draft.time, taste: draft.taste, budget: draft.budget });
      setStorage('userProfile', profile);
      // 同步后端画像（lunch scene）
      saveUserProfile({
        scene: 'lunch',
        time_pref: draft.time,
        taste_pref: draft.taste,
        budget: draft.budget,
        location_pref: profile.lunchPreference?.location || '都可以',
        social_pref: profile.lunchPreference?.socialMode || '轻松聊天',
        interests: profile.interestTags || [],
      }).catch(() => {});
      close();
      this.updatePrefDisplay();
      this.seenUserIds = [];
      sessionStorage.removeItem('preload_lunch');
      sessionStorage.removeItem('preload_lunch_next');
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('loading').innerHTML = skeletonCards(2);
      document.getElementById('results').classList.add('hidden');
      this.loadResults();
    };
  },
  async loadResults() {
    try {
      const profile = getStorage('userProfile') || {};
      const preference = profile.lunchPreference || { time: '12:00', taste: ['清淡'], budget: '20-40' };

      // 首次加载且有预计算缓存，直接用；否则实时调接口
      let result;
      const cached = sessionStorage.getItem('preload_lunch');
      if (cached && this.seenUserIds.length === 0) {
        result = JSON.parse(cached);
        sessionStorage.removeItem('preload_lunch');
        executeMatch('lunch', preference, result.map(r => Number(r.candidate_id || r.userId || 0))).then(next => {
          if (next && next.length > 0) sessionStorage.setItem('preload_lunch_next', JSON.stringify(next));
        }).catch(() => {});
      } else {
        result = await executeMatch('lunch', preference, this.seenUserIds || []);
      }

      document.getElementById('loading')?.classList.add('hidden');
      const c = document.getElementById('results');
      if (!c) return;
      c.classList.remove('hidden');

      const mock = (result && Array.isArray(result)) ? result : (result && result.recommendations) ? result.recommendations : [];
      const countEl = document.getElementById('match-count');
      if (countEl) countEl.textContent = mock.length;
      if (this.forceEmpty || mock.length === 0) {
        c.innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">🍽️</div><p class="empty-text mb-1">暂时没有匹配到合适的饭搭子</p><p class="empty-text mb-4 text-xs">可能是候选人较少，试试发布到广场主动招募</p><button id="empty-to-square" class="pressable btn btn-primary btn-sm">去搭子广场看看</button></div>`;
        document.getElementById('empty-to-square').addEventListener('click', () => Router.navigateTo('/square'));
        return;
      }
      c.innerHTML = mock.map(i => {
        const name = i.nickname || i.name || '搭子';
        const dept = i.department || i.dept || '';
        const score = Math.min(100, Math.round((i.score || i.rule_score || 0)));
        const uid = i.candidate_id || i.uid || i.userId || '';
        const matchId = i.match_id || '';
        const tags = i.commonTags || i.tags || [];
        const reason = i.reason || '偏好相近';
        const canteen = i.recommended_canteen;
        const ice = i.icebreaker || {};
        const iceHtml = `<div class="p-1.5 bg-orange-50 rounded-lg mb-1.5 ice-content" style="opacity:0;transition:opacity 0.5s">
            <p class="text-[10px] text-orange-500 mb-0.5">💬 邀请话术</p>
            <p class="text-[11px] text-orange-800">${ice.inviteMessage || '生成中…'}</p>
          </div>
          <div class="p-1.5 bg-purple-50 rounded-lg mb-1.5 ice-content" style="opacity:0;transition:opacity 0.5s">
            <p class="text-[10px] text-purple-500 mb-0.5">🎯 破冰话题</p>
            <div class="flex flex-wrap gap-1">${(ice.icebreakerTopics && ice.icebreakerTopics.length > 0 ? ice.icebreakerTopics : ['生成中…']).map(t => `<span class="px-1.5 py-0.5 bg-white rounded-full text-[10px] text-purple-700 border border-purple-200">${t}</span>`).join('')}</div>
          </div>`;
        return `<div class="bg-white rounded-xl shadow-sm p-2.5 mb-2 card-appear" data-match-id="${matchId}">
  <div class="flex items-center justify-between mb-1.5">
    <div class="flex items-center space-x-2.5">
      <div class="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">${avatarImg(uid)}</div>
      <div>
        <h3 class="text-sm font-semibold text-gray-900 leading-tight">${name}</h3>
        <p class="text-[10px] text-gray-500">${dept}</p>
      </div>
    </div>
    <div class="score-ring" style="--score:${score}"><span class="score-num">${score}%</span></div>
  </div>
  ${tags.length > 0 ? `<div class="flex flex-wrap gap-1 mb-1.5">${tags.map(t => `<span class="px-1.5 py-0.5 rounded-full text-[10px] bg-green-100 text-green-600">✓ ${t}</span>`).join('')}</div>` : ''}
  <p class="text-[11px] text-gray-600 mb-1.5">💡 ${reason}</p>
  ${canteen ? `<div class="p-1.5 bg-orange-50 rounded-lg mb-1.5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5"><span class="text-xs">🍽️</span><span class="text-[11px] font-medium text-gray-800">${canteen.name}</span></div>
      <span class="text-[10px] text-gray-500">${canteen.walk} · ${canteen.avgPrice}</span>
    </div>
  </div>` : ''}
  <div class="ice-section" data-match-id="${matchId}">${iceHtml}</div>
  <div class="flex space-x-2">
    <button data-uid="${uid}" data-match-id="${matchId}" class="invite-btn pressable flex-1 h-8 bg-orange-500 text-white text-[11px] font-medium rounded-lg">邀请搭子</button>
    <button data-uid="${uid}" data-match-id="${matchId}" class="detail-btn pressable flex-1 h-8 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-lg">查看详情</button>
  </div>
</div>`;
      }).join('');
      mock.forEach(i => {
        const uid = Number(i.candidate_id || i.uid || i.userId);
        if (uid && !this.seenUserIds.includes(uid)) this.seenUserIds.push(uid);
      });
      c.querySelectorAll('.invite-btn,.detail-btn').forEach(b => b.addEventListener('click', (e) => Router.navigateTo('/invite', { userId: e.target.dataset.uid, matchId: e.target.dataset.matchId })));
      // 先显示卡片，轮询等 MiMo 话术生成后更新
      setTimeout(() => {
        c.querySelectorAll('.ice-content').forEach(el => { el.style.opacity = '1'; });
      }, 300);
      mock.forEach(i => { if (i.match_id) pollIcebreaker(i.match_id, 'lunch'); });
    } catch (error) {
      document.getElementById('loading')?.classList.add('hidden');
      document.getElementById('results').classList.remove('hidden');
      document.getElementById('results').innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">⚠️</div><p class="empty-text mb-1">加载失败</p><p class="empty-text mb-4 text-xs">${error.message || '请检查网络后重试'}</p><button id="retry-match" class="pressable btn btn-primary btn-sm">点击重试</button></div>`;
      document.getElementById('retry-match')?.addEventListener('click', () => this.loadResults());
    }
  }
};

// ============ 通勤匹配页 ============
const MatchCommutePage = {
  demoBatches: [
    [
      { candidate_id: 201, nickname: '赵晨', department: '研发部', score: 97, commonTags: ['回龙观', '08:30'], reason: '出发时间一致，路线重合度很高', commute_info: { area: '回龙观', time: '08:30', transport: '打车' } },
      { candidate_id: 202, nickname: '方圆', department: '产品部', score: 93, commonTags: ['同路线', '音乐'], reason: '上车点相距不到五分钟', commute_info: { area: '龙泽', time: '08:25', transport: '顺风车' } },
      { candidate_id: 203, nickname: '韩雨', department: '设计部', score: 89, commonTags: ['科技园', '早起'], reason: '终点相同，通勤习惯相近', commute_info: { area: '西二旗', time: '08:35', transport: '打车' } },
    ],
    [
      { candidate_id: 204, nickname: '江川', department: '运营部', score: 95, commonTags: ['天通苑', '08:20'], reason: '可以在地铁口直接会合', commute_info: { area: '天通苑', time: '08:20', transport: '拼车' } },
      { candidate_id: 205, nickname: '孟夏', department: '市场部', score: 91, commonTags: ['同小区', '播客'], reason: '住得近，路上还有共同话题', commute_info: { area: '霍营', time: '08:30', transport: '顺风车' } },
      { candidate_id: 206, nickname: '陆安', department: '销售部', score: 87, commonTags: ['软件园', '准时'], reason: '路线稳定，时间误差不到十分钟', commute_info: { area: '育新', time: '08:40', transport: '打车' } },
    ],
    [
      { candidate_id: 207, nickname: '程野', department: '财务部', score: 96, commonTags: ['西三旗', '08:30'], reason: '全程路线几乎完全重合', commute_info: { area: '西三旗', time: '08:30', transport: '拼车' } },
      { candidate_id: 208, nickname: '白露', department: '人力资源部', score: 92, commonTags: ['同园区', '阅读'], reason: '上下班时间和目的地都一致', commute_info: { area: '清河', time: '08:25', transport: '顺风车' } },
      { candidate_id: 209, nickname: '乔木', department: '法务部', score: 88, commonTags: ['低碳', '咖啡'], reason: '适合长期固定结伴通勤', commute_info: { area: '上地', time: '08:35', transport: '拼车' } },
    ],
  ],
  render() {
    const profile = getStorage('userProfile') || {};
    const cp = profile.commutePreference || { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' };
    const COMMUTE_TIME_OPTIONS = [
      { value: '07:00', label: '7:00' }, { value: '07:30', label: '7:30' }, { value: '08:00', label: '8:00' },
      { value: '08:30', label: '8:30' }, { value: '09:00', label: '9:00' },
    ];
    const areaOpts = AREA_OPTIONS.map(o => `<button data-v="${o.value}" class="ep-area px-3 py-1.5 rounded-full text-sm ${o.value === cp.homeArea ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    const timeOpts = COMMUTE_TIME_OPTIONS.map(o => `<button data-v="${o.value}" class="ep-time px-3 py-1.5 rounded-full text-sm ${o.value === cp.departureTime ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    const transOpts = TRANSPORT_OPTIONS.map(o => `<button data-v="${o.value}" class="ep-trans px-3 py-1.5 rounded-full text-sm ${o.value === cp.transportMode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    return `<div class="bg-gray-50 min-h-screen">${renderTopNavbar('找拼车搭子', true)}<main class="max-w-md mx-auto px-4 pt-18 pb-24">
<!-- 当前需求卡片 -->
<div class="bg-white rounded-xl shadow-sm p-3 mb-3">
  <div class="flex items-center justify-between mb-2">
    <span class="text-xs text-gray-500">当前需求</span>
    <button id="edit-pref" class="text-xs text-blue-500">修改</button>
  </div>
  <div id="pref-tags" class="flex flex-wrap gap-2">
    <span class="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600">${cp.departureTime}</span>
    <span class="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600">${cp.homeArea}</span>
    <span class="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600">${cp.transportMode}</span>
  </div>
  <!-- 内联编辑面板（默认隐藏） -->
  <div id="edit-panel" class="hidden mt-4 border-t border-gray-100 pt-4 space-y-4">
    <div>
      <p class="text-xs text-gray-500 mb-2">居住区域</p>
      <div id="ep-area-opts" class="flex flex-wrap gap-2">${areaOpts}</div>
    </div>
    <div>
      <p class="text-xs text-gray-500 mb-2">出发时间</p>
      <div id="ep-time-opts" class="flex flex-wrap gap-2">${timeOpts}</div>
    </div>
    <div>
      <p class="text-xs text-gray-500 mb-2">交通方式</p>
      <div id="ep-trans-opts" class="flex flex-wrap gap-2">${transOpts}</div>
    </div>
    <div class="flex gap-3 pt-1">
      <button id="ep-cancel" class="flex-1 h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">取消</button>
      <button id="ep-save" class="flex-1 h-10 bg-blue-500 text-white text-sm font-medium rounded-lg">保存并重新匹配</button>
    </div>
  </div>
</div>
<div class="mb-3"><h2 class="text-sm font-semibold text-gray-900 mb-2">为你推荐 <span id="match-count">3</span> 位搭子</h2><div id="match-results" class="space-y-3"><div id="loading">${skeletonCards(2)}</div><div id="results" class="space-y-3 hidden"></div></div></div><button id="change-btn" class="pressable w-full h-10 bg-white border border-blue-500 text-blue-500 text-sm font-medium rounded-lg mb-2">换一批搭子</button><button id="publish-btn" class="pressable w-full h-10 bg-white border border-gray-300 text-gray-600 text-sm font-medium rounded-lg">发布到搭子广场</button></main></div>`;
  },
  init(params = {}) {
    this.forceEmpty = params && params.empty === '1';
    this.seenUserIds = [];
    this.batchIndex = 0;

    // 编辑面板状态
    this._editDraft = null;

    document.getElementById('back-btn').addEventListener('click', () => Router.navigateTo('/home'));
    document.getElementById('edit-pref').addEventListener('click', () => {
      const panel = document.getElementById('edit-panel');
      const isOpen = !panel.classList.contains('hidden');
      if (isOpen) {
        panel.classList.add('hidden');
        document.getElementById('edit-pref').textContent = '修改';
      } else {
        panel.classList.remove('hidden');
        document.getElementById('edit-pref').textContent = '收起';
        // 从当前 localStorage 初始化草稿
        const profile = getStorage('userProfile') || {};
        const cp = profile.commutePreference || { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' };
        this._editDraft = { ...cp };
      }
    });

    // 选项点击：居住区域
    document.getElementById('ep-area-opts').addEventListener('click', (e) => {
      const btn = e.target.closest('.ep-area');
      if (!btn) return;
      this._editDraft.homeArea = btn.dataset.v;
      document.querySelectorAll('.ep-area').forEach(b => {
        b.className = b.className.replace('bg-blue-500 text-white', 'bg-gray-100 text-gray-600');
      });
      btn.className = btn.className.replace('bg-gray-100 text-gray-600', 'bg-blue-500 text-white');
    });

    // 选项点击：出发时间
    document.getElementById('ep-time-opts').addEventListener('click', (e) => {
      const btn = e.target.closest('.ep-time');
      if (!btn) return;
      this._editDraft.departureTime = btn.dataset.v;
      document.querySelectorAll('.ep-time').forEach(b => {
        b.className = b.className.replace('bg-blue-500 text-white', 'bg-gray-100 text-gray-600');
      });
      btn.className = btn.className.replace('bg-gray-100 text-gray-600', 'bg-blue-500 text-white');
    });

    // 选项点击：交通方式
    document.getElementById('ep-trans-opts').addEventListener('click', (e) => {
      const btn = e.target.closest('.ep-trans');
      if (!btn) return;
      this._editDraft.transportMode = btn.dataset.v;
      document.querySelectorAll('.ep-trans').forEach(b => {
        b.className = b.className.replace('bg-blue-500 text-white', 'bg-gray-100 text-gray-600');
      });
      btn.className = btn.className.replace('bg-gray-100 text-gray-600', 'bg-blue-500 text-white');
    });

    // 取消
    document.getElementById('ep-cancel').addEventListener('click', () => {
      document.getElementById('edit-panel').classList.add('hidden');
      document.getElementById('edit-pref').textContent = '修改';
    });

    // 保存并刷新
    document.getElementById('ep-save').addEventListener('click', async () => {
      if (!this._editDraft) return;
      const draft = this._editDraft;
      // 写入 localStorage
      const profile = getStorage('userProfile') || {};
      profile.commutePreference = draft;
      setStorage('userProfile', profile);
      // 更新顶部标签
      document.getElementById('pref-tags').innerHTML = `
        <span class="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">${draft.departureTime}</span>
        <span class="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">${draft.homeArea}</span>
        <span class="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">${draft.transportMode}</span>
      `;
      // 关闭面板
      document.getElementById('edit-panel').classList.add('hidden');
      document.getElementById('edit-pref').textContent = '修改';
      // 先等后端写入完成，再清缓存重新匹配
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('loading').innerHTML = skeletonCards(2);
      document.getElementById('results').classList.add('hidden');
      try {
        await saveUserProfile({
          scene: 'commute',
          commute_area: draft.homeArea,
          commute_time: draft.departureTime,
          transport: draft.transportMode,
          time_pref: draft.departureTime,
          interests: (profile.interestTags || []),
        });
      } catch (e) {}
      sessionStorage.removeItem('preload_commute');
      sessionStorage.removeItem('preload_commute_next');
      this.seenUserIds = [];
      this.loadResults();
    });

    document.getElementById('change-btn').addEventListener('click', () => { this.batchIndex = (this.batchIndex + 1) % this.demoBatches.length; this.loadResults(); });
    document.getElementById('publish-btn').addEventListener('click', () => Router.navigateTo('/publish', { type: 'commute' }));
    this.loadResults();
  },
  async loadResults() {
    try {
      const profile = getStorage('userProfile') || {};
      const preference = profile.commutePreference || { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' };
      
      let result;
      const cachedCommute = sessionStorage.getItem('preload_commute');
      if (cachedCommute && this.seenUserIds.length === 0) {
        result = JSON.parse(cachedCommute);
        sessionStorage.removeItem('preload_commute');
        executeMatch('commute', preference, result.map(r => Number(r.candidate_id || r.userId || 0))).then(next => {
          if (next && next.length > 0) sessionStorage.setItem('preload_commute_next', JSON.stringify(next));
        }).catch(() => {});
      } else {
        result = await executeMatch('commute', preference, this.seenUserIds || []);
      }

      document.getElementById('loading')?.classList.add('hidden');
      const c = document.getElementById('results');
      if (!c) return;
      c.classList.remove('hidden');

      const mock = (result && Array.isArray(result)) ? result : (result && result.recommendations) ? result.recommendations : [];
      const countEl = document.getElementById('match-count');
      if (countEl) countEl.textContent = mock.length;
      if (this.forceEmpty || mock.length === 0) {
        c.innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">🚗</div><p class="empty-text mb-1">附近暂时没有同路线的拼车搭子</p><p class="empty-text mb-4 text-xs">可以先发布到广场，等待其他人响应</p><button id="empty-to-square" class="pressable btn btn-secondary btn-sm">去搭子广场看看</button></div>`;
        document.getElementById('empty-to-square').addEventListener('click', () => Router.navigateTo('/square'));
        return;
      }
      c.innerHTML = mock.map(i => {
        const name = i.nickname || i.name || '搭子';
        const dept = i.department || '';
        const score = Math.min(100, Math.round((i.score || i.rule_score || 0)));
        const uid = i.candidate_id || i.uid || i.userId || '';
        const matchId = i.match_id || '';
        const tags = i.commonTags || i.tags || [];
        const reason = i.reason || '路线相近';
        const commuteInfo = i.commute_info || null;
        const iceC = i.icebreaker || {};
        const iceHtmlC = `<div class="p-3 bg-blue-50 rounded-lg mb-3 ice-content" style="opacity:0;transition:opacity 0.5s">
            <p class="text-[10px] text-blue-500 mb-0.5">💬 邀请话术</p>
            <p class="text-[11px] text-blue-800">${iceC.inviteMessage || '生成中…'}</p>
          </div>
          <div class="p-1.5 bg-purple-50 rounded-lg mb-1.5 ice-content" style="opacity:0;transition:opacity 0.5s">
            <p class="text-[10px] text-purple-500 mb-0.5">🎯 破冰话题</p>
            <div class="flex flex-wrap gap-1">${(iceC.icebreakerTopics && iceC.icebreakerTopics.length > 0 ? iceC.icebreakerTopics : ['生成中…']).map(t => `<span class="px-1.5 py-0.5 bg-white rounded-full text-[10px] text-purple-700 border border-purple-200">${t}</span>`).join('')}</div>
          </div>`;
        return `<div class="bg-white rounded-xl shadow-sm p-2.5 mb-2 card-appear" data-match-id="${matchId}">
  <div class="flex items-center justify-between mb-1.5">
    <div class="flex items-center space-x-2.5">
      <div class="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">${avatarImg(uid)}</div>
      <div>
        <h3 class="text-sm font-semibold text-gray-900 leading-tight">${name}</h3>
        <p class="text-[10px] text-gray-500">${dept || '通勤搭子'}</p>
      </div>
    </div>
    <div class="score-ring score-ring-blue" style="--score:${score}"><span class="score-num">${score}%</span></div>
  </div>
  ${tags.length > 0 ? `<div class="flex flex-wrap gap-1 mb-1.5">${tags.map(t => `<span class="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-600">✓ ${t}</span>`).join('')}</div>` : ''}
  <p class="text-[11px] text-gray-600 mb-1.5">💡 ${reason}</p>
  ${commuteInfo ? `<div class="p-1.5 bg-blue-50 rounded-lg mb-1.5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5"><span class="text-xs">🚗</span><span class="text-[11px] font-medium text-gray-800">${commuteInfo.area || ''} 出发</span></div>
      <span class="text-[10px] text-gray-500">${commuteInfo.time || ''} · ${commuteInfo.transport || ''}</span>
    </div>
  </div>` : ''}
  <div class="ice-section" data-match-id="${matchId}">${iceHtmlC}</div>
  <div class="flex space-x-2">
    <button data-uid="${uid}" data-match-id="${matchId}" class="invite-btn pressable flex-1 h-8 bg-blue-500 text-white text-[11px] font-medium rounded-lg">邀请拼车</button>
    <button data-uid="${uid}" data-match-id="${matchId}" class="detail-btn pressable flex-1 h-8 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-lg">查看详情</button>
  </div>
</div>`;
      }).join('');
      mock.forEach(i => {
        const uid = Number(i.candidate_id || i.uid || i.userId);
        if (uid && !this.seenUserIds.includes(uid)) this.seenUserIds.push(uid);
      });
      c.querySelectorAll('.invite-btn,.detail-btn').forEach(b => b.addEventListener('click', (e) => Router.navigateTo('/invite', { userId: e.target.dataset.uid, matchId: e.target.dataset.matchId })));
      // 先显示卡片，轮询等 MiMo 话术生成后更新
      setTimeout(() => {
        c.querySelectorAll('.ice-content').forEach(el => { el.style.opacity = '1'; });
      }, 300);
      mock.forEach(i => { if (i.match_id) pollIcebreaker(i.match_id, 'commute'); });
    } catch (error) {
      document.getElementById('loading')?.classList.add('hidden');
      document.getElementById('results').classList.remove('hidden');
      document.getElementById('results').innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">⚠️</div><p class="empty-text mb-1">加载失败</p><p class="empty-text mb-4 text-xs">${error.message || '请检查网络后重试'}</p><button id="retry-match" class="pressable btn btn-secondary btn-sm">点击重试</button></div>`;
      document.getElementById('retry-match')?.addEventListener('click', () => this.loadResults());
    }
  }
};

// ============ 邀请详情页 ============
const InvitePage = {
  renderTopicBatch(topics) {
    return topics.map((topic, i) => `<div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">${i + 1}</span><p class="text-sm text-gray-700">${topic}</p></div>`).join('');
  },
  getTargetUser(params) {
    const uid = params && params.userId;
    const allUsers = { ...MOCK_USERS };
    const allProfiles = { ...MOCK_PROFILES };
    const allRecs = [...(MOCK_MATCH_RECOMMENDATIONS.lunch || []), ...(MOCK_MATCH_RECOMMENDATIONS.commute || []), ...(MatchLunchPage.demoBatches || []).flat(), ...(MatchCommutePage.demoBatches || []).flat()];
    const rec = allRecs.find(r => String(r.uid || r.candidate_id || r.userId) === String(uid));
    const user = Object.values(allUsers).find(u => u.userId === uid);
    return {
      name: rec?.nickname || rec?.name || user?.nickname || '搭子',
      dept: rec?.department || rec?.dept || user?.department || '小米同学',
      score: rec?.score || 85,
      tags: rec?.tags || [],
      reason: rec?.reason || '你们很匹配',
      interests: allProfiles[uid]?.interestTags || ['AI', '产品']
    };
  },
  render(params) {
    const t = this.getTargetUser(params);
    return `<div class="bg-gray-50 min-h-screen">${renderTopNavbar('邀请搭子', true)}<main class="max-w-md mx-auto px-4 pt-18 pb-24 space-y-4"><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center space-x-4"><div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center"><span class="text-2xl font-medium text-orange-600">${t.name.charAt(0)}</span></div><div class="flex-1"><h2 class="text-xl font-semibold text-gray-900">${t.name}</h2><p class="text-sm text-gray-500 mt-1">${t.dept}</p><p class="text-sm text-gray-500 mt-1">兴趣：${t.interests.join('、')}</p></div><div class="score-ring" style="--score:${t.score}"><span class="score-num">${t.score}%</span></div></div></div><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900 flex items-center gap-1.5">${ICONS.robot('w-5 h-5 text-orange-500')}<span>AI帮你写好了邀请话术</span></h3><button id="refresh-invite" class="text-sm text-orange-500">换一个</button></div><div id="invite-msg" class="ai-border bg-orange-50 rounded-lg p-4 mb-3"><p class="text-sm text-gray-700 leading-relaxed">"我今天12:30准备去食堂吃饭，看到我们都喜欢清淡口味，也都对${t.interests[0] || 'AI'}挺感兴趣，要不要一起拼个饭？"</p></div><button id="copy-invite" class="w-full h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg flex items-center justify-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg><span>复制话术</span></button></div><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900 flex items-center gap-1.5">${ICONS.chat('w-5 h-5 text-orange-500')}<span>破冰话题</span></h3><button id="refresh-ice" class="text-sm text-orange-500">换一批</button></div><div id="ice-topics" class="space-y-3"><div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">1</span><p class="text-sm text-gray-700">你最近有没有用到比较好用的${t.interests[0] || 'AI'}工具？</p></div><div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">2</span><p class="text-sm text-gray-700">你觉得园区附近哪家店最不踩雷？</p></div><div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">3</span><p class="text-sm text-gray-700">入职以来你印象最深的一件事是什么？</p></div></div><button id="copy-ice" class="w-full h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg flex items-center justify-center space-x-2 mt-3"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg><span>复制话题</span></button></div><button id="send-invite" class="w-full h-12 bg-orange-500 text-white font-medium rounded-lg shadow-md">发送邀请给${t.name}</button></main></div>`;
  },
  init(params) {
    const t = this.getTargetUser(params);
    const matchId = params && params.matchId;
    const interest = t.interests[0] || 'AI';
    const inviteBatches = [
      `我今天12:30准备去食堂吃饭，看到我们都对${interest}挺感兴趣，要不要一起拼个饭？`,
      '嗨，发现我们的午餐偏好很接近！今天中午有空一起去园区食堂尝尝新菜吗？',
      '看到系统推荐我们成为搭子，感觉会很聊得来。中午一起吃饭，顺便交流一下最近的工作趣事？',
    ];
    const topicBatches = [
      [`你最近有没有用到比较好用的${interest}工具？`, '你觉得园区附近哪家店最不踩雷？', '入职以来你印象最深的一件事是什么？'],
      ['最近有没有哪部电影或剧让你特别上头？', '如果周末只选一种放松方式，你会选什么？', '你最近解锁了什么新的兴趣爱好？'],
      ['你最想推荐给同事的一道食堂菜是什么？', '最近工作中有什么让你很有成就感的事？', '如果能马上出发旅行，你最想去哪里？'],
    ];
    let inviteIndex = 0;
    let topicIndex = 0;

    // 用已生成的 icebreaker 替换初始静态内容
    // 演示模式使用固定的三组内容，避免接口返回覆盖循环数据。
    if (matchId) {
      request(`/api/match/icebreaker/${matchId}`, { method: 'GET' }).then(res => {
        if (res && res.inviteMessage) {
          const msgEl = document.getElementById('invite-msg');
          msgEl.innerHTML = '<p class="text-sm text-gray-700 leading-relaxed" id="invite-typewriter"></p>';
          typewriterEffect(document.getElementById('invite-typewriter'), res.inviteMessage, 30);
        }
        if (res && Array.isArray(res.icebreakerTopics) && res.icebreakerTopics.length > 0) {
          const topicsContainer = document.getElementById('ice-topics');
          topicsContainer.innerHTML = '';
          res.icebreakerTopics.forEach((topic, i) => {
            const div = document.createElement('div');
            div.className = 'flex items-start space-x-3 p-3 bg-gray-50 rounded-lg';
            div.style.opacity = '0';
            div.style.transform = 'translateY(8px)';
            div.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            div.innerHTML = `
              <span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">${i + 1}</span>
              <p class="text-sm text-gray-700 topic-text" id="topic-text-${i}"></p>
            `;
            topicsContainer.appendChild(div);
            setTimeout(() => {
              div.style.opacity = '1';
              div.style.transform = 'translateY(0)';
              typewriterEffect(div.querySelector('.topic-text'), topic, 25);
            }, 300 * (i + 1));
          });
        }
      }).catch(() => {});
    }

    document.getElementById('back-btn').addEventListener('click', () => Router.navigateTo('/home'));

    document.getElementById('copy-invite').addEventListener('click', () => {
      const text = document.getElementById('invite-msg').querySelector('p')?.textContent || document.getElementById('invite-msg').textContent;
      navigator.clipboard.writeText(text.replace(/^"|"$/g, ''));
      showToast('已复制到剪贴板');
    });

    document.getElementById('copy-ice').addEventListener('click', () => {
      const topics = document.querySelectorAll('#ice-topics p');
      const text = Array.from(topics).map((p, i) => `${i + 1}. ${p.textContent}`).join('\n');
      navigator.clipboard.writeText(text);
      showToast('已复制到剪贴板');
    });

    document.getElementById('refresh-invite').addEventListener('click', () => {
      inviteIndex = (inviteIndex + 1) % inviteBatches.length;
      document.getElementById('invite-msg').innerHTML = `<p class="text-sm text-gray-700 leading-relaxed">"${inviteBatches[inviteIndex]}"</p>`;
    });

    document.getElementById('refresh-ice').addEventListener('click', () => {
      topicIndex = (topicIndex + 1) % topicBatches.length;
      document.getElementById('ice-topics').innerHTML = this.renderTopicBatch(topicBatches[topicIndex]);
    });

    document.getElementById('send-invite').addEventListener('click', () => {
      const btn = document.getElementById('send-invite');
      setButtonLoading(btn, '发送中...');
      setTimeout(() => { showToast('邀请已发送，对方将收到飞书消息'); setTimeout(() => Router.navigateTo('/home'), 1500); }, 1000);
    });
  }
};

// ============ 搭子广场页 ============
const SquarePage = {
  state: { filter: 'all', keyword: '', sort: 'newest', page: 1, pageSize: 6, hasMore: true, advFilters: { time: null, budget: null, area: null, social: null } },
  render() {
    return `<div class="about-page min-h-screen pb-20 relative overflow-hidden">${renderBgEffects()}${renderTopNavbar('搭子广场', false, `<button id="pub-btn" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--primary-gradient);box-shadow:var(--shadow-glow)"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg></button>`)}<div class="fixed top-14 left-0 right-0 z-40"><div class="max-w-md mx-auto px-4 flex"><button data-t="all" class="ftab flex-1 py-3 text-sm font-medium text-orange-500 border-b-2 border-orange-500">全部</button><button data-t="lunch" class="ftab flex-1 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent flex items-center justify-center gap-1">${ICONS.bowl('w-4 h-4')}<span>午餐</span></button><button data-t="commute" class="ftab flex-1 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent flex items-center justify-center gap-1">${ICONS.car('w-4 h-4')}<span>通勤</span></button><button data-t="weekend" class="ftab flex-1 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent flex items-center justify-center gap-1">${ICONS.target('w-4 h-4')}<span>周末</span></button></div></div><main id="square-main" class="max-w-md mx-auto px-4 pt-28 pb-4 relative z-10"><div class="mb-3 space-y-2"><div class="search-bar"><svg class="search-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><input id="square-search" type="text" placeholder="搜索内容、用户名..." /></div><div class="flex items-center justify-between relative"><button id="filter-btn" class="pressable flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg><span>筛选</span><span id="filter-count" class="hidden ml-1 w-4 h-4 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center">0</span></button><div id="filter-drawer" class="filter-drawer"><div class="flex items-center justify-between mb-3"><h3 class="text-sm font-semibold">筛选条件</h3><button id="filter-reset" class="text-xs text-orange-500">重置</button></div><div class="space-y-3"><div><label class="block text-xs font-medium text-gray-700 mb-1.5">时间范围</label><div id="fd-time" class="flex flex-wrap gap-1.5"></div></div><div><label class="block text-xs font-medium text-gray-700 mb-1.5">预算范围</label><div id="fd-budget" class="flex flex-wrap gap-1.5"></div></div><div><label class="block text-xs font-medium text-gray-700 mb-1.5">区域</label><div id="fd-area" class="flex flex-wrap gap-1.5"></div></div><div><label class="block text-xs font-medium text-gray-700 mb-1.5">社交偏好</label><div id="fd-social" class="flex flex-wrap gap-1.5"></div></div></div><button id="filter-apply" class="w-full h-9 bg-orange-500 text-white text-sm font-medium rounded-lg mt-4">应用筛选</button></div><div class="sort-dropdown"><button id="sort-btn" class="pressable flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600"><span id="sort-label">最新发布</span><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></button><div id="sort-menu" class="sort-menu"><div class="sort-menu-item active" data-sort="newest">最新发布</div><div class="sort-menu-item" data-sort="responded">响应最多</div><div class="sort-menu-item" data-sort="match">最佳匹配</div></div></div></div></div><div id="square-list" class="space-y-3">${skeletonCards(3)}</div><button id="load-more" class="load-more-btn mt-4 hidden">加载更多</button></main><nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"><div class="max-w-md mx-auto px-4 h-16 flex items-center justify-around"><a href="#/home" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span class="text-xs">首页</span></a><a href="#/square" class="flex flex-col items-center space-y-1 tab-item active"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg><span class="text-xs font-medium">广场</span></a><a href="#/profile" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span class="text-xs">我的</span></a></div></nav></div>`;
  },
  init() {
    document.getElementById('pub-btn').addEventListener('click', () => Router.navigateTo('/publish'));
    document.querySelectorAll('.ftab').forEach(b => b.addEventListener('click', (e) => {
      this.state.filter = e.currentTarget.dataset.t;
      this.state.page = 1;
      document.querySelectorAll('.ftab').forEach(b2 => {
        const active = b2.dataset.t === this.state.filter;
        const layout = b2.dataset.t === 'all' ? '' : ' flex items-center justify-center gap-1';
        b2.className = `ftab flex-1 py-3 text-sm font-medium border-b-2 ${active ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent'}${layout}`;
      });
      this.loadPosts();
    }));
    const searchInput = document.getElementById('square-search');
    const debouncedSearch = debounce(() => { this.state.keyword = searchInput.value.trim(); this.state.page = 1; this.loadPosts(); }, 300);
    searchInput.addEventListener('input', debouncedSearch);
    document.getElementById('sort-btn').addEventListener('click', () => document.getElementById('sort-menu').classList.toggle('open'));
    document.querySelectorAll('.sort-menu-item').forEach(item => item.addEventListener('click', (e) => {
      this.state.sort = e.currentTarget.dataset.sort;
      this.state.page = 1;
      document.getElementById('sort-label').textContent = e.currentTarget.textContent;
      document.querySelectorAll('.sort-menu-item').forEach(x => x.classList.toggle('active', x.dataset.sort === this.state.sort));
      document.getElementById('sort-menu').classList.remove('open');
      this.loadPosts();
    }));
    document.getElementById('filter-btn').addEventListener('click', () => this.openDrawer());
    document.getElementById('filter-reset').addEventListener('click', () => { this.state.advFilters = { time: null, budget: null, area: null, social: null }; this.renderDrawerOpts(); });
    document.getElementById('filter-apply').addEventListener('click', () => { this.closeDrawer(); this.state.page = 1; this.updateFilterCount(); this.loadPosts(); });
    document.getElementById('load-more').addEventListener('click', () => { this.state.page++; this.loadPosts(true); });
    initPullToRefresh(document.getElementById('square-main'), document.getElementById('square-list'), () => { this.state.page = 1; showToast('已刷新'); this.loadPosts(); });
    this.loadPosts();
  },
  openDrawer() {
    this.renderDrawerOpts();
    document.getElementById('filter-drawer').classList.toggle('open');
  },
  closeDrawer() {
    document.getElementById('filter-drawer').classList.remove('open');
  },
  renderDrawerOpts() {
    const af = this.state.advFilters;
    document.getElementById('fd-time').innerHTML = TIME_OPTIONS.map(o => `<button data-v="${o.value}" class="fd-opt px-3 py-1.5 rounded-full text-xs ${af.time === o.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('fd-budget').innerHTML = BUDGET_OPTIONS.map(o => `<button data-v="${o.value}" class="fd-opt px-3 py-1.5 rounded-full text-xs ${af.budget === o.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('fd-area').innerHTML = AREA_OPTIONS.map(o => `<button data-v="${o.value}" class="fd-opt px-3 py-1.5 rounded-full text-xs ${af.area === o.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('fd-social').innerHTML = SOCIAL_OPTIONS.map(o => `<button data-v="${o.value}" class="fd-opt px-3 py-1.5 rounded-full text-xs ${af.social === o.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.querySelectorAll('#fd-time .fd-opt').forEach(b => b.addEventListener('click', e => { af.time = af.time === e.currentTarget.dataset.v ? null : e.currentTarget.dataset.v; this.renderDrawerOpts(); }));
    document.querySelectorAll('#fd-budget .fd-opt').forEach(b => b.addEventListener('click', e => { af.budget = af.budget === e.currentTarget.dataset.v ? null : e.currentTarget.dataset.v; this.renderDrawerOpts(); }));
    document.querySelectorAll('#fd-area .fd-opt').forEach(b => b.addEventListener('click', e => { af.area = af.area === e.currentTarget.dataset.v ? null : e.currentTarget.dataset.v; this.renderDrawerOpts(); }));
    document.querySelectorAll('#fd-social .fd-opt').forEach(b => b.addEventListener('click', e => { af.social = af.social === e.currentTarget.dataset.v ? null : e.currentTarget.dataset.v; this.renderDrawerOpts(); }));
  },
  updateFilterCount() {
    const count = Object.values(this.state.advFilters).filter(v => v !== null).length;
    const badge = document.getElementById('filter-count');
    if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); } else { badge.classList.add('hidden'); }
  },
  async loadPosts(append = false) {
    const result = await getPlazaList(this.state.filter, 1, 100);
    let posts = [];
    if (result && result.list) {
      posts = result.list.map(p => ({ id: p.id, userId: p.userId || p.user_id || '', name: p.nickname || '匿名', type: p.type || p.scene || 'lunch', time: p.publishTime || '刚刚', respondCount: p.respondCount || 0, content: p.content, contentText: typeof p.content === 'object' ? this.formatContent(p.content, p.type || p.scene) : (p.content || '') }));
    } else {
      posts = MOCK_SQUARE_POSTS.map(p => ({ id: p.id, userId: p.userId || '', name: p.nickname, type: p.type, time: p.publishTime, respondCount: p.respondCount || 0, content: p.content, contentText: this.formatContent(p.content, p.type) }));
      if (this.state.filter !== 'all') posts = posts.filter(p => p.type === this.state.filter);
    }
    if (this.state.keyword) {
      const kw = this.state.keyword.toLowerCase();
      posts = posts.filter(p => p.name.toLowerCase().includes(kw) || p.contentText.toLowerCase().includes(kw));
    }
    const af = this.state.advFilters;
    if (af.time) posts = posts.filter(p => (p.content?.time || p.content?.departureTime || '') === af.time);
    if (af.budget) posts = posts.filter(p => (p.content?.budget || '') === af.budget);
    if (af.area) posts = posts.filter(p => (p.content?.homeArea || '') === af.area);
    if (af.social) posts = posts.filter(p => (p.content?.socialMode || '') === af.social);
    if (this.state.sort === 'responded') posts.sort((a, b) => b.respondCount - a.respondCount);
    else if (this.state.sort === 'match') {
      const tastes = (getStorage('userProfile') || {}).lunchPreference?.taste || [];
      posts.sort((a, b) => { const sa = (a.content?.taste || []).filter(t => tastes.includes(t)).length; const sb = (b.content?.taste || []).filter(t => tastes.includes(t)).length; return sb - sa; });
    }
    const end = this.state.page * this.state.pageSize;
    this.state.hasMore = posts.length > end;
    const visible = posts.slice(0, end);
    const listEl = document.getElementById('square-list');
    const loadMoreBtn = document.getElementById('load-more');
    if (visible.length === 0) {
      listEl.innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">🔍</div><p class="empty-text mb-2">${this.state.keyword ? '没有找到匹配的结果' : '这个分类下暂时没有搭子需求'}</p><p class="empty-text text-xs mb-4">${this.state.keyword ? '试试换个关键词' : ''}</p><button id="empty-publish-btn" class="pressable btn btn-primary btn-sm">我来发布第一条</button></div>`;
      document.getElementById('empty-publish-btn')?.addEventListener('click', () => Router.navigateTo('/publish'));
      loadMoreBtn.classList.add('hidden');
      return;
    }
    listEl.innerHTML = visible.map(p => {
      const c = TYPE_META[p.type] || TYPE_META.lunch;
      const u = typeof MOCK_USERS !== 'undefined' ? MOCK_USERS[p.userId] : null;
      const badge = u?.badge;
      const badgeColor = u?.badgeColor || 'orange';
      const aboutLink = u?.aboutMe || '#';
      const avatarHtml = badge
        ? `<div class="relative"><div class="w-10 h-10 ${c.bg} rounded-full flex items-center justify-center"><span class="text-sm ${c.text}">${p.name.charAt(0)}</span></div><a href="${aboutLink}" target="_blank" rel="noopener noreferrer" class="square-badge badge-${badgeColor} absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-px text-white text-[9px] font-bold whitespace-nowrap z-10 no-underline">${badge}</a></div>`
        : `<div class="w-10 h-10 ${c.bg} rounded-full flex items-center justify-center"><span class="text-sm ${c.text}">${p.name.charAt(0)}</span></div>`;
      return `<div class="bg-white rounded-xl shadow-sm p-4 card-appear"><div class="flex items-center justify-between mb-3"><div class="flex items-center space-x-3">${avatarHtml}<div><h3 class="text-sm font-semibold text-gray-900">${p.name}</h3><p class="text-xs text-gray-500">${p.time} · ${p.respondCount > 0 ? `已有${p.respondCount}人响应` : '等待响应'}</p></div></div><span class="px-2 py-1 rounded-full text-xs ${c.bg} ${c.text} flex items-center gap-1">${c.icon('w-3.5 h-3.5')}<span>${c.label}</span></span></div><p class="text-sm text-gray-700 mb-3">${p.contentText}</p><button data-id="${p.id}" class="respond-btn pressable w-full h-9 ${c.btn} text-white text-sm font-medium rounded-lg">我要加入</button></div>`;
    }).join('');
    document.querySelectorAll('.respond-btn').forEach(b => b.addEventListener('click', (e) => { const btn = e.currentTarget; if (btn.disabled) return; btn.disabled = true; btn.textContent = '已响应，等待确认'; btn.classList.add('opacity-60'); showToast('响应成功，等待对方确认'); }));
    if (this.state.hasMore) { loadMoreBtn.classList.remove('hidden'); } else { loadMoreBtn.classList.add('hidden'); }
  },
  formatContent(content, type) {
    if (type === 'lunch') return `${content.time || ''} 想找${(content.taste || []).join('/')}饭搭子，预算${content.budget || ''}元`;
    if (type === 'commute') return `${content.departureTime || ''} ${content.homeArea || ''}到科技园，找拼车搭子`;
    if (type === 'weekend') return `${content.time || ''} ${content.activity || ''}，${content.description || ''}`;
    return JSON.stringify(content);
  }
};

// ============ 个人中心页 ============
const ProfilePage = {
  render() {
    return `<div class="about-page min-h-screen pb-20 relative overflow-hidden">
      ${renderBgEffects()}
      ${renderTopNavbar('个人中心', false, '<button id="edit-btn" class="text-sm text-orange-500 font-medium">编辑</button>')}
      <main class="max-w-md mx-auto px-4 pt-18 pb-4 space-y-4 relative z-10">
        <div class="bg-white rounded-xl shadow-sm p-6 text-center">
          <div class="profile-avatar-wrap mx-auto mb-4">
            <div id="user-avatar" class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <span class="text-3xl font-medium text-orange-600">小</span>
            </div>
            <a id="user-badge" href="#" target="_blank" rel="noopener noreferrer" class="hidden profile-badge px-2 py-0.5 text-white text-xs font-bold whitespace-nowrap no-underline"></a>
          </div>
          <h2 id="user-name" class="text-xl font-semibold text-gray-900 mb-1">小米同学</h2>
          <p id="user-dept" class="text-sm text-gray-500">产品部</p>
          <div id="personality-tags" class="flex items-center justify-center gap-2 mt-3"></div>
          <div class="flex justify-center space-x-8 mt-6">
            <div class="text-center"><p id="stat-matches" class="text-2xl font-bold text-gray-900">-</p><p class="text-xs text-gray-500">匹配次数</p></div>
            <div class="text-center"><p id="stat-success" class="text-2xl font-bold text-gray-900">-</p><p class="text-xs text-gray-500">成功约饭</p></div>
            <div class="text-center"><p id="stat-friends" class="text-2xl font-bold text-gray-900">-</p><p class="text-xs text-gray-500">搭子好友</p></div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="text-base font-semibold text-gray-900 mb-3">📋 我的需求</h3>
          <div id="my-needs"><div class="skeleton skeleton-line" style="width:100%;height:48px"></div></div>
        </div>
        <div id="about-me-section" class="bg-white rounded-xl shadow-sm p-4 hidden">
          <h3 class="text-base font-semibold text-gray-900 mb-2">📄 About Me</h3>
          <a id="about-me-link" href="#" target="_blank" rel="noopener noreferrer" class="text-sm text-orange-500 hover:underline break-all"></a>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-1.5">${ICONS.logo('w-5 h-5 text-orange-500')}<span>我的搭子</span></h3>
          <div id="my-buddies"><div class="skeleton skeleton-line" style="width:100%;height:48px"></div></div>
        </div>
        <button id="logout-btn" class="w-full h-12 bg-white text-red-500 font-medium rounded-lg shadow-sm">退出登录</button>
      </main>
      <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div class="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
          <a href="#/home" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span class="text-xs">首页</span></a>
          <a href="#/square" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg><span class="text-xs">广场</span></a>
          <a href="#/profile" class="flex flex-col items-center space-y-1 tab-item active"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span class="text-xs font-medium">我的</span></a>
        </div>
      </nav>
    </div>`;
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
    const profile = MOCK_PROFILES['u001'];
    const tagEl = document.getElementById('personality-tags');
    if (profile && tagEl) {
      let badges = '';
      if (profile.mbti) badges += `<span class="personality-badge mbti">🧠 ${profile.mbti}</span>`;
      if (profile.constellation) badges += `<span class="personality-badge constellation">⭐ ${profile.constellation}</span>`;
      tagEl.innerHTML = badges;
    }
    document.getElementById('edit-btn').addEventListener('click', () => showToast('编辑功能开发中'));
    const userProfile = getStorage('userProfile');
    if (userProfile && userProfile.aboutMe) {
      const section = document.getElementById('about-me-section');
      const link = document.getElementById('about-me-link');
      section.classList.remove('hidden');
      link.href = userProfile.aboutMe;
      link.textContent = `${u.nickname || '小米同学'}的About Me`;
    }
    // 加载称号
    request('/api/user/badge').then(res => {
      if (res && res.badge) {
        const badgeEl = document.getElementById('user-badge');
        badgeEl.textContent = res.badge;
        if (userProfile && userProfile.aboutMe) badgeEl.href = userProfile.aboutMe;
        const color = res.badgeColor || (typeof MOCK_USERS !== 'undefined' ? MOCK_USERS['u001']?.badgeColor : '') || 'orange';
        badgeEl.className = badgeEl.className.replace(/badge-\w+/g, '');
        badgeEl.classList.add(`badge-${color}`, 'profile-badge');
        badgeEl.classList.remove('hidden');
      }
    }).catch(() => {});
    document.getElementById('logout-btn').addEventListener('click', () => { removeStorage('userInfo'); removeStorage('userProfile'); Router.navigateTo('/login'); });
    this.loadStats();
    this.loadMyNeeds();
    this.loadMyBuddies();
  },
  async loadStats() {
    try {
      const history = await getMatchHistory(1, 100);
      const list = Array.isArray(history) ? history : (history?.list || []);
      const matches = list.length;
      const success = list.filter(r => r.status === 'accepted').length;
      const friends = new Set(list.filter(r => r.status === 'accepted').map(r => r.partner_id)).size;
      document.getElementById('stat-matches').textContent = matches;
      document.getElementById('stat-success').textContent = success;
      document.getElementById('stat-friends').textContent = friends;
    } catch (e) {
      document.getElementById('stat-matches').textContent = '0';
      document.getElementById('stat-success').textContent = '0';
      document.getElementById('stat-friends').textContent = '0';
    }
  },
  async loadMyNeeds() {
    const container = document.getElementById('my-needs');
    const profile = getStorage('userProfile');
    if (profile && profile.lunchPreference) {
      const p = profile.lunchPreference;
      container.innerHTML = `<div class="p-3 bg-gray-50 rounded-lg"><p class="text-sm font-medium text-gray-900">午餐需求：${p.time || '未设置'} / ${(p.taste || []).join('、') || '未设置'}</p><p class="text-xs text-gray-500">状态：匹配中</p></div>`;
    } else {
      container.innerHTML = `<div class="p-3 bg-gray-50 rounded-lg text-center"><p class="text-sm text-gray-500 mb-2">还没有设置需求</p><a href="#/profile-init" class="text-sm text-orange-500 font-medium">去设置</a></div>`;
    }
  },
  async loadMyBuddies() {
    const container = document.getElementById('my-buddies');
    try {
      const history = await getMatchHistory(1, 10);
      const list = Array.isArray(history) ? history : (history?.list || []);
      if (list.length > 0) {
        const buddies = list.filter(r => r.status === 'accepted').slice(0, 5);
        if (buddies.length === 0) {
          container.innerHTML = `<div class="p-3 bg-gray-50 rounded-lg text-center"><p class="text-sm text-gray-500">还没有搭子，去匹配看看</p></div>`;
        } else {
          container.innerHTML = buddies.map(b => {
            const typeLabel = b.scene === 'lunch' ? '午餐搭子' : '拼车搭子';
            const avatarBg = b.scene === 'lunch' ? 'bg-orange-100' : 'bg-blue-100';
            const avatarText = b.scene === 'lunch' ? 'text-orange-600' : 'text-blue-600';
            return `<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center"><span class="text-sm ${avatarText}">${(b.partner_name || '?').charAt(0)}</span></div>
                <div><p class="text-sm font-medium text-gray-900">${b.partner_name || '搭子'} · ${typeLabel}</p><p class="text-xs text-gray-500">匹配度：${b.score || '-'}%</p></div>
              </div>
              <button class="view-buddy-btn text-sm text-orange-500 font-medium" data-name="${b.partner_name || '搭子'}" data-id="${b.id}">查看</button>
            </div>`;
          }).join('');
          container.querySelectorAll('.view-buddy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => showFeedbackModal({ name: e.currentTarget.dataset.name, matchId: e.currentTarget.dataset.id }));
          });
        }
      } else {
        container.innerHTML = `<div class="p-3 bg-gray-50 rounded-lg text-center"><p class="text-sm text-gray-500">还没有搭子，去匹配看看</p></div>`;
      }
    } catch (e) {
      container.innerHTML = `<div class="p-3 bg-gray-50 rounded-lg text-center"><p class="text-sm text-gray-500">加载失败，<button id="retry-buddies" class="text-orange-500 underline">点击重试</button></p></div>`;
      document.getElementById('retry-buddies')?.addEventListener('click', () => this.loadMyBuddies());
    }
  }
};

// ============ 发布页 ============
const PublishPage = {
  state: { type: 'lunch', lunch: { time: '12:00', taste: [], budget: '20-40' }, commute: { area: '', time: '08:30', transport: '打车' }, weekend: { activity: '', location: '', time: '周六 9:00', description: '' } },
  render() {
    return `<div class="bg-gray-50 min-h-screen">${renderTopNavbar('发布需求', true)}<main class="max-w-md mx-auto px-4 pt-18 pb-24"><div class="bg-white rounded-xl shadow-sm p-4 mb-4"><label class="block text-sm font-medium text-gray-700 mb-3">发布类型</label><div class="grid grid-cols-3 gap-3"><button data-t="lunch" class="tbtn p-3 rounded-lg border-2 border-orange-500 bg-orange-50 text-center">${ICONS.bowl('w-7 h-7 text-orange-500 mx-auto')}<p class="text-sm font-medium text-orange-600 mt-1">午餐</p></button><button data-t="commute" class="tbtn p-3 rounded-lg border-2 border-gray-200 bg-white text-center">${ICONS.car('w-7 h-7 text-gray-400 mx-auto')}<p class="text-sm font-medium text-gray-600 mt-1">通勤</p></button><button data-t="weekend" class="tbtn p-3 rounded-lg border-2 border-gray-200 bg-white text-center">${ICONS.target('w-7 h-7 text-gray-400 mx-auto')}<p class="text-sm font-medium text-gray-600 mt-1">周末</p></button></div></div><div id="form-lunch" class="space-y-4"><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">用餐时间</label><div id="ftime" class="flex flex-wrap gap-2"></div></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">口味偏好</label><div id="ftaste" class="flex flex-wrap gap-2"></div><p id="ftaste-err" class="field-error">请至少选择1个口味偏好</p></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">预算范围</label><div id="fbudget" class="flex flex-wrap gap-2"></div></div></div><div id="form-commute" class="space-y-4 hidden"><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">居住区域</label><div id="farea" class="flex flex-wrap gap-2"></div><p id="farea-err" class="field-error">请选择居住区域</p></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">出发时间</label><div id="fctime" class="flex flex-wrap gap-2"></div></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">交通方式</label><div id="ftransport" class="flex flex-wrap gap-2"></div></div></div><div id="form-weekend" class="space-y-4 hidden"><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">活动类型</label><div id="factivity" class="grid grid-cols-3 gap-2"></div><p id="factivity-err" class="field-error">请选择活动类型</p></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">活动地点</label><input id="flocation" type="text" placeholder="如：香山、奥森公园..." class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"/></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">活动时间</label><div id="fwtime" class="flex flex-wrap gap-2"></div></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">活动描述</label><textarea id="fdesc" maxlength="100" rows="3" placeholder="简单描述一下你的计划..." class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-orange-400"></textarea><div class="flex justify-end mt-1"><span id="char-counter" class="char-counter">0/100</span></div></div></div><div class="bg-white rounded-xl shadow-sm p-4 mt-4"><label class="block text-sm font-medium text-gray-700 mb-3">📱 预览效果</label><div id="preview-card" class="preview-card preview-empty"><p class="text-center text-sm text-gray-400">填写内容后预览将在此显示</p></div></div></main><div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50"><button id="pub-btn" class="pressable w-full h-12 bg-orange-500 text-white font-medium rounded-lg">发布到搭子广场</button></div></div>`;
  },
  init() {
    const draft = getStorage('publishDraft');
    if (draft) { this.state = Object.assign({}, this.state, draft); if (!this.state.weekend) this.state.weekend = { activity: '', location: '', time: '周六 9:00', description: '' }; }
    document.getElementById('back-btn').addEventListener('click', () => { this.saveDraft(); Router.navigateTo('/home'); });
    document.querySelectorAll('.tbtn').forEach(b => b.addEventListener('click', (e) => { this.state.type = e.currentTarget.dataset.t; this.updateForm(); this.saveDraft(); }));
    const descEl = document.getElementById('fdesc');
    if (descEl) {
      descEl.addEventListener('input', () => { this.state.weekend.description = descEl.value; this.updateCharCounter(); this.updatePreview(); this.saveDraft(); });
    }
    const locEl = document.getElementById('flocation');
    if (locEl) {
      locEl.addEventListener('input', () => { this.state.weekend.location = locEl.value; this.updatePreview(); this.saveDraft(); });
    }
    document.getElementById('pub-btn').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      if (btn.disabled) return;
      if (this.state.type === 'lunch' && !validateRequired(this.state.lunch.taste, document.getElementById('ftaste-err'))) { showToast('请至少选择1个口味偏好'); return; }
      if (this.state.type === 'commute' && !validateRequired(this.state.commute.area, document.getElementById('farea-err'))) { showToast('请选择居住区域'); return; }
      if (this.state.type === 'weekend' && !validateRequired(this.state.weekend.activity, document.getElementById('factivity-err'))) { showToast('请选择活动类型'); return; }
      setButtonLoading(btn, '发布中...');
      const contentMap = { lunch: this.state.lunch, commute: this.state.commute, weekend: this.state.weekend };
      const publishData = { scene: this.state.type, content: JSON.stringify(contentMap[this.state.type]), time_pref: this.state.type === 'lunch' ? this.state.lunch.time : this.state.type === 'commute' ? this.state.commute.time : this.state.weekend.time };
      try {
        const result = await publishToPlaza(publishData);
        if (result !== null) { removeStorage('publishDraft'); showToast('发布成功'); Router.navigateTo('/square'); } else { setButtonNormal(btn); }
      } catch (err) { setButtonNormal(btn); showToast('发布失败，请重试'); }
    });
    this.updateForm();
    this.renderOpts();
  },
  saveDraft() { setStorage('publishDraft', { type: this.state.type, lunch: this.state.lunch, commute: this.state.commute, weekend: this.state.weekend }); },
  updateForm() {
    document.querySelectorAll('.tbtn').forEach(b => { b.className = b.dataset.t === this.state.type ? 'tbtn p-3 rounded-lg border-2 border-orange-500 bg-orange-50 text-center' : 'tbtn p-3 rounded-lg border-2 border-gray-200 bg-white text-center'; });
    document.getElementById('form-lunch').classList.toggle('hidden', this.state.type !== 'lunch');
    document.getElementById('form-commute').classList.toggle('hidden', this.state.type !== 'commute');
    document.getElementById('form-weekend').classList.toggle('hidden', this.state.type !== 'weekend');
    this.renderOpts();
    this.updatePreview();
  },
  updateCharCounter() {
    const counter = document.getElementById('char-counter');
    if (!counter) return;
    const len = (this.state.weekend.description || '').length;
    counter.textContent = `${len}/100`;
    counter.className = `char-counter${len >= 100 ? ' over' : len >= 90 ? ' warn' : ''}`;
  },
  updatePreview() {
    const card = document.getElementById('preview-card');
    if (!card) return;
    const user = getStorage('userProfile');
    const name = user?.nickname || '我';
    const c = TYPE_META[this.state.type] || TYPE_META.lunch;
    let contentText = '';
    if (this.state.type === 'lunch') {
      const t = this.state.lunch;
      contentText = t.taste.length ? `${t.time} 想找${t.taste.join('/')}饭搭子，预算${t.budget}元` : '';
    } else if (this.state.type === 'commute') {
      const t = this.state.commute;
      contentText = t.area ? `${t.time} ${t.area}到科技园，找拼车搭子` : '';
    } else {
      const t = this.state.weekend;
      contentText = t.activity ? `${t.time} ${t.activity}${t.location ? '·' + t.location : ''}${t.description ? '，' + t.description : ''}` : '';
    }
    if (!contentText) { card.className = 'preview-card preview-empty'; card.innerHTML = '<p class="text-center text-sm text-gray-400">填写内容后预览将在此显示</p>'; return; }
    card.className = 'preview-card preview-filled';
    card.innerHTML = `<div class="flex items-center space-x-3 mb-2"><div class="w-8 h-8 ${c.bg} rounded-full flex items-center justify-center"><span class="text-xs ${c.text}">${name.charAt(0)}</span></div><div><span class="text-sm font-medium text-gray-900">${name}</span><span class="text-xs text-gray-400 ml-2">刚刚</span></div><span class="ml-auto px-2 py-0.5 rounded-full text-xs ${c.bg} ${c.text}">${c.label}</span></div><p class="text-sm text-gray-700">${contentText}</p>`;
  },
  renderOpts() {
    document.getElementById('ftime').innerHTML = TIME_OPTIONS.map(o => `<button data-v="${o.value}" class="otime px-4 py-2 rounded-full text-sm ${o.value === this.state.lunch.time ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('ftaste').innerHTML = TASTE_OPTIONS.map(o => `<button data-v="${o.value}" class="otaste px-4 py-2 rounded-full text-sm ${this.state.lunch.taste.includes(o.value) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.getElementById('fbudget').innerHTML = BUDGET_OPTIONS.map(o => `<button data-v="${o.value}" class="obudget px-4 py-2 rounded-full text-sm ${o.value === this.state.lunch.budget ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('farea').innerHTML = AREA_OPTIONS.map(o => `<button data-v="${o.value}" class="oarea px-4 py-2 rounded-full text-sm ${o.value === this.state.commute.area ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('fctime').innerHTML = [{ v: '07:00' }, { v: '07:30' }, { v: '08:00' }, { v: '08:30' }, { v: '09:00' }].map(o => `<button data-v="${o.v}" class="octime px-4 py-2 rounded-full text-sm ${o.v === this.state.commute.time ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.v}</button>`).join('');
    document.getElementById('ftransport').innerHTML = TRANSPORT_OPTIONS.map(o => `<button data-v="${o.value}" class="otransport px-4 py-2 rounded-full text-sm ${o.value === this.state.commute.transport ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.getElementById('factivity').innerHTML = WEEKEND_ACTIVITY_OPTIONS.map(o => `<button data-v="${o.value}" class="oactivity px-3 py-2 rounded-lg text-sm border ${o.value === this.state.weekend.activity ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.getElementById('fwtime').innerHTML = ['周六 9:00', '周六 14:00', '周日 9:00', '周日 14:00'].map(t => `<button data-v="${t}" class="owtime px-4 py-2 rounded-full text-sm ${t === this.state.weekend.time ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}">${t}</button>`).join('');
    const locEl = document.getElementById('flocation');
    if (locEl && this.state.weekend.location && locEl.value !== this.state.weekend.location) locEl.value = this.state.weekend.location;
    const descEl = document.getElementById('fdesc');
    if (descEl && this.state.weekend.description && descEl.value !== this.state.weekend.description) descEl.value = this.state.weekend.description;
    this.updateCharCounter();
    document.querySelectorAll('.otime').forEach(b => b.addEventListener('click', (e) => { this.state.lunch.time = e.target.dataset.v; this.renderOpts(); this.updatePreview(); this.saveDraft(); }));
    document.querySelectorAll('.otaste').forEach(b => b.addEventListener('click', (e) => { const v = e.target.dataset.v; const i = this.state.lunch.taste.indexOf(v); i > -1 ? this.state.lunch.taste.splice(i, 1) : this.state.lunch.taste.length < 3 ? this.state.lunch.taste.push(v) : showToast('最多3个'); this.renderOpts(); this.updatePreview(); this.saveDraft(); }));
    document.querySelectorAll('.obudget').forEach(b => b.addEventListener('click', (e) => { this.state.lunch.budget = e.target.dataset.v; this.renderOpts(); this.updatePreview(); this.saveDraft(); }));
    document.querySelectorAll('.oarea').forEach(b => b.addEventListener('click', (e) => { this.state.commute.area = e.target.dataset.v; this.renderOpts(); this.updatePreview(); this.saveDraft(); }));
    document.querySelectorAll('.octime').forEach(b => b.addEventListener('click', (e) => { this.state.commute.time = e.target.dataset.v; this.renderOpts(); this.updatePreview(); this.saveDraft(); }));
    document.querySelectorAll('.otransport').forEach(b => b.addEventListener('click', (e) => { this.state.commute.transport = e.target.dataset.v; this.renderOpts(); this.updatePreview(); this.saveDraft(); }));
    document.querySelectorAll('.oactivity').forEach(b => b.addEventListener('click', (e) => { this.state.weekend.activity = e.target.dataset.v; this.renderOpts(); this.updatePreview(); this.saveDraft(); }));
    document.querySelectorAll('.owtime').forEach(b => b.addEventListener('click', (e) => { this.state.weekend.time = e.target.dataset.v; this.renderOpts(); this.updatePreview(); this.saveDraft(); }));
  }
};

// ============ 食堂菜单页 ============
const MenuPage = {
  state: { location: 'all', canteen: 'all' },
  render() {
    const locTabs = ['all', ...(typeof MENU_LOCATIONS !== 'undefined' ? MENU_LOCATIONS : [])];
    const tabsHtml = locTabs.map(l => `<button data-loc="${l}" class="loctab whitespace-nowrap px-3 py-3 text-sm font-medium border-b-2 ${l === 'all' ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent'}">${l === 'all' ? '全部' : l.replace('科技园', '')}</button>`).join('');
    return `<div class="bg-gray-50 min-h-screen pb-6">${renderTopNavbar('今日食堂菜单', true)}<div class="fixed top-14 left-0 right-0 z-40"><div class="max-w-md mx-auto px-4 flex overflow-x-auto hide-scrollbar">${tabsHtml}</div></div><main class="max-w-md mx-auto px-4 pt-28 pb-4"><div id="menu-canteens" class="flex flex-wrap gap-2 mb-3"></div><div id="menu-grid" class="space-y-3"></div><p class="text-center text-xs text-gray-400 mt-4">数据来源：科技园食堂 · 今日实时更新</p></main></div>`;
  },
  init() {
    document.getElementById('back-btn').addEventListener('click', () => Router.navigateTo('/home'));
    document.querySelectorAll('.loctab').forEach(b => b.addEventListener('click', (e) => {
      this.state.location = e.currentTarget.dataset.loc;
      this.state.canteen = 'all';
      document.querySelectorAll('.loctab').forEach(b2 => { b2.className = `loctab whitespace-nowrap px-3 py-3 text-sm font-medium border-b-2 ${b2.dataset.loc === this.state.location ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent'}`; });
      this.renderMenu();
    }));
    this.renderMenu();
  },
  renderMenu() {
    let items = MOCK_MENUS;
    if (this.state.location !== 'all') items = items.filter(m => m.location === this.state.location);
    const canteens = ['all', ...new Set(items.map(m => m.canteen))];
    document.getElementById('menu-canteens').innerHTML = canteens.map(c => `<button data-ct="${c}" class="ctag px-3 py-1.5 rounded-full text-xs ${c === this.state.canteen ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${c === 'all' ? '全部档口' : c}</button>`).join('');
    document.querySelectorAll('.ctag').forEach(b => b.addEventListener('click', (e) => { this.state.canteen = e.currentTarget.dataset.ct; this.renderMenu(); }));
    let filtered = this.state.canteen === 'all' ? items : items.filter(m => m.canteen === this.state.canteen);
    if (filtered.length === 0) { document.getElementById('menu-grid').innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">🍽️</div><p class="empty-text">暂无该分类菜品</p></div>`; return; }
    document.getElementById('menu-grid').innerHTML = filtered.map(m => {
      const priceStr = m.price !== null ? `¥${m.price}` : '时价';
      const unitStr = m.unit && m.unit !== '按份' && m.unit !== '元/份' ? `<span class="text-xs text-gray-400">/${m.unit.replace('元/', '')}</span>` : '';
      const spicyStr = m.spicy > 0 ? spicyIcons(m.spicy) : '';
      const freeTag = m.price === 0 ? '<span class="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-600">免费</span>' : '';
      return `<div class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 card-appear">${m.image ? `<div class="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0"><img src="https://open.feishu.cn/open-apis/drive/v1/medias/${m.image}/download" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='🍽️'" /></div>` : ''}<div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1"><h4 class="text-sm font-semibold text-gray-900 truncate">${m.dish}</h4>${freeTag}</div><div class="flex items-center gap-2 text-xs text-gray-500"><span class="truncate">${m.canteen}</span>${spicyStr ? `<span>${spicyStr}</span>` : ''}</div></div><div class="text-right flex-shrink-0"><span class="text-base font-bold text-orange-500">${priceStr}</span>${unitStr}</div></div>`;
    }).join('');
  }
};

// ============ 每日推荐页 ============
const DailyPage = {
  render() {
    return `<div class="bg-gray-50 min-h-screen pb-6">${renderTopNavbar('今日推荐', true)}<main class="max-w-md mx-auto px-4 pt-18 pb-4 space-y-4">
      <div class="shimmer-card bg-gradient-to-r from-orange-400 to-orange-300 rounded-xl p-4 text-white shadow-md card-appear relative overflow-hidden">
        <div class="sparkle-container">
          <span class="sparkle star" style="top:10%;left:5%;animation-delay:0s">✦</span>
          <span class="sparkle heart" style="top:20%;right:10%;animation-delay:0.5s">♥</span>
          <span class="sparkle star" style="top:60%;left:15%;animation-delay:1.2s">✧</span>
          <span class="sparkle heart" style="top:40%;right:20%;animation-delay:0.8s">♡</span>
          <span class="sparkle star" style="top:75%;left:70%;animation-delay:1.5s">✦</span>
          <span class="sparkle heart" style="top:15%;left:60%;animation-delay:2s">♥</span>
          <span class="sparkle star" style="top:85%;right:30%;animation-delay:0.3s">✧</span>
          <span class="sparkle heart" style="top:50%;left:80%;animation-delay:1.8s">♡</span>
        </div>
        <div class="flex items-center justify-between mb-2"><span class="text-sm opacity-90">🔮 今日运势</span><button id="refresh-daily" class="pressable text-sm opacity-90 hover:opacity-100">换一个</button></div>
        <p id="daily-text" class="text-base mb-3 leading-relaxed">"加载中..."</p>
        <span id="daily-tag" class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs"></span>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 card-appear">
        <h3 class="text-base font-semibold text-gray-900 mb-3">🎴 玄学抽卡 · 今日幸运菜系</h3>
        <div id="fortune-card-area" class="relative flex justify-center items-center min-h-[140px]">
          <div id="fortune-cards" class="flex gap-3">
            <div class="fortune-card" data-idx="0"><div class="fortune-card-back">?</div><div class="fortune-card-front"></div></div>
            <div class="fortune-card" data-idx="1"><div class="fortune-card-back">?</div><div class="fortune-card-front"></div></div>
            <div class="fortune-card" data-idx="2"><div class="fortune-card-back">?</div><div class="fortune-card-front"></div></div>
          </div>
        </div>
        <p id="fortune-hint" class="text-center text-xs text-gray-400 mt-2">点击一张卡牌，揭晓今日幸运菜系</p>
        <div id="fortune-result" class="hidden mt-3 p-3 bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg text-center">
          <p id="fortune-constellation" class="text-sm text-purple-600 font-medium mb-1"></p>
          <p id="fortune-social" class="text-xs text-gray-500 mb-2"></p>
          <p id="fortune-dish" class="text-lg font-bold text-orange-600"></p>
          <p id="fortune-reason" class="text-xs text-gray-500 mt-1"></p>
        </div>
      </div>
      <div id="daily-buddy" class="bg-white rounded-xl shadow-sm p-4 card-appear hidden">
        <h3 class="text-base font-semibold text-gray-900 mb-3">👤 今日推荐搭子</h3>
        <div id="buddy-content"></div>
      </div>
      <div id="daily-restaurant" class="bg-white rounded-xl shadow-sm p-4 card-appear hidden">
        <h3 class="text-base font-semibold text-gray-900 mb-3">🍴 今日推荐餐厅</h3>
        <div id="restaurant-content"></div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 card-appear">
        <div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900">🍱 食堂今日菜单</h3><div id="menu-filter" class="flex gap-2 flex-wrap"></div></div>
        <div id="menu-list" class="space-y-2">${skeletonCards(2)}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 card-appear">
        <h3 class="text-base font-semibold text-gray-900 mb-3">🏷️ 园区优惠</h3>
        <div id="offer-list" class="space-y-2"></div>
      </div>
    </main></div>`;
  },
  init() {
    document.getElementById('back-btn').addEventListener('click', () => Router.navigateTo('/home'));
    document.getElementById('refresh-daily').addEventListener('click', () => this.loadRecommendation(true));
    this.state = { menuFilter: 'all', fortuneRevealed: false, recommendationIndex: 0 };
    this.initFortuneCards();
    this.loadRecommendation();
    this.loadMenu();
    this.loadOffers();
  },
  async loadRecommendation(advance = false) {
    const TAROT_FALLBACKS = [
      { text: '塔罗牌显示：今日贵人在食堂等你，主动开口必有惊喜', tag: '🃏 大阿卡纳·愚者' },
      { text: '塔罗牌显示：今日能量充盈，找到志同道合的饭搭子概率+200%', tag: '🌟 大阿卡纳·星星' },
      { text: '塔罗牌显示：今日适合突破舒适圈，试试平时不敢搭话的那位同事', tag: '☀️ 大阿卡纳·太阳' },
    ];
    if (advance) this.state.recommendationIndex = (this.state.recommendationIndex + 1) % TAROT_FALLBACKS.length;
    const demo = TAROT_FALLBACKS[this.state.recommendationIndex];
    const demoTextEl = document.getElementById('daily-text');
    const demoTagEl = document.getElementById('daily-tag');
    if (demoTextEl) demoTextEl.textContent = `"${demo.text}"`;
    if (demoTagEl) demoTagEl.textContent = demo.tag;
    // 异步从后端拉真实推荐，成功后覆盖
    getDailyRecommendation().then(rec => {
      if (!rec) return;
      const textEl = document.getElementById('daily-text');
      const tagEl = document.getElementById('daily-tag');
      const recText = rec.recommendation || rec.social_tip || rec.recommended_food;
      if (recText && textEl) textEl.textContent = `"${recText}"`;
      if (rec.funTag && tagEl) tagEl.textContent = rec.funTag;

      if (rec.suggestedBuddy) {
        const buddy = rec.suggestedBuddy;
        document.getElementById('daily-buddy').classList.remove('hidden');
        document.getElementById('buddy-content').innerHTML = `<div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><span class="text-lg font-medium text-orange-600">${buddy.nickname.charAt(0)}</span></div><div><h4 class="text-sm font-semibold text-gray-900">${buddy.nickname}</h4><p class="text-xs text-gray-500">${buddy.reason}</p></div></div><div class="flex items-center gap-2"><div class="score-ring" style="--score:${buddy.matchScore};width:40px;height:40px"><span class="score-num" style="font-size:11px">${buddy.matchScore}%</span></div><button id="invite-buddy-btn" class="pressable px-3 py-1.5 bg-orange-500 text-white text-xs rounded-full">邀请</button></div></div>`;
        document.getElementById('invite-buddy-btn')?.addEventListener('click', () => Router.navigateTo('/invite', { userId: buddy.uid || 'u006' }));
      }

      if (rec.suggestedRestaurant) {
        const rest = rec.suggestedRestaurant;
        const dishes = (rec.suggestedDishes || []).map(id => MOCK_MENUS.find(m => m.id === id)).filter(Boolean);
        document.getElementById('daily-restaurant').classList.remove('hidden');
        document.getElementById('restaurant-content').innerHTML = `<div class="flex items-center justify-between mb-3"><div><p class="text-sm font-semibold text-gray-900">${rest.name}</p><p class="text-xs text-gray-500">${rest.distance} · 人均${rest.avgPrice}</p></div></div>${dishes.length > 0 ? `<div class="space-y-1.5"><p class="text-xs text-gray-500 mb-1">今日推荐菜品</p>${dishes.map(d => `<div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"><div class="flex items-center gap-2"><span class="text-sm font-medium">${d.dish}</span></div><div class="flex items-center gap-2"><span class="text-xs font-medium text-orange-500">${d.price}元</span></div></div>`).join('')}</div>` : ''}`;
      }
    }).catch(() => {});
  },
  async loadMenu() {
    const result = await getFoodMenu();
    let menus = [];
    if (result && result.menus) {
      menus = result.menus.map(m => ({ id: m.id, canteen: m.canteen, dish: m.dish, tag: m.tag, price: m.price + '元', spicy: m.spicy, rating: m.rating }));
    } else {
      menus = MOCK_MENUS.map(m => ({ id: m.id, canteen: m.canteen, dish: m.dish, tag: m.tag, price: m.price + '元', spicy: m.spicy, rating: m.rating }));
    }
    this._menus = menus;
    const tags = ['all', ...new Set(menus.map(m => m.tag))];
    document.getElementById('menu-filter').innerHTML = tags.map(f => `<button data-f="${f}" class="mfilter px-2 py-1 rounded-full text-xs ${f === this.state.menuFilter ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${f === 'all' ? '全部' : f}</button>`).join('');
    document.querySelectorAll('.mfilter').forEach(b => b.addEventListener('click', (e) => { this.state.menuFilter = e.currentTarget.dataset.f; this.renderMenuList(); document.querySelectorAll('.mfilter').forEach(x => x.className = `mfilter px-2 py-1 rounded-full text-xs ${x.dataset.f === this.state.menuFilter ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`); }));
    this.renderMenuList();
  },
  renderMenuList() {
    const menus = this._menus || [];
    const filtered = this.state.menuFilter === 'all' ? menus : menus.filter(m => m.tag === this.state.menuFilter);
    const listEl = document.getElementById('menu-list');
    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">🍽️</div><p class="empty-text">今天这个口味暂时没有菜单</p></div>`;
      return;
    }
    listEl.innerHTML = filtered.slice(0, 8).map(m => `<div class="list-item"><div class="flex-1"><div class="flex items-center gap-2"><p class="text-sm font-medium text-gray-900">${m.dish}</p><span class="spicy-indicator">${spicyIcons(m.spicy || 0)}</span></div><p class="text-xs text-gray-500">${m.canteen} · ${m.tag}</p></div><div class="flex items-center gap-2"><span class="text-sm font-semibold text-orange-500">${m.price !== null ? '¥' + m.price : '时价'}</span></div></div>`).join('');
  },
  async loadOffers() {
    const result = await getFoodOffers();
    let offers = [];
    if (result && result.offers) { offers = result.offers; } else { offers = MOCK_OFFERS; }
    document.getElementById('offer-list').innerHTML = offers.map(o => {
      const days = getDaysRemaining(o.expireDate);
      const urgent = days <= 7;
      return `<div class="p-3 ${urgent ? 'bg-red-50 border border-red-100' : 'bg-gray-50'} rounded-lg"><div class="flex items-center justify-between"><div><p class="text-sm font-medium text-gray-900">${o.title}</p><p class="text-xs text-gray-500 mt-1">${o.desc}</p></div><span class="offer-countdown">${urgent ? '⏰' : '📅'} ${days}天后到期</span></div></div>`;
    }).join('');
  },
  initFortuneCards() {
    const FORTUNES = [
      { cuisine: '🌶️ 川菜', dish: '麻辣香锅', reason: '今日火象星座能量充沛，辣味激发灵感', social: '社交指数 ★★★★★' },
      { cuisine: '🥗 轻食', dish: '鸡胸肉沙拉', reason: '今日适合清爽味道，脑力值max', social: '社交指数 ★★★★☆' },
      { cuisine: '🍜 面食', dish: '兰州拉面', reason: '今日宜踏实，面食带来满满安全感', social: '社交指数 ★★★☆☆' },
      { cuisine: '🍲 特色', dish: '酸菜鱼', reason: '今日灵感爆棚，来点酸爽刺激味蕾', social: '社交指数 ★★★★☆' },
      { cuisine: '🍛 主食', dish: '咖喱鸡饭', reason: '今日异域风情加持，适合结识新朋友', social: '社交指数 ★★★★★' },
      { cuisine: '🥘 暖汤', dish: '番茄蛋花汤', reason: '今日温柔加持，暖胃暖心', social: '社交指数 ★★★☆☆' }
    ];
    const profileData = getStorage('userProfile') || {};
    const constellation = profileData.constellation || '天秤座';
    const shuffled = FORTUNES.sort(() => Math.random() - 0.5).slice(0, 3);
    document.querySelectorAll('.fortune-card').forEach((card, i) => {
      card.addEventListener('click', () => {
        if (this.state.fortuneRevealed) return;
        this.state.fortuneRevealed = true;
        const chosen = shuffled[i];
        card.classList.add('flipped', 'chosen');
        document.querySelectorAll('.fortune-card').forEach((c, j) => { if (j !== i) c.classList.add('dimmed'); });
        document.getElementById('fortune-hint').classList.add('hidden');
        const resultEl = document.getElementById('fortune-result');
        resultEl.classList.remove('hidden');
        document.getElementById('fortune-constellation').textContent = `♎ ${constellation}今日运势`;
        document.getElementById('fortune-social').textContent = chosen.social;
        document.getElementById('fortune-dish').textContent = `${chosen.cuisine} · ${chosen.dish}`;
        document.getElementById('fortune-reason').textContent = chosen.reason;
        card.querySelector('.fortune-card-front').textContent = chosen.cuisine;
      });
    });
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

// ============ 消息通知页（纯演示） ============
const NotificationPage = {
  _showAll: false,
  _announcements: [
    { id: 'ann_001', title: '欢迎使用 Mi搭子！', content: 'Mi搭子是小米人自己的轻社交平台，帮你找到志同道合的饭搭子、通勤搭子。快来完善你的画像，开始探索吧！', time: '刚刚' },
    { id: 'ann_002', title: '食堂菜单已更新', content: '三层食堂本周新增轻食沙拉窗口，欢迎品尝！', time: '昨天' },
    { id: 'ann_003', title: '系统维护通知', content: '本周六凌晨 2:00-4:00 进行系统维护，届时服务将暂停。', time: '3天前' },
    { id: 'ann_004', title: '新功能上线：周末搭子', content: '搭子广场新增「周末活动」分类，快去发起你的周末计划！', time: '5天前' },
  ],
  _invitations: [
    { id: 'inv_001', name: '张小明', dept: 'AI平台部', scene: 'lunch', sceneLabel: '午餐', color: 'orange', message: '看到我们都喜欢川菜，中午一起去吃麻辣香锅吧！', time: '10分钟前' },
    { id: 'inv_002', name: '李思雨', dept: '产品部', scene: 'commute', sceneLabel: '通勤', color: 'blue', message: '我也住回龙观，早上8:30出发，要不要一起拼车？', time: '1小时前' },
    { id: 'inv_003', name: '王大伟', dept: '基础架构部', scene: 'lunch', sceneLabel: '午餐', color: 'orange', message: '听说你也对摄影感兴趣，午饭时聊聊？', time: '昨天' },
    { id: 'inv_004', name: '陈思琪', dept: '手机部', scene: 'commute', sceneLabel: '通勤', color: 'blue', message: '我每天从天通苑出发去科技园，8点走，顺路一起？', time: '2天前' },
    { id: 'inv_005', name: '赵子涵', dept: '汽车部', scene: 'lunch', sceneLabel: '午餐', color: 'orange', message: '食堂新开的麻辣烫窗口评价不错，一起去试试？', time: '3天前' },
    { id: 'inv_006', name: '刘佳怡', dept: '生态链部', scene: 'lunch', sceneLabel: '午餐', color: 'orange', message: '看到你也在学吉他，午饭时交流一下心得呗～', time: '4天前' },
  ],
  _get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  _set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  _annRead() { return this._get('mimeet_ann_read', {}); },
  _invStatus() { return this._get('mimeet_invite_status', {}); },
  _hasUnread() {
    const ar = this._annRead();
    const is = this._invStatus();
    return this._announcements.some(a => !ar[a.id]) || this._invitations.some(i => (is[i.id] || 'pending') === 'pending');
  },
  _renderAnn(a, read) {
    return `<div class="bg-white rounded-xl shadow-sm p-4 min-h-[100px]" data-ann="${a.id}"><div class="flex items-start gap-3"><span class="w-2 h-2 ${read ? 'bg-gray-300' : 'bg-orange-500'} rounded-full flex-shrink-0 mt-1.5 ann-dot"></span><div class="flex-1"><div class="flex items-center justify-between mb-1"><h3 class="text-sm font-semibold ${read ? 'text-gray-500' : 'text-gray-900'} ann-title">${a.title}</h3><span class="text-xs text-gray-400">${a.time}</span></div><p class="text-xs text-gray-500 leading-relaxed">${a.content}</p><div class="flex justify-end mt-2"${read ? ' style="visibility:hidden"' : ''}><button data-ann="${a.id}" class="ann-read-btn text-xs text-orange-500">标为已读</button></div></div></div></div>`;
  },
  _renderInv(inv) {
    const st = this._invStatus()[inv.id] || 'pending';
    const avatar = inv.name.charAt(0);
    const unread = st === 'pending';
    const actionHtml = unread
      ? `<div class="flex gap-2"><button data-inv="${inv.id}" data-act="ignore" class="inv-act px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full">忽略</button><button data-inv="${inv.id}" data-act="accept" class="inv-act px-3 py-1.5 bg-${inv.color}-500 text-white text-xs rounded-full">接受</button></div>`
      : `<span class="text-xs ${st === 'accepted' ? 'text-green-500' : 'text-gray-400'}">${st === 'accepted' ? '已接受' : '已忽略'}</span>`;
    return `<div class="bg-white rounded-xl shadow-sm p-4" data-inv-card="${inv.id}"><div class="flex items-start gap-3"><div class="w-10 h-10 bg-${inv.color}-100 rounded-full flex items-center justify-center flex-shrink-0 relative"><span class="text-sm font-medium text-${inv.color}-600">${avatar}</span>${unread ? '<span class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full inv-dot"></span>' : ''}</div><div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-1"><div><span class="text-sm font-semibold text-gray-900">${inv.name}</span><span class="text-xs text-gray-400 ml-1">${inv.dept}</span></div><span class="text-xs text-gray-400">${inv.time}</span></div><span class="inline-block px-1.5 py-0.5 bg-${inv.color}-50 text-${inv.color}-600 text-xs rounded mb-1.5">${inv.sceneLabel}邀请</span><p class="text-xs text-gray-500 leading-relaxed mb-2">"${inv.message}"</p><div class="flex justify-end inv-actions">${actionHtml}</div></div></div></div>`;
  },
  render() {
    const ar = this._annRead();
    const visible = this._showAll ? this._announcements : this._announcements.slice(0, 2);
    const annHtml = visible.map(a => this._renderAnn(a, !!ar[a.id])).join('');
    const moreBtn = this._announcements.length > 2 && !this._showAll
      ? `<div class="flex justify-end"><button id="ann-more-btn" class="text-xs text-orange-500">查看更多</button></div>`
      : '';
    const invHtml = this._invitations.map(inv => this._renderInv(inv)).join('');
    return `<div class="about-page min-h-screen relative overflow-hidden">${renderBgEffects()}${renderTopNavbar('消息通知', false)}<main class="max-w-md mx-auto px-4 pt-18 pb-4 space-y-4 relative z-10"><div class="flex items-center justify-between"><h2 class="text-sm font-semibold text-gray-500 flex items-center gap-1.5"><svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg><span>系统公告</span></h2><button id="read-all-btn" class="text-xs text-gray-400">全部已读</button></div>${annHtml}${moreBtn}<div class="flex items-center justify-between mt-4"><h2 class="text-sm font-semibold text-gray-500 flex items-center gap-1.5"><svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><span>邀请消息</span></h2><button id="ignore-all-btn" class="text-xs text-gray-400">全部忽略</button></div>${invHtml}</main></div>`;
  },
  init() {
    // 查看更多公告 → 弹窗
    const moreBtn = document.getElementById('ann-more-btn');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        const ar = this._annRead();
        const allHtml = this._announcements.map(a => this._renderAnn(a, !!ar[a.id])).join('');
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/40 z-[60] flex items-end justify-center';
        overlay.innerHTML = `<div class="bg-gray-50 rounded-t-2xl w-full max-w-md max-h-[80vh] flex flex-col"><div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl"><span class="text-base font-semibold text-gray-900">全部系统公告</span><button id="ann-modal-close" class="w-8 h-8 flex items-center justify-center"><svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div><div class="flex-1 overflow-y-auto px-4 py-3 space-y-3">${allHtml}</div></div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('#ann-modal-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        // 弹窗内已读按钮
        overlay.querySelectorAll('.ann-read-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const annId = btn.dataset.ann;
            const readMap = this._annRead(); readMap[annId] = true; this._set('mimeet_ann_read', readMap);
            const card = overlay.querySelector(`[data-ann="${annId}"]`);
            card.querySelector('.ann-dot').className = 'w-2 h-2 bg-gray-300 rounded-full flex-shrink-0 mt-1.5 ann-dot';
            card.querySelector('.ann-title').classList.replace('text-gray-900', 'text-gray-500');
            btn.closest('.flex.justify-end').style.visibility = 'hidden';
            // 同步主页对应卡片
            const mainCard = document.querySelector(`#app [data-ann="${annId}"]`);
            if (mainCard) {
              mainCard.querySelector('.ann-dot').className = 'w-2 h-2 bg-gray-300 rounded-full flex-shrink-0 mt-1.5 ann-dot';
              mainCard.querySelector('.ann-title').classList.replace('text-gray-900', 'text-gray-500');
              const mainBtn = mainCard.querySelector('.ann-read-btn');
              if (mainBtn) mainBtn.closest('.flex.justify-end').style.visibility = 'hidden';
            }
            if (!this._hasUnread()) { const d = document.getElementById('msg-dot'); if (d) d.classList.add('hidden'); } window._updateSidebarMsgCount?.();
          });
        });
      });
    }
    // 单条公告已读
    document.querySelectorAll('.ann-read-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const annId = btn.dataset.ann;
        const ar = this._annRead(); ar[annId] = true; this._set('mimeet_ann_read', ar);
        const card = document.querySelector(`[data-ann="${annId}"]`);
        card.querySelector('.ann-dot').className = 'w-2 h-2 bg-gray-300 rounded-full flex-shrink-0 mt-1.5 ann-dot';
        card.querySelector('.ann-title').classList.replace('text-gray-900', 'text-gray-500');
        btn.closest('.flex.justify-end').style.visibility = 'hidden';
        if (!this._hasUnread()) { const d = document.getElementById('msg-dot'); if (d) d.classList.add('hidden'); } window._updateSidebarMsgCount?.();
      });
    });
    // 全部已读（仅公告）
    document.getElementById('read-all-btn').addEventListener('click', () => {
      const ar = this._annRead();
      this._announcements.forEach(a => ar[a.id] = true);
      this._set('mimeet_ann_read', ar);
      document.querySelectorAll('.ann-dot').forEach(d => d.className = 'w-2 h-2 bg-gray-300 rounded-full flex-shrink-0 mt-1.5 ann-dot');
      document.querySelectorAll('.ann-title').forEach(h => h.classList.replace('text-gray-900', 'text-gray-500'));
      document.querySelectorAll('[data-ann] .flex.justify-end').forEach(el => el.style.visibility = 'hidden');
      if (!this._hasUnread()) { const d = document.getElementById('msg-dot'); if (d) d.classList.add('hidden'); } window._updateSidebarMsgCount?.();
      showToast('公告已全部已读');
    });
    // 全部忽略（仅邀请，带确认弹窗）
    document.getElementById('ignore-all-btn').addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/40 z-[60] flex items-center justify-center';
      overlay.innerHTML = `<div class="bg-white rounded-xl shadow-lg p-6 mx-4 max-w-xs w-full"><p class="text-base font-semibold text-gray-900 mb-2">确认全部忽略？</p><p class="text-sm text-gray-500 mb-6">忽略后所有邀请将标记为已忽略，无法撤回。</p><div class="flex gap-3"><button id="confirm-cancel" class="flex-1 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">取消</button><button id="confirm-ok" class="flex-1 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-lg">确认忽略</button></div></div>`;
      document.body.appendChild(overlay);
      overlay.querySelector('#confirm-cancel').addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
      overlay.querySelector('#confirm-ok').addEventListener('click', () => {
        const is = this._invStatus();
        this._invitations.forEach(inv => { if ((is[inv.id] || 'pending') === 'pending') is[inv.id] = 'ignored'; });
        this._set('mimeet_invite_status', is);
        // 更新每条待处理的邀请卡片（已接受的不动）
        this._invitations.forEach(inv => {
          const card = document.querySelector(`[data-inv-card="${inv.id}"]`);
          if (!card) return;
          const dot = card.querySelector('.inv-dot');
          if (dot) dot.remove();
          const actions = card.querySelector('.inv-actions');
          if (actions && (is[inv.id] || 'pending') === 'ignored') actions.innerHTML = '<span class="text-xs text-gray-400">已忽略</span>';
        });
        const homeDot = document.getElementById('msg-dot');
        if (homeDot) homeDot.classList.add('hidden');
        window._updateSidebarMsgCount?.();
        overlay.remove();
        showToast('已忽略全部邀请');
      });
    });
    // 单条邀请操作
    document.querySelectorAll('.inv-act').forEach(btn => {
      btn.addEventListener('click', () => {
        const invId = btn.dataset.inv;
        const act = btn.dataset.act;
        const is = this._invStatus(); is[invId] = act === 'accept' ? 'accepted' : 'ignored'; this._set('mimeet_invite_status', is);
        const wrapper = btn.closest('.inv-actions');
        wrapper.innerHTML = `<span class="text-xs ${act === 'accept' ? 'text-green-500' : 'text-gray-400'}">${act === 'accept' ? '已接受' : '已忽略'}</span>`;
        const card = document.querySelector(`[data-inv-card="${invId}"]`);
        const redDot = card.querySelector('.inv-dot');
        if (redDot) redDot.remove();
        showToast(act === 'accept' ? '已接受邀请' : '已忽略');
        if (!this._hasUnread()) { const d = document.getElementById('msg-dot'); if (d) d.classList.add('hidden'); } window._updateSidebarMsgCount?.();
      });
    });
  }
};

// ============ AI 智能助手 ============
const AIAssistant = {
  isOpen: false,
  messages: [],
  apiConfig: {
    endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
    apiKey: '',
    model: 'XiaoMi/MiMo-7B-RL',
  },
  systemPrompt: `你是Mi搭子的AI助手，专门服务于小米园区员工。你的职责是：
1. 帮用户推荐食堂菜品（基于今日菜单）
2. 查询食堂实时客流情况
3. 查找合适的饭搭子或拼车搭子
4. 查询菜品卡路里和营养信息
5. 展示优惠活动
6. 提供健康饮食建议
回答要求：
- 简洁友好，像朋友聊天一样
- 使用emoji让回复更生动
- 结合园区实际情况给出建议
- 如果不确定，诚实说明
当前园区食堂信息：
- 一楼食堂：2010餐厅·称重餐线（科技园CD栋）
- 二楼食堂：米宴北京·餐线（科技园AB栋）
- 三楼食堂：星辰大海·餐线（科技园CD栋）
- 轻食区：轻食餐线·卤肉饭（科技园E栋）
- 小吃岛：小吃岛·花车（科技园B栋）`,
  conversationHistory: [],
  maxHistoryLength: 20,
  mockFlowData: [
    { location: '一楼食堂', count: 35, level: 'low' },
    { location: '二楼食堂', count: 78, level: 'medium' },
    { location: '三楼食堂', count: 120, level: 'high' }
  ],
  calorieDB: {
    '红烧肉': { cal: 350, protein: 18, fat: 28, carb: 5 },
    '鸡胸肉': { cal: 165, protein: 31, fat: 3.6, carb: 0 },
    '鸡胸肉沙拉': { cal: 250, protein: 28, fat: 12, carb: 8 },
    '清蒸鱼': { cal: 120, protein: 20, fat: 4, carb: 0 },
    '米饭': { cal: 130, protein: 2.7, fat: 0.3, carb: 28 },
    '面条': { cal: 220, protein: 8, fat: 1.5, carb: 43 },
    '蔬菜沙拉': { cal: 80, protein: 3, fat: 5, carb: 6 },
    '酱牛肉': { cal: 190, protein: 28, fat: 8, carb: 0 },
    '盐田虾': { cal: 95, protein: 18, fat: 2, carb: 0 },
    '卤梅花肉': { cal: 280, protein: 20, fat: 22, carb: 2 },
    '锅包鱼': { cal: 180, protein: 22, fat: 10, carb: 0 },
    '卤水鸡腿': { cal: 220, protein: 25, fat: 12, carb: 1 },
    '地三鲜': { cal: 150, protein: 4, fat: 10, carb: 12 },
    '清炒时蔬': { cal: 60, protein: 2, fat: 4, carb: 4 },
    '辣子椒麻鸡': { cal: 200, protein: 24, fat: 10, carb: 2 },
    '大块肘子': { cal: 320, protein: 22, fat: 25, carb: 3 },
    '干煸贴骨牛肉': { cal: 260, protein: 30, fat: 15, carb: 2 },
    '什锦西兰花': { cal: 90, protein: 5, fat: 5, carb: 8 },
    '风味凉皮': { cal: 180, protein: 5, fat: 8, carb: 25 },
    '浓香卤肉饭': { cal: 450, protein: 18, fat: 20, carb: 55 },
    '豉油鸡饭': { cal: 420, protein: 22, fat: 15, carb: 50 },
    '泰式咖喱牛腩煲': { cal: 380, protein: 25, fat: 22, carb: 20 },
    '番茄鱼片': { cal: 160, protein: 20, fat: 6, carb: 8 },
  },
  mockBuddies: [
    { name: '吴同学', dept: '人力资源部', matchRate: 92, reason: '都喜欢清淡口味' },
    { name: '李同学', dept: '手机部', matchRate: 85, reason: '都对AI感兴趣' },
    { name: '王同学', dept: '新业务部', matchRate: 78, reason: '都在科技园CD栋' },
    { name: '赵同学', dept: '集团技术委', matchRate: 75, reason: '都喜欢运动' },
    { name: '周同学', dept: '互联网业务部', matchRate: 72, reason: '都是校招生' },
  ],
  init() {
    this.loadSavedSettings();
    this.createFloatingButton();
    this.createChatWindow();
    this.checkVisibility();
    // 监听登录/偏好变化
    window.addEventListener('storage', () => this.checkVisibility());
    // 定时检查（登录/偏好可能在同一标签页变化）
    this._visInterval = setInterval(() => this.checkVisibility(), 2000);
  },
  checkVisibility() {
    const u = getStorage('userInfo');
    const p = getStorage('userProfile');
    const ready = u && p && (p.lunchPreference || p.commutePreference);
    const fab = document.getElementById('ai-fab');
    const win = document.getElementById('ai-chat-window');
    if (fab) fab.style.display = ready ? '' : 'none';
    if (win && !ready) { win.classList.remove('show'); this.isOpen = false; }
  },
  createFloatingButton() {
    const fab = document.createElement('button');
    fab.className = 'ai-fab';
    fab.id = 'ai-fab';
    fab.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><path d="M10 21v1a2 2 0 0 0 4 0v-1"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/></svg>`;
    document.body.appendChild(fab);

    // 拖动逻辑
    let dragging = false, moved = false;
    let startX, startY, origRight, origBottom;

    const onStart = (e) => {
      const pos = e.touches ? e.touches[0] : e;
      startX = pos.clientX;
      startY = pos.clientY;
      origRight = parseInt(getComputedStyle(fab).right);
      origBottom = parseInt(getComputedStyle(fab).bottom);
      dragging = true;
      moved = false;
      fab.style.animation = 'none';
      fab.style.transition = 'none';
    };
    const onMove = (e) => {
      if (!dragging) return;
      const pos = e.touches ? e.touches[0] : e;
      const dx = pos.clientX - startX;
      const dy = startY - pos.clientY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      const newRight = Math.max(0, Math.min(window.innerWidth - 60, origRight - dx));
      const newBottom = Math.max(0, Math.min(window.innerHeight - 60, origBottom + dy));
      fab.style.right = newRight + 'px';
      fab.style.bottom = newBottom + 'px';
      if (this.isOpen) this.syncWindowPosition();
      e.preventDefault();
    };
    const onEnd = (e) => {
      if (!dragging) return; // 不是从 fab 开始的拖拽，忽略
      dragging = false;
      fab.style.transition = '';
      if (!moved) {
        this.toggle();
      }
    };
    fab.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    fab.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  },
  createChatWindow() {
    const win = document.createElement('div');
    win.className = 'ai-chat-window';
    win.id = 'ai-chat-window';
    win.innerHTML = `
      <div class="ai-chat-header">
        <div>
          <h3>🤖 Mi搭子助手</h3>
          <span class="ai-status" id="ai-status">本地模式</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="ai-settings-btn" id="ai-settings-btn" title="设置API">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          <button class="ai-chat-close" id="ai-chat-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
      <div class="ai-settings-panel hidden" id="ai-settings-panel">
        <div class="ai-settings-title">⚙️ 模型设置</div>
        <div class="ai-settings-field">
          <label>模型选择</label>
          <select id="ai-model-select">
            <option value="XiaoMi/MiMo-7B-RL" ${this.apiConfig.model === 'XiaoMi/MiMo-7B-RL' ? 'selected' : ''}>MiMo-7B（小米推荐）</option>
            <option value="Qwen/Qwen2.5-7B-Instruct" ${this.apiConfig.model === 'Qwen/Qwen2.5-7B-Instruct' ? 'selected' : ''}>通义千问-7B</option>
            <option value="deepseek-ai/DeepSeek-V2-Chat" ${this.apiConfig.model === 'deepseek-ai/DeepSeek-V2-Chat' ? 'selected' : ''}>DeepSeek-V2</option>
            <option value="THUDM/glm-4-9b-chat" ${this.apiConfig.model === 'THUDM/glm-4-9b-chat' ? 'selected' : ''}>GLM-4-9B</option>
          </select>
        </div>
        <div class="ai-settings-actions">
          <button id="ai-settings-save" class="ai-settings-save">保存并连接</button>
          <button id="ai-settings-cancel" class="ai-settings-cancel">取消</button>
        </div>
      </div>
      <div class="ai-quick-actions" id="ai-quick-actions">
        <button class="ai-quick-btn" data-action="food"><span class="icon">🍜</span><span>找吃的</span></button>
        <button class="ai-quick-btn" data-action="offer"><span class="icon">🎫</span><span>找优惠</span></button>
        <button class="ai-quick-btn" data-action="buddy"><span class="icon">👥</span><span>找搭子</span></button>
        <button class="ai-quick-btn" data-action="calorie"><span class="icon">📊</span><span>查卡路里</span></button>
        <button class="ai-quick-btn" data-action="flow"><span class="icon">📍</span><span>查客流</span></button>
        <button class="ai-quick-btn" data-action="health"><span class="icon">💪</span><span>健康建议</span></button>
        <button class="ai-quick-btn" data-action="feedback"><span class="icon">💬</span><span>提反馈</span></button>
        <button class="ai-quick-btn" data-action="chat"><span class="icon">🤖</span><span>闲聊</span></button>
      </div>
      <div class="ai-chat-messages" id="ai-chat-messages"></div>
      <div class="ai-chat-input">
        <input type="text" id="ai-input" placeholder="输入消息..." autocomplete="off">
        <button id="ai-send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>
      </div>`;
    document.body.appendChild(win);
    document.getElementById('ai-chat-close').addEventListener('click', () => this.toggle());
    document.getElementById('ai-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('ai-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') this.sendMessage(); });
    document.getElementById('ai-settings-btn').addEventListener('click', () => document.getElementById('ai-settings-panel').classList.toggle('hidden'));
    document.getElementById('ai-settings-save').addEventListener('click', () => this.saveAPISettings());
    document.getElementById('ai-settings-cancel').addEventListener('click', () => document.getElementById('ai-settings-panel').classList.add('hidden'));
    document.querySelectorAll('.ai-quick-btn').forEach(btn => btn.addEventListener('click', () => this.handleQuickAction(btn.dataset.action)));
    this.addBotMessage('你好！我是Mi搭子助手 🤖\n\n直接告诉我你想干嘛就行，比如：\n\n💬 "中午吃什么好"\n💬 "现在食堂人多吗"\n💬 "红烧肉多少卡"\n💬 "有什么优惠活动"\n💬 "找个人一起吃饭"\n\n随便问，我能听懂！');
  },
  toggle() {
    this.isOpen = !this.isOpen;
    const win = document.getElementById('ai-chat-window');
    const fab = document.getElementById('ai-fab');
    win.classList.toggle('show', this.isOpen);
    fab.classList.toggle('open', this.isOpen);
    if (this.isOpen) this.syncWindowPosition();
  },
  syncWindowPosition() {
    const fab = document.getElementById('ai-fab');
    const win = document.getElementById('ai-chat-window');
    if (!fab || !win) return;
    const rect = fab.getBoundingClientRect();
    // 窗口右下角对齐按钮左上角，往下偏移让窗口更低
    let winRight = window.innerWidth - rect.left + 10;
    let winBottom = window.innerHeight - rect.bottom - 10;
    // 防止超出屏幕
    const winW = 460, winH = 780;
    if (winRight + winW > window.innerWidth) winRight = window.innerWidth - winW - 8;
    if (winBottom < 8) winBottom = 8;
    if (winBottom + winH > window.innerHeight) winBottom = window.innerHeight - winH - 8;
    if (winRight < 8) winRight = 8;
    win.style.right = winRight + 'px';
    win.style.bottom = winBottom + 'px';
  },
  async sendMessage() {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text) return;
    this.addUserMessage(text);
    input.value = '';
    input.disabled = true;
    await this.processUserInput(text);
    input.disabled = false;
    input.focus();
  },
  async callAIAPI(userMessage) {
    if (!this.apiConfig.apiKey) return null;
    try {
      this.conversationHistory.push({ role: 'user', content: userMessage });
      if (this.conversationHistory.length > this.maxHistoryLength) this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
      const messages = [{ role: 'system', content: this.systemPrompt }, ...this.conversationHistory];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(this.apiConfig.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiConfig.apiKey}` },
        body: JSON.stringify({ model: this.apiConfig.model, messages, temperature: 0.7, max_tokens: 500, stream: false }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`API请求失败: ${response.status}`);
      const data = await response.json();
      let aiReply = '';
      if (data.choices && data.choices[0] && data.choices[0].message) aiReply = data.choices[0].message.content || '';
      else if (data.content && data.content[0]) aiReply = data.content[0].text || '';
      else throw new Error('API响应格式异常');
      this.conversationHistory.push({ role: 'assistant', content: aiReply });
      return aiReply;
    } catch (error) {
      console.error('AI API调用失败:', error);
      if (this.conversationHistory.length > 0 && this.conversationHistory[this.conversationHistory.length - 1].role === 'user') this.conversationHistory.pop();
      return null;
    }
  },
  saveLocalContext(userMessage, botReply) {
    this.conversationHistory.push({ role: 'user', content: userMessage }, { role: 'assistant', content: botReply });
    if (this.conversationHistory.length > this.maxHistoryLength) this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
  },
  async processUserInput(text) {
    this.showTyping();
    this.isAPIMode = true;
    const aiReply = await this.callAIAPI(text);
    if (aiReply) { this.isAPIMode = false; this.hideTyping(); this.addBotMessage(aiReply); }
    else { this.isAPIMode = false; await this.processWithLocalRules(text); }
  },
  extractDishFromContext(text) {
    const lower = text.toLowerCase();
    const hasReference = ['那个', '这个', '它', '前面说的', '刚才'].some(w => lower.includes(w));
    if (hasReference && this.conversationHistory.length > 0) {
      const allText = this.conversationHistory.slice(-4).map(m => m.content).join(' ');
      for (const dish of Object.keys(this.calorieDB)) { if (allText.includes(dish)) return dish; }
      if (typeof MOCK_MENUS !== 'undefined') { for (const item of MOCK_MENUS) { if (allText.includes(item.dish)) return item.dish; } }
    }
    return null;
  },
  async processWithLocalRules(text) {
    this.hideTyping();
    this.currentUserMessage = text;
    const lower = text.toLowerCase().replace(/[？。，！,.]/g, '');
    const calorieMatch = this.matchCalorieQuery(lower) || this.extractDishFromContext(lower);
    if (calorieMatch && lower.match(/卡|热量|千卡|大卡/)) { this.queryCalorie(calorieMatch); return; }
    if (this.hasAny(lower, ['吃什么', '午饭', '午餐', '晚餐', '早饭', '早餐', '菜单', '今天吃', '推荐', '有啥吃的', '有啥好的', '吃啥', '不知道吃', '选择困难', '纠结'])) {
      if (this.hasAny(lower, ['清淡', '轻食', '素'])) this.filterByTaste('清淡');
      else if (this.hasAny(lower, ['辣', '川', '湘', '麻辣'])) this.filterByTaste('辣');
      else if (this.hasAny(lower, ['肉', '硬菜', '大餐'])) this.recommendMeat();
      else if (this.hasAny(lower, ['便宜', '实惠', '省钱'])) this.recommendCheap();
      else if (this.hasAny(lower, ['快', '赶时间', '急'])) this.recommendQuick();
      else this.handleFoodRecommend();
      return;
    }
    if (this.hasAny(lower, ['人多', '人少', '客流', '排队', '拥挤', '等位', '有没有位置', '现在去'])) { this.handleFlowQuery(); return; }
    if (this.hasAny(lower, ['优惠', '折扣', '活动', '减', '券', '红包', '满减', '打折', '员工福利', '福利'])) {
      if (this._inOffersChat) {
        // 已在优惠对话模式，继续追问
        this.showTyping();
        await this._sendOffersChat(text);
        this.hideTyping();
      } else {
        this.handleOffers();
      }
      return;
    }
    if (this.hasAny(lower, ['搭子', '找人', '一起', '拼桌', '约饭', '有人吗', '陪同', '陪伴'])) {
      if (this.hasAny(lower, ['拼车', '顺风车', '回龙观', '天通苑', '西二旗'])) this.handleCommuteBuddy();
      else this.handleFindBuddy();
      return;
    }
    if (this.hasAny(lower, ['健康', '步数', '运动', '走了', '消耗', '蛋白质', '营养', '减脂', '增肌', '健身'])) { this.handleHealthAdvice(); return; }
    if (this.hasAny(lower, ['反馈', '建议', '投诉', '吐槽', '问题', '意见', '改进'])) { this.handleFeedback(); return; }
    if (this.hasAny(lower, ['你好', 'hi', 'hello', '嗨', '在吗', '在不在', '早上好', '晚上好', '中午好'])) {
      this.addBotMessage(['你好呀！😊 我是Mi搭子助手，有什么可以帮你的？', '嗨！👋 今天想吃点什么？还是找搭子？', '在在在！🤖 随时为你服务～'][Math.floor(Math.random() * 3)]);
      return;
    }
    if (this.hasAny(lower, ['谢谢', '感谢', '多谢', '谢了', '辛苦'])) {
      this.addBotMessage(['不客气！有需要随时找我～ 😊', '能帮到你就好！还需要什么吗？', '随时效劳！🙌'][Math.floor(Math.random() * 3)]);
      return;
    }
    if (this.hasAny(lower, ['再见', '拜拜', 'bye', '走了', '先这样'])) { this.addBotMessage('好的，有需要再来找我！祝用餐愉快～ 🍽️'); return; }
    const priceMatch = this.matchPriceQuery(lower);
    if (priceMatch) { this.queryPrice(priceMatch); return; }
    if (this.hasAny(lower, ['几点', '时间', '开饭', '开门', '营业', '关'])) { this.addBotMessage('🕐 食堂营业时间：\n\n早餐：07:30 - 09:00\n午餐：11:00 - 13:30\n晚餐：17:00 - 19:30\n\n轻食区/小吃岛营业时间更长哦～'); return; }
    if (this.hasAny(lower, ['在哪', '位置', '地址', '怎么走', '哪里'])) { this.addBotMessage('📍 园区食堂位置：\n\n• 一楼食堂：CD栋1层\n• 二楼食堂：AB栋2层\n• 三楼食堂：CD栋3层\n• 轻食区：E栋2层\n• 小吃岛：B栋1层\n\n需要我帮你导航吗？'); return; }
    if (this.hasAny(lower, ['食堂', '饭', '菜', '餐'])) { this.handleFoodRecommend(); return; }
    if (this.hasAny(lower, ['冷', '热', '空调', '环境', '卫生'])) { this.addBotMessage('📝 已记录你的反馈：关于环境问题\n\n我会帮你转达给后勤部门，感谢你的反馈！还有什么需要补充的吗？'); return; }
    this.addBotMessage(['收到！我来帮你分析一下～\n\n你可以直接告诉我：\n• "中午吃什么好"\n• "现在食堂人多吗"\n• "有什么优惠"\n• "红烧肉多少卡"', '我还在学习中，不过这些我能帮到你：\n\n🍜 说"吃什么" - 推荐菜品\n📍 说"人多吗" - 查客流\n🎫 说"优惠" - 查折扣\n👥 说"找搭子" - 匹配搭子'][Math.floor(Math.random() * 2)]);
  },
  hasAny(text, keywords) { return keywords.some(k => text.includes(k)); },
  matchCalorieQuery(text) {
    const calorieKeywords = ['卡', '卡路里', '热量', '千卡', '大卡', '多少卡', '多少热量', '多少千卡'];
    if (calorieKeywords.some(k => text.includes(k))) {
      for (const dish of Object.keys(this.calorieDB)) { if (text.includes(dish)) return dish; }
      const match = text.match(/(.+?)(?:多少|几)(?:卡|热量|千卡)/);
      if (match) return match[1];
    }
    const foodPattern = text.match(/^(.+?)(?:是|的)(?:什么|啥)(?:营养|成分)/);
    if (foodPattern) return foodPattern[1];
    return null;
  },
  matchPriceQuery(text) {
    const priceKeywords = ['多少钱', '价格', '价位', '贵不贵', '便宜吗', '收费'];
    if (priceKeywords.some(k => text.includes(k))) {
      const menus = typeof MOCK_MENUS !== 'undefined' ? MOCK_MENUS : [];
      for (const item of menus) { if (text.includes(item.dish)) return item; }
      const contextDish = this.extractDishFromContext(text);
      if (contextDish) { for (const item of menus) { if (item.dish === contextDish) return item; } }
    }
    return null;
  },
  queryPrice(item) {
    let msg = `💰 ${item.dish}\n\n价格：¥${item.price}${item.unit}\n位置：${item.canteen} · ${item.location}\n口味：${item.spicy === 0 ? '不辣' : item.spicy <= 2 ? '微辣' : '辣'}\n\n`;
    msg += item.price <= 10 ? '💡 这个很实惠哦！推荐尝试～' : item.price <= 20 ? '💡 价格适中，性价比不错！' : '💡 品质之选，偶尔犒劳一下自己！';
    this.addBotMessage(msg);
  },
  recommendMeat() {
    const menus = typeof MOCK_MENUS !== 'undefined' ? MOCK_MENUS : [];
    const meatDishes = menus.filter(m => m.dish.includes('肉') || m.dish.includes('鸡') || m.dish.includes('鱼') || m.dish.includes('牛') || m.dish.includes('虾') || m.dish.includes('肘')).slice(0, 5);
    let msg = '🍖 硬菜推荐：\n\n';
    meatDishes.forEach(d => { msg += `• ${d.dish} - ¥${d.price}${d.unit}\n  ${d.canteen}\n`; });
    this.addBotMessage(msg + '\n今天要好好犒劳自己！', [{ text: '查看客流', action: () => this.handleFlowQuery() }, { text: '找搭子一起', action: () => this.handleFindBuddy() }]);
  },
  recommendCheap() {
    const menus = typeof MOCK_MENUS !== 'undefined' ? MOCK_MENUS : [];
    const cheapDishes = menus.filter(m => m.price <= 10).slice(0, 6);
    let msg = '💰 实惠之选（10元以内）：\n\n';
    cheapDishes.forEach(d => { msg += `• ${d.dish} - ¥${d.price}${d.unit}\n  ${d.canteen}\n`; });
    this.addBotMessage(msg + '\n省钱也能吃得好！', [{ text: '查看全部菜单', action: () => this.handleFoodRecommend() }]);
  },
  recommendQuick() {
    const menus = typeof MOCK_MENUS !== 'undefined' ? MOCK_MENUS : [];
    const quickDishes = menus.filter(m => m.dish.includes('饭') || m.dish.includes('面') || m.dish.includes('粉') || m.tag === '按份').slice(0, 5);
    let msg = '⚡ 快速出餐推荐：\n\n';
    quickDishes.forEach(d => { msg += `• ${d.dish} - ¥${d.price}${d.unit}\n  ${d.canteen}\n`; });
    this.addBotMessage(msg + '\n赶时间的话选这些最快！', [{ text: '查看客流', action: () => this.handleFlowQuery() }]);
  },
  handleCommuteBuddy() {
    const buddies = [
      { name: '王同学', route: '回龙观 → 科技园', time: '8:30', transport: '顺风车' },
      { name: '李同学', route: '天通苑 → 科技园', time: '8:00', transport: '地铁' },
      { name: '张同学', route: '西二旗 → 科技园', time: '9:00', transport: '打车' },
    ];
    let msg = '🚗 找拼车搭子：\n\n';
    buddies.forEach((b, i) => { msg += `${i + 1}. ${b.name}\n   ${b.route} · ${b.time} · ${b.transport}\n\n`; });
    this.addBotMessage(msg + '要帮你联系他们吗？', [
      { text: '联系王同学', action: () => this.addBotMessage('已向王同学发送拼车邀请！等待回复中... ⏳') },
      { text: '发布拼车需求', action: () => this.addBotMessage('好的！请告诉我：\n1. 出发地点\n2. 出发时间\n3. 交通方式偏好') }
    ]);
  },
  handleQuickAction(action) {
    const map = { food: () => this.handleFoodRecommend(), offer: () => this.handleOffers(), buddy: () => this.handleFindBuddy(), calorie: () => this.handleCalorieQuery(), flow: () => this.handleFlowQuery(), health: () => this.handleHealthAdvice(), feedback: () => this.handleFeedback(), chat: () => this.handleChat() };
    if (map[action]) map[action]();
  },
  async handleFoodRecommend() {
    this.addBotMessage('正在为你个性化推荐，稍等一下～ 🍽️');
    try {
      const res = await request('/api/agent/recommend', { method: 'POST', body: { type: 'food' } });
      if (res && res.recommendations && res.recommendations.length) {
        let msg = '🍽️ 根据你的口味偏好，今日推荐：\n\n';
        if (res.highlights && res.highlights.length) {
          msg += '⭐ 今日亮点：\n';
          res.highlights.forEach(h => { msg += `• ${h.dish}（${h.canteen}）${h.note ? ' — ' + h.note : ''}\n`; });
          msg += '\n';
        }
        msg += '📋 个性化推荐：\n';
        res.recommendations.forEach(r => { msg += `• ${r.dish} - ¥${r.price}${r.unit || ''}\n  ${r.canteen} · ${r.location}\n  ${r.reason ? '💬 ' + r.reason : ''}\n\n`; });
        this.addBotMessage(msg.trim(), [
          { text: '找搭子一起去', action: () => this.handleFindBuddy() },
          { text: '查客流', action: () => this.handleFlowQuery() },
        ]);
      } else {
        this._handleFoodFallback();
      }
    } catch (e) {
      this._handleFoodFallback();
    }
  },
  _handleFoodFallback() {
    const menus = typeof MOCK_MENUS !== 'undefined' ? MOCK_MENUS : [];
    const dishes = menus.slice(0, 5);
    let msg = '🍽️ 今日推荐菜品：\n\n';
    dishes.forEach(d => { msg += `• ${d.dish} - ¥${d.price}${d.unit}\n  ${d.canteen}\n`; });
    this.addBotMessage(msg + '\n💡 有什么口味偏好吗？', [
      { text: '清淡口味', action: () => this.filterByTaste('清淡') },
      { text: '辣味菜品', action: () => this.filterByTaste('辣') },
    ]);
  },
  filterByTaste(taste) {
    const menus = typeof MOCK_MENUS !== 'undefined' ? MOCK_MENUS : [];
    const filtered = taste === '辣' ? menus.filter(m => m.spicy >= 2).slice(0, 5) : menus.filter(m => m.spicy === 0).slice(0, 5);
    let msg = `🥗 ${taste}口味推荐：\n\n`;
    filtered.forEach(d => { msg += `• ${d.dish} - ¥${d.price}${d.unit}\n  ${d.canteen} · ${d.location}\n`; });
    this.addBotMessage(msg + '\n要不要我帮你找搭子一起去？', [{ text: '找搭子一起去', action: () => this.handleFindBuddy() }, { text: '查卡路里', action: () => this.handleCalorieQuery() }]);
  },
  // 优惠多轮对话历史
  _offersChatHistory: [],
  _inOffersChat: false,

  async handleOffers() {
    this._offersChatHistory = [];
    this._inOffersChat = true;
    this.addBotMessage('正在为你查询专属优惠，稍等～ 🎫');
    await this._sendOffersChat('帮我看看有哪些适合我的员工优惠', true);
  },

  async _sendOffersChat(userText, isInitial = false) {
    this._offersChatHistory.push({ role: 'user', content: userText });
    try {
      const res = await request('/api/agent/offers-chat', {
        method: 'POST',
        body: { messages: this._offersChatHistory, is_initial: isInitial },
      });
      if (res && res.reply) {
        this._offersChatHistory.push({ role: 'assistant', content: res.reply });
        // 保留最近10轮
        if (this._offersChatHistory.length > 20) {
          this._offersChatHistory = this._offersChatHistory.slice(-20);
        }
        this.addBotMessage(res.reply, [
          { text: '餐饮优惠', action: () => this._continueOffersChat('有哪些餐饮美食优惠？') },
          { text: '娱乐优惠', action: () => this._continueOffersChat('有哪些休闲娱乐优惠？') },
          { text: '酒店优惠', action: () => this._continueOffersChat('酒店住宿有什么优惠？') },
        ]);
      } else {
        this.addBotMessage('优惠信息加载失败，稍后再试 😅');
        this._inOffersChat = false;
      }
    } catch (e) {
      this.addBotMessage('优惠信息加载失败，稍后再试 😅');
      this._inOffersChat = false;
    }
  },

  async _continueOffersChat(text) {
    this.addUserMessage(text);
    this.showTyping();
    await this._sendOffersChat(text);
    this.hideTyping();
  },
  handleFindBuddy() {
    const buddies = this.mockBuddies.slice(0, 3);
    let msg = '👥 为你找到合适的搭子：\n\n';
    buddies.forEach((b, i) => { msg += `${i + 1}. ${b.name} · ${b.dept}\n   匹配度 ${b.matchRate}% · ${b.reason}\n\n`; });
    this.addBotMessage(msg + '💡 要我帮你发送邀请吗？', [
      { text: '发送邀请', action: () => this.addBotMessage('已为你发送邀请！等待对方确认中... ⏳') },
      { text: '换一批搭子', action: () => { const o = this.mockBuddies.slice(3, 5); let m2 = '🔄 换一批搭子：\n\n'; o.forEach((b, i) => { m2 += `${i + 1}. ${b.name} · ${b.dept}\n   匹配度 ${b.matchRate}% · ${b.reason}\n\n`; }); this.addBotMessage(m2); } }
    ]);
  },
  handleCalorieQuery() {
    const dishes = Object.entries(this.calorieDB).slice(0, 8);
    let msg = '📊 卡路里查询：\n\n热门菜品热量参考：\n';
    dishes.slice(0, 6).forEach(([name, info]) => { msg += `• ${name}：${info.cal} kcal\n`; });
    this.addBotMessage(msg + '\n💡 输入具体菜名可以查询详细营养信息！\n例如：红烧肉多少卡？', [
      { text: '红烧肉', action: () => this.queryCalorie('红烧肉') },
      { text: '鸡胸肉', action: () => this.queryCalorie('鸡胸肉') },
      { text: '米饭', action: () => this.queryCalorie('米饭') }
    ]);
  },
  queryCalorie(dishName) {
    const info = this.calorieDB[dishName];
    if (info) {
      this.addBotMessage(`🍖 ${dishName}（1份）\n\n热量：${info.cal} kcal\n蛋白质：${info.protein}g\n脂肪：${info.fat}g\n碳水：${info.carb}g\n\n💡 ${info.cal < 200 ? '低卡好选择！' : info.cal < 350 ? '适中的热量' : '建议搭配蔬菜食用'}`, [
        { text: '搭配建议', action: () => this.addBotMessage('🥗 推荐搭配：\n• 配一份清炒时蔬\n• 用粗粮代替部分主食\n• 饭后散步15分钟') },
        { text: '查看其他', action: () => this.handleCalorieQuery() }
      ]);
    } else {
      this.addBotMessage(`抱歉，暂时没有"${dishName}"的数据 😅\n你可以试试查询：红烧肉、鸡胸肉、米饭等`);
    }
  },
  handleFlowQuery() {
    const levelText = { low: '🟢 人少', medium: '🟡 适中', high: '🔴 拥挤' };
    const levelClass = { low: 'low', medium: 'medium', high: 'high' };
    let msg = '📊 实时食堂客流数据：\n\n';
    this.mockFlowData.forEach(f => { msg += `${f.location}：<span class="flow-indicator ${levelClass[f.level]}">${levelText[f.level]}</span>（${f.count}人）\n`; });
    const best = this.mockFlowData.reduce((a, b) => a.count < b.count ? a : b);
    this.addBotMessage(msg + '\n💡 建议：' + `现在去${best.location}最合适，人少不用排队！`, [{ text: '查看菜单', action: () => this.handleFoodRecommend() }, { text: '找搭子一起去', action: () => this.handleFindBuddy() }]);
  },
  handleHealthAdvice() {
    const hour = new Date().getHours();
    let msg = '💪 今日健康建议：\n\n';
    if (hour < 10) msg += '🌅 早上好！\n• 记得吃早餐\n• 今日步数目标：8000步\n• 建议多补充蛋白质';
    else if (hour < 14) msg += '☀️ 中午好！\n• 午餐建议：\n  - 一份蛋白质（鸡胸肉/鱼）\n  - 一份蔬菜\n  - 适量主食\n• 饭后散步15分钟';
    else if (hour < 18) msg += '🌤️ 下午好！\n• 下午茶时间\n• 建议选择水果或坚果\n• 记得多喝水';
    else msg += '🌙 晚上好！\n• 晚餐宜清淡\n• 避免太晚进食\n• 今日运动达标了吗？';
    this.addBotMessage(msg + '\n\n📊 今日推荐：鸡胸肉沙拉（250卡，高蛋白）', [
      { text: '查看低卡菜品', action: () => this.filterByTaste('清淡') },
      { text: '查看步数', action: () => this.addBotMessage('📱 今日步数：6,842 步\n距离目标还差 1,158 步\n加油！💪') }
    ]);
  },
  handleFeedback() {
    this.addBotMessage('💬 有什么想反馈的吗？\n\n你可以告诉我：\n• 食堂环境问题\n• 菜品建议\n• 功能需求\n• 其他吐槽', [
      { text: '食堂建议', action: () => { this.addUserMessage('食堂建议'); setTimeout(() => this.addBotMessage('📝 已记录你的反馈类型：食堂建议\n\n请具体描述一下你的建议，我会帮你转达给后勤部门。'), 500); } },
      { text: '功能需求', action: () => { this.addUserMessage('功能需求'); setTimeout(() => this.addBotMessage('📝 已记录你的反馈类型：功能需求\n\n请描述你希望增加的功能，产品团队会认真考虑！'), 500); } }
    ]);
  },
  handleChat() {
    this.addBotMessage(['😊 今天天气不错，适合和搭子一起吃个饭！', '🤖 我是Mi搭子的AI助手，专门帮你解决"吃什么"和"找谁吃"的问题！', '💡 你知道吗？每周三食堂全场8折哦～', '🎯 我可以帮你：找吃的、查优惠、找搭子、查卡路里，快来试试吧！', '🍚 午饭时间到了吗？要不要我给你推荐一下？'][Math.floor(Math.random() * 5)], [
      { text: '推荐菜品', action: () => this.handleFoodRecommend() },
      { text: '找搭子', action: () => this.handleFindBuddy() }
    ]);
  },
  addBotMessage(text, actions = []) {
    const el = document.getElementById('ai-chat-messages');
    const msg = document.createElement('div');
    msg.className = 'ai-message bot';
    let actionsHtml = '';
    if (actions.length) {
      actionsHtml = '<div class="action-btns">';
      actions.forEach(a => { actionsHtml += `<button class="action-btn" data-action-id="${Date.now()}_${Math.random()}">${a.text}</button>`; });
      actionsHtml += '</div>';
    }
    msg.innerHTML = `<div class="ai-message-avatar">🤖</div><div class="ai-message-content">${text.replace(/\n/g, '<br>')}${actionsHtml}</div>`;
    el.appendChild(msg);
    if (actions.length) { actions.forEach((a, i) => { const btn = msg.querySelectorAll('.action-btn')[i]; if (btn && a.action) btn.addEventListener('click', a.action); }); }
    if (this.currentUserMessage && !this.isAPIMode) { this.saveLocalContext(this.currentUserMessage, text); this.currentUserMessage = null; }
    this.scrollToBottom();
  },
  addUserMessage(text) {
    const el = document.getElementById('ai-chat-messages');
    const msg = document.createElement('div');
    msg.className = 'ai-message user';
    msg.innerHTML = `<div class="ai-message-avatar">😊</div><div class="ai-message-content">${text}</div>`;
    el.appendChild(msg);
    this.scrollToBottom();
  },
  showTyping() {
    const el = document.getElementById('ai-chat-messages');
    const t = document.createElement('div');
    t.className = 'ai-message bot';
    t.id = 'ai-typing';
    t.innerHTML = `<div class="ai-message-avatar">🤖</div><div class="ai-message-content"><div class="ai-typing-indicator"><span></span><span></span><span></span></div></div>`;
    el.appendChild(t);
    this.scrollToBottom();
  },
  hideTyping() { const t = document.getElementById('ai-typing'); if (t) t.remove(); },
  scrollToBottom() { const el = document.getElementById('ai-chat-messages'); el.scrollTop = el.scrollHeight; },
  saveAPISettings() {
    const model = document.getElementById('ai-model-select').value;
    this.apiConfig.model = model;
    localStorage.setItem('ai_model', model);
    document.getElementById('ai-settings-panel').classList.add('hidden');
  },
  loadSavedSettings() {
    const savedModel = localStorage.getItem('ai_model');
    if (savedModel) this.apiConfig.model = savedModel;
  }
};

// ============ 应用初始化 ============
document.addEventListener('DOMContentLoaded', function() {
  const avatarObserver = new MutationObserver(() => hydrateAvatarPhotos());
  avatarObserver.observe(document.getElementById('app'), { childList: true, subtree: true });

  // 注册路由
  Router.register('/login', LoginPage);
  Router.register('/home', HomePage);
  Router.register('/profile-init', ProfileInitPage);
  Router.register('/match-lunch', MatchLunchPage);
  Router.register('/match-commute', MatchCommutePage);
  Router.register('/invite', InvitePage);
  Router.register('/square', SquarePage);
  Router.register('/profile', ProfilePage);
  Router.register('/publish', PublishPage);
  Router.register('/daily', DailyPage);
  Router.register('/menu', MenuPage);
  Router.register('/notification', NotificationPage);
  Router.register('/about', AboutPage);

  // 注入 PC 侧边栏
  const sidebarHtml = `<aside class="pc-sidebar" id="pc-sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo" style="overflow:hidden;border-radius:8px"><img src="./assets/logo_mimeet.png" alt="Mi搭子" style="width:100%;height:100%;object-fit:cover;display:block"></div>
      <h2>Mi搭子</h2>
    </div>
    <nav class="sidebar-nav">
      <a href="#/home" class="sidebar-item" data-route="/home">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span class="sidebar-label">首页</span>
      </a>
      <a href="#/square" class="sidebar-item" data-route="/square">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        <span class="sidebar-label">广场</span>
      </a>
      <a href="#/profile" class="sidebar-item" data-route="/profile">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        <span class="sidebar-label">我的</span>
      </a>
      <a href="#/notification" class="sidebar-item" data-route="/notification">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        <span class="sidebar-label">消息</span>
        <span id="sidebar-msg-count" class="hidden ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0"></span>
      </a>
      <a href="#/about" class="sidebar-item" data-route="/about">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span class="sidebar-label">关于</span>
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-item" id="sidebar-collapse-btn" style="cursor:pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
        <span class="sidebar-label">收起</span>
      </div>
    </div>
  </aside>`;
  document.body.insertAdjacentHTML('afterbegin', sidebarHtml);

  // 侧边栏折叠/展开
  const sidebar = document.getElementById('pc-sidebar');
  const toggleSidebar = () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('mimeet_sidebar_collapsed', sidebar.classList.contains('collapsed') ? '1' : '0');
  };
  document.getElementById('sidebar-collapse-btn').addEventListener('click', toggleSidebar);
  if (localStorage.getItem('mimeet_sidebar_collapsed') === '1') sidebar.classList.add('collapsed');

  // 侧边栏消息未读数
  function updateSidebarMsgCount() {
    try {
      const ar = JSON.parse(localStorage.getItem('mimeet_ann_read') || '{}');
      const is = JSON.parse(localStorage.getItem('mimeet_invite_status') || '{}');
      const annIds = ['ann_001', 'ann_002', 'ann_003', 'ann_004'];
      const invIds = ['inv_001', 'inv_002', 'inv_003', 'inv_004', 'inv_005', 'inv_006'];
      let count = 0;
      annIds.forEach(id => { if (!ar[id]) count++; });
      invIds.forEach(id => { if ((is[id] || 'pending') === 'pending') count++; });
      const el = document.getElementById('sidebar-msg-count');
      if (el) {
        if (count > 0) { el.textContent = count > 99 ? '99+' : count; el.classList.remove('hidden'); }
        else { el.classList.add('hidden'); }
      }
      // 同步首页铃铛红点
      const homeDot = document.getElementById('msg-dot');
      if (homeDot) { if (count > 0) homeDot.classList.remove('hidden'); else homeDot.classList.add('hidden'); }
    } catch {}
  }
  updateSidebarMsgCount();
  setTimeout(updateSidebarMsgCount, 500);
  window.addEventListener('storage', updateSidebarMsgCount);
  window._updateSidebarMsgCount = updateSidebarMsgCount;

  // 侧边栏路由高亮
  function updateSidebarActive() {
    const hash = window.location.hash.slice(1) || '/home';
    const path = hash.split('?')[0];
    document.querySelectorAll('.sidebar-item[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === path);
    });
  }
  window.addEventListener('hashchange', updateSidebarActive);
  updateSidebarActive();

  // 初始化路由
  Router.init();

  // 初始化 AI 助手
  AIAssistant.init();

  // 网页端标识
  if (window.innerWidth >= 768) document.body.classList.add('is-desktop');
  window.addEventListener('resize', () => {
    document.body.classList.toggle('is-desktop', window.innerWidth >= 768);
  });
});
