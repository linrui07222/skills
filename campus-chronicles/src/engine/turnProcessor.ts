// Turn Processor — handles the weekly game loop.
// Processes scheduled activities for each day/time-slot, updates character stats,
// checks for and triggers events, advances time, and manages energy/stress/happiness.

import type {
  GameState,
  ActivityDef,
  MilestoneDef,
  DifficultyPreset,
} from './types';
import { DIFFICULTY_PRESETS } from './types';
import { checkForEvents } from './eventSystem';
import { calculateMasteryGain } from './academicSystem';

// ---------------------------------------------------------------------------
// Activity definitions (will eventually come from src/data/activities.ts)
// ---------------------------------------------------------------------------

const ACTIVITIES: Record<string, ActivityDef> = {
  class: {
    id: 'class',
    energyCost: 15,
    stressChange: 3,
    happinessChange: 0,
    statBoosts: { diligence: 1 },
    masterySubject: undefined, // set dynamically based on schedule
    masteryGain: 0, // calculated via academicSystem
  },
  homework: {
    id: 'homework',
    energyCost: 12,
    stressChange: 5,
    happinessChange: -1,
    statBoosts: { diligence: 1, intelligence: 1 },
    masteryGain: 0,
  },
  study: {
    id: 'study',
    energyCost: 10,
    stressChange: 4,
    happinessChange: -1,
    statBoosts: { intelligence: 2 },
    masteryGain: 0,
  },
  socialize: {
    id: 'socialize',
    energyCost: 8,
    stressChange: -3,
    happinessChange: 4,
    statBoosts: { charisma: 2 },
    masteryGain: 0,
  },
  club: {
    id: 'club',
    energyCost: 12,
    stressChange: -1,
    happinessChange: 3,
    statBoosts: { creativity: 1, athleticism: 1 },
    masteryGain: 0,
  },
  exercise: {
    id: 'exercise',
    energyCost: 14,
    stressChange: -5,
    happinessChange: 3,
    statBoosts: { athleticism: 2 },
    masteryGain: 0,
  },
  rest: {
    id: 'rest',
    energyCost: -20, // negative = energy gain
    stressChange: -4,
    happinessChange: 2,
    statBoosts: {},
    masteryGain: 0,
  },
  part_time: {
    id: 'part_time',
    energyCost: 18,
    stressChange: 6,
    happinessChange: -2,
    statBoosts: { diligence: 1 },
    masteryGain: 0,
  },
  creative: {
    id: 'creative',
    energyCost: 10,
    stressChange: -2,
    happinessChange: 5,
    statBoosts: { creativity: 2 },
    masteryGain: 0,
  },
};

// Milestone definitions — major events that occur at specific weeks.
const MILESTONES: MilestoneDef[] = [
  { id: 'freshman_orientation', title: 'Freshman Orientation', minWeek: 1, maxWeek: 2, year: 1, category: 'story' },
  { id: 'midterm_fall', title: 'Fall Midterms', minWeek: 9, maxWeek: 10, year: 0, category: 'exam' },
  { id: 'finals_fall', title: 'Fall Finals', minWeek: 19, maxWeek: 20, year: 0, category: 'exam' },
  { id: 'midterm_spring', title: 'Spring Midterms', minWeek: 29, maxWeek: 30, year: 0, category: 'exam' },
  { id: 'finals_spring', title: 'Spring Finals', minWeek: 39, maxWeek: 40, year: 0, category: 'exam' },
  { id: 'prom', title: 'Prom', minWeek: 36, maxWeek: 38, year: 3, category: 'social' },
  { id: 'senior_decisions', title: 'Senior Decisions', minWeek: 35, maxWeek: 38, year: 4, category: 'story' },
  { id: 'graduation', title: 'Graduation', minWeek: 40, maxWeek: 40, year: 4, category: 'story' },
];

// ---------------------------------------------------------------------------
// Helper: clamp a number between min and max
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ---------------------------------------------------------------------------
// Difficulty helpers
// ---------------------------------------------------------------------------

function getDifficulty(state: GameState): DifficultyPreset {
  return DIFFICULTY_PRESETS[state.character.difficulty] ?? DIFFICULTY_PRESETS.normal;
}

// ---------------------------------------------------------------------------
// Energy / Stress / Happiness calculations
// ---------------------------------------------------------------------------

export function calculateEnergyChange(activity: string, state: GameState): number {
  const def = ACTIVITIES[activity];
  if (!def) return 0;

  const difficulty = getDifficulty(state);
  const baseChange = -def.energyCost; // energyCost is positive = cost, so negate

  // Evening activities cost more energy (fatigue)
  const slotModifier = state.character.currentSlot === 'evening' ? 0.85 : 1.0;

  // Low energy activities are less effective when already tired
  const fatigueModifier = state.character.energy < 20 ? 0.7 : 1.0;

  return Math.round(baseChange * slotModifier * fatigueModifier * difficulty.energyMultiplier);
}

