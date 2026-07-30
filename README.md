# MiMeet - Meet你的命中搭子

基于 Xiaomi MiMo 的职场生活轻社交连接器，覆盖生活资源整合、吃饭拼桌、通勤拼车三大高频场景。

## 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入 MySQL 连接信息、飞书 AppID/Secret、MiMo API Key

# 3. 启动服务
npm start

# 4. 打开浏览器
# http://localhost:5000
```

## 技术栈

- **前端**：HTML5 + Tailwind CSS + 原生 JavaScript（SPA 单页应用）
- **后端**：Node.js + Express
- **数据库**：MySQL（mysql2 驱动）
- **AI 引擎**：Xiaomi MiMo API
- **登录**：飞书 OAuth 2.0

## 项目结构

```
MiMeet/
├── server.js               # Express 主应用（路由、启动）
├── db.js                   # MySQL 连接池 + 建表
├── package.json            # Node.js 依赖
├── .env.example            # 环境变量模板
├── routes/
│   ├── auth.js             # 飞书 OAuth 登录
│   ├── profile.js          # 用户画像 API
│   ├── match.js            # 匹配 API
│   ├── square.js           # 搭子广场 API
│   ├── daily.js            # 每日推荐 API
│   ├── utility.js          # 菜单/优惠/路线 API
│   └── feishu.js           # 飞书 JSAPI + 邀请消息
├── services/
│   ├── feishu.js           # 飞书 API（token/JSAPI/消息）
│   ├── matching.js         # 匹配引擎（规则初筛 + MiMo精排）
│   └── mimo.js             # MiMo API 封装
├── static/
│   ├── index.html          # 前端 SPA 主页面
│   └── app.js              # 前端交互逻辑
└── README.md               # 本文件
```

## API 接口

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /auth/login | 飞书登录 |
| GET | /auth/callback | 飞书回调 |
| GET | /api/user/getProfile | 获取画像 |
| POST | /api/user/saveProfile | 保存画像 |
| POST | /api/match/execute | 发起匹配 |
| POST | /api/match/feedback | 匹配反馈 |
| GET | /api/match/history | 历史匹配记录 |
| POST | /api/match/invite | 一键邀请（发飞书消息） |
| GET | /api/plaza/list | 搭子广场列表 |
| POST | /api/plaza/publish | 发布需求 |
| POST | /api/plaza/respond | 响应搭子需求 |
| GET | /api/daily/recommend | 每日推荐 |
| GET | /api/food/menu | 食堂菜单 |
| GET | /api/food/offers | 优惠信息 |
| GET | /api/food/route | 餐厅路线 |
| GET | /api/feishu/jsapi-config | 飞书 JSAPI 配置 |
