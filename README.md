# MiMeet - Meet你的命中搭子

基于 Xiaomi MiMo 的职场生活轻社交连接器，覆盖午餐拼桌、通勤拼车两大高频场景。

## 快速启动

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入飞书 AppID/Secret 和 MiMo API Key

# 3. 启动服务
python app.py

# 4. 打开浏览器
# http://localhost:5000
```

## 技术栈

- **前端**：HTML5 + Tailwind CSS + 原生 JavaScript（SPA 单页应用）
- **后端**：Python 3 + Flask
- **数据库**：SQLite
- **AI 引擎**：Xiaomi MiMo API
- **登录**：飞书 OAuth 2.0

## 项目结构

```
MiMeet/
├── app.py              # Flask 主应用（路由、启动）
├── models.py           # 数据库模型（SQLite 表定义）
├── matching.py         # 匹配引擎（规则打分 + MiMo调用）
├── mimo_client.py      # MiMo API 封装
├── feishu_auth.py      # 飞书 OAuth 登录
├── requirements.txt    # Python 依赖
├── .env.example        # 环境变量模板
├── static/
│   ├── index.html      # 前端 SPA 主页面
│   └── app.js          # 前端交互逻辑
└── README.md           # 本文件
```

## API 接口

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /auth/login | 飞书登录 |
| GET | /api/profile | 获取画像 |
| POST | /api/profile | 保存画像 |
| POST | /api/match | 发起匹配 |
| GET | /api/square | 搭子广场列表 |
| POST | /api/square | 发布需求 |
| POST | /api/feedback | 匹配反馈 |
| GET | /api/daily | 每日推荐 |
| GET | /api/menu | 食堂菜单 |
| GET | /api/offers | 优惠信息 |
| GET | /api/restaurant/route | 餐厅路线 |
