# Mi搭子 - 前端开发文档

## 📌 本轮更新记录（董芳潇）

| 任务项 | 改动位置 | 说明 |
|---|---|---|
| 画像表单校验 + 本地草稿 | `app.js` ProfileInitPage | 口味/兴趣未选时阻止下一步并提示；每次修改自动存草稿，刷新/退出后自动回填，提交成功后清除草稿 |
| 匹配场景兜底页面 | `app.js` MatchLunchPage / MatchCommutePage | 候选人为空时展示引导页（去广场发布）；地址栏加 `?empty=1` 可直接预览效果，例如 `#/match-lunch?empty=1` |
| 广场防重复响应 | `app.js` SquarePage | 点击"我要加入"后按钮禁用并变为"已响应，等待确认"；筛选结果为空时展示空状态 |
| 发布页表单校验 + 防重复提交 | `app.js` PublishPage | 午餐需至少选1个口味、通勤需选居住区域，否则拦截并提示；发布按钮点击后进入loading态防止连点 |
| 每日推荐模块独立页面 | `app.js` DailyPage（新增，路由 `#/daily`） | 首页"去看看"改为跳转这里；包含运势文案、菜单筛选、优惠信息 |
| 反馈打分弹窗 | `app.js` `showFeedbackModal()` | 从个人中心"我的搭子"的"查看"按钮触发；👍/👎 + 备注输入，提交调用 `submitFeedback` 接口 |
| 图标替换（emoji → SVG） | `app.js` `ICONS` 对象 | 替换了 🤝🍜🚗🎯🤖💬 六个约定图标，用在登录页、首页、广场筛选tab、发布页类型按钮、邀请详情页、个人中心 |
| 页面切换动画 / 卡片出现动画 / 骨架屏 | `app.js` `renderPage()` + `skeletonCards()`，`styles.css` | 路由切换时 `#app` 淡入；广场页、匹配页加载态从纯 spinner 换成骨架屏卡片 |
| 下拉刷新 | `app.js` `initPullToRefresh()`，用在广场页 | 基于 `window.scrollY` 判断是否在顶部，下拉超过40px松手触发刷新 |
| 点击反馈 | 各页面按钮加 `pressable` class | 复用 `styles.css` 里已有的 `.pressable:active` 缩放效果 |
| 响应式适配 | `styles.css` | 补了 `max-width:375px`（小屏）和 `min-width:428px`（大屏）两组媒体查询 |


---

## 一、项目说明

这是Mi搭子的前端代码，采用SPA单页应用架构。

### 技术栈
- HTML5
- Tailwind CSS（CDN引入）
- 原生 JavaScript（无框架）

### 文件位置
```
MiMeet/
├── static/
│   ├── index.html    # 入口页面
│   └── app.js        # 所有前端逻辑
```

## 二、代码结构

`app.js` 包含以下模块：

| 模块 | 行数 | 说明 |
|------|------|------|
| 配置 | 1-32 | 接口地址、选项数据 |
| 工具函数 | 34-45 | Toast、存储、按钮状态 |
| API请求 | 47-80 | 所有后端接口封装 |
| 路由系统 | 82-100 | Hash路由管理 |
| 登录页 | 102-130 | 飞书OAuth登录 |
| 首页 | 132-180 | 场景入口+推荐+广场 |
| 画像填写页 | 182-230 | 午餐偏好+兴趣标签 |
| 午餐匹配页 | 232-280 | Top3搭子展示 |
| 通勤匹配页 | 282-310 | Top3搭子展示 |
| 邀请详情页 | 312-340 | 破冰话术 |
| 搭子广场页 | 342-380 | 需求列表 |
| 个人中心页 | 382-420 | 用户信息+设置 |
| 发布页 | 422-480 | 发布需求表单 |
| 应用初始化 | 482-500 | 路由注册 |

## 三、需要优化的地方

### 1. 视觉优化

**颜色系统**
```css
/* 主色调 */
--primary: #FF6700;        /* 小米橙 */
--primary-light: #FFF5F0;  /* 浅橙背景 */
--primary-dark: #E55D00;   /* 深橙悬停 */

/* 功能色 */
--success: #22C55E;        /* 成功绿 */
--warning: #F59E0B;        /* 警告黄 */
--error: #EF4444;          /* 错误红 */

/* 中性色 */
--text-primary: #111827;   /* 主文字 */
--text-secondary: #6B7280; /* 次文字 */
--bg-primary: #F8F9FA;     /* 主背景 */
--bg-card: #FFFFFF;        /* 卡片背景 */
```

