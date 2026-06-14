export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  statBonus: string;
}

export const subjects: Subject[] = [
  {
    id: 'math',
    name: '数学',
    icon: 'Calculator',
    color: 'text-blue-500',
    description: '从代数到微积分，锻炼你的逻辑思维和问题解决能力。',
    statBonus: 'intelligence',
  },
  {
    id: 'english',
    name: '英语',
    icon: 'BookOpen',
    color: 'text-amber-500',
    description: '掌握文字的艺术——论文、辩论和故事创作等你来挑战。',
    statBonus: 'charisma',
  },
  {
    id: 'science',
    name: '科学',
    icon: 'FlaskConical',
    color: 'text-green-500',
    description: '通过实验、假设和发现，探索自然界的规律。',
    statBonus: 'intelligence',
  },
  {
    id: 'history',
    name: '历史',
    icon: 'Landmark',
    color: 'text-yellow-700',
    description: '以史为鉴，理解当下——需要专注与坚持。',
    statBonus: 'diligence',
  },
  {
    id: 'art',
    name: '美术',
    icon: 'Palette',
    color: 'text-pink-500',
    description: '通过绘画、雕塑和创意探索，表达真实的自我。',
    statBonus: 'creativity',
  },
  {
    id: 'pe',
    name: '体育',
    icon: 'Dumbbell',
    color: 'text-red-500',
    description: '在运动、健身和团队协作中突破身体极限。',
    statBonus: 'athleticism',
  },
  {
    id: 'computer-science',
    name: '计算机科学',
    icon: 'Terminal',
    color: 'text-cyan-500',
    description: '编程、算法与数字创造——通向未来的语言。',
    statBonus: 'intelligence',
  },
  {
    id: 'foreign-language',
    name: '外语',
    icon: 'Globe',
    color: 'text-purple-500',
    description: '通过语言学习，打开通往新文化和新连接的大门。',
    statBonus: 'charisma',
  },
];
