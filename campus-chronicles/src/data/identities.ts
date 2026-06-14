export interface Identity {
  id: string;
  name: string;
  emoji: string;
  description: string;
  statBonuses: Record<string, number>;
  moodTriggers: { activity: string; happinessGain: number; description: string }[];
  moodDrains: { activity: string; happinessLoss: number; description: string }[];
}

export const identities: Identity[] = [
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
