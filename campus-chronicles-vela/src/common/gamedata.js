/**
 * 校园物语 - 游戏数据
 * 所有游戏数据集中管理：科目、社团、NPC、事件、身份、天赋、成就、皮肤、难度、二周目
 */

// ═══════════════════════════════════════════════════════════════
// 科目
// ═══════════════════════════════════════════════════════════════

var subjects = [
  {
    id: 'math',
    name: '数学',
    icon: '🔢',
    color: '#3B82F6',
    description: '从代数到微积分，锻炼你的逻辑思维和问题解决能力。',
    statBonus: 'intelligence',
  },
  {
    id: 'english',
    name: '英语',
    icon: '📖',
    color: '#F59E0B',
    description: '掌握文字的艺术——论文、辩论和故事创作等你来挑战。',
    statBonus: 'charisma',
  },
  {
    id: 'science',
    name: '科学',
    icon: '🔬',
    color: '#22C55E',
    description: '通过实验、假设和发现，探索自然界的规律。',
    statBonus: 'intelligence',
  },
  {
    id: 'history',
    name: '历史',
    icon: '🏛️',
    color: '#A16207',
    description: '以史为鉴，理解当下——需要专注与坚持。',
    statBonus: 'diligence',
  },
  {
    id: 'art',
    name: '美术',
    icon: '🎨',
    color: '#EC4899',
    description: '通过绘画、雕塑和创意探索，表达真实的自我。',
    statBonus: 'creativity',
  },
  {
    id: 'pe',
    name: '体育',
    icon: '💪',
    color: '#EF4444',
    description: '在运动、健身和团队协作中突破身体极限。',
    statBonus: 'athleticism',
  },
  {
    id: 'computer-science',
    name: '计算机科学',
    icon: '💻',
    color: '#06B6D4',
    description: '编程、算法与数字创造——通向未来的语言。',
    statBonus: 'intelligence',
  },
  {
    id: 'foreign-language',
    name: '外语',
    icon: '🌍',
    color: '#A855F7',
    description: '通过语言学习，打开通往新文化和新连接的大门。',
    statBonus: 'charisma',
  },
];

// ═══════════════════════════════════════════════════════════════
// 社团
// ═══════════════════════════════════════════════════════════════

var clubs = [
  {
    id: 'debate-team',
    name: '辩论队',
    icon: '💬',
    color: '#F59E0B',
    description: '磨砺你的口才，学会说服任何听众。',
    primaryStat: 'charisma',
    meetingDay: 1,
    meetingSlot: 'afternoon',
    skillName: '说服力',
  },
  {
    id: 'basketball',
    name: '篮球社',
    icon: '🏀',
    color: '#F97316',
    description: '驰骋球场，投篮得分，铸就牢不可破的团队精神。',
    primaryStat: 'athleticism',
    meetingDay: 2,
    meetingSlot: 'afternoon',
    skillName: '团队合作',
  },
  {
    id: 'drama-club',
    name: '戏剧社',
    icon: '🎭',
    color: '#EC4899',
    description: '走进聚光灯下，在舞台上赋予角色生命。',
    primaryStat: 'creativity',
    meetingDay: 3,
    meetingSlot: 'evening',
    skillName: '表演',
  },
  {
    id: 'science-olympiad',
    name: '科学竞赛',
    icon: '⚛️',
    color: '#22C55E',
    description: '在科学挑战中竞技，突破知识的边界。',
    primaryStat: 'intelligence',
    meetingDay: 4,
    meetingSlot: 'afternoon',
    skillName: '研究',
  },
  {
    id: 'student-council',
    name: '学生会',
    icon: '👑',
    color: '#EAB308',
    description: '引领同学，组织活动，塑造校园规则。',
    primaryStat: 'charisma',
    meetingDay: 0,
    meetingSlot: 'morning',
    skillName: '领导力',
  },
  {
    id: 'art-club',
    name: '美术社',
    icon: '🖌️',
    color: '#D946EF',
    description: '用画笔、素描和雕塑走向艺术巅峰。',
    primaryStat: 'creativity',
    meetingDay: 2,
    meetingSlot: 'evening',
    skillName: '插画',
  },
  {
    id: 'music-band',
    name: '乐队',
    icon: '🎵',
    color: '#6366F1',
    description: '与志同道合的乐手一起即兴演奏，点燃校园舞台。',
    primaryStat: 'creativity',
    meetingDay: 5,
    meetingSlot: 'afternoon',
    skillName: '音乐素养',
  },
  {
    id: 'chess-club',
    name: '棋社',
    icon: '♟️',
    color: '#64748B',
    description: '在终极智力博弈中，一步一着地击败对手。',
    primaryStat: 'intelligence',
    meetingDay: 3,
    meetingSlot: 'morning',
    skillName: '策略',
  },
];

// ═══════════════════════════════════════════════════════════════
// NPC
// ═══════════════════════════════════════════════════════════════

var npcs = [
  // ── 同学 ──────────────────────────────────────────────
  {
    id: 'npc-alex-chen',
    name: 'Alex Chen',
    type: 'classmate',
    personality: '安静而敏锐，冷幽默总能让人猝不及防。',
    appearance: '高个子，凌乱的黑发，圆框眼镜，总穿着连帽衫。',
    likes: ['intelligence', 'creativity'],
    romanceable: true,
    portrait: '🧑‍💻',
    backstory: '初中时转学过来，一直不太合群。午休时在图书馆看科幻小说。偷偷写着一个粉丝越来越多的博客。',
  },
  {
    id: 'npc-maya-rodriguez',
    name: 'Maya Rodriguez',
    type: 'classmate',
    personality: '大胆、有魅力，对朋友忠诚到骨子里。',
    appearance: '棕色卷发配彩色发夹，灿烂的笑容，喜欢穿复古夹克。',
    likes: ['charisma', 'athleticism'],
    romanceable: true,
    portrait: '💃',
    backstory: '在一个大家庭长大，学会了用大声说话来被听见。女足队长，每个派对的灵魂人物。梦想成为一名记者。',
  },
  {
    id: 'npc-sam-nakamura',
    name: 'Sam Nakamura',
    type: 'classmate',
    personality: '温柔体贴，笑声有感染力，耐心似乎永远用不完。',
    appearance: '柔和的五官，染了蓝色头发，沾满颜料的工装裤。',
    likes: ['creativity', 'diligence'],
    romanceable: true,
    portrait: '🎨',
    backstory: '从能握住铅笔起就开始画画。父母希望Ta学法律，但Sam梦想着艺术学院。在咖啡馆兼职打工。',
  },
  {
    id: 'npc-jordan-williams',
    name: 'Jordan Williams',
    type: 'classmate',
    personality: '好胜心强、充满干劲，但对流浪动物有着出人意料的温柔。',
    appearance: '运动型身材，短寸头，总穿着队服。',
    likes: ['athleticism', 'diligence'],
    romanceable: true,
    portrait: '🏃',
    backstory: '田径队的明星，全额奖学金的希望就在眼前。家里的压力巨大——哥哥曾是州冠军。默默承受着一切。',
  },
  {
    id: 'npc-priya-sharma',
    name: 'Priya Sharma',
    type: 'classmate',
    personality: '聪明绝顶又追求完美，却很难开口求助。',
    appearance: '整齐的辫子，金属细框眼镜，按颜色分类的笔记本。',
    likes: ['intelligence', 'diligence'],
    romanceable: true,
    portrait: '📚',
    backstory: '从高一起就是毕业生代表的竞争者。父母都是医生，期望她走同样的路。私下热爱编程，偷偷开发了一个没人知道的应用。',
  },
  {
    id: 'npc-tyler-brooks',
    name: 'Tyler Brooks',
    type: 'classmate',
    personality: '随和的班上开心果，总用幽默来回避认真的对话。',
    appearance: '满脸雀斑，反戴棒球帽，鞋带永远没系好。',
    likes: ['charisma', 'creativity'],
    romanceable: true,
    portrait: '😂',
    backstory: '五个兄弟姐妹中最小的，学会了用搞笑来获得关注。成绩在下滑，但没人注意到，因为他看起来总是一副没事的样子。想做脱口秀演员。',
  },
  {
    id: 'npc-emma-ohlsson',
    name: 'Emma Ohlsson',
    type: 'classmate',
    personality: '温暖而体贴，有时体贴到忘了自己。',
    appearance: '金色马尾辫，红润的脸颊，总给朋友带着零食。',
    likes: ['charisma', 'diligence'],
    romanceable: true,
    portrait: '🤗',
    backstory: '高二时从瑞典转学过来。还在适应这里的文化，但用灿烂的笑容掩饰思乡之情。每周末都在动物收容所做义工。',
  },
  {
    id: 'npc-marcus-webb',
    name: 'Marcus Webb',
    type: 'classmate',
    personality: '对音乐热情而执着，情绪多变，让人难以捉摸。',
    appearance: '深邃的眼睛，皮夹克，脖子上总挂着耳机。',
    likes: ['creativity', 'intelligence'],
    romanceable: true,
    portrait: '🎸',
    backstory: '由在翻唱乐队里演奏的单亲爸爸抚养长大。音乐就是他的一切。去年为朋友打了一架，背上了不该有的坏名声。',
  },
  {
    id: 'npc-lily-zhang',
    name: 'Lily Zhang',
    type: 'classmate',
    personality: '深谋远虑、雄心勃勃，在社交场合永远先人三步。',
    appearance: '乌黑亮丽的直发，精致的眼线，搭配完美的穿搭。',
    likes: ['intelligence', 'charisma'],
    romanceable: true,
    portrait: '👑',
    backstory: '学生会主席，真心想让学校变得更好。人们以为她城府深，但她只是能力超群。养了一只叫"主席"的乌龟。',
  },
  {
    id: 'npc-diego-morales',
    name: 'Diego Morales',
    type: 'classmate',
    personality: '稳重可靠，是每个人都依赖却没人关心的那个朋友。',
    appearance: '宽阔的肩膀，温暖的棕色眼睛，穿旧的牛仔外套。',
    likes: ['athleticism', 'diligence'],
    romanceable: true,
    portrait: '🤝',
    backstory: '放学后在自家餐厅打工。很少有时间做作业，但从不抱怨。篮球是他的避风港。平静的外表下藏着很多压力。',
  },
  {
    id: 'npc-aisha-okonkwo',
    name: 'Aisha Okonkwo',
    type: 'classmate',
    personality: '好奇又敢言，从不畏惧挑战权威或现状。',
    appearance: '点缀着珠饰的自然卷发，鲜艳的印花头巾，自信的姿态。',
    likes: ['intelligence', 'charisma'],
    romanceable: true,
    portrait: '✊',
    backstory: '两年前从拉各斯搬来。创办了学校第一个文化意识社团。想成为人权律师。敢和老师争论——而且通常能赢。',
  },
  {
    id: 'npc-noah-kim',
    name: 'Noah Kim',
    type: 'classmate',
    personality: '初识时害羞拘谨，但深入了解后会发现他心思细腻。',
    appearance: '瘦削的身材，宽松的毛衣，总是带着相机。',
    likes: ['creativity', 'intelligence'],
    romanceable: true,
    portrait: '📷',
    backstory: '有社交焦虑，在人多的场合会感到不适。摄影是他观察世界的方式。他的摄影博客粉丝比学校官方账号还多。想学新闻摄影。',
  },

  // ── 老师 ────────────────────────────────────────────────
  {
    id: 'npc-ms-chen',
    name: 'Ms. Chen',
    type: 'teacher',
    subject: 'math',
    personality: '严格但公正，热爱优美的证明，私下里是个卡拉OK迷。',
    appearance: '利落的西装外套，链式眼镜绳，袖子上沾着粉笔灰。',
    likes: ['intelligence', 'diligence'],
    romanceable: false,
    portrait: '👩‍🏫',
    backstory: '前精算师，离开了企业界投身教育。相信每个学生都有数学潜力。午休时间开设辅导班，但目前还没人来——暂时。',
  },
  {
    id: 'npc-mr-thompson',
    name: 'Mr. Thompson',
    type: 'teacher',
    subject: 'english',
    personality: '戏剧化且富有感染力，把每堂课都当成一场演出。',
    appearance: '肘部打补丁的花呢外套，蓬松的卷发，丰富的手势。',
    likes: ['charisma', 'creativity'],
    romanceable: false,
    portrait: '🎭',
    backstory: '出版过诗集但无法以此为生。对文学的热爱真挚而富有感染力。学生们要么爱他，要么觉得他太过了。',
  },
  {
    id: 'npc-dr-patel',
    name: 'Dr. Patel',
    type: 'teacher',
    subject: 'science',
    personality: '热情洋溢又有点古怪，以夸张的实验演示闻名。',
    appearance: '别满彩色徽章的实验服，安全护目镜推在额头上，精力充沛。',
    likes: ['intelligence', 'creativity'],
    romanceable: false,
    portrait: '🧪',
    backstory: '拥有生物化学博士学位，选择教书而非做研究。曾在演示实验中拉响火警——故意的，为了科学。指导科学竞赛队。',
  },
  {
    id: 'npc-mrs-okafor',
    name: 'Mrs. Okafor',
    type: 'teacher',
    subject: 'history',
    personality: '睿智而耐心，讲的故事让历史仿佛活了过来。',
    appearance: '优雅的连衣裙，银发盘成发髻，温暖而洞悉一切的眼神。',
    likes: ['diligence', 'intelligence'],
    romanceable: false,
    portrait: '🏛️',
    backstory: '在这所学校教了25年书，记得每一个学生。她的教室像一座博物馆。她也教美术——她相信历史与创造力不可分割。',
  },
  {
    id: 'npc-coach-reyes',
    name: 'Coach Reyes',
    type: 'teacher',
    subject: 'pe',
    personality: '严厉而充满激励，推动每个人达到个人最佳。',
    appearance: '运动服，口哨，健壮的体格，永远挂着鼓励的笑容。',
    likes: ['athleticism', 'diligence'],
    romanceable: false,
    portrait: '🏋️',
    backstory: '前奥运希望之星，因伤结束了职业生涯。把那股冲劲倾注到教练工作中。看到每个学生的潜力，不只是运动员。也执教篮球队。',
  },
  {
    id: 'npc-mr-davis',
    name: 'Mr. Davis',
    type: 'teacher',
    subject: 'computer-science',
    personality: '随和亲切，对待学生更像同事。',
    appearance: '图案T恤，胡须，总开着笔记本电脑，休闲范儿。',
    likes: ['intelligence', 'creativity'],
    romanceable: false,
    portrait: '💻',
    backstory: '前硅谷开发者，倦怠后在教学中找到了意义。他的教室是全校最放松的。他也教外语——他会四种语言，认为编程和语言学有着相同的基因。',
  },
];

