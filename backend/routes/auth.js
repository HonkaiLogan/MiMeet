/**
 * 飞书 OAuth 2.0 网页应用登录(非飞书域名)
 *
 * 三步:
 *   1. GET /auth/login    → 302 到飞书授权页(带 state 防 CSRF)
 *   2. GET /auth/callback → code 换 user_access_token → 拉用户身份 → 写库 + session
 *   3. GET /auth/me       → 前端探测当前登录态
 *   POST /auth/logout     → 清 session
 *
 * 飞书后台要求(在开发者后台配置):
 *   - 应用能力: 网页应用
 *   - 安全设置 > 重定向 URL:   http://localhost:5000/auth/callback (或你的公网域名)
 *   - 安全设置 > H5 可信域名:  http://localhost:5000
 *   - 权限:  contact:user.base:readonly, contact:user.employee:readonly (拉部门 + 邮箱可选)
 */
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();

const { getTenantAccessToken } = require('../services/feishu');
const { pool } = require('../../database/mock-db');

const FEISHU_APP_ID = process.env.FEISHU_APP_ID || '';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || '';
const FEISHU_REDIRECT_URI = process.env.FEISHU_REDIRECT_URI || 'http://localhost:5000/auth/callback';
// 登录成功后回到前端哪个 hash 页面(用 hash 是因为前端是 SPA)
const FEISHU_LOGIN_LANDING = process.env.FEISHU_LOGIN_LANDING || '/#/home';
// 飞书新版授权页(accounts 子域,v1/authorize 接受 OAuth 2.0 标准参数)
const FEISHU_AUTHORIZE_URL = 'https://accounts.feishu.cn/open-apis/authen/v1/authorize';
// v2 token 接口(OAuth 2.0 标准)
const FEISHU_TOKEN_URL = 'https://open.feishu.cn/open-apis/authen/v2/oauth/token';
const FEISHU_USER_INFO_URL = 'https://open.feishu.cn/open-apis/authen/v1/user_info';

function isFeishuConfigured() {
  return FEISHU_APP_ID && FEISHU_APP_SECRET
    && !FEISHU_APP_ID.startsWith('your-')
    && !FEISHU_APP_SECRET.startsWith('your-');
}

/** 步骤一: 跳飞书授权页 */
router.get('/auth/login', (req, res) => {
  if (!isFeishuConfigured()) {
    return res.status(500).send(
      '飞书应用未配置。请在 .env 中填入 FEISHU_APP_ID 和 FEISHU_APP_SECRET,' +
      '并在飞书开发者后台把 ' + FEISHU_REDIRECT_URI + ' 加到重定向 URL 白名单。'
    );
  }
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;
  // 可选 next 参数:登录后回到指定前端 hash 页面
  if (req.query.next) req.session.oauthNext = String(req.query.next);

  const url = FEISHU_AUTHORIZE_URL
    + `?app_id=${encodeURIComponent(FEISHU_APP_ID)}`
    + `&redirect_uri=${encodeURIComponent(FEISHU_REDIRECT_URI)}`
    + `&response_type=code`
    + `&state=${state}`;
  res.redirect(url);
});

