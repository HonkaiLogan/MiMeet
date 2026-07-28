/**
 * 飞书 OAuth 登录
 */
const express = require('express');
const axios = require('axios');
const router = express.Router();

const FEISHU_APP_ID = process.env.FEISHU_APP_ID || '';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || '';
const FEISHU_REDIRECT_URI = process.env.FEISHU_REDIRECT_URI || 'http://localhost:5000/auth/callback';

/** 跳转飞书 OAuth 授权页 */
router.get('/auth/login', (req, res) => {
  const url = `https://open.feishu.cn/open-apis/authen/v1/authorize`
    + `?app_id=${FEISHU_APP_ID}`
    + `&redirect_uri=${encodeURIComponent(FEISHU_REDIRECT_URI)}`
    + `&response_type=code`;
  res.redirect(url);
});

/** 飞书 OAuth 回调 */
router.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ code: 400, msg: '缺少授权码', data: null });
  }

  try {
    // 用 code 换取 user_access_token
    const tokenResp = await axios.post(
      'https://open.feishu.cn/open-apis/authen/v1/oidc/access_token',
      {
        grant_type: 'authorization_code',
        code,
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const tokenData = tokenResp.data.data || {};
    const userAccessToken = tokenData.access_token;

    // 获取用户信息
    const userResp = await axios.get(
      'https://open.feishu.cn/open-apis/authen/v1/user_info',
      { headers: { Authorization: `Bearer ${userAccessToken}` } }
    );

    const userInfo = userResp.data.data || {};

    // 存入 session
    req.session.user = {
      feishu_id: userInfo.open_id,
      nickname: userInfo.name,
      avatar_url: userInfo.avatar_url,
    };

    res.redirect('/');
  } catch (err) {
    console.error('飞书 OAuth 错误:', err.message);
    res.status(500).json({ code: 500, msg: '登录失败', data: null });
  }
});

module.exports = router;
