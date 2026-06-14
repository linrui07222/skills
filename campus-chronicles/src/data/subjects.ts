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
    name: 'Math',
    icon: 'Calculator',
    color: 'text-blue-500',
    description: 'From algebra to calculus, train your logical mind and problem-solving skills.',
    statBonus: 'intelligence',
  },
  {
    id: 'english',
    name: 'English',
    icon: 'BookOpen',
    color: 'text-amber-500',
    description: 'Master the art of words — essays, debates, and storytelling await.',
    statBonus: 'charisma',
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'FlaskConical',
    color: 'text-green-500',
    description: 'Explore the laws of nature through experiments, hypotheses, and discovery.',
    statBonus: 'intelligence',
  },
  {
    id: 'history',
    name: 'History',
    icon: 'Landmark',
    color: 'text-yellow-700',
    description: 'Learn from the past to understand the present — discipline and dedication required.',
    statBonus: 'diligence',
  },
  {
    id: 'art',
    name: 'Art',
    icon: 'Palette',
    color: 'text-pink-500',
    description: 'Express yourself through painting, sculpture, and creative exploration.',
    statBonus: 'creativity',
  },
  {
    id: 'pe',
    name: 'PE',
    icon: 'Dumbbell',
    color: 'text-red-500',
    description: 'Push your physical limits with sports, fitness, and teamwork.',
    statBonus: 'athleticism',
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    icon: 'Terminal',
    color: 'text-cyan-500',
    description: 'Code, algorithms, and digital creation — the language of the future.',
    statBonus: 'intelligence',
  },
  {
    id: 'foreign-language',
    name: 'Foreign Language',
    icon: 'Globe',
    color: 'text-purple-500',
    description: 'Open doors to new cultures and connections through language mastery.',
    statBonus: 'charisma',
  },
];
