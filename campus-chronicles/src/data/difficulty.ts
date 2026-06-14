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
    label: 'Easy',
    description: 'A relaxed experience focused on story and character. More energy, less stress, and forgiving exams.',
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
    label: 'Normal',
    description: 'The balanced high school experience. Manage your time wisely and you\'ll do fine.',
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
    label: 'Hard',
    description: 'For those who want a real challenge. Every decision counts, energy is scarce, and exams are brutal.',
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
