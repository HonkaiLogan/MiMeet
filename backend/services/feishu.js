/**
 * 飞书 API 服务
 * - tenant_access_token 管理（自动缓存+刷新）
 * - JSAPI 签名
 * - 消息发送
 */
const axios = require('axios');
const crypto = require('crypto');

const FEISHU_APP_ID = process.env.FEISHU_APP_ID || '';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || '';

// ========== tenant_access_token 缓存 ==========
let _tokenCache = { token: '', expiresAt: 0 };

async function getTenantAccessToken() {
  if (_tokenCache.token && Date.now() < _tokenCache.expiresAt) {
    return _tokenCache.token;
  }

  const resp = await axios.post(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    { app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET }
  );

  const { tenant_access_token, expire } = resp.data;
  _tokenCache = {
    token: tenant_access_token,
    expiresAt: Date.now() + (expire - 300) * 1000, // 提前5分钟刷新
  };
  return tenant_access_token;
}

// ========== JSAPI 签名 ==========

let _jsapiTicket = { ticket: '', expiresAt: 0 };

async function getJsapiTicket() {
  if (_jsapiTicket.ticket && Date.now() < _jsapiTicket.expiresAt) {
    return _jsapiTicket.ticket;
  }

  const token = await getTenantAccessToken();
  const resp = await axios.post(
    'https://open.feishu.cn/open-apis/jssdk/ticket/get',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const { ticket, expire } = resp.data.data;
  _jsapiTicket = {
    ticket,
    expiresAt: Date.now() + (expire - 300) * 1000,
  };
  return ticket;
}

async function getJsapiConfig(url) {
  const ticket = await getJsapiTicket();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = crypto.randomBytes(16).toString('hex');

  const rawStr = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  const signature = crypto.createHash('sha1').update(rawStr).digest('hex');

  return {
    appId: FEISHU_APP_ID,
    timestamp,
    nonceStr,
    signature,
  };
}

// ========== 消息发送 ==========

async function sendMessage(receiveId, content, receiveIdType = 'open_id') {
  const token = await getTenantAccessToken();
  const resp = await axios.post(
    `https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=${receiveIdType}`,
    {
      receive_id: receiveId,
      msg_type: 'interactive',
      content: JSON.stringify(content),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return resp.data;
}

/**
 * 构建搭子邀请消息卡片
 */
function buildInviteCard(inviterName, scene, message) {
  const sceneLabel = scene === 'lunch' ? '🍜 午餐拼桌' : '🚗 通勤拼车';
  return {
    config: { wide_screen_mode: true },
    header: {
      title: { tag: 'plain_text', content: `${inviterName} 想和你做搭子！` },
      template: 'orange',
    },
    elements: [
      {
        tag: 'div',
        text: {
          tag: 'lark_md',
          content: `**场景**：${sceneLabel}\n**留言**：${message || '一起呀~'}`,
        },
      },
      {
        tag: 'action',
        actions: [
          {
            tag: 'button',
            text: { tag: 'plain_text', content: '查看详情' },
            type: 'primary',
            url: process.env.APP_URL || 'http://localhost:5000',
          },
        ],
      },
    ],
  };
}

module.exports = {
  getTenantAccessToken,
  getJsapiConfig,
  sendMessage,
  buildInviteCard,
};
