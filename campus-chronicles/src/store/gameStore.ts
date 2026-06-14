import { create } from 'zustand';

import type {
  GameState,
  GameEvent,
  ScheduleSlot,
  StatBlock,
  AcademicRecord,
  ClubMembership,
  Relationship,
} from '@/engine/types';

export type { GameState } from '@/engine/types';

import { DIFFICULTY_PRESETS } from '@/engine/types';
import { subjects } from '@/data/subjects';
import { identities } from '@/data/identities';
import { talents } from '@/data/talents';
import { achievements } from '@/data/achievements';
import { skins } from '@/data/skins';
import { calculateInheritanceRate, getNGPlusConfig } from '@/data/ngplus';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SAVE_KEY = 'campus-chronicles-save';

const SLOT_ORDER: Array<'morning' | 'afternoon' | 'evening'> = [
  'morning',
  'afternoon',
  'evening',
];

const DEFAULT_STATS: StatBlock = {
  intelligence: 5,
  charisma: 5,
  athleticism: 5,
  creativity: 5,
  diligence: 5,
  luck: 5,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getRelationshipTier(trust: number): string {
  if (trust >= 80) return 'Best Friend';
  if (trust >= 60) return 'Close Friend';
  if (trust >= 40) return 'Friend';
  if (trust >= 20) return 'Acquaintance';
  return 'Stranger';
}

// Achievement point values per achievement (since Achievement interface uses condition: string)
const ACHIEVEMENT_POINTS: Record<string, number> = {
  'ach-all-pass': 5,
  'ach-scholar-path': 10,
  'ach-perfect-score': 15,
  'ach-monthly-first': 15,
  'ach-final-comeback': 10,
  'ach-mistake-master': 10,
  'ach-competition-champion': 20,
  'ach-first-friend': 5,
  'ach-social-butterfly': 10,
  'ach-everyones-friend': 15,
  'ach-party-star': 10,
  'ach-teacher-deep-bond': 10,
  'ach-club-newbie': 5,
  'ach-club-core': 10,
  'ach-club-president': 15,
  'ach-dual-president': 20,
  'ach-first-love': 10,
  'ach-passionate-love': 10,
  'ach-soulmate': 15,
  'ach-heartbreak': 5,
  'ach-repeat-student': 10,
  'ach-youth-regret': 5,
  'ach-entrepreneur': 15,
  'ach-vocational-star': 15,
  'ach-perfect-youth': 25,
  'ach-time-reversal': 15,
  'ach-ngplus-start': 10,
  'ach-talent-awaken': 10,
  'ach-perfect-ending-ng': 20,
  'ach-omni-scholar': 25,
  'ach-no-regrets': 20,
  'ach-free-life': 15,
};

// Achievement condition checker functions
function checkAchievementCondition(
  id: string,
  state: {
    stats: Record<string, number>;
    gpa: number;
    relationships: { npcId: string; trust: number; romance: number }[];
    clubs: { clubId: string; skill: number; role: string }[];
    academics: { subjectId: string; mastery: number }[];
    flags: string[];
    completedEndings: string[];
    playthrough: number;
    happiness: number;
    stress: number;
    romanceState: { partnerId: string | null; datingLevel: number };
    eventLog: { eventId: string; choiceIndex: number; week: number }[];
  },
): boolean {
  switch (id) {
    case 'ach-all-pass':
      return state.academics.length > 0 && state.academics.every((a) => a.mastery >= 60);
    case 'ach-scholar-path':
      return state.academics.length > 0 && state.academics.every((a) => a.mastery >= 80);
    case 'ach-perfect-score':
      return state.flags.includes('exam-perfect-score');
    case 'ach-monthly-first':
      return state.flags.includes('exam-ranked-first');
    case 'ach-final-comeback':
      return state.flags.includes('exam-comeback');
    case 'ach-mistake-master':
      return state.flags.includes('mistake-master-100');
    case 'ach-competition-champion':
      return state.flags.includes('competition-champion');
    case 'ach-first-friend':
      return state.relationships.some((r) => r.trust >= 40);
    case 'ach-social-butterfly':
      return state.relationships.filter((r) => r.trust >= 40).length >= 5;
    case 'ach-everyones-friend':
      return state.relationships.length > 0 && state.relationships.every((r) => r.trust >= 40);
    case 'ach-party-star':
      return state.eventLog.filter((e) => e.eventId.startsWith('social-')).length >= 10;
    case 'ach-teacher-deep-bond':
      return state.flags.includes('teacher-deep-bond');
    case 'ach-club-newbie':
      return state.clubs.length >= 1;
    case 'ach-club-core':
      return state.clubs.some((c) => c.skill >= 50);
    case 'ach-club-president':
      return state.clubs.some((c) => c.role === 'president');
    case 'ach-dual-president':
      return state.clubs.filter((c) => c.role === 'president').length >= 2;
    case 'ach-first-love':
      return state.romanceState.partnerId !== null;
    case 'ach-passionate-love':
      return state.romanceState.datingLevel >= 2;
    case 'ach-soulmate':
      return state.romanceState.datingLevel >= 4;
    case 'ach-heartbreak':
      return state.flags.includes('heartbreak');
    case 'ach-repeat-student':
      return state.completedEndings.length >= 1;
    case 'ach-youth-regret':
      return state.flags.includes('ending-regret');
    case 'ach-entrepreneur':
      return state.flags.includes('entrepreneur-complete');
    case 'ach-vocational-star':
      return state.flags.includes('ending-vocational');
    case 'ach-perfect-youth':
      return state.flags.includes('ending-perfect');
    case 'ach-time-reversal':
      return state.playthrough >= 2;
    case 'ach-ngplus-start':
      return state.playthrough >= 2;
    case 'ach-talent-awaken':
      return state.flags.includes('talent-selected');
    case 'ach-perfect-ending-ng':
      return state.flags.includes('ending-perfect') && state.playthrough >= 2;
    case 'ach-omni-scholar':
      return state.academics.every((a) => a.mastery >= 100) && state.relationships.every((r) => r.trust >= 80);
    case 'ach-no-regrets':
      return state.flags.includes('all-events-complete');
    case 'ach-free-life':
      return state.playthrough >= 4;
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// Store interface (extends GameState with actions)
// ---------------------------------------------------------------------------

interface GameStore extends GameState {
  // Character creation actions
  setCharacterName: (name: string) => void;
  setIdentity: (identityId: string) => void;
  setDifficulty: (difficulty: string) => void;
  allocateStat: (stat: string, value: number) => void;
  startGame: () => void;

  // Game loop actions
  advanceSlot: () => void;
  advanceDay: () => void;
  advanceWeek: () => void;
  setSchedule: (slots: ScheduleSlot[]) => void;
  updateScheduleSlot: (day: number, slot: string, activity: string) => void;

  // Activity actions
  attendClass: (subjectId: string) => void;
  doHomework: (subjectId: string) => void;
  study: (subjectId: string) => void;
  socialize: (npcId: string) => void;
  attendClub: (clubId: string) => void;
  rest: () => void;
  sleep: () => void;
  exercise: () => void;

  // Romance actions
  goOnDate: (npcId: string) => void;
  confess: (npcId: string) => void;
  breakUp: () => void;

  // Identity mood effects
  applyIdentityMoodEffect: (activity: string) => string | null;

  // Event actions
  setCurrentEvent: (event: GameEvent | null) => void;
  resolveChoice: (choiceIndex: number) => void;
  dismissEvent: () => void;

  // Exam actions
  startExam: (subjectId: string) => void;
  answerExamQuestion: (correct: boolean) => void;
  finishExam: () => void;

  // Stat update actions
  updateStats: (changes: Record<string, number>) => void;
  updateEnergy: (change: number) => void;
  updateStress: (change: number) => void;
  updateHappiness: (change: number) => void;
  updateRelationship: (npcId: string, trustChange: number, romanceChange?: number) => void;
  updateMastery: (subjectId: string, change: number) => void;
  updateClubSkill: (clubId: string, change: number) => void;

  // Club actions
  joinClub: (clubId: string) => void;
  leaveClub: (clubId: string) => void;

  // Flag actions
  setFlag: (flag: string) => void;
  hasFlag: (flag: string) => boolean;

  // Notification actions
  addNotification: (text: string, type: 'positive' | 'negative' | 'neutral') => void;
  removeNotification: (id: string) => void;

  // Save / Load
  saveGame: () => void;
  loadGame: () => boolean;
  hasSave: () => boolean;
  newGame: () => void;
  resetFullGame: () => void;

  // NG+ actions
  selectTalent: (talentId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  unlockSkin: (skinId: string) => void;
  setActiveSkin: (skinId: string) => void;
  startNGPlus: () => void;
  checkAchievements: () => void;

  // Phase management
  setGamePhase: (phase: string) => void;
  setEndingType: (type: string) => void;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: GameState = {
  character: {
    name: '',
    appearance: '',
    identity: '',
    difficulty: 'normal',
    year: 1,
    week: 1,
    day: 0,
    currentSlot: 'morning',
    energy: 100,
    maxEnergy: 100,
    stress: 0,
    happiness: 50,
    gpa: 0,
    stats: { ...DEFAULT_STATS },
  },
  romanceState: {
    partnerId: null,
    datingLevel: 0,
    datesCompleted: 0,
  },
  relationships: [],
  academics: [],
  clubs: [],
  schedule: [],
  eventLog: [],
  flags: [],
  pendingEvents: [],
  currentEvent: null,
  examState: null,
  gamePhase: 'menu',
  endingType: null,
  notifications: [],
  ngplus: {
    playthrough: 1,
    isNGPlus: false,
    isFreeMode: false,
    selectedTalent: null,
    unlockedTalents: [],
    unlockedAchievements: [],
    completedEndings: [],
    unlockedSkins: ['skin-default-uniform', 'skin-default-shoes', 'skin-default-bag', 'skin-sunny', 'skin-bgm-default'],
    activeSkin: 'skin-default-uniform',
    achievementPoints: 0,
    clubLimit: 2,
    negativeEventReduction: 0,
    studyEfficiencyBonus: 0,
    inheritedStats: null,
  },
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGameStore = create<GameStore>()((set, get) => ({
  // ----- Initial state -----------------------------------------------------
  ...initialState,

  // ----- Character creation ------------------------------------------------

  setCharacterName: (name) =>
    set((s) => ({ character: { ...s.character, name } })),

  setIdentity: (identityId) =>
    set((s) => ({ character: { ...s.character, identity: identityId } })),

  setDifficulty: (difficulty) => {
    const preset = DIFFICULTY_PRESETS[difficulty];
    const maxEnergy = preset
      ? Math.round(100 * preset.energyMultiplier)
      : 100;
    set((s) => ({
      character: {
        ...s.character,
        difficulty,
        maxEnergy,
        energy: Math.min(s.character.energy, maxEnergy),
      },
    }));
  },

  allocateStat: (stat, value) =>
    set((s) => ({
      character: {
        ...s.character,
        stats: { ...s.character.stats, [stat]: clamp(value, 1, 20) },
      },
    })),

  startGame: () => {
    const { character, ngplus } = get();
    const academics: AcademicRecord[] = subjects.map((sub) => ({
      subjectId: sub.id,
      mastery: 10,
      grade: '',
      homeworkDone: false,
    }));

    // Apply identity stat bonuses
    const identityData = identities.find((i) => i.id === character.identity);
    const newStats = { ...character.stats };
    if (identityData) {
      for (const [key, value] of Object.entries(identityData.statBonuses)) {
        if (key in newStats) {
          (newStats as Record<string, number>)[key] = clamp(
            (newStats as Record<string, number>)[key] + value,
            1,
            100,
          );
        }
      }
    }

    // Apply inherited stats if ngplus.inheritedStats exists
    if (ngplus.inheritedStats) {
      for (const [key, value] of Object.entries(ngplus.inheritedStats)) {
        if (key in newStats) {
          (newStats as Record<string, number>)[key] = clamp(
            (newStats as Record<string, number>)[key] + value,
            1,
            100,
          );
        }
      }
    }

    // Apply selected talent modifiers (store reference; gameplay effects applied by engine)
    let talentMaxEnergyBonus = 0;
    if (ngplus.selectedTalent) {
      const talentData = talents.find((t) => t.id === ngplus.selectedTalent);
      if (talentData) {
        talentMaxEnergyBonus = talentData.modifiers.maxEnergyBonus ?? 0;
      }
    }

    // Apply NG+ club limit
    const clubLimit = ngplus.clubLimit;
    // Apply NG+ study efficiency bonus
    const studyEfficiencyBonus = ngplus.studyEfficiencyBonus;
    // Apply talent max energy bonus
    const newMaxEnergy = character.maxEnergy + talentMaxEnergyBonus;

    set({
      character: {
        ...character,
        stats: newStats,
        year: 1,
        week: 1,
        day: 0,
        currentSlot: 'morning',
        energy: newMaxEnergy,
        maxEnergy: newMaxEnergy,
        stress: 0,
        happiness: 50,
        gpa: 0,
      },
      romanceState: {
        partnerId: null,
        datingLevel: 0,
        datesCompleted: 0,
      },
      academics,
      relationships: [],
      clubs: [],
      schedule: [],
      currentEvent: null,
      pendingEvents: [],
      examState: null,
      eventLog: [],
      flags: ngplus.isNGPlus ? ['ngplus-active'] : [],
      gamePhase: 'playing',
      endingType: null,
      notifications: [],
      ngplus: {
        ...ngplus,
        clubLimit,
        studyEfficiencyBonus,
      },
    });
  },

  // ----- Game loop ---------------------------------------------------------

  advanceSlot: () => {
    const { character } = get();
    const idx = SLOT_ORDER.indexOf(character.currentSlot);

    if (idx < SLOT_ORDER.length - 1) {
      set({
        character: { ...character, currentSlot: SLOT_ORDER[idx + 1] },
      });
    } else if (character.day < 6) {
      set({
        character: {
          ...character,
          currentSlot: 'morning',
          day: character.day + 1,
        },
      });
    } else if (character.week < 40) {
      set({
        character: {
          ...character,
          currentSlot: 'morning',
          day: 0,
          week: character.week + 1,
        },
      });
    } else {
      set({
        character: {
          ...character,
          currentSlot: 'morning',
          day: 0,
          week: 1,
          year: character.year + 1,
        },
      });
    }
  },

  advanceDay: () => {
    const { character } = get();
    if (character.day < 6) {
      set({
        character: {
          ...character,
          day: character.day + 1,
          currentSlot: 'morning',
        },
      });
    } else if (character.week < 40) {
      set({
        character: {
          ...character,
          day: 0,
          week: character.week + 1,
          currentSlot: 'morning',
        },
      });
    } else {
      set({
        character: {
          ...character,
          day: 0,
          week: 1,
          year: character.year + 1,
          currentSlot: 'morning',
        },
      });
    }
  },

  advanceWeek: () => {
    const { character } = get();
    if (character.week < 40) {
      set({
        character: {
          ...character,
          week: character.week + 1,
          day: 0,
          currentSlot: 'morning',
        },
      });
    } else {
      set({
        character: {
          ...character,
          week: 1,
          year: character.year + 1,
          day: 0,
          currentSlot: 'morning',
        },
      });
    }
  },

  setSchedule: (slots) => set({ schedule: slots }),

  updateScheduleSlot: (day, slot, activity) => {
    const { schedule } = get();
    const idx = schedule.findIndex((s) => s.day === day && s.slot === slot);
    if (idx >= 0) {
      set({
        schedule: schedule.map((s, i) =>
          i === idx ? { ...s, activity } : s,
        ),
      });
    } else {
      set({
        schedule: [
          ...schedule,
          { day, slot: slot as ScheduleSlot['slot'], activity },
        ],
      });
    }
  },

  // ----- Activity actions --------------------------------------------------

  attendClass: (subjectId) => {
    const state = get();
    const bonus = state.ngplus.studyEfficiencyBonus;
    const newMastery = state.academics.map((a) =>
      a.subjectId === subjectId
        ? { ...a, mastery: clamp(a.mastery + 3 + bonus, 0, 100) }
        : a,
    );
    const masteryChange = newMastery.find((a) => a.subjectId === subjectId)!.mastery
      - state.academics.find((a) => a.subjectId === subjectId)!.mastery;
    const energyChange = -15;
    const stressChange = 2;

    const newCharacter = {
      ...state.character,
      energy: clamp(state.character.energy + energyChange, 0, state.character.maxEnergy),
      stress: clamp(state.character.stress + stressChange, 0, 100),
    };

    const moodDesc = state.applyIdentityMoodEffect('class');
    const notifications = [...state.notifications];
    const subject = subjects.find((s) => s.id === subjectId);
    if (masteryChange > 0) notifications.push({ id: crypto.randomUUID(), text: `${subject?.name ?? subjectId}掌握度 +${masteryChange}`, type: 'positive' as const });
    notifications.push({ id: crypto.randomUUID(), text: `精力 ${energyChange}`, type: 'negative' as const });
    notifications.push({ id: crypto.randomUUID(), text: `压力 +${stressChange}`, type: 'negative' as const });
    if (moodDesc) notifications.push({ id: crypto.randomUUID(), text: `心情变化：${moodDesc}`, type: 'positive' as const });

    set({ academics: newMastery, character: newCharacter, notifications });
  },

  doHomework: (subjectId) => {
    const state = get();
    const bonus = state.ngplus.studyEfficiencyBonus;
    const newAcademics = state.academics.map((a) =>
      a.subjectId === subjectId
        ? { ...a, mastery: clamp(a.mastery + 1 + bonus, 0, 100), homeworkDone: true }
        : a,
    );
    const masteryChange = newAcademics.find((a) => a.subjectId === subjectId)!.mastery
      - state.academics.find((a) => a.subjectId === subjectId)!.mastery;
    const energyChange = -10;
    const stressChange = 3;

    const newCharacter = {
      ...state.character,
      energy: clamp(state.character.energy + energyChange, 0, state.character.maxEnergy),
      stress: clamp(state.character.stress + stressChange, 0, 100),
    };

    const moodDesc = state.applyIdentityMoodEffect('homework');
    const notifications = [...state.notifications];
    const subject = subjects.find((s) => s.id === subjectId);
    if (masteryChange > 0) notifications.push({ id: crypto.randomUUID(), text: `${subject?.name ?? subjectId}掌握度 +${masteryChange}`, type: 'positive' as const });
    notifications.push({ id: crypto.randomUUID(), text: `精力 ${energyChange}`, type: 'negative' as const });
    notifications.push({ id: crypto.randomUUID(), text: `压力 +${stressChange}`, type: 'negative' as const });
    if (moodDesc) notifications.push({ id: crypto.randomUUID(), text: `心情变化：${moodDesc}`, type: 'positive' as const });

    set({ academics: newAcademics, character: newCharacter, notifications });
  },

  study: (subjectId) => {
    const state = get();
    const bonus = state.ngplus.studyEfficiencyBonus;
    const newAcademics = state.academics.map((a) =>
      a.subjectId === subjectId
        ? { ...a, mastery: clamp(a.mastery + 5 + bonus, 0, 100) }
        : a,
    );
    const masteryChange = newAcademics.find((a) => a.subjectId === subjectId)!.mastery
      - state.academics.find((a) => a.subjectId === subjectId)!.mastery;
    const energyChange = -20;
    const stressChange = 5;

    const newCharacter = {
      ...state.character,
      energy: clamp(state.character.energy + energyChange, 0, state.character.maxEnergy),
      stress: clamp(state.character.stress + stressChange, 0, 100),
    };

    const moodDesc = state.applyIdentityMoodEffect('study');
    const notifications = [...state.notifications];
    const subject = subjects.find((s) => s.id === subjectId);
    if (masteryChange > 0) notifications.push({ id: crypto.randomUUID(), text: `${subject?.name ?? subjectId}掌握度 +${masteryChange}`, type: 'positive' as const });
    notifications.push({ id: crypto.randomUUID(), text: `精力 ${energyChange}`, type: 'negative' as const });
    notifications.push({ id: crypto.randomUUID(), text: `压力 +${stressChange}`, type: 'negative' as const });
    if (moodDesc) notifications.push({ id: crypto.randomUUID(), text: `心情变化：${moodDesc}`, type: 'positive' as const });

    set({ academics: newAcademics, character: newCharacter, notifications });
  },

  socialize: (npcId) => {
    const state = get();
    const { relationships, character } = state;
    const existing = relationships.find((r) => r.npcId === npcId);

    const energyChange = -10;
    const stressChange = -5;
    const baseHappinessChange = 5;

    const charUpdate = {
      ...character,
      energy: clamp(character.energy + energyChange, 0, character.maxEnergy),
      stress: clamp(character.stress + stressChange, 0, 100),
      happiness: clamp(character.happiness + baseHappinessChange, 0, 100),
    };

    const moodDesc = state.applyIdentityMoodEffect('socialize');
    const notifications = [...state.notifications];
    notifications.push({ id: crypto.randomUUID(), text: `精力 ${energyChange}`, type: 'negative' as const });
    notifications.push({ id: crypto.randomUUID(), text: `压力 ${stressChange}`, type: 'positive' as const });
    notifications.push({ id: crypto.randomUUID(), text: `心情 +${baseHappinessChange}`, type: 'positive' as const });
    if (moodDesc) notifications.push({ id: crypto.randomUUID(), text: `心情变化：${moodDesc}`, type: 'positive' as const });

    if (existing) {
      const newTrust = clamp(existing.trust + 5, 0, 100);
      set({
        relationships: relationships.map((r) =>
          r.npcId === npcId
            ? { ...r, trust: newTrust, tier: getRelationshipTier(newTrust) }
            : r,
        ),
        character: charUpdate,
        notifications,
      });
    } else {
      const newRel: Relationship = {
        npcId,
        trust: 5,
        romance: 0,
        tier: getRelationshipTier(5),
      };
      set({
        relationships: [...relationships, newRel],
        character: charUpdate,
        notifications,
      });
    }
  },

  attendClub: (clubId) => {
    const state = get();
    const newClubs = state.clubs.map((c) =>
      c.clubId === clubId
        ? { ...c, skill: clamp(c.skill + 3, 0, 100) }
        : c,
    );
    const energyChange = -15;
    const stressChange = -5;
    const baseHappinessChange = 3;

    const newCharacter = {
      ...state.character,
      energy: clamp(state.character.energy + energyChange, 0, state.character.maxEnergy),
      stress: clamp(state.character.stress + stressChange, 0, 100),
      happiness: clamp(state.character.happiness + baseHappinessChange, 0, 100),
    };

    const moodDesc = state.applyIdentityMoodEffect('club');
    const notifications = [...state.notifications];
    notifications.push({ id: crypto.randomUUID(), text: `精力 ${energyChange}`, type: 'negative' as const });
    notifications.push({ id: crypto.randomUUID(), text: `压力 ${stressChange}`, type: 'positive' as const });
    notifications.push({ id: crypto.randomUUID(), text: `心情 +${baseHappinessChange}`, type: 'positive' as const });
    if (moodDesc) notifications.push({ id: crypto.randomUUID(), text: `心情变化：${moodDesc}`, type: 'positive' as const });

    set({ clubs: newClubs, character: newCharacter, notifications });
  },

  rest: () =>
    set((s) => ({
      character: {
        ...s.character,
        energy: clamp(s.character.energy + 40, 0, s.character.maxEnergy),
        stress: clamp(s.character.stress - 15, 0, 100),
        happiness: clamp(s.character.happiness + 5, 0, 100),
      },
    })),

  sleep: () => {
    const state = get();
    const { character } = state;

    // Restore energy to max, reduce stress, advance to next morning
    const newCharacter = {
      ...character,
      energy: character.maxEnergy,
      stress: clamp(character.stress - 20, 0, 100),
    };

    // Apply identity-based mood recovery
    const identityData = identities.find((i) => i.id === character.identity);
    if (identityData) {
      const restTrigger = identityData.moodTriggers.find((t) => t.activity === 'rest');
      if (restTrigger) {
        newCharacter.happiness = clamp(character.happiness + restTrigger.happinessGain, 0, 100);
      }
    }

    // Advance to next morning
    if (character.day < 6) {
      newCharacter.day = character.day + 1;
    } else if (character.week < 40) {
      newCharacter.day = 0;
      newCharacter.week = character.week + 1;
    } else {
      newCharacter.day = 0;
      newCharacter.week = 1;
      newCharacter.year = character.year + 1;
    }
    newCharacter.currentSlot = 'morning' as const;

    const notifications = [...state.notifications];
    notifications.push({ id: crypto.randomUUID(), text: '精力已完全恢复', type: 'positive' as const });
    notifications.push({ id: crypto.randomUUID(), text: '压力 -20', type: 'positive' as const });

    set({ character: newCharacter, notifications });
  },

  exercise: () => {
    const state = get();
    const { character } = state;

    const energyChange = -15;
    const stressChange = -5;

    const newCharacter = {
      ...character,
      energy: clamp(character.energy + energyChange, 0, character.maxEnergy),
      stress: clamp(character.stress + stressChange, 0, 100),
      stats: {
        ...character.stats,
        athleticism: clamp(character.stats.athleticism + 2, 1, 100),
      },
    };

    const moodDesc = state.applyIdentityMoodEffect('exercise');
    const notifications = [...state.notifications];
    notifications.push({ id: crypto.randomUUID(), text: '运动能力 +2', type: 'positive' as const });
    notifications.push({ id: crypto.randomUUID(), text: `精力 ${energyChange}`, type: 'negative' as const });
    notifications.push({ id: crypto.randomUUID(), text: `压力 ${stressChange}`, type: 'positive' as const });
    if (moodDesc) notifications.push({ id: crypto.randomUUID(), text: `心情变化：${moodDesc}`, type: 'positive' as const });

    set({ character: newCharacter, notifications });
  },

  goOnDate: (npcId) => {
    const state = get();
    const { character, romanceState, relationships } = state;

    if (character.energy < 20) return;
    if (romanceState.partnerId && romanceState.partnerId !== npcId) return;

    const energyChange = -20;
    const romanceChange = 10;
    const baseHappinessChange = 10;

    const newCharacter = {
      ...character,
      energy: clamp(character.energy + energyChange, 0, character.maxEnergy),
      happiness: clamp(character.happiness + baseHappinessChange, 0, 100),
    };

    // Apply identity mood effect for socialize-like activity
    const moodDesc = state.applyIdentityMoodEffect('socialize');

    // Update relationship
    const existing = relationships.find((r) => r.npcId === npcId);
    let newRelationships = relationships;
    if (existing) {
      newRelationships = relationships.map((r) =>
        r.npcId === npcId
          ? { ...r, romance: clamp(r.romance + romanceChange, 0, 100) }
          : r,
      );
    }

    const newRomanceState = {
      ...romanceState,
      datesCompleted: romanceState.datesCompleted + 1,
    };

    const notifications = [...state.notifications];
    notifications.push({ id: crypto.randomUUID(), text: `精力 ${energyChange}`, type: 'negative' as const });
    notifications.push({ id: crypto.randomUUID(), text: `浪漫度 +${romanceChange}`, type: 'positive' as const });
    notifications.push({ id: crypto.randomUUID(), text: `心情 +${baseHappinessChange}`, type: 'positive' as const });
    if (moodDesc) notifications.push({ id: crypto.randomUUID(), text: `心情变化：${moodDesc}`, type: 'positive' as const });

    set({ character: newCharacter, relationships: newRelationships, romanceState: newRomanceState, notifications });
  },

  confess: (npcId) => {
    const state = get();
    const { character, relationships, romanceState } = state;

    if (romanceState.partnerId) return; // already in a relationship

    const rel = relationships.find((r) => r.npcId === npcId);
    if (!rel || rel.trust < 50 || rel.romance < 30) return;

    // Success based on trust + charisma + luck
    const successChance = (rel.trust + character.stats.charisma * 2 + character.stats.luck) / 200;
    const success = Math.random() < successChance;

    const notifications = [...state.notifications];

    if (success) {
      const newRomanceState = {
        partnerId: npcId,
        datingLevel: 1,
        datesCompleted: 0,
      };
      const newRelationships = relationships.map((r) =>
        r.npcId === npcId
          ? { ...r, romance: clamp(r.romance + 20, 0, 100) }
          : r,
      );
      const newCharacter = {
        ...character,
        happiness: clamp(character.happiness + 20, 0, 100),
      };
      notifications.push({ id: crypto.randomUUID(), text: '表白成功！你们开始交往了！', type: 'positive' as const });
      set({ romanceState: newRomanceState, relationships: newRelationships, character: newCharacter, notifications });
    } else {
      const newCharacter = {
        ...character,
        happiness: clamp(character.happiness - 10, 0, 100),
      };
      notifications.push({ id: crypto.randomUUID(), text: '表白失败了……', type: 'negative' as const });
      set({ character: newCharacter, notifications });
    }
  },

  breakUp: () => {
    const state = get();
    const { romanceState, character } = state;

    if (!romanceState.partnerId) return;

    const newCharacter = {
      ...character,
      happiness: clamp(character.happiness - 30, 0, 100),
    };

    const newRomanceState: typeof romanceState = {
      partnerId: null,
      datingLevel: 0,
      datesCompleted: 0,
    };

    const notifications = [...state.notifications];
    notifications.push({ id: crypto.randomUUID(), text: '你们分手了……心情 -30', type: 'negative' as const });

    set({ character: newCharacter, romanceState: newRomanceState, notifications });
  },

  applyIdentityMoodEffect: (activity) => {
    const { character } = get();
    const identityData = identities.find((i) => i.id === character.identity);
    if (!identityData) return null;

    // Check mood triggers
    const trigger = identityData.moodTriggers.find((t) => t.activity === activity);
    if (trigger) {
      set((s) => ({
        character: {
          ...s.character,
          happiness: clamp(s.character.happiness + trigger.happinessGain, 0, 100),
        },
      }));
      return `+${trigger.happinessGain} ${trigger.description}`;
    }

    // Check mood drains
    const drain = identityData.moodDrains.find((d) => d.activity === activity);
    if (drain) {
      set((s) => ({
        character: {
          ...s.character,
          happiness: clamp(s.character.happiness - drain.happinessLoss, 0, 100),
        },
      }));
      return `-${drain.happinessLoss} ${drain.description}`;
    }

    return null;
  },

  // ----- Event actions -----------------------------------------------------

  setCurrentEvent: (event) => set({ currentEvent: event }),

  resolveChoice: (choiceIndex) => {
    const { currentEvent, flags, eventLog, character, relationships, pendingEvents, ngplus } =
      get();
    if (!currentEvent || choiceIndex >= currentEvent.choices.length) return;

    const choice = currentEvent.choices[choiceIndex];
    const consequences = choice.consequences;
    const reduction = ngplus.negativeEventReduction;

    // --- Character stat changes ---
    const newStats = { ...character.stats };
    if (consequences.stats) {
      for (const [key, value] of Object.entries(consequences.stats)) {
        if (key in newStats) {
          // Apply negative event reduction for negative stat changes
          const adjustedValue = value < 0 ? Math.round(value * (1 - reduction)) : value;
          (newStats as Record<string, number>)[key] = clamp(
            (newStats as Record<string, number>)[key] + adjustedValue,
            1,
            100,
          );
        }
      }
    }

    let newEnergy = character.energy;
    let newStress = character.stress;
    let newHappiness = character.happiness;

    if (consequences.energy !== undefined) {
      // Apply negative event reduction for negative energy changes
      const adjustedEnergy = consequences.energy < 0
        ? Math.round(consequences.energy * (1 - reduction))
        : consequences.energy;
      newEnergy = clamp(character.energy + adjustedEnergy, 0, character.maxEnergy);
    }
    if (consequences.stress !== undefined) {
      // Apply negative event reduction for positive stress changes (stress increase is negative)
      const adjustedStress = consequences.stress > 0
        ? Math.round(consequences.stress * (1 - reduction))
        : consequences.stress;
      newStress = clamp(character.stress + adjustedStress, 0, 100);
    }
    if (consequences.happiness !== undefined) {
      // Apply negative event reduction for negative happiness changes
      const adjustedHappiness = consequences.happiness < 0
        ? Math.round(consequences.happiness * (1 - reduction))
        : consequences.happiness;
      newHappiness = clamp(character.happiness + adjustedHappiness, 0, 100);
    }

    // --- Flag changes ---
    const newFlags = [...flags];
    if (consequences.flags) {
      for (const flag of consequences.flags) {
        if (!newFlags.includes(flag)) {
          newFlags.push(flag);
        }
      }
    }

    // --- Relationship changes ---
    let newRelationships = relationships;
    if (consequences.relationships) {
      newRelationships = relationships.map((r) => {
        const change = consequences.relationships![r.npcId];
        if (change !== undefined) {
          const newTrust = clamp(r.trust + change, 0, 100);
          return { ...r, trust: newTrust, tier: getRelationshipTier(newTrust) };
        }
        return r;
      });
    }

    // --- Remove from pending events ---
    const newPendingEvents = pendingEvents.filter(
      (e) => e.id !== currentEvent.id,
    );

    set({
      currentEvent: null,
      pendingEvents: newPendingEvents,
      eventLog: [
        ...eventLog,
        { eventId: currentEvent.id, choiceIndex, week: character.week },
      ],
      character: {
        ...character,
        stats: newStats,
        energy: newEnergy,
        stress: newStress,
        happiness: newHappiness,
      },
      flags: newFlags,
      relationships: newRelationships,
    });
  },

  dismissEvent: () => set({ currentEvent: null }),

  // ----- Exam actions ------------------------------------------------------

  startExam: (subjectId) =>
    set({
      examState: {
        subjectId,
        currentQuestion: 0,
        totalQuestions: 10,
        correctAnswers: 0,
        active: true,
      },
      gamePhase: 'exam',
    }),

  answerExamQuestion: (correct) => {
    const { examState } = get();
    if (!examState || !examState.active) return;
    set({
      examState: {
        ...examState,
        currentQuestion: examState.currentQuestion + 1,
        correctAnswers: examState.correctAnswers + (correct ? 1 : 0),
      },
    });
  },

  finishExam: () => {
    const { examState, academics } = get();
    if (!examState) return;

    const score = examState.correctAnswers / examState.totalQuestions;
    const masteryGain = Math.round(score * 10);

    set({
      examState: null,
      academics: academics.map((a) =>
        a.subjectId === examState.subjectId
          ? { ...a, mastery: clamp(a.mastery + masteryGain, 0, 100) }
          : a,
      ),
      gamePhase: 'playing',
    });
  },

  // ----- Stat update actions -----------------------------------------------

  updateStats: (changes) =>
    set((s) => {
      const next = { ...s.character.stats };
      for (const [key, value] of Object.entries(changes)) {
        if (key in next) {
          (next as Record<string, number>)[key] = clamp(
            (next as Record<string, number>)[key] + value,
            1,
            100,
          );
        }
      }
      return { character: { ...s.character, stats: next } };
    }),

  updateEnergy: (change) =>
    set((s) => ({
      character: {
        ...s.character,
        energy: clamp(s.character.energy + change, 0, s.character.maxEnergy),
      },
    })),

  updateStress: (change) =>
    set((s) => ({
      character: {
        ...s.character,
        stress: clamp(s.character.stress + change, 0, 100),
      },
    })),

  updateHappiness: (change) =>
    set((s) => ({
      character: {
        ...s.character,
        happiness: clamp(s.character.happiness + change, 0, 100),
      },
    })),

  updateRelationship: (npcId, trustChange, romanceChange = 0) => {
    const { relationships } = get();
    const existing = relationships.find((r) => r.npcId === npcId);

    if (existing) {
      const newTrust = clamp(existing.trust + trustChange, 0, 100);
      set({
        relationships: relationships.map((r) =>
          r.npcId === npcId
            ? {
                ...r,
                trust: newTrust,
                romance: clamp(r.romance + romanceChange, 0, 100),
                tier: getRelationshipTier(newTrust),
              }
            : r,
        ),
      });
    } else {
      const newTrust = clamp(50 + trustChange, 0, 100);
      const newRel: Relationship = {
        npcId,
        trust: newTrust,
        romance: clamp(romanceChange, 0, 100),
        tier: getRelationshipTier(newTrust),
      };
      set({ relationships: [...relationships, newRel] });
    }
  },

  updateMastery: (subjectId, change) =>
    set((s) => ({
      academics: s.academics.map((a) =>
        a.subjectId === subjectId
          ? { ...a, mastery: clamp(a.mastery + change, 0, 100) }
          : a,
      ),
    })),

  updateClubSkill: (clubId, change) =>
    set((s) => ({
      clubs: s.clubs.map((c) =>
        c.clubId === clubId
          ? { ...c, skill: clamp(c.skill + change, 0, 100) }
          : c,
      ),
    })),

  // ----- Club actions ------------------------------------------------------

  joinClub: (clubId) => {
    const { clubs, ngplus } = get();
    if (clubs.some((c) => c.clubId === clubId)) return;
    if (clubs.length >= ngplus.clubLimit) return;
    const newClub: ClubMembership = {
      clubId,
      role: 'member',
      commitment: 1,
      skill: 0,
    };
    set({ clubs: [...clubs, newClub] });
  },

  leaveClub: (clubId) =>
    set((s) => ({ clubs: s.clubs.filter((c) => c.clubId !== clubId) })),

  // ----- Flag actions ------------------------------------------------------

  setFlag: (flag) => {
    const { flags } = get();
    if (flags.includes(flag)) return;
    set({ flags: [...flags, flag] });
  },

  hasFlag: (flag) => get().flags.includes(flag),

  // ----- Notification actions -----------------------------------------------

  addNotification: (text, type) => {
    const { notifications } = get();
    set({ notifications: [...notifications, { id: crypto.randomUUID(), text, type }] });
  },

  removeNotification: (id) => {
    const { notifications } = get();
    set({ notifications: notifications.filter((n) => n.id !== id) });
  },

  // ----- Save / Load -------------------------------------------------------

  saveGame: () => {
    const state = get();
    const serializable: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(state)) {
      if (typeof value !== 'function') {
        serializable[key] = value;
      }
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializable));
  },

  loadGame: () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return false;
    try {
      const state = JSON.parse(saved);
      set(state);
      return true;
    } catch {
      return false;
    }
  },

  hasSave: () => localStorage.getItem(SAVE_KEY) !== null,

  newGame: () => {
    const { ngplus } = get();
    set({
      ...initialState,
      ngplus: {
        ...initialState.ngplus,
        playthrough: ngplus.playthrough,
        unlockedTalents: ngplus.unlockedTalents,
        unlockedAchievements: ngplus.unlockedAchievements,
        completedEndings: ngplus.completedEndings,
        unlockedSkins: ngplus.unlockedSkins,
        achievementPoints: ngplus.achievementPoints,
      },
    });
  },

  resetFullGame: () => set(initialState),

  // ----- NG+ actions -------------------------------------------------------

  selectTalent: (talentId) => {
    const { ngplus } = get();
    const talentData = talents.find((t) => t.id === talentId);
    if (!talentData) return;
    if (!ngplus.isNGPlus) return; // talents only available in NG+
    set({
      ngplus: {
        ...ngplus,
        selectedTalent: talentId,
        unlockedTalents: ngplus.unlockedTalents.includes(talentId)
          ? ngplus.unlockedTalents
          : [...ngplus.unlockedTalents, talentId],
      },
    });
  },

  unlockAchievement: (achievementId) => {
    const { ngplus } = get();
    if (ngplus.unlockedAchievements.includes(achievementId)) return;
    const achievementData = achievements.find((a) => a.id === achievementId);
    if (!achievementData) return;
    const points = ACHIEVEMENT_POINTS[achievementId] ?? 10;
    set({
      ngplus: {
        ...ngplus,
        unlockedAchievements: [...ngplus.unlockedAchievements, achievementId],
        achievementPoints: ngplus.achievementPoints + points,
      },
    });
  },

  unlockSkin: (skinId) => {
    const { ngplus } = get();
    if (ngplus.unlockedSkins.includes(skinId)) return;
    const skinData = skins.find((s) => s.id === skinId);
    if (!skinData) return;
    if (ngplus.achievementPoints < skinData.cost) return;
    set({
      ngplus: {
        ...ngplus,
        unlockedSkins: [...ngplus.unlockedSkins, skinId],
        achievementPoints: ngplus.achievementPoints - skinData.cost,
      },
    });
  },

  setActiveSkin: (skinId) => {
    const { ngplus } = get();
    if (!ngplus.unlockedSkins.includes(skinId)) return;
    set({
      ngplus: {
        ...ngplus,
        activeSkin: skinId,
      },
    });
  },

  startNGPlus: () => {
    const state = get();
    const { ngplus, character } = state;

    // 1. Calculate inheritance rate based on unlocked achievements
    const nextPlaythrough = ngplus.playthrough + 1;
    const inheritanceRate = calculateInheritanceRate(ngplus.unlockedAchievements);

    // 2. Save current character stats as inheritedStats (multiplied by inheritance rate, rounded)
    const inheritedStats: StatBlock = {
      intelligence: Math.round(character.stats.intelligence * inheritanceRate),
      charisma: Math.round(character.stats.charisma * inheritanceRate),
      athleticism: Math.round(character.stats.athleticism * inheritanceRate),
      creativity: Math.round(character.stats.creativity * inheritanceRate),
      diligence: Math.round(character.stats.diligence * inheritanceRate),
      luck: Math.round(character.stats.luck * inheritanceRate),
    };

    // 3. Get NG+ config for next playthrough
    const config = getNGPlusConfig(nextPlaythrough, ngplus.unlockedAchievements);

    // 4. Determine talent: allow talent selection for NG+ playthroughs
    let selectedTalent: string | null = null;
    if (nextPlaythrough >= 3) {
      // Allow talent selection - player will choose via selectTalent action
      selectedTalent = null;
    } else {
      // Random talent from available talents
      const availableTalents = talents;
      if (availableTalents.length > 0) {
        selectedTalent =
          availableTalents[Math.floor(Math.random() * availableTalents.length)].id;
      }
    }

    // 5. Reset game state but keep ngplus data, apply NG+ config
    set({
      ...initialState,
      character: {
        ...initialState.character,
        stats: { ...DEFAULT_STATS },
      },
      ngplus: {
        ...initialState.ngplus,
        playthrough: nextPlaythrough,
        isNGPlus: true,
        isFreeMode: config.isFreeMode,
        selectedTalent,
        unlockedTalents: ngplus.unlockedTalents,
        unlockedAchievements: ngplus.unlockedAchievements,
        completedEndings: ngplus.completedEndings,
        unlockedSkins: ngplus.unlockedSkins,
        achievementPoints: ngplus.achievementPoints,
        activeSkin: ngplus.activeSkin,
        clubLimit: config.clubLimit,
        negativeEventReduction: config.negativeEventReduction,
        studyEfficiencyBonus: config.studyEfficiencyBonus,
        inheritedStats,
      },
      gamePhase: 'creating',
    });
  },

  checkAchievements: () => {
    const state = get();
    const checkState = {
      stats: { ...state.character.stats } as Record<string, number>,
      gpa: state.character.gpa,
      relationships: state.relationships.map((r) => ({
        npcId: r.npcId,
        trust: r.trust,
        romance: r.romance,
      })),
      clubs: state.clubs.map((c) => ({
        clubId: c.clubId,
        skill: c.skill,
        role: c.role,
      })),
      academics: state.academics.map((a) => ({
        subjectId: a.subjectId,
        mastery: a.mastery,
      })),
      flags: [...state.flags],
      completedEndings: [...state.ngplus.completedEndings],
      playthrough: state.ngplus.playthrough,
      happiness: state.character.happiness,
      stress: state.character.stress,
      romanceState: { partnerId: state.romanceState.partnerId, datingLevel: state.romanceState.datingLevel },
      eventLog: [...state.eventLog],
    };

    const newUnlocked = [...state.ngplus.unlockedAchievements];
    let newPoints = state.ngplus.achievementPoints;

    for (const achievement of achievements) {
      if (newUnlocked.includes(achievement.id)) continue;
      if (checkAchievementCondition(achievement.id, checkState)) {
        newUnlocked.push(achievement.id);
        newPoints += ACHIEVEMENT_POINTS[achievement.id] ?? 10;
      }
    }

    if (newUnlocked.length !== state.ngplus.unlockedAchievements.length) {
      set({
        ngplus: {
          ...state.ngplus,
          unlockedAchievements: newUnlocked,
          achievementPoints: newPoints,
        },
      });
    }
  },

  // ----- Phase management --------------------------------------------------

  setGamePhase: (phase) =>
    set({ gamePhase: phase as GameState['gamePhase'] }),

  setEndingType: (type) => set({ endingType: type }),
}));
