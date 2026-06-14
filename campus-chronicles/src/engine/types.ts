// Core type definitions for the Campus Chronicles game engine.
// These types define the shape of game state and all related data structures.

// ---------------------------------------------------------------------------
// Basic types
// ---------------------------------------------------------------------------

/** Time slots within a single game day */
export type TimeSlot = 'morning' | 'afternoon' | 'evening';

/** Difficulty level */
export type Difficulty = 'easy' | 'normal' | 'hard';

// ---------------------------------------------------------------------------
// Character & Stats
// ---------------------------------------------------------------------------

export interface StatBlock {
  intelligence: number;
  charisma: number;
  athleticism: number;
  creativity: number;
  diligence: number;
  luck: number;
}

// ---------------------------------------------------------------------------
// Subjects & Academics
// ---------------------------------------------------------------------------

export interface Subject {
  id: string;
  name: string;
  category: 'science' | 'humanities' | 'general';
}

export interface AcademicRecord {
  subjectId: string;
  mastery: number;
  grade: string;
  homeworkDone: boolean;
}

// ---------------------------------------------------------------------------
// NPCs & Relationships
// ---------------------------------------------------------------------------

export interface NPC {
  id: string;
  name: string;
  archetype: string;
  romanceable: boolean;
  interests: string[];
}

export interface Relationship {
  npcId: string;
  trust: number;
  romance: number;
  tier: string;
}

// ---------------------------------------------------------------------------
// Clubs
// ---------------------------------------------------------------------------

export interface ClubMembership {
  clubId: string;
  role: 'member' | 'vice-president' | 'president';
  commitment: number;
  skill: number;
}

// ---------------------------------------------------------------------------
// Schedule
// ---------------------------------------------------------------------------

export interface ScheduleSlot {
  day: number; // 0-6 (Mon-Sun)
  slot: 'morning' | 'afternoon' | 'evening';
  activity: string;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  category: string;
  npcId?: string;
  icon?: string;
  triggerCondition?: EventTriggerCondition;
}

export interface EventTriggerCondition {
  year?: number[];
  week?: number[];
  minStat?: Record<string, number>;
  maxStat?: Record<string, number>;
  minRelationship?: Record<string, number>;
  flags?: string[];
  randomChance?: number;
}

export interface EventChoice {
  text: string;
  consequences: {
    stats?: Record<string, number>;
    relationships?: Record<string, number>;
    stress?: number;
    happiness?: number;
    energy?: number;
    flags?: string[];
  };
  nextEventId?: string;
}

// ---------------------------------------------------------------------------
// Exams
// ---------------------------------------------------------------------------

export interface ExamState {
  subjectId: string;
  currentQuestion: number;
  totalQuestions: number;
  correctAnswers: number;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Core Game State
// ---------------------------------------------------------------------------

export interface RomanceState {
  partnerId: string | null;
  datingLevel: number;
  datesCompleted: number;
}

export interface GameState {
  character: {
    name: string;
    appearance: string;
    identity: string;
    difficulty: string;
    year: number; // 1-4
    week: number; // 1-40
    day: number; // 0-6
    currentSlot: 'morning' | 'afternoon' | 'evening';
    energy: number;
    maxEnergy: number;
    stress: number;
    happiness: number;
    gpa: number;
    stats: StatBlock;
  };
  romanceState: RomanceState;
  relationships: Relationship[];
  academics: AcademicRecord[];
  clubs: ClubMembership[];
  schedule: ScheduleSlot[];
  eventLog: { eventId: string; choiceIndex: number; week: number }[];
  flags: string[];
  pendingEvents: GameEvent[];
  currentEvent: GameEvent | null;
  examState: ExamState | null;
  gamePhase: 'menu' | 'creating' | 'playing' | 'event' | 'exam' | 'ending';
  endingType: string | null;
  notifications: { id: string; text: string; type: 'positive' | 'negative' | 'neutral' }[];
}

// ---------------------------------------------------------------------------
// Difficulty presets
// ---------------------------------------------------------------------------

export interface DifficultyPreset {
  label: string;
  energyMultiplier: number;       // multiplier on max energy
  stressMultiplier: number;       // multiplier on stress gains
  masteryMultiplier: number;      // multiplier on mastery gains
  gradeCurve: number;             // bonus/penalty to exam scores
  eventFrequency: number;         // 0-1 chance of random events per week
  romanceThreshold: number;       // trust needed to unlock romance
}

export const DIFFICULTY_PRESETS: Record<string, DifficultyPreset> = {
  easy: {
    label: 'Easy',
    energyMultiplier: 1.25,
    stressMultiplier: 0.7,
    masteryMultiplier: 1.3,
    gradeCurve: 8,
    eventFrequency: 0.4,
    romanceThreshold: 40,
  },
  normal: {
    label: 'Normal',
    energyMultiplier: 1.0,
    stressMultiplier: 1.0,
    masteryMultiplier: 1.0,
    gradeCurve: 0,
    eventFrequency: 0.3,
    romanceThreshold: 55,
  },
  hard: {
    label: 'Hard',
    energyMultiplier: 0.8,
    stressMultiplier: 1.4,
    masteryMultiplier: 0.75,
    gradeCurve: -8,
    eventFrequency: 0.2,
    romanceThreshold: 70,
  },
};

// ---------------------------------------------------------------------------
// Activity definitions for the turn processor
// ---------------------------------------------------------------------------

export interface ActivityDef {
  id: string;
  energyCost: number;
  stressChange: number;
  happinessChange: number;
  statBoosts: Partial<StatBlock>;
  masterySubject?: string;
  masteryGain: number;
}

// ---------------------------------------------------------------------------
// Milestone events keyed by (year, week) ranges
// ---------------------------------------------------------------------------

export interface MilestoneDef {
  id: string;
  title: string;
  minWeek: number;
  maxWeek: number;
  year: number;
  category: 'exam' | 'social' | 'story';
}
