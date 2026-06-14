// Social System — relationship updates, tier calculations, and social standing.
// Manages relationship values with NPCs, tier progression, romance eligibility,
// and overall social standing calculations.

import type { GameState, NPC } from './types';
import { DIFFICULTY_PRESETS } from './types';

// ---------------------------------------------------------------------------
// Relationship tier thresholds
// ---------------------------------------------------------------------------

const TIER_THRESHOLDS: Array<{ tier: string; minTrust: number }> = [
  { tier: 'Best Friend', minTrust: 80 },
  { tier: 'Close Friend', minTrust: 60 },
  { tier: 'Friend', minTrust: 40 },
  { tier: 'Acquaintance', minTrust: 20 },
  { tier: 'Stranger', minTrust: 0 },
];

// ---------------------------------------------------------------------------
// Update a relationship with a trust change
// ---------------------------------------------------------------------------

export function updateRelationship(
  state: GameState,
  npcId: string,
  change: number,
): GameState {
  const relationships = [...state.relationships];
  const existingIdx = relationships.findIndex((r) => r.npcId === npcId);

  if (existingIdx >= 0) {
    const existing = relationships[existingIdx];
    const newTrust = Math.max(0, Math.min(100, existing.trust + change));

    // Charisma bonus: high charisma amplifies positive relationship changes
    let adjustedChange = change;
    if (change > 0) {
      const charismaBonus = 1 + state.character.stats.charisma * 0.005;
      adjustedChange = Math.round(change * charismaBonus);
      // Re-clamp after charisma bonus
      const adjustedTrust = Math.max(0, Math.min(100, existing.trust + adjustedChange));

      relationships[existingIdx] = {
        ...existing,
        trust: adjustedTrust,
        tier: getRelationshipTier(adjustedTrust),
      };
    } else {
      relationships[existingIdx] = {
        ...existing,
        trust: newTrust,
        tier: getRelationshipTier(newTrust),
      };
    }
  } else {
    // Create new relationship entry
    const initialTrust = Math.max(0, Math.min(100, 10 + change));
    relationships.push({
      npcId,
      trust: initialTrust,
      romance: 0,
      tier: getRelationshipTier(initialTrust),
    });
  }

  return { ...state, relationships };
}

// ---------------------------------------------------------------------------
// Get relationship tier from trust value
// ---------------------------------------------------------------------------

export function getRelationshipTier(trust: number): string {
  for (const { tier, minTrust } of TIER_THRESHOLDS) {
    if (trust >= minTrust) return tier;
  }
  return 'Stranger';
}

// ---------------------------------------------------------------------------
// Check if romance is possible with an NPC
// ---------------------------------------------------------------------------

export function canRomance(
  trust: number,
  npcId: string,
  npcs: NPC[],
): boolean {
  const npc = npcs.find((n) => n.id === npcId);

  // NPC must be romanceable
  if (!npc || !npc.romanceable) return false;

  // Must be at least Friend tier (trust >= 40)
  if (trust < 40) return false;

  return true;
}

// ---------------------------------------------------------------------------
// Calculate overall social standing (0-100)
// ---------------------------------------------------------------------------

export function getSocialStanding(state: GameState): number {
  if (state.relationships.length === 0) return 0;

  // Factors that contribute to social standing:
  // 1. Number of relationships (breadth)
  // 2. Average trust level (depth)
  // 3. Charisma stat
  // 4. Number of close relationships (quality)

  const relCount = state.relationships.length;
  const avgTrust =
    state.relationships.reduce((sum, r) => sum + r.trust, 0) / relCount;
  const closeFriends = state.relationships.filter((r) => r.trust >= 60).length;
  const bestFriends = state.relationships.filter((r) => r.trust >= 80).length;
  const charisma = state.character.stats.charisma;

  // Breadth score: 0-25 (capped at 10 relationships for full score)
  const breadthScore = Math.min(25, (relCount / 10) * 25);

  // Depth score: 0-30 (based on average trust)
  const depthScore = (avgTrust / 100) * 30;

  // Quality score: 0-25 (close + best friends)
  const qualityScore = Math.min(25, (closeFriends * 3) + (bestFriends * 4));

  // Charisma score: 0-20
  const charismaScore = (charisma / 100) * 20;

  const total = breadthScore + depthScore + qualityScore + charismaScore;

  return Math.round(Math.max(0, Math.min(100, total)));
}

// ---------------------------------------------------------------------------
// Process a social interaction between the player and an NPC
// ---------------------------------------------------------------------------

export interface SocialInteractionResult {
  trustChange: number;
  romanceChange: number;
  stressChange: number;
  happinessChange: number;
}

