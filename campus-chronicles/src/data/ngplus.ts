export interface NGPlusConfig {
  playthrough: number;        // current playthrough number (1 = first time)
  inheritanceRate: number;    // percentage of stats to inherit (0.5, 0.6, or 1.0)
  selectedTalent: string | null;  // talent id selected for this playthrough
  unlockedTalents: string[];      // all talents ever unlocked (persist across playthroughs)
  unlockedAchievements: string[]; // all achievements ever unlocked
  completedEndings: string[];     // all endings seen
  unlockedSkins: string[];        // cosmetic skins unlocked
  isNGPlus: boolean;              // whether this is a NG+ playthrough
  isFreeMode: boolean;            // free mode (4th playthrough+)
  clubLimit: number;              // max clubs joinable (2 for normal, 3 for NG+)
  negativeEventReduction: number; // reduction in negative events (0 for normal, 0.5 for NG+)
  studyEfficiencyBonus: number;   // base study efficiency bonus for NG+
}

export const NGPLUS_CONFIGS: Record<number, Partial<NGPlusConfig>> = {
  1: { playthrough: 1, isNGPlus: false, isFreeMode: false, clubLimit: 2, negativeEventReduction: 0, studyEfficiencyBonus: 0 },
  2: { playthrough: 2, isNGPlus: true, isFreeMode: false, clubLimit: 3, negativeEventReduction: 0.5, studyEfficiencyBonus: 0.1 },
  3: { playthrough: 3, isNGPlus: true, isFreeMode: false, clubLimit: 3, negativeEventReduction: 0.5, studyEfficiencyBonus: 0.1 },
  4: { playthrough: 4, isNGPlus: true, isFreeMode: true, clubLimit: 99, negativeEventReduction: 0.5, studyEfficiencyBonus: 0.15 },
};

export function calculateInheritanceRate(unlockedAchievements: string[]): number {
  if (unlockedAchievements.includes('ach-perfect-youth')) return 1.0;
  if (unlockedAchievements.includes('ach-repeat-student')) return 0.6;
  return 0.5;
}

export function getNGPlusConfig(playthrough: number, unlockedAchievements: string[]): NGPlusConfig {
  const base = NGPLUS_CONFIGS[Math.min(playthrough, 4)] || NGPLUS_CONFIGS[4];
  return {
    ...base,
    playthrough,
    inheritanceRate: calculateInheritanceRate(unlockedAchievements),
    selectedTalent: null,
    unlockedTalents: [],
    unlockedAchievements: [],
    completedEndings: [],
    unlockedSkins: [],
    isNGPlus: playthrough > 1,
    isFreeMode: playthrough >= 4,
    clubLimit: base.clubLimit ?? 2,
    negativeEventReduction: base.negativeEventReduction ?? 0,
    studyEfficiencyBonus: base.studyEfficiencyBonus ?? 0,
  } as NGPlusConfig;
}
