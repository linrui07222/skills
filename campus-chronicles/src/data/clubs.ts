export interface Club {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  primaryStat: string;
  meetingDay: number;
  meetingSlot: 'morning' | 'afternoon' | 'evening';
  skillName: string;
}

export const clubs: Club[] = [
  {
    id: 'debate-team',
    name: '辩论队',
    icon: 'MessageSquare',
    color: 'text-amber-500',
    description: '磨砺你的口才，学会说服任何听众。',
    primaryStat: 'charisma',
    meetingDay: 1,
    meetingSlot: 'afternoon',
    skillName: '说服力',
  },
  {
    id: 'basketball',
    name: '篮球社',
    icon: 'CircleDot',
    color: 'text-orange-500',
    description: '驰骋球场，投篮得分，铸就牢不可破的团队精神。',
    primaryStat: 'athleticism',
    meetingDay: 2,
    meetingSlot: 'afternoon',
    skillName: '团队合作',
  },
  {
    id: 'drama-club',
    name: '戏剧社',
    icon: 'Drama',
    color: 'text-pink-500',
    description: '走进聚光灯下，在舞台上赋予角色生命。',
    primaryStat: 'creativity',
    meetingDay: 3,
    meetingSlot: 'evening',
    skillName: '表演',
  },
  {
    id: 'science-olympiad',
    name: '科学竞赛',
    icon: 'Atom',
    color: 'text-green-500',
    description: '在科学挑战中竞技，突破知识的边界。',
    primaryStat: 'intelligence',
    meetingDay: 4,
    meetingSlot: 'afternoon',
    skillName: '研究',
  },
  {
    id: 'student-council',
    name: '学生会',
    icon: 'Crown',
    color: 'text-yellow-500',
    description: '引领同学，组织活动，塑造校园规则。',
    primaryStat: 'charisma',
    meetingDay: 0,
    meetingSlot: 'morning',
    skillName: '领导力',
  },
  {
    id: 'art-club',
    name: '美术社',
    icon: 'Brush',
    color: 'text-fuchsia-500',
    description: '用画笔、素描和雕塑走向艺术巅峰。',
    primaryStat: 'creativity',
    meetingDay: 2,
    meetingSlot: 'evening',
    skillName: '插画',
  },
  {
    id: 'music-band',
    name: '乐队',
    icon: 'Music',
    color: 'text-indigo-500',
    description: '与志同道合的乐手一起即兴演奏，点燃校园舞台。',
    primaryStat: 'creativity',
    meetingDay: 5,
    meetingSlot: 'afternoon',
    skillName: '音乐素养',
  },
  {
    id: 'chess-club',
    name: '棋社',
    icon: 'Brain',
    color: 'text-slate-500',
    description: '在终极智力博弈中，一步一着地击败对手。',
    primaryStat: 'intelligence',
    meetingDay: 3,
    meetingSlot: 'morning',
    skillName: '策略',
  },
];
