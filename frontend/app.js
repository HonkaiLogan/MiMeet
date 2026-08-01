/**
 * Mi搭子 - 前端应用（完整版）
 *
 * 技术栈：HTML5 + Tailwind CSS + 原生 JavaScript（SPA单页应用）
 * 后端：Node.js + Express（对接中）
 */

// ============ 配置 ============
const BASE_URL = "http://localhost:5000";
const APP_CONFIG = { appName: "Mi搭子", version: "1.0.0", maxTasteCount: 3, maxInterestCount: 5 };

// 开发环境登录旁路:URL 加 ?devUser=u001 或 localStorage.devUser='u001' 即可用种子用户登录
// 不设或飞书真登录时,自动忽略
const DEV_USER_INFO = {
  u001: { userId: 'u001', nickname: '小米同学', department: '中国区-新零售部', joinDate: '2025-07-01' },
  u002: { userId: 'u002', nickname: '吴同学', department: '人力资源部', joinDate: '2025-07-01' },
  u003: { userId: 'u003', nickname: '李同学', department: '手机部-硬件工程部', joinDate: '2024-07-01' },
  u004: { userId: 'u004', nickname: '王同学', department: '手机部-新业务部', joinDate: '2026-04-01' },
  u005: { userId: 'u005', nickname: '黄同学', department: '中国区-电商部', joinDate: '2025-07-01' },
  u006: { userId: 'u006', nickname: '赵同学', department: '技术部', joinDate: '2025-04-01' },
  u007: { userId: 'u007', nickname: '周同学', department: '产品部', joinDate: '2025-07-01' },
  u008: { userId: 'u008', nickname: '张同学', department: '设计部', joinDate: '2026-01-01' },
};

function getDevUser() {
  const fromUrl = new URLSearchParams(location.search).get('devUser');
  if (fromUrl) {
    try {
      localStorage.setItem('devUser', fromUrl);
      // 顺便 seed 前端登录态,免得再点一次登录按钮
      if (DEV_USER_INFO[fromUrl]) localStorage.setItem('userInfo', JSON.stringify(DEV_USER_INFO[fromUrl]));
    } catch {}
    return fromUrl;
  }
  try { return localStorage.getItem('devUser') || ''; } catch { return ''; }
}

// 立即执行一次,确保后续 LoginPage/HomePage guard 能读到 userInfo
getDevUser();
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
// Mock 数据标记：后端未启动时自动使用
let useMockData = false;
let mockDataCheckDone = false;

