/**
 * 将 mock-data.js 中的用户数据导入 MySQL
 * 运行：node seed_mock.js
 */
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mimeet',
  waitForConnections: true,
  connectionLimit: 5,
});

// ============ 从 mock-data.js 复制过来的数据 ============

const MOCK_USERS = {
  'u001': { userId: 'u001', nickname: '小米同学', avatar: './assets/avatars/28.jpg', department: '中国区' },
  'u002': { userId: 'u002', nickname: '吴同学',   avatar: './assets/avatars/4.jpg',  department: '人力资源部' },
  'u003': { userId: 'u003', nickname: '李同学',   avatar: './assets/avatars/5.jpg',  department: '手机部' },
  'u004': { userId: 'u004', nickname: '王同学',   avatar: './assets/avatars/21.jpg', department: '新业务部' },
  'u005': { userId: 'u005', nickname: '黄同学',   avatar: './assets/avatars/19.jpg', department: '中国区' },
  'u006': { userId: 'u006', nickname: '赵同学',   avatar: './assets/avatars/2.jpg',  department: '集团技术委' },
  'u007': { userId: 'u007', nickname: '周同学',   avatar: './assets/avatars/30.jpg', department: '互联网业务部' },
  'u008': { userId: 'u008', nickname: '张同学',   avatar: './assets/avatars/16.jpg', department: '生态链部' },
  'u009': { userId: 'u009', nickname: '陈同学',   avatar: './assets/avatars/33.jpg', department: '汽车部' },
  'u010': { userId: 'u010', nickname: '林同学',   avatar: './assets/avatars/49.jpg', department: '手机部' },
  'u011': { userId: 'u011', nickname: '刘同学',   avatar: './assets/avatars/23.jpg', department: '人力资源部' },
  'u012': { userId: 'u012', nickname: '孙同学',   avatar: './assets/avatars/27.jpg', department: '国际业务部' },
  'u013': { userId: 'u013', nickname: '郑同学',   avatar: './assets/avatars/42.jpg', department: '集团技术委' },
  'u014': { userId: 'u014', nickname: '冯同学',   avatar: './assets/avatars/6.jpg',  department: '中国区' },
  'u015': { userId: 'u015', nickname: '蒋同学',   avatar: './assets/avatars/7.jpg',  department: '新业务部' },
  'u016': { userId: 'u016', nickname: '韩同学',   avatar: './assets/avatars/32.jpg', department: '天星数科' },
  'u017': { userId: 'u017', nickname: '杨同学',   avatar: './assets/avatars/1.jpg',  department: '互联网业务部' },
  'u018': { userId: 'u018', nickname: '许同学',   avatar: './assets/avatars/22.jpg', department: '手机部' },
  'u019': { userId: 'u019', nickname: '何同学',   avatar: './assets/avatars/25.jpg', department: '生态链部' },
  'u020': { userId: 'u020', nickname: '吕同学',   avatar: './assets/avatars/9.jpg',  department: '手机部' },
  'u021': { userId: 'u021', nickname: '罗同学',   avatar: './assets/avatars/35.jpg', department: '人力资源部' },
  'u022': { userId: 'u022', nickname: '宋同学',   avatar: './assets/avatars/11.jpg', department: '新业务部' },
  'u023': { userId: 'u023', nickname: '徐同学',   avatar: './assets/avatars/44.jpg', department: '天星数科' },
  'u024': { userId: 'u024', nickname: '方同学',   avatar: './assets/avatars/13.jpg', department: '集团技术委' },
  'u025': { userId: 'u025', nickname: '邓同学',   avatar: './assets/avatars/14.jpg', department: '国际业务部' },
  'u026': { userId: 'u026', nickname: '曹同学',   avatar: './assets/avatars/15.jpg', department: '汽车部' },
  'u027': { userId: 'u027', nickname: '彭同学',   avatar: './assets/avatars/17.jpg', department: '中国区' },
  'u028': { userId: 'u028', nickname: '卢同学',   avatar: './assets/avatars/18.jpg', department: '互联网业务部' },
  'u029': { userId: 'u029', nickname: '谢同学',   avatar: './assets/avatars/20.jpg', department: '生态链部' },
  'u030': { userId: 'u030', nickname: '邹同学',   avatar: './assets/avatars/26.jpg', department: '集团技术委' },
  'u031': { userId: 'u031', nickname: '沈同学',   avatar: './assets/avatars/29.jpg', department: '手机部' },
  'u032': { userId: 'u032', nickname: '钱同学',   avatar: './assets/avatars/31.jpg', department: '新业务部' },
  'u033': { userId: 'u033', nickname: '秦同学',   avatar: './assets/avatars/34.jpg', department: '汽车部' },
  'u034': { userId: 'u034', nickname: '胡同学',   avatar: './assets/avatars/36.jpg', department: '天星数科' },
  'u035': { userId: 'u035', nickname: '尹同学',   avatar: './assets/avatars/37.jpg', department: '国际业务部' },
  'u036': { userId: 'u036', nickname: '薛同学',   avatar: './assets/avatars/38.jpg', department: '人力资源部' },
  'u037': { userId: 'u037', nickname: '江同学',   avatar: './assets/avatars/39.jpg', department: '集团技术委' },
  'u038': { userId: 'u038', nickname: '叶同学',   avatar: './assets/avatars/40.jpg', department: '中国区' },
  'u039': { userId: 'u039', nickname: '程同学',   avatar: './assets/avatars/41.jpg', department: '手机部' },
  'u040': { userId: 'u040', nickname: '苏同学',   avatar: './assets/avatars/43.jpg', department: '互联网业务部' },
  'u041': { userId: 'u041', nickname: '潘同学',   avatar: './assets/avatars/45.jpg', department: '生态链部' },
  'u042': { userId: 'u042', nickname: '吴同学2',  avatar: './assets/avatars/46.jpg', department: '汽车部' },
  'u043': { userId: 'u043', nickname: '傅同学',   avatar: './assets/avatars/47.jpg', department: '新业务部' },
  'u044': { userId: 'u044', nickname: '蔡同学',   avatar: './assets/avatars/48.jpg', department: '天星数科' },
  'u045': { userId: 'u045', nickname: '魏同学',   avatar: './assets/avatars/50.jpg', department: '国际业务部' },
  'u046': { userId: 'u046', nickname: '贾同学',   avatar: './assets/avatars/3.jpg',  department: '集团技术委' },
  'u047': { userId: 'u047', nickname: '丁同学',   avatar: './assets/avatars/8.jpg',  department: '中国区' },
  'u048': { userId: 'u048', nickname: '白同学',   avatar: './assets/avatars/10.jpg', department: '手机部' },
  'u049': { userId: 'u049', nickname: '武同学',   avatar: './assets/avatars/12.jpg', department: '人力资源部' },
  'u050': { userId: 'u050', nickname: '高同学',   avatar: './assets/avatars/24.jpg', department: '互联网业务部' },
  'u051': { userId: 'u051', nickname: '戴同学',   avatar: './assets/avatars/51.jpg', department: '生态链部' },
  'u052': { userId: 'u052', nickname: '莫同学',   avatar: './assets/avatars/52.jpg', department: '汽车部' },
  'u053': { userId: 'u053', nickname: '孔同学',   avatar: './assets/avatars/53.jpg', department: '新业务部' },
  'u054': { userId: 'u054', nickname: '龚同学',   avatar: './assets/avatars/54.jpg', department: '天星数科' },
  'u055': { userId: 'u055', nickname: '华同学',   avatar: './assets/avatars/55.jpg', department: '国际业务部' },
  'u056': { userId: 'u056', nickname: '夏同学',   avatar: './assets/avatars/56.jpg', department: '集团技术委' },
  'u057': { userId: 'u057', nickname: '黎同学',   avatar: './assets/avatars/57.jpg', department: '中国区' },
  'u058': { userId: 'u058', nickname: '涂同学',   avatar: './assets/avatars/58.jpg', department: '手机部' },
};

