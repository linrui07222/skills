import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingBag } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { skins } from '@/data/skins';

const SKIN_CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'uniform', label: '校服' },
  { key: 'shoes', label: '鞋子' },
  { key: 'bag', label: '书包' },
  { key: 'weather', label: '天气' },
  { key: 'bgm', label: 'BGM' },
] as const;

type SkinCategoryKey = (typeof SKIN_CATEGORIES)[number]['key'];

interface ShopPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ShopPanel({ open, onClose }: ShopPanelProps) {
  const [category, setCategory] = useState<SkinCategoryKey>('all');
  const ngplus = useGameStore((s) => s.ngplus);
  const unlockSkin = useGameStore((s) => s.unlockSkin);
  const setActiveSkin = useGameStore((s) => s.setActiveSkin);
  const addNotification = useGameStore((s) => s.addNotification);

  const filtered = category === 'all'
    ? skins
    : skins.filter((s) => s.category === category);

  const handleBuyOrEquip = (skinId: string) => {
    const skin = skins.find((s) => s.id === skinId);
    if (!skin) return;

    if (ngplus.unlockedSkins.includes(skinId)) {
      // Already owned - equip
      setActiveSkin(skinId);
      addNotification(`已装备「${skin.name}」`, 'positive');
    } else if (ngplus.achievementPoints >= skin.cost) {
      // Buy
      unlockSkin(skinId);
      addNotification(`购买成功：「${skin.name}」`, 'positive');
    } else {
      addNotification('成就点数不足！', 'negative');
    }
  };

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
                <h2 className="text-lg font-bold text-gray-800">🛍️ 商店</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-600">{ngplus.achievementPoints} 点</span>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-gray-100">
              {SKIN_CATEGORIES.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCategory(tab.key)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    category === tab.key
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Skin Grid */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-2">
                {filtered.map((skin) => {
                  const isOwned = ngplus.unlockedSkins.includes(skin.id);
                  const isActive = ngplus.activeSkin === skin.id;
                  const canAfford = ngplus.achievementPoints >= skin.cost;

                  return (
                    <button
                      key={skin.id}
                      onClick={() => handleBuyOrEquip(skin.id)}
                      className={`rounded-xl border-2 p-3 text-left transition-all ${
                        isActive
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                          : isOwned
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{skin.emoji}</div>
                      <p className="text-xs font-bold text-gray-800">{skin.name}</p>
                      <p className="text-[10px] mt-0.5 text-gray-500 leading-tight">{skin.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        {isOwned ? (
                          <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-medium">
                            <Check className="w-3 h-3" /> {isActive ? '使用中' : '已拥有'}
                          </span>
                        ) : (
                          <span className={`text-[10px] font-semibold ${canAfford ? 'text-amber-600' : 'text-red-400'}`}>
                            {skin.cost} 点
                          </span>
                        )}
                      </div>
                    </button>
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
