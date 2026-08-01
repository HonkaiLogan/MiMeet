/**
 * 每日推荐 API
 */
const express = require('express');
const { dailyRecommendation } = require('../services/mimo');
const router = express.Router();

const ZODIAC_LIST = ['白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼'];

function getZodiac(month, day) {
  const dates = [20,19,21,20,21,21,23,23,23,23,22,22];
  const idx = day < dates[month - 1] ? (month - 2 + 12) % 12 : month - 1;
  return ZODIAC_LIST[idx];
}

/** 获取每日幸运推荐 */
router.get('/api/daily/recommend', async (req, res) => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const zodiac = req.query.zodiac || getZodiac(now.getMonth() + 1, now.getDate());

  try {
    const data = await dailyRecommendation(date, zodiac);
    res.json({ code: 200, msg: 'ok', data });
  } catch (err) {
    console.error('每日推荐错误:', err.message);
    res.json({ code: 500, msg: '推荐生成失败', data: null });
  }
});

module.exports = router;