export function calculateStressChange(activity: string, state: GameState): number {
  const def = ACTIVITIES[activity];
  if (!def) return 0;

  const difficulty = getDifficulty(state);
  let change = def.stressChange;

  // Stress compounds: being already stressed makes things worse
  if (change > 0 && state.character.stress > 60) {
    change = Math.round(change * 1.3);
  }

  // High diligence reduces stress gain
  const diligenceReduction = state.character.stats.diligence * 0.02;
  if (change > 0) {
    change = Math.round(change * (1 - diligenceReduction));
  }

  return clamp(Math.round(change * difficulty.stressMultiplier), -20, 20);
}

function calculateHappinessChange(activity: string, state: GameState): number {
  const def = ACTIVITIES[activity];
  if (!def) return 0;

  let change = def.happinessChange;

  // Very high stress reduces happiness gains
  if (change > 0 && state.character.stress > 70) {
    change = Math.round(change * 0.6);
  }

  // Very low energy reduces happiness gains
  if (change > 0 && state.character.energy < 15) {
    change = Math.round(change * 0.5);
  }

  return clamp(change, -10, 10);
}

// ---------------------------------------------------------------------------
// Stat boosts from activities
// ---------------------------------------------------------------------------

function applyStatBoosts(state: GameState, activity: string): GameState {
  const def = ACTIVITIES[activity];
  if (!def || !def.statBoosts) return state;

  const newStats = { ...state.character.stats };
  for (const [stat, boost] of Object.entries(def.statBoosts)) {
    if (stat in newStats && boost !== undefined) {
      // Stats are 1-100, gain diminishes at higher levels
      const current = newStats[stat as keyof typeof newStats];
      const diminishingFactor = Math.max(0.2, 1 - current / 120);
      newStats[stat as keyof typeof newStats] = clamp(
        current + Math.round(boost * diminishingFactor),
        1,
        100,
      );
    }
  }

  return {
    ...state,
    character: { ...state.character, stats: newStats },
  };
}

// ---------------------------------------------------------------------------
// Process a single day/time-slot
// ---------------------------------------------------------------------------

export function processDay(
  state: GameState,
  day: number,
  slot: 'morning' | 'afternoon' | 'evening',
): GameState {
  // Find the scheduled activity for this slot
  const scheduled = state.schedule.find(
    (s) => s.day === day && s.slot === slot,
  );

  if (!scheduled) {
    // No activity scheduled — character rests by default
    return applySlotEffects(state, 'rest');
  }

  return applySlotEffects(state, scheduled.activity);
}

function applySlotEffects(
  state: GameState,
  activity: string,
): GameState {
  let newState = { ...state };
  const char = { ...newState.character };

  // 1. Energy change
  const energyDelta = calculateEnergyChange(activity, newState);
  char.energy = clamp(char.energy + energyDelta, 0, char.maxEnergy);

  // 2. Stress change
  const stressDelta = calculateStressChange(activity, newState);
  char.stress = clamp(char.stress + stressDelta, 0, 100);

  // 3. Happiness change
  const happinessDelta = calculateHappinessChange(activity, newState);
  char.happiness = clamp(char.happiness + happinessDelta, 0, 100);

  // 4. High stress penalty: if stress > 80, small happiness drain
  if (char.stress > 80) {
    char.happiness = clamp(char.happiness - 1, 0, 100);
  }

  newState = { ...newState, character: char };

  // 5. Stat boosts
  newState = applyStatBoosts(newState, activity);

  // 6. Academic mastery (for class/homework/study)
  if (activity === 'class' || activity === 'homework' || activity === 'study') {
    newState = applyMasteryForActivity(newState, activity);
  }

  // 7. Club skill improvement
  if (activity === 'club') {
    newState = applyClubSkillGain(newState);
  }

  // 8. Social interaction
  if (activity === 'socialize') {
    newState = applySocialBenefit(newState);
  }

  // 9. Homework tracking
  if (activity === 'homework') {
    newState = markHomeworkDone(newState);
  }

  return newState;
}

// ---------------------------------------------------------------------------
// Mastery application for academic activities
// ---------------------------------------------------------------------------

