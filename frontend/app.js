/**
 * Mi搭子 - 前端交互逻辑
 * SPA 单页应用，通过 JS 控制页面显示/隐藏
 */

// ========== 统一请求封装 ==========
const BASE_URL = window.location.origin;

// ========== 飞书 JSAPI 初始化 ==========
async function initFeishuSDK() {
    try {
        const config = await request('/api/feishu/jsapi-config');
        if (config && window.h5sdk) {
            window.h5sdk.config({
                appId: config.appId,
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                signature: config.signature,
                jsApiList: ['biz.util.share', 'biz.util.open'],
            });
        }
    } catch (e) {
        // 非飞书环境，忽略
        console.log('飞书 JSAPI 初始化跳过:', e.message);
    }
}

async function request(apiPath, options = {}) {
    const res = await fetch(`${BASE_URL}${apiPath}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    const result = await res.json();
    if (result.code !== 200) {
        alert(result.msg);
        return null;
    }
    return result.data;
}

// ========== 页面路由 ==========
const pages = ['home', 'profile', 'match', 'square', 'daily', 'mine', 'history'];

function showPage(pageId) {
    pages.forEach(id => {
        const el = document.getElementById(`page-${id}`);
        if (el) el.classList.toggle('hidden', id !== pageId);
    });
    // 更新底部导航高亮
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });
}

// ========== 首页 ==========
function initHome() {
    document.getElementById('btn-lunch')?.addEventListener('click', () => {
        showPage('match');
        doMatch('lunch');
    });
    document.getElementById('btn-commute')?.addEventListener('click', () => {
        showPage('match');
        doMatch('commute');
    });
}

// ========== 画像设置 ==========
async function loadProfile() {
    const data = await request('/api/user/getProfile');
    if (data) {
        document.getElementById('taste').value = data.taste_pref || '';
        document.getElementById('time-pref').value = data.time_pref || '';
        document.getElementById('location').value = data.location_pref || '';
    }
}

async function saveProfile() {
    const params = {
        scene: 'lunch',
        taste_pref: document.getElementById('taste').value,
        time_pref: document.getElementById('time-pref').value,
        location_pref: document.getElementById('location').value,
        budget: document.getElementById('budget').value,
        social_pref: document.getElementById('social-pref').value,
        interests: document.getElementById('interests').value,
    };
    const data = await request('/api/user/saveProfile', {
        method: 'POST',
        body: JSON.stringify(params)
    });
    if (data !== null) {
        alert('画像保存成功！');
    }
}

// ========== 匹配结果 ==========
async function doMatch(scene) {
    const container = document.getElementById('match-results');
    container.innerHTML = '<p class="text-center text-gray-400">正在匹配中...</p>';

    const results = await request('/api/match/execute', {
        method: 'POST',
        body: JSON.stringify({ scene })
    });

    if (!results || results.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400">暂无匹配结果，试试先完善画像？</p>';
        return;
    }

    const isCommute = scene === 'commute';

    container.innerHTML = results.map((r, i) => {
        const icebreaker = r.icebreaker || {};
        const topics = icebreaker.icebreakerTopics || [];
        return `
        <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div class="flex items-center mb-3">
                <span class="text-lg font-bold text-gray-800">推荐${i + 1}</span>
                <span class="text-lg font-bold text-gray-800 ml-1">${r.nickname || '匿名用户'}</span>
                <span class="ml-auto text-orange-500 font-bold text-lg">${r.score || r.rule_score}%</span>
            </div>
            ${!isCommute && r.department ? `<p class="text-gray-400 text-xs mb-2">🏢 ${r.department}</p>` : ''}
            <p class="text-gray-500 text-sm mb-3">${r.reason || '你们有很多共同点！'}</p>
            ${r.commonTags ? `<div class="flex flex-wrap gap-1.5 mb-3">${r.commonTags.map(t => `<span class="bg-orange-100 text-orange-600 text-xs px-2.5 py-1 rounded-full">${t}</span>`).join('')}</div>` : ''}
            ${topics.length > 0 ? `
            <div class="bg-orange-50 rounded-lg p-3 mb-3">
                <p class="text-xs text-orange-600 font-bold mb-1.5">💡 破冰话题</p>
                <div class="flex flex-wrap gap-1.5">${topics.map(t => `<span class="bg-white text-orange-600 text-xs px-2.5 py-1 rounded-full border border-orange-200">${t}</span>`).join('')}</div>
            </div>` : ''}
            <div class="flex gap-2 mt-3">
                <button class="flex-1 bg-orange-500 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-orange-600 transition" onclick="inviteBuddy('${r.candidate_id}', '${(icebreaker.inviteMessage || '一起呀~').replace(/'/g, "\\'")}')">
                    一键邀请
                </button>
                <button class="px-3 py-2.5 rounded-lg text-sm border border-green-300 text-green-600 hover:bg-green-50 transition" onclick="submitFeedback(this, ${r.match_id || 0}, 'good')">👍</button>
                <button class="px-3 py-2.5 rounded-lg text-sm border border-gray-300 text-gray-500 hover:bg-gray-50 transition" onclick="submitFeedback(this, ${r.match_id || 0}, 'bad')">👎</button>
            </div>
        </div>`;
    }).join('');
}

async function inviteBuddy(candidateId, message) {
    const data = await request('/api/match/invite', {
        method: 'POST',
        body: JSON.stringify({
            candidateId: Number(candidateId),
            scene: 'lunch',
            message: message || '一起呀~',
        })
    });
    if (data !== null) {
        alert('邀请已发送！');
    }
}

async function submitFeedback(btn, matchId, rating) {
    if (!matchId) return;
    const data = await request('/api/match/feedback', {
        method: 'POST',
        body: JSON.stringify({ matchId, rating })
    });
    if (data !== null) {
        // 禁用同组按钮
        const parent = btn.parentElement;
        parent.querySelectorAll('button').forEach(b => {
            if (b !== parent.querySelector('.bg-orange-500')) {
                b.disabled = true;
                b.classList.add('opacity-40');
            }
        });
        btn.classList.remove('opacity-40');
    }
}

// ========== 搭子广场 ==========
async function loadSquare() {
    const posts = await request('/api/plaza/list');
    const container = document.getElementById('square-list');

    if (!posts || posts.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400">暂无搭子需求，快来发布第一条吧！</p>';
        return;
    }

    container.innerHTML = posts.map(p => `
        <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div class="flex items-center mb-2">
                <span class="font-bold text-gray-800">${p.nickname || '匿名'}</span>
                <span class="ml-auto text-gray-400 text-xs">${timeAgo(p.created_at)}</span>
            </div>
            <p class="text-gray-600 text-sm mb-3">${p.content}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs text-orange-500">${p.scene === 'lunch' ? '🍜 午餐' : '🚗 通勤'}</span>
                <button class="text-orange-500 text-sm font-medium hover:text-orange-600 transition" onclick="respondPost(${p.id})">响应 →</button>
            </div>
        </div>
    `).join('');
}

async function publishPost() {
    const content = document.getElementById('post-content').value;
    if (!content.trim()) {
        alert('请输入搭子需求');
        return;
    }
    const data = await request('/api/plaza/publish', {
        method: 'POST',
        body: JSON.stringify({
            scene: document.getElementById('post-scene').value,
            content: content,
            time_pref: document.getElementById('post-time').value
        })
    });
    if (data !== null) {
        document.getElementById('post-content').value = '';
        loadSquare();
    }
}

async function respondPost(postId) {
    const data = await request('/api/plaza/respond', {
        method: 'POST',
        body: JSON.stringify({ postId })
    });
    if (data !== null) {
        alert('已响应，已通知对方！');
    }
}

// ========== 每日推荐 ==========
async function loadDaily() {
    const data = await request('/api/daily/recommend');
    if (data) {
        document.getElementById('daily-content').innerHTML = `
            <div class="text-center py-4">
                <p class="text-4xl mb-4">♎</p>
                <p class="text-xl font-bold text-gray-800 mb-3">${data.keywords}</p>
                <p class="text-gray-600 mb-4">${data.recommended_food}</p>
                <p class="text-orange-500 text-sm mt-2">${data.social_tip}</p>
            </div>
        `;
    }
}

// ========== 历史匹配记录 ==========
async function loadHistory() {
    const container = document.getElementById('history-list');
    container.innerHTML = '<p class="text-center text-gray-400">加载中...</p>';

    const rows = await request('/api/match/history');
    if (!rows || rows.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400">暂无匹配记录</p>';
        return;
    }

    container.innerHTML = rows.map(m => `
        <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div class="flex items-center mb-2">
                <span class="font-bold text-gray-800">${m.partner_name || '匿名用户'}</span>
                <span class="ml-auto text-xs text-gray-400">${m.scene === 'lunch' ? '🍜 午餐' : '🚗 通勤'}</span>
            </div>
            <div class="flex items-center justify-between mb-1">
                <span class="text-orange-500 font-medium">匹配度 ${m.score || 0}%</span>
                <span class="text-xs text-gray-400">${timeAgo(m.created_at)}</span>
            </div>
            ${m.reason ? `<p class="text-gray-500 text-xs mt-1">${m.reason}</p>` : ''}
            <div class="mt-3 text-xs">
                ${m.my_feedback === 'good' ? '<span class="text-green-500 font-medium">👍 已标记合适</span>' :
                  m.my_feedback === 'bad' ? '<span class="text-gray-400">👎 已标记不合适</span>' :
                  '<span class="text-gray-300">未反馈</span>'}
            </div>
        </div>
    `).join('');
}

// ========== 工具函数 ==========
function timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    return `${Math.floor(diff / 86400)}天前`;
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    initHome();
    initFeishuSDK();
    showPage('home');

    // 底部导航
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            showPage(page);
            if (page === 'square') loadSquare();
            if (page === 'daily') loadDaily();
            if (page === 'profile') loadProfile();
        });
    });
});
