/**
 * 内存 Mock 数据库 — 替代 MySQL，无需外部数据库即可运行
 * 提供与 mysql2 兼容的 pool.query() 接口
 */

// ============ 内存存储 ============
const store = {
  users: [
    { id: 1, feishu_id: 'seed_u001', nickname: '小米同学', department: '中国区-新零售部', seat_number: '北京科技园-A幢-8F-023', avatar_url: '', join_date: '2025-07-01', role: '校招生', zodiac: '天秤座', badge: '峰顶麦霸', about_me: '喜欢AI和产品设计，偶尔爬山旅行，INFP' },
    { id: 2, feishu_id: 'seed_u002', nickname: '吴同学', department: '人力资源部', seat_number: '北京科技园-B幢-5F-112', avatar_url: '', join_date: '2025-07-01', role: '校招生', zodiac: '巨蟹座', about_me: '喜欢看电影和追剧，关注AI在HR的应用，ENFJ' },
    { id: 3, feishu_id: 'seed_u003', nickname: '李同学', department: '手机部-硬件工程部', seat_number: '北京科技园-C幢-12F-045', avatar_url: '', join_date: '2024-07-01', role: '社招', zodiac: '摩羯座', about_me: '硬件工程师，喜欢打游戏和跑步，ISTJ' },
    { id: 4, feishu_id: 'seed_u004', nickname: '王同学', department: '手机部-新业务部', seat_number: '北京科技园-D幢-3F-078', avatar_url: '', join_date: '2026-04-01', role: '校招生', zodiac: '双鱼座', about_me: '做新业务探索，喜欢设计和旅行，ENFP' },
    { id: 5, feishu_id: 'seed_u005', nickname: '黄同学', department: '中国区-电商部', seat_number: '北京科技园-A幢-6F-156', avatar_url: '', join_date: '2025-07-01', role: '校招生', zodiac: '白羊座', about_me: '电商运营，喜欢运动健身和美食探店，ESTP' },
    { id: 6, feishu_id: 'seed_u006', nickname: '赵同学', department: '技术部', seat_number: '北京科技园-E幢-10F-033', avatar_url: '', join_date: '2025-04-01', role: '社招', zodiac: '天蝎座', about_me: '后端工程师，关注AI和大模型，喜欢打游戏，INTP' },
    { id: 7, feishu_id: 'seed_u007', nickname: '周同学', department: '产品部', seat_number: '北京科技园-B幢-7F-091', avatar_url: '', join_date: '2025-07-01', role: '校招生', zodiac: '射手座', about_me: '产品经理，喜欢旅行和看电影，ENTP' },
    { id: 8, feishu_id: 'seed_u008', nickname: '张同学', department: '设计部', seat_number: '北京科技园-D幢-9F-012', avatar_url: '', join_date: '2026-01-01', role: '校招生', zodiac: '水瓶座', about_me: '视觉设计师，喜欢音乐和摄影，INFJ' },
  ],
  profiles: [
    { id: 1, user_id: 1, scene: 'lunch', taste_pref: '["清淡","米饭"]', time_pref: '12:00', location_pref: '园区食堂', budget: '20-40', social_pref: '轻松聊天', interests: '["AI","产品","旅行"]', commute_area: '', commute_time: '', transport: '' },
    { id: 2, user_id: 2, scene: 'lunch', taste_pref: '["清淡","轻食"]', time_pref: '12:30', location_pref: '园区食堂', budget: '30-50', social_pref: '想认识新朋友', interests: '["AI","产品","电影"]', commute_area: '', commute_time: '', transport: '' },
    { id: 3, user_id: 2, scene: 'commute', taste_pref: '[]', time_pref: '', location_pref: '', budget: '', social_pref: '', interests: '["AI","产品","电影"]', commute_area: '回龙观', commute_time: '08:20', transport: '打车' },
    { id: 4, user_id: 3, scene: 'lunch', taste_pref: '["米饭","辣"]', time_pref: '12:00', location_pref: '园区食堂', budget: '20-40', social_pref: '安静吃饭', interests: '["技术","游戏","运动"]', commute_area: '', commute_time: '', transport: '' },
    { id: 5, user_id: 3, scene: 'commute', taste_pref: '[]', time_pref: '', location_pref: '', budget: '', social_pref: '', interests: '["技术","游戏","运动"]', commute_area: '望京', commute_time: '09:00', transport: '地铁+打车' },
    { id: 6, user_id: 4, scene: 'lunch', taste_pref: '["轻食","沙拉"]', time_pref: '12:30', location_pref: '楼下商圈', budget: '40-60', social_pref: '想认识新朋友', interests: '["设计","旅行"]', commute_area: '', commute_time: '', transport: '' },
    { id: 7, user_id: 4, scene: 'commute', taste_pref: '[]', time_pref: '', location_pref: '', budget: '', social_pref: '', interests: '["设计","旅行"]', commute_area: '天通苑', commute_time: '08:00', transport: '地铁+打车' },
    { id: 8, user_id: 5, scene: 'lunch', taste_pref: '["辣","火锅"]', time_pref: '12:00', location_pref: '一楼食堂', budget: '20-40', social_pref: '想认识新朋友', interests: '["运动","美食","旅行"]', commute_area: '', commute_time: '', transport: '' },
    { id: 9, user_id: 5, scene: 'commute', taste_pref: '[]', time_pref: '', location_pref: '', budget: '', social_pref: '', interests: '["运动","美食","旅行"]', commute_area: '回龙观', commute_time: '08:20', transport: '打车' },
    { id: 10, user_id: 6, scene: 'lunch', taste_pref: '["辣","面食"]', time_pref: '12:00', location_pref: '一楼食堂', budget: '20-40', social_pref: '轻松聊天', interests: '["技术","AI","游戏"]', commute_area: '', commute_time: '', transport: '' },
    { id: 11, user_id: 6, scene: 'commute', taste_pref: '[]', time_pref: '', location_pref: '', budget: '', social_pref: '', interests: '["技术","AI","游戏"]', commute_area: '回龙观', commute_time: '08:00', transport: '顺风车' },
    { id: 12, user_id: 7, scene: 'lunch', taste_pref: '["清淡","日料"]', time_pref: '12:30', location_pref: '二楼食堂', budget: '40-60', social_pref: '想认识新朋友', interests: '["产品","旅行","电影"]', commute_area: '', commute_time: '', transport: '' },
    { id: 13, user_id: 7, scene: 'commute', taste_pref: '[]', time_pref: '', location_pref: '', budget: '', social_pref: '', interests: '["产品","旅行","电影"]', commute_area: '天通苑', commute_time: '08:30', transport: '地铁+打车' },
    { id: 14, user_id: 8, scene: 'lunch', taste_pref: '["轻食","西餐"]', time_pref: '12:00', location_pref: '楼下商圈', budget: '40-60', social_pref: '轻松聊天', interests: '["设计","音乐","摄影"]', commute_area: '', commute_time: '', transport: '' },
  ],
  matches: [
    { id: 1, user_a_id: 1, user_b_id: 2, scene: 'lunch', score: 92, reason: '你们都偏好清淡口味，午餐时间相近', common_tags: '["清淡口味","12:30午餐","AI爱好者"]', icebreaker: '{"inviteMessage":"一起吃个饭吧~","icebreakerTopics":["最近在用什么AI工具","周末有什么安排"]}', feedback_a: 5, feedback_b: null, status: 'accepted' },
    { id: 2, user_a_id: 1, user_b_id: 5, scene: 'commute', score: 95, reason: '你们都住在回龙观，路线重合度高', common_tags: '["回龙观","打车"]', icebreaker: '{"inviteMessage":"一起拼车吧~","icebreakerTopics":["每天几点出发","用什么打车软件"]}', feedback_a: null, feedback_b: null, status: 'accepted' },
    { id: 3, user_a_id: 1, user_b_id: 3, scene: 'lunch', score: 85, reason: '午餐时间一致，都对技术感兴趣', common_tags: '["12:00午餐","米饭爱好者"]', icebreaker: '{"inviteMessage":"中午一起吃饭？","icebreakerTopics":["最近在研究什么技术"]}', feedback_a: 4, feedback_b: null, status: 'sent' },
  ],
  square_posts: [
    { id: 1, user_id: 5, scene: 'lunch', content: '{"time":"12:30","taste":["清淡"],"budget":"20-40","socialMode":"轻松聊天"}', time_pref: '12:30', status: 'open', created_at: new Date(Date.now() - 3 * 60000) },
    { id: 2, user_id: 6, scene: 'commute', content: '{"homeArea":"回龙观","departureTime":"08:30","transportMode":"打车"}', time_pref: '08:30', status: 'open', created_at: new Date(Date.now() - 10 * 60000) },
    { id: 3, user_id: 7, scene: 'lunch', content: '{"time":"12:00","taste":["辣","米饭"],"budget":"40-60","socialMode":"想认识新朋友"}', time_pref: '12:00', status: 'open', created_at: new Date(Date.now() - 30 * 60000) },
    { id: 4, user_id: 8, scene: 'weekend', content: '{"activity":"爬山","location":"香山","time":"周六 9:00","description":"轻松路线，新手友好"}', time_pref: '周六 9:00', status: 'open', created_at: new Date(Date.now() - 60 * 60000) },
    { id: 5, user_id: 2, scene: 'lunch', content: '{"time":"12:30","taste":["轻食"],"budget":"30-50","socialMode":"想认识新朋友"}', time_pref: '12:30', status: 'open', created_at: new Date(Date.now() - 120 * 60000) },
    { id: 6, user_id: 3, scene: 'commute', content: '{"homeArea":"望京","departureTime":"09:00","transportMode":"地铁+打车"}', time_pref: '09:00', status: 'open', created_at: new Date(Date.now() - 180 * 60000) },
  ],
  square_responses: [],
  invites: [],
  feedback: [],
  daily_recommend: [],
  feishu_messages: [],
};

