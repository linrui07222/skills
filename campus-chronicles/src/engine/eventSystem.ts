// Event System — triggers and resolves story events.
// Checks which events should fire based on current game state,
// resolves player choices with consequences, and tracks history to prevent repeats.

import type { GameState, GameEvent } from './types';
import { DIFFICULTY_PRESETS } from './types';

// ---------------------------------------------------------------------------
// Event condition evaluators
// ---------------------------------------------------------------------------

interface EventCondition {
  type: 'stat' | 'relationship' | 'flag' | 'week' | 'year' | 'club' | 'gpa' | 'stress' | 'happiness';
  target?: string;
  min?: number;
  max?: number;
  value?: string | boolean;
}

// Built-in event definitions — will eventually come from src/data/events.ts.
// These are the events that can trigger during gameplay.
const EVENT_POOL: Array<{
  event: GameEvent;
  conditions: EventCondition[];
  once?: boolean;
  weight: number; // higher = more likely
}> = [
  {
    event: {
      id: 'bully_encounter',
      title: 'Bully Encounter',
      description: 'A bigger student shoves you in the hallway and demands your lunch money.',
      choices: [
        {
          text: 'Stand up for yourself',
          consequences: {
            stats: { charisma: 2, athleticism: 1 },
            stress: 5,
            happiness: 2,
            flags: ['stood_up_to_bully'],
          },
        },
        {
          text: 'Give them the money',
          consequences: {
            stress: 8,
            happiness: -3,
          },
        },
        {
          text: 'Walk away quickly',
          consequences: {
            stats: { diligence: 1 },
            stress: 3,
          },
        },
      ],
      category: 'social',
    },
    conditions: [{ type: 'year', max: 2 }],
    once: true,
    weight: 3,
  },
  {
    event: {
      id: 'study_group_invite',
      title: 'Study Group Invitation',
      description: 'A classmate invites you to join their study group for the upcoming exam.',
      choices: [
        {
          text: 'Join the study group',
          consequences: {
            stats: { intelligence: 2, charisma: 1 },
            stress: -2,
            happiness: 2,
          },
        },
        {
          text: 'Study alone instead',
          consequences: {
            stats: { intelligence: 3 },
            stress: 3,
          },
        },
        {
          text: 'Skip studying',
          consequences: {
            happiness: 3,
            stress: -3,
          },
        },
      ],
      category: 'academic',
    },
    conditions: [{ type: 'stat', target: 'intelligence', min: 20 }],
    weight: 4,
  },
  {
    event: {
      id: 'lost_item',
      title: 'Lost and Found',
      description: 'You find a lost wallet in the hallway. There\'s cash inside but also an ID card.',
      choices: [
        {
          text: 'Return it to the owner',
          consequences: {
            stats: { charisma: 3, diligence: 1 },
            happiness: 3,
            flags: ['returned_wallet'],
          },
        },
        {
          text: 'Take the cash, toss the wallet',
          consequences: {
            happiness: -2,
            stress: 5,
            flags: ['stole_wallet'],
          },
        },
        {
          text: 'Turn it in to the office',
          consequences: {
            stats: { diligence: 2 },
            happiness: 1,
          },
        },
      ],
      category: 'social',
    },
    conditions: [],
    weight: 2,
  },
  {
    event: {
      id: 'talent_show',
      title: 'Talent Show Sign-Up',
      description: 'The school talent show is coming up. Do you want to perform?',
      choices: [
        {
          text: 'Perform a musical piece',
          consequences: {
            stats: { creativity: 3, charisma: 2 },
            stress: 5,
            happiness: 4,
            flags: ['talent_show_performer'],
          },
        },
        {
          text: 'Help with backstage',
          consequences: {
            stats: { diligence: 2, creativity: 1 },
            happiness: 2,
          },
        },
        {
          text: 'Just watch from the audience',
          consequences: {
            happiness: 2,
            stress: -2,
          },
        },
      ],
      category: 'extracurricular',
    },
    conditions: [{ type: 'stat', target: 'creativity', min: 25 }],
    weight: 3,
  },
  {
    event: {
      id: 'teacher_praise',
      title: 'Teacher\'s Praise',
      description: 'Your teacher compliments your recent improvement in class.',
      choices: [
        {
          text: 'Thank them sincerely',
          consequences: {
            stats: { charisma: 1, diligence: 2 },
            happiness: 4,
            stress: -2,
          },
        },
        {
          text: 'Brush it off modestly',
          consequences: {
            stats: { charisma: 2 },
            happiness: 2,
          },
        },
      ],
      category: 'academic',
    },
    conditions: [{ type: 'gpa', min: 2.5 }],
    once: true,
    weight: 2,
  },
  {
    event: {
      id: 'rumor_mill',
      title: 'Rumor Mill',
      description: 'You hear a rumor about a classmate. It\'s juicy but potentially hurtful.',
      choices: [
        {
          text: 'Spread the rumor',
          consequences: {
            stats: { charisma: -1 },
            stress: 2,
            happiness: -1,
            flags: ['spread_rumor'],
          },
        },
        {
          text: 'Keep it to yourself',
          consequences: {
            stats: { diligence: 1 },
            happiness: 1,
          },
        },
        {
          text: 'Confront the source',
          consequences: {
            stats: { charisma: 2 },
            stress: 4,
            flags: ['confronted_rumor'],
          },
        },
      ],
      category: 'social',
    },
    conditions: [{ type: 'stat', target: 'charisma', min: 15 }],
    weight: 3,
  },
  {
    event: {
      id: 'sports_tryout',
      title: 'Sports Tryout Opportunity',
      description: 'The coach notices you in PE and invites you to try out for the team.',
      choices: [
        {
          text: 'Go for the tryout',
          consequences: {
            stats: { athleticism: 3 },
            stress: 5,
            happiness: 3,
            flags: ['tried_out_sports'],
          },
        },
        {
          text: 'Politely decline',
          consequences: {
            stress: -1,
          },
        },
      ],
      category: 'extracurricular',
    },
    conditions: [{ type: 'stat', target: 'athleticism', min: 30 }],
    once: true,
    weight: 3,
  },
  {
    event: {
      id: 'rainy_day',
      title: 'Rainy Day Blues',
      description: 'It\'s been raining all week. The gloom is getting to everyone.',
      choices: [
        {
          text: 'Stay in and read',
          consequences: {
            stats: { intelligence: 2, creativity: 1 },
            stress: -1,
          },
        },
        {
          text: 'Play in the rain with friends',
          consequences: {
            stats: { charisma: 2, athleticism: 1 },
            happiness: 5,
            stress: -3,
          },
        },
        {
          text: 'Mope in your room',
          consequences: {
            happiness: -3,
            stress: 3,
          },
        },
      ],
      category: 'social',
    },
    conditions: [],
    weight: 1,
  },
  {
    event: {
      id: 'cheating_dilemma',
      title: 'The Answer Key',
      description: 'You accidentally find the answer key to tomorrow\'s exam on the teacher\'s desk.',
      choices: [
        {
          text: 'Study the answers',
          consequences: {
            stress: 8,
            flags: ['cheated_on_exam'],
          },
        },
        {
          text: 'Tell the teacher',
          consequences: {
            stats: { diligence: 3 },
            happiness: 2,
            flags: ['reported_answer_key'],
          },
        },
        {
          text: 'Ignore it',
          consequences: {
            stats: { diligence: 1 },
            stress: 2,
          },
        },
      ],
      category: 'academic',
    },
    conditions: [{ type: 'week', min: 8 }, { type: 'week', max: 10 }],
    once: true,
    weight: 2,
  },
  {
    event: {
      id: 'new_student',
      title: 'New Student',
      description: 'A new student transfers into your class. They look lost and alone.',
      choices: [
        {
          text: 'Introduce yourself',
          consequences: {
            stats: { charisma: 2 },
            happiness: 3,
            flags: ['befriended_new_student'],
          },
        },
        {
          text: 'Watch from a distance',
          consequences: {
            stats: { diligence: 1 },
          },
        },
      ],
      category: 'social',
    },
    conditions: [{ type: 'year', min: 2 }],
    once: true,
    weight: 3,
  },
  {
    event: {
      id: 'overworked',
      title: 'Burning Out',
      description: 'You\'ve been pushing yourself too hard. Your body and mind are screaming for a break.',
      choices: [
        {
          text: 'Take a mental health day',
          consequences: {
            stress: -10,
            happiness: 5,
            energy: 20,
          },
        },
        {
          text: 'Push through it',
          consequences: {
            stats: { diligence: 2 },
            stress: 5,
            happiness: -3,
          },
        },
      ],
      category: 'wellness',
    },
    conditions: [{ type: 'stress', min: 70 }],
    weight: 5,
  },
  {
    event: {
      id: 'lucky_break',
      title: 'Lucky Break',
      description: 'Something unexpectedly good happens — you find $20 on the ground and get picked for a fun project!',
      choices: [
        {
          text: 'Celebrate with friends',
          consequences: {
            happiness: 6,
            stress: -3,
            stats: { charisma: 1 },
          },
        },
        {
          text: 'Save the money, focus on the project',
          consequences: {
            stats: { diligence: 2, creativity: 1 },
            happiness: 3,
          },
        },
      ],
      category: 'social',
    },
    conditions: [{ type: 'stat', target: 'luck', min: 50 }],
    once: true,
    weight: 1,
  },
];