export function processSocialInteraction(
  state: GameState,
  npcId: string,
  interactionType: 'chat' | 'hangout' | 'deep_conversation' | 'gift' | 'flirt',
): SocialInteractionResult {
  const relationship = state.relationships.find((r) => r.npcId === npcId);
  const currentTrust = relationship?.trust ?? 0;
  const charisma = state.character.stats.charisma;

  let trustChange = 0;
  let romanceChange = 0;
  let stressChange = 0;
  let happinessChange = 0;

  switch (interactionType) {
    case 'chat':
      // Light conversation: small trust gain, no stress
      trustChange = 2 + Math.floor(charisma / 25);
      happinessChange = 1;
      break;

    case 'hangout':
      // Spending time together: moderate trust gain, reduces stress
      trustChange = 4 + Math.floor(charisma / 20);
      stressChange = -3;
      happinessChange = 3;
      break;

    case 'deep_conversation':
      // Meaningful talk: significant trust gain, but only if already friends
      if (currentTrust >= 40) {
        trustChange = 6 + Math.floor(charisma / 15);
        stressChange = -2;
        happinessChange = 4;
      } else {
        // Too soon for deep conversation — awkward
        trustChange = -2;
        stressChange = 3;
        happinessChange = -1;
      }
      break;

    case 'gift':
      // Giving a gift: trust boost, but diminishing returns
      trustChange = Math.max(1, 5 - Math.floor(currentTrust / 25));
      happinessChange = 2;
      break;

    case 'flirt':
      // Flirting: only works if trust is high enough
      if (currentTrust >= 40) {
        romanceChange = 3 + Math.floor(charisma / 20);
        trustChange = 1;
        happinessChange = 3;
      } else {
        // Flirting with a stranger/acquaintance — creepy
        trustChange = -5;
        stressChange = 2;
        happinessChange = -2;
      }
      break;
  }

  // Luck can modify social interactions slightly
  const luckRoll = Math.random() * 100;
  if (luckRoll > 95) {
    // Lucky! Extra positive outcome
    trustChange += 2;
    happinessChange += 1;
  } else if (luckRoll < 5) {
    // Unlucky — awkward moment
    trustChange -= 1;
    stressChange += 1;
  }

  return {
    trustChange,
    romanceChange,
    stressChange,
    happinessChange,
  };
}

// ---------------------------------------------------------------------------
// Apply a social interaction result to game state
// ---------------------------------------------------------------------------

export function applySocialInteraction(
  state: GameState,
  npcId: string,
  interactionType: 'chat' | 'hangout' | 'deep_conversation' | 'gift' | 'flirt',
): GameState {
  const result = processSocialInteraction(state, npcId, interactionType);

  let newState = updateRelationship(state, npcId, result.trustChange);

  // Update romance if applicable
  const relationships = [...newState.relationships];
  const relIdx = relationships.findIndex((r) => r.npcId === npcId);
  if (relIdx >= 0 && result.romanceChange !== 0) {
    relationships[relIdx] = {
      ...relationships[relIdx],
      romance: Math.max(0, Math.min(100, relationships[relIdx].romance + result.romanceChange)),
    };
    newState = { ...newState, relationships };
  }

  // Apply stress and happiness changes
  const char = { ...newState.character };
  char.stress = Math.max(0, Math.min(100, char.stress + result.stressChange));
  char.happiness = Math.max(0, Math.min(100, char.happiness + result.happinessChange));

  return { ...newState, character: char };
}

// ---------------------------------------------------------------------------
// Check for relationship tier changes (returns list of tier changes)
// ---------------------------------------------------------------------------

export function checkTierChanges(
  oldState: GameState,
  newState: GameState,
): Array<{ npcId: string; oldTier: string; newTier: string }> {
  const changes: Array<{ npcId: string; oldTier: string; newTier: string }> = [];

  for (const newRel of newState.relationships) {
    const oldRel = oldState.relationships.find((r) => r.npcId === newRel.npcId);
    if (oldRel && oldRel.tier !== newRel.tier) {
      changes.push({
        npcId: newRel.npcId,
        oldTier: oldRel.tier,
        newTier: newRel.tier,
      });
    }
  }

  return changes;
}

// ---------------------------------------------------------------------------
// Get romance tier label
// ---------------------------------------------------------------------------

export function getRomanceTier(romance: number): string {
  if (romance >= 80) return 'Soulmate';
  if (romance >= 60) return 'Partner';
  if (romance >= 40) return 'Dating';
  if (romance >= 20) return 'Crush';
  return 'None';
}

// ---------------------------------------------------------------------------
// Get difficulty-adjusted romance threshold
// ---------------------------------------------------------------------------

export function getRomanceThreshold(difficulty: string): number {
  const preset = DIFFICULTY_PRESETS[difficulty] ?? DIFFICULTY_PRESETS.normal;
  return preset.romanceThreshold;
}