**字体系统**
```css
/* 标题 */
h1 { font-size: 24px; font-weight: 700; }
h2 { font-size: 20px; font-weight: 600; }
h3 { font-size: 18px; font-weight: 600; }

/* 正文 */
body { font-size: 16px; line-height: 1.5; }
.text-sm { font-size: 14px; }
.text-xs { font-size: 12px; }
```

**间距系统**
```css
/* 页面边距 */
.page-padding { padding: 0 16px; }

/* 卡片间距 */
.card + .card { margin-top: 12px; }

/* 元素间距 */
.element-gap { gap: 8px; }
```

### 2. 动效添加

**页面切换动画**
```css
.page-enter {
  animation: slideInRight 0.3s ease-out;
}

.page-leave {
  animation: slideOutLeft 0.3s ease-in;
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutLeft {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-100%); opacity: 0; }
}
```

**卡片出现动画**
```css
.card-appear {
  animation: cardAppear 0.3s ease-out;
}

@keyframes cardAppear {
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

/* 依次出现 */
.card-appear:nth-child(1) { animation-delay: 0s; }
.card-appear:nth-child(2) { animation-delay: 0.1s; }
.card-appear:nth-child(3) { animation-delay: 0.2s; }
```

**加载动画**
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton 1.5s infinite;
}

@keyframes skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 3. 交互细节

**下拉刷新**
```javascript
// 添加下拉刷新功能
function initPullToRefresh(container, callback) {
  let startY = 0;
  let pulling = false;
  
  container.addEventListener('touchstart', (e) => {
    if (container.scrollTop === 0) {
      startY = e.touches[0].pageY;
      pulling = true;
    }
  });
  
  container.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    const pullDistance = e.touches[0].pageY - startY;
    if (pullDistance > 0 && pullDistance < 100) {
      container.style.transform = `translateY(${pullDistance}px)`;
    }
  });
  
  container.addEventListener('touchend', () => {
    if (pulling) {
      container.style.transform = '';
      callback();
      pulling = false;
    }
  });
}
```

**点击反馈**
```css
.btn-active:active {
  transform: scale(0.95);
  opacity: 0.8;
}

.card-active:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**输入框聚焦**
```css
input:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(255, 103, 0, 0.1);
}
```

### 4. 响应式适配

```css
/* 小屏手机 */
@media (max-width: 375px) {
  .page-padding { padding: 0 12px; }
  h1 { font-size: 20px; }
  h2 { font-size: 18px; }
}

/* 大屏手机 */
@media (min-width: 428px) {
  .container { max-width: 428px; margin: 0 auto; }
}
```

## 四、图标替换

当前使用emoji作为图标，建议替换为SVG图标：

| 当前 | 建议替换 |
|------|----------|
| 🤝 | Mi搭子Logo |
| 🍜 | 餐碗图标 |
| 🚗 | 汽车图标 |
| 🎯 | 靶子图标 |
| 🤖 | 机器人图标 |
| 💬 | 对话气泡图标 |

## 五、待对接接口

当前所有数据都是Mock数据，需要对接真实接口：

| 功能 | 接口 | 状态 |
|------|------|------|
| 登录 | /auth/login | 待对接 |
| 获取画像 | /api/user/getProfile | 待对接 |
| 保存画像 | /api/user/saveProfile | 待对接 |
| 发起匹配 | /api/match/execute | 待对接 |
| 搭子广场 | /api/plaza/list | 待对接 |
| 每日推荐 | /api/daily/recommend | 待对接 |

对接时只需要修改 `app.js` 中的API函数，页面逻辑不需要改。

## 六、测试方法

1. 本地运行：用VS Code Live Server打开 `index.html`
2. 或者用命令：`npx serve static`
3. 访问：`http://localhost:3000`

## 七、注意事项

1. **不要修改API接口路径**：这些路径和后端约定好了
2. **保持SPA架构**：所有页面都在一个HTML里，用路由切换
3. **使用Tailwind CSS**：样式优先用Tailwind类名
4. **保持代码简洁**：避免过度封装

---

**最后更新**：2026年7月30日
**负责人**：黄羽婵（产品）、董芳潇（前端）