// ---------------------------------------------------------------------------
// Condition evaluation
// ---------------------------------------------------------------------------

function evaluateCondition(condition: EventCondition, state: GameState): boolean {
  switch (condition.type) {
    case 'stat': {
      const statValue = state.character.stats[condition.target as keyof typeof state.character.stats];
      if (statValue === undefined) return false;
      if (condition.min !== undefined && statValue < condition.min) return false;
      if (condition.max !== undefined && statValue > condition.max) return false;
      return true;
    }
    case 'relationship': {
      const rel = state.relationships.find((r) => r.npcId === condition.target);
      if (!rel) return false;
      if (condition.min !== undefined && rel.trust < condition.min) return false;
      if (condition.max !== undefined && rel.trust > condition.max) return false;
      return true;
    }
    case 'flag':
      return condition.value === true
        ? state.flags.includes(condition.target ?? '')
        : !state.flags.includes(condition.target ?? '');
    case 'week': {
      if (condition.min !== undefined && state.character.week < condition.min) return false;
      if (condition.max !== undefined && state.character.week > condition.max) return false;
      return true;
    }
    case 'year': {
      if (condition.min !== undefined && state.character.year < condition.min) return false;
      if (condition.max !== undefined && state.character.year > condition.max) return false;
      return true;
    }
    case 'club': {
      const club = state.clubs.find((c) => c.clubId === condition.target);
      return club !== undefined;
    }
    case 'gpa': {
      if (condition.min !== undefined && state.character.gpa < condition.min) return false;
      if (condition.max !== undefined && state.character.gpa > condition.max) return false;
      return true;
    }
    case 'stress': {
      if (condition.min !== undefined && state.character.stress < condition.min) return false;
      if (condition.max !== undefined && state.character.stress > condition.max) return false;
      return true;
    }
    case 'happiness': {
      if (condition.min !== undefined && state.character.happiness < condition.min) return false;
      if (condition.max !== undefined && state.character.happiness > condition.max) return false;
      return true;
    }
    default:
      return false;
  }
}