/** 步骤二 + 三: code 换 token,拿用户信息,建立 session */
router.get('/auth/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query;
  if (error) {
    return res.status(400).send(`飞书授权失败: ${error} - ${error_description || ''}`);
  }
  if (!code) return res.status(400).send('缺少授权码');

  // 校验 state 防 CSRF
  const savedState = req.session.oauthState;
  if (!savedState || savedState !== state) {
    return res.status(400).send('state 校验失败,可能是会话过期,请重新发起登录');
  }
  delete req.session.oauthState;
  const nextHash = req.session.oauthNext || FEISHU_LOGIN_LANDING;
  delete req.session.oauthNext;

  try {
    // 步骤二: 用 code 换 user_access_token (v2 OAuth 2.0)
    const tokenResp = await axios.post(
      FEISHU_TOKEN_URL,
      {
        grant_type: 'authorization_code',
        client_id: FEISHU_APP_ID,
        client_secret: FEISHU_APP_SECRET,
        code,
        redirect_uri: FEISHU_REDIRECT_URI,
      },
      { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
    if (tokenResp.data.code && tokenResp.data.code !== 0) {
      throw new Error(`换 token 失败: ${tokenResp.data.error || tokenResp.data.msg}`);
    }
    const userAccessToken = tokenResp.data.access_token;
    if (!userAccessToken) throw new Error('返回体缺少 access_token');

    // 步骤三: 用 access_token 拉用户身份
    const userResp = await axios.get(FEISHU_USER_INFO_URL, {
      headers: { Authorization: `Bearer ${userAccessToken}` },
    });
    if (userResp.data.code !== 0) {
      throw new Error(`拉取用户信息失败: ${userResp.data.msg}`);
    }
    const info = userResp.data.data || {};

    // 拉通讯录扩展信息(部门、工位、about_me);拿不到就用空
    let department = '';
    let seatNumber = '';
    let aboutMe = '';
    if (info.open_id) {
      try {
        const tenantToken = await getTenantAccessToken();
        const contactResp = await axios.get(
          `https://open.feishu.cn/open-apis/contact/v3/users/${info.open_id}?user_id_type=open_id`,
          { headers: { Authorization: `Bearer ${tenantToken}` } }
        );
        const c = contactResp.data.data?.user || {};
        department = (c.department_ids && c.department_ids[0]) || '';
        seatNumber = c.seat_number || '';
        aboutMe = c.about_me || '';
      } catch (e) {
        console.warn('拉取通讯录扩展信息失败(非致命):', e.message);
      }
    }

    // 写入 users 表
    try {
      await pool.query(`
        INSERT INTO users (feishu_id, nickname, avatar_url, department, seat_number, about_me)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          nickname   = VALUES(nickname),
          avatar_url = VALUES(avatar_url),
          department = VALUES(department),
          seat_number= VALUES(seat_number),
          about_me   = VALUES(about_me)
      `, [info.open_id, info.name, info.avatar_url, department, seatNumber, aboutMe]);
    } catch (dbErr) {
      console.warn('写入用户信息失败(非致命):', dbErr.message);
    }

    // 建立后端 session
    req.session.user = {
      feishu_id: info.open_id,
      nickname: info.name,
      avatar_url: info.avatar_url,
      department,
      seat_number: seatNumber,
    };

    // 302 回前端 hash 路由(SPA 用 hash 就不会触发 401 拦截)
    res.redirect(nextHash);
  } catch (err) {
    console.error('飞书 OAuth 回调错误:', err.response?.data || err.message);
    res.status(500).send(`登录失败: ${err.response?.data?.msg || err.message}`);
  }
});

/** 前端探测当前登录态 */
router.get('/auth/me', (req, res) => {
  const u = req.session.user;
  if (!u) return res.json({ code: 401, msg: '未登录', data: null });
  res.json({
    code: 200, msg: 'ok',
    data: {
      feishuId: u.feishu_id,
      nickname: u.nickname,
      avatarUrl: u.avatar_url,
      department: u.department,
      seatNumber: u.seat_number,
    },
  });
});

// ========== 模拟登录(演示 / 无飞书环境用) ==========
const MOCK_SURNAMES = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎'.split('');
const MOCK_GIVEN_CHARS = '伟芳娜秀英敏静丽强磊军洋勇艳杰娟涛明超秀霞平刚桂英辉玲桂兰云鹏华雪梅林辰阳晨曦泽宇然宁欣言书泓瑞晗睿'.split('');

function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateMockName() {
  const surname = randPick(MOCK_SURNAMES);
  const nameLen = Math.random() < 0.35 ? 1 : 2; // 单名 2字 / 双名 3字
  let given = '';
  for (let i = 0; i < nameLen; i++) given += randPick(MOCK_GIVEN_CHARS);
  return surname + given;
}

function generateMockSeat() {
  const building = randPick(['A', 'B', 'C', 'D', 'E', 'F']);
  const floor = randInt(1, 17);
  const seat = String(randInt(1, 999)).padStart(3, '0');
  return `北京科技园-${building}幢-${floor}F-${seat}`;
}

/** 一键模拟登录:生成随机姓名/工位,写库 + 建 session */
router.post('/auth/mock', async (req, res) => {
  const nickname = generateMockName();
  const seatNumber = generateMockSeat();
  const feishuId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    const [result] = await pool.query(
      'INSERT INTO users (feishu_id, nickname, seat_number) VALUES (?, ?, ?)',
      [feishuId, nickname, seatNumber]
    );

    req.session.user = {
      feishu_id: feishuId,
      nickname,
      avatar_url: '',
      department: '',
      seat_number: seatNumber,
    };

    res.json({
      code: 200, msg: 'ok',
      data: {
        userId: result.insertId,
        feishuId,
        nickname,
        seatNumber,
        avatarUrl: '',
        department: '',
      },
    });
  } catch (err) {
    console.error('模拟登录错误:', err.message);
    res.json({ code: 500, msg: '登录失败', data: null });
  }
});

/** 登出:清 session */
router.post('/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ code: 200, msg: 'ok', data: null }));
});
router.get('/auth/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/#/login'));
});

module.exports = router;
