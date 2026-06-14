import type { GameEvent } from '@/engine/types';

export type { GameEvent } from '@/engine/types';

export const events: GameEvent[] = [
  // ── Milestone Events ────────────────────────────────────────
  {
    id: 'evt-freshman-orientation',
    title: '新生入学',
    description: '你第一次踏入校门。校园里充满了活力——储物柜砰砰作响，笑声回荡，学长学姐们匆匆走过。走廊对面，一张友善的面孔向你挥手。你的高中旅程，从这里开始。',
    icon: 'School',
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
    icon: 'Tent',
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
    icon: 'FileText',
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
    icon: 'Users',
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
    icon: 'Trophy',
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
    icon: 'Heart',
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
    icon: 'Drama',
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
    icon: 'Microscope',
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
    icon: 'Swords',
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
    icon: 'DoorOpen',
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
    icon: 'Sparkles',
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
    icon: 'GraduationCap',
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

  // ── Academic Events ─────────────────────────────────────────
  {
    id: 'evt-group-project',
    title: '小组作业噩梦',
    description: '你被分配了一个占总成绩30%的小组作业。一个组员从不出席，一个只做最低限度的工作，截止日期越来越近。你怎么办？',
    icon: 'FolderOpen',
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
    icon: 'Eye',
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
    icon: 'BookMarked',
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
    icon: 'Award',
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
    icon: 'XCircle',
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

  // ── Social Events ───────────────────────────────────────────
  {
    id: 'evt-new-student',
    title: '转学生',
    description: '学期中间来了一个转学生。他们在走廊里看起来迷茫又孤独，手里紧紧攥着校园地图。你记得那种感觉。',
    icon: 'UserPlus',
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
    icon: 'PartyPopper',
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
    icon: 'ShieldAlert',
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
    icon: 'HeartPulse',
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
    icon: 'Smartphone',
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
    icon: 'Coffee',
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

  // ── Extracurricular Events ──────────────────────────────────
  {
    id: 'evt-student-council-election',
    title: '学生会选举',
    description: '选举即将来临。Lily Zhang再次参选，但一些同学希望有新的领导力量。有人鼓励你参选——但你真的想要这份责任吗？',
    icon: 'Vote',
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
    icon: 'Mic',
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
    icon: 'HandHeart',
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
    icon: 'Crown',
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

  // ── Random Events ───────────────────────────────────────────
  {
    id: 'evt-lost-and-found',
    title: '失物招领',
    description: '你在走廊里捡到一部崭新的手机。手机没锁，你能看到某个受欢迎的人的通知。归还它可能让你交到一个朋友——或者你可以先偷看一眼。',
    icon: 'Search',
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
    icon: 'CloudRain',
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
    icon: 'Clover',
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
    icon: 'Zap',
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
    icon: 'Cat',
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
    icon: 'Scroll',
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

  // ── More Milestone / Late-Game Events ───────────────────────
  {
    id: 'evt-sophomore-slump',
    title: '高二低谷',
    description: '高中的新鲜感已经褪去。课程变得重复，动力不足，你开始质疑这一切到底有什么意义。"高二低谷"是真实存在的。',
    icon: 'Cloud',
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
    icon: 'Building2',
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
    icon: 'Laugh',
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
    icon: 'Sunset',
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
];