function allConditionsMet(conditions: EventCondition[], state: GameState): boolean {
  return conditions.every((c) => evaluateCondition(c, state));
}

// ---------------------------------------------------------------------------
// Check which events should trigger
// ---------------------------------------------------------------------------

export function checkForEvents(state: GameState): GameEvent[] {
  const difficulty = DIFFICULTY_PRESETS[state.character.difficulty] ?? DIFFICULTY_PRESETS.normal;
  const triggered: GameEvent[] = [];

  for (const entry of EVENT_POOL) {
    // Skip if already triggered (for once-only events)
    if (entry.once && hasEventTriggered(state, entry.event.id)) {
      continue;
    }

    // Skip if already in pending events
    if (state.pendingEvents.some((e) => e.id === entry.event.id)) {
      continue;
    }

    // Check conditions
    if (!allConditionsMet(entry.conditions, state)) {
      continue;
    }

    // Weighted random check based on difficulty event frequency
    const chance = (entry.weight / 10) * difficulty.eventFrequency;
    if (Math.random() < chance) {
      triggered.push(entry.event);
    }
  }

  return triggered;
}

// ---------------------------------------------------------------------------
// Resolve a player's choice in an event
// ---------------------------------------------------------------------------

export function resolveEventChoice(
  state: GameState,
  eventId: string,
  choiceIndex: number,
): GameState {
  // Find the event in pending or current
  const event =
    state.currentEvent?.id === eventId
      ? state.currentEvent
      : state.pendingEvents.find((e) => e.id === eventId);

  if (!event) return state;

  const choice = event.choices[choiceIndex];
  if (!choice) return state;

  let newState = { ...state };
  const char = { ...newState.character };
  const consequences = choice.consequences;

  // Apply stat changes
  if (consequences.stats) {
    const newStats = { ...char.stats };
    for (const [stat, change] of Object.entries(consequences.stats)) {
      if (stat in newStats) {
        newStats[stat as keyof typeof newStats] = Math.max(
          1,
          Math.min(100, newStats[stat as keyof typeof newStats] + change),
        );
      }
    }
    char.stats = newStats;
  }

  // Apply relationship changes
  if (consequences.relationships) {
    const newRels = newState.relationships.map((rel) => {
      const change = consequences.relationships![rel.npcId];
      if (change !== undefined) {
        return {
          ...rel,
          trust: Math.max(0, Math.min(100, rel.trust + change)),
        };
      }
      return rel;
    });
    newState = { ...newState, relationships: newRels };
  }

  // Apply stress change
  if (consequences.stress !== undefined) {
    char.stress = Math.max(0, Math.min(100, char.stress + consequences.stress));
  }

  // Apply happiness change
  if (consequences.happiness !== undefined) {
    char.happiness = Math.max(0, Math.min(100, char.happiness + consequences.happiness));
  }

  // Apply energy change
  if (consequences.energy !== undefined) {
    char.energy = Math.max(0, Math.min(char.maxEnergy, char.energy + consequences.energy));
  }

  // Apply flags
  if (consequences.flags) {
    const newFlags = [...newState.flags];
    for (const flag of consequences.flags) {
      if (!newFlags.includes(flag)) {
        newFlags.push(flag);
      }
    }
    newState = { ...newState, flags: newFlags };
  }

  // Log the event
  const eventLog = [
    ...newState.eventLog,
    { eventId, choiceIndex, week: char.week },
  ];

  // Remove from pending events
  const pendingEvents = newState.pendingEvents.filter((e) => e.id !== eventId);

  // Clear current event if it matches
  const currentEvent = newState.currentEvent?.id === eventId ? null : newState.currentEvent;

  return {
    ...newState,
    character: char,
    eventLog,
    pendingEvents,
    currentEvent,
  };
}

// ---------------------------------------------------------------------------
// Check if an event has already been triggered
// ---------------------------------------------------------------------------

export function hasEventTriggered(state: GameState, eventId: string): boolean {
  return state.eventLog.some((entry) => entry.eventId === eventId);
}
