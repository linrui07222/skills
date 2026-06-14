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
    name: 'Debate Team',
    icon: 'MessageSquare',
    color: 'text-amber-500',
    description: 'Sharpen your rhetoric and learn to persuade any audience.',
    primaryStat: 'charisma',
    meetingDay: 1,
    meetingSlot: 'afternoon',
    skillName: 'Persuasion',
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: 'CircleDot',
    color: 'text-orange-500',
    description: 'Run the court, sink baskets, and build unbreakable team spirit.',
    primaryStat: 'athleticism',
    meetingDay: 2,
    meetingSlot: 'afternoon',
    skillName: 'Teamwork',
  },
  {
    id: 'drama-club',
    name: 'Drama Club',
    icon: 'Drama',
    color: 'text-pink-500',
    description: 'Step into the spotlight and bring characters to life on stage.',
    primaryStat: 'creativity',
    meetingDay: 3,
    meetingSlot: 'evening',
    skillName: 'Performance',
  },
  {
    id: 'science-olympiad',
    name: 'Science Olympiad',
    icon: 'Atom',
    color: 'text-green-500',
    description: 'Compete in scientific challenges and push the boundaries of knowledge.',
    primaryStat: 'intelligence',
    meetingDay: 4,
    meetingSlot: 'afternoon',
    skillName: 'Research',
  },
  {
    id: 'student-council',
    name: 'Student Council',
    icon: 'Crown',
    color: 'text-yellow-500',
    description: 'Lead your peers, organize events, and shape school policy.',
    primaryStat: 'charisma',
    meetingDay: 0,
    meetingSlot: 'morning',
    skillName: 'Leadership',
  },
  {
    id: 'art-club',
    name: 'Art Club',
    icon: 'Brush',
    color: 'text-fuchsia-500',
    description: 'Paint, sketch, and sculpt your way to artistic mastery.',
    primaryStat: 'creativity',
    meetingDay: 2,
    meetingSlot: 'evening',
    skillName: 'Illustration',
  },
  {
    id: 'music-band',
    name: 'Music Band',
    icon: 'Music',
    color: 'text-indigo-500',
    description: 'Jam with fellow musicians and rock the school stage.',
    primaryStat: 'creativity',
    meetingDay: 5,
    meetingSlot: 'afternoon',
    skillName: 'Musicianship',
  },
  {
    id: 'chess-club',
    name: 'Chess Club',
    icon: 'Brain',
    color: 'text-slate-500',
    description: 'Outthink your opponents one move at a time in the ultimate mind game.',
    primaryStat: 'intelligence',
    meetingDay: 3,
    meetingSlot: 'morning',
    skillName: 'Strategy',
  },
];