function applyMasteryForActivity(
  state: GameState,
  activityType: 'class' | 'homework' | 'study',
): GameState {
  const difficulty = getDifficulty(state);
  const newAcademics = state.academics.map((record) => {
    // Only gain mastery in subjects that are scheduled for today
    // For simplicity, class applies to all enrolled subjects,
    // homework/study apply to the subject with lowest mastery
    if (activityType === 'class') {
      const gain = calculateMasteryGain(record.subjectId, activityType, state);
      return {
        ...record,
        mastery: clamp(record.mastery + Math.round(gain * difficulty.masteryMultiplier), 0, 100),
      };
    }

    // Homework and study target weakest subject
    return record;
  });

  // For homework/study, find the weakest subject and boost it
  if (activityType !== 'class' && newAcademics.length > 0) {
    const weakestIdx = newAcademics.reduce(
      (minIdx, rec, idx, arr) => (rec.mastery < arr[minIdx].mastery ? idx : minIdx),
      0,
    );
    const gain = calculateMasteryGain(
      newAcademics[weakestIdx].subjectId,
      activityType,
      state,
    );
    newAcademics[weakestIdx] = {
      ...newAcademics[weakestIdx],
      mastery: clamp(
        newAcademics[weakestIdx].mastery + Math.round(gain * difficulty.masteryMultiplier),
        0,
        100,
      ),
    };
  }

  return { ...state, academics: newAcademics };
}

// ---------------------------------------------------------------------------
// Club skill gain
// ---------------------------------------------------------------------------

function applyClubSkillGain(state: GameState): GameState {
  if (state.clubs.length === 0) return state;

  const newClubs = state.clubs.map((club) => {
    // Skill gain diminishes at higher levels
    const diminishingFactor = Math.max(0.2, 1 - club.skill / 120);
    const gain = Math.round(2 * diminishingFactor);
    return {
      ...club,
      skill: clamp(club.skill + gain, 0, 100),
    };
  });

  return { ...state, clubs: newClubs };
}

// ---------------------------------------------------------------------------
// Social benefit from socializing
// ---------------------------------------------------------------------------

function applySocialBenefit(state: GameState): GameState {
  if (state.relationships.length === 0) return state;

  // Boost trust with a random relationship (weighted toward lower trust)
  const sorted = [...state.relationships].sort((a, b) => a.trust - b.trust);
  // Pick from the bottom half (lower trust) with higher probability
  const pool = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 2)));
  const target = pool[Math.floor(Math.random() * pool.length)];

  const newRelationships = state.relationships.map((rel) => {
    if (rel.npcId === target.npcId) {
      const gain = 2 + Math.floor(state.character.stats.charisma / 20);
      return { ...rel, trust: clamp(rel.trust + gain, 0, 100) };
    }
    return rel;
  });

  return { ...state, relationships: newRelationships };
}

// ---------------------------------------------------------------------------
// Mark homework as done for the week
// ---------------------------------------------------------------------------

function markHomeworkDone(state: GameState): GameState {
  // Mark homework done for the weakest subject
  if (state.academics.length === 0) return state;

  const newAcademics = [...state.academics];
  const weakestIdx = newAcademics.reduce(
    (minIdx, rec, idx, arr) => (rec.mastery < arr[minIdx].mastery ? idx : minIdx),
    0,
  );
  newAcademics[weakestIdx] = {
    ...newAcademics[weakestIdx],
    homeworkDone: true,
  };

  return { ...state, academics: newAcademics };
}

// ---------------------------------------------------------------------------
// Advance time to the next slot/day/week
// ---------------------------------------------------------------------------

export function advanceTime(state: GameState): GameState {
  const char = { ...state.character };
  const slots: Array<'morning' | 'afternoon' | 'evening'> = ['morning', 'afternoon', 'evening'];
  const currentIdx = slots.indexOf(char.currentSlot);

  if (currentIdx < 2) {
    // Advance to next slot in the same day
    char.currentSlot = slots[currentIdx + 1];
  } else if (char.day < 6) {
    // Next day, morning
    char.day += 1;
    char.currentSlot = 'morning';
    // Daily energy recovery
    char.energy = clamp(char.energy + 8, 0, char.maxEnergy);
  } else {
    // End of week — handled by processWeek
    char.day = 0;
    char.currentSlot = 'morning';
  }

  return { ...state, character: char };
}

// ---------------------------------------------------------------------------
// Check for milestone events at the current week/year
// ---------------------------------------------------------------------------

function checkMilestones(state: GameState): GameState {
  const { year, week } = state.character;
  const triggered: GameState['pendingEvents'] = [...state.pendingEvents];

  for (const milestone of MILESTONES) {
    // year === 0 means "any year"
    const yearMatch = milestone.year === 0 || milestone.year === year;
    const weekMatch = week >= milestone.minWeek && week <= milestone.maxWeek;

    if (yearMatch && weekMatch) {
      // Don't re-trigger if already in pending or logged this week
      const alreadyPending = triggered.some((e) => e.id === milestone.id);
      const alreadyLogged = state.eventLog.some(
        (e) => e.eventId === milestone.id && e.week === week,
      );
      if (!alreadyPending && !alreadyLogged) {
        triggered.push({
          id: milestone.id,
          title: milestone.title,
          description: `It's time for ${milestone.title}!`,
          choices: [],
          category: milestone.category,
        });
      }
    }
  }

  return { ...state, pendingEvents: triggered };
}

