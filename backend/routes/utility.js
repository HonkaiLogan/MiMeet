/**
 * 食堂菜单 / 优惠 / 路线 API
 */
const express = require('express');
const router = express.Router();

/** 获取食堂实时菜单 */
router.get('/api/food/menu', (req, res) => {
  // TODO: 接入米宴接口
  res.json({ code: 200, msg: 'ok', data: [] });
});

/** 获取优惠信息 */
router.get('/api/food/offers', (req, res) => {
  // TODO: 接入优惠屋接口
  res.json({ code: 200, msg: 'ok', data: [] });
});

/** 获取餐厅路线 */
router.get('/api/food/route', (req, res) => {
  // TODO: 接入地图API
  res.json({ code: 200, msg: 'ok', data: null });
});

module.exports = router;
