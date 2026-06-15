import { motion } from 'framer-motion';
import { BookOpen, Pencil, Leaf, Play, RotateCcw, Settings } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

const FLOATING_ITEMS = [
  { Icon: Leaf, x: '10%', y: '20%', delay: 0, duration: 8 },
  { Icon: BookOpen, x: '80%', y: '15%', delay: 1.5, duration: 10 },
  { Icon: Pencil, x: '25%', y: '70%', delay: 3, duration: 9 },
  { Icon: Leaf, x: '65%', y: '60%', delay: 2, duration: 7 },
  { Icon: BookOpen, x: '45%', y: '85%', delay: 4, duration: 11 },
  { Icon: Pencil, x: '90%', y: '45%', delay: 0.5, duration: 8.5 },
];

export default function MainMenu() {
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const loadGame = useGameStore((s) => s.loadGame);
  const hasSave = useGameStore((s) => s.hasSave);
  const ngplus = useGameStore((s) => s.ngplus);
  const startNGPlus = useGameStore((s) => s.startNGPlus);

  const hasCompletedGame = ngplus.completedEndings.length > 0;
  const playthrough = ngplus.playthrough;

  const handleContinue = () => {
    if (loadGame()) setGamePhase('playing');
  };

  const handleNGPlus = () => {
    startNGPlus();
    setGamePhase('creating');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#1a2744] to-[#7c4a1e] flex flex-col items-center justify-center">
      {/* Floating particles */}
      {FLOATING_ITEMS.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-amber-400/20"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0] }}
          transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <item.Icon size={28} />
        </motion.div>
      ))}

      {/* Title */}
      <motion.h1
        className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-amber-400 text-center"
        style={{ textShadow: '0 0 40px rgba(245,158,11,0.4), 0 4px 8px rgba(0,0,0,0.5)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        校园物语
      </motion.h1>

      <motion.p
        className="mt-3 text-amber-200/80 font-body text-lg sm:text-xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        你的高中故事即将开始
      </motion.p>

      {/* Buttons - plain HTML buttons for maximum compatibility */}
      <div className="mt-10 flex flex-col gap-3 w-64">
        <button
          onClick={() => setGamePhase('creating')}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-base font-display font-bold text-navy-900 shadow-lg hover:bg-amber-400 active:scale-95 cursor-pointer transition-all select-none"
        >
          <Play size={18} /> 新游戏
        </button>

        <button
          onClick={handleContinue}
          disabled={!hasSave()}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-base font-display font-semibold text-amber-50 shadow-lg hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors select-none"
        >
          <RotateCcw size={18} /> 继续游戏
        </button>

        {hasCompletedGame && (
          <button
            onClick={handleNGPlus}
            className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-base font-display font-bold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 cursor-pointer transition-all select-none"
          >
            二周目
            {playthrough > 1 && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {playthrough}
              </span>
            )}
          </button>
        )}

        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-base font-display font-medium text-amber-200/70 hover:bg-white/15 cursor-pointer transition-colors select-none"
        >
          <Settings size={18} /> 设置
        </button>
      </div>

      {/* Version tag */}
      <span className="absolute bottom-4 right-4 text-xs text-amber-400/30 font-body">v0.1</span>
    </div>
  );
}