// 检测后端是否可用(用无需登录的 /api/food/offers 探测,避免占用一次登录态)
async function checkBackend() {
  if (mockDataCheckDone) return;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${BASE_URL}/api/food/offers`, {
      method: 'GET',
      credentials: 'include',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    useMockData = !res.ok;
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
    const fetchOptions = {
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      ...options
    };
    if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }
    // 自动附加 dev 参数(仅本地开发用)
    const devUser = getDevUser();
    let finalPath = apiPath;
    if (devUser) {
      finalPath += (apiPath.includes('?') ? '&' : '?') + 'dev=' + encodeURIComponent(devUser);
    }
    const res = await fetch(`${BASE_URL}${finalPath}`, fetchOptions);
    
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
      return {
        recommendations: MOCK_MATCH_RECOMMENDATIONS[type] || []
      };
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
async function executeMatch(type, pref) { return await request('/api/match/execute', { method: 'POST', body: { scene: type, preference: pref } }); }
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
    
    const handler = this.routes[path];
    if (handler) {
      this.renderPage(handler, params);
    } else {
      this.navigateTo('/login');
    }
  },
  
  renderPage(handler, params) {
    const app = document.getElementById('app');
    
    // 页面切换动画
    app.style.opacity = '0';
    app.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      // 渲染页面内容
      app.innerHTML = handler.render(params);
      
      // 初始化页面事件
      if (handler.init) {
        handler.init(params);
      }
      
      // 执行头像替换
      if (typeof hydrateAvatarPhotos === 'function') {
        hydrateAvatarPhotos(app);
      }
      
      // 淡入动画
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

// ============ 登录页 ============
const LoginPage = {
  render() {
    return `<div class="login-page-bg min-h-screen flex items-center justify-center"><div class="login-decor login-decor-1"></div><div class="login-decor login-decor-2"></div><div class="login-decor login-decor-3"></div><div class="w-full max-w-sm px-6 relative z-10"><div class="text-center mb-12"><div class="login-logo-glow w-20 h-20 bg-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">${ICONS.logo('w-10 h-10 text-white')}</div><h1 class="text-2xl font-bold text-gray-900">Mi搭子</h1><p class="text-sm text-gray-500 mt-2">Meet 你的命中搭子</p></div><button id="login-btn" class="pressable w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-md"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><span>随机模拟登录</span></button><p class="text-center text-xs text-gray-400 mt-6">点击后自动分配一个模拟身份和工位</p><div class="text-center mt-16"><p class="text-xs text-gray-300">v${APP_CONFIG.version} · 小米人自己的轻社交平台</p></div></div></div>`;
  },
  async init() {
    // 已有本地登录态直接进首页
    if (getStorage('userInfo')) { Router.navigateTo('/home'); return; }
    // 探测后端 session
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, { credentials: 'include' });
      if (res.ok) {
        const d = await res.json();
        if (d.code === 200 && d.data) {
          setStorage('userInfo', {
            feishuId: d.data.feishuId,
            nickname: d.data.nickname,
            avatar: d.data.avatarUrl || '',
            department: d.data.department || '',
            seatNumber: d.data.seatNumber || '',
          });
          Router.navigateTo('/home');
          return;
        }
      }
    } catch {}

    document.getElementById('login-btn').addEventListener('click', async () => {
      const btn = document.getElementById('login-btn');
      setButtonLoading(btn, '登录中...');
      try {
        const res = await fetch(`${BASE_URL}/auth/mock`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const d = await res.json();
        if (d.code !== 200 || !d.data) {
          setButtonNormal(btn);
          showToast(d.msg || '登录失败');
          return;
        }
        setStorage('userInfo', {
          feishuId: d.data.feishuId,
          nickname: d.data.nickname,
          avatar: d.data.avatarUrl || '',
          department: d.data.department || '',
          seatNumber: d.data.seatNumber || '',
        });
        showToast(`欢迎 ${d.data.nickname}`);
        setTimeout(() => Router.navigateTo(getStorage('userProfile') ? '/home' : '/profile-init'), 500);
      } catch (e) {
        setButtonNormal(btn);
        showToast('网络异常,登录失败');
      }
    });
  }
};

// ============ 首页 ============
const HomePage = {
  render() {
    return `<div class="bg-gray-50 min-h-screen pb-20"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><h1 class="text-lg font-semibold text-gray-900">Mi搭子</h1><div class="flex items-center space-x-3"><button class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg></button><button id="avatar-btn" class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><span id="user-avatar-text" class="text-sm font-medium text-orange-600">小</span></button></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-4 space-y-4"><div class="shimmer-card bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-4 text-white shadow-md"><div class="flex items-center justify-between mb-2"><span class="text-sm opacity-90">🔮 今日推荐</span><button id="refresh-rec" class="text-sm opacity-90 hover:opacity-100">换一个</button></div><p id="rec-text" class="text-base mb-3 leading-relaxed">"今日适合主动出击！推荐你找一个同样喜欢川菜的饭搭子，中午一起去吃热乎乎的麻辣香锅。"</p><div class="flex items-center justify-between"><span id="fun-tag" class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs">🌶️ 今日宜吃辣</span><button id="view-rec" class="pressable text-sm font-medium hover:underline">去看看 →</button></div></div><div class="grid grid-cols-2 gap-3"><a href="#/match-lunch" class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">${ICONS.bowl('w-6 h-6 text-orange-500')}</div><h3 class="text-base font-semibold text-gray-900 mb-1">找饭搭子</h3><p class="text-xs text-gray-500">12:00 想找清淡饭搭子</p></a><a href="#/match-commute" class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">${ICONS.car('w-6 h-6 text-blue-500')}</div><h3 class="text-base font-semibold text-gray-900 mb-1">找拼车搭子</h3><p class="text-xs text-gray-500">8:30 回龙观到科技园</p></a></div><div class="grid grid-cols-2 gap-3"><a href="#/menu" class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3"><span class="text-2xl">🍱</span></div><h3 class="text-base font-semibold text-gray-900 mb-1">今日菜单</h3><p class="text-xs text-gray-500">三层食堂实时菜品</p></a><a href="#/daily" class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3"><span class="text-2xl">🔮</span></div><h3 class="text-base font-semibold text-gray-900 mb-1">玄学抽卡</h3><p class="text-xs text-gray-500">今日幸运菜系 · 星座运势</p></a></div><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900">📢 搭子广场</h3><a href="#/square" class="text-sm text-orange-500">查看全部</a></div><div id="square-preview" class="space-y-3"><div class="flex items-center justify-center py-4"><div class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div></div></div></main><nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"><div class="max-w-md mx-auto px-4 h-16 flex items-center justify-around"><a href="#/home" class="flex flex-col items-center space-y-1 tab-item active"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span class="text-xs font-medium">首页</span></a><a href="#/square" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg><span class="text-xs">广场</span></a><a href="#/profile" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span class="text-xs">我的</span></a></div></nav></div>`;
  },
  init() {
    if (!getStorage('userInfo')) { Router.navigateTo('/login'); return; }
    const u = getStorage('userInfo');
    if (u.nickname) document.getElementById('user-avatar-text').textContent = u.nickname.charAt(0);
    document.getElementById('refresh-rec').addEventListener('click', () => this.loadRecommendation());
    document.getElementById('view-rec').addEventListener('click', () => Router.navigateTo('/daily'));
    document.getElementById('avatar-btn').addEventListener('click', () => Router.navigateTo('/profile'));
    this.loadRecommendation();
    this.loadSquarePreview();
  },
  async loadRecommendation() {
    const rec = await getDailyRecommendation();
    if (rec) {
      const text = rec.recommendation || rec.text || '';
      const tag = rec.funTag || rec.tag || '';
      if (text) document.getElementById('rec-text').textContent = `"${text}"`;
      if (tag) document.getElementById('fun-tag').textContent = tag;
    }
  },
  async loadSquarePreview() {
    const result = await getPlazaList('all', 1, 2);
    const container = document.getElementById('square-preview');
    if (!container) return;
    const list = (result && result.list) || [];
    if (list.length === 0) {
      container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">暂无搭子需求</p>';
      return;
    }
    const summarize = (p) => {
      const c = p.content || {};
      if (p.type === 'lunch') return `${c.time || ''} 想找${(c.taste || []).join('/')}饭搭子`;
      if (p.type === 'commute') return `${c.departureTime || ''} ${c.homeArea || ''} 到科技园`;
      if (p.type === 'weekend') return `${c.activity || ''} ${c.description || ''}`;
      return '';
    };
    container.innerHTML = list.map(p => `<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div class="flex items-center space-x-3"><div class="w-8 h-8 ${p.type === 'lunch' ? 'bg-orange-100' : 'bg-blue-100'} rounded-full flex items-center justify-center"><span class="text-sm ${p.type === 'lunch' ? 'text-orange-600' : 'text-blue-600'}">${(p.nickname || '?').charAt(0)}</span></div><div><p class="text-sm font-medium text-gray-900">${p.nickname || '匿名'}</p><p class="text-xs text-gray-500">${summarize(p)}</p></div></div><span class="text-xs text-gray-400">${p.publishTime || ''}</span></div>`).join('');
  }
};

