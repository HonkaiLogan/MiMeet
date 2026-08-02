/**
 * Mi搭子 - 完整Mock数据
 * 
 * 包含：用户、菜单、匹配、广场、推荐等所有虚拟数据
 * 后端对接后可直接删除此文件
 */

// ============ 用户数据 ============
const MOCK_USERS = {
  'u001': { userId: 'u001', nickname: '小米同学', avatar: './assets/avatars/28.jpg', department: '中国区', joinDate: '2025-07-01', role: '校招生', badge: '峰顶麦霸', badgeColor: 'orange' },
  'u002': { userId: 'u002', nickname: '吴同学',   avatar: './assets/avatars/4.jpg',  department: '人力资源部', joinDate: '2025-07-01', role: '校招生', badge: '摸鱼仙人', badgeColor: 'purple' },
  'u003': { userId: 'u003', nickname: '李同学',   avatar: './assets/avatars/5.jpg',  department: '手机部', joinDate: '2024-07-01', role: '社招', badge: '代码剑圣', badgeColor: 'blue' },
  'u004': { userId: 'u004', nickname: '王同学',   avatar: './assets/avatars/21.jpg', department: '新业务部', joinDate: '2026-04-01', role: '校招生', badge: '灵感猎手', badgeColor: 'cyan' },
  'u005': { userId: 'u005', nickname: '黄同学',   avatar: './assets/avatars/19.jpg', department: '中国区', joinDate: '2025-07-01', role: '校招生', badge: '食堂鉴赏家', badgeColor: 'green' },
  'u006': { userId: 'u006', nickname: '赵同学',   avatar: './assets/avatars/2.jpg',  department: '集团技术委', joinDate: '2025-04-01', role: '社招', badge: '回龙观车神', badgeColor: 'pink' },
  'u007': { userId: 'u007', nickname: '周同学',   avatar: './assets/avatars/30.jpg', department: '互联网业务部', joinDate: '2025-07-01', role: '校招生', badge: '午夜极客', badgeColor: 'purple' },
  'u008': { userId: 'u008', nickname: '张同学',   avatar: './assets/avatars/16.jpg', department: '生态链部', joinDate: '2026-01-01', role: '校招生', badge: '摄影狂魔', badgeColor: 'cyan' },
  'u009': { userId: 'u009', nickname: '陈同学',   avatar: './assets/avatars/33.jpg', department: '汽车部', joinDate: '2025-07-01', role: '校招生' },
  'u010': { userId: 'u010', nickname: '林同学',   avatar: './assets/avatars/49.jpg', department: '手机部', joinDate: '2025-07-01', role: '校招生' },
  'u011': { userId: 'u011', nickname: '刘同学',   avatar: './assets/avatars/23.jpg', department: '人力资源部', joinDate: '2025-07-01', role: '校招生' },
  'u012': { userId: 'u012', nickname: '孙同学',   avatar: './assets/avatars/27.jpg', department: '国际业务部', joinDate: '2026-04-01', role: '校招生' },
  'u013': { userId: 'u013', nickname: '郑同学',   avatar: './assets/avatars/42.jpg', department: '集团技术委', joinDate: '2025-07-01', role: '校招生' },
  'u014': { userId: 'u014', nickname: '冯同学',   avatar: './assets/avatars/6.jpg',  department: '中国区', joinDate: '2025-04-01', role: '社招' },
  'u015': { userId: 'u015', nickname: '蒋同学',   avatar: './assets/avatars/7.jpg',  department: '新业务部', joinDate: '2025-07-01', role: '校招生' },
  'u016': { userId: 'u016', nickname: '韩同学',   avatar: './assets/avatars/32.jpg', department: '天星数科', joinDate: '2026-01-01', role: '校招生' },
  'u017': { userId: 'u017', nickname: '杨同学',   avatar: './assets/avatars/1.jpg',  department: '互联网业务部', joinDate: '2025-07-01', role: '校招生' },
  'u018': { userId: 'u018', nickname: '许同学',   avatar: './assets/avatars/22.jpg', department: '手机部', joinDate: '2024-07-01', role: '社招' },
  'u019': { userId: 'u019', nickname: '何同学',   avatar: './assets/avatars/25.jpg', department: '生态链部', joinDate: '2025-07-01', role: '校招生' },
  'u020': { userId: 'u020', nickname: '吕同学',   avatar: './assets/avatars/9.jpg',  department: '手机部', joinDate: '2025-07-01', role: '校招生' },
  'u021': { userId: 'u021', nickname: '罗同学',   avatar: './assets/avatars/35.jpg', department: '人力资源部', joinDate: '2026-04-01', role: '校招生' },
  'u022': { userId: 'u022', nickname: '高同学',   avatar: './assets/avatars/39.jpg', department: '中国区', joinDate: '2025-07-01', role: '校招生' },
  'u023': { userId: 'u023', nickname: '谢同学',   avatar: './assets/avatars/17.jpg', department: '国际业务部', joinDate: '2025-04-01', role: '社招' },
  'u024': { userId: 'u024', nickname: '唐同学',   avatar: './assets/avatars/11.jpg', department: '汽车部', joinDate: '2025-07-01', role: '校招生' },
  'u025': { userId: 'u025', nickname: '邓同学',   avatar: './assets/avatars/12.jpg', department: '互联网业务部', joinDate: '2026-01-01', role: '校招生' },
  'u026': { userId: 'u026', nickname: '方同学',   avatar: './assets/avatars/37.jpg', department: '集团技术委', joinDate: '2025-07-01', role: '校招生' },
  'u027': { userId: 'u027', nickname: '钱同学',   avatar: './assets/avatars/20.jpg', department: '天星数科', joinDate: '2024-07-01', role: '社招' },
  'u028': { userId: 'u028', nickname: '秦同学',   avatar: './assets/avatars/15.jpg', department: '新业务部', joinDate: '2025-07-01', role: '校招生' },
  'u029': { userId: 'u029', nickname: '薛同学',   avatar: './assets/avatars/46.jpg', department: '生态链部', joinDate: '2025-07-01', role: '校招生' },
  'u030': { userId: 'u030', nickname: '沈同学',   avatar: './assets/avatars/36.jpg', department: '手机部', joinDate: '2026-04-01', role: '校招生' },
  'u031': { userId: 'u031', nickname: '侯同学',   avatar: './assets/avatars/41.jpg', department: '人力资源部', joinDate: '2025-07-01', role: '校招生' },
  'u032': { userId: 'u032', nickname: '龙同学',   avatar: './assets/avatars/24.jpg', department: '汽车部', joinDate: '2025-04-01', role: '社招' },
  'u033': { userId: 'u033', nickname: '江同学',   avatar: './assets/avatars/14.jpg', department: '中国区', joinDate: '2025-07-01', role: '校招生' },
  'u034': { userId: 'u034', nickname: '史同学',   avatar: './assets/avatars/43.jpg', department: '国际业务部', joinDate: '2026-01-01', role: '校招生' },
  'u035': { userId: 'u035', nickname: '潘同学',   avatar: './assets/avatars/3.jpg',  department: '集团技术委', joinDate: '2025-07-01', role: '校招生' },
  'u036': { userId: 'u036', nickname: '苏同学',   avatar: './assets/avatars/8.jpg',  department: '互联网业务部', joinDate: '2024-07-01', role: '社招' },
  'u037': { userId: 'u037', nickname: '程同学',   avatar: './assets/avatars/13.jpg', department: '手机部', joinDate: '2025-07-01', role: '校招生' },
  'u038': { userId: 'u038', nickname: '丁同学',   avatar: './assets/avatars/44.jpg', department: '天星数科', joinDate: '2025-07-01', role: '校招生' },
  'u039': { userId: 'u039', nickname: '卢同学',   avatar: './assets/avatars/48.jpg', department: '新业务部', joinDate: '2026-04-01', role: '校招生' },
  'u040': { userId: 'u040', nickname: '袁同学',   avatar: './assets/avatars/45.jpg', department: '生态链部', joinDate: '2025-07-01', role: '校招生' },
  'u041': { userId: 'u041', nickname: '夏同学',   avatar: './assets/avatars/10.png', department: '人力资源部', joinDate: '2025-04-01', role: '社招' },
  'u042': { userId: 'u042', nickname: '余同学',   avatar: './assets/avatars/40.jpg', department: '汽车部', joinDate: '2025-07-01', role: '校招生' },
  'u043': { userId: 'u043', nickname: '叶同学',   avatar: './assets/avatars/18.jpg', department: '中国区', joinDate: '2026-01-01', role: '校招生' },
  'u044': { userId: 'u044', nickname: '贺同学',   avatar: './assets/avatars/29.jpg', department: '互联网业务部', joinDate: '2025-07-01', role: '校招生' },
  'u045': { userId: 'u045', nickname: '石同学',   avatar: './assets/avatars/50.jpg', department: '国际业务部', joinDate: '2024-07-01', role: '社招' },
  'u046': { userId: 'u046', nickname: '邹同学',   avatar: './assets/avatars/34.jpg', department: '集团技术委', joinDate: '2025-07-01', role: '校招生' },
  'u047': { userId: 'u047', nickname: '覃同学',   avatar: './assets/avatars/31.jpg', department: '手机部', joinDate: '2025-07-01', role: '校招生' },
  'u048': { userId: 'u048', nickname: '梁同学',   avatar: './assets/avatars/38.jpg', department: '天星数科', joinDate: '2026-04-01', role: '校招生' },
  'u049': { userId: 'u049', nickname: '萧同学',   avatar: './assets/avatars/26.jpg', department: '生态链部', joinDate: '2025-07-01', role: '校招生' },
  'u050': { userId: 'u050', nickname: '欧同学',   avatar: './assets/avatars/47.jpg', department: '新业务部', joinDate: '2025-04-01', role: '社招' },
  'u051': { userId: 'u051', nickname: '白同学',   avatar: './assets/avatars/16.jpg', department: '人力资源部', joinDate: '2025-07-01', role: '校招生' },
  'u052': { userId: 'u052', nickname: '廖同学',   avatar: './assets/avatars/32.jpg', department: '汽车部', joinDate: '2026-01-01', role: '校招生' },
  'u053': { userId: 'u053', nickname: '崔同学',   avatar: './assets/avatars/11.jpg', department: '中国区', joinDate: '2025-07-01', role: '校招生' },
  'u054': { userId: 'u054', nickname: '康同学',   avatar: './assets/avatars/24.jpg', department: '互联网业务部', joinDate: '2024-07-01', role: '社招' },
  'u055': { userId: 'u055', nickname: '毛同学',   avatar: './assets/avatars/21.jpg', department: '国际业务部', joinDate: '2025-07-01', role: '校招生' },
  'u056': { userId: 'u056', nickname: '尹同学',   avatar: './assets/avatars/9.jpg',  department: '天星数科', joinDate: '2025-07-01', role: '校招生' },
  'u057': { userId: 'u057', nickname: '姜同学',   avatar: './assets/avatars/29.jpg', department: '集团技术委', joinDate: '2026-04-01', role: '校招生' },
  'u058': { userId: 'u058', nickname: '熊同学',   avatar: './assets/avatars/27.jpg', department: '生态链部', joinDate: '2025-07-01', role: '校招生' },
  'u059': { userId: 'u059', nickname: '魏同学',   avatar: './assets/avatars/30.jpg', department: '手机部', joinDate: '2025-07-01', role: '校招生' },
  'u060': { userId: 'u060', nickname: '彭同学',   avatar: './assets/avatars/31.jpg', department: '互联网业务部', joinDate: '2026-01-01', role: '校招生' },
  'u061': { userId: 'u061', nickname: '董同学',   avatar: './assets/avatars/32.jpg', department: '中国区', joinDate: '2025-04-01', role: '社招' },
  'u062': { userId: 'u062', nickname: '谭同学',   avatar: './assets/avatars/33.jpg', department: '人力资源部', joinDate: '2025-07-01', role: '校招生' },
  'u063': { userId: 'u063', nickname: '曾同学',   avatar: './assets/avatars/34.jpg', department: '新业务部', joinDate: '2026-04-01', role: '校招生' },
  'u064': { userId: 'u064', nickname: '贾同学',   avatar: './assets/avatars/35.jpg', department: '集团技术委', joinDate: '2025-07-01', role: '校招生' },
  'u065': { userId: 'u065', nickname: '付同学',   avatar: './assets/avatars/36.jpg', department: '天星数科', joinDate: '2025-07-01', role: '校招生' },
  'u066': { userId: 'u066', nickname: '范同学',   avatar: './assets/avatars/37.jpg', department: '汽车部', joinDate: '2024-07-01', role: '社招' },
  'u067': { userId: 'u067', nickname: '柳同学',   avatar: './assets/avatars/39.jpg', department: '国际业务部', joinDate: '2025-07-01', role: '校招生' },
  'u068': { userId: 'u068', nickname: '孔同学',   avatar: './assets/avatars/40.jpg', department: '生态链部', joinDate: '2026-01-01', role: '校招生' },
};

