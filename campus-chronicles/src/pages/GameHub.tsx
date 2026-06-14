import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { subjects } from '@/data/subjects';
import { clubs } from '@/data/clubs';
import { npcs } from '@/data/npcs';
import { identities } from '@/data/identities';
import { talents } from '@/data/talents';
import { events } from '@/data/events';
import EventDialog from '@/components/EventDialog';
import CharacterPanel from '@/components/CharacterPanel';
import SchedulePlanner from '@/components/SchedulePlanner';
import AchievementPanel from '@/components/AchievementPanel';
import ShopPanel from '@/components/ShopPanel';
import type { GameEvent } from '@/engine/types';

// ── Constants ──────────────────────────────────────────────────────────────

const YEAR_LABELS = ['高一', '高二', '高三', '高三下'];
const DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const DATING_LABELS = ['暗恋', '暧昧', '交往中', '稳定交往', '热恋', '灵魂伴侣'];

type LocationKey = 'classroom' | 'library' | 'cafeteria' | 'gym' | 'club' | 'home' | 'schedule' | 'profile' | 'romance' | 'achievement' | 'shop';

const LOCATIONS: { key: LocationKey; icon: string; name: string; desc: string }[] = [
  { key: 'classroom', icon: '🏫', name: '教室', desc: '上课学习' },
  { key: 'library', icon: '📚', name: '图书馆', desc: '学习和做作业' },
  { key: 'cafeteria', icon: '🍽️', name: '食堂', desc: '与同学社交' },
  { key: 'gym', icon: '⚽', name: '体育馆', desc: '锻炼和体育课' },
  { key: 'club', icon: '🎭', name: '社团活动室', desc: '课外活动' },
  { key: 'home', icon: '🏠', name: '家', desc: '休息、睡觉和恢复' },
  { key: 'romance', icon: '💕', name: '恋爱', desc: '表白、约会' },
  { key: 'schedule', icon: '📋', name: '课程表', desc: '规划你的一周' },
  { key: 'profile', icon: '👤', name: '个人资料', desc: '查看你的属性' },
  { key: 'achievement', icon: '🏆', name: '成就', desc: '查看成就' },
  { key: 'shop', icon: '🛍️', name: '商店', desc: '装扮商店' },
];

// ── Event checking logic ──────────────────────────────────────────────────

function checkDataEvents(
  state: {
    character: { year: number; week: number; stats: { intelligence: number; charisma: number; athleticism: number; creativity: number; diligence: number; luck: number }; gpa: number; stress: number; happiness: number };
    eventLog: { eventId: string }[];
    flags: string[];
    relationships: { npcId: string; trust: number }[];
    pendingEvents: GameEvent[];
  },
): GameEvent[] {
  const triggered: GameEvent[] = [];
  const triggeredIds = new Set(state.eventLog.map((e) => e.eventId));
  const pendingIds = new Set(state.pendingEvents.map((e) => e.id));

  for (const event of events) {
    if (triggeredIds.has(event.id) || pendingIds.has(event.id)) continue;
    const cond = event.triggerCondition;
    if (!cond) continue;

    if (cond.year && !cond.year.includes(state.character.year)) continue;
    if (cond.week && !cond.week.includes(state.character.week)) continue;
    if (cond.minStat) {
      const statsMap = state.character.stats as unknown as Record<string, number>;
      let statMet = true;
      for (const [stat, min] of Object.entries(cond.minStat)) {
        if ((statsMap[stat] ?? 0) < min) { statMet = false; break; }
      }
      if (!statMet) continue;
    }
    if (cond.maxStat) {
      const statsMap = state.character.stats as unknown as Record<string, number>;
      let statMet = true;
      for (const [stat, max] of Object.entries(cond.maxStat)) {
        if ((statsMap[stat] ?? 0) > max) { statMet = false; break; }
      }
      if (!statMet) continue;
    }
    if (cond.minRelationship) {
      let met = false;
      for (const [npcId, min] of Object.entries(cond.minRelationship)) {
        const rel = state.relationships.find((r) => r.npcId === npcId);
        if (rel && rel.trust >= min) { met = true; break; }
      }
      if (!met && Object.keys(cond.minRelationship).length > 0) continue;
    }
    if (cond.flags) {
      const hasAll = cond.flags.every((f) => state.flags.includes(f));
      if (!hasAll) continue;
    }
    if (cond.randomChance !== undefined && Math.random() > cond.randomChance) continue;

    triggered.push(event);
  }
  return triggered;
}

