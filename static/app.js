/**
 * Mi搭子 - 前端交互逻辑
 * SPA 单页应用，通过 JS 控制页面显示/隐藏
 */

// ========== 统一请求封装 ==========
const BASE_URL = window.location.origin;

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
const pages = ['home', 'profile', 'match', 'square', 'daily', 'mine'];

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
    const data = await request('/api/profile');
    if (data) {
        // 回填表单
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
    const data = await request('/api/profile', {
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

    const results = await request('/api/match', {
        method: 'POST',
        body: JSON.stringify({ scene })
    });

    if (!results || results.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400">暂无匹配结果，试试先完善画像？</p>';
        return;
    }

    container.innerHTML = results.map((r, i) => `
        <div class="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <div class="flex items-center mb-2">
                <span class="text-lg font-bold">推荐${i + 1}：</span>
                <span class="text-lg font-bold ml-1">${r.nickname || '匿名用户'}</span>
                <span class="ml-auto text-orange-500 font-bold">匹配度 ${r.score || r.rule_score}%</span>
            </div>
            <p class="text-gray-600 text-sm mb-2">${r.reason || '你们有很多共同点！'}</p>
            ${r.commonTags ? `<div class="flex flex-wrap gap-1">${r.commonTags.map(t => `<span class="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">${t}</span>`).join('')}</div>` : ''}
            <button class="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg text-sm" onclick="inviteBuddy('${r.candidate_id}')">
                一键邀请
            </button>
        </div>
    `).join('');
}

function inviteBuddy(candidateId) {
    // TODO: 发送飞书消息邀请
    alert('邀请已发送！');
}

// ========== 搭子广场 ==========
async function loadSquare() {
    const posts = await request('/api/square');
    const container = document.getElementById('square-list');

    if (!posts || posts.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400">暂无搭子需求，快来发布第一条吧！</p>';
        return;
    }

    container.innerHTML = posts.map(p => `
        <div class="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <div class="flex items-center mb-2">
                <span class="font-bold">${p.nickname || '匿名'}</span>
                <span class="ml-auto text-gray-400 text-xs">${timeAgo(p.created_at)}</span>
            </div>
            <p class="text-gray-700 mb-2">${p.content}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs text-orange-500">${p.scene === 'lunch' ? '🍜 午餐' : '🚗 通勤'}</span>
                <button class="text-orange-500 text-sm" onclick="respondPost(${p.id})">响应</button>
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
    const data = await request('/api/square', {
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

function respondPost(postId) {
    // TODO: 响应搭子需求
    alert('已响应，等待对方确认！');
}

// ========== 每日推荐 ==========
async function loadDaily() {
    const data = await request('/api/daily');
    if (data) {
        document.getElementById('daily-content').innerHTML = `
            <div class="text-center">
                <p class="text-2xl mb-2">♎</p>
                <p class="text-lg font-bold mb-2">${data.keywords}</p>
                <p class="text-gray-600 mb-4">${data.recommended_food}</p>
                <p class="text-orange-500 text-sm">${data.social_tip}</p>
            </div>
        `;
    }
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
