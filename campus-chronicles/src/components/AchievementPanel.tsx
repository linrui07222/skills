import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { achievements } from '@/data/achievements';

const CATEGORY_TABS = [
  { key: 'all', label: '全部' },
  { key: 'academic', label: '学业' },
  { key: 'social', label: '社交' },
  { key: 'club', label: '社团' },
  { key: 'romance', label: '恋爱' },
  { key: 'special', label: '特殊' },
  { key: 'ngplus', label: '二周目' },
] as const;

type CategoryKey = (typeof CATEGORY_TABS)[number]['key'];

interface AchievementPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function AchievementPanel({ open, onClose }: AchievementPanelProps) {
  const [category, setCategory] = useState<CategoryKey>('all');
  const unlockedAchievements = useGameStore((s) => s.ngplus.unlockedAchievements);

  const filtered = category === 'all'
    ? achievements
    : achievements.filter((a) => a.category === category);

  const totalUnlocked = unlockedAchievements.length;
  const totalAll = achievements.length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-800">🏆 成就</h2>
                <p className="text-xs text-gray-500">已解锁 {totalUnlocked}/{totalAll}</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-gray-100">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCategory(tab.key)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    category === tab.key
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Achievement Grid */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-2">
                {filtered.map((ach) => {
                  const isUnlocked = unlockedAchievements.includes(ach.id);
                  const isHidden = ach.hidden && !isUnlocked;

                  return (
                    <div
                      key={ach.id}
                      className={`rounded-xl border-2 p-3 transition-all ${
                        isUnlocked
                          ? 'border-amber-300 bg-amber-50'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {isHidden ? '❓' : ach.emoji}
                      </div>
                      <p className={`text-xs font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                        {isHidden ? '???' : ach.name}
                      </p>
                      <p className="text-[10px] mt-0.5 text-gray-500 leading-tight">
                        {isHidden ? '未解锁的隐藏成就' : ach.description}
                      </p>
                      {isUnlocked && (
                        <span className="inline-block mt-1 text-[9px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-medium">
                          ✓ 已解锁
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