// ═══════════════════════════════════════════════════════════════
// 事件
// ═══════════════════════════════════════════════════════════════

var events = [
  // ── 里程碑事件 ────────────────────────────────────────
  {
    id: 'evt-freshman-orientation',
    title: '新生入学',
    description: '你第一次踏入校门。校园里充满了活力——储物柜砰砰作响，笑声回荡，学长学姐们匆匆走过。走廊对面，一张友善的面孔向你挥手。你的高中旅程，从这里开始。',
    icon: '🏫',
    triggerCondition: { year: [1], week: [1] },
    choices: [
      {
        text: '热情地挥手回应，主动自我介绍',
        consequences: { stats: { charisma: 2 }, happiness: 1, flags: ['friendly-first-impression'] },
      },
      {
        text: '礼貌地点点头，提前去上第一节课',
        consequences: { stats: { diligence: 2 }, energy: -1 },
      },
      {
        text: '独自探索校园，熟悉一下地形',
        consequences: { stats: { creativity: 1, intelligence: 1 }, flags: ['independent-streak'] },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-first-club-fair',
    title: '社团招新',
    description: '体育馆里挤满了摊位、横幅和吆喝招新的学长学姐。每个社团都在招兵买马。你能感受到空气中的兴奋——还有压力。',
    icon: '🎪',
    triggerCondition: { year: [1], week: [2, 3] },
    choices: [
      {
        text: '报名加入与你最强技能匹配的社团',
        consequences: { happiness: 2, flags: ['joined-first-club'] },
      },
      {
        text: '跟着新朋友一起报名同一个社团',
        consequences: { stats: { charisma: 1 }, happiness: 1, flags: ['joined-first-club', 'social-joiner'] },
      },
      {
        text: '先拿几个社团的传单，回去再决定',
        consequences: { stats: { intelligence: 1 }, flags: ['club-indecisive'] },
      },
    ],
    category: 'extracurricular',
  },
  {
    id: 'evt-first-exam',
    title: '第一次考试',
    description: '第一次真正的考试就在明天。笔记本上记满了笔记，但够用吗？压力山大——这次考试将定下整个学期的基调。',
    icon: '📝',
    triggerCondition: { year: [1], week: [5, 6] },
    choices: [
      {
        text: '通宵复习',
        consequences: { stats: { intelligence: 2, diligence: 1 }, energy: -3, stress: 2 },
      },
      {
        text: '稳步复习，然后好好睡一觉',
        consequences: { stats: { intelligence: 1, diligence: 1 }, energy: -1, stress: 1 },
      },
      {
        text: '裸考——会就是会，不会就是不会',
        consequences: { stats: { charisma: 1 }, stress: -1, flags: ['overconfident'] },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-making-friends',
    title: '午餐选择',
    description: '食堂是一个社交地雷阵。你看到受欢迎的那桌有空位，一群安静的同学在看书，还有一个独自带着速写本吃饭的同学。',
    icon: '👥',
    triggerCondition: { year: [1], week: [3, 4], randomChance: 0.7 },
    choices: [
      {
        text: '坐到受欢迎的人群中去',
        consequences: { stats: { charisma: 2 }, relationships: { 'npc-lily-zhang': 1 }, stress: 1 },
      },
      {
        text: '加入安静看书的那群人',
        consequences: { stats: { intelligence: 1 }, relationships: { 'npc-alex-chen': 2, 'npc-priya-sharma': 1 } },
      },
      {
        text: '坐到独自画画的那个人旁边',
        consequences: { stats: { creativity: 1 }, relationships: { 'npc-sam-nakamura': 3 }, happiness: 1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-sports-tryouts',
    title: '运动选拔',
    description: '篮球队这周举行选拔赛。Reyes教练用鹰一样的目光审视着每一个动作。这是你证明自己的机会——或者发现你更适合别的。',
    icon: '🏆',
    triggerCondition: { year: [1, 2], week: [4, 5, 6], minStat: { athleticism: 3 } },
    choices: [
      {
        text: '全力以赴——在球场上拼尽全力',
        consequences: { stats: { athleticism: 2 }, energy: -3, stress: 1, flags: ['tried-out-basketball'] },
      },
      {
        text: '打聪明球，展现出色的团队配合',
        consequences: { stats: { athleticism: 1, charisma: 1 }, energy: -2, flags: ['tried-out-basketball'] },
      },
      {
        text: '觉得自己不是运动的料，坐在看台上观看',
        consequences: { stats: { intelligence: 1 }, relationships: { 'npc-jordan-williams': 1 } },
      },
    ],
    category: 'extracurricular',
  },
  {
    id: 'evt-school-dance',
    title: '校园舞会',
    description: '冬季舞会就在这个周末。走廊里到处都在讨论谁和谁一起去。你一直在想邀请某个人——或者干脆和朋友们一起去。',
    icon: '💕',
    triggerCondition: { year: [1, 2, 3], week: [12, 13], randomChance: 0.8 },
    choices: [
      {
        text: '邀请你心仪的人一起去',
        consequences: { stats: { charisma: 2 }, happiness: 2, stress: 2, flags: ['asked-crush-dance'] },
      },
      {
        text: '和朋友们一起去，玩个痛快',
        consequences: { stats: { charisma: 1 }, happiness: 2, stress: -1 },
      },
      {
        text: '不去，在家安静地过一晚',
        consequences: { stats: { diligence: 1 }, energy: 2, happiness: -1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-drama-production',
    title: '话剧演出',
    description: '戏剧社要排一出话剧，需要人手。无论你是上台还是幕后，这可能是你大放异彩的时刻——也可能是灾难性的翻车。',
    icon: '🎭',
    triggerCondition: { year: [1, 2, 3], week: [15, 16], flags: ['joined-first-club'], randomChance: 0.6 },
    choices: [
      {
        text: '试镜主角',
        consequences: { stats: { charisma: 2, creativity: 1 }, stress: 2, energy: -2, flags: ['drama-lead'] },
      },
      {
        text: '帮忙做布景设计和后台工作',
        consequences: { stats: { creativity: 2, diligence: 1 }, energy: -1, flags: ['drama-backstage'] },
      },
      {
        text: '负责写节目单和宣传推广',
        consequences: { stats: { intelligence: 1, charisma: 1 }, relationships: { 'npc-marcus-webb': 1 } },
      },
    ],
    category: 'extracurricular',
    npcId: 'npc-marcus-webb',
  },
  {
    id: 'evt-science-fair',
    title: '科学展览',
    description: '一年一度的科学展览即将到来。Patel博士兴奋得简直要原地起飞。一个出色的项目可能为你赢得认可、奖学金推荐，至少也能及格。',
    icon: '🔬',
    triggerCondition: { year: [1, 2, 3], week: [20, 21], minStat: { intelligence: 4 }, randomChance: 0.7 },
    choices: [
      {
        text: '大胆出击——做一个能运行的模型或实验',
        consequences: { stats: { intelligence: 3 }, energy: -3, stress: 2, flags: ['science-fair-ambitious'] },
      },
      {
        text: '和同学组队，做一个扎实的合作项目',
        consequences: { stats: { intelligence: 1, charisma: 1 }, relationships: { 'npc-priya-sharma': 2 }, energy: -2 },
      },
      {
        text: '做一个简单但展示精良的项目',
        consequences: { stats: { diligence: 1, intelligence: 1 }, energy: -1 },
      },
    ],
    category: 'academic',
    npcId: 'npc-dr-patel',
  },
  {
    id: 'evt-classmate-conflict',
    title: '走廊冲突',
    description: '有人散布了关于你的谣言，而你发现谣言的源头竟是你以为是朋友的人。他们就站在你面前，一脸防备。其他同学都在围观。',
    icon: '⚔️',
    triggerCondition: { year: [1, 2, 3], week: [8, 9, 10, 18, 19], randomChance: 0.5 },
    choices: [
      {
        text: '当面质问，要求他们说清楚',
        consequences: { stats: { charisma: 1 }, stress: 2, relationships: {}, flags: ['confrontational'] },
      },
      {
        text: '保持冷静，私下沟通解决',
        consequences: { stats: { charisma: 2, diligence: 1 }, stress: 1, happiness: 1, flags: ['diplomatic'] },
      },
      {
        text: '转身离开——不值得为此闹剧',
        consequences: { stats: { diligence: 1 }, stress: -1, flags: ['avoidant'] },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-teacher-meeting',
    title: '被叫到办公室',
    description: '老师让你下课后留下来谈话。你心里一沉——是因为成绩？行为？还是其实有什么好事？',
    icon: '🚪',
    triggerCondition: { year: [1, 2, 3], week: [7, 14, 22], randomChance: 0.5 },
    choices: [
      {
        text: '坦诚自己的困难，请求帮助',
        consequences: { stats: { diligence: 2 }, relationships: {}, stress: -1, flags: ['sought-help'] },
      },
      {
        text: '保证会做得更好，然后自己想办法',
        consequences: { stats: { diligence: 1 }, stress: 1, flags: ['self-reliant'] },
      },
      {
        text: '用魅力岔开话题',
        consequences: { stats: { charisma: 1 }, stress: 1, flags: ['evasive'] },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-prom',
    title: '毕业舞会',
    description: '这是大家一整年都在谈论的活动。体育馆焕然一新，音乐响起，这个夜晚充满了无限可能。你要怎样让它变得难忘？',
    icon: '✨',
    triggerCondition: { year: [3], week: [35, 36] },
    choices: [
      {
        text: '邀请你的那个特别的人做舞伴',
        consequences: { stats: { charisma: 2 }, happiness: 3, stress: 1, flags: ['prom-date'] },
      },
      {
        text: '和整个小分队一起去，称霸舞池',
        consequences: { stats: { charisma: 1, athleticism: 1 }, happiness: 2, stress: -1 },
      },
      {
        text: '不去舞会，和密友们度过一个有意义的夜晚',
        consequences: { stats: { creativity: 1 }, happiness: 2, flags: ['anti-prom'] },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-graduation-decisions',
    title: '毕业抉择',
    description: '高三即将结束。大学申请、职业选择、告别……一切都在逼近。似乎每个人都有了规划——除了你。未来既令人兴奋，又令人恐惧。',
    icon: '🎓',
    triggerCondition: { year: [3], week: [38, 39] },
    choices: [
      {
        text: '申请顶尖大学，志存高远',
        consequences: { stats: { intelligence: 1, diligence: 2 }, stress: 3, flags: ['university-path'] },
      },
      {
        text: '追随你的热爱，哪怕它不走寻常路',
        consequences: { stats: { creativity: 2 }, happiness: 2, stress: 1, flags: ['passion-path'] },
      },
      {
        text: '间隔一年，慢慢想清楚',
        consequences: { stats: { charisma: 1, creativity: 1 }, happiness: 1, flags: ['gap-year'] },
      },
    ],
    category: 'milestone',
  },

  // ── 学业事件 ─────────────────────────────────────────
  {
    id: 'evt-group-project',
    title: '小组作业噩梦',
    description: '你被分配了一个占总成绩30%的小组作业。一个组员从不出席，一个只做最低限度的工作，截止日期越来越近。你怎么办？',
    icon: '📁',
    triggerCondition: { year: [1, 2, 3], week: [10, 11, 24, 25], randomChance: 0.6 },
    choices: [
      {
        text: '自己扛起大旗，一个人搞定整个项目',
        consequences: { stats: { diligence: 2, intelligence: 1 }, energy: -3, stress: 2 },
      },
      {
        text: '鼓舞团队士气，明确分工',
        consequences: { stats: { charisma: 2 }, energy: -2, happiness: 1 },
      },
      {
        text: '向老师报告那些划水的人',
        consequences: { stats: { diligence: 1 }, stress: 1, flags: ['reported-classmates'] },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-cheating-dilemma',
    title: '答案之谜',
    description: '你无意间在老师桌上发现了明天考试的答案。没人在看。看一眼就能拯救你的成绩——但也会摧毁你的诚信。',
    icon: '👁️',
    triggerCondition: { year: [1, 2, 3], week: [6, 13, 20, 27], randomChance: 0.3 },
    choices: [
      {
        text: '移开视线，告诉老师答案泄露了',
        consequences: { stats: { diligence: 3 }, happiness: 1, flags: ['honest-student'] },
      },
      {
        text: '偷看几道题——只是为了验证自己的答案',
        consequences: { stats: { intelligence: 1 }, stress: 2, flags: ['bent-rules'] },
      },
      {
        text: '把发现分享给正在挣扎的朋友',
        consequences: { relationships: {}, stats: { charisma: 1 }, stress: 2, flags: ['shared-answers'] },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-tutoring-offer',
    title: '辅导请求',
    description: '一个一直很吃力的同学请求你帮忙辅导你擅长的科目。他们看起来很绝望，但你自己的功课也落后了。',
    icon: '📚',
    triggerCondition: { year: [1, 2, 3], week: [8, 16, 28], minStat: { intelligence: 5 }, randomChance: 0.5 },
    choices: [
      {
        text: '挤出时间帮忙——自己的功课可以之后再补',
        consequences: { stats: { charisma: 2, diligence: 1 }, energy: -2, happiness: 1 },
      },
      {
        text: '建议一起学习，这样双方都受益',
        consequences: { stats: { intelligence: 1, charisma: 1 }, energy: -1 },
      },
      {
        text: '道歉说现在实在没时间',
        consequences: { stats: { diligence: 1 }, stress: -1 },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-competition-invite',
    title: '学科竞赛',
    description: '老师提名你参加区域学科竞赛。这是巨大的荣誉，但需要数周的额外准备。学校对你寄予厚望。',
    icon: '🏅',
    triggerCondition: { year: [2, 3], minStat: { intelligence: 7 }, randomChance: 0.4 },
    choices: [
      {
        text: '接受挑战，全力备战——这可能改变一切',
        consequences: { stats: { intelligence: 3 }, energy: -3, stress: 2, flags: ['competition-accepted'] },
      },
      {
        text: '接受，但保持平衡的日程',
        consequences: { stats: { intelligence: 2, diligence: 1 }, energy: -2, stress: 1 },
      },
      {
        text: '婉拒——心理健康更重要',
        consequences: { stats: { diligence: 1 }, happiness: 1, flags: ['declined-competition'] },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-failing-grade',
    title: '不及格',
    description: '你拿回了试卷，上面是不及格的分数。红色的批改痕迹像一拳打在心口。你爸妈会疯掉的。怎么办？',
    icon: '❌',
    triggerCondition: { year: [1, 2, 3], maxStat: { intelligence: 4 }, randomChance: 0.4 },
    choices: [
      {
        text: '放下自尊，找老师请求补考机会',
        consequences: { stats: { diligence: 2 }, stress: 1, flags: ['sought-help'] },
      },
      {
        text: '和同学们组建学习小组',
        consequences: { stats: { charisma: 1, intelligence: 1 }, energy: -1 },
      },
      {
        text: '先瞒着，下次争取考好',
        consequences: { stress: 3, happiness: -2, flags: ['hiding-grades'] },
      },
    ],
    category: 'academic',
  },

  // ── 社交事件 ───────────────────────────────────────────
  {
    id: 'evt-new-student',
    title: '转学生',
    description: '学期中间来了一个转学生。他们在走廊里看起来迷茫又孤独，手里紧紧攥着校园地图。你记得那种感觉。',
    icon: '👤',
    triggerCondition: { year: [1, 2], week: [10, 11, 18, 19], randomChance: 0.5 },
    choices: [
      {
        text: '直接走上去，主动带他们逛校园',
        consequences: { stats: { charisma: 2 }, happiness: 1, relationships: { 'npc-emma-ohlsson': 2 } },
      },
      {
        text: '微笑挥手，但等他们主动过来',
        consequences: { stats: { charisma: 1 }, relationships: { 'npc-emma-ohlsson': 1 } },
      },
      {
        text: '你自己还有一堆事要操心',
        consequences: { stats: { diligence: 1 }, stress: -1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-party-invite',
    title: '派对邀请',
    description: '年度最大的派对就在这周六。有头有脸的人都会去。但你周一有一个重要的作业要交。',
    icon: '🎉',
    triggerCondition: { year: [1, 2, 3], week: [9, 17, 25], randomChance: 0.6 },
    choices: [
      {
        text: '去派对——总能找到时间写作业的',
        consequences: { stats: { charisma: 2 }, happiness: 2, energy: -2, stress: 2, flags: ['partier'] },
      },
      {
        text: '留在家里，把作业搞定',
        consequences: { stats: { diligence: 2, intelligence: 1 }, happiness: -1, stress: -1 },
      },
      {
        text: '去一个小时，然后回家学习',
        consequences: { stats: { charisma: 1, diligence: 1 }, energy: -2, stress: 1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-betrayal',
    title: '朋友的困境',
    description: '你最好的朋友向你吐露了一件严重的事——他们在考虑退学。他们让你发誓不告诉任何人。但你很担心他们。',
    icon: '🛡️',
    triggerCondition: { year: [2, 3], minRelationship: { 'npc-diego-morales': 5 }, randomChance: 0.3 },
    choices: [
      {
        text: '遵守承诺，但自己试着劝阻他们',
        consequences: { stats: { charisma: 2 }, stress: 2, relationships: { 'npc-diego-morales': 2 } },
      },
      {
        text: '打破承诺，告诉一个值得信赖的大人',
        consequences: { stats: { diligence: 2 }, stress: 1, relationships: { 'npc-diego-morales': -3 }, flags: ['broke-trust'] },
      },
      {
        text: '无论他们怎么决定都支持',
        consequences: { stats: { charisma: 1 }, happiness: -1, relationships: { 'npc-diego-morales': 1 }, flags: ['enabler'] },
      },
    ],
    category: 'social',
    npcId: 'npc-diego-morales',
  },
  {
    id: 'evt-crush-revelation',
    title: '心动时刻',
    description: '你意识到自己暗恋上了班上的某个人。每次他们看向你这边，你的心就砰砰直跳。校园舞会快到了——这可能是你的机会。',
    icon: '💓',
    triggerCondition: { year: [1, 2, 3], week: [11, 23], randomChance: 0.5 },
    choices: [
      {
        text: '给ta写一封真心的信',
        consequences: { stats: { creativity: 1, charisma: 1 }, stress: 2, happiness: 1, flags: ['confessed-feelings'] },
      },
      {
        text: '先试着以朋友的身份更好地了解ta',
        consequences: { stats: { charisma: 1, diligence: 1 }, happiness: 1 },
      },
      {
        text: '把感情埋在心底，专注于自己',
        consequences: { stats: { diligence: 1 }, stress: 1, happiness: -1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-social-media-drama',
    title: '网络风波',
    description: '一张你在体育课上的尴尬照片被发到了网上。不到一小时，半个学校都看到了。你的手机响个不停。',
    icon: '📱',
    triggerCondition: { year: [1, 2, 3], week: [12, 20, 30], randomChance: 0.3 },
    choices: [
      {
        text: '一笑而过，发一条自嘲的动态回应',
        consequences: { stats: { charisma: 2 }, happiness: 1, stress: -1, flags: ['good-sport'] },
      },
      {
        text: '找发帖的人，请ta删掉',
        consequences: { stats: { charisma: 1, diligence: 1 }, stress: 1 },
      },
      {
        text: '删掉所有社交媒体，低调隐身',
        consequences: { stress: 2, happiness: -2, flags: ['social-media-break'] },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-study-date',
    title: '学习约会',
    description: '同学提议一起去附近的咖啡馆学习。听起来很有效率，但上次你们一起"学习"，结果聊了三个小时。',
    icon: '☕',
    triggerCondition: { year: [1, 2, 3], week: [7, 15, 23, 31], randomChance: 0.5 },
    choices: [
      {
        text: '去，但这次真的学习——先定好规矩',
        consequences: { stats: { intelligence: 2, diligence: 1 }, energy: -1 },
      },
      {
        text: '去，享受陪伴——社交时间也很重要',
        consequences: { stats: { charisma: 1 }, happiness: 2, energy: -1 },
      },
      {
        text: '建议改天，自己一个人学',
        consequences: { stats: { intelligence: 1, diligence: 1 }, happiness: -1 },
      },
    ],
    category: 'social',
  },

  // ── 课外活动事件 ──────────────────────────────────────
  {
    id: 'evt-student-council-election',
    title: '学生会选举',
    description: '选举即将来临。Lily Zhang再次参选，但一些同学希望有新的领导力量。有人鼓励你参选——但你真的想要这份责任吗？',
    icon: '🗳️',
    triggerCondition: { year: [2, 3], week: [5, 6], minStat: { charisma: 5 }, randomChance: 0.5 },
    choices: [
      {
        text: '竞选主席——是时候带来新想法了',
        consequences: { stats: { charisma: 3 }, energy: -3, stress: 3, flags: ['ran-for-council'] },
      },
      {
        text: '竞选较小的职位——副主席或秘书',
        consequences: { stats: { charisma: 1, diligence: 1 }, energy: -2, stress: 1, flags: ['council-minor-role'] },
      },
      {
        text: '转而支持Lily的竞选',
        consequences: { relationships: { 'npc-lily-zhang': 3 }, stats: { charisma: 1 }, happiness: 1 },
      },
    ],
    category: 'extracurricular',
    npcId: 'npc-lily-zhang',
  },
  {
    id: 'evt-talent-show',
    title: '才艺表演',
    description: '年度才艺表演的报名表贴在公告栏上。你一直在偷偷练习某个节目。这是向全校展示的时刻吗？',
    icon: '🎤',
    triggerCondition: { year: [1, 2, 3], week: [18, 19], minStat: { creativity: 4 }, randomChance: 0.6 },
    choices: [
      {
        text: '报名，全力以赴地表演',
        consequences: { stats: { creativity: 2, charisma: 2 }, energy: -2, stress: 2, happiness: 2, flags: ['talent-show-performer'] },
      },
      {
        text: '在后台帮忙做技术和后勤',
        consequences: { stats: { intelligence: 1, diligence: 1 }, energy: -1, flags: ['talent-show-crew'] },
      },
      {
        text: '就在台下看，为朋友们加油',
        consequences: { stats: { charisma: 1 }, happiness: 1 },
      },
    ],
    category: 'extracurricular',
  },
  {
    id: 'evt-fundraiser',
    title: '慈善募捐',
    description: '学校正在为当地收容所筹款。你的社团需要想出一个有创意的方式来参与。筹款最多的团队将在全校集会上受到表彰。',
    icon: '💝',
    triggerCondition: { year: [1, 2, 3], week: [14, 26], flags: ['joined-first-club'], randomChance: 0.5 },
    choices: [
      {
        text: '组织一个创意活动——烘焙义卖、洗车或才艺之夜',
        consequences: { stats: { charisma: 2, creativity: 1 }, energy: -2, happiness: 2 },
      },
      {
        text: '挨家挨户敲门募捐',
        consequences: { stats: { diligence: 2, charisma: 1 }, energy: -3, stress: 1 },
      },
      {
        text: '捐出自己的零花钱，完事',
        consequences: { stats: { diligence: 1 }, happiness: -1, stress: -1 },
      },
    ],
    category: 'extracurricular',
  },
  {
    id: 'evt-chess-tournament',
    title: '棋类比赛',
    description: '区域棋类比赛就在这个周末。你的头脑很敏锐，但对手也很强劲。一等奖是一座奖杯和满满的吹牛资本。',
    icon: '👑',
    triggerCondition: { year: [1, 2, 3], minStat: { intelligence: 6 }, flags: ['joined-first-club'], randomChance: 0.4 },
    choices: [
      {
        text: '参赛，打法凶猛——全力争胜',
        consequences: { stats: { intelligence: 2 }, energy: -2, stress: 2, flags: ['chess-competitor'] },
      },
      {
        text: '参赛，但专注于向更强的对手学习',
        consequences: { stats: { intelligence: 2, diligence: 1 }, energy: -1, stress: 1 },
      },
      {
        text: '不去了——宁愿按自己的节奏练习',
        consequences: { stats: { diligence: 1 }, happiness: -1 },
      },
    ],
    category: 'extracurricular',
  },

  // ── 随机事件 ───────────────────────────────────────────
  {
    id: 'evt-lost-and-found',
    title: '失物招领',
    description: '你在走廊里捡到一部崭新的手机。手机没锁，你能看到某个受欢迎的人的通知。归还它可能让你交到一个朋友——或者你可以先偷看一眼。',
    icon: '🔍',
    triggerCondition: { year: [1, 2, 3], randomChance: 0.2 },
    choices: [
      {
        text: '不看一眼，直接交到办公室',
        consequences: { stats: { diligence: 2 }, happiness: 1, flags: ['honest-finder'] },
      },
      {
        text: '查看联系人，亲自归还',
        consequences: { stats: { charisma: 2 }, relationships: {}, happiness: 1 },
      },
      {
        text: '先翻翻看——只是好奇',
        consequences: { stats: { intelligence: 1 }, stress: 1, flags: ['snooped-phone'] },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-rainy-day',
    title: '雨天',
    description: '一场突如其来的暴雨把你和一个不太熟的同学困在了公交站。雨一时半会儿停不了。不如聊聊天吧。',
    icon: '🌧️',
    triggerCondition: { year: [1, 2, 3], randomChance: 0.3 },
    choices: [
      {
        text: '主动聊起来，真心交流',
        consequences: { stats: { charisma: 2 }, relationships: { 'npc-noah-kim': 2 }, happiness: 1 },
      },
      {
        text: '分享你的伞，一起走',
        consequences: { stats: { charisma: 1, athleticism: 1 }, relationships: { 'npc-noah-kim': 1 }, energy: -1 },
      },
      {
        text: '戴上耳机，等雨停',
        consequences: { stats: { diligence: 1 }, energy: 1 },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-lucky-break',
    title: '好运降临',
    description: '你在自动售货机旁捡到一张二十元的纸币。似乎没人在找它。自动售货机就在旁边……',
    icon: '🍀',
    triggerCondition: { year: [1, 2, 3], randomChance: 0.15 },
    choices: [
      {
        text: '四处问问，找到失主',
        consequences: { stats: { charisma: 1, diligence: 1 }, happiness: 1 },
      },
      {
        text: '请自己和好朋友吃零食',
        consequences: { stats: { charisma: 1 }, happiness: 2, relationships: {} },
      },
      {
        text: '揣进兜里——谁捡到就是谁的',
        consequences: { happiness: 1, flags: ['kept-found-money'] },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-power-outage',
    title: '停电',
    description: '上课上到一半，灯突然全灭了。所有人都愣住了，然后一片混乱。有人尖叫（很戏剧性地）。老师出去查看情况。你和同学们独自留在黑暗中。',
    icon: '⚡',
    triggerCondition: { year: [1, 2, 3], randomChance: 0.15 },
    choices: [
      {
        text: '安抚大家，提议玩个游戏打发时间',
        consequences: { stats: { charisma: 2 }, happiness: 2, relationships: {} },
      },
      {
        text: '偷偷溜出去，在黑暗的走廊里探险',
        consequences: { stats: { creativity: 1, athleticism: 1 }, energy: -1, flags: ['rebel-moment'] },
      },
      {
        text: '打开手机手电筒，去帮老师',
        consequences: { stats: { diligence: 2 }, happiness: 1 },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-stray-cat',
    title: '流浪猫',
    description: '放学路上，你看到一只瘦弱的流浪猫蜷缩在长椅下。它可怜兮兮地对你喵喵叫。你家里不让养宠物，但是……',
    icon: '🐱',
    triggerCondition: { year: [1, 2, 3], randomChance: 0.2 },
    choices: [
      {
        text: '带回家，后果以后再说',
        consequences: { stats: { charisma: 1 }, happiness: 2, stress: 1, flags: ['adopted-cat'] },
      },
      {
        text: '去附近的商店给它买点吃的和水',
        consequences: { stats: { diligence: 1 }, happiness: 1 },
      },
      {
        text: '打电话给动物救助机构——这才是负责任的做法',
        consequences: { stats: { diligence: 2 }, happiness: -1 },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-mystery-note',
    title: '神秘纸条',
    description: '你在储物柜里发现一张折好的纸条，没有署名——只有一个谜语。循着线索，你在学校里一路追踪。有人专门为你设了这个局。',
    icon: '📜',
    triggerCondition: { year: [1, 2, 3], minStat: { intelligence: 3 }, randomChance: 0.2 },
    choices: [
      {
        text: '追踪每一条线索——你最爱解谜了',
        consequences: { stats: { intelligence: 2, creativity: 1 }, energy: -1, happiness: 2, flags: ['solved-riddle'] },
      },
      {
        text: '拿给朋友们看，一起破解',
        consequences: { stats: { charisma: 1, intelligence: 1 }, happiness: 1 },
      },
      {
        text: '扔掉——大概是恶作剧',
        consequences: { stats: { diligence: 1 }, happiness: -1 },
      },
    ],
    category: 'random',
  },

  // ── 更多里程碑/后期事件 ───────────────────────────────
  {
    id: 'evt-sophomore-slump',
    title: '高二低谷',
    description: '高中的新鲜感已经褪去。课程变得重复，动力不足，你开始质疑这一切到底有什么意义。"高二低谷"是真实存在的。',
    icon: '☁️',
    triggerCondition: { year: [2], week: [10, 11, 12] },
    choices: [
      {
        text: '打破现状——尝试一些全新的事情',
        consequences: { stats: { creativity: 2, charisma: 1 }, happiness: 2, energy: -1, flags: ['broke-slump'] },
      },
      {
        text: '加倍努力，咬牙坚持',
        consequences: { stats: { diligence: 3 }, energy: -2, stress: 2 },
      },
      {
        text: '找人聊聊你的感受',
        consequences: { stats: { charisma: 1 }, stress: -2, happiness: 1, flags: ['opened-up'] },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-college-visit',
    title: '大学参观',
    description: '学校组织了一次大学校园参观。走过校园广场，旁听一节课，看看宿舍——让未来变得真实了。也让人有点喘不过气。',
    icon: '🏛️',
    triggerCondition: { year: [2, 3], week: [22, 23], randomChance: 0.6 },
    choices: [
      {
        text: '兴奋起来，开始规划申请策略',
        consequences: { stats: { intelligence: 1, diligence: 2 }, stress: 1, flags: ['college-motivated'] },
      },
      {
        text: '感到压力，担心自己不够优秀',
        consequences: { stress: 3, happiness: -1, flags: ['college-anxious'] },
      },
      {
        text: '意识到大学可能不是你的路——那也没关系',
        consequences: { stats: { creativity: 1, charisma: 1 }, happiness: 1, flags: ['alternative-path'] },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-senior-prank',
    title: '毕业恶作剧',
    description: '毕业班正在策划传说中的年终恶作剧。这是传统——但今年的点子可能有些过头了。你被邀请加入。',
    icon: '😂',
    triggerCondition: { year: [3], week: [36, 37], randomChance: 0.7 },
    choices: [
      {
        text: '加入——人生苦短，反正是无伤大雅的玩笑',
        consequences: { stats: { charisma: 2, creativity: 1 }, happiness: 2, stress: -1, flags: ['senior-prank'] },
      },
      {
        text: '建议一个温和点的版本，不会让任何人惹上麻烦',
        consequences: { stats: { charisma: 1, diligence: 1 }, happiness: 1 },
      },
      {
        text: '不参与了——不想拿毕业冒险',
        consequences: { stats: { diligence: 2 }, happiness: -1 },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-last-day',
    title: '最后一天',
    description: '最后的铃声响起。储物柜被清空，毕业纪念册上写满了签名，"保持联系"的承诺在走廊里回荡。四年，就这样结束了。你站在校门口，回头望去。',
    icon: '🌅',
    triggerCondition: { year: [3], week: [40] },
    choices: [
      {
        text: '拥抱每一个人，承诺永远不会失去联系',
        consequences: { stats: { charisma: 2 }, happiness: 3, stress: -2 },
      },
      {
        text: '独自在空荡荡的走廊里走最后一遍',
        consequences: { stats: { creativity: 2 }, happiness: 1, stress: -1 },
      },
      {
        text: '头也不回地走出去——未来在前方',
        consequences: { stats: { diligence: 1, athleticism: 1 }, happiness: 1, flags: ['forward-looking'] },
      },
    ],
    category: 'milestone',
  },

  // ── 二周目专属事件 ──────────────────────────────────────
  {
    id: 'evt-ngplus-dejavu',
    title: '既视感',
    description: '踏入校门的那一刻，一阵强烈的既视感涌上心头。这些走廊、这些面孔……你似乎隐约记得发生过什么。一些遗憾，一些错过。这一次，你会做出不同的选择吗？',
    icon: '🔄',
    triggerCondition: { year: [1], week: [1], flags: ['ngplus-active'] },
    choices: [
      {
        text: '追寻模糊的记忆，主动去找那个曾经错过的人',
        consequences: { stats: { charisma: 2 }, happiness: 3, flags: ['ngplus-chase-memory'] },
      },
      {
        text: '优先报名上次错过的社团',
        consequences: { stats: { diligence: 2 }, happiness: 2, flags: ['ngplus-club-priority'] },
      },
      {
        text: '这次要更加努力，不再留有遗憾',
        consequences: { stats: { intelligence: 2, diligence: 1 }, flags: ['ngplus-no-regrets'] },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-ngplus-old-friend',
    title: '熟悉的陌生人',
    description: '在食堂里，你看到一个似曾相识的身影。虽然你们从未说过话，但你的内心深处似乎记得这个人很重要。一种奇妙的亲切感涌上来。',
    icon: '👥',
    triggerCondition: { year: [1], week: [2, 3], flags: ['ngplus-active'], randomChance: 0.8 },
    choices: [
      {
        text: '鼓起勇气，主动坐到ta旁边',
        consequences: { stats: { charisma: 2 }, happiness: 2, flags: ['ngplus-early-friend'] },
      },
      {
        text: '远远地观察，等待自然的时机',
        consequences: { stats: { intelligence: 1, diligence: 1 }, flags: ['ngplus-cautious'] },
      },
      {
        text: '写一张小纸条偷偷塞进ta的储物柜',
        consequences: { stats: { creativity: 2 }, happiness: 1, flags: ['ngplus-secret-note'] },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-ngplus-teacher-wisdom',
    title: '老师的深意',
    description: '课后，老师叫住了你。"我总觉得你比其他同学更……成熟。像是经历过什么一样。"老师意味深长地看着你，"好好珍惜这次机会。"',
    icon: '🎓',
    triggerCondition: { year: [1], week: [5, 6], flags: ['ngplus-active'], randomChance: 0.5 },
    choices: [
      {
        text: '虚心请教，请老师多加指导',
        consequences: { stats: { intelligence: 2, diligence: 1 }, happiness: 1, flags: ['ngplus-teacher-guide'] },
      },
      {
        text: '微笑不语，把这份感悟藏在心里',
        consequences: { stats: { creativity: 1, charisma: 1 }, happiness: 2 },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-ngplus-make-amends',
    title: '弥补遗憾',
    description: '你想起上次和某个朋友闹翻的场景。这一次，你看到了相同的导火索正在酝酿。你可以选择同样的路，也可以做出不同的选择。',
    icon: '🤝',
    triggerCondition: { year: [1, 2], week: [8, 15, 22], flags: ['ngplus-active'], randomChance: 0.4 },
    choices: [
      {
        text: '主动道歉，即使你觉得不是自己的错',
        consequences: { stats: { charisma: 2 }, happiness: 2, stress: -1, flags: ['ngplus-made-amends'] },
      },
      {
        text: '这次要更坦诚地表达自己的感受',
        consequences: { stats: { charisma: 1, creativity: 1 }, happiness: 1, flags: ['ngplus-honest'] },
      },
      {
        text: '保持距离，避免冲突',
        consequences: { stats: { diligence: 1 }, stress: 1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-ngplus-second-chance',
    title: '第二次机会',
    description: '考试前夜，你突然想起了上次的失败——那些没复习到的知识点，那道差一点就做对的题。这一次，你有了预感。你可以改变结果。',
    icon: '✨',
    triggerCondition: { year: [1, 2], week: [10, 20, 30], flags: ['ngplus-active'], randomChance: 0.5 },
    choices: [
      {
        text: '重点复习上次失分的知识点',
        consequences: { stats: { intelligence: 3, diligence: 1 }, energy: -2, flags: ['ngplus-exam-prep'] },
      },
      {
        text: '这次放轻松，相信自己的积累',
        consequences: { stats: { charisma: 1 }, happiness: 2, stress: -2 },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-ngplus-parallel-world',
    title: '平行世界',
    description: '一个雨天的下午，你在图书馆的角落发现了一本旧日记。翻开一看，里面写的故事竟然和你的人生如出一辙——但结局完全不同。最后一页写着："如果你正在读这段话，说明你还有机会。"',
    icon: '📖',
    triggerCondition: { year: [2, 3], week: [15, 25], flags: ['ngplus-active'], randomChance: 0.3 },
    choices: [
      {
        text: '把日记带走，仔细研究每一个细节',
        consequences: { stats: { intelligence: 2, creativity: 2 }, happiness: 1, flags: ['ngplus-parallel-diary'] },
      },
      {
        text: '放回原处，有些东西不该被打扰',
        consequences: { stats: { diligence: 2 }, happiness: -1 },
      },
      {
        text: '在最后一页写下你自己的话——给下一个读者',
        consequences: { stats: { creativity: 3, charisma: 1 }, happiness: 2, flags: ['ngplus-diary-writer'] },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-ngplus-perfect-youth',
    title: '完美青春',
    description: '站在毕业典礼的舞台上，你回望这四年。每一段友谊都得到了珍惜，每一个机会都被把握，每一次遗憾都被弥补。你知道，这就是你一直在寻找的——完美青春。',
    icon: '👑',
    triggerCondition: { year: [3], week: [39, 40], flags: ['ngplus-active', 'ngplus-no-regrets'] },
    choices: [
      {
        text: '含泪微笑，感谢这段重来的青春',
        consequences: { stats: { charisma: 3 }, happiness: 5, stress: -5, flags: ['ngplus-perfect-youth-ending'] },
      },
      {
        text: '在毕业演讲中分享你的感悟',
        consequences: { stats: { charisma: 2, intelligence: 2 }, happiness: 3, flags: ['ngplus-valedictorian-speech'] },
      },
    ],
    category: 'milestone',
  },
];

// ═══════════════════════════════════════════════════════════════
// 难度预设
// ═══════════════════════════════════════════════════════════════

var difficultyPresets = [
  {
    id: 'easy',
    label: '简单',
    description: '轻松体验，专注于故事和角色。更多精力，更少压力，考试也更宽容。',
    energyMultiplier: 1.25,
    stressMultiplier: 0.7,
    masteryMultiplier: 1.3,
    gradeCurve: 8,
    eventFrequency: 0.4,
    romanceThreshold: 40,
    gradeMultiplier: 1.3,
    startingEnergy: 100,
    maxEnergy: 120,
    examDifficulty: 0.7,
  },
  {
    id: 'normal',
    label: '普通',
    description: '平衡的高中体验。合理安排时间，一切都会顺利的。',
    energyMultiplier: 1.0,
    stressMultiplier: 1.0,
    masteryMultiplier: 1.0,
    gradeCurve: 0,
    eventFrequency: 0.3,
    romanceThreshold: 55,
    gradeMultiplier: 1.0,
    startingEnergy: 80,
    maxEnergy: 100,
    examDifficulty: 1.0,
  },
  {
    id: 'hard',
    label: '困难',
    description: '给追求真正挑战的人。每个决定都至关重要，精力紧缺，考试残酷。',
    energyMultiplier: 0.8,
    stressMultiplier: 1.4,
    masteryMultiplier: 0.75,
    gradeCurve: -8,
    eventFrequency: 0.2,
    romanceThreshold: 70,
    gradeMultiplier: 0.7,
    startingEnergy: 60,
    maxEnergy: 80,
    examDifficulty: 1.4,
  },
];

var DIFFICULTY_PRESETS = {
  easy: {
    label: '简单',
    energyMultiplier: 1.25,
    stressMultiplier: 0.7,
    masteryMultiplier: 1.3,
    gradeCurve: 8,
    eventFrequency: 0.4,
    romanceThreshold: 40,
  },
  normal: {
    label: '普通',
    energyMultiplier: 1.0,
    stressMultiplier: 1.0,
    masteryMultiplier: 1.0,
    gradeCurve: 0,
    eventFrequency: 0.3,
    romanceThreshold: 55,
  },
  hard: {
    label: '困难',
    energyMultiplier: 0.8,
    stressMultiplier: 1.4,
    masteryMultiplier: 0.75,
    gradeCurve: -8,
    eventFrequency: 0.2,
    romanceThreshold: 70,
  },
};

// ═══════════════════════════════════════════════════════════════
// 身份
// ═══════════════════════════════════════════════════════════════

var identities = [
  {
    id: 'scholar',
    name: '学霸',
    emoji: '🧑‍🎓',
    description: '天生的学习机器，书本是你最好的朋友',
    statBonuses: { intelligence: 3, diligence: 2 },
    moodTriggers: [
      { activity: 'study', happinessGain: 15, description: '沉浸在知识的海洋中让你心满意足' },
      { activity: 'homework', happinessGain: 10, description: '完成作业带来成就感' },
      { activity: 'class', happinessGain: 8, description: '课堂上的精彩讲解让你兴奋' },
    ],
    moodDrains: [
      { activity: 'socialize', happinessLoss: 5, description: '社交场合让你有些不自在' },
    ],
  },
  {
    id: 'rich-kid',
    name: '富二代',
    emoji: '💎',
    description: '含着金汤匙出生，金钱不是问题',
    statBonuses: { charisma: 3, luck: 2 },
    moodTriggers: [
      { activity: 'socialize', happinessGain: 15, description: '与人交往是你的天赋' },
      { activity: 'club', happinessGain: 10, description: '社团活动让你展示自我' },
    ],
    moodDrains: [
      { activity: 'study', happinessLoss: 8, description: '学习？有这必要吗？' },
      { activity: 'homework', happinessLoss: 5, description: '做作业简直是浪费时间' },
    ],
  },
  {
    id: 'athlete',
    name: '运动健将',
    emoji: '🏃',
    description: '操场就是你的舞台，汗水是你的勋章',
    statBonuses: { athleticism: 3, diligence: 2 },
    moodTriggers: [
      { activity: 'exercise', happinessGain: 15, description: '运动后的畅快感无可替代' },
      { activity: 'gym', happinessGain: 15, description: '在体育馆挥洒汗水让你快乐' },
      { activity: 'club', happinessGain: 8, description: '团队活动让你热血沸腾' },
    ],
    moodDrains: [
      { activity: 'study', happinessLoss: 5, description: '坐在教室里简直是折磨' },
      { activity: 'homework', happinessLoss: 5, description: '作业？先让我跑一圈再说' },
    ],
  },
  {
    id: 'artist',
    name: '艺术灵魂',
    emoji: '🎨',
    description: '世界是你的画布，创意是你的语言',
    statBonuses: { creativity: 3, intelligence: 2 },
    moodTriggers: [
      { activity: 'study', happinessGain: 5, description: '学习新知识激发灵感' },
      { activity: 'club', happinessGain: 15, description: '创作让你忘却一切烦恼' },
    ],
    moodDrains: [
      { activity: 'exercise', happinessLoss: 5, description: '体力活不是你的菜' },
    ],
  },
  {
    id: 'social-butterfly',
    name: '社交达人',
    emoji: '🦋',
    description: '人脉就是你的超能力',
    statBonuses: { charisma: 3, luck: 2 },
    moodTriggers: [
      { activity: 'socialize', happinessGain: 18, description: '和朋友在一起是你最快乐的时刻' },
      { activity: 'club', happinessGain: 10, description: '组织活动让你如鱼得水' },
    ],
    moodDrains: [
      { activity: 'study', happinessLoss: 8, description: '一个人学习太无聊了' },
      { activity: 'homework', happinessLoss: 5, description: '作业打断你的社交生活' },
    ],
  },
  {
    id: 'homebody',
    name: '宅男/宅女',
    emoji: '🏠',
    description: '家是最温暖的港湾，安静是你最大的享受',
    statBonuses: { diligence: 3, intelligence: 2 },
    moodTriggers: [
      { activity: 'rest', happinessGain: 15, description: '在家休息让你恢复元气' },
      { activity: 'homework', happinessGain: 8, description: '安静地完成作业让你安心' },
      { activity: 'study', happinessGain: 8, description: '独自学习的时光最珍贵' },
    ],
    moodDrains: [
      { activity: 'socialize', happinessLoss: 8, description: '人多的场合让你焦虑' },
      { activity: 'club', happinessLoss: 5, description: '社团活动太吵了' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// 天赋
// ═══════════════════════════════════════════════════════════════

var talents = [
  // 学业
  {
    id: 'talent-review-master',
    name: '温故知新',
    emoji: '📖',
    category: 'academic',
    description: '前世的记忆让你在学习时事半功倍',
    effect: '学习效率提升10%',
    modifiers: {
      studyEfficiencyBonus: 0.1,
    },
  },
  {
    id: 'talent-exam-intuition',
    name: '考点直觉',
    emoji: '🎯',
    category: 'academic',
    description: '对考试重点有着敏锐的直觉，减少意外失分',
    effect: '考试运气提升15%',
    modifiers: {
      examLuckBonus: 0.15,
    },
  },
  {
    id: 'talent-mistake-insight',
    name: '错题通透',
    emoji: '📝',
    category: 'academic',
    description: '从错误中汲取教训的能力大幅提升',
    effect: '考试失败后掌握度获取提升15%',
    modifiers: {
      mistakeReviewBonus: 0.15,
    },
  },
  // 社交
  {
    id: 'talent-familiar-face',
    name: '熟面孔',
    emoji: '👋',
    category: 'social',
    description: '似曾相识的感觉让新朋友更容易信任你',
    effect: '初始关系信任度+20',
    modifiers: {
      initialRelationshipBonus: 20,
    },
  },
  {
    id: 'talent-high-eq',
    name: '高情商',
    emoji: '💬',
    category: 'social',
    description: '前世积累的社交经验让你更擅长处理人际关系',
    effect: '正面社交事件概率提升20%',
    modifiers: {
      socialEventBonus: 0.2,
    },
  },
  {
    id: 'talent-teacher-bond',
    name: '师缘深厚',
    emoji: '👨‍🏫',
    category: 'social',
    description: '与老师有着天然的亲近感',
    effect: '初始师生关系+15',
    modifiers: {
      teacherRelationshipBonus: 15,
    },
  },
  // 生活
  {
    id: 'talent-youthful-energy',
    name: '青春活力',
    emoji: '⚡',
    category: 'life',
    description: '重获青春，精力充沛',
    effect: '最大精力+10',
    modifiers: {
      maxEnergyBonus: 10,
    },
  },
  {
    id: 'talent-lucky-star',
    name: '好运常在',
    emoji: '🍀',
    category: 'life',
    description: '幸运之神似乎总是眷顾着你',
    effect: '幸运事件触发概率提升15%',
    modifiers: {
      luckyEventBonus: 0.15,
    },
  },
  {
    id: 'talent-discipline',
    name: '自律体质',
    emoji: '🏅',
    category: 'life',
    description: '前世养成的自律习惯已融入骨血',
    effect: '更容易解锁自律类成就',
    modifiers: {
      disciplineBonus: 0.2,
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// 成就
// ═══════════════════════════════════════════════════════════════

var achievements = [
  // 学业
  { id: 'ach-all-pass', name: '全科及格', emoji: '✅', description: '所有科目都达到及格线', category: 'academic', condition: '所有科目掌握度≥60', hidden: false, ngplusOnly: false },
  { id: 'ach-scholar-path', name: '学霸之路', emoji: '📚', description: '在学业上崭露头角', category: 'academic', condition: '所有科目掌握度≥80', hidden: false, ngplusOnly: false },
  { id: 'ach-perfect-score', name: '满分王', emoji: '💯', description: '在考试中取得满分', category: 'academic', condition: '任意科目考试获得满分', hidden: false, ngplusOnly: false },
  { id: 'ach-monthly-first', name: '月考第一', emoji: '🥇', description: '月考排名全校第一', category: 'academic', condition: '月考总成绩排名第一', hidden: false, ngplusOnly: false },
  { id: 'ach-final-comeback', name: '期末逆袭', emoji: '🚀', description: '从低分到高分完成逆袭', category: 'academic', condition: '期末考试排名比期中提升20名以上', hidden: false, ngplusOnly: false },
  { id: 'ach-mistake-master', name: '错题达人', emoji: '🔄', description: '善于从错误中学习成长', category: 'academic', condition: '累计从错题中获得100点掌握度', hidden: false, ngplusOnly: false },
  { id: 'ach-competition-champion', name: '学科竞赛冠军', emoji: '🏆', description: '在学科竞赛中拔得头筹', category: 'academic', condition: '获得学科竞赛第一名', hidden: true, ngplusOnly: false },
  // 社交
  { id: 'ach-first-friend', name: '初次交友', emoji: '🤝', description: '迈出社交的第一步', category: 'social', condition: '与第一位NPC建立好友关系', hidden: false, ngplusOnly: false },
  { id: 'ach-social-butterfly', name: '社交达人', emoji: '🌟', description: '人脉广泛的校园红人', category: 'social', condition: '与5位NPC建立好友关系', hidden: false, ngplusOnly: false },
  { id: 'ach-everyones-friend', name: '全员好友', emoji: '🫂', description: '与所有可交互NPC成为好友', category: 'social', condition: '与所有NPC建立好友关系', hidden: true, ngplusOnly: false },
  { id: 'ach-party-star', name: '派对之星', emoji: '🎉', description: '社交活动的焦点人物', category: 'social', condition: '参加10次社交活动', hidden: false, ngplusOnly: false },
  { id: 'ach-teacher-deep-bond', name: '师生情深', emoji: '🎓', description: '与老师建立了深厚的情谊', category: 'social', condition: '任意老师关系达到最高等级', hidden: false, ngplusOnly: false },
  // 社团
  { id: 'ach-club-newbie', name: '社团新人', emoji: '🔰', description: '初入社团的新鲜人', category: 'club', condition: '加入第一个社团', hidden: false, ngplusOnly: false },
  { id: 'ach-club-core', name: '社团骨干', emoji: '💪', description: '社团中不可或缺的中坚力量', category: 'club', condition: '社团贡献度达到骨干级别', hidden: false, ngplusOnly: false },
  { id: 'ach-club-president', name: '社长之路', emoji: '👑', description: '成为社团的领导者', category: 'club', condition: '成为任意社团的社长', hidden: false, ngplusOnly: false },
  { id: 'ach-dual-president', name: '双社社长', emoji: '👑👑', description: '同时担任两个社团的社长', category: 'club', condition: '同时担任两个社团的社长', hidden: true, ngplusOnly: true },
  // 恋爱
  { id: 'ach-first-love', name: '初恋', emoji: '💕', description: '青涩的初恋滋味', category: 'romance', condition: '与任意NPC进入恋爱关系', hidden: false, ngplusOnly: false },
  { id: 'ach-passionate-love', name: '热恋', emoji: '❤️‍🔥', description: '甜蜜的热恋时光', category: 'romance', condition: '恋爱关系达到热恋等级', hidden: false, ngplusOnly: false },
  { id: 'ach-soulmate', name: '灵魂伴侣', emoji: '💞', description: '找到命中注定的那个人', category: 'romance', condition: '恋爱关系达到灵魂伴侣等级', hidden: true, ngplusOnly: false },
  { id: 'ach-heartbreak', name: '心碎时刻', emoji: '💔', description: '经历了感情的挫折', category: 'romance', condition: '恋爱关系破裂', hidden: true, ngplusOnly: false },
  // 特殊
  { id: 'ach-repeat-student', name: '复读生', emoji: '🔁', description: '再来一次，这次一定', category: 'special', condition: '首次完成游戏后开启二周目', hidden: false, ngplusOnly: false },
  { id: 'ach-youth-regret', name: '青春遗憾', emoji: '😢', description: '有些遗憾，只能留在记忆里', category: 'special', condition: '以遗憾结局完成游戏', hidden: true, ngplusOnly: false },
  { id: 'ach-entrepreneur', name: '创业先锋', emoji: '💡', description: '在校园里开启创业之路', category: 'special', condition: '成功完成创业事件链', hidden: true, ngplusOnly: false },
  { id: 'ach-vocational-star', name: '专科之光', emoji: '🔧', description: '专科也能闪耀光芒', category: 'special', condition: '以专科路线完成游戏', hidden: true, ngplusOnly: false },
  { id: 'ach-perfect-youth', name: '完美青春', emoji: '✨', description: '没有遗憾的完美校园生活', category: 'special', condition: '达成完美结局', hidden: true, ngplusOnly: false },
  { id: 'ach-time-reversal', name: '时光倒流', emoji: '⏪', description: '逆转时光，重新来过', category: 'special', condition: '首次进入NG+模式', hidden: false, ngplusOnly: true },
  // 二周目
  { id: 'ach-ngplus-start', name: '二周目开启', emoji: '🔄', description: '踏上新的轮回之旅', category: 'ngplus', condition: '开始二周目游戏', hidden: false, ngplusOnly: true },
  { id: 'ach-talent-awaken', name: '天赋觉醒', emoji: '⭐', description: '觉醒了前世的天赋', category: 'ngplus', condition: '在NG+中选择天赋', hidden: false, ngplusOnly: true },
  { id: 'ach-perfect-ending-ng', name: '圆满青春结局', emoji: '🌈', description: '在NG+中达成圆满的青春结局', category: 'ngplus', condition: 'NG+中达成完美结局', hidden: true, ngplusOnly: true },
  { id: 'ach-omni-scholar', name: '全能学霸结局', emoji: '🎓', description: '文武双全的全能之路', category: 'ngplus', condition: 'NG+中所有科目满分且社交关系全满', hidden: true, ngplusOnly: true },
  { id: 'ach-no-regrets', name: '无悔少年结局', emoji: '🌅', description: '这一次，不留任何遗憾', category: 'ngplus', condition: 'NG+中完成所有可完成的事件', hidden: true, ngplusOnly: true },
  { id: 'ach-free-life', name: '自由人生', emoji: '🕊️', description: '第四次轮回，彻底自由', category: 'ngplus', condition: '进入自由模式（四周目及以上）', hidden: true, ngplusOnly: true },
];

// ═══════════════════════════════════════════════════════════════
// 皮肤
// ═══════════════════════════════════════════════════════════════

var skins = [
  // 校服
  { id: 'skin-default-uniform', name: '默认校服', emoji: '👔', category: 'uniform', description: '标准蓝色校服', cost: 0 },
  { id: 'skin-white-uniform', name: '白色校服', emoji: '🤍', category: 'uniform', description: '清爽白色校服', cost: 5 },
  { id: 'skin-black-uniform', name: '黑色校服', emoji: '🖤', category: 'uniform', description: '酷帅黑色校服', cost: 5 },
  // 鞋子
  { id: 'skin-default-shoes', name: '默认球鞋', emoji: '👟', category: 'shoes', description: '普通运动鞋', cost: 0 },
  { id: 'skin-red-shoes', name: '红色跑鞋', emoji: '👟', category: 'shoes', description: '活力红色跑鞋', cost: 3 },
  // 书包
  { id: 'skin-default-bag', name: '默认书包', emoji: '🎒', category: 'bag', description: '普通双肩包', cost: 0 },
  { id: 'skin-cool-bag', name: '潮流背包', emoji: '🎒', category: 'bag', description: '时尚潮流背包', cost: 5 },
  // 天气
  { id: 'skin-sunny', name: '晴天', emoji: '☀️', category: 'weather', description: '阳光明媚', cost: 0 },
  { id: 'skin-sunset', name: '晚霞', emoji: '🌅', category: 'weather', description: '金色晚霞', cost: 8 },
  { id: 'skin-rain', name: '小雨', emoji: '🌧️', category: 'weather', description: '淅沥小雨', cost: 8 },
  { id: 'skin-fog', name: '晨雾', emoji: '🌫️', category: 'weather', description: '朦胧晨雾', cost: 10 },
  // BGM
  { id: 'skin-bgm-default', name: '默认BGM', emoji: '🎵', category: 'bgm', description: '校园日常', cost: 0 },
  { id: 'skin-bgm-piano', name: '钢琴曲', emoji: '🎹', category: 'bgm', description: '舒缓钢琴', cost: 10 },
  { id: 'skin-bgm-rock', name: '摇滚乐', emoji: '🎸', category: 'bgm', description: '热血摇滚', cost: 10 },
];

// ═══════════════════════════════════════════════════════════════
// 二周目配置
// ═══════════════════════════════════════════════════════════════

var NGPLUS_CONFIGS = {
  1: { playthrough: 1, isNGPlus: false, isFreeMode: false, clubLimit: 2, negativeEventReduction: 0, studyEfficiencyBonus: 0 },
  2: { playthrough: 2, isNGPlus: true, isFreeMode: false, clubLimit: 3, negativeEventReduction: 0.5, studyEfficiencyBonus: 0.1 },
  3: { playthrough: 3, isNGPlus: true, isFreeMode: false, clubLimit: 3, negativeEventReduction: 0.5, studyEfficiencyBonus: 0.1 },
  4: { playthrough: 4, isNGPlus: true, isFreeMode: true, clubLimit: 99, negativeEventReduction: 0.5, studyEfficiencyBonus: 0.15 },
};

function calculateInheritanceRate(unlockedAchievements) {
  if (unlockedAchievements.indexOf('ach-perfect-youth') >= 0) return 1.0;
  if (unlockedAchievements.indexOf('ach-repeat-student') >= 0) return 0.6;
  return 0.5;
}

function getNGPlusConfig(playthrough, unlockedAchievements) {
  var key = Math.min(playthrough, 4);
  var base = NGPLUS_CONFIGS[key] || NGPLUS_CONFIGS[4];
  return {
    playthrough: playthrough,
    isNGPlus: playthrough > 1,
    isFreeMode: playthrough >= 4,
    inheritanceRate: calculateInheritanceRate(unlockedAchievements),
    selectedTalent: null,
    unlockedTalents: [],
    unlockedAchievements: [],
    completedEndings: [],
    unlockedSkins: [],
    clubLimit: base.clubLimit,
    negativeEventReduction: base.negativeEventReduction,
    studyEfficiencyBonus: base.studyEfficiencyBonus,
  };
}

// ═══════════════════════════════════════════════════════════════
// 成就点数
// ═══════════════════════════════════════════════════════════════

var ACHIEVEMENT_POINTS = {
  'ach-all-pass': 5,
  'ach-scholar-path': 10,
  'ach-perfect-score': 15,
  'ach-monthly-first': 15,
  'ach-final-comeback': 10,
  'ach-mistake-master': 10,
  'ach-competition-champion': 20,
  'ach-first-friend': 5,
  'ach-social-butterfly': 10,
  'ach-everyones-friend': 15,
  'ach-party-star': 10,
  'ach-teacher-deep-bond': 10,
  'ach-club-newbie': 5,
  'ach-club-core': 10,
  'ach-club-president': 15,
  'ach-dual-president': 20,
  'ach-first-love': 10,
  'ach-passionate-love': 10,
  'ach-soulmate': 15,
  'ach-heartbreak': 5,
  'ach-repeat-student': 10,
  'ach-youth-regret': 5,
  'ach-entrepreneur': 15,
  'ach-vocational-star': 15,
  'ach-perfect-youth': 25,
  'ach-time-reversal': 15,
  'ach-ngplus-start': 10,
  'ach-talent-awaken': 10,
  'ach-perfect-ending-ng': 20,
  'ach-omni-scholar': 25,
  'ach-no-regrets': 20,
  'ach-free-life': 15,
};

// ═══════════════════════════════════════════════════════════════
// 结局定义
// ═══════════════════════════════════════════════════════════════

var endings = [
  {
    id: 'ending-scholar',
    title: '学霸之路',
    emoji: '🎓',
    description: '你以优异的成绩毕业，被顶尖大学录取。四年的努力终于得到了回报，你的名字将永远留在学校的荣誉墙上。',
    condition: '所有科目掌握度≥80',
  },
  {
    id: 'ending-social-star',
    title: '校园红人',
    emoji: '🌟',
    description: '你成为了学校最受欢迎的人。无论是老师还是同学，每个人都记得你的笑容和温暖。',
    condition: '与5位以上NPC关系达到好友级别',
  },
  {
    id: 'ending-athlete',
    title: '体育之星',
    emoji: '🏆',
    description: '你在体育领域大放异彩，获得了大学体育奖学金。赛场上的汗水铸就了你的辉煌。',
    condition: '运动能力≥80且加入体育类社团',
  },
  {
    id: 'ending-artist',
    title: '艺术追梦',
    emoji: '🎨',
    description: '你凭借出色的艺术才华，被知名艺术学院录取。你的创作将照亮更多人的心灵。',
    condition: '创造力≥80且加入艺术类社团',
  },
  {
    id: 'ending-romance',
    title: '甜蜜初恋',
    emoji: '💕',
    description: '高中最珍贵的收获，是遇到了那个特别的人。你们的故事，将延续到毕业之后。',
    condition: '与NPC建立恋爱关系',
  },
  {
    id: 'ending-average',
    title: '平凡青春',
    emoji: '😊',
    description: '没有惊天动地的成就，但你的高中生活充实而温暖。平凡，也是一种幸福。',
    condition: '默认结局',
  },
  {
    id: 'ending-regret',
    title: '青春遗憾',
    emoji: '😢',
    description: '有些事，当时没有勇气去做；有些人，来不及好好告别。但遗憾，也是青春的一部分。',
    condition: '压力≥80且幸福度≤20',
  },
  {
    id: 'ending-perfect',
    title: '完美青春',
    emoji: '✨',
    description: '你做到了——学业、友情、爱情，一样都没有落下。这就是你梦寐以求的完美青春。',
    condition: '所有属性≥60且幸福度≥80',
  },
  {
    id: 'ending-ngplus-perfect',
    title: '圆满青春',
    emoji: '🌈',
    description: '这一次，你弥补了所有的遗憾。每一段友谊都被珍惜，每一个机会都被把握。这就是圆满。',
    condition: '二周目专属完美结局',
  },
];

// ═══════════════════════════════════════════════════════════════
// 统计名称映射
// ═══════════════════════════════════════════════════════════════

var STAT_NAMES = {
  intelligence: '智力',
  charisma: '魅力',
  athleticism: '运动',
  creativity: '创造力',
  diligence: '勤奋',
  luck: '运气',
};

var STAT_ICONS = {
  intelligence: '🧠',
  charisma: '💬',
  athleticism: '💪',
  creativity: '🎨',
  diligence: '📚',
  luck: '🍀',
};

var SLOT_NAMES = {
  morning: '上午',
  afternoon: '下午',
  evening: '晚上',
};

var DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// 导出所有数据
export default {
  subjects: subjects,
  clubs: clubs,
  npcs: npcs,
  events: events,
  difficultyPresets: difficultyPresets,
  DIFFICULTY_PRESETS: DIFFICULTY_PRESETS,
  identities: identities,
  talents: talents,
  achievements: achievements,
  skins: skins,
  NGPLUS_CONFIGS: NGPLUS_CONFIGS,
  ACHIEVEMENT_POINTS: ACHIEVEMENT_POINTS,
  endings: endings,
  STAT_NAMES: STAT_NAMES,
  STAT_ICONS: STAT_ICONS,
  SLOT_NAMES: SLOT_NAMES,
  DAY_NAMES: DAY_NAMES,
  calculateInheritanceRate: calculateInheritanceRate,
  getNGPlusConfig: getNGPlusConfig,
};
