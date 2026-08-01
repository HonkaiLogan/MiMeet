/**
 * 临时前端预览脚本（不入库）
 * 只服务 frontend/ 静态资源，API 请求会 404 但不影响页面渲染
 * 用完可直接删除此文件
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[preview] 前端预览已启动: http://localhost:${PORT}`);
});