// ============ 用户画像数据 ============
const MOCK_PROFILES = {
  'u001': {
    lunchPreference: {
      time: '12:00',
      taste: ['清淡', '米饭'],
      budget: '20-40',
      location: '都可以',
      socialMode: '轻松聊天'
    },
    commutePreference: { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' },
    interestTags: ['AI', '产品', '旅行'], mbti: 'INTJ', constellation: '天秤座'
  },
  'u002': {
    lunchPreference: { time: '12:30', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' },
    interestTags: ['AI', '产品', '电影'], mbti: 'ENFP', constellation: '巨蟹座'
  },
  'u003': {
    lunchPreference: { time: '12:00', taste: ['米饭', '辣'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '昌平', departureTime: '08:00', transportMode: '地铁+打车' },
    interestTags: ['技术', '游戏', '运动'], mbti: 'ISTJ', constellation: '摩羯座'
  },
  'u004': {
    lunchPreference: { time: '12:30', taste: ['轻食'], budget: '40-60', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '昌平', departureTime: '08:30', transportMode: '地铁+打车' },
    interestTags: ['设计', '旅行', '摄影'], mbti: 'INFP', constellation: '双鱼座'
  },
  'u005': {
    lunchPreference: { time: '12:00', taste: ['清淡', '面食'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '昌平', departureTime: '09:00', transportMode: '顺风车' },
    interestTags: ['运营', 'AI', '音乐'], mbti: 'ESFJ', constellation: '射手座'
  },
  'u006': {
    lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '天通苑', departureTime: '08:00', transportMode: '地铁+打车' },
    interestTags: ['技术', 'AI', '游戏'], mbti: 'INTP', constellation: '白羊座'
  },
  'u007': {
    lunchPreference: { time: '12:30', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '天通苑', departureTime: '08:30', transportMode: '地铁+打车' },
    interestTags: ['产品', '运动', '电影'], mbti: 'ENFJ', constellation: '狮子座'
  },
  'u008': {
    lunchPreference: { time: '13:00', taste: ['轻食', '清淡'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '天通苑', departureTime: '09:00', transportMode: '地铁' },
    interestTags: ['设计', '音乐', '旅行'], mbti: 'ISFP', constellation: '处女座'
  },
  'u009': {
    lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '天通苑', departureTime: '09:00', transportMode: '打车' },
    interestTags: ['运营', '电影', '宠物'], mbti: 'ESFP', constellation: '天蝎座'
  },
  'u010': {
    lunchPreference: { time: '12:30', taste: ['面食', '辣'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '顺义', departureTime: '08:00', transportMode: '自驾' },
    interestTags: ['技术', 'AI', '运动'], mbti: 'ENTJ', constellation: '水瓶座'
  },
  'u011': {
    lunchPreference: { time: '12:00', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '顺义', departureTime: '08:30', transportMode: '地铁+打车' },
    interestTags: ['设计', '宠物', '旅行'], mbti: 'INFJ', constellation: '双子座'
  },
  'u012': {
    lunchPreference: { time: '12:30', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '望京', departureTime: '08:30', transportMode: '地铁+打车' },
    interestTags: ['产品', 'AI', '电影'], mbti: 'ENTP', constellation: '狮子座'
  },
  'u013': {
    lunchPreference: { time: '11:30', taste: ['辣', '面食'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '望京', departureTime: '09:00', transportMode: '地铁' },
    interestTags: ['技术', '游戏', 'AI'], mbti: 'ISTP', constellation: '摩羯座'
  },
  'u014': {
    lunchPreference: { time: '12:00', taste: ['清淡', '日料'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '望京', departureTime: '09:00', transportMode: '自驾' },
    interestTags: ['运营', '旅行', '美食'], mbti: 'ISFJ', constellation: '处女座'
  },
  'u015': {
    lunchPreference: { time: '12:30', taste: ['米饭', '辣'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '五道口', departureTime: '09:00', transportMode: '地铁' },
    interestTags: ['产品', '运动', '音乐'], mbti: 'ENFP', constellation: '白羊座'
  },
  'u016': {
    lunchPreference: { time: '13:00', taste: ['轻食', '西餐'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '五道口', departureTime: '09:00', transportMode: '骑行' },
    interestTags: ['设计', '音乐', '旅行'], mbti: 'INFP', constellation: '天秤座'
  },
  'u017': {
    lunchPreference: { time: '12:00', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '五道口', departureTime: '08:00', transportMode: '地铁+打车' },
    interestTags: ['产品', 'AI', '电影'], mbti: 'ENTJ', constellation: '巨蟹座'
  },
  'u018': {
    lunchPreference: { time: '12:00', taste: ['辣', '火锅'], budget: '40-60', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '上地', departureTime: '08:30', transportMode: '骑行' },
    interestTags: ['技术', '游戏', '运动'], mbti: 'INTJ', constellation: '射手座'
  },
  'u019': {
    lunchPreference: { time: '12:30', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '上地', departureTime: '09:00', transportMode: '自驾' },
    interestTags: ['运营', '宠物', '美食'], mbti: 'ESFJ', constellation: '双鱼座'
  },
  'u020': {
    lunchPreference: { time: '12:00', taste: ['面食', '清淡'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '上地', departureTime: '09:00', transportMode: '打车' },
    interestTags: ['技术', '音乐', '旅行'], mbti: 'ISTJ', constellation: '天蝎座'
  },
  'u021': {
    lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '西二旗', departureTime: '08:30', transportMode: '打车' },
    interestTags: ['运营', '电影', 'AI'], mbti: 'ENFJ', constellation: '水瓶座'
  },
  'u022': {
    lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '西二旗', departureTime: '09:00', transportMode: '地铁+打车' },
    interestTags: ['运营', 'AI', '游戏'], mbti: 'ESTP', constellation: '狮子座'
  },
  'u023': {
    lunchPreference: { time: '13:00', taste: ['轻食', '日料'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '西二旗', departureTime: '09:00', transportMode: '骑行' },
    interestTags: ['设计', '旅行', '宠物'], mbti: 'ISFP', constellation: '双子座'
  },
  'u024': {
    lunchPreference: { time: '12:00', taste: ['面食', '辣'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '海淀', departureTime: '09:00', transportMode: '骑行' },
    interestTags: ['技术', 'AI', '运动'], mbti: 'INTP', constellation: '摩羯座'
  },
  'u025': {
    lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '海淀', departureTime: '09:00', transportMode: '地铁' },
    interestTags: ['产品', '旅行', '电影'], mbti: 'ENFP', constellation: '天秤座'
  },
  'u026': {
    lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '海淀', departureTime: '08:30', transportMode: '打车' },
    interestTags: ['技术', '游戏', 'AI'], mbti: 'INTJ', constellation: '白羊座'
  },
  'u027': {
    lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '朝阳', departureTime: '08:30', transportMode: '地铁+打车' },
    interestTags: ['运营', '美食', '旅行'], mbti: 'ESFJ', constellation: '处女座'
  },
  'u028': {
    lunchPreference: { time: '12:30', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '朝阳', departureTime: '09:00', transportMode: '地铁' },
    interestTags: ['产品', '音乐', '电影'], mbti: 'ENFJ', constellation: '巨蟹座'
  },
  'u029': {
    lunchPreference: { time: '13:00', taste: ['轻食', '西餐'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '朝阳', departureTime: '09:00', transportMode: '打车' },
    interestTags: ['设计', '旅行', '音乐'], mbti: 'INFP', constellation: '天蝎座'
  },
  'u030': {
    lunchPreference: { time: '12:00', taste: ['辣', '面食'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '通州', departureTime: '07:30', transportMode: '地铁+打车' },
    interestTags: ['技术', 'AI', '运动'], mbti: 'ISTP', constellation: '射手座'
  },
  'u031': {
    lunchPreference: { time: '12:30', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '通州', departureTime: '08:00', transportMode: '地铁+打车' },
    interestTags: ['运营', 'AI', '宠物'], mbti: 'ENFP', constellation: '水瓶座'
  },
  'u032': {
    lunchPreference: { time: '12:00', taste: ['米饭', '辣'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '通州', departureTime: '08:30', transportMode: '地铁' },
    interestTags: ['技术', '游戏', '运动'], mbti: 'ISTJ', constellation: '双鱼座'
  },
  'u033': {
    lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '亦庄', departureTime: '08:00', transportMode: '地铁+打车' },
    interestTags: ['运营', '美食', '旅行'], mbti: 'ESFP', constellation: '狮子座'
  },
  'u034': {
    lunchPreference: { time: '12:30', taste: ['轻食', '清淡'], budget: '40-60', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '亦庄', departureTime: '08:30', transportMode: '自驾' },
    interestTags: ['产品', 'AI', '电影'], mbti: 'ENTP', constellation: '天秤座'
  },
  'u035': {
    lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '亦庄', departureTime: '09:00', transportMode: '打车' },
    interestTags: ['技术', '游戏', 'AI'], mbti: 'INTJ', constellation: '摩羯座'
  },
  'u036': {
    lunchPreference: { time: '13:00', taste: ['轻食', '日料'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '回龙观', departureTime: '08:00', transportMode: '顺风车' },
    interestTags: ['设计', '音乐', '宠物'], mbti: 'ISFP', constellation: '双子座'
  },
  'u037': {
    lunchPreference: { time: '12:00', taste: ['面食', '辣'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' },
    interestTags: ['技术', 'AI', '运动'], mbti: 'INTP', constellation: '白羊座'
  },
  'u038': {
    lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '回龙观', departureTime: '09:00', transportMode: '顺风车' },
    interestTags: ['运营', '电影', '旅行'], mbti: 'ENFJ', constellation: '天蝎座'
  },
  'u039': {
    lunchPreference: { time: '12:00', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '回龙观', departureTime: '09:00', transportMode: '地铁+打车' },
    interestTags: ['产品', 'AI', '游戏'], mbti: 'ENTJ', constellation: '射手座'
  },
  'u040': {
    lunchPreference: { time: '12:00', taste: ['辣', '面食'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '昌平', departureTime: '07:30', transportMode: '地铁+打车' },
    interestTags: ['技术', '运动', '音乐'], mbti: 'ISTP', constellation: '水瓶座'
  },
  'u041': {
    lunchPreference: { time: '12:30', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '昌平', departureTime: '08:00', transportMode: '地铁+打车' },
    interestTags: ['运营', 'AI', '宠物'], mbti: 'ESFJ', constellation: '双鱼座'
  },
  'u042': {
    lunchPreference: { time: '12:00', taste: ['米饭', '辣'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '昌平', departureTime: '08:30', transportMode: '打车' },
    interestTags: ['技术', '游戏', 'AI'], mbti: 'INTJ', constellation: '狮子座'
  },
  'u043': {
    lunchPreference: { time: '12:30', taste: ['清淡', '面食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '顺义', departureTime: '08:30', transportMode: '自驾' },
    interestTags: ['运营', '旅行', '美食'], mbti: 'ENFP', constellation: '天秤座'
  },
  'u044': {
    lunchPreference: { time: '13:00', taste: ['轻食', '西餐'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '顺义', departureTime: '09:00', transportMode: '地铁+打车' },
    interestTags: ['设计', '音乐', '电影'], mbti: 'ISFP', constellation: '摩羯座'
  },
  'u045': {
    lunchPreference: { time: '12:00', taste: ['米饭', '清淡'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '望京', departureTime: '09:00', transportMode: '地铁+打车' },
    interestTags: ['产品', 'AI', '旅行'], mbti: 'ENTP', constellation: '双子座'
  },
  'u046': {
    lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '望京', departureTime: '09:00', transportMode: '打车' },
    interestTags: ['技术', 'AI', '游戏'], mbti: 'INTP', constellation: '白羊座'
  },
  'u047': {
    lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '五道口', departureTime: '09:00', transportMode: '骑行' },
    interestTags: ['技术', '运动', '电影'], mbti: 'ISTJ', constellation: '天蝎座'
  },
  'u048': {
    lunchPreference: { time: '12:00', taste: ['清淡', '轻食'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '上地', departureTime: '09:00', transportMode: '骑行' },
    interestTags: ['运营', '美食', 'AI'], mbti: 'ESFP', constellation: '射手座'
  },
  'u049': {
    lunchPreference: { time: '13:00', taste: ['轻食', '日料'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '朝阳', departureTime: '08:00', transportMode: '地铁' },
    interestTags: ['设计', '宠物', '旅行'], mbti: 'INFJ', constellation: '水瓶座'
  },
  'u050': {
    lunchPreference: { time: '12:00', taste: ['辣', '面食'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '通州', departureTime: '08:00', transportMode: '地铁+打车' },
    interestTags: ['技术', 'AI', '运动'], mbti: 'INTJ', constellation: '双鱼座'
  },
  'u051': {
    lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '亦庄', departureTime: '08:30', transportMode: '地铁+打车' },
    interestTags: ['运营', '电影', '宠物'], mbti: 'ENFJ', constellation: '狮子座'
  },
  'u052': {
    lunchPreference: { time: '12:00', taste: ['米饭', '辣'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '西二旗', departureTime: '09:00', transportMode: '打车' },
    interestTags: ['产品', 'AI', '游戏'], mbti: 'ENTP', constellation: '天秤座'
  },
  'u053': {
    lunchPreference: { time: '12:00', taste: ['清淡', '面食'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '海淀', departureTime: '09:30', transportMode: '骑行' },
    interestTags: ['技术', '运动', '旅行'], mbti: 'ISTJ', constellation: '摩羯座'
  },
  'u054': {
    lunchPreference: { time: '12:30', taste: ['轻食', '清淡'], budget: '40-60', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '回龙观', departureTime: '08:00', transportMode: '顺风车' },
    interestTags: ['产品', '旅行', '音乐'], mbti: 'INFP', constellation: '双子座'
  },
  'u055': {
    lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '回龙观', departureTime: '08:30', transportMode: '打车' },
    interestTags: ['技术', 'AI', '游戏'], mbti: 'INTP', constellation: '白羊座'
  },
  'u056': {
    lunchPreference: { time: '13:00', taste: ['轻食', '西餐'], budget: '40-60', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '通州', departureTime: '08:30', transportMode: '地铁' },
    interestTags: ['设计', '音乐', '宠物'], mbti: 'ISFP', constellation: '天蝎座'
  },
  'u057': {
    lunchPreference: { time: '12:30', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '亦庄', departureTime: '09:00', transportMode: '打车' },
    interestTags: ['运营', 'AI', '电影'], mbti: 'ESFJ', constellation: '射手座'
  },
  'u058': {
    lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '顺义', departureTime: '09:00', transportMode: '地铁+打车' },
    interestTags: ['运营', '旅行', '美食'], mbti: 'ENFP', constellation: '水瓶座'
  },
  'u059': {
    lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '小米公寓', departureTime: '08:30', transportMode: '骑行' },
    interestTags: ['AI', '技术', '游戏'], mbti: 'INTJ', constellation: '天蝎座'
  },
  'u060': {
    lunchPreference: { time: '12:30', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '小米公寓', departureTime: '09:00', transportMode: '骑行' },
    interestTags: ['产品', 'AI', '音乐'], mbti: 'ENFJ', constellation: '双子座'
  },
  'u061': {
    lunchPreference: { time: '12:00', taste: ['轻食', '清淡'], budget: '30-50', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '小米公寓', departureTime: '08:30', transportMode: '步行' },
    interestTags: ['设计', '摄影', '旅行'], mbti: 'ISFP', constellation: '射手座'
  },
  'u062': {
    lunchPreference: { time: '13:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '小米公寓', departureTime: '09:30', transportMode: '步行' },
    interestTags: ['技术', '读书', '电影'], mbti: 'INTP', constellation: '摩羯座'
  },
  'u063': {
    lunchPreference: { time: '12:00', taste: ['辣', '米饭'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '小米公寓', departureTime: '08:00', transportMode: '骑行' },
    interestTags: ['运营', 'AI', '健身'], mbti: 'ESTP', constellation: '白羊座'
  },
  'u064': {
    lunchPreference: { time: '12:30', taste: ['轻食', '沙拉'], budget: '40-60', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '小米公寓', departureTime: '09:00', transportMode: '步行' },
    interestTags: ['产品', '旅行', '宠物'], mbti: 'INFP', constellation: '天秤座'
  },
  'u065': {
    lunchPreference: { time: '12:00', taste: ['清淡', '米饭'], budget: '20-40', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '小米公寓', departureTime: '08:30', transportMode: '骑行' },
    interestTags: ['技术', 'AI', '游戏'], mbti: 'ISTP', constellation: '狮子座'
  },
  'u066': {
    lunchPreference: { time: '12:00', taste: ['辣', '面食'], budget: '20-40', location: '都可以', socialMode: '想认识新朋友' },
    commutePreference: { homeArea: '小米公寓', departureTime: '09:00', transportMode: '步行' },
    interestTags: ['设计', '音乐', '电影'], mbti: 'ESFP', constellation: '巨蟹座'
  },
  'u067': {
    lunchPreference: { time: '13:00', taste: ['清淡', '米饭'], budget: '30-50', location: '都可以', socialMode: '安静吃饭' },
    commutePreference: { homeArea: '小米公寓', departureTime: '09:30', transportMode: '骑行' },
    interestTags: ['产品', '读书', '旅行'], mbti: 'INFJ', constellation: '处女座'
  },
  'u068': {
    lunchPreference: { time: '12:30', taste: ['轻食', '清淡'], budget: '40-60', location: '都可以', socialMode: '轻松聊天' },
    commutePreference: { homeArea: '小米公寓', departureTime: '08:30', transportMode: '步行' },
    interestTags: ['运营', 'AI', '健身'], mbti: 'ENFP', constellation: '水瓶座'
  }
};

// ============ 食堂菜单数据（来源：飞书多维表格 2026-07-31） ============
const MOCK_MENUS = [
  // === 2010餐厅·称重餐线（科技园CD栋）===
  { id: 1, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '酱牛肉', tag: '称重', price: 15.98, unit: '元/100g', spicy: 3, mealTime: '晚餐', image: 'ZOgrbFgjroyPs3xiqCUco5cwn3L' },
  { id: 2, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '盐田虾', tag: '称重', price: 15.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'DupcbTa81okI0Lx2btgcsaNcnPg' },
  { id: 3, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '卤梅花肉', tag: '称重', price: 9.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'YKYsbiZNUoHo6TxChA7ct0pgnye' },
  { id: 4, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '开胃春笋', tag: '称重', price: 9.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'OCSabslePoeH7gxhAr6cKrH2nce' },
  { id: 5, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '蒜香烤猪颈肉', tag: '称重', price: 9.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'YsjCbm8APoFFumxFIS7cMm7snXe' },
  { id: 6, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '大块肘子', tag: '称重', price: 8.98, unit: '元/100g', spicy: 3, mealTime: '晚餐', image: 'VT7UbGOs9o7CIuxmYFJcneEAnlb' },
  { id: 7, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '辣子椒麻鸡', tag: '称重', price: 7.98, unit: '元/100g', spicy: 3, mealTime: '晚餐', image: 'LwaLbEd3LooRq3xmOO8cCB5EnKg' },
  { id: 8, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '鸡腿肉', tag: '称重', price: 4.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'CwWvbziLyo9WNQxgFmscuFO1nds' },
  { id: 9, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '鸡胸肉', tag: '称重', price: 4.98, unit: '元/100g', spicy: 3, mealTime: '晚餐', image: 'JZ7xbo4YFoTIvhxPlxwc6iyunTo' },
  { id: 10, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '火龙果', tag: '称重', price: 4.48, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'YXXhb52YEox4wmxAzLdcktDmnvh' },
  { id: 11, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '鹌鹑蛋', tag: '称重', price: 4.48, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'XLaobftnXoresvxRZdhcDQhJnOg' },
  { id: 12, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '李子', tag: '称重', price: 4.48, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'KcBlbCKS5oJF7nxiNRTcywfOn5e' },
  { id: 13, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '吐司面包', tag: '称重', price: 3.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'PqwTb6vVFohrrYxwusUci3Fhnvb' },
  { id: 14, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '豆节', tag: '称重', price: 3.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'DNcjb6MfcoTf7Px5ckIckp4jnug' },
  { id: 15, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '青豌豆', tag: '称重', price: 3.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'TCndbrdW2ojpFKxYmjicUE0Vn4g' },
  { id: 16, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '鹰嘴豆', tag: '称重', price: 3.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'Fw3iboVgco7LjPxnBeLcP2aRnMc' },
  { id: 17, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '红腰豆', tag: '称重', price: 3.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: 'SHeJb7LnzoO9mJxwgE1ck9hxnqZ' },
  { id: 18, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '田园时蔬', tag: '称重', price: 2.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 19, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '烤杏鲍菇', tag: '称重', price: 2.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 20, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '菜花', tag: '称重', price: 2.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 21, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '圣女果', tag: '称重', price: 2.58, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 22, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '小黄瓜', tag: '称重', price: 2.58, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 23, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '西瓜', tag: '称重', price: 2.58, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 24, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '玉米粒', tag: '称重', price: 2.58, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 25, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '地三鲜', tag: '称重', price: 2.58, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 26, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '烤小土豆', tag: '称重', price: 1.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 27, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '南瓜', tag: '称重', price: 1.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 28, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '玉米', tag: '称重', price: 1.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 29, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '炒饭', tag: '称重', price: 1.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 30, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '炒面', tag: '称重', price: 1.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 31, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '炒粉', tag: '称重', price: 1.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 32, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '鸡蛋', tag: '称重', price: 1.98, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 33, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '大米饭', tag: '称重', price: 0.55, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },
  { id: 34, canteen: '2010餐厅·称重餐线', location: '科技园CD栋', dish: '白馒头', tag: '称重', price: 0.55, unit: '元/100g', spicy: 0, mealTime: '晚餐', image: null },

  // === 米宴北京·餐线（科技园AB栋）===
  { id: 35, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '干煸贴骨牛肉', tag: '按份', price: 15, unit: '元/份', spicy: 3, mealTime: '晚餐', image: 'U6ZWbTIaWoxHvRxlN1Jc3xKcn6d' },
  { id: 36, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '锅包鱼', tag: '按份', price: 10, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'VEAsbLSxbouNFbxiFgGc5xiNnwd' },
  { id: 37, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '卤水鸡腿', tag: '按份', price: 8, unit: '元/份', spicy: 3, mealTime: '晚餐', image: 'IPUkbjuEqodGHixRTqWcRmEan0b' },
  { id: 38, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '风味凉皮', tag: '按份', price: 6, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'SnRwbuMBKoUKcVx5g6vcpCorn1b' },
  { id: 39, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '鲜果盒', tag: '按份', price: 6, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'Y5W0bRP1Roy7GBxUcZMcyMWpnMg' },
  { id: 40, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '手撕包菜', tag: '按份', price: 5, unit: '元/份', spicy: 3, mealTime: '晚餐', image: 'PiFlb57d0on6l2xrWiMcsVyknxf' },
  { id: 41, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '肉沫茄丝', tag: '按份', price: 5, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'HxOMbx5EGonk6KxYzbhc1eJfnne' },
  { id: 42, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '鸡丝豇豆', tag: '按份', price: 5, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'G7Z3bv1MuooQ22xTILpc8JlSnR7' },
  { id: 43, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '清炒时蔬', tag: '按份', price: 3, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'MIp3bKm1toV4mhxlisDctjlVnRh' },
  { id: 44, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '红油面藕', tag: '按份', price: 3, unit: '元/份', spicy: 3, mealTime: '晚餐', image: 'YFRNbqfujo1kRwxMWSacVHxmnxh' },
  { id: 45, canteen: '米宴北京·餐线', location: '科技园AB栋', dish: '鸡蛋汤', tag: '按份', price: 0, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'HKJwbmpV4ow6Q2xX576coIPmnxg' },

  // === 星辰大海·餐线（科技园CD栋）===
  { id: 46, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '大块肘子', tag: '按份', price: 15, unit: '元/份', spicy: 3, mealTime: '晚餐', image: 'BtuSbqoPhoWdlcxm68DcmVffnUb' },
  { id: 47, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '花蛤炒小虾', tag: '按份', price: 12, unit: '元/份', spicy: 3, mealTime: '晚餐', image: 'AOxpbegdFoOwd0xNArNc66dwn4g' },
  { id: 48, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '辣子椒麻鸡', tag: '按份', price: 8, unit: '元/份', spicy: 3, mealTime: '晚餐', image: 'KGRxbN2E0onUopxi4uHcVfH9nEb' },
  { id: 49, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '鲜瓜果盒', tag: '按份', price: 6, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'EWetb3Qo0oFOJ8xPBcgce9ZCnwd' },
  { id: 50, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '地三鲜', tag: '按份', price: 5, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'Sm9WbiofMo7QyexnWFEcdBCUnWc' },
  { id: 51, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '什锦西兰花', tag: '按份', price: 5, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'G45Fb0w8toaKDuxeF4TclM8UnNh' },
  { id: 52, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '奶酪焗南瓜', tag: '按份', price: 5, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'J2eHbjWWooVTuCxH0P6cxohZn7g' },
  { id: 53, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '红豆桂花小汤圆', tag: '按份', price: 5, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'OTvObIMCCovlscxr6HCc20fOnmd' },
  { id: 54, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '清炒时蔬', tag: '按份', price: 3, unit: '元/份', spicy: 0, mealTime: '晚餐', image: 'Fw0Lb84uLo5E68xJS2acWq40ne0' },
  { id: 55, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '豆皮拌龙口', tag: '按份', price: 3, unit: '元/份', spicy: 3, mealTime: '晚餐', image: 'PQlZbXz8Voyjigxwzv0cicSSnhh' },
  { id: 56, canteen: '星辰大海·餐线', location: '科技园CD栋', dish: '柠檬红茶', tag: '按份', price: 0, unit: '元/份', spicy: 0, mealTime: '晚餐', image: null },
  { id: 57, canteen: '星辰大海·主食凉菜', location: '科技园CD栋', dish: '八宝糯米饭', tag: '按份', price: 5, unit: '元/份', spicy: 0, mealTime: '晚餐', image: null },
  { id: 58, canteen: '星辰大海·主食凉菜', location: '科技园CD栋', dish: '玉米', tag: '按份', price: 3, unit: '元/根', spicy: 0, mealTime: '晚餐', image: null },

  // === 轻食餐线·卤肉饭（科技园E栋2010）===
  { id: 59, canteen: '轻食餐线·卤肉饭', location: '科技园E栋', dish: '豉油鸡饭', tag: '按份', price: 23, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },
  { id: 60, canteen: '轻食餐线·卤肉饭', location: '科技园E栋', dish: '酱焖脊骨饭', tag: '按份', price: 23, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },
  { id: 61, canteen: '轻食餐线·卤肉饭', location: '科技园E栋', dish: '卤肉香辣浓香双拼饭', tag: '按份', price: 18.9, unit: '按份', spicy: 1, mealTime: '午餐/晚餐', image: null },
  { id: 62, canteen: '轻食餐线·卤肉饭', location: '科技园E栋', dish: '至尊香辣卤肉饭', tag: '按份', price: 15.98, unit: '按份', spicy: 3, mealTime: '午餐/晚餐', image: null },
  { id: 63, canteen: '轻食餐线·卤肉饭', location: '科技园E栋', dish: '浓香卤肉饭', tag: '按份', price: 15.98, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },

  // === 小吃岛·花车（科技园B栋）===
  { id: 64, canteen: '小吃岛·花车', location: '科技园B栋', dish: '泰式咖喱牛腩煲', tag: '按份', price: 25.8, unit: '按份', spicy: 0, mealTime: '早茶8:30-10:00', image: null },
  { id: 65, canteen: '小吃岛·花车', location: '科技园B栋', dish: '番茄鱼片', tag: '按份', price: 18.8, unit: '按份', spicy: 0, mealTime: '早茶8:30-10:00', image: null },
  { id: 66, canteen: '小吃岛·花车', location: '科技园B栋', dish: '番茄肉片', tag: '按份', price: 18.8, unit: '按份', spicy: 0, mealTime: '早茶8:30-10:00', image: null },
  { id: 67, canteen: '小吃岛·花车', location: '科技园B栋', dish: '冒菜肉片', tag: '按份', price: 18.8, unit: '按份', spicy: 3, mealTime: '早茶8:30-10:00', image: null },
  { id: 68, canteen: '小吃岛·花车', location: '科技园B栋', dish: '冒菜鱼片', tag: '按份', price: 18.8, unit: '按份', spicy: 3, mealTime: '早茶8:30-10:00', image: null },
  { id: 69, canteen: '小吃岛·花车', location: '科技园B栋', dish: '大碗黄焖鸡', tag: '按份', price: 16, unit: '按份', spicy: 0, mealTime: '早茶8:30-10:00', image: null },
  { id: 70, canteen: '小吃岛·花车', location: '科技园B栋', dish: '米饭(248g)', tag: '主食', price: 1.2, unit: '按份', spicy: 0, mealTime: '早茶8:30-10:00', image: null },
  { id: 71, canteen: '小吃岛·花车', location: '科技园B栋', dish: '米饭(150g)', tag: '主食', price: 0.9, unit: '按份', spicy: 0, mealTime: '早茶8:30-10:00', image: null },

  // === 小吃岛（科技园B栋）===
  { id: 72, canteen: '小吃岛', location: '科技园B栋', dish: '鸡蛋灌饼', tag: '小吃', price: 6, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 73, canteen: '小吃岛', location: '科技园B栋', dish: '手抓饼', tag: '小吃', price: 6, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 74, canteen: '小吃岛', location: '科技园B栋', dish: '肉蛋堡', tag: '小吃', price: 7, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 75, canteen: '小吃岛', location: '科技园B栋', dish: '肉夹馍', tag: '小吃', price: 10, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 76, canteen: '小吃岛', location: '科技园B栋', dish: '煎饼', tag: '小吃', price: 6, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 77, canteen: '小吃岛', location: '科技园B栋', dish: '烤冷面', tag: '小吃', price: 6, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 78, canteen: '小吃岛', location: '科技园B栋', dish: '烧饼夹火腿煎蛋', tag: '小吃', price: 6, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 79, canteen: '小吃岛', location: '科技园B栋', dish: '烤肠', tag: '小吃', price: 3, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 80, canteen: '小吃岛', location: '科技园B栋', dish: '固发养生粥', tag: '粥品', price: 5, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 81, canteen: '小吃岛', location: '科技园B栋', dish: '皮蛋瘦肉粥', tag: '粥品', price: 5, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 82, canteen: '小吃岛', location: '科技园B栋', dish: '豆扣串3串', tag: '小吃', price: 4, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 83, canteen: '小吃岛', location: '科技园B栋', dish: '脆皮串10串', tag: '小吃', price: 4, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 84, canteen: '小吃岛', location: '科技园B栋', dish: '淀粉肠', tag: '小吃', price: 3, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },
  { id: 85, canteen: '小吃岛', location: '科技园B栋', dish: '大饼卷一切', tag: '小吃', price: 8, unit: '按份', spicy: 0, mealTime: '10:00-21:00', image: null },

  // === 清河大排档（科技园B1C栋）===
  { id: 86, canteen: '清河大排档·麻辣烫', location: '科技园B1C栋', dish: '麻辣烫(称重)', tag: '称重', price: 3.98, unit: '元/100g', spicy: 1, mealTime: '11:30-13:30/17:30-19:30', image: null },
  { id: 87, canteen: '清河大排档·铁板', location: '科技园B1C栋', dish: '铁板什锦炒面(大)', tag: '按份', price: 16, unit: '按份', spicy: 0, mealTime: '11:30-13:30/17:30-19:30', image: null },
  { id: 88, canteen: '清河大排档·铁板', location: '科技园B1C栋', dish: '铁板什锦炒面(小)', tag: '按份', price: 14, unit: '按份', spicy: 0, mealTime: '11:30-13:30/17:30-19:30', image: null },
  { id: 89, canteen: '清河大排档·铁板', location: '科技园B1C栋', dish: '炒凉粉(大)', tag: '按份', price: 14, unit: '按份', spicy: 0, mealTime: '11:30-13:30/17:30-19:30', image: null },
  { id: 90, canteen: '清河大排档·铁板', location: '科技园B1C栋', dish: '炒凉粉(小)', tag: '按份', price: 12, unit: '按份', spicy: 0, mealTime: '11:30-13:30/17:30-19:30', image: null },
  { id: 91, canteen: '清河大排档·铁板', location: '科技园B1C栋', dish: '炒饼(大)', tag: '按份', price: 14, unit: '按份', spicy: 0, mealTime: '11:30-13:30/17:30-19:30', image: null },
  { id: 92, canteen: '清河大排档·铁板', location: '科技园B1C栋', dish: '炒饼(小)', tag: '按份', price: 12, unit: '按份', spicy: 0, mealTime: '11:30-13:30/17:30-19:30', image: null },

  // === 襄阳牛肉面档口（科技园A栋）===
  { id: 93, canteen: '襄阳牛肉面档口', location: '科技园A栋', dish: '自助水饺(称重)', tag: '称重', price: 3.36, unit: '元/100g', spicy: 0, mealTime: '午餐/晚餐', image: null },
  { id: 94, canteen: '襄阳牛肉面档口', location: '科技园A栋', dish: '襄阳牛肉面(大)', tag: '面食', price: 18, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },
  { id: 95, canteen: '襄阳牛肉面档口', location: '科技园A栋', dish: '襄阳牛肉面(小)', tag: '面食', price: 16, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },
  { id: 96, canteen: '襄阳牛肉面档口', location: '科技园A栋', dish: '襄阳牛肠面(大)', tag: '面食', price: 18, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },
  { id: 97, canteen: '襄阳牛肉面档口', location: '科技园A栋', dish: '襄阳牛肠面(小)', tag: '面食', price: 16, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },
  { id: 98, canteen: '襄阳牛肉面档口', location: '科技园A栋', dish: '鸡蛋西红柿(大)', tag: '面食', price: 14, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },
  { id: 99, canteen: '襄阳牛肉面档口', location: '科技园A栋', dish: '鸡蛋西红柿(小)', tag: '面食', price: 12, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },
  { id: 100, canteen: '襄阳牛肉面档口', location: '科技园A栋', dish: '热干面(大)', tag: '面食', price: 12, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },
  { id: 101, canteen: '襄阳牛肉面档口', location: '科技园A栋', dish: '热干面(小)', tag: '面食', price: 10, unit: '按份', spicy: 0, mealTime: '午餐/晚餐', image: null },

  // === 1988（科技园）===
  { id: 102, canteen: '1988', location: '科技园', dish: '水煮肉片', tag: '按份', price: null, unit: '按份', spicy: 3, mealTime: '午餐', image: null },
  { id: 103, canteen: '1988', location: '科技园', dish: '清蒸海鲈鱼', tag: '按份', price: null, unit: '按份', spicy: 0, mealTime: '午餐', image: null },
  { id: 104, canteen: '1988', location: '科技园', dish: '白灼生菜', tag: '按份', price: null, unit: '按份', spicy: 0, mealTime: '午餐', image: null },
  { id: 105, canteen: '1988', location: '科技园', dish: '糖醋里脊', tag: '按份', price: null, unit: '按份', spicy: 0, mealTime: '午餐', image: null },
  { id: 106, canteen: '1988', location: '科技园', dish: '魔芋啤酒鸭', tag: '按份', price: null, unit: '按份', spicy: 1, mealTime: '午餐', image: null },
  { id: 107, canteen: '1988', location: '科技园', dish: '绣球菌黄牛肉', tag: '按份', price: null, unit: '按份', spicy: 0, mealTime: '午餐', image: null }
];

const MENU_LOCATIONS = ['科技园CD栋', '科技园AB栋', '科技园B栋', '科技园B1C栋', '科技园A栋', '科技园E栋'];

// ============ 优惠信息数据 ============
const MOCK_OFFERS = [
  { id: 1, title: '新用户首单立减5元', desc: '米宴食堂', expireDate: '2026-08-31', type: 'new' },
  { id: 2, title: '周三全场8折', desc: '科技园食堂', expireDate: '2026-12-31', type: 'weekly' },
  { id: 3, title: '轻食套餐特价', desc: '二楼轻食区', expireDate: '2026-08-15', type: 'special' },
  { id: 4, title: '拼桌满3人送饮料', desc: '三楼特色区', expireDate: '2026-09-30', type: 'group' },
  { id: 5, title: '早餐7折优惠', desc: '一楼早餐区', expireDate: '2026-12-31', type: 'time' }
];

// ============ 搭子广场数据 ============
const MOCK_SQUARE_POSTS = [
  {
    id: 's001',
    userId: 'u005',
    nickname: '王同学',
    type: 'lunch',
    publishTime: '3分钟前',
    respondCount: 2,
    content: {
      time: '12:30',
      taste: ['清淡'],
      budget: '20-40',
      socialMode: '轻松聊天'
    }
  },
  {
    id: 's002',
    userId: 'u006',
    nickname: '刘同学',
    type: 'commute',
    publishTime: '10分钟前',
    respondCount: 1,
    content: {
      homeArea: '回龙观',
      departureTime: '08:30',
      transportMode: '打车'
    }
  },
  {
    id: 's003',
    userId: 'u007',
    nickname: '陈同学',
    type: 'lunch',
    publishTime: '30分钟前',
    respondCount: 0,
    content: {
      time: '12:00',
      taste: ['辣', '米饭'],
      budget: '40-60',
      socialMode: '想认识新朋友'
    }
  },
  {
    id: 's004',
    userId: 'u008',
    nickname: '张同学',
    type: 'weekend',
    publishTime: '1小时前',
    respondCount: 3,
    content: {
      activity: '爬山',
      location: '香山',
      time: '周六 9:00',
      description: '轻松路线，新手友好'
    }
  },
  {
    id: 's005',
    userId: 'u002',
    nickname: '吴同学',
    type: 'lunch',
    publishTime: '2小时前',
    respondCount: 1,
    content: {
      time: '12:30',
      taste: ['轻食'],
      budget: '30-50',
      socialMode: '想认识新朋友'
    }
  },
  {
    id: 's006',
    userId: 'u003',
    nickname: '李同学',
    type: 'commute',
    publishTime: '3小时前',
    respondCount: 0,
    content: {
      homeArea: '望京',
      departureTime: '09:00',
      transportMode: '地铁+打车'
    }
  }
];

// ============ 匹配推荐数据 ============
const MOCK_MATCH_RECOMMENDATIONS = {
  lunch: [
    { uid: 'u002', name: '吴同学', dept: '人力资源部 · 入职1年', score: 92, tags: ['清淡口味', '12:30午餐', 'AI爱好者'], reason: '你们都偏好清淡口味，午餐时间都在12:30左右，而且都对AI工具感兴趣，适合一起轻松交流。', restaurant: { name: '二楼轻食区', distance: '步行3分钟', avgPrice: '人均25-35元', rating: 4.5 }, recommendedDishes: [15, 16, 17], budgetRange: '30-50', todayOffer: 3 },
    { uid: 'u003', name: '李同学', dept: '手机部-硬件工程部 · 入职2年', score: 85, tags: ['米饭爱好者', '12:00午餐'], reason: '你们午餐时间一致，都对产品设计感兴趣，可以边吃边聊。', restaurant: { name: '一楼食堂', distance: '步行1分钟', avgPrice: '人均15-20元', rating: 4.3 }, recommendedDishes: [1, 6, 5], budgetRange: '20-40', todayOffer: null },
    { uid: 'u004', name: '王同学', dept: '手机部-新业务部 · 入职3个月', score: 78, tags: ['轻食爱好者', '想认识新朋友'], reason: '你们都喜欢轻食，而且都希望认识新朋友，适合一起探索新餐厅。', restaurant: { name: '二楼轻食区·沙拉吧', distance: '步行3分钟', avgPrice: '人均28-40元', rating: 4.4 }, recommendedDishes: [15, 17], budgetRange: '40-60', todayOffer: 1 }
  ],
  commute: [
    { uid: 'u005', name: '黄同学', dept: '中国区-电商部', score: 95, overlap: '90%', saving: '15元/天', time: '08:30', homeArea: '回龙观', transportMode: '顺风车', reason: '你们都住回龙观，出发时间一致，顺路拼车正好。', route: { from: '回龙观东大街', to: '小米科技园', waypoints: ['龙泽站', '西二旗'], distance: '12.5km', duration: '35分钟', transportMode: '顺风车' }, weeklySaving: '75元', monthlySaving: '330元', co2Saved: '2.1kg/周', timeScore: 95, routeScore: 90 },
    { uid: 'u007', name: '周同学', dept: '产品部', score: 85, overlap: '75%', saving: '10元/天', time: '09:30', homeArea: '西二旗', transportMode: '打车', reason: '西二旗到科技园路线顺，打车10分钟搞定。', route: { from: '西二旗地铁站', to: '小米科技园', waypoints: [], distance: '3.2km', duration: '12分钟', transportMode: '打车' }, weeklySaving: '50元', monthlySaving: '220元', co2Saved: '1.0kg/周', timeScore: 82, routeScore: 85 },
    { uid: 'u006', name: '赵同学', dept: '技术部', score: 78, overlap: '70%', saving: '8元/天', time: '09:00', homeArea: '上地', transportMode: '自驾', reason: '上地到科技园顺路，可以蹭个顺风车。', route: { from: '上地软件园', to: '小米科技园', waypoints: [], distance: '5.8km', duration: '20分钟', transportMode: '自驾' }, weeklySaving: '40元', monthlySaving: '176元', co2Saved: '1.2kg/周', timeScore: 75, routeScore: 78 }
  ]
};

// ============ 匹配历史数据 ============
const MOCK_MATCH_HISTORY = [
  { id: 'm001', matchedUserId: 'u002', nickname: '吴同学', type: 'lunch', matchScore: 92, status: 'accepted', createdAt: '2026-07-30 12:00:00' },
  { id: 'm002', matchedUserId: 'u005', nickname: '黄同学', type: 'commute', matchScore: 95, status: 'accepted', createdAt: '2026-07-29 08:30:00' },
  { id: 'm003', matchedUserId: 'u003', nickname: '李同学', type: 'lunch', matchScore: 85, status: 'pending', createdAt: '2026-07-28 12:00:00' }
];

// ============ 每日推荐数据 ============
const MOCK_DAILY_RECOMMENDATIONS = [
  {
    recommendation: '今日适合主动出击！推荐你找一个同样喜欢川菜的饭搭子，中午一起去吃热乎乎的麻辣香锅。',
    funTag: '🌶️ 今日宜吃辣',
    suggestedBuddy: { uid: 'u006', nickname: '赵同学', matchScore: 88, reason: '都喜欢川菜，兴趣标签相似' },
    suggestedRestaurant: { name: '三楼食堂麻辣香锅', distance: '步行2分钟', avgPrice: '30元' },
    suggestedDishes: [21, 4, 12]
  },
  {
    recommendation: '今天适合轻松社交，找一个喜欢轻食的搭子，一起聊聊最近的AI工具。',
    funTag: '🥗 今日宜轻食',
    suggestedBuddy: { uid: 'u004', nickname: '王同学', matchScore: 85, reason: '都喜欢轻食，都是校招生' },
    suggestedRestaurant: { name: '二楼轻食区', distance: '步行3分钟', avgPrice: '25元' },
    suggestedDishes: [15, 16, 17]
  },
  {
    recommendation: '今天适合认识新朋友，找一个不同部门的搭子，拓宽视野。',
    funTag: '👋 今日宜社交',
    suggestedBuddy: { uid: 'u007', nickname: '周同学', matchScore: 82, reason: '不同部门，都有旅行兴趣' },
    suggestedRestaurant: { name: '一楼食堂', distance: '步行1分钟', avgPrice: '18元' },
    suggestedDishes: [6, 1, 9]
  }
];

// ============ 每日亮点菜品 ============
const MOCK_DAILY_HIGHLIGHTS = [
  {
    id: 'h001',
    canteen: '2010餐厅·称重餐线',
    location: '科技园CD栋',
    dish: '蒜香烤猪颈肉',
    badge: '回归',
    desc: '蒜香猪颈肉回归了！蒜香浓郁外焦里嫩，手速要快',
    date: '2026-08-01'
  },
  {
    id: 'h002',
    canteen: '称重自助餐线',
    location: '科技园AB栋',
    dish: '照烧鸡腿肉',
    badge: '推荐',
    desc: '照烧鸡腿肉很好吃，汁多味美，强烈推荐',
    date: '2026-08-01'
  }
];

// ============ 导出所有Mock数据 ============
// export { MOCK_USERS, MOCK_PROFILES, MOCK_MENUS, MOCK_OFFERS, MOCK_SQUARE_POSTS, MOCK_MATCH_RECOMMENDATIONS, MOCK_MATCH_HISTORY, MOCK_DAILY_RECOMMENDATIONS, MOCK_DAILY_HIGHLIGHTS };
