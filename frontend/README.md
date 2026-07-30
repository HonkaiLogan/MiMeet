# Mi搭子 - 前端功能说明 & 前后端对接清单

> 负责人：董芳潇（前端页面/交互） · 对接方：吴嘉润（后端接口）
> 技术栈：HTML5 + Tailwind CSS（CDN）+ 原生 JavaScript（Hash 路由 SPA）
> 最后更新：2026年7月30日

---

## 一、现状总览

**当前前端所有页面的数据都是写死的 Mock 数据（在各页面的 `loadResults()` / `loadPosts()` 等方法里），还没有一个页面真正调用后端接口。**

`app.js` 里已经封装好了全部 14 个接口请求函数（第 106-139 行），命名和路径都是和后端约定好的，**但除了 `submitFeedback`（反馈弹窗里调用了）以外，其余 13 个函数目前都只是定义了，没有被任何页面调用**。这份文档主要就是列出：每个页面现在长什么样、以及要换成真实数据分别需要接哪个接口。

---

## 二、页面功能介绍（按路由）

| 路由 | 页面 | 功能说明 |
|---|---|---|
| `#/login` | 登录页 | 飞书一键登录入口（目前是本地模拟登录，1秒后写入假 userInfo） |
| `#/home` | 首页 | 今日推荐卡片 + 找饭搭子/找拼车搭子入口 + 广场预览2条 |
| `#/profile-init` | 画像填写页 | 两步式：① 用餐时间/口味/预算 ② 兴趣标签；有必填校验、本地草稿自动保存 |
| `#/match-lunch` | 午餐匹配页 | 展示AI推荐的3位饭搭子（匹配度、共同标签、推荐理由）；候选为空时有兜底页 |
| `#/match-commute` | 通勤匹配页 | 展示3位拼车搭子（路线重合度、预估节省）；候选为空时有兜底页 |
| `#/invite` | 邀请详情页 | 展示对方信息、AI生成的邀约话术 + 3条破冰话题，支持复制 |
| `#/square` | 搭子广场 | 全部/午餐/通勤/周末 筛选列表；下拉刷新；响应需求（防重复点击）；筛选为空有空状态 |
| `#/profile` | 个人中心 | 用户信息、统计数字、我的需求、我的搭子（点"查看"弹出反馈打分弹窗） |
| `#/publish` | 发布需求页 | 选择场景类型（午餐/通勤/周末）+ 对应表单，发布前有必填校验、防重复提交 |
| `#/daily` | 每日推荐页（新增） | 运势文案、食堂菜单（带口味筛选）、园区优惠信息 |

**通用组件/机制**：
- 骨架屏加载（`skeletonCards()`）— 用在广场页、两个匹配页的加载态
- 下拉刷新（`initPullToRefresh()`）— 目前只接在广场页
- 反馈打分弹窗（`showFeedbackModal()`）— 从个人中心"查看"按钮触发
- 路由切换淡入动画、卡片出现动画、点击缩放反馈（`.pressable`）
- 演示用小机关：匹配页地址栏加 `?empty=1` 可预览"无匹配"兜底页，例如 `#/match-lunch?empty=1`

---

## 三、前后端对接清单 ⭐（核心）

请求统一走 `app.js` 第 106 行的 `request(apiPath, options)` 封装，规则如下（后端返回格式请对齐）：

```js
// 后端返回格式约定
{ code: 200, msg: "ok", data: { ... } }   // code !== 200 时前端会自动弹Toast提示msg，并return null
```

`BASE_URL` 目前写死为 `http://localhost:3000`（app.js 第9行），联调时改这一个地方即可，**不需要改任何页面逻辑**。

