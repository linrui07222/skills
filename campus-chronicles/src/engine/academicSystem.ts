// Academic System — grade calculations, exam logic, and mastery progression.
// Handles mastery gains from activities, generates exam results based on mastery,
// calculates GPA, and applies difficulty modifiers.

import type { GameState, AcademicRecord, DifficultyPreset } from './types';
import { DIFFICULTY_PRESETS } from './types';

// ---------------------------------------------------------------------------
// Difficulty helper
// ---------------------------------------------------------------------------

function getDifficulty(state: GameState): DifficultyPreset {
  return DIFFICULTY_PRESETS[state.character.difficulty] ?? DIFFICULTY_PRESETS.normal;
}

// ---------------------------------------------------------------------------
// Mastery gain calculation
// ---------------------------------------------------------------------------

// Base mastery gains per activity type (before modifiers)
const MASTERY_BASE_GAINS: Record<'class' | 'homework' | 'study', number> = {
  class: 3,
  homework: 4,
  study: 5,
};

export function calculateMasteryGain(
  subjectId: string,
  activity: 'class' | 'homework' | 'study',
  state: GameState,
): number {
  const difficulty = getDifficulty(state);
  let baseGain = MASTERY_BASE_GAINS[activity];

  // Intelligence bonus: higher intelligence = more efficient learning
  const intelligenceBonus = 1 + state.character.stats.intelligence * 0.01;
  baseGain *= intelligenceBonus;

  // Diligence bonus: diligent students get more from homework and study
  if (activity === 'homework' || activity === 'study') {
    const diligenceBonus = 1 + state.character.stats.diligence * 0.008;
    baseGain *= diligenceBonus;
  }

  // Homework completion bonus: if previous homework was done, study is more effective
  if (activity === 'study') {
    const subject = state.academics.find((a) => a.subjectId === subjectId);
    if (subject?.homeworkDone) {
      baseGain *= 1.2;
    }
  }

  // Diminishing returns at high mastery levels
  const subject = state.academics.find((a) => a.subjectId === subjectId);
  if (subject) {
    const diminishingFactor = Math.max(0.15, 1 - subject.mastery / 130);
    baseGain *= diminishingFactor;
  }

  // Stress penalty: high stress reduces learning effectiveness
  if (state.character.stress > 60) {
    const stressPenalty = 1 - (state.character.stress - 60) * 0.005;
    baseGain *= Math.max(0.5, stressPenalty);
  }

  // Low energy penalty: too tired to learn effectively
  if (state.character.energy < 20) {
    baseGain *= 0.6;
  }

  // Luck factor: small random variance (±15%)
  const luckFactor = 1 + (Math.random() * 0.3 - 0.15);
  baseGain *= luckFactor;

  // Apply difficulty multiplier
  baseGain *= difficulty.masteryMultiplier;

  return Math.max(1, Math.round(baseGain));
}

// ---------------------------------------------------------------------------
// Exam result generation
// ---------------------------------------------------------------------------

export function generateExamResult(
  subjectId: string,
  mastery: number,
  difficulty: number, // 0.5 (easy) to 2.0 (hard), typically 1.0
): { score: number; grade: string } {
  // Base score is derived from mastery with some randomness
  // Mastery 0-100 maps to potential score 0-100
  let baseScore = mastery;

  // Add random variance: ±15 points, weighted by luck
  const variance = (Math.random() - 0.5) * 30;
  baseScore += variance;

  // Apply difficulty modifier
  baseScore -= (difficulty - 1) * 10;

  // Clamp to 0-100
  const score = Math.max(0, Math.min(100, Math.round(baseScore)));

  const grade = getLetterGrade(score);

  return { score, grade };
}

// ---------------------------------------------------------------------------
// GPA calculation
// ---------------------------------------------------------------------------

// Grade point values for letter grades
const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
};

export function calculateGPA(grades: AcademicRecord[]): number {
  if (grades.length === 0) return 0;

  const totalPoints = grades.reduce((sum, record) => {
    const points = GRADE_POINTS[record.grade] ?? 0;
    return sum + points;
  }, 0);

  const gpa = totalPoints / grades.length;

  // Round to 2 decimal places
  return Math.round(gpa * 100) / 100;
}

// ---------------------------------------------------------------------------
// Letter grade from numeric score
// ---------------------------------------------------------------------------

export function getLetterGrade(score: number): string {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

// ---------------------------------------------------------------------------
// Process exam week: generate results for all subjects
// ---------------------------------------------------------------------------

export function processExamWeek(state: GameState): GameState {
  const difficulty = getDifficulty(state);
  const difficultyModifier = state.character.difficulty === 'easy' ? 0.7
    : state.character.difficulty === 'hard' ? 1.4
    : 1.0;

  const newAcademics = state.academics.map((record) => {
    const result = generateExamResult(
      record.subjectId,
      record.mastery,
      difficultyModifier,
    );

    // Apply difficulty grade curve
    const curvedScore = Math.max(0, Math.min(100, result.score + difficulty.gradeCurve));
    const finalGrade = getLetterGrade(curvedScore);

    return {
      ...record,
      grade: finalGrade,
    };
  });

  const newGpa = calculateGPA(newAcademics);

  return {
    ...state,
    academics: newAcademics,
    character: {
      ...state.character,
      gpa: newGpa,
    },
  };
}

// ---------------------------------------------------------------------------
// Subject difficulty ratings (some subjects are inherently harder)
// ---------------------------------------------------------------------------

const SUBJECT_DIFFICULTY: Record<string, number> = {
  math: 1.3,
  computer_science: 1.2,
  science: 1.1,
  foreign_language: 1.1,
  english: 0.9,
  history: 0.9,
  art: 0.8,
  pe: 0.6,
};

export function getSubjectDifficulty(subjectId: string): number {
  return SUBJECT_DIFFICULTY[subjectId] ?? 1.0;
}

// ---------------------------------------------------------------------------
// Calculate effective mastery (accounting for subject difficulty)
// ---------------------------------------------------------------------------

export function getEffectiveMastery(subjectId: string, mastery: number): number {
  const difficulty = getSubjectDifficulty(subjectId);
  // Harder subjects have lower effective mastery
  return Math.round(mastery / difficulty);
}
