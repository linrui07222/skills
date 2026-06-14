import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { subjects } from '@/data/subjects';
import { clubs } from '@/data/clubs';
import { npcs } from '@/data/npcs';
import { events } from '@/data/events';
import EventDialog from '@/components/EventDialog';
import CharacterPanel from '@/components/CharacterPanel';
import SchedulePlanner from '@/components/SchedulePlanner';
import type { GameEvent } from '@/engine/types';

// ── Constants ──────────────────────────────────────────────────────────────

const YEAR_LABELS = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type LocationKey = 'classroom' | 'library' | 'cafeteria' | 'gym' | 'club' | 'home' | 'schedule' | 'profile';

const LOCATIONS: { key: LocationKey; icon: string; name: string; desc: string }[] = [
  { key: 'classroom', icon: '🏫', name: 'Classroom', desc: 'Attend classes and learn' },
  { key: 'library', icon: '📚', name: 'Library', desc: 'Study and do homework' },
  { key: 'cafeteria', icon: '🍽️', name: 'Cafeteria', desc: 'Socialize with classmates' },
  { key: 'gym', icon: '⚽', name: 'Gym', desc: 'Exercise and PE class' },
  { key: 'club', icon: '🎭', name: 'Club Room', desc: 'Extracurricular activities' },
  { key: 'home', icon: '🏠', name: 'Home', desc: 'Rest and recharge' },
  { key: 'schedule', icon: '📋', name: 'Schedule', desc: 'Plan your week' },
  { key: 'profile', icon: '👤', name: 'Profile', desc: 'View your stats' },
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
      <h3 className="text-sm font-bold text-slate-800">Attend Class</h3>
      <p className="text-xs text-slate-600">Costs 15 energy per class.</p>
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
      <h3 className="text-sm font-bold text-slate-800">Library</h3>
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
              Study (20⚡)
            </button>
            <button
              disabled={energy < 10 || a.homeworkDone}
              onClick={() => doHomework(a.subjectId)}
              className="rounded bg-green-100 px-2 py-1 text-[10px] font-medium text-green-800 border border-green-300 hover:bg-green-200 disabled:opacity-40"
            >
              {a.homeworkDone ? 'HW ✓' : 'HW (10⚡)'}
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
  const classmates = npcs.filter((n) => n.type === 'classmate');
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-slate-800">Socialize</h3>
      <p className="text-xs text-slate-600">Chat costs 10 energy, reduces stress.</p>
      <div className="grid grid-cols-2 gap-1.5">
        {classmates.map((npc) => {
          const rel = relationships.find((r) => r.npcId === npc.id);
          return (
            <button
              key={npc.id}
              disabled={energy < 10}
              onClick={() => socialize(npc.id)}
              className="rounded-lg bg-amber-100 px-2 py-1.5 text-xs font-medium text-slate-800 border border-amber-300 hover:bg-amber-200 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <span>{npc.portrait}</span>
              <span className="truncate">{npc.name.split(' ')[0]}</span>
              {rel && <span className="text-[9px] text-slate-400 ml-auto">{rel.tier}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GymPanel() {
  const attendClass = useGameStore((s) => s.attendClass);
  const updateStats = useGameStore((s) => s.updateStats);
  const updateEnergy = useGameStore((s) => s.updateEnergy);
  const updateStress = useGameStore((s) => s.updateStress);
  const energy = useGameStore((s) => s.character.energy);
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-slate-800">Gym</h3>
      <button
        disabled={energy < 15}
        onClick={() => { updateStats({ athleticism: 2 }); updateEnergy(-15); updateStress(-5); }}
        className="w-full rounded-lg bg-red-100 px-3 py-2 text-xs font-medium text-red-800 border border-red-300 hover:bg-red-200 disabled:opacity-40"
      >
        Exercise (+Athleticism, 15⚡)
      </button>
      <button
        disabled={energy < 15}
        onClick={() => attendClass('pe')}
        className="w-full rounded-lg bg-orange-100 px-3 py-2 text-xs font-medium text-orange-800 border border-orange-300 hover:bg-orange-200 disabled:opacity-40"
      >
        PE Class (15⚡)
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
      <h3 className="text-sm font-bold text-slate-800">Clubs</h3>
      {clubMemberships.length === 0 && <p className="text-xs text-slate-500">You haven't joined any clubs yet.</p>}
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
              Attend (15⚡)
            </button>
          </div>
        );
      })}
      {available.length > 0 && (
        <>
          <h4 className="text-xs font-semibold text-slate-700 mt-2">Join a Club</h4>
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
  const doHomework = useGameStore((s) => s.doHomework);
  const academics = useGameStore((s) => s.academics);
  const energy = useGameStore((s) => s.character.energy);
  const pendingHw = academics.filter((a) => !a.homeworkDone);
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-slate-800">Home</h3>
      <button
        onClick={rest}
        className="w-full rounded-lg bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
      >
        Rest (+40⚡, -15 stress)
      </button>
      {pendingHw.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-slate-600">Pending homework:</p>
          {pendingHw.slice(0, 4).map((a) => {
            const sub = subjects.find((s) => s.id === a.subjectId);
            return (
              <button
                key={a.subjectId}
                disabled={energy < 10}
                onClick={() => doHomework(a.subjectId)}
                className="w-full rounded bg-green-100 px-2 py-1 text-[10px] font-medium text-green-800 border border-green-300 hover:bg-green-200 disabled:opacity-40"
              >
                {sub?.name ?? a.subjectId} HW (10⚡)
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main GameHub Page ──────────────────────────────────────────────────────

export default function GameHub() {
  const navigate = useNavigate();
  const character = useGameStore((s) => s.character);
  const currentEvent = useGameStore((s) => s.currentEvent);
  const pendingEvents = useGameStore((s) => s.pendingEvents);
  const eventLog = useGameStore((s) => s.eventLog);
  const flags = useGameStore((s) => s.flags);
  const relationships = useGameStore((s) => s.relationships);
  const advanceSlot = useGameStore((s) => s.advanceSlot);
  const saveGame = useGameStore((s) => s.saveGame);
  const setCurrentEvent = useGameStore((s) => s.setCurrentEvent);

  const [activeLocation, setActiveLocation] = useState<LocationKey | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

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

  // Show notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAdvanceTime = useCallback(() => {
    advanceSlot();

    // Check for new events after advancing
    const state = useGameStore.getState();
    const newEvents = checkDataEvents(state);

    if (newEvents.length > 0) {
      // Add to pending events
      const store = useGameStore.getState();
      const updatedPending = [...store.pendingEvents, ...newEvents];
      useGameStore.setState({ pendingEvents: updatedPending });
      setNotification(`New event: ${newEvents[0].title}!`);
    }

    // Auto-save every 5 time slots
    if ((state.character.week * 21 + state.character.day * 3 +
      ['morning', 'afternoon', 'evening'].indexOf(state.character.currentSlot)) % 5 === 0) {
      saveGame();
    }
  }, [advanceSlot, saveGame]);

  const handleLocationClick = (key: LocationKey) => {
    if (key === 'schedule') { setShowSchedule(true); return; }
    if (key === 'profile') { setShowProfile(true); return; }
    setActiveLocation(activeLocation === key ? null : key);
  };

  const yearLabel = YEAR_LABELS[Math.min(character.year - 1, 3)] ?? 'Freshman';
  const dayName = DAY_NAMES[character.day] ?? 'Monday';
  const slotLabel = character.currentSlot.charAt(0).toUpperCase() + character.currentSlot.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="bg-slate-900 text-amber-50 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 shadow-lg">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold font-display">{yearLabel}</span>
          <span className="text-amber-300">Week {character.week}</span>
          <span className="text-amber-200">{dayName}</span>
          <span className="bg-amber-700 rounded-full px-2.5 py-0.5 text-xs font-semibold">{slotLabel}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <MiniMeter label="⚡" value={character.energy} max={character.maxEnergy} barColor="bg-emerald-400" />
          <MiniMeter label="😰" value={character.stress} max={100} barColor="bg-orange-400" />
          <MiniMeter label="😊" value={character.happiness} max={100} barColor="bg-yellow-300" />
        </div>
      </header>

      {/* ── Notification ────────────────────────────────────── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-30 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Campus Map ──────────────────────────────────────── */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {LOCATIONS.map((loc) => (
            <motion.button
              key={loc.key}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLocationClick(loc.key)}
              className={`rounded-xl border-2 p-4 text-center transition-colors ${
                activeLocation === loc.key
                  ? 'bg-amber-200 border-amber-500 shadow-md'
                  : 'bg-white border-amber-200 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              <div className="text-3xl mb-1">{loc.icon}</div>
              <div className="text-sm font-bold text-slate-900 font-display">{loc.name}</div>
              <div className="text-[10px] text-slate-500">{loc.desc}</div>
            </motion.button>
          ))}
        </div>

        {/* ── Location Action Panel ─────────────────────────── */}
        <AnimatePresence>
          {activeLocation && (
            <motion.div
              key={activeLocation}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-4 max-w-2xl mx-auto rounded-xl bg-white/90 border border-amber-200 p-4 shadow-lg backdrop-blur-sm"
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
                  ✕ Close
                </button>
              </div>
              {activeLocation === 'classroom' && <ClassroomPanel />}
              {activeLocation === 'library' && <LibraryPanel />}
              {activeLocation === 'cafeteria' && <CafeteriaPanel />}
              {activeLocation === 'gym' && <GymPanel />}
              {activeLocation === 'club' && <ClubPanel />}
              {activeLocation === 'home' && <HomePanel />}
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
          Advance Time
        </motion.button>
        <button
          onClick={() => { saveGame(); setNotification('Game saved!'); }}
          className="rounded-xl bg-amber-700 hover:bg-amber-600 text-amber-50 font-medium px-4 py-2.5 text-sm transition-colors"
        >
          Save
        </button>
      </footer>

      {/* ── Overlays ────────────────────────────────────────── */}
      {currentEvent && <EventDialog />}
      <CharacterPanel open={showProfile} onClose={() => setShowProfile(false)} />
      <SchedulePlanner open={showSchedule} onClose={() => setShowSchedule(false)} />
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