const MOCK_PROFILES = {
  'u001': { lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' }, interestTags: ['AI', '产品', '旅行'] },
  'u002': { lunchPreference: { time: '12:30', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' }, interestTags: ['AI', '产品', '电影'] },
  'u003': { lunchPreference: { time: '12:00', taste: ['米饭', '辣'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '昌平', departureTime: '08:00', transportMode: '地铁+打车' }, interestTags: ['技术', '游戏', '运动'] },
  'u004': { lunchPreference: { time: '12:30', taste: ['轻食'], budget: '40-60', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '昌平', departureTime: '08:30', transportMode: '地铁+打车' }, interestTags: ['设计', '旅行', '摄影'] },
  'u005': { lunchPreference: { time: '12:00', taste: ['清淡', '面食'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '昌平', departureTime: '09:00', transportMode: '顺风车' }, interestTags: ['运营', 'AI', '音乐'] },
  'u006': { lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '天通苑', departureTime: '08:00', transportMode: '地铁+打车' }, interestTags: ['技术', 'AI', '游戏'] },
  'u007': { lunchPreference: { time: '12:30', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '天通苑', departureTime: '08:30', transportMode: '地铁+打车' }, interestTags: ['产品', '运动', '电影'] },
  'u008': { lunchPreference: { time: '13:00', taste: ['轻食', '清淡'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '天通苑', departureTime: '09:00', transportMode: '地铁' }, interestTags: ['设计', '音乐', '旅行'] },
  'u009': { lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '天通苑', departureTime: '09:00', transportMode: '打车' }, interestTags: ['运营', '电影', '宠物'] },
  'u010': { lunchPreference: { time: '12:30', taste: ['面食', '辣'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '顺义', departureTime: '08:00', transportMode: '自驾' }, interestTags: ['技术', 'AI', '运动'] },
  'u011': { lunchPreference: { time: '12:00', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '顺义', departureTime: '08:30', transportMode: '地铁+打车' }, interestTags: ['设计', '宠物', '旅行'] },
  'u012': { lunchPreference: { time: '12:30', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '望京', departureTime: '08:30', transportMode: '地铁+打车' }, interestTags: ['产品', 'AI', '电影'] },
  'u013': { lunchPreference: { time: '11:30', taste: ['辣', '面食'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '望京', departureTime: '09:00', transportMode: '地铁' }, interestTags: ['技术', '游戏', 'AI'] },
  'u014': { lunchPreference: { time: '12:00', taste: ['清淡', '日料'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '望京', departureTime: '09:00', transportMode: '自驾' }, interestTags: ['运营', '旅行', '美食'] },
  'u015': { lunchPreference: { time: '12:30', taste: ['米饭', '辣'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '五道口', departureTime: '09:00', transportMode: '地铁' }, interestTags: ['产品', '运动', '音乐'] },
  'u016': { lunchPreference: { time: '13:00', taste: ['轻食', '西餐'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '五道口', departureTime: '09:00', transportMode: '骑行' }, interestTags: ['设计', '音乐', '旅行'] },
  'u017': { lunchPreference: { time: '12:00', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '五道口', departureTime: '08:00', transportMode: '地铁+打车' }, interestTags: ['产品', 'AI', '电影'] },
  'u018': { lunchPreference: { time: '12:00', taste: ['辣', '火锅'], budget: '40-60', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '上地', departureTime: '08:30', transportMode: '骑行' }, interestTags: ['技术', '游戏', '运动'] },
  'u019': { lunchPreference: { time: '12:30', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '上地', departureTime: '09:00', transportMode: '自驾' }, interestTags: ['运营', '宠物', '美食'] },
  'u020': { lunchPreference: { time: '12:00', taste: ['面食', '清淡'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '上地', departureTime: '09:00', transportMode: '打车' }, interestTags: ['技术', '音乐', '旅行'] },
  'u021': { lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '西二旗', departureTime: '08:30', transportMode: '打车' }, interestTags: ['运营', '电影', 'AI'] },
  'u022': { lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '西二旗', departureTime: '09:00', transportMode: '地铁+打车' }, interestTags: ['运营', 'AI', '游戏'] },
  'u023': { lunchPreference: { time: '13:00', taste: ['轻食', '日料'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '西二旗', departureTime: '09:00', transportMode: '骑行' }, interestTags: ['设计', '旅行', '宠物'] },
  'u024': { lunchPreference: { time: '12:00', taste: ['面食', '辣'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '海淀', departureTime: '09:00', transportMode: '骑行' }, interestTags: ['技术', 'AI', '运动'] },
  'u025': { lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '海淀', departureTime: '09:00', transportMode: '地铁' }, interestTags: ['产品', '旅行', '电影'] },
  'u026': { lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '海淀', departureTime: '08:30', transportMode: '打车' }, interestTags: ['技术', '游戏', 'AI'] },
  'u027': { lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '朝阳', departureTime: '08:30', transportMode: '地铁+打车' }, interestTags: ['运营', '美食', '旅行'] },
  'u028': { lunchPreference: { time: '12:30', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '朝阳', departureTime: '09:00', transportMode: '地铁' }, interestTags: ['产品', '音乐', '电影'] },
  'u029': { lunchPreference: { time: '13:00', taste: ['轻食', '西餐'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '朝阳', departureTime: '09:00', transportMode: '打车' }, interestTags: ['设计', '旅行', '音乐'] },
  'u030': { lunchPreference: { time: '12:00', taste: ['辣', '面食'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '通州', departureTime: '07:30', transportMode: '地铁+打车' }, interestTags: ['技术', 'AI', '运动'] },
  'u031': { lunchPreference: { time: '12:30', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '通州', departureTime: '08:00', transportMode: '地铁+打车' }, interestTags: ['运营', 'AI', '宠物'] },
  'u032': { lunchPreference: { time: '12:00', taste: ['米饭', '辣'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '通州', departureTime: '08:30', transportMode: '地铁' }, interestTags: ['技术', '游戏', '运动'] },
  'u033': { lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '亦庄', departureTime: '08:00', transportMode: '地铁+打车' }, interestTags: ['运营', '美食', '旅行'] },
  'u034': { lunchPreference: { time: '12:30', taste: ['轻食', '清淡'], budget: '40-60', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '亦庄', departureTime: '08:30', transportMode: '自驾' }, interestTags: ['产品', 'AI', '电影'] },
  'u035': { lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '亦庄', departureTime: '09:00', transportMode: '打车' }, interestTags: ['技术', '游戏', 'AI'] },
  'u036': { lunchPreference: { time: '13:00', taste: ['轻食', '日料'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '回龙观', departureTime: '08:00', transportMode: '顺风车' }, interestTags: ['设计', '音乐', '宠物'] },
  'u037': { lunchPreference: { time: '12:00', taste: ['面食', '辣'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' }, interestTags: ['技术', 'AI', '运动'] },
  'u038': { lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '回龙观', departureTime: '09:00', transportMode: '顺风车' }, interestTags: ['运营', '电影', '旅行'] },
  'u039': { lunchPreference: { time: '12:00', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '回龙观', departureTime: '09:00', transportMode: '地铁+打车' }, interestTags: ['产品', 'AI', '游戏'] },
  'u040': { lunchPreference: { time: '12:00', taste: ['辣', '面食'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '昌平', departureTime: '07:30', transportMode: '地铁+打车' }, interestTags: ['技术', '运动', '音乐'] },
  'u041': { lunchPreference: { time: '12:30', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '昌平', departureTime: '08:00', transportMode: '地铁+打车' }, interestTags: ['运营', 'AI', '宠物'] },
  'u042': { lunchPreference: { time: '12:00', taste: ['米饭', '辣'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '昌平', departureTime: '08:30', transportMode: '打车' }, interestTags: ['技术', '游戏', 'AI'] },
  'u043': { lunchPreference: { time: '12:30', taste: ['清淡', '面食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '顺义', departureTime: '08:30', transportMode: '自驾' }, interestTags: ['运营', '旅行', '美食'] },
  'u044': { lunchPreference: { time: '13:00', taste: ['轻食', '西餐'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '顺义', departureTime: '09:00', transportMode: '地铁+打车' }, interestTags: ['设计', '音乐', '电影'] },
  'u045': { lunchPreference: { time: '12:00', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '望京', departureTime: '09:00', transportMode: '地铁+打车' }, interestTags: ['产品', 'AI', '旅行'] },
  'u046': { lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '望京', departureTime: '09:00', transportMode: '打车' }, interestTags: ['技术', 'AI', '游戏'] },
  'u047': { lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '五道口', departureTime: '09:00', transportMode: '骑行' }, interestTags: ['技术', '运动', '电影'] },
  'u048': { lunchPreference: { time: '12:00', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '上地', departureTime: '09:00', transportMode: '骑行' }, interestTags: ['运营', '美食', 'AI'] },
  'u049': { lunchPreference: { time: '13:00', taste: ['轻食', '日料'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '朝阳', departureTime: '08:00', transportMode: '地铁' }, interestTags: ['设计', '宠物', '旅行'] },
  'u050': { lunchPreference: { time: '12:00', taste: ['辣', '面食'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '通州', departureTime: '08:00', transportMode: '地铁+打车' }, interestTags: ['技术', 'AI', '运动'] },
  'u051': { lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '亦庄', departureTime: '08:30', transportMode: '地铁+打车' }, interestTags: ['运营', '电影', '宠物'] },
  'u052': { lunchPreference: { time: '12:00', taste: ['米饭', '辣'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '西二旗', departureTime: '09:00', transportMode: '打车' }, interestTags: ['产品', 'AI', '游戏'] },
  'u053': { lunchPreference: { time: '12:00', taste: ['清淡', '面食'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '海淀', departureTime: '09:00', transportMode: '骑行' }, interestTags: ['技术', '运动', '旅行'] },
  'u054': { lunchPreference: { time: '12:30', taste: ['轻食', '清淡'], budget: '40-60', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '回龙观', departureTime: '08:00', transportMode: '顺风车' }, interestTags: ['产品', '旅行', '音乐'] },
  'u055': { lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' }, interestTags: ['技术', 'AI', '游戏'] },
  'u056': { lunchPreference: { time: '13:00', taste: ['轻食', '西餐'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' }, commutePreference: { homeArea: '通州', departureTime: '08:30', transportMode: '地铁' }, interestTags: ['设计', '音乐', '宠物'] },
  'u057': { lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' }, commutePreference: { homeArea: '亦庄', departureTime: '09:00', transportMode: '打车' }, interestTags: ['运营', 'AI', '电影'] },
  'u058': { lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' }, commutePreference: { homeArea: '顺义', departureTime: '09:00', transportMode: '地铁+打车' }, interestTags: ['运营', '旅行', '美食'] },
};

async function seed() {
  const conn = await pool.getConnection();
  try {
    let inserted = 0, skipped = 0;

    for (const [uid, user] of Object.entries(MOCK_USERS)) {
      const profile = MOCK_PROFILES[uid];
      if (!profile) continue;

      // upsert user
      const [existing] = await conn.query('SELECT id FROM users WHERE feishu_id = ?', [uid]);
      let dbId;
      if (existing.length > 0) {
        dbId = existing[0].id;
        await conn.query(
          'UPDATE users SET nickname=?, department=?, avatar_url=? WHERE feishu_id=?',
          [user.nickname, user.department, user.avatar, uid]
        );
        skipped++;
      } else {
        const [result] = await conn.query(
          'INSERT INTO users (feishu_id, nickname, department, avatar_url) VALUES (?,?,?,?)',
          [uid, user.nickname, user.department, user.avatar]
        );
        dbId = result.insertId;
        inserted++;
      }

      const lp = profile.lunchPreference || {};
      const cp = profile.commutePreference || {};
      const interests = JSON.stringify(profile.interestTags || []);

      // upsert lunch profile
      const [lunchEx] = await conn.query('SELECT id FROM profiles WHERE user_id=? AND scene=?', [dbId, 'lunch']);
      if (lunchEx.length > 0) {
        await conn.query(
          'UPDATE profiles SET taste_pref=?, time_pref=?, budget=?, social_pref=?, interests=?, location_pref=? WHERE user_id=? AND scene=?',
          [JSON.stringify(lp.taste || []), lp.time || '12:00', lp.budget || '20-40', lp.socialMode || '轻松聊天', interests, lp.location || '都可以', dbId, 'lunch']
        );
      } else {
        await conn.query(
          'INSERT INTO profiles (user_id, scene, taste_pref, time_pref, budget, social_pref, interests, location_pref) VALUES (?,?,?,?,?,?,?,?)',
          [dbId, 'lunch', JSON.stringify(lp.taste || []), lp.time || '12:00', lp.budget || '20-40', lp.socialMode || '轻松聊天', interests, lp.location || '都可以']
        );
      }

      // upsert commute profile
      const [commuteEx] = await conn.query('SELECT id FROM profiles WHERE user_id=? AND scene=?', [dbId, 'commute']);
      if (commuteEx.length > 0) {
        await conn.query(
          'UPDATE profiles SET commute_area=?, commute_time=?, time_pref=?, transport=?, interests=? WHERE user_id=? AND scene=?',
          [cp.homeArea || '', cp.departureTime || '08:30', cp.departureTime || '08:30', cp.transportMode || '打车', interests, dbId, 'commute']
        );
      } else {
        await conn.query(
          'INSERT INTO profiles (user_id, scene, commute_area, commute_time, time_pref, transport, interests) VALUES (?,?,?,?,?,?,?)',
          [dbId, 'commute', cp.homeArea || '', cp.departureTime || '08:30', cp.departureTime || '08:30', cp.transportMode || '打车', interests]
        );
      }
    }

    console.log(`✅ 完成：新增 ${inserted} 个用户，更新 ${skipped} 个用户`);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error('❌ 导入失败:', err.message);
  process.exit(1);
});
