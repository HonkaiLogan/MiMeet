/**
 * 飞书 OAuth 登录
 */
const express = require('express');
const axios = require('axios');
const router = express.Router();

const { getTenantAccessToken } = require('../services/feishu');

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

    // 拉取通讯录信息（部门、工位、About Me）
    let department = '';
    let seatNumber = '';
    let aboutMe = '';
    try {
      const tenantToken = await getTenantAccessToken();
      const contactResp = await axios.get(
        `https://open.feishu.cn/open-apis/contact/v3/users/${userInfo.open_id}?user_id_type=open_id`,
        { headers: { Authorization: `Bearer ${tenantToken}` } }
      );
      const contactData = contactResp.data.data?.user || {};
      department = contactData.department_ids?.[0] || '';
      seatNumber = contactData.seat_number || '';
      aboutMe = contactData.about_me || '';
    } catch (contactErr) {
      console.warn('拉取通讯录信息失败（非致命）:', contactErr.message);
    }

    // 存入 session
    req.session.user = {
      feishu_id: userInfo.open_id,
      nickname: userInfo.name,
      avatar_url: userInfo.avatar_url,
      department,
      seat_number: seatNumber,
    };

    // 写入/更新数据库
    const { pool } = require('../db');
    try {
      await pool.query(`
        INSERT INTO users (feishu_id, nickname, avatar_url, department, seat_number, about_me)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          nickname = VALUES(nickname),
          avatar_url = VALUES(avatar_url),
          department = VALUES(department),
          seat_number = VALUES(seat_number),
          about_me = VALUES(about_me)
      `, [userInfo.open_id, userInfo.name, userInfo.avatar_url, department, seatNumber, aboutMe]);
    } catch (dbErr) {
      console.warn('写入用户信息失败（非致命）:', dbErr.message);
    }

    res.redirect('/');
  } catch (err) {
    console.error('飞书 OAuth 错误:', err.message);
    res.status(500).json({ code: 500, msg: '登录失败', data: null });
  }
});

module.exports = router;
