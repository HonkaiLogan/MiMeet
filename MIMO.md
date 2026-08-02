# MiMeet 项目说明

## 项目概述
MiMeet - Meet你的命中搭子，基于 Xiaomi MiMo 的职场生活轻社交连接器。

## 启动服务

本项目需要同时启动两个服务：

### 1. Node.js 后端服务（端口 5000）
```bash
npm start
# 或开发模式（自动重启）
npm run dev
```

### 2. Python MiMo 服务（端口 8000）
```bash
cd backend_py
pip install -r requirements.txt
python main.py
```

### 前端预览
```bash
node preview.js
# 访问 http://localhost:3000
```

## 技术栈
- **前端**: Tailwind CSS + 原生 JavaScript (SPA) + 飞书 JS SDK
- **Node.js 后端**: Express + MySQL2 + axios + cors + dotenv + express-session + node-schedule
- **Python 后端**: FastAPI + Uvicorn + httpx + pydantic
- **AI**: Xiaomi MiMo
- **外部服务**: 飞书（登录/消息推送）

## 目录结构
```
MiMeet/
├── frontend/          # 前端静态文件
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── mock-data.js
├── backend/           # Node.js 后端
│   ├── server.js
│   ├── routes/
│   └── services/
├── backend_py/        # Python MiMo 服务
│   ├── main.py
│   ├── mimo_client.py
│   └── agent_recommend.py
└── package.json
```

## 注意事项
- 启动开发时务必同时启动 Node.js 和 Python 两个服务
- Python 服务提供 AI 相关功能（推荐、匹配、破冰话题等）
- Node.js 服务处理用户、匹配、广场等核心业务逻辑
