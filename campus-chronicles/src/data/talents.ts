export interface Talent {
  id: string;
  name: string;
  emoji: string;
  category: 'academic' | 'social' | 'life';
  description: string;
  effect: string; // description of the mechanical effect
  // Effect modifiers used by the game engine
  modifiers: {
    studyEfficiencyBonus?: number;    // percentage bonus to study/homework mastery gain
    examLuckBonus?: number;           // bonus to exam random variance (reduce negative)
    mistakeReviewBonus?: number;      // bonus to mastery gain from failed exams
    initialRelationshipBonus?: number; // bonus to initial relationship trust
    socialEventBonus?: number;        // increase positive social event probability
    teacherRelationshipBonus?: number; // bonus to initial teacher relationship
    maxEnergyBonus?: number;          // bonus to max energy
    luckyEventBonus?: number;         // increase lucky event trigger chance
    disciplineBonus?: number;         // easier to unlock discipline achievements
  };
}

export const talents: Talent[] = [
  // Academic
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
  // Social
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
  // Life
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