// ---------------------------------------------------------------------------
// Weekly reset: reset homework flags, apply weekly recovery
// ---------------------------------------------------------------------------

function weeklyReset(state: GameState): GameState {
  const char = { ...state.character };

  // Weekly energy recovery
  char.energy = clamp(char.energy + 15, 0, char.maxEnergy);

  // Stress naturally decays a bit
  char.stress = clamp(char.stress - 5, 0, 100);

  // Happiness drifts toward 50 (neutral)
  if (char.happiness > 50) {
    char.happiness = clamp(char.happiness - 2, 0, 100);
  } else if (char.happiness < 50) {
    char.happiness = clamp(char.happiness + 2, 0, 100);
  }

  // Reset homework flags for the new week
  const newAcademics = state.academics.map((rec) => ({
    ...rec,
    homeworkDone: false,
  }));

  return {
    ...state,
    character: char,
    academics: newAcademics,
  };
}

// ---------------------------------------------------------------------------
// Process an entire week
// ---------------------------------------------------------------------------

export function processWeek(state: GameState): GameState {
  let newState = { ...state };

  // Process each day and each time slot
  for (let day = 0; day < 7; day++) {
    const slots: Array<'morning' | 'afternoon' | 'evening'> = ['morning', 'afternoon', 'evening'];
    for (const slot of slots) {
      newState = processDay(newState, day, slot);
    }
  }

  // Check for milestone events
  newState = checkMilestones(newState);

  // Check for random events
  const randomEvents = checkForEvents(newState);
  if (randomEvents.length > 0) {
    newState = {
      ...newState,
      pendingEvents: [...newState.pendingEvents, ...randomEvents],
    };
  }

  // Apply weekly reset
  newState = weeklyReset(newState);

  // Advance to next week
  newState = advanceWeek(newState);

  // Check for year-end
  newState = checkYearEnd(newState);

  return newState;
}

// ---------------------------------------------------------------------------
// Advance the week counter
// ---------------------------------------------------------------------------

function advanceWeek(state: GameState): GameState {
  const char = { ...state.character };
  char.week += 1;
  char.day = 0;
  char.currentSlot = 'morning';

  // If week exceeds 40, advance to next year
  if (char.week > 40) {
    char.week = 1;
    char.year += 1;
  }

  return { ...state, character: char };
}

// ---------------------------------------------------------------------------
// Check if the year or game has ended
// ---------------------------------------------------------------------------

function checkYearEnd(state: GameState): GameState {
  const { year, week } = state.character;

  // Senior year, week 40 = game over
  if (year >= 4 && week >= 40) {
    return {
      ...state,
      gamePhase: 'ending',
      endingType: determineEnding(state),
    };
  }

  // Year transition — could trigger year-end events
  if (week === 40 && year < 4) {
    return {
      ...state,
      pendingEvents: [
        ...state.pendingEvents,
        {
          id: `year_end_${year}`,
          title: `Year ${year} Complete!`,
          description: `You've finished your ${yearName(year)} year. Time to reflect on your progress.`,
          choices: [],
          category: 'story',
        },
      ],
    };
  }

  return state;
}

function yearName(year: number): string {
  const names: Record<number, string> = {
    1: 'freshman',
    2: 'sophomore',
    3: 'junior',
    4: 'senior',
  };
  return names[year] ?? 'unknown';
}

// ---------------------------------------------------------------------------
// Determine the ending type based on accumulated stats
// ---------------------------------------------------------------------------

function determineEnding(state: GameState): string {
  const { gpa, stats, happiness } = state.character;
  const { clubs, relationships } = state;

  // Valedictorian: very high GPA
  if (gpa >= 3.9) return 'valedictorian';

  // Popular Star: high charisma + many close relationships
  const closeFriends = relationships.filter((r) => r.trust >= 70).length;
  if (stats.charisma >= 80 && closeFriends >= 5) return 'popular_star';

  // Athlete Champion: high athleticism + club leadership
  const athleteClub = clubs.find(
    (c) => c.clubId === 'basketball' && c.role === 'president',
  );
  if (stats.athleticism >= 80 && athleteClub) return 'athlete_champion';

  // Artist Prodigy: high creativity
  if (stats.creativity >= 85) return 'artist_prodigy';

  // Dropout: very low GPA + low happiness
  if (gpa < 1.0 && happiness < 20) return 'dropout';

  // Burnout: very high stress path
  if (state.character.stress >= 90) return 'burnout';

  // Average Graduate: default
  return 'average_graduate';
}
