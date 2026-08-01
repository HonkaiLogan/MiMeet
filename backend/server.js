/**
 * MiMeet - Express 主应用
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const { initDB } = require('../database/mock-db');
const { startScheduler } = require('./scheduler');

const app = express();

// ========== 中间件 ==========
// 允许携带 cookie 跨域;origin 用函数形式回传请求源(单值 Access-Control-Allow-Origin)
app.use(cors({
  origin: (origin, cb) => cb(null, origin || true),
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// 开发环境登录旁路(?dev=u001 / X-Dev-User: u001)
const { devAuthMiddleware } = require('./middleware/devAuth');
app.use(devAuthMiddleware());

// 静态文件
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ========== 路由 ==========
app.use(require('./routes/auth'));
app.use(require('./routes/profile'));
app.use(require('./routes/match'));
app.use(require('./routes/square'));
app.use(require('./routes/daily'));
app.use(require('./routes/utility'));
app.use(require('./routes/feishu'));
app.use(require('./routes/feishu-events'));

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ========== 启动 ==========
const PORT = parseInt(process.env.PORT || '5000');

initDB().then(() => {
  startScheduler();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MiMeet] 服务已启动: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('数据库初始化失败:', err.message);
  // Mock 模式下不强制退出
  startScheduler();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MiMeet] 服务已启动 (降级模式): http://localhost:${PORT}`);
  });
});
