/**
 * 校园物语 - 游戏状态管理
 * 纯JavaScript实现，不依赖React/Zustand
 */

import gamedata from '../common/gamedata';

var SAVE_KEY = 'campus-chronicles-save';
var SLOT_ORDER = ['morning', 'afternoon', 'evening'];
var DEFAULT_STATS = {
  intelligence: 5,
  charisma: 5,
  athleticism: 5,
  creativity: 5,
  diligence: 5,
  luck: 5,
};

// ── 工具函数 ──────────────────────────────────────────────

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getRelationshipTier(trust) {
  if (trust >= 80) return '挚友';
  if (trust >= 60) return '好友';
  if (trust >= 40) return '朋友';
  if (trust >= 20) return '认识';
  return '陌生人';
}

function generateId() {
  return 'id_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

// ── 成就条件检查 ──────────────────────────────────────────

function checkAchievementCondition(id, state) {
  switch (id) {
    case 'ach-all-pass':
      return state.academics.length > 0 && state.academics.every(function(a) { return a.mastery >= 60; });
    case 'ach-scholar-path':
      return state.academics.length > 0 && state.academics.every(function(a) { return a.mastery >= 80; });
    case 'ach-perfect-score':
      return state.flags.indexOf('exam-perfect-score') >= 0;
    case 'ach-monthly-first':
      return state.flags.indexOf('exam-ranked-first') >= 0;
    case 'ach-final-comeback':
      return state.flags.indexOf('exam-comeback') >= 0;
    case 'ach-mistake-master':
      return state.flags.indexOf('mistake-master-100') >= 0;
    case 'ach-competition-champion':
      return state.flags.indexOf('competition-champion') >= 0;
    case 'ach-first-friend':
      return state.relationships.some(function(r) { return r.trust >= 40; });
    case 'ach-social-butterfly':
      return state.relationships.filter(function(r) { return r.trust >= 40; }).length >= 5;
    case 'ach-everyones-friend':
      return state.relationships.length > 0 && state.relationships.every(function(r) { return r.trust >= 40; });
    case 'ach-party-star':
      return state.eventLog.filter(function(e) { return e.eventId.indexOf('social-') === 0; }).length >= 10;
    case 'ach-teacher-deep-bond':
      return state.flags.indexOf('teacher-deep-bond') >= 0;
    case 'ach-club-newbie':
      return state.clubs.length >= 1;
    case 'ach-club-core':
      return state.clubs.some(function(c) { return c.skill >= 50; });
    case 'ach-club-president':
      return state.clubs.some(function(c) { return c.role === 'president'; });
    case 'ach-dual-president':
      return state.clubs.filter(function(c) { return c.role === 'president'; }).length >= 2;
    case 'ach-first-love':
      return state.romanceState.partnerId !== null;
    case 'ach-passionate-love':
      return state.romanceState.datingLevel >= 2;
    case 'ach-soulmate':
      return state.romanceState.datingLevel >= 4;
    case 'ach-heartbreak':
      return state.flags.indexOf('heartbreak') >= 0;
    case 'ach-repeat-student':
      return state.completedEndings.length >= 1;
    case 'ach-youth-regret':
      return state.flags.indexOf('ending-regret') >= 0;
    case 'ach-entrepreneur':
      return state.flags.indexOf('entrepreneur-complete') >= 0;
    case 'ach-vocational-star':
      return state.flags.indexOf('ending-vocational') >= 0;
    case 'ach-perfect-youth':
      return state.flags.indexOf('ending-perfect') >= 0;
    case 'ach-time-reversal':
      return state.playthrough >= 2;
    case 'ach-ngplus-start':
      return state.playthrough >= 2;
    case 'ach-talent-awaken':
      return state.flags.indexOf('talent-selected') >= 0;
    case 'ach-perfect-ending-ng':
      return state.flags.indexOf('ending-perfect') >= 0 && state.playthrough >= 2;
    case 'ach-omni-scholar':
      return state.academics.every(function(a) { return a.mastery >= 100; }) && state.relationships.every(function(r) { return r.trust >= 80; });
    case 'ach-no-regrets':
      return state.flags.indexOf('all-events-complete') >= 0;
    case 'ach-free-life':
      return state.playthrough >= 4;
    default:
      return false;
  }
}

// ── 初始状态 ──────────────────────────────────────────────

function createInitialState() {
  return {
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
      stats: { intelligence: 5, charisma: 5, athleticism: 5, creativity: 5, diligence: 5, luck: 5 },
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
}

// ── 游戏状态管理器（单例） ──────────────────────────────────

var GameStore = {
  _state: null,
  _listeners: [],

  // 初始化状态
  init: function() {
    this._state = createInitialState();
  },

  // 获取状态
  getState: function() {
    return this._state;
  },

  // 订阅状态变化
  subscribe: function(listener) {
    this._listeners.push(listener);
    var self = this;
    return function() {
      var idx = self._listeners.indexOf(listener);
      if (idx >= 0) self._listeners.splice(idx, 1);
    };
  },

  // 通知监听器
  _notify: function() {
    for (var i = 0; i < this._listeners.length; i++) {
      this._listeners[i](this._state);
    }
  },

  // 设置状态
  _setState: function(partial) {
    for (var key in partial) {
      if (partial.hasOwnProperty(key)) {
        this._state[key] = partial[key];
      }
    }
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 角色创建
  // ═══════════════════════════════════════════════════════════

  setCharacterName: function(name) {
    this._state.character.name = name;
    this._notify();
  },

  setIdentity: function(identityId) {
    this._state.character.identity = identityId;
    this._notify();
  },

  setDifficulty: function(difficulty) {
    var preset = gamedata.DIFFICULTY_PRESETS[difficulty];
    var maxEnergy = preset ? Math.round(100 * preset.energyMultiplier) : 100;
    this._state.character.difficulty = difficulty;
    this._state.character.maxEnergy = maxEnergy;
    this._state.character.energy = Math.min(this._state.character.energy, maxEnergy);
    this._notify();
  },

  allocateStat: function(stat, value) {
    this._state.character.stats[stat] = clamp(value, 1, 20);
    this._notify();
  },

  startGame: function() {
    var character = this._state.character;
    var ngplus = this._state.ngplus;

    // 初始化学业记录
    var academics = gamedata.subjects.map(function(sub) {
      return { subjectId: sub.id, mastery: 10, grade: '', homeworkDone: false };
    });

    // 应用身份加成
    var newStats = {};
    for (var k in character.stats) {
      newStats[k] = character.stats[k];
    }
    var identityData = gamedata.identities.find(function(i) { return i.id === character.identity; });
    if (identityData) {
      for (var key in identityData.statBonuses) {
        if (key in newStats) {
          newStats[key] = clamp(newStats[key] + identityData.statBonuses[key], 1, 100);
        }
      }
    }

    // 应用继承属性
    if (ngplus.inheritedStats) {
      for (var ik in ngplus.inheritedStats) {
        if (ik in newStats) {
          newStats[ik] = clamp(newStats[ik] + ngplus.inheritedStats[ik], 1, 100);
        }
      }
    }

    // 天赋精力加成
    var talentMaxEnergyBonus = 0;
    if (ngplus.selectedTalent) {
      var talentData = gamedata.talents.find(function(t) { return t.id === ngplus.selectedTalent; });
      if (talentData && talentData.modifiers.maxEnergyBonus) {
        talentMaxEnergyBonus = talentData.modifiers.maxEnergyBonus;
      }
    }

    var newMaxEnergy = character.maxEnergy + talentMaxEnergyBonus;

    this._state.character = {
      name: character.name,
      appearance: '',
      identity: character.identity,
      difficulty: character.difficulty,
      year: 1,
      week: 1,
      day: 0,
      currentSlot: 'morning',
      energy: newMaxEnergy,
      maxEnergy: newMaxEnergy,
      stress: 0,
      happiness: 50,
      gpa: 0,
      stats: newStats,
    };
    this._state.romanceState = { partnerId: null, datingLevel: 0, datesCompleted: 0 };
    this._state.academics = academics;
    this._state.relationships = [];
    this._state.clubs = [];
    this._state.schedule = [];
    this._state.currentEvent = null;
    this._state.pendingEvents = [];
    this._state.examState = null;
    this._state.eventLog = [];
    this._state.flags = ngplus.isNGPlus ? ['ngplus-active'] : [];
    this._state.gamePhase = 'playing';
    this._state.endingType = null;
    this._state.notifications = [];
    this._state.ngplus.clubLimit = ngplus.clubLimit;
    this._state.ngplus.studyEfficiencyBonus = ngplus.studyEfficiencyBonus;
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 游戏循环
  // ═══════════════════════════════════════════════════════════

  advanceSlot: function() {
    var character = this._state.character;
    var idx = SLOT_ORDER.indexOf(character.currentSlot);

    if (idx < SLOT_ORDER.length - 1) {
      character.currentSlot = SLOT_ORDER[idx + 1];
    } else if (character.day < 6) {
      character.currentSlot = 'morning';
      character.day = character.day + 1;
    } else if (character.week < 40) {
      character.currentSlot = 'morning';
      character.day = 0;
      character.week = character.week + 1;
    } else {
      character.currentSlot = 'morning';
      character.day = 0;
      character.week = 1;
      character.year = character.year + 1;
    }
    this._notify();
  },

  advanceDay: function() {
    var character = this._state.character;
    if (character.day < 6) {
      character.day = character.day + 1;
      character.currentSlot = 'morning';
    } else if (character.week < 40) {
      character.day = 0;
      character.week = character.week + 1;
      character.currentSlot = 'morning';
    } else {
      character.day = 0;
      character.week = 1;
      character.year = character.year + 1;
      character.currentSlot = 'morning';
    }
    this._notify();
  },

  advanceWeek: function() {
    var character = this._state.character;
    if (character.week < 40) {
      character.week = character.week + 1;
      character.day = 0;
      character.currentSlot = 'morning';
    } else {
      character.week = 1;
      character.year = character.year + 1;
      character.day = 0;
      character.currentSlot = 'morning';
    }
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 活动操作
  // ═══════════════════════════════════════════════════════════

  attendClass: function(subjectId) {
    var state = this._state;
    var bonus = state.ngplus.studyEfficiencyBonus;
    var subject = gamedata.subjects.find(function(s) { return s.id === subjectId; });

    for (var i = 0; i < state.academics.length; i++) {
      if (state.academics[i].subjectId === subjectId) {
        var oldMastery = state.academics[i].mastery;
        state.academics[i].mastery = clamp(oldMastery + 3 + Math.round(bonus * 3), 0, 100);
        var masteryChange = state.academics[i].mastery - oldMastery;
        if (masteryChange > 0) {
          this.addNotification((subject ? subject.name : subjectId) + '掌握度 +' + masteryChange, 'positive');
        }
        break;
      }
    }

    state.character.energy = clamp(state.character.energy - 15, 0, state.character.maxEnergy);
    state.character.stress = clamp(state.character.stress + 2, 0, 100);
    this.addNotification('精力 -15', 'negative');
    this.addNotification('压力 +2', 'negative');

    var moodDesc = this.applyIdentityMoodEffect('class');
    if (moodDesc) this.addNotification('心情：' + moodDesc, 'positive');

    this._notify();
  },

  doHomework: function(subjectId) {
    var state = this._state;
    var bonus = state.ngplus.studyEfficiencyBonus;
    var subject = gamedata.subjects.find(function(s) { return s.id === subjectId; });

    for (var i = 0; i < state.academics.length; i++) {
      if (state.academics[i].subjectId === subjectId) {
        var oldMastery = state.academics[i].mastery;
        state.academics[i].mastery = clamp(oldMastery + 1 + Math.round(bonus), 0, 100);
        state.academics[i].homeworkDone = true;
        var masteryChange = state.academics[i].mastery - oldMastery;
        if (masteryChange > 0) {
          this.addNotification((subject ? subject.name : subjectId) + '掌握度 +' + masteryChange, 'positive');
        }
        break;
      }
    }

    state.character.energy = clamp(state.character.energy - 10, 0, state.character.maxEnergy);
    state.character.stress = clamp(state.character.stress + 3, 0, 100);
    this.addNotification('精力 -10', 'negative');
    this.addNotification('压力 +3', 'negative');

    var moodDesc = this.applyIdentityMoodEffect('homework');
    if (moodDesc) this.addNotification('心情：' + moodDesc, 'positive');

    this._notify();
  },

  study: function(subjectId) {
    var state = this._state;
    var bonus = state.ngplus.studyEfficiencyBonus;
    var subject = gamedata.subjects.find(function(s) { return s.id === subjectId; });

    for (var i = 0; i < state.academics.length; i++) {
      if (state.academics[i].subjectId === subjectId) {
        var oldMastery = state.academics[i].mastery;
        state.academics[i].mastery = clamp(oldMastery + 5 + Math.round(bonus * 5), 0, 100);
        var masteryChange = state.academics[i].mastery - oldMastery;
        if (masteryChange > 0) {
          this.addNotification((subject ? subject.name : subjectId) + '掌握度 +' + masteryChange, 'positive');
        }
        break;
      }
    }

    state.character.energy = clamp(state.character.energy - 20, 0, state.character.maxEnergy);
    state.character.stress = clamp(state.character.stress + 5, 0, 100);
    this.addNotification('精力 -20', 'negative');
    this.addNotification('压力 +5', 'negative');

    var moodDesc = this.applyIdentityMoodEffect('study');
    if (moodDesc) this.addNotification('心情：' + moodDesc, 'positive');

    this._notify();
  },

  socialize: function(npcId) {
    var state = this._state;
    var character = state.character;
    var relationships = state.relationships;
    var existing = relationships.find(function(r) { return r.npcId === npcId; });

    character.energy = clamp(character.energy - 10, 0, character.maxEnergy);
    character.stress = clamp(character.stress - 5, 0, 100);
    character.happiness = clamp(character.happiness + 5, 0, 100);

    this.addNotification('精力 -10', 'negative');
    this.addNotification('压力 -5', 'positive');
    this.addNotification('心情 +5', 'positive');

    if (existing) {
      existing.trust = clamp(existing.trust + 5, 0, 100);
      existing.tier = getRelationshipTier(existing.trust);
    } else {
      relationships.push({ npcId: npcId, trust: 5, romance: 0, tier: getRelationshipTier(5) });
    }

    var moodDesc = this.applyIdentityMoodEffect('socialize');
    if (moodDesc) this.addNotification('心情：' + moodDesc, 'positive');

    this._notify();
  },

  attendClub: function(clubId) {
    var state = this._state;
    for (var i = 0; i < state.clubs.length; i++) {
      if (state.clubs[i].clubId === clubId) {
        state.clubs[i].skill = clamp(state.clubs[i].skill + 3, 0, 100);
        break;
      }
    }

    state.character.energy = clamp(state.character.energy - 15, 0, state.character.maxEnergy);
    state.character.stress = clamp(state.character.stress - 5, 0, 100);
    state.character.happiness = clamp(state.character.happiness + 3, 0, 100);

    this.addNotification('精力 -15', 'negative');
    this.addNotification('压力 -5', 'positive');
    this.addNotification('心情 +3', 'positive');

    var moodDesc = this.applyIdentityMoodEffect('club');
    if (moodDesc) this.addNotification('心情：' + moodDesc, 'positive');

    this._notify();
  },

  rest: function() {
    var character = this._state.character;
    character.energy = clamp(character.energy + 40, 0, character.maxEnergy);
    character.stress = clamp(character.stress - 15, 0, 100);
    character.happiness = clamp(character.happiness + 5, 0, 100);
    this.addNotification('休息：精力 +40，压力 -15', 'positive');
    this._notify();
  },

  sleep: function() {
    var state = this._state;
    var character = state.character;

    character.energy = character.maxEnergy;
    character.stress = clamp(character.stress - 20, 0, 100);

    // 身份心情恢复
    var identityData = gamedata.identities.find(function(i) { return i.id === character.identity; });
    if (identityData) {
      var restTrigger = identityData.moodTriggers.find(function(t) { return t.activity === 'rest'; });
      if (restTrigger) {
        character.happiness = clamp(character.happiness + restTrigger.happinessGain, 0, 100);
      }
    }

    // 推进到下一天
    if (character.day < 6) {
      character.day = character.day + 1;
    } else if (character.week < 40) {
      character.day = 0;
      character.week = character.week + 1;
    } else {
      character.day = 0;
      character.week = 1;
      character.year = character.year + 1;
    }
    character.currentSlot = 'morning';

    this.addNotification('精力已完全恢复', 'positive');
    this.addNotification('压力 -20', 'positive');
    this._notify();
  },

  exercise: function() {
    var state = this._state;
    var character = state.character;

    character.energy = clamp(character.energy - 15, 0, character.maxEnergy);
    character.stress = clamp(character.stress - 5, 0, 100);
    character.stats.athleticism = clamp(character.stats.athleticism + 2, 1, 100);

    this.addNotification('运动能力 +2', 'positive');
    this.addNotification('精力 -15', 'negative');
    this.addNotification('压力 -5', 'positive');

    var moodDesc = this.applyIdentityMoodEffect('exercise');
    if (moodDesc) this.addNotification('心情：' + moodDesc, 'positive');

    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 恋爱操作
  // ═══════════════════════════════════════════════════════════

  goOnDate: function(npcId) {
    var state = this._state;
    var character = state.character;
    var romanceState = state.romanceState;
    var relationships = state.relationships;

    if (character.energy < 20) return;
    if (romanceState.partnerId && romanceState.partnerId !== npcId) return;

    character.energy = clamp(character.energy - 20, 0, character.maxEnergy);
    character.happiness = clamp(character.happiness + 10, 0, 100);

    var existing = relationships.find(function(r) { return r.npcId === npcId; });
    if (existing) {
      existing.romance = clamp(existing.romance + 10, 0, 100);
    }

    romanceState.datesCompleted = romanceState.datesCompleted + 1;

    this.addNotification('精力 -20', 'negative');
    this.addNotification('浪漫度 +10', 'positive');
    this.addNotification('心情 +10', 'positive');

    var moodDesc = this.applyIdentityMoodEffect('socialize');
    if (moodDesc) this.addNotification('心情：' + moodDesc, 'positive');

    this._notify();
  },

  confess: function(npcId) {
    var state = this._state;
    var character = state.character;
    var relationships = state.relationships;
    var romanceState = state.romanceState;

    if (romanceState.partnerId) return;

    var rel = relationships.find(function(r) { return r.npcId === npcId; });
    if (!rel || rel.trust < 50 || rel.romance < 30) return;

    var successChance = (rel.trust + character.stats.charisma * 2 + character.stats.luck) / 200;
    var success = Math.random() < successChance;

    if (success) {
      romanceState.partnerId = npcId;
      romanceState.datingLevel = 1;
      romanceState.datesCompleted = 0;
      rel.romance = clamp(rel.romance + 20, 0, 100);
      character.happiness = clamp(character.happiness + 20, 0, 100);
      this.addNotification('表白成功！你们开始交往了！', 'positive');
    } else {
      character.happiness = clamp(character.happiness - 10, 0, 100);
      this.addNotification('表白失败了……', 'negative');
    }
    this._notify();
  },

  breakUp: function() {
    var state = this._state;
    if (!state.romanceState.partnerId) return;

    state.character.happiness = clamp(state.character.happiness - 30, 0, 100);
    state.romanceState = { partnerId: null, datingLevel: 0, datesCompleted: 0 };
    this.addNotification('你们分手了……心情 -30', 'negative');
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 身份心情效果
  // ═══════════════════════════════════════════════════════════

  applyIdentityMoodEffect: function(activity) {
    var character = this._state.character;
    var identityData = gamedata.identities.find(function(i) { return i.id === character.identity; });
    if (!identityData) return null;

    var trigger = identityData.moodTriggers.find(function(t) { return t.activity === activity; });
    if (trigger) {
      character.happiness = clamp(character.happiness + trigger.happinessGain, 0, 100);
      return '+' + trigger.happinessGain + ' ' + trigger.description;
    }

    var drain = identityData.moodDrains.find(function(d) { return d.activity === activity; });
    if (drain) {
      character.happiness = clamp(character.happiness - drain.happinessLoss, 0, 100);
      return '-' + drain.happinessLoss + ' ' + drain.description;
    }

    return null;
  },

  // ═══════════════════════════════════════════════════════════
  // 事件操作
  // ═══════════════════════════════════════════════════════════

  setCurrentEvent: function(event) {
    this._state.currentEvent = event;
    this._notify();
  },

  resolveChoice: function(choiceIndex) {
    var state = this._state;
    var currentEvent = state.currentEvent;
    if (!currentEvent || choiceIndex >= currentEvent.choices.length) return;

    var choice = currentEvent.choices[choiceIndex];
    var consequences = choice.consequences;
    var reduction = state.ngplus.negativeEventReduction;

    // 属性变化
    var newStats = {};
    for (var sk in state.character.stats) {
      newStats[sk] = state.character.stats[sk];
    }
    if (consequences.stats) {
      for (var key in consequences.stats) {
        if (key in newStats) {
          var value = consequences.stats[key];
          var adjustedValue = value < 0 ? Math.round(value * (1 - reduction)) : value;
          newStats[key] = clamp(newStats[key] + adjustedValue, 1, 100);
        }
      }
    }

    var newEnergy = state.character.energy;
    var newStress = state.character.stress;
    var newHappiness = state.character.happiness;

    if (consequences.energy !== undefined) {
      var adjustedEnergy = consequences.energy < 0 ? Math.round(consequences.energy * (1 - reduction)) : consequences.energy;
      newEnergy = clamp(state.character.energy + adjustedEnergy, 0, state.character.maxEnergy);
    }
    if (consequences.stress !== undefined) {
      var adjustedStress = consequences.stress > 0 ? Math.round(consequences.stress * (1 - reduction)) : consequences.stress;
      newStress = clamp(state.character.stress + adjustedStress, 0, 100);
    }
    if (consequences.happiness !== undefined) {
      var adjustedHappiness = consequences.happiness < 0 ? Math.round(consequences.happiness * (1 - reduction)) : consequences.happiness;
      newHappiness = clamp(state.character.happiness + adjustedHappiness, 0, 100);
    }

    // 标记变化
    var newFlags = state.flags.slice();
    if (consequences.flags) {
      for (var fi = 0; fi < consequences.flags.length; fi++) {
        if (newFlags.indexOf(consequences.flags[fi]) < 0) {
          newFlags.push(consequences.flags[fi]);
        }
      }
    }

    // 关系变化
    var newRelationships = state.relationships.slice();
    if (consequences.relationships) {
      for (var ri = 0; ri < newRelationships.length; ri++) {
        var change = consequences.relationships[newRelationships[ri].npcId];
        if (change !== undefined) {
          newRelationships[ri] = {
            npcId: newRelationships[ri].npcId,
            trust: clamp(newRelationships[ri].trust + change, 0, 100),
            romance: newRelationships[ri].romance,
            tier: getRelationshipTier(clamp(newRelationships[ri].trust + change, 0, 100)),
          };
        }
      }
    }

    // 移除待处理事件
    var newPendingEvents = state.pendingEvents.filter(function(e) { return e.id !== currentEvent.id; });

    this._state.currentEvent = null;
    this._state.pendingEvents = newPendingEvents;
    this._state.eventLog = state.eventLog.concat([{ eventId: currentEvent.id, choiceIndex: choiceIndex, week: state.character.week }]);
    this._state.character.stats = newStats;
    this._state.character.energy = newEnergy;
    this._state.character.stress = newStress;
    this._state.character.happiness = newHappiness;
    this._state.flags = newFlags;
    this._state.relationships = newRelationships;
    this._notify();
  },

  dismissEvent: function() {
    this._state.currentEvent = null;
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 考试操作
  // ═══════════════════════════════════════════════════════════

  startExam: function(subjectId) {
    this._state.examState = {
      subjectId: subjectId,
      currentQuestion: 0,
      totalQuestions: 10,
      correctAnswers: 0,
      active: true,
    };
    this._state.gamePhase = 'exam';
    this._notify();
  },

  answerExamQuestion: function(correct) {
    var examState = this._state.examState;
    if (!examState || !examState.active) return;
    examState.currentQuestion = examState.currentQuestion + 1;
    if (correct) examState.correctAnswers = examState.correctAnswers + 1;
    this._notify();
  },

  finishExam: function() {
    var examState = this._state.examState;
    if (!examState) return;
    var score = examState.correctAnswers / examState.totalQuestions;
    var masteryGain = Math.round(score * 10);

    for (var i = 0; i < this._state.academics.length; i++) {
      if (this._state.academics[i].subjectId === examState.subjectId) {
        this._state.academics[i].mastery = clamp(this._state.academics[i].mastery + masteryGain, 0, 100);
        break;
      }
    }

    this._state.examState = null;
    this._state.gamePhase = 'playing';
    this.addNotification('考试完成！掌握度 +' + masteryGain, 'positive');
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 属性更新
  // ═══════════════════════════════════════════════════════════

  updateStats: function(changes) {
    for (var key in changes) {
      if (key in this._state.character.stats) {
        this._state.character.stats[key] = clamp(this._state.character.stats[key] + changes[key], 1, 100);
      }
    }
    this._notify();
  },

  updateEnergy: function(change) {
    this._state.character.energy = clamp(this._state.character.energy + change, 0, this._state.character.maxEnergy);
    this._notify();
  },

  updateStress: function(change) {
    this._state.character.stress = clamp(this._state.character.stress + change, 0, 100);
    this._notify();
  },

  updateHappiness: function(change) {
    this._state.character.happiness = clamp(this._state.character.happiness + change, 0, 100);
    this._notify();
  },

  updateRelationship: function(npcId, trustChange, romanceChange) {
    romanceChange = romanceChange || 0;
    var relationships = this._state.relationships;
    var existing = relationships.find(function(r) { return r.npcId === npcId; });

    if (existing) {
      existing.trust = clamp(existing.trust + trustChange, 0, 100);
      existing.romance = clamp(existing.romance + romanceChange, 0, 100);
      existing.tier = getRelationshipTier(existing.trust);
    } else {
      var newTrust = clamp(50 + trustChange, 0, 100);
      relationships.push({ npcId: npcId, trust: newTrust, romance: clamp(romanceChange, 0, 100), tier: getRelationshipTier(newTrust) });
    }
    this._notify();
  },

  updateMastery: function(subjectId, change) {
    for (var i = 0; i < this._state.academics.length; i++) {
      if (this._state.academics[i].subjectId === subjectId) {
        this._state.academics[i].mastery = clamp(this._state.academics[i].mastery + change, 0, 100);
        break;
      }
    }
    this._notify();
  },

  updateClubSkill: function(clubId, change) {
    for (var i = 0; i < this._state.clubs.length; i++) {
      if (this._state.clubs[i].clubId === clubId) {
        this._state.clubs[i].skill = clamp(this._state.clubs[i].skill + change, 0, 100);
        break;
      }
    }
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 社团操作
  // ═══════════════════════════════════════════════════════════

  joinClub: function(clubId) {
    var state = this._state;
    if (state.clubs.some(function(c) { return c.clubId === clubId; })) return;
    if (state.clubs.length >= state.ngplus.clubLimit) return;
    state.clubs.push({ clubId: clubId, role: 'member', commitment: 1, skill: 0 });
    this.addNotification('加入了新社团！', 'positive');
    this._notify();
  },

  leaveClub: function(clubId) {
    this._state.clubs = this._state.clubs.filter(function(c) { return c.clubId !== clubId; });
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 标记操作
  // ═══════════════════════════════════════════════════════════

  setFlag: function(flag) {
    if (this._state.flags.indexOf(flag) < 0) {
      this._state.flags.push(flag);
      this._notify();
    }
  },

  hasFlag: function(flag) {
    return this._state.flags.indexOf(flag) >= 0;
  },

  // ═══════════════════════════════════════════════════════════
  // 通知操作
  // ═══════════════════════════════════════════════════════════

  addNotification: function(text, type) {
    this._state.notifications.push({ id: generateId(), text: text, type: type || 'neutral' });
    // 最多保留10条通知
    if (this._state.notifications.length > 10) {
      this._state.notifications = this._state.notifications.slice(-10);
    }
    this._notify();
  },

  removeNotification: function(id) {
    this._state.notifications = this._state.notifications.filter(function(n) { return n.id !== id; });
    this._notify();
  },

  clearNotifications: function() {
    this._state.notifications = [];
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 保存/加载
  // ═══════════════════════════════════════════════════════════

  saveGame: function() {
    try {
      var data = JSON.stringify(this._state);
      // Vela JS使用@system.storage，这里同时支持两种方式
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SAVE_KEY, data);
      }
      this.addNotification('游戏已保存', 'positive');
      this._notify();
    } catch (e) {
      console.error('保存失败：', e);
    }
  },

  loadGame: function() {
    try {
      var saved = null;
      if (typeof localStorage !== 'undefined') {
        saved = localStorage.getItem(SAVE_KEY);
      }
      if (!saved) return false;
      var state = JSON.parse(saved);
      this._state = state;
      this._notify();
      return true;
    } catch (e) {
      console.error('加载失败：', e);
      return false;
    }
  },

  hasSave: function() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(SAVE_KEY) !== null;
    }
    return false;
  },

  newGame: function() {
    var ngplus = this._state.ngplus;
    var initial = createInitialState();
    initial.ngplus.playthrough = ngplus.playthrough;
    initial.ngplus.unlockedTalents = ngplus.unlockedTalents.slice();
    initial.ngplus.unlockedAchievements = ngplus.unlockedAchievements.slice();
    initial.ngplus.completedEndings = ngplus.completedEndings.slice();
    initial.ngplus.unlockedSkins = ngplus.unlockedSkins.slice();
    initial.ngplus.achievementPoints = ngplus.achievementPoints;
    this._state = initial;
    this._notify();
  },

  resetFullGame: function() {
    this._state = createInitialState();
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 二周目操作
  // ═══════════════════════════════════════════════════════════

  selectTalent: function(talentId) {
    var ngplus = this._state.ngplus;
    var talentData = gamedata.talents.find(function(t) { return t.id === talentId; });
    if (!talentData) return;
    if (!ngplus.isNGPlus) return;
    ngplus.selectedTalent = talentId;
    if (ngplus.unlockedTalents.indexOf(talentId) < 0) {
      ngplus.unlockedTalents.push(talentId);
    }
    this._notify();
  },

  unlockAchievement: function(achievementId) {
    var ngplus = this._state.ngplus;
    if (ngplus.unlockedAchievements.indexOf(achievementId) >= 0) return;
    var achievementData = gamedata.achievements.find(function(a) { return a.id === achievementId; });
    if (!achievementData) return;
    var points = gamedata.ACHIEVEMENT_POINTS[achievementId] || 10;
    ngplus.unlockedAchievements.push(achievementId);
    ngplus.achievementPoints = ngplus.achievementPoints + points;
    this.addNotification('解锁成就：' + achievementData.emoji + ' ' + achievementData.name, 'positive');
    this._notify();
  },

  unlockSkin: function(skinId) {
    var ngplus = this._state.ngplus;
    if (ngplus.unlockedSkins.indexOf(skinId) >= 0) return;
    var skinData = gamedata.skins.find(function(s) { return s.id === skinId; });
    if (!skinData) return;
    if (ngplus.achievementPoints < skinData.cost) return;
    ngplus.unlockedSkins.push(skinId);
    ngplus.achievementPoints = ngplus.achievementPoints - skinData.cost;
    this._notify();
  },

  setActiveSkin: function(skinId) {
    var ngplus = this._state.ngplus;
    if (ngplus.unlockedSkins.indexOf(skinId) < 0) return;
    ngplus.activeSkin = skinId;
    this._notify();
  },

  startNGPlus: function() {
    var state = this._state;
    var ngplus = state.ngplus;
    var character = state.character;

    var nextPlaythrough = ngplus.playthrough + 1;
    var inheritanceRate = gamedata.calculateInheritanceRate(ngplus.unlockedAchievements);

    var inheritedStats = {
      intelligence: Math.round(character.stats.intelligence * inheritanceRate),
      charisma: Math.round(character.stats.charisma * inheritanceRate),
      athleticism: Math.round(character.stats.athleticism * inheritanceRate),
      creativity: Math.round(character.stats.creativity * inheritanceRate),
      diligence: Math.round(character.stats.diligence * inheritanceRate),
      luck: Math.round(character.stats.luck * inheritanceRate),
    };

    var config = gamedata.getNGPlusConfig(nextPlaythrough, ngplus.unlockedAchievements);

    var selectedTalent = null;
    if (nextPlaythrough >= 3) {
      selectedTalent = null; // 玩家自行选择
    } else {
      var availableTalents = gamedata.talents;
      if (availableTalents.length > 0) {
        selectedTalent = availableTalents[Math.floor(Math.random() * availableTalents.length)].id;
      }
    }

    var initial = createInitialState();
    initial.character.stats = { intelligence: 5, charisma: 5, athleticism: 5, creativity: 5, diligence: 5, luck: 5 };
    initial.ngplus = {
      playthrough: nextPlaythrough,
      isNGPlus: true,
      isFreeMode: config.isFreeMode,
      selectedTalent: selectedTalent,
      unlockedTalents: ngplus.unlockedTalents.slice(),
      unlockedAchievements: ngplus.unlockedAchievements.slice(),
      completedEndings: ngplus.completedEndings.slice(),
      unlockedSkins: ngplus.unlockedSkins.slice(),
      achievementPoints: ngplus.achievementPoints,
      activeSkin: ngplus.activeSkin,
      clubLimit: config.clubLimit,
      negativeEventReduction: config.negativeEventReduction,
      studyEfficiencyBonus: config.studyEfficiencyBonus,
      inheritedStats: inheritedStats,
    };
    initial.gamePhase = 'creating';

    this._state = initial;
    this._notify();
  },

  checkAchievements: function() {
    var state = this._state;
    var checkState = {
      stats: {},
      gpa: state.character.gpa,
      relationships: state.relationships.map(function(r) { return { npcId: r.npcId, trust: r.trust, romance: r.romance }; }),
      clubs: state.clubs.map(function(c) { return { clubId: c.clubId, skill: c.skill, role: c.role }; }),
      academics: state.academics.map(function(a) { return { subjectId: a.subjectId, mastery: a.mastery }; }),
      flags: state.flags.slice(),
      completedEndings: state.ngplus.completedEndings.slice(),
      playthrough: state.ngplus.playthrough,
      happiness: state.character.happiness,
      stress: state.character.stress,
      romanceState: { partnerId: state.romanceState.partnerId, datingLevel: state.romanceState.datingLevel },
      eventLog: state.eventLog.slice(),
    };
    for (var k in state.character.stats) {
      checkState.stats[k] = state.character.stats[k];
    }

    var newUnlocked = state.ngplus.unlockedAchievements.slice();
    var newPoints = state.ngplus.achievementPoints;
    var changed = false;

    for (var i = 0; i < gamedata.achievements.length; i++) {
      var achievement = gamedata.achievements[i];
      if (newUnlocked.indexOf(achievement.id) >= 0) continue;
      if (checkAchievementCondition(achievement.id, checkState)) {
        newUnlocked.push(achievement.id);
        newPoints += gamedata.ACHIEVEMENT_POINTS[achievement.id] || 10;
        changed = true;
      }
    }

    if (changed) {
      state.ngplus.unlockedAchievements = newUnlocked;
      state.ngplus.achievementPoints = newPoints;
      this._notify();
    }
  },

  // ═══════════════════════════════════════════════════════════
  // 阶段管理
  // ═══════════════════════════════════════════════════════════

  setGamePhase: function(phase) {
    this._state.gamePhase = phase;
    this._notify();
  },

  setEndingType: function(type) {
    this._state.endingType = type;
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 结局判定
  // ═══════════════════════════════════════════════════════════

  determineEnding: function() {
    var state = this._state;
    var character = state.character;
    var stats = character.stats;
    var academics = state.academics;
    var relationships = state.relationships;
    var romanceState = state.romanceState;
    var ngplus = state.ngplus;

    // 检查完美青春
    var allStatsHigh = stats.intelligence >= 60 && stats.charisma >= 60 && stats.athleticism >= 60 && stats.creativity >= 60 && stats.diligence >= 60 && stats.luck >= 60;
    if (allStatsHigh && character.happiness >= 80) {
      if (ngplus.isNGPlus) return 'ending-ngplus-perfect';
      return 'ending-perfect';
    }

    // 学霸之路
    var allMasteryHigh = academics.length > 0 && academics.every(function(a) { return a.mastery >= 80; });
    if (allMasteryHigh) return 'ending-scholar';

    // 体育之星
    if (stats.athleticism >= 80 && state.clubs.some(function(c) { return c.clubId === 'basketball'; })) return 'ending-athlete';

    // 艺术追梦
    if (stats.creativity >= 80 && state.clubs.some(function(c) { return c.clubId === 'art-club' || c.clubId === 'drama-club' || c.clubId === 'music-band'; })) return 'ending-artist';

    // 甜蜜初恋
    if (romanceState.partnerId !== null) return 'ending-romance';

    // 校园红人
    var friendCount = relationships.filter(function(r) { return r.trust >= 40; }).length;
    if (friendCount >= 5) return 'ending-social-star';

    // 青春遗憾
    if (character.stress >= 80 && character.happiness <= 20) return 'ending-regret';

    // 默认：平凡青春
    return 'ending-average';
  },

  // 触发结局
  triggerEnding: function() {
    var endingType = this.determineEnding();
    this._state.endingType = endingType;
    this._state.gamePhase = 'ending';

    // 记录已完成的结局
    if (this._state.ngplus.completedEndings.indexOf(endingType) < 0) {
      this._state.ngplus.completedEndings.push(endingType);
    }

    // 设置结局标记
    if (endingType === 'ending-regret') {
      this.setFlag('ending-regret');
    } else if (endingType === 'ending-perfect' || endingType === 'ending-ngplus-perfect') {
      this.setFlag('ending-perfect');
    }

    // 检查成就
    this.checkAchievements();
    this._notify();
  },

  // ═══════════════════════════════════════════════════════════
  // 事件触发检查
  // ═══════════════════════════════════════════════════════════

  checkForEvents: function() {
    var state = this._state;
    var character = state.character;
    var flags = state.flags;
    var pendingEvents = [];

    for (var i = 0; i < gamedata.events.length; i++) {
      var event = gamedata.events[i];
      var cond = event.triggerCondition;
      if (!cond) continue;

      // 检查是否已经触发过
      var alreadyTriggered = state.eventLog.some(function(e) { return e.eventId === event.id; });
      if (alreadyTriggered) continue;

      // 检查年份
      if (cond.year && cond.year.indexOf(character.year) < 0) continue;

      // 检查周数
      if (cond.week && cond.week.indexOf(character.week) < 0) continue;

      // 检查最低属性
      if (cond.minStat) {
        var statMet = true;
        for (var statKey in cond.minStat) {
          if (character.stats[statKey] < cond.minStat[statKey]) {
            statMet = false;
            break;
          }
        }
        if (!statMet) continue;
      }

      // 检查最高属性
      if (cond.maxStat) {
        var statOk = true;
        for (var maxKey in cond.maxStat) {
          if (character.stats[maxKey] > cond.maxStat[maxKey]) {
            statOk = false;
            break;
          }
        }
        if (!statOk) continue;
      }

      // 检查最低关系
      if (cond.minRelationship) {
        var relMet = true;
        for (var npcKey in cond.minRelationship) {
          var rel = state.relationships.find(function(r) { return r.npcId === npcKey; });
          if (!rel || rel.trust < cond.minRelationship[npcKey]) {
            relMet = false;
            break;
          }
        }
        if (!relMet) continue;
      }

      // 检查标记
      if (cond.flags) {
        var flagsMet = true;
        for (var fi = 0; fi < cond.flags.length; fi++) {
          if (flags.indexOf(cond.flags[fi]) < 0) {
            flagsMet = false;
            break;
          }
        }
        if (!flagsMet) continue;
      }

      // 随机概率
      if (cond.randomChance && Math.random() > cond.randomChance) continue;

      pendingEvents.push(event);
    }

    if (pendingEvents.length > 0) {
      // 选择第一个符合条件的事件
      this._state.currentEvent = pendingEvents[0];
      this._state.pendingEvents = pendingEvents.slice(1);
      this._notify();
      return true;
    }
    return false;
  },
};

// 初始化
GameStore.init();

export default GameStore;