// ── Panel Components ───────────────────────────────────────────────────────

function ClassroomPanel() {
  const attendClass = useGameStore((s) => s.attendClass);
  const energy = useGameStore((s) => s.character.energy);
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-slate-800">上课</h3>
      <p className="text-xs text-slate-600">每节课消耗15精力，增加掌握度</p>
      <div className="grid grid-cols-2 gap-1.5">
        {subjects.map((sub) => (
          <button
            key={sub.id}
            disabled={energy < 15}
            onClick={() => attendClass(sub.id)}
            className="rounded-lg bg-amber-100 px-2 py-1.5 text-xs font-medium text-slate-800 border border-amber-300 hover:bg-amber-200 disabled:opacity-40 transition-colors"
          >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function LibraryPanel() {
  const study = useGameStore((s) => s.study);
  const doHomework = useGameStore((s) => s.doHomework);
  const academics = useGameStore((s) => s.academics);
  const energy = useGameStore((s) => s.character.energy);
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-800">图书馆</h3>
      {academics.map((a) => {
        const sub = subjects.find((s) => s.id === a.subjectId);
        return (
          <div key={a.subjectId} className="flex items-center gap-2">
            <span className="text-xs text-slate-700 w-24 truncate">{sub?.name ?? a.subjectId}</span>
            <span className="text-[10px] text-slate-500">{a.mastery}%</span>
            <button
              disabled={energy < 20}
              onClick={() => study(a.subjectId)}
              className="rounded bg-blue-100 px-2 py-1 text-[10px] font-medium text-blue-800 border border-blue-300 hover:bg-blue-200 disabled:opacity-40"
            >
              学习 (20⚡)
            </button>
            <button
              disabled={energy < 10 || a.homeworkDone}
              onClick={() => doHomework(a.subjectId)}
              className="rounded bg-green-100 px-2 py-1 text-[10px] font-medium text-green-800 border border-green-300 hover:bg-green-200 disabled:opacity-40"
            >
              {a.homeworkDone ? '作业 ✓' : '作业 (10⚡)'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function CafeteriaPanel() {
  const socialize = useGameStore((s) => s.socialize);
  const energy = useGameStore((s) => s.character.energy);
  const relationships = useGameStore((s) => s.relationships);
  const romanceState = useGameStore((s) => s.romanceState);
  const classmates = npcs.filter((n) => n.type === 'classmate');
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-slate-800">社交</h3>
      <p className="text-xs text-slate-600">聊天消耗10精力，减少压力</p>
      <div className="grid grid-cols-2 gap-1.5">
        {classmates.map((npc) => {
          const rel = relationships.find((r) => r.npcId === npc.id);
          const isPartner = romanceState.partnerId === npc.id;
          return (
            <button
              key={npc.id}
              disabled={energy < 10}
              onClick={() => socialize(npc.id)}
              className="rounded-lg bg-amber-100 px-2 py-1.5 text-xs font-medium text-slate-800 border border-amber-300 hover:bg-amber-200 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <span>{npc.portrait}</span>
              <span className="truncate">{npc.name.split(' ')[0]}</span>
              {isPartner && <span className="text-[9px] text-pink-500">❤️</span>}
              {rel && <span className="text-[9px] text-slate-400 ml-auto">{rel.tier}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GymPanel() {
  const exercise = useGameStore((s) => s.exercise);
  const attendClass = useGameStore((s) => s.attendClass);
  const energy = useGameStore((s) => s.character.energy);
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-slate-800">体育馆</h3>
      <button
        disabled={energy < 15}
        onClick={() => exercise()}
        className="w-full rounded-lg bg-red-100 px-3 py-2 text-xs font-medium text-red-800 border border-red-300 hover:bg-red-200 disabled:opacity-40"
      >
        锻炼 (+运动能力, 15⚡)
      </button>
      <button
        disabled={energy < 15}
        onClick={() => attendClass('pe')}
        className="w-full rounded-lg bg-orange-100 px-3 py-2 text-xs font-medium text-orange-800 border border-orange-300 hover:bg-orange-200 disabled:opacity-40"
      >
        体育课 (15⚡)
      </button>
    </div>
  );
}

function ClubPanel() {
  const attendClub = useGameStore((s) => s.attendClub);
  const joinClub = useGameStore((s) => s.joinClub);
  const clubMemberships = useGameStore((s) => s.clubs);
  const energy = useGameStore((s) => s.character.energy);
  const joined = clubMemberships.map((c) => c.clubId);
  const available = clubs.filter((c) => !joined.includes(c.id));
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-800">社团</h3>
      {clubMemberships.length === 0 && <p className="text-xs text-slate-500">你还没有加入任何社团。</p>}
      {clubMemberships.map((cm) => {
        const club = clubs.find((c) => c.id === cm.clubId);
        return (
          <div key={cm.clubId} className="flex items-center gap-2">
            <span className="text-xs text-slate-700 w-28 truncate">{club?.name ?? cm.clubId}</span>
            <span className="text-[10px] text-slate-400">{club?.skillName}: {cm.skill}</span>
            <button
              disabled={energy < 15}
              onClick={() => attendClub(cm.clubId)}
              className="rounded bg-pink-100 px-2 py-1 text-[10px] font-medium text-pink-800 border border-pink-300 hover:bg-pink-200 disabled:opacity-40"
            >
              参加 (15⚡)
            </button>
          </div>
        );
      })}
      {available.length > 0 && (
        <>
          <h4 className="text-xs font-semibold text-slate-700 mt-2">加入社团</h4>
          <div className="grid grid-cols-2 gap-1.5">
            {available.map((club) => (
              <button
                key={club.id}
                onClick={() => joinClub(club.id)}
                className="rounded-lg bg-amber-100 px-2 py-1.5 text-xs font-medium text-slate-800 border border-amber-300 hover:bg-amber-200 transition-colors"
              >
                {club.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function HomePanel() {
  const rest = useGameStore((s) => s.rest);
  const sleep = useGameStore((s) => s.sleep);
  const doHomework = useGameStore((s) => s.doHomework);
  const academics = useGameStore((s) => s.academics);
  const energy = useGameStore((s) => s.character.energy);
  const currentSlot = useGameStore((s) => s.character.currentSlot);
  const pendingHw = academics.filter((a) => !a.homeworkDone);
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-slate-800">家</h3>
      <button
        onClick={rest}
        className="w-full rounded-lg bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
      >
        休息 (+40⚡, -15压力)
      </button>
      <button
        onClick={sleep}
        className="w-full rounded-lg bg-indigo-100 px-3 py-2 text-xs font-medium text-indigo-800 border border-indigo-300 hover:bg-indigo-200"
      >
        🛏️ 睡觉 (精力全满, -20压力, 推进到次日早晨)
      </button>
      {currentSlot === 'evening' && (
        <p className="text-[10px] text-indigo-500">💡 晚上了，睡觉可以恢复更多精力！</p>
      )}
      {pendingHw.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-slate-600">待完成的作业：</p>
          {pendingHw.slice(0, 4).map((a) => {
            const sub = subjects.find((s) => s.id === a.subjectId);
            return (
              <button
                key={a.subjectId}
                disabled={energy < 10}
                onClick={() => doHomework(a.subjectId)}
                className="w-full rounded bg-green-100 px-2 py-1 text-[10px] font-medium text-green-800 border border-green-300 hover:bg-green-200 disabled:opacity-40"
              >
                {sub?.name ?? a.subjectId} 作业 (10⚡)
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RomancePanel() {
  const romanceState = useGameStore((s) => s.romanceState);
  const relationships = useGameStore((s) => s.relationships);
  const goOnDate = useGameStore((s) => s.goOnDate);
  const confess = useGameStore((s) => s.confess);
  const breakUp = useGameStore((s) => s.breakUp);
  const energy = useGameStore((s) => s.character.energy);
  const classmates = npcs.filter((n) => n.type === 'classmate' && n.romanceable);

  const partner = romanceState.partnerId
    ? { npc: npcs.find((n) => n.id === romanceState.partnerId), rel: relationships.find((r) => r.npcId === romanceState.partnerId) }
    : null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-800">💕 恋爱</h3>

      {partner?.npc && partner.rel ? (
        <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{partner.npc.portrait}</span>
            <div>
              <p className="text-sm font-bold text-pink-800">{partner.npc.name}</p>
              <p className="text-[10px] text-pink-600">
                {DATING_LABELS[Math.min(romanceState.datingLevel, 5)]} · 浪漫度 {partner.rel.romance}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              disabled={energy < 20}
              onClick={() => goOnDate(romanceState.partnerId!)}
              className="flex-1 rounded-lg bg-pink-200 px-2 py-1.5 text-xs font-medium text-pink-800 hover:bg-pink-300 disabled:opacity-40"
            >
              约会 (20⚡)
            </button>
            <button
              onClick={breakUp}
              className="rounded-lg bg-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-300"
            >
              分手
            </button>
          </div>
          <p className="text-[10px] text-pink-400 mt-1">已约会 {romanceState.datesCompleted} 次</p>
        </div>
      ) : (
        <p className="text-xs text-slate-500">你目前还是单身。与同学建立足够的信任和浪漫度后可以表白！</p>
      )}

      <h4 className="text-xs font-semibold text-slate-700">可互动的同学</h4>
      <div className="space-y-1.5">
        {classmates.map((npc) => {
          if (romanceState.partnerId === npc.id) return null;
          const rel = relationships.find((r) => r.npcId === npc.id);
          const trust = rel?.trust ?? 0;
          const romance = rel?.romance ?? 0;
          const canConfess = trust >= 50 && romance >= 30 && !romanceState.partnerId;
          return (
            <div key={npc.id} className="flex items-center gap-2 bg-amber-50 rounded-lg p-2">
              <span className="text-lg">{npc.portrait}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate">{npc.name}</p>
                <p className="text-[10px] text-slate-500">信任 {trust} · 浪漫 {romance}</p>
              </div>
              {canConfess && (
                <button
                  onClick={() => confess(npc.id)}
                  className="rounded bg-pink-200 px-2 py-1 text-[10px] font-medium text-pink-800 hover:bg-pink-300"
                >
                  💕 表白
                </button>
              )}
              {!canConfess && !romanceState.partnerId && (
                <span className="text-[9px] text-slate-400">需信任≥50,浪漫≥30</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Notification Toast ─────────────────────────────────────────────────────

function NotificationToasts() {
  const notifications = useGameStore((s) => s.notifications);
  const removeNotification = useGameStore((s) => s.removeNotification);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        removeNotification(notifications[0].id);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [notifications, removeNotification]);

  // Limit to 5, auto-remove oldest from bottom
  const visible = notifications.slice(-5);

  return (
    <div className="fixed top-14 right-4 z-30 flex flex-col gap-1.5 max-w-xs">
      <AnimatePresence>
        {visible.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            className={`px-3 py-2 rounded-lg shadow-lg text-xs font-medium ${
              n.type === 'positive' ? 'bg-emerald-500 text-white' :
              n.type === 'negative' ? 'bg-red-500 text-white' :
              'bg-amber-500 text-white'
            }`}
          >
            {n.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Main GameHub Page ──────────────────────────────────────────────────────

export default function GameHub() {
  const navigate = useNavigate();
  const character = useGameStore((s) => s.character);
  const currentEvent = useGameStore((s) => s.currentEvent);
  const pendingEvents = useGameStore((s) => s.pendingEvents);
  const advanceSlot = useGameStore((s) => s.advanceSlot);
  const saveGame = useGameStore((s) => s.saveGame);
  const setCurrentEvent = useGameStore((s) => s.setCurrentEvent);
  const addNotification = useGameStore((s) => s.addNotification);
  const ngplus = useGameStore((s) => s.ngplus);

  const [activeLocation, setActiveLocation] = useState<LocationKey | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const identityData = identities.find((i) => i.id === character.identity);
  const talentData = ngplus.selectedTalent ? talents.find((t) => t.id === ngplus.selectedTalent) : null;

  // Check for ending condition
  useEffect(() => {
    if (character.year > 3) {
      navigate('/ending');
    }
  }, [character.year, navigate]);

  // Check for pending events and show the first one
  useEffect(() => {
    if (!currentEvent && pendingEvents.length > 0) {
      setCurrentEvent(pendingEvents[0]);
    }
  }, [currentEvent, pendingEvents, setCurrentEvent]);

  const handleAdvanceTime = useCallback(() => {
    advanceSlot();

    // Check for new events after advancing
    const state = useGameStore.getState();
    const newEvents = checkDataEvents(state);

    if (newEvents.length > 0) {
      const store = useGameStore.getState();
      const updatedPending = [...store.pendingEvents, ...newEvents];
      useGameStore.setState({ pendingEvents: updatedPending });
      addNotification(`新事件：${newEvents[0].title}！`, 'neutral');
    }

    // Auto-save every 5 time slots
    if ((state.character.week * 21 + state.character.day * 3 +
      ['morning', 'afternoon', 'evening'].indexOf(state.character.currentSlot)) % 5 === 0) {
      saveGame();
    }
  }, [advanceSlot, saveGame, addNotification]);

  const handleLocationClick = (key: LocationKey) => {
    if (key === 'schedule') { setShowSchedule(true); return; }
    if (key === 'profile') { setShowProfile(true); return; }
    if (key === 'achievement') { setShowAchievement(true); return; }
    if (key === 'shop') { setShowShop(true); return; }
    setActiveLocation(activeLocation === key ? null : key);
  };

  const yearLabel = YEAR_LABELS[Math.min(character.year - 1, 3)] ?? '高一';
  const dayName = DAY_NAMES[character.day] ?? '周一';
  const slotLabel = character.currentSlot === 'morning' ? '上午' : character.currentSlot === 'afternoon' ? '下午' : '晚上';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="bg-slate-900 text-amber-50 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 shadow-lg">
        <div className="flex items-center gap-3 text-sm">
          {ngplus.isNGPlus && (
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full px-2 py-0.5 text-[10px] font-bold">
              第{ngplus.playthrough}周目
            </span>
          )}
          <span className="font-bold font-display">{yearLabel}</span>
          <span className="text-amber-300">第{character.week}周</span>
          <span className="text-amber-200">{dayName}</span>
          <span className="bg-amber-700 rounded-full px-2.5 py-0.5 text-xs font-semibold">{slotLabel}</span>
          {identityData && (
            <span className="bg-slate-700 rounded-full px-2 py-0.5 text-[10px]">
              {identityData.emoji} {identityData.name}
            </span>
          )}
          {talentData && (
            <span className="bg-purple-700 rounded-full px-2 py-0.5 text-[10px]">
              {talentData.emoji} {talentData.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <MiniMeter label="⚡" value={character.energy} max={character.maxEnergy} barColor="bg-emerald-400" />
          <MiniMeter label="😰" value={character.stress} max={100} barColor="bg-orange-400" />
          <MiniMeter label="😊" value={character.happiness} max={100} barColor="bg-yellow-300" />
        </div>
      </header>

      {/* ── Notification Toasts ─────────────────────────────── */}
      <NotificationToasts />

      {/* ── Campus Map ──────────────────────────────────────── */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto">
          {LOCATIONS.map((loc) => (
            <motion.button
              key={loc.key}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLocationClick(loc.key)}
              className={`rounded-xl border-2 p-3 text-center transition-colors ${
                activeLocation === loc.key
                  ? 'bg-amber-200 border-amber-500 shadow-md'
                  : 'bg-white border-amber-200 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              <div className="text-2xl mb-0.5">{loc.icon}</div>
              <div className="text-xs font-bold text-slate-900 font-display">{loc.name}</div>
              <div className="text-[9px] text-slate-500">{loc.desc}</div>
            </motion.button>
          ))}
        </div>

        {/* ── Identity Mood Hint ─────────────────────────────── */}
        {identityData && activeLocation && (
          <div className="mt-3 max-w-2xl mx-auto">
            <IdentityMoodHint identity={identityData} location={activeLocation} />
          </div>
        )}

        {/* ── Location Action Panel ─────────────────────────── */}
        <AnimatePresence>
          {activeLocation && (
            <motion.div
              key={activeLocation}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-3 max-w-2xl mx-auto rounded-xl bg-white/90 border border-amber-200 p-4 shadow-lg backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-bold text-slate-900 font-display">
                  {LOCATIONS.find((l) => l.key === activeLocation)?.icon}{' '}
                  {LOCATIONS.find((l) => l.key === activeLocation)?.name}
                </h2>
                <button
                  onClick={() => setActiveLocation(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  ✕ 关闭
                </button>
              </div>
              {activeLocation === 'classroom' && <ClassroomPanel />}
              {activeLocation === 'library' && <LibraryPanel />}
              {activeLocation === 'cafeteria' && <CafeteriaPanel />}
              {activeLocation === 'gym' && <GymPanel />}
              {activeLocation === 'club' && <ClubPanel />}
              {activeLocation === 'home' && <HomePanel />}
              {activeLocation === 'romance' && <RomancePanel />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Bottom Bar ──────────────────────────────────────── */}
      <footer className="bg-slate-900 text-amber-50 px-4 py-2.5 flex items-center justify-center gap-4 shadow-lg">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdvanceTime}
          className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold font-display px-6 py-2.5 text-sm transition-colors shadow-md"
        >
          推进时间
        </motion.button>
        <button
          onClick={() => { saveGame(); addNotification('游戏已保存！', 'neutral'); }}
          className="rounded-xl bg-amber-700 hover:bg-amber-600 text-amber-50 font-medium px-4 py-2.5 text-sm transition-colors"
        >
          保存
        </button>
      </footer>

      {/* ── Overlays ────────────────────────────────────────── */}
      {currentEvent && <EventDialog />}
      <CharacterPanel open={showProfile} onClose={() => setShowProfile(false)} />
      <SchedulePlanner open={showSchedule} onClose={() => setShowSchedule(false)} />
      <AchievementPanel open={showAchievement} onClose={() => setShowAchievement(false)} />
      <ShopPanel open={showShop} onClose={() => setShowShop(false)} />
    </div>
  );
}

// ── Identity Mood Hint ─────────────────────────────────────────────────────

function IdentityMoodHint({ identity, location }: { identity: typeof identities[0]; location: string }) {
  // Map location to activity key
  const activityMap: Record<string, string[]> = {
    classroom: ['class'],
    library: ['study', 'homework'],
    cafeteria: ['socialize'],
    gym: ['exercise', 'gym'],
    club: ['club'],
    home: ['rest'],
  };
  const activities = activityMap[location] ?? [];

  const triggers = identity.moodTriggers.filter((t) => activities.includes(t.activity));
  const drains = identity.moodDrains.filter((d) => activities.includes(d.activity));

  if (triggers.length === 0 && drains.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {triggers.map((t, i) => (
        <span key={`t${i}`} className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
          😊 +{t.happinessGain} {t.description}
        </span>
      ))}
      {drains.map((d, i) => (
        <span key={`d${i}`} className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 border border-red-200">
          😔 -{d.happinessLoss} {d.description}
        </span>
      ))}
    </div>
  );
}

// ── Mini Meter ─────────────────────────────────────────────────────────────

function MiniMeter({ label, value, max, barColor }: { label: string; value: number; max: number; barColor: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm">{label}</span>
      <div className="w-16 h-2.5 rounded-full bg-slate-700 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="w-7 text-right font-mono text-[10px]">{value}</span>
    </div>
  );
}
