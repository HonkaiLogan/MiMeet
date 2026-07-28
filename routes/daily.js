/**
 * 每日推荐 API
 */
const express = require('express');
const router = express.Router();

/** 获取每日幸运推荐 */
router.get('/api/daily/recommend', (req, res) => {
  // TODO: 接入 MiMo 生成每日推荐
  res.json({
    code: 200, msg: 'ok',
    data: {
      keywords: '社交指数 ★★★★★',
      recommended_food: '推荐去B1吃轻食沙拉',
      social_tip: '今天适合主动出击，找个饭搭子一起聊聊AI！',
    },
  });
});

module.exports = router;