| # | 功能 | 接口（已封装好的函数） | 方法 | 用在哪个页面 | 需要后端返回的关键字段 | 对接方式 |
|---|---|---|---|---|---|---|
| 1 | 获取用户画像 | `getUserProfile()` | GET `/api/user/getProfile` | 画像填写页初始化时、首页判断是否需要跳转画像页 | `lunchPreference{time,taste,budget}`、`interestTags[]` | 在 `ProfileInitPage.init()` 里把当前读 `getStorage('userProfile')` 的地方换成调这个接口 |
| 2 | 保存用户画像 | `saveUserProfile(data)` | POST `/api/user/saveProfile` | 画像填写页"完成"按钮 | 返回保存成功状态即可 | 替换 `ProfileInitPage` 里 `setStorage('userProfile', ...)` 那一行 |
| 3 | 发起匹配 | `executeMatch(type, pref)` | POST `/api/match/execute` | 午餐/通勤匹配页加载时 | 候选人数组：`uid,name,dept,score,tags[],reason`（通勤还需 `overlap,saving,time`） | 替换 `MatchLunchPage.loadResults()` / `MatchCommutePage.loadResults()` 里的 `mock` 数组来源；**注意保留"数组为空时展示兜底页"的判断逻辑，不要删** |
| 4 | 提交匹配反馈 | `submitFeedback(data)` | POST `/api/match/feedback` | 反馈打分弹窗提交按钮 | ✅ **已接好**，见 `showFeedbackModal()` 函数末尾 | 无需改前端，后端接口就位即可联调 |
| 5 | 匹配历史 | `getMatchHistory(page, size)` | GET `/api/match/history` | 个人中心"我的搭子"列表（目前是写死1条） | 分页列表：`uid,name,type,lastMatchDate` | 需要在 `ProfilePage` 里补一段渲染逻辑（目前该区域是静态HTML，还没做成动态列表） |
| 6 | 发送邀请 | `sendInvite(uid, msg)` | POST `/api/match/invite` | 邀请详情页"发送邀请"按钮 | 返回成功状态即可 | 替换 `InvitePage.init()` 里 `send-invite` 按钮的 `showToast('邀请已发送')` 那行 |
| 7 | 广场列表 | `getPlazaList(type, page, size)` | GET `/api/plaza/list` | 搭子广场页 | 分页列表：`id,name,type,time,content` | 替换 `SquarePage.loadPosts()` 里的 `mock` 数组；**注意保留下拉刷新和空状态的判断逻辑** |
| 8 | 发布到广场 | `publishToPlaza(data)` | POST `/api/plaza/publish` | 发布需求页"发布"按钮 | 返回成功状态即可 | 替换 `PublishPage.init()` 里 `pub-btn` 点击回调最后的 `setTimeout` 部分；**注意保留前面的必填校验逻辑** |
| 9 | 响应广场需求 | `respondToPlaza(squareId)` | POST `/api/plaza/respond` | 广场页"我要加入"按钮 | 返回成功状态即可 | 替换 `SquarePage.loadPosts()` 里 `.respond-btn` 点击回调；**注意保留按钮禁用防重复点击的逻辑** |
| 10 | 每日推荐 | `getDailyRecommendation()` | GET `/api/daily/recommend` | 首页推荐卡片 + 每日推荐页运势文案 | `text`（推荐文案）、`tag`（今日宜吃xx标签） | 替换 `HomePage` 里 `rec-text`/`fun-tag` 的写死文案，以及 `DailyPage` 顶部卡片 |
| 11 | 食堂菜单 | `getFoodMenu()` | GET `/api/food/menu` | 每日推荐页菜单列表 | 菜单数组：`id,canteen,dish,tag,price` | 替换 `DailyPage.loadMenu()` 里的 `mock` 数组；**注意保留口味筛选和空状态逻辑** |
| 12 | 优惠信息 | `getFoodOffers()` | GET `/api/food/offers` | 每日推荐页优惠区块 | 优惠数组：`id,title,desc` | 替换 `DailyPage.loadOffers()` 里的 `mock` 数组 |
| 13 | 路线距离查询 | `getFoodRoute(origin, destination)` | GET `/api/food/route` | **目前未使用** — 通勤匹配页的"路线重合度"字段现在是接口3返回的静态字段 | 距离/时长/重合度 | 需要产品(黄羽婵)确认这个字段最终是接口3直接返回，还是前端另外调这个接口算，目前先按接口3处理 |
| 14 | 飞书JSAPI鉴权配置 | `getFeishuJSAPIConfig(url)` | GET `/api/feishu/jsapi-config` | **目前未使用** — 登录页是本地模拟登录，还没接入真实飞书SDK | 飞书JS-SDK鉴权所需的 `appId,timestamp,nonceStr,signature` | 需要先接入飞书JSAPI脚本，`LoginPage` 里的模拟登录逻辑要整个替换 |

---

## 四、对接时请注意（写给吴嘉润）

1. **不要改前端已经封装好的接口路径和函数名**，如果后端实际路径不一样，直接改 `app.js` 106-139行 对应函数里的字符串即可，不用通知前端改页面代码。
2. 凡是标注了"注意保留xx逻辑"的地方，说明前端已经做了校验/防重复/兜底/空状态处理，**接真实接口时只需要替换数据来源（把 mock 数组换成 await 接口返回的 data），不要把外层的判断逻辑一起删掉**，否则会导致兜底页、防重复点击这些功能失效。
3. `request()` 封装里已经处理了网络异常和 `code !== 200` 的情况（自动弹 Toast），后端只需要保证返回格式是 `{code, msg, data}` 即可，不需要额外的 try-catch 提示。
4. 优先级建议：**1（画像）→ 3（匹配）→ 7/9（广场）→ 8（发布）→ 4（反馈，已接好只需联调）**，这几个是主流程；10/11/12（每日推荐）和 5（历史记录）优先级可以放后面；13、14 目前前端还没有调用点，等确认好方案再接。

---

## 五、还没做的部分（如果时间允许可以补）

- 个人中心"我的搭子"、"我的需求"目前是写死的静态HTML，还没做成动态列表渲染
- 登录页是模拟登录，飞书 OAuth 真实授权流程还没接
- 图片/头像目前都用文字首字母代替，没有真实头像展示逻辑