// ============ 画像填写页 ============
const ProfileInitPage = {
  state: { step: 1, time: '12:00', tastes: ['清淡', '米饭'], budget: '20-40', location: '都可以', social: '轻松聊天', interests: [] },
  render() {
    return `<div class="bg-gray-50 min-h-screen"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="skip-btn" class="text-sm text-gray-500">跳过</button><div class="flex items-center space-x-2"><div id="step-1" class="w-8 h-1 bg-orange-500 rounded-full"></div><div id="step-2" class="w-8 h-1 bg-gray-200 rounded-full"></div></div><div class="w-10"></div></div></nav><main id="page-1" class="max-w-md mx-auto px-4 pt-20 pb-24"><div class="mb-8"><h1 class="text-2xl font-bold text-gray-900">Hi，小米同学！</h1><p class="text-base text-gray-500 mt-2">30秒完成设置，找到你的命中搭子</p></div><div class="space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-3">用餐时间</label><div id="time-opts" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-3">口味偏好（最多选3个）</label><div id="taste-opts" class="flex flex-wrap gap-2"></div><p id="taste-err" class="field-error">请至少选择1个口味偏好</p></div><div><label class="block text-sm font-medium text-gray-700 mb-3">预算范围</label><div id="budget-opts" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-3">用餐地点</label><div id="location-opts" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-3">社交偏好</label><div id="social-opts" class="flex flex-wrap gap-2"></div></div></div></main><main id="page-2" class="max-w-md mx-auto px-4 pt-20 pb-24 hidden"><div class="mb-8"><h1 class="text-2xl font-bold text-gray-900">你对什么感兴趣？</h1><p class="text-base text-gray-500 mt-2">选几个标签，帮你找到同频搭子</p></div><div><label class="block text-sm font-medium text-gray-700 mb-3">兴趣标签（最多选5个）</label><div id="interest-opts" class="flex flex-wrap gap-2"></div><p id="interest-err" class="field-error">请至少选择1个兴趣标签</p></div></main><div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50"><button id="next-btn" class="w-full h-12 bg-orange-500 text-white font-medium rounded-lg">下一步</button></div></div>`;
  },
  init() {
    // 草稿回填：如果之前填写到一半时刷新/离开，重新进来自动恢复
    const draft = getStorage('profileDraft');
    if (draft) this.state = Object.assign({}, this.state, draft, { step: 1 });
    this.renderOpts();
    document.getElementById('skip-btn').addEventListener('click', () => Router.navigateTo('/home'));
    document.getElementById('next-btn').addEventListener('click', async () => {
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
        const btn = document.getElementById('next-btn');
        setButtonLoading(btn, '保存中...');
        const payload = {
          lunchPreference: { time: this.state.time, taste: this.state.tastes, budget: this.state.budget, location: this.state.location, socialMode: this.state.social },
          interestTags: this.state.interests,
        };
        // 本地也留一份,方便页面刷新前快速渲染
        setStorage('userProfile', payload);
        const r = await saveUserProfile(payload);
        setButtonNormal(btn);
        // 无后端时(mock)也算成功
        removeStorage('profileDraft');
        showToast('保存成功');
        setTimeout(() => Router.navigateTo('/home'), 500);
      }
    });
  },
  saveDraft() {
    setStorage('profileDraft', { time: this.state.time, tastes: this.state.tastes, budget: this.state.budget, location: this.state.location, social: this.state.social, interests: this.state.interests });
  },
  renderOpts() {
    document.getElementById('time-opts').innerHTML = TIME_OPTIONS.map(o => `<button data-v="${o.value}" class="otime px-4 py-2 rounded-full text-sm ${o.value === this.state.time ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('taste-opts').innerHTML = TASTE_OPTIONS.map(o => `<button data-v="${o.value}" class="otaste px-4 py-2 rounded-full text-sm ${this.state.tastes.includes(o.value) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.getElementById('budget-opts').innerHTML = BUDGET_OPTIONS.map(o => `<button data-v="${o.value}" class="obudget px-4 py-2 rounded-full text-sm ${o.value === this.state.budget ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('location-opts').innerHTML = LOCATION_OPTIONS.map(o => `<button data-v="${o.value}" class="olocation px-4 py-2 rounded-full text-sm ${o.value === this.state.location ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.label}</button>`).join('');
    document.getElementById('social-opts').innerHTML = SOCIAL_OPTIONS.map(o => `<button data-v="${o.value}" class="osocial px-4 py-2 rounded-full text-sm ${o.value === this.state.social ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.getElementById('interest-opts').innerHTML = INTEREST_OPTIONS.map(o => `<button data-v="${o.value}" class="ointerest px-4 py-2 rounded-full text-sm ${this.state.interests.includes(o.value) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.icon} ${o.label}</button>`).join('');
    document.querySelectorAll('.otime').forEach(b => b.addEventListener('click', (e) => { this.state.time = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
    document.querySelectorAll('.otaste').forEach(b => b.addEventListener('click', (e) => { const v = e.target.dataset.v; const i = this.state.tastes.indexOf(v); i > -1 ? this.state.tastes.splice(i, 1) : this.state.tastes.length < 3 ? this.state.tastes.push(v) : showToast('最多3个'); this.renderOpts(); this.saveDraft(); }));
    document.querySelectorAll('.obudget').forEach(b => b.addEventListener('click', (e) => { this.state.budget = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
    document.querySelectorAll('.olocation').forEach(b => b.addEventListener('click', (e) => { this.state.location = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
    document.querySelectorAll('.osocial').forEach(b => b.addEventListener('click', (e) => { this.state.social = e.target.dataset.v; this.renderOpts(); this.saveDraft(); }));
    document.querySelectorAll('.ointerest').forEach(b => b.addEventListener('click', (e) => { const v = e.target.dataset.v; const i = this.state.interests.indexOf(v); i > -1 ? this.state.interests.splice(i, 1) : this.state.interests.length < 5 ? this.state.interests.push(v) : showToast('最多5个'); this.renderOpts(); this.saveDraft(); }));
  }
};

// ============ 午餐匹配页 ============
const MatchLunchPage = {
  render() {
    return `<div class="bg-gray-50 min-h-screen"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">找饭搭子</h1><div class="w-10"></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-24"><div class="bg-white rounded-xl shadow-sm p-4 mb-4"><div class="flex items-center justify-between mb-2"><span class="text-sm text-gray-500">当前需求</span><button id="edit-pref" class="text-sm text-orange-500">修改</button></div><div class="flex flex-wrap gap-2"><span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">12:00</span><span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">清淡</span><span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">20-40元</span></div></div><div class="mb-4"><h2 class="text-base font-semibold text-gray-900 mb-3">为你推荐 3 位搭子</h2><div id="match-results" class="space-y-3"><div id="loading">${skeletonCards(2)}</div><div id="results" class="space-y-3 hidden"></div></div></div><button id="change-btn" class="pressable w-full h-12 bg-white border border-orange-500 text-orange-500 font-medium rounded-lg mb-3">换一批搭子</button><button id="publish-btn" class="pressable w-full h-12 bg-white border border-gray-300 text-gray-600 font-medium rounded-lg">发布到搭子广场</button></main></div>`;
  },
  init(params = {}) {
    this.forceEmpty = params && params.empty === '1';
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.getElementById('edit-pref').addEventListener('click', () => Router.navigateTo('/profile-init'));
    document.getElementById('change-btn').addEventListener('click', () => { document.getElementById('loading').classList.remove('hidden'); document.getElementById('loading').innerHTML = skeletonCards(2); document.getElementById('results').classList.add('hidden'); this.loadResults(); });
    document.getElementById('publish-btn').addEventListener('click', () => Router.navigateTo('/publish', { type: 'lunch' }));
    this.updatePrefDisplay();
    this.loadResults();
  },
  updatePrefDisplay() {
    const profile = getStorage('userProfile') || {};
    const pref = profile.lunchPreference || {};
    const tags = document.querySelector('#match-results')?.previousElementSibling?.previousElementSibling?.querySelector('.flex.flex-wrap.gap-2');
    if (tags) {
      tags.innerHTML = `<span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">${pref.time || '12:00'}</span><span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">${(pref.taste || ['清淡']).join('·')}</span><span class="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">${pref.budget || '20-40'}元</span>`;
    }
  },
  async loadResults() {
    try {
      // 获取用户偏好
      const profile = getStorage('userProfile') || {};
      const preference = profile.lunchPreference || { time: '12:00', taste: ['清淡'], budget: '20-40' };
      
      // 调用匹配接口
      const result = await executeMatch('lunch', preference);
      
      document.getElementById('loading').classList.add('hidden');
      const c = document.getElementById('results');
      c.classList.remove('hidden');
      
      const mock = (result && result.recommendations) ? result.recommendations : [];
      
      if (this.forceEmpty || mock.length === 0) {
        c.innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">🍽️</div><p class="empty-text mb-1">暂时没有匹配到合适的饭搭子</p><p class="empty-text mb-4 text-xs">可能是候选人较少，试试发布到广场主动招募</p><button id="empty-to-square" class="pressable btn btn-primary btn-sm">去搭子广场看看</button></div>`;
        document.getElementById('empty-to-square').addEventListener('click', () => Router.navigateTo('/square'));
        return;
      }
      const userBudget = preference.budget || '20-40';
      c.innerHTML = mock.map(i => {
        const dishes = (i.recommendedDishes || []).map(id => MOCK_MENUS.find(m => m.id === id)).filter(Boolean);
        const budgetPct = i.budgetRange ? calcBudgetOverlap(userBudget, i.budgetRange) : 0;
        const offer = i.todayOffer ? MOCK_OFFERS.find(o => o.id === i.todayOffer) : null;
        return `<div class="bg-white rounded-xl shadow-sm p-4 card-appear"><div class="flex items-center justify-between mb-3"><div class="flex items-center space-x-3"><div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><span class="text-lg font-medium text-orange-600">${(i.name || '?').charAt(0)}</span></div><div><h3 class="text-base font-semibold text-gray-900">${i.name || '搭子'}</h3><p class="text-sm text-gray-500">${i.dept || '小米同学'}</p></div></div><div class="score-ring" style="--score:${i.score || 0}"><span class="score-num">${i.score || 0}%</span></div></div><div class="flex flex-wrap gap-2 mb-3">${(i.tags || []).map(t => `<span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">✓ ${t}</span>`).join('')}</div><p class="text-sm text-gray-600 mb-3">${i.reason || '你们很匹配'}</p>${i.restaurant ? `<div class="p-3 bg-orange-50 rounded-lg mb-3 flex items-center justify-between"><div class="flex items-center gap-2"><span class="text-sm">🍽️</span><span class="text-sm text-gray-700">${i.restaurant.name}</span></div><span class="text-xs text-gray-500">${i.restaurant.distance} · ${i.restaurant.avgPrice}</span></div>` : ''}${dishes.length > 0 ? `<div class="mb-3"><p class="text-xs text-gray-500 mb-1.5">推荐菜品</p><div class="space-y-1">${dishes.slice(0, 3).map(d => `<div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"><div class="flex items-center gap-2"><span class="text-sm">${d.dish}</span><span class="spicy-indicator">${spicyIcons(d.spicy)}</span></div><div class="flex items-center gap-2">${starRating(d.rating)}<span class="text-xs font-medium text-orange-500">${d.price}元</span></div></div>`).join('')}</div></div>` : ''}${i.budgetRange ? `<div class="mb-3 p-2.5 bg-gray-50 rounded-lg"><div class="flex items-center justify-between text-xs text-gray-500 mb-1"><span>预算兼容度 ${budgetPct}%</span><span>你: ${userBudget}元 · TA: ${i.budgetRange}元</span></div><div class="budget-bar"><div class="budget-bar-fill" style="width:${budgetPct}%"></div></div></div>` : ''}${offer ? `<div class="mb-3 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center justify-between"><div><p class="text-xs font-medium text-yellow-800">🏷️ ${offer.title}</p><p class="text-xs text-yellow-600">${offer.desc}</p></div><span class="offer-countdown">⏰ ${getDaysRemaining(offer.expireDate)}天</span></div>` : ''}<div class="flex space-x-3"><button data-uid="${i.uid || i.userId}" data-match-id="${i.matchId || ''}" class="invite-btn pressable flex-1 h-10 bg-orange-500 text-white text-sm font-medium rounded-lg">邀请搭子</button><button data-uid="${i.uid || i.userId}" data-match-id="${i.matchId || ''}" class="detail-btn pressable flex-1 h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">查看详情</button></div></div>`;
      }).join('');
      c.querySelectorAll('.invite-btn,.detail-btn').forEach(b => b.addEventListener('click', (e) => {
        const el = e.currentTarget;
        Router.navigateTo('/invite', { userId: el.dataset.uid, matchId: el.dataset.matchId || '', scene: 'lunch' });
      }));
    } catch (error) {
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('results').classList.remove('hidden');
      document.getElementById('results').innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">⚠️</div><p class="empty-text mb-1">加载失败</p><p class="empty-text mb-4 text-xs">${error.message || '请检查网络后重试'}</p><button id="retry-match" class="pressable btn btn-primary btn-sm">点击重试</button></div>`;
      document.getElementById('retry-match')?.addEventListener('click', () => this.loadResults());
    }
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
    try {
      // 获取用户偏好
      const profile = getStorage('userProfile') || {};
      const preference = profile.commutePreference || { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' };
      
      // 调用匹配接口
      const result = await executeMatch('commute', preference);
      
      document.getElementById('loading').classList.add('hidden');
      const c = document.getElementById('results');
      c.classList.remove('hidden');
      
      const mock = (result && result.recommendations) ? result.recommendations : [];
      
      if (this.forceEmpty || mock.length === 0) {
        c.innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">🚗</div><p class="empty-text mb-1">附近暂时没有同路线的拼车搭子</p><p class="empty-text mb-4 text-xs">可以先发布到广场，等待其他人响应</p><button id="empty-to-square" class="pressable btn btn-secondary btn-sm">去搭子广场看看</button></div>`;
        document.getElementById('empty-to-square').addEventListener('click', () => Router.navigateTo('/square'));
        return;
      }
      c.innerHTML = mock.map(i => {
        const r = i.route || {};
        const waypoints = (r.waypoints || []);
        const routeHtml = `<div class="route-visual mb-3"><div class="route-node"><div class="route-dot start"></div><span class="route-label">${r.from || preference.homeArea}</span></div>${waypoints.map(wp => `<div class="route-line"></div><div class="route-node"><div class="route-dot"></div><span class="route-label">${wp}</span></div>`).join('')}<div class="route-line"></div><div class="route-node"><div class="route-dot end"></div><span class="route-label">${r.to || '科技园'}</span></div></div>`;
        return `<div class="bg-white rounded-xl shadow-sm p-4 card-appear"><div class="flex items-center justify-between mb-3"><div class="flex items-center space-x-3"><div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><span class="text-lg font-medium text-blue-600">${(i.name || '?').charAt(0)}</span></div><div><h3 class="text-base font-semibold text-gray-900">${i.name || '搭子'}</h3><p class="text-sm text-gray-500">${i.time || '-'} 出发</p></div></div><div class="score-ring score-ring-blue" style="--score:${i.score || 0}"><span class="score-num">${i.score || 0}%</span></div></div>${routeHtml}<div class="flex items-center gap-3 mb-3 text-xs text-gray-500"><span>📍 ${r.distance || '12km'}</span><span>⏱️ ${r.duration || '35分钟'}</span><span class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">${r.transportMode || '打车'}</span></div><div class="savings-grid mb-3"><div class="savings-item"><p class="savings-value">${i.saving || '15元'}</p><p class="savings-label">每日节省</p></div><div class="savings-item"><p class="savings-value">${i.weeklySaving || '75元'}</p><p class="savings-label">每周节省</p></div><div class="savings-item"><p class="savings-value">${i.monthlySaving || '330元'}</p><p class="savings-label">每月节省</p></div></div><div class="flex items-center gap-3 mb-3 p-2 bg-green-50 rounded-lg text-xs"><span class="text-green-700">🌱 减碳 ${i.co2Saved || '2kg/周'}</span><span class="text-gray-300">|</span><span class="text-blue-600">时间匹配 ${i.timeScore || 90}%</span><span class="text-gray-300">|</span><span class="text-blue-600">路线匹配 ${i.routeScore || 85}%</span></div><p class="text-sm text-gray-600 mb-3">${i.reason || '你们很匹配'}</p><div class="flex space-x-3"><button data-uid="${i.uid || i.userId}" data-match-id="${i.matchId || ''}" class="invite-btn pressable flex-1 h-10 bg-blue-500 text-white text-sm font-medium rounded-lg">邀请拼车</button><button data-uid="${i.uid || i.userId}" data-match-id="${i.matchId || ''}" class="detail-btn pressable flex-1 h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">查看详情</button></div></div>`;
      }).join('');
      c.querySelectorAll('.invite-btn,.detail-btn').forEach(b => b.addEventListener('click', (e) => {
        const el = e.currentTarget;
        Router.navigateTo('/invite', { userId: el.dataset.uid, matchId: el.dataset.matchId || '', scene: 'commute' });
      }));
    } catch (error) {
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('results').classList.remove('hidden');
      document.getElementById('results').innerHTML = `<div class="empty-state bg-white rounded-xl"><div class="empty-icon">⚠️</div><p class="empty-text mb-1">加载失败</p><p class="empty-text mb-4 text-xs">${error.message || '请检查网络后重试'}</p><button id="retry-match" class="pressable btn btn-secondary btn-sm">点击重试</button></div>`;
      document.getElementById('retry-match')?.addEventListener('click', () => this.loadResults());
    }
  }
};

// ============ 邀请详情页 ============
const InvitePage = {
  getTargetUser(params) {
    const uid = params && params.userId;
    const allUsers = { ...MOCK_USERS };
    const allProfiles = { ...MOCK_PROFILES };
    const allRecs = [...(MOCK_MATCH_RECOMMENDATIONS.lunch || []), ...(MOCK_MATCH_RECOMMENDATIONS.commute || [])];
    const rec = allRecs.find(r => r.uid === uid);
    const user = Object.values(allUsers).find(u => u.userId === uid);
    return {
      name: rec?.name || user?.nickname || '搭子',
      dept: rec?.dept || user?.department || '小米同学',
      score: rec?.score || 85,
      tags: rec?.tags || [],
      reason: rec?.reason || '你们很匹配',
      interests: allProfiles[uid]?.interestTags || ['AI', '产品']
    };
  },
  render(params) {
    const t = this.getTargetUser(params);
    return `<div class="bg-gray-50 min-h-screen"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">邀请搭子</h1><div class="w-10"></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-24 space-y-4"><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center space-x-4"><div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center"><span class="text-2xl font-medium text-orange-600">${t.name.charAt(0)}</span></div><div class="flex-1"><h2 class="text-xl font-semibold text-gray-900">${t.name}</h2><p class="text-sm text-gray-500 mt-1">${t.dept}</p><p class="text-sm text-gray-500 mt-1">兴趣：${t.interests.join('、')}</p></div><div class="score-ring" style="--score:${t.score}"><span class="score-num">${t.score}%</span></div></div></div><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900 flex items-center gap-1.5">${ICONS.robot('w-5 h-5 text-orange-500')}<span>AI帮你写好了邀请话术</span></h3><button id="refresh-invite" class="text-sm text-orange-500">换一个</button></div><div id="invite-msg" class="ai-border bg-orange-50 rounded-lg p-4 mb-3"><p class="text-sm text-gray-700 leading-relaxed">"我今天12:30准备去食堂吃饭，看到我们都喜欢清淡口味，也都对${t.interests[0] || 'AI'}挺感兴趣，要不要一起拼个饭？"</p></div><button id="copy-invite" class="w-full h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg flex items-center justify-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg><span>复制话术</span></button></div><div class="bg-white rounded-xl shadow-sm p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-base font-semibold text-gray-900 flex items-center gap-1.5">${ICONS.chat('w-5 h-5 text-orange-500')}<span>破冰话题</span></h3><button id="refresh-ice" class="text-sm text-orange-500">换一批</button></div><div id="ice-topics" class="space-y-3"><div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">1</span><p class="text-sm text-gray-700">你最近有没有用到比较好用的${t.interests[0] || 'AI'}工具？</p></div><div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">2</span><p class="text-sm text-gray-700">你觉得园区附近哪家店最不踩雷？</p></div><div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">3</span><p class="text-sm text-gray-700">入职以来你印象最深的一件事是什么？</p></div></div><button id="copy-ice" class="w-full h-10 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg flex items-center justify-center space-x-2 mt-3"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg><span>复制话题</span></button></div><button id="send-invite" class="w-full h-12 bg-orange-500 text-white font-medium rounded-lg shadow-md">发送邀请给${t.name}</button></main></div>`;
  },
  init(params) {
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.getElementById('copy-invite').addEventListener('click', () => { navigator.clipboard.writeText(document.getElementById('invite-msg').textContent); showToast('已复制到剪贴板'); });
    document.getElementById('copy-ice').addEventListener('click', () => {
      const topics = document.querySelectorAll('#ice-topics p');
      const text = Array.from(topics).map((p, i) => `${i + 1}. ${p.textContent}`).join('\n');
      navigator.clipboard.writeText(text); showToast('已复制到剪贴板');
    });
    document.getElementById('send-invite').addEventListener('click', async () => {
      const btn = document.getElementById('send-invite');
      if (btn.disabled) return;
      setButtonLoading(btn, '发送中...');
      const uid = params && params.userId;
      const matchId = params && params.matchId;
      const scene = (params && params.scene) || 'lunch';
      const inviteMessage = document.getElementById('invite-msg')?.textContent?.trim() || '';
      try {
        const r = await request('/api/match/invite', {
          method: 'POST',
          body: { targetUserId: uid, matchId, scene, inviteMessage },
        });
        if (r !== null) {
          showToast('邀请已发送，对方将收到飞书消息');
          setTimeout(() => Router.navigateTo('/home'), 1500);
        } else {
          setButtonNormal(btn);
        }
      } catch (e) {
        setButtonNormal(btn);
        showToast('发送失败，请重试');
      }
    });
  }
};

// ============ 搭子广场页 ============
const SquarePage = {
  state: { filter: 'all', keyword: '', sort: 'newest', page: 1, pageSize: 6, hasMore: true, advFilters: { time: null, budget: null, area: null, social: null } },
  render() {
    return `<div class="bg-gray-50 min-h-screen pb-20"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">搭子广场</h1><button id="pub-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg></button></div></nav><div class="fixed top-14 left-0 right-0 bg-white border-b border-gray-200 z-40"><div class="max-w-md mx-auto px-4 flex"><button data-t="all" class="ftab flex-1 py-3 text-sm font-medium text-orange-500 border-b-2 border-orange-500">全部</button><button data-t="lunch" class="ftab flex-1 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent flex items-center justify-center gap-1">${ICONS.bowl('w-4 h-4')}<span>午餐</span></button><button data-t="commute" class="ftab flex-1 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent flex items-center justify-center gap-1">${ICONS.car('w-4 h-4')}<span>通勤</span></button><button data-t="weekend" class="ftab flex-1 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent flex items-center justify-center gap-1">${ICONS.target('w-4 h-4')}<span>周末</span></button></div></div><main id="square-main" class="max-w-md mx-auto px-4 pt-28 pb-4"><div class="mb-3 space-y-2"><div class="search-bar"><svg class="search-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><input id="square-search" type="text" placeholder="搜索内容、用户名..." /></div><div class="flex items-center justify-between"><button id="filter-btn" class="pressable flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg><span>筛选</span><span id="filter-count" class="hidden ml-1 w-4 h-4 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center">0</span></button><div class="sort-dropdown"><button id="sort-btn" class="pressable flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600"><span id="sort-label">最新发布</span><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></button><div id="sort-menu" class="sort-menu"><div class="sort-menu-item active" data-sort="newest">最新发布</div><div class="sort-menu-item" data-sort="responded">响应最多</div><div class="sort-menu-item" data-sort="match">最佳匹配</div></div></div></div></div><div id="square-list" class="space-y-3">${skeletonCards(3)}</div><button id="load-more" class="load-more-btn mt-4 hidden">加载更多</button></main><div id="filter-backdrop" class="filter-backdrop"></div><div id="filter-drawer" class="filter-drawer"><div class="flex items-center justify-between mb-4"><h3 class="text-base font-semibold">筛选条件</h3><button id="filter-reset" class="text-sm text-orange-500">重置</button></div><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">时间范围</label><div id="fd-time" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">预算范围</label><div id="fd-budget" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">区域</label><div id="fd-area" class="flex flex-wrap gap-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">社交偏好</label><div id="fd-social" class="flex flex-wrap gap-2"></div></div></div><button id="filter-apply" class="w-full h-12 bg-orange-500 text-white font-medium rounded-lg mt-6">应用筛选</button></div><nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"><div class="max-w-md mx-auto px-4 h-16 flex items-center justify-around"><a href="#/home" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span class="text-xs">首页</span></a><a href="#/square" class="flex flex-col items-center space-y-1 tab-item active"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg><span class="text-xs font-medium">广场</span></a><a href="#/profile" class="flex flex-col items-center space-y-1 tab-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span class="text-xs">我的</span></a></div></nav></div>`;
  },
  init() {
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
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
    document.getElementById('filter-backdrop').addEventListener('click', () => this.closeDrawer());
    document.getElementById('filter-reset').addEventListener('click', () => { this.state.advFilters = { time: null, budget: null, area: null, social: null }; this.renderDrawerOpts(); });
    document.getElementById('filter-apply').addEventListener('click', () => { this.closeDrawer(); this.state.page = 1; this.updateFilterCount(); this.loadPosts(); });
    document.getElementById('load-more').addEventListener('click', () => { this.state.page++; this.loadPosts(true); });
    initPullToRefresh(document.getElementById('square-main'), document.getElementById('square-list'), () => { this.state.page = 1; showToast('已刷新'); this.loadPosts(); });
    this.loadPosts();
  },
  openDrawer() {
    this.renderDrawerOpts();
    document.getElementById('filter-drawer').classList.add('open');
    document.getElementById('filter-backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  closeDrawer() {
    document.getElementById('filter-drawer').classList.remove('open');
    document.getElementById('filter-backdrop').classList.remove('open');
    document.body.style.overflow = '';
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
      posts = result.list.map(p => ({ id: p.id, name: p.nickname || '匿名', type: p.type || p.scene || 'lunch', time: p.publishTime || '刚刚', respondCount: p.respondCount || 0, content: p.content, contentText: typeof p.content === 'object' ? this.formatContent(p.content, p.type || p.scene) : (p.content || '') }));
    } else {
      posts = MOCK_SQUARE_POSTS.map(p => ({ id: p.id, name: p.nickname, type: p.type, time: p.publishTime, respondCount: p.respondCount || 0, content: p.content, contentText: this.formatContent(p.content, p.type) }));
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
    listEl.innerHTML = visible.map(p => { const c = TYPE_META[p.type] || TYPE_META.lunch; return `<div class="bg-white rounded-xl shadow-sm p-4 card-appear"><div class="flex items-center justify-between mb-3"><div class="flex items-center space-x-3"><div class="w-10 h-10 ${c.bg} rounded-full flex items-center justify-center"><span class="text-sm ${c.text}">${p.name.charAt(0)}</span></div><div><h3 class="text-sm font-semibold text-gray-900">${p.name}</h3><p class="text-xs text-gray-500">${p.time} · ${p.respondCount > 0 ? `已有${p.respondCount}人响应` : '等待响应'}</p></div></div><span class="px-2 py-1 rounded-full text-xs ${c.bg} ${c.text} flex items-center gap-1">${c.icon('w-3.5 h-3.5')}<span>${c.label}</span></span></div><p class="text-sm text-gray-700 mb-3">${p.contentText}</p><button data-id="${p.id}" class="respond-btn pressable w-full h-9 ${c.btn} text-white text-sm font-medium rounded-lg">我要加入</button></div>`; }).join('');
    document.querySelectorAll('.respond-btn').forEach(b => b.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      if (btn.disabled) return;
      btn.disabled = true;
      const oldText = btn.textContent;
      btn.textContent = '响应中...';
      btn.classList.add('opacity-60');
      const r = await respondToPlaza(btn.dataset.id);
      if (r !== null) {
        btn.textContent = '已响应，等待确认';
        showToast('响应成功，等待对方确认');
      } else {
        btn.textContent = oldText;
        btn.disabled = false;
        btn.classList.remove('opacity-60');
      }
    }));
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
    return `<div class="bg-gray-50 min-h-screen pb-20">
      <nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button id="back-btn" class="w-10 h-10 flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">个人中心</h1>
          <button id="edit-btn" class="text-sm text-orange-500 font-medium">编辑</button>
        </div>
      </nav>
      <main class="max-w-md mx-auto px-4 pt-18 pb-4 space-y-4">
        <div class="bg-white rounded-xl shadow-sm p-6 text-center">
          <div id="user-avatar" class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl font-medium text-orange-600">小</span>
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
    if (!u.department && !u.seatNumber) {
      // 老数据的兜底,新的模拟登录会正确带上 seatNumber
      u.department = '中国区-新零售部';
      setStorage('userInfo', u);
    }
    if (u.nickname) document.getElementById('user-avatar').textContent = u.nickname.charAt(0);
    document.getElementById('user-name').textContent = u.nickname || '小米同学';
    // 优先显示工位号(模拟登录场景),否则显示部门
    const subline = u.seatNumber || u.department || '中国区-新零售部';
    document.getElementById('user-dept').textContent = subline;
    const profile = MOCK_PROFILES['u001'];
    const tagEl = document.getElementById('personality-tags');
    if (profile && tagEl) {
      let badges = '';
      if (profile.mbti) badges += `<span class="personality-badge mbti">🧠 ${profile.mbti}</span>`;
      if (profile.constellation) badges += `<span class="personality-badge constellation">⭐ ${profile.constellation}</span>`;
      tagEl.innerHTML = badges;
    }
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.getElementById('edit-btn').addEventListener('click', () => showToast('编辑功能开发中'));
    document.getElementById('logout-btn').addEventListener('click', async () => {
      removeStorage('userInfo');
      removeStorage('userProfile');
      removeStorage('devUser');
      try {
        await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      } catch {}
      Router.navigateTo('/login');
    });
    this.loadStats();
    this.loadMyNeeds();
    this.loadMyBuddies();
  },
  async loadStats() {
    try {
      const history = await getMatchHistory(1, 100);
      if (history) {
        const matches = history.total || 0;
        const success = history.list ? history.list.filter(r => r.status === 'accepted').length : 0;
        const friends = new Set(history.list ? history.list.filter(r => r.status === 'accepted').map(r => r.matchedUserId) : []).size;
        document.getElementById('stat-matches').textContent = matches;
        document.getElementById('stat-success').textContent = success;
        document.getElementById('stat-friends').textContent = friends;
      } else {
        document.getElementById('stat-matches').textContent = '0';
        document.getElementById('stat-success').textContent = '0';
        document.getElementById('stat-friends').textContent = '0';
      }
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
      if (history && history.list && history.list.length > 0) {
        const buddies = history.list.filter(r => r.status === 'accepted').slice(0, 5);
        if (buddies.length === 0) {
          container.innerHTML = `<div class="p-3 bg-gray-50 rounded-lg text-center"><p class="text-sm text-gray-500">还没有搭子，去匹配看看</p></div>`;
        } else {
          container.innerHTML = buddies.map(b => {
            const typeLabel = b.type === 'lunch' ? '午餐搭子' : '拼车搭子';
            const avatarBg = b.type === 'lunch' ? 'bg-orange-100' : 'bg-blue-100';
            const avatarText = b.type === 'lunch' ? 'text-orange-600' : 'text-blue-600';
            return `<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center"><span class="text-sm ${avatarText}">${(b.nickname || '?').charAt(0)}</span></div>
                <div><p class="text-sm font-medium text-gray-900">${b.nickname || '搭子'} · ${typeLabel}</p><p class="text-xs text-gray-500">匹配度：${b.matchScore || '-'}%</p></div>
              </div>
              <button class="view-buddy-btn text-sm text-orange-500 font-medium" data-name="${b.nickname || '搭子'}" data-id="${b.id}">查看</button>
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
    return `<div class="bg-gray-50 min-h-screen"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">发布需求</h1><div class="w-10"></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-24"><div class="bg-white rounded-xl shadow-sm p-4 mb-4"><label class="block text-sm font-medium text-gray-700 mb-3">发布类型</label><div class="grid grid-cols-3 gap-3"><button data-t="lunch" class="tbtn p-3 rounded-lg border-2 border-orange-500 bg-orange-50 text-center">${ICONS.bowl('w-7 h-7 text-orange-500 mx-auto')}<p class="text-sm font-medium text-orange-600 mt-1">午餐</p></button><button data-t="commute" class="tbtn p-3 rounded-lg border-2 border-gray-200 bg-white text-center">${ICONS.car('w-7 h-7 text-gray-400 mx-auto')}<p class="text-sm font-medium text-gray-600 mt-1">通勤</p></button><button data-t="weekend" class="tbtn p-3 rounded-lg border-2 border-gray-200 bg-white text-center">${ICONS.target('w-7 h-7 text-gray-400 mx-auto')}<p class="text-sm font-medium text-gray-600 mt-1">周末</p></button></div></div><div id="form-lunch" class="space-y-4"><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">用餐时间</label><div id="ftime" class="flex flex-wrap gap-2"></div></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">口味偏好</label><div id="ftaste" class="flex flex-wrap gap-2"></div><p id="ftaste-err" class="field-error">请至少选择1个口味偏好</p></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">预算范围</label><div id="fbudget" class="flex flex-wrap gap-2"></div></div></div><div id="form-commute" class="space-y-4 hidden"><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">居住区域</label><div id="farea" class="flex flex-wrap gap-2"></div><p id="farea-err" class="field-error">请选择居住区域</p></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">出发时间</label><div id="fctime" class="flex flex-wrap gap-2"></div></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">交通方式</label><div id="ftransport" class="flex flex-wrap gap-2"></div></div></div><div id="form-weekend" class="space-y-4 hidden"><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">活动类型</label><div id="factivity" class="grid grid-cols-3 gap-2"></div><p id="factivity-err" class="field-error">请选择活动类型</p></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">活动地点</label><input id="flocation" type="text" placeholder="如：香山、奥森公园..." class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"/></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">活动时间</label><div id="fwtime" class="flex flex-wrap gap-2"></div></div><div class="bg-white rounded-xl shadow-sm p-4"><label class="block text-sm font-medium text-gray-700 mb-3">活动描述</label><textarea id="fdesc" maxlength="100" rows="3" placeholder="简单描述一下你的计划..." class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-orange-400"></textarea><div class="flex justify-end mt-1"><span id="char-counter" class="char-counter">0/100</span></div></div></div><div class="bg-white rounded-xl shadow-sm p-4 mt-4"><label class="block text-sm font-medium text-gray-700 mb-3">📱 预览效果</label><div id="preview-card" class="preview-card preview-empty"><p class="text-center text-sm text-gray-400">填写内容后预览将在此显示</p></div></div></main><div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50"><button id="pub-btn" class="pressable w-full h-12 bg-orange-500 text-white font-medium rounded-lg">发布到搭子广场</button></div></div>`;
  },
  init() {
    const draft = getStorage('publishDraft');
    if (draft) { this.state = Object.assign({}, this.state, draft); if (!this.state.weekend) this.state.weekend = { activity: '', location: '', time: '周六 9:00', description: '' }; }
    document.getElementById('back-btn').addEventListener('click', () => { this.saveDraft(); Router.back(); });
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
      // 后端 content 字段是对象(存 JSON),不要在这里 stringify
      const rawContent = { lunch: this.state.lunch, commute: this.state.commute, weekend: this.state.weekend }[this.state.type];
      // 字段名对齐前端广场页的读取(taste/socialMode/homeArea/departureTime/transportMode/activity/description)
      let content = { ...rawContent };
      if (this.state.type === 'commute') {
        content = { homeArea: rawContent.area, departureTime: rawContent.time, transportMode: rawContent.transport };
      } else if (this.state.type === 'lunch') {
        content = { time: rawContent.time, taste: rawContent.taste, budget: rawContent.budget, socialMode: rawContent.socialMode || '轻松聊天' };
      }
      const publishData = { scene: this.state.type, content, time_pref: this.state.type === 'lunch' ? this.state.lunch.time : this.state.type === 'commute' ? this.state.commute.time : this.state.weekend.time };
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
    document.getElementById('fctime').innerHTML = [{ v: '07:30' }, { v: '08:00' }, { v: '08:30' }, { v: '09:00' }].map(o => `<button data-v="${o.v}" class="octime px-4 py-2 rounded-full text-sm ${o.v === this.state.commute.time ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}">${o.v}</button>`).join('');
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
    return `<div class="bg-gray-50 min-h-screen pb-6"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">今日食堂菜单</h1><span class="text-xs text-gray-400">7/31 晚餐</span></div></nav><div class="fixed top-14 left-0 right-0 bg-white border-b border-gray-200 z-40"><div class="max-w-md mx-auto px-4 flex overflow-x-auto hide-scrollbar">${tabsHtml}</div></div><main class="max-w-md mx-auto px-4 pt-28 pb-4"><div id="menu-canteens" class="flex flex-wrap gap-2 mb-3"></div><div id="menu-grid" class="space-y-3"></div><p class="text-center text-xs text-gray-400 mt-4">数据来源：科技园食堂 · 今日实时更新</p></main></div>`;
  },
  init() {
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
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
    return `<div class="bg-gray-50 min-h-screen pb-6"><nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"><div class="max-w-md mx-auto px-4 h-14 flex items-center justify-between"><button id="back-btn" class="w-10 h-10 flex items-center justify-center"><svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><h1 class="text-lg font-semibold text-gray-900">今日推荐</h1><div class="w-10"></div></div></nav><main class="max-w-md mx-auto px-4 pt-18 pb-4 space-y-4">
      <div class="shimmer-card bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-4 text-white shadow-md card-appear">
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
  async init() {
    document.getElementById('back-btn').addEventListener('click', () => Router.back());
    document.getElementById('refresh-daily').addEventListener('click', () => this.loadRecommendation());
    this.state = { menuFilter: 'all', fortuneRevealed: false };
    this.initFortuneCards();
    // 先 loadMenu 让 this._menus 就绪,再 loadRecommendation 才能查到菜品详情
    await this.loadMenu();
    this.loadRecommendation();
    this.loadOffers();
  },
  async loadRecommendation() {
    const rec = await getDailyRecommendation();
    if (!rec) return;
    const textEl = document.getElementById('daily-text');
    if (textEl) textEl.textContent = `"${rec.recommendation}"`;
    const tagEl = document.getElementById('daily-tag');
    if (tagEl && rec.funTag) tagEl.textContent = rec.funTag;

    if (rec.suggestedBuddy) {
      const buddy = rec.suggestedBuddy;
      document.getElementById('daily-buddy').classList.remove('hidden');
      document.getElementById('buddy-content').innerHTML = `<div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><span class="text-lg font-medium text-orange-600">${buddy.nickname.charAt(0)}</span></div><div><h4 class="text-sm font-semibold text-gray-900">${buddy.nickname}</h4><p class="text-xs text-gray-500">${buddy.reason}</p></div></div><div class="flex items-center gap-2"><div class="score-ring" style="--score:${buddy.matchScore};width:40px;height:40px"><span class="score-num" style="font-size:11px">${buddy.matchScore}%</span></div><button id="invite-buddy-btn" class="pressable px-3 py-1.5 bg-orange-500 text-white text-xs rounded-full">邀请</button></div></div>`;
      document.getElementById('invite-buddy-btn')?.addEventListener('click', () => Router.navigateTo('/invite', { userId: buddy.uid || 'u006' }));
    }

    if (rec.suggestedRestaurant) {
      const rest = rec.suggestedRestaurant;
      // 优先从后端菜单查(this._menus loadMenu 后填充);兜底走 MOCK_MENUS
      const menuSource = this._menus && this._menus.length ? this._menus : (typeof MOCK_MENUS !== 'undefined' ? MOCK_MENUS : []);
      const dishes = (rec.suggestedDishes || []).map(id => menuSource.find(m => m.id === id)).filter(Boolean);
      document.getElementById('daily-restaurant').classList.remove('hidden');
      document.getElementById('restaurant-content').innerHTML = `<div class="flex items-center justify-between mb-3"><div><p class="text-sm font-semibold text-gray-900">${rest.name}</p><p class="text-xs text-gray-500">${rest.distance} · 人均${rest.avgPrice}</p></div></div>${dishes.length > 0 ? `<div class="space-y-1.5"><p class="text-xs text-gray-500 mb-1">今日推荐菜品</p>${dishes.map(d => `<div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"><div class="flex items-center gap-2"><span class="text-sm font-medium">${d.dish}</span><span class="spicy-indicator">${spicyIcons(d.spicy)}</span></div><div class="flex items-center gap-2"><span class="text-xs font-medium text-orange-500">${d.price != null ? d.price + '元' : '时价'}</span></div></div>`).join('')}</div>` : ''}`;
    }
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
    const profile = getStorage('userProfile') || {};
    const constellation = (MOCK_PROFILES['u001'] || {}).constellation || '天秤座';
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
    // 后端 rating 是 1-5 星: good→5, bad→2
    const ratingNum = rating === 'good' ? 5 : 2;
    await submitFeedback({ matchId: info.matchId, rating: ratingNum, note: overlay.querySelector('#feedback-note').value });
    showToast('感谢反馈，会用来优化下次匹配');
    close();
  });
}

// ============ 应用初始化 ============
document.addEventListener('DOMContentLoaded', function() {
  // 监听DOM变化，自动替换头像
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
  
  // 初始化路由
  Router.init();
  
  // 网页端：添加设备类型标识
  if (window.innerWidth >= 768) {
    document.body.classList.add('is-desktop');
  }
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      document.body.classList.add('is-desktop');
    } else {
      document.body.classList.remove('is-desktop');
    }
  });
});
