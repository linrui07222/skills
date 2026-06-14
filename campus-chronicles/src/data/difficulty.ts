import type { DifficultyPreset as EngineDifficultyPreset } from '@/engine/types';

// Extended difficulty preset for display and configuration
export interface DifficultyPreset extends EngineDifficultyPreset {
  id: string;
  description: string;
  startingEnergy: number;
  maxEnergy: number;
  examDifficulty: number;
  gradeMultiplier: number;
}

export const difficultyPresets: DifficultyPreset[] = [
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
