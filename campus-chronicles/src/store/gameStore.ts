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

// ---------------------------------------------------------------------------
// Store interface (extends GameState with actions)
// ---------------------------------------------------------------------------

interface GameStore extends GameState {
  // Character creation actions
  setCharacterName: (name: string) => void;
  setCharacterAppearance: (appearance: string) => void;
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

  // Save / Load
  saveGame: () => void;
  loadGame: () => boolean;
  hasSave: () => boolean;
  newGame: () => void;

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

  setCharacterAppearance: (appearance) =>
    set((s) => ({ character: { ...s.character, appearance } })),

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
    const { character } = get();
    const academics: AcademicRecord[] = subjects.map((sub) => ({
      subjectId: sub.id,
      mastery: 10,
      grade: '',
      homeworkDone: false,
    }));
    set({
      character: {
        ...character,
        year: 1,
        week: 1,
        day: 0,
        currentSlot: 'morning',
        energy: character.maxEnergy,
        stress: 0,
        happiness: 50,
        gpa: 0,
      },
      academics,
      relationships: [],
      clubs: [],
      schedule: [],
      currentEvent: null,
      pendingEvents: [],
      examState: null,
      eventLog: [],
      flags: [],
      gamePhase: 'playing',
      endingType: null,
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

  attendClass: (subjectId) =>
    set((s) => ({
      academics: s.academics.map((a) =>
        a.subjectId === subjectId
          ? { ...a, mastery: clamp(a.mastery + 3, 0, 100) }
          : a,
      ),
      character: {
        ...s.character,
        energy: clamp(s.character.energy - 15, 0, s.character.maxEnergy),
        stress: clamp(s.character.stress + 2, 0, 100),
      },
    })),

  doHomework: (subjectId) =>
    set((s) => ({
      academics: s.academics.map((a) =>
        a.subjectId === subjectId
          ? { ...a, mastery: clamp(a.mastery + 1, 0, 100), homeworkDone: true }
          : a,
      ),
      character: {
        ...s.character,
        energy: clamp(s.character.energy - 10, 0, s.character.maxEnergy),
        stress: clamp(s.character.stress + 3, 0, 100),
      },
    })),

  study: (subjectId) =>
    set((s) => ({
      academics: s.academics.map((a) =>
        a.subjectId === subjectId
          ? { ...a, mastery: clamp(a.mastery + 5, 0, 100) }
          : a,
      ),
      character: {
        ...s.character,
        energy: clamp(s.character.energy - 20, 0, s.character.maxEnergy),
        stress: clamp(s.character.stress + 5, 0, 100),
      },
    })),

  socialize: (npcId) => {
    const { relationships, character } = get();
    const existing = relationships.find((r) => r.npcId === npcId);

    const charUpdate = {
      ...character,
      energy: clamp(character.energy - 10, 0, character.maxEnergy),
      stress: clamp(character.stress - 5, 0, 100),
      happiness: clamp(character.happiness + 5, 0, 100),
    };

    if (existing) {
      const newTrust = clamp(existing.trust + 5, 0, 100);
      set({
        relationships: relationships.map((r) =>
          r.npcId === npcId
            ? { ...r, trust: newTrust, tier: getRelationshipTier(newTrust) }
            : r,
        ),
        character: charUpdate,
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
      });
    }
  },

  attendClub: (clubId) =>
    set((s) => ({
      clubs: s.clubs.map((c) =>
        c.clubId === clubId
          ? { ...c, skill: clamp(c.skill + 3, 0, 100) }
          : c,
      ),
      character: {
        ...s.character,
        energy: clamp(s.character.energy - 15, 0, s.character.maxEnergy),
        stress: clamp(s.character.stress - 5, 0, 100),
        happiness: clamp(s.character.happiness + 3, 0, 100),
      },
    })),

  rest: () =>
    set((s) => ({
      character: {
        ...s.character,
        energy: clamp(s.character.energy + 40, 0, s.character.maxEnergy),
        stress: clamp(s.character.stress - 15, 0, 100),
        happiness: clamp(s.character.happiness + 5, 0, 100),
      },
    })),

  // ----- Event actions -----------------------------------------------------

  setCurrentEvent: (event) => set({ currentEvent: event }),

  resolveChoice: (choiceIndex) => {
    const { currentEvent, flags, eventLog, character, relationships, pendingEvents } =
      get();
    if (!currentEvent || choiceIndex >= currentEvent.choices.length) return;

    const choice = currentEvent.choices[choiceIndex];
    const consequences = choice.consequences;

    // --- Character stat changes ---
    const newStats = { ...character.stats };
    if (consequences.stats) {
      for (const [key, value] of Object.entries(consequences.stats)) {
        if (key in newStats) {
          (newStats as Record<string, number>)[key] = clamp(
            (newStats as Record<string, number>)[key] + value,
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
      newEnergy = clamp(character.energy + consequences.energy, 0, character.maxEnergy);
    }
    if (consequences.stress !== undefined) {
      newStress = clamp(character.stress + consequences.stress, 0, 100);
    }
    if (consequences.happiness !== undefined) {
      newHappiness = clamp(character.happiness + consequences.happiness, 0, 100);
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
    const { clubs } = get();
    if (clubs.some((c) => c.clubId === clubId)) return;
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

  newGame: () => set(initialState),

  // ----- Phase management --------------------------------------------------

  setGamePhase: (phase) =>
    set({ gamePhase: phase as GameState['gamePhase'] }),

  setEndingType: (type) => set({ endingType: type }),
}));