let nextId = { users: 9, profiles: 15, matches: 4, square_posts: 7, square_responses: 1, invites: 1, feedback: 1, daily_recommend: 1, feishu_messages: 1 };

// ============ 工具函数 ============
function parseJSON(val, fallback) {
  if (!val) return fallback;
  if (Array.isArray(val) || typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

function relativeTime(dt) {
  const diff = Math.max(0, Date.now() - new Date(dt).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return '刚刚';
  if (m < 60) return `${m}分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}小时前`;
  const d = Math.floor(h / 24);
  return `${d}天前`;
}

// ============ SQL 解析与执行 ============
function executeQuery(sql, params = []) {
  const normalizedSql = sql.replace(/\s+/g, ' ').trim();
  const upperSql = normalizedSql.toUpperCase();

  // ---------- SELECT ----------
  if (upperSql.startsWith('SELECT')) {
    const result = handleSelect(normalizedSql, params);
    // 调试：对于用户查询，打印更多信息
    if (normalizedSql.includes('FROM users') && normalizedSql.includes('feishu_id')) {
      console.log('[MockDB Debug] SELECT users by feishu_id:', {
        sql: normalizedSql.substring(0, 80),
        params: params,
        resultCount: result[0] ? result[0].length : 0,
        userCount: store.users.length,
      });
    }
    return result;
  }

  // ---------- INSERT ----------
  if (upperSql.startsWith('INSERT')) {
    return handleInsert(normalizedSql, params);
  }

  // ---------- UPDATE ----------
  if (upperSql.startsWith('UPDATE')) {
    return handleUpdate(normalizedSql, params);
  }

  // ---------- CREATE TABLE ----------
  if (upperSql.startsWith('CREATE TABLE')) {
    return [[]];
  }

  console.warn('[MockDB] 未识别的 SQL:', normalizedSql.substring(0, 80));
  return [[]];
}

function handleSelect(sql, params) {
  const upperSql = sql.toUpperCase();

  // users 表查询
  if (sql.includes('FROM users') || sql.includes('from users')) {
    let results = [...store.users];

    // WHERE 条件
    if (upperSql.includes('WHERE')) {
      // feishu_id 查询 - 直接用第一个参数
      if (sql.includes('feishu_id') && params.length > 0) {
        const val = params[0];
        results = results.filter(u => u.feishu_id === val);
      }
      // id 查询
      else if (sql.includes('id = ?') && !sql.includes('user_id') && params.length > 0) {
        results = results.filter(u => u.id === Number(params[0]));
      }
    }

    // JOIN profiles
    if (sql.includes('JOIN profiles') || sql.includes('join profiles')) {
      // 返回用户+画像组合数据
      if (sql.includes('WHERE p.scene = ? AND p.user_id != ?')) {
        const sceneIdx = paramIndex(sql, 'p.scene = ?');
        const userIdx = paramIndex(sql, 'p.user_id != ?');
        const scene = params[sceneIdx];
        const excludeId = Number(params[userIdx]);

        const profileResults = store.profiles
          .filter(p => p.scene === scene && p.user_id !== excludeId)
          .map(p => {
            const user = store.users.find(u => u.id === p.user_id);
            if (!user) return null;
            return {
              ...p,
              nickname: user.nickname,
              department: user.department,
              avatar_url: user.avatar_url,
            };
          })
          .filter(Boolean);

        return [profileResults];
      }
    }

    return [results];
  }

  // profiles 表查询
  if (sql.includes('FROM profiles') || sql.includes('from profiles')) {
    let results = [...store.profiles];

    if (sql.includes('WHERE')) {
      // matching.js: WHERE p.scene = ? AND p.user_id != ?
      if (sql.includes('p.scene = ? AND p.user_id != ?')) {
        const sceneIdx = paramIndex(sql, 'p.scene = ?');
        const userIdx  = paramIndex(sql, 'p.user_id != ?');
        results = results.filter(p => p.scene === params[sceneIdx] && p.user_id !== Number(params[userIdx]));
      } else if (sql.includes('user_id = ? AND scene = ?')) {
        const userIdx  = paramIndex(sql, 'user_id = ?');
        const sceneIdx = paramIndex(sql, 'scene = ?');
        results = results.filter(p => p.user_id === Number(params[userIdx]) && p.scene === params[sceneIdx]);
      } else if (sql.includes('p.user_id = ? AND p.scene = ?')) {
        const userIdx  = paramIndex(sql, 'p.user_id = ?');
        const sceneIdx = paramIndex(sql, 'p.scene = ?');
        results = results.filter(p => p.user_id === Number(params[userIdx]) && p.scene === params[sceneIdx]);
      } else if (sql.includes('u.id = ?') || sql.includes('user_id = ?')) {
        const idx = Math.max(paramIndex(sql, 'u.id = ?'), paramIndex(sql, 'user_id = ?'));
        results = results.filter(p => p.user_id === Number(params[idx]));
      }
    }

    // JOIN users u — enrich with nickname, department, avatar_url, about_me
    if (sql.includes('JOIN users') || sql.includes('join users')) {
      results = results.map(p => {
        const user = store.users.find(u => u.id === p.user_id);
        if (!user) return p;
        return {
          ...p,
          nickname: user.nickname,
          department: user.department,
          avatar_url: user.avatar_url || '',
          about_me: user.about_me || '',
        };
      });
    }

    return [results];
  }

  // matches 表查询
  if (sql.includes('FROM matches') || sql.includes('from matches')) {
    let results = [...store.matches];

    if (sql.includes('WHERE')) {
      if (sql.includes('user_a_id = ?') && sql.includes('user_b_id = ?')) {
        // COUNT 查询
        const idxA = paramIndex(sql, 'user_a_id = ?');
        const idxB = paramIndex(sql, 'user_b_id = ?');
        const uid = Number(params[idxA]);
        results = results.filter(m => m.user_a_id === uid || m.user_b_id === uid);
      }
      if (sql.includes('id = ?') && !sql.includes('user_')) {
        const idx = paramIndex(sql, 'id = ?');
        results = results.filter(m => m.id === Number(params[idx]));
      }
    }

    // JOIN users 查询 (历史记录)
    if (sql.includes('JOIN users ua') && sql.includes('JOIN users ub')) {
      const uid = Number(params[0]);
      results = results.filter(m => m.user_a_id === uid || m.user_b_id === uid);

      // 分页
      if (sql.includes('LIMIT ?')) {
        const limitIdx = paramIndex(sql, 'LIMIT ?');
        const offsetIdx = limitIdx + 1;
        const limit = Number(params[limitIdx]);
        const offset = Number(params[offsetIdx] || 0);
        results = results.slice(offset, offset + limit);
      }

      const enriched = results.map(m => {
        const partnerId = m.user_a_id === uid ? m.user_b_id : m.user_a_id;
        const partner = store.users.find(u => u.id === partnerId);
        let icebreaker = m.icebreaker;
        if (typeof icebreaker === 'string') {
          try { icebreaker = JSON.parse(icebreaker); } catch { icebreaker = {}; }
        }
        return {
          id: m.id,
          scene: m.scene,
          score: m.score,
          status: m.status,
          created_at: m.created_at || new Date(),
          feedback_a: m.feedback_a,
          feedback_b: m.feedback_b,
          user_a_id: m.user_a_id,
          partner_id: partnerId,
          partner_name: partner ? partner.nickname : '未知',
          icebreaker: icebreaker || {},
        };
      });

      return [enriched];
    }

    return [results];
  }

  // square_posts 表查询
  if (sql.includes('FROM square_posts') || sql.includes('from square_posts')) {
    let results = store.square_posts.filter(p => p.status === 'open');

    if (sql.includes('WHERE')) {
      if (sql.includes("sp.scene = ?") || sql.includes("scene = ?")) {
        const idx = params.length === 1 ? 0 : (sql.includes('sp.scene = ?') ? paramIndex(sql, 'sp.scene = ?') : paramIndex(sql, 'scene = ?'));
        results = results.filter(p => p.scene === params[idx]);
      }
    }

    // 带用户信息的查询
    if (sql.includes('JOIN users u')) {
      const enriched = results.map(p => {
        const user = store.users.find(u => u.id === p.user_id);
        const respondCount = store.square_responses.filter(r => r.post_id === p.id).length;
        return {
          id: p.id,
          user_id: p.user_id,
          scene: p.scene,
          content: p.content,
          time_pref: p.time_pref,
          created_at: p.created_at,
          nickname: user ? user.nickname : '匿名',
          avatar_url: user ? user.avatar_url : '',
          respond_count: respondCount,
        };
      });

      // 排序
      enriched.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // 分页
      const limitIdx = paramIndex(sql, 'LIMIT ?');
      if (limitIdx >= 0) {
        const limit = Number(params[limitIdx]);
        const offset = Number(params[limitIdx + 1] || 0);
        return [enriched.slice(offset, offset + limit)];
      }

      return [enriched];
    }

    // COUNT 查询
    if (sql.includes('COUNT(*)')) {
      return [[{ n: results.length }]];
    }

    return [results];
  }

  // square_responses 表查询
  if (sql.includes('FROM square_responses') || sql.includes('from square_responses')) {
    return [[store.square_responses]];
  }

  // daily_recommend 表查询
  if (sql.includes('FROM daily_recommend') || sql.includes('from daily_recommend')) {
    let results = [...store.daily_recommend];

    if (sql.includes('WHERE')) {
      if (sql.includes('u.feishu_id = ?') && sql.includes('dr.date = ?')) {
        const uidIdx = paramIndex(sql, 'u.feishu_id = ?');
        const dateIdx = paramIndex(sql, 'dr.date = ?');
        const user = store.users.find(u => u.feishu_id === params[uidIdx]);
        if (user) {
          results = results.filter(r => r.user_id === user.id && r.date === params[dateIdx]);
        } else {
          results = [];
        }
      }
    }

    return [results];
  }

  // offers 表查询
  if (sql.includes('FROM offers') || sql.includes('from offers')) {
    return [[
      { id: 1, title: '新用户首单立减5元', desc: '米宴食堂', merchant: '米宴', discount: '5元', expireDate: '2026-08-31', type: 'active' },
      { id: 2, title: '周三全场8折', desc: '科技园食堂', merchant: '科技园', discount: '8折', expireDate: '2026-12-31', type: 'active' },
      { id: 3, title: '轻食套餐特价', desc: '二楼轻食区', merchant: '轻食区', discount: '特价', expireDate: '2026-08-15', type: 'active' },
      { id: 4, title: '拼桌满3人送饮料', desc: '三楼特色区', merchant: '特色区', discount: '送饮料', expireDate: '2026-09-30', type: 'active' },
      { id: 5, title: '早餐7折优惠', desc: '一楼早餐区', merchant: '早餐区', discount: '7折', expireDate: '2026-12-31', type: 'active' },
    ]];
  }

  // menu 表查询
  if (sql.includes('FROM menu') || sql.includes('from menu')) {
    const { MOCK_MENUS } = require('./mock-data-full');
    let results = [...MOCK_MENUS];

    if (sql.includes('WHERE') && sql.includes('tag = ?')) {
      const idx = paramIndex(sql, 'tag = ?');
      results = results.filter(m => m.tag === params[idx]);
    }

    return [results];
  }

  // feishu_messages 表查询
  if (sql.includes('FROM feishu_messages') || sql.includes('from feishu_messages')) {
    const results = [...store.feishu_messages].sort((a, b) => b.id - a.id);
    const limitMatch = sql.match(/LIMIT\s*\?/i);
    if (limitMatch) {
      const idx = paramIndex(sql, 'LIMIT ?');
      return [results.slice(0, Number(params[idx]))];
    }
    return [results];
  }

  console.warn('[MockDB] 未识别的 SELECT:', sql.substring(0, 100));
  return [[]];
}

function handleInsert(sql, params) {
  const upperSql = sql.toUpperCase();

  // INSERT IGNORE INTO users
  if (sql.includes('INTO users') && upperSql.includes('IGNORE')) {
    const feishuId = params[0];
    const existing = store.users.find(u => u.feishu_id === feishuId);
    if (!existing) {
      store.users.push({
        id: nextId.users++,
        feishu_id: feishuId,
        nickname: params[1] || '',
        avatar_url: params[2] || '',
        department: params[3] || '',
        seat_number: params[4] || '',
        about_me: params[5] || '',
      });
    }
    return [{ insertId: existing ? existing.id : nextId.users - 1 }];
  }

  // INSERT INTO users (模拟登录)
  if (sql.includes('INTO users') && !upperSql.includes('IGNORE')) {
    const newUser = {
      id: nextId.users++,
      feishu_id: params[0],
      nickname: params[1] || '',
      avatar_url: params[2] || '',
      department: params[3] || '',
      seat_number: params[4] || '',
      about_me: params[5] || '',
      join_date: params[6] || null,
      role: params[7] || '',
      zodiac: params[8] || '',
    };
    store.users.push(newUser);
    return [{ insertId: newUser.id }];
  }

  // INSERT INTO profiles
  if (sql.includes('INTO profiles')) {
    const newProfile = {
      id: nextId.profiles++,
      user_id: Number(params[0]),
      scene: params[1],
      taste_pref: params[2],
      time_pref: params[3],
      location_pref: params[4],
      budget: params[5],
      social_pref: params[6],
      interests: params[7],
      commute_area: params[8] || '',
      commute_time: params[9] || '',
      transport: params[10] || '',
    };
    store.profiles.push(newProfile);
    return [{ insertId: newProfile.id }];
  }

  // INSERT INTO matches
  if (sql.includes('INTO matches')) {
    const newMatch = {
      id: nextId.matches++,
      user_a_id: Number(params[0]),
      user_b_id: Number(params[1]),
      scene: params[2],
      score: Number(params[3]) || 0,
      reason: params[4] || '',
      common_tags: params[5] || '[]',
      icebreaker: params[6] || '{}',
      feedback_a: null,
      feedback_b: null,
      status: 'pending',
      created_at: new Date(),
    };
    store.matches.push(newMatch);
    return [{ insertId: newMatch.id }];
  }

  // INSERT INTO square_posts
  if (sql.includes('INTO square_posts')) {
    const newPost = {
      id: nextId.square_posts++,
      user_id: Number(params[0]),
      scene: params[1],
      content: params[2],
      time_pref: params[3],
      status: 'open',
      created_at: new Date(),
    };
    store.square_posts.push(newPost);
    return [{ insertId: newPost.id }];
  }

  // INSERT INTO square_responses
  if (sql.includes('INTO square_responses')) {
    const postId = Number(params[0]);
    const userId = Number(params[1]);
    const existing = store.square_responses.find(r => r.post_id === postId && r.user_id === userId);
    if (existing) {
      throw new Error('Duplicate entry');
    }
    const newResponse = { id: nextId.square_responses++, post_id: postId, user_id: userId, message: params[2] || '', created_at: new Date() };
    store.square_responses.push(newResponse);
    return [{ insertId: newResponse.id }];
  }

  // INSERT INTO invites
  if (sql.includes('INTO invites')) {
    const newInvite = {
      id: nextId.invites++,
      match_id: params[0] ? Number(params[0]) : null,
      from_user_id: Number(params[1]),
      to_user_id: Number(params[2]),
      scene: params[3],
      message: params[4],
      status: 'sent',
      created_at: new Date(),
    };
    store.invites.push(newInvite);
    return [{ insertId: newInvite.id }];
  }

  // INSERT INTO daily_recommend
  if (sql.includes('INTO daily_recommend')) {
    const newRec = { id: nextId.daily_recommend++, user_id: Number(params[0]), date: params[1], content: params[2], created_at: new Date() };
    store.daily_recommend.push(newRec);
    return [{ insertId: newRec.id }];
  }

  // INSERT INTO feishu_messages
  if (sql.includes('INTO feishu_messages')) {
    const msgId = params[0];
    const existing = store.feishu_messages.find(m => m.msg_id === msgId);
    if (existing) throw new Error('Duplicate entry');
    const newMsg = {
      id: nextId.feishu_messages++,
      msg_id: msgId,
      chat_id: params[1],
      chat_type: params[2],
      sender_open_id: params[3],
      sender_id_type: params[4],
      msg_type: params[5],
      content: params[6],
      mentions: params[7],
      root_id: params[8],
      parent_id: params[9],
      create_time: params[10],
      received_at: new Date(),
    };
    store.feishu_messages.push(newMsg);
    return [{ insertId: newMsg.id }];
  }

  console.warn('[MockDB] 未识别的 INSERT:', sql.substring(0, 80));
  return [{ insertId: 0 }];
}

function handleUpdate(sql, params) {
  // UPDATE matches SET feedback_a/feedback_b
  if (sql.includes('UPDATE matches')) {
    if (sql.includes('SET feedback_a = ?') || sql.includes('SET feedback_b = ?')) {
      const matchId = Number(params[1]);
      const match = store.matches.find(m => m.id === matchId);
      if (match) {
        if (sql.includes('feedback_a')) match.feedback_a = Number(params[0]);
        else match.feedback_b = Number(params[0]);
      }
      return [{ affectedRows: match ? 1 : 0 }];
    }
    if (sql.includes('SET status = ?')) {
      const matchId = Number(params[1]);
      const match = store.matches.find(m => m.id === matchId);
      if (match) match.status = params[0];
      return [{ affectedRows: match ? 1 : 0 }];
    }
  }

  // UPDATE users SET badge = ?
  if (sql.includes('UPDATE users') && sql.includes('SET badge = ?')) {
    const feishuId = params[1];
    const user = store.users.find(u => u.feishu_id === feishuId);
    if (user) { user.badge = params[0]; return [{ affectedRows: 1 }]; }
    return [{ affectedRows: 0 }];
  }

  // UPDATE square_posts SET status = 'expired'
  if (sql.includes('UPDATE square_posts')) {
    const before = store.square_posts.filter(p => p.status === 'open').length;
    store.square_posts.forEach(p => { if (p.status === 'open') p.status = 'expired'; });
    return [{ affectedRows: before }];
  }

  // ON DUPLICATE KEY UPDATE (profiles)
  if (sql.includes('ON DUPLICATE KEY UPDATE')) {
    // 已在 INSERT 处理中处理
    return [{ affectedRows: 1 }];
  }

  console.warn('[MockDB] 未识别的 UPDATE:', sql.substring(0, 80));
  return [{ affectedRows: 0 }];
}

// 辅助：找某个条件对应的 ? 是第几个参数（从0开始）
function paramIndex(sql, pattern) {
  const prefix = pattern.split('?')[0].toUpperCase().trim();
  const segments = sql.split('?');
  let paramPos = 0;
  for (let i = 0; i < segments.length - 1; i++) {
    if (segments[i].toUpperCase().includes(prefix)) {
      return paramPos;
    }
    paramPos++;
  }
  return 0;
}

// 辅助：找第N个 ? 的参数值
function nthParam(sql, params, n) {
  return params[n];
}

// ============ Pool 接口 ============
const pool = {
  async query(sql, params = []) {
    try {
      const result = executeQuery(sql, params);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async getConnection() {
    return {
      async query(sql, params = []) {
        return pool.query(sql, params);
      },
      release() {},
      async beginTransaction() {},
      async commit() {},
      async rollback() {},
    };
  },
};

async function initDB() {
  console.log('[OK] Mock 数据库初始化完成（内存模式，无需 MySQL）');
  console.log(`     用户: ${store.users.length} | 画像: ${store.profiles.length} | 匹配: ${store.matches.length} | 广场: ${store.square_posts.length}`);
}

module.exports = { pool, initDB, store };
