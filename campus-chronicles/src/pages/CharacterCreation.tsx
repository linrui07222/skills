import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, MessageCircle, Dumbbell, Palette, Target, Clover, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { difficultyPresets } from '@/data/difficulty';

const AVATARS = [
  { emoji: '🧑‍🎓', label: '学霸' },
  { emoji: '🎨', label: '艺术家' },
  { emoji: '🏃', label: '运动员' },
  { emoji: '💡', label: '创新者' },
  { emoji: '🎭', label: '表演者' },
  { emoji: '📚', label: '书虫' },
];

const STAT_CONFIG = [
  { key: 'intelligence', label: '智力', icon: Brain, color: 'text-blue-500' },
  { key: 'charisma', label: '魅力', icon: MessageCircle, color: 'text-amber-500' },
  { key: 'athleticism', label: '运动', icon: Dumbbell, color: 'text-red-500' },
  { key: 'creativity', label: '创造力', icon: Palette, color: 'text-pink-500' },
  { key: 'diligence', label: '勤奋', icon: Target, color: 'text-green-500' },
  { key: 'luck', label: '运气', icon: Clover, color: 'text-purple-500' },
] as const;

const BONUS_POINTS = 15;

export default function CharacterCreation() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { character, setCharacterName, setCharacterAppearance, allocateStat, setDifficulty, startGame } = useGameStore();

  const usedPoints = useMemo(() => {
    const s = character.stats;
    return (s.intelligence + s.charisma + s.athleticism + s.creativity + s.diligence + s.luck) - 30;
  }, [character]);

  const remaining = BONUS_POINTS - usedPoints;

  const canNext = step === 0 ? character.name.trim().length > 0 : step === 1 ? remaining >= 0 : !!character.difficulty;

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else { startGame(); navigate('/game'); }
  };

  const handleSlider = (key: string, value: number) => {
    const current = character.stats[key as keyof typeof character.stats];
    const diff = value - current;
    if (diff > remaining) return;
    allocateStat(key, value);
  };

  const radarPoints = useMemo(() => {
    const keys = STAT_CONFIG.map((s) => s.key);
    const vals = keys.map((k) => character.stats[k as keyof typeof character.stats]);
    return keys.map((_, i) => {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const r = (vals[i] / 20) * 80;
      return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`;
    }).join(' ');
  }, [character]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center p-4">
      {/* Progress dots */}
      <div className="flex gap-3 mt-6 mb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i <= step ? 'bg-orange-500' : 'bg-orange-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="w-full max-w-lg">
          {/* Step 1: Identity */}
          {step === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h2 className="text-xl font-bold text-center text-gray-800">你是谁？</h2>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">姓名</label>
                <input type="text" maxLength={20} value={character.name} onChange={(e) => setCharacterName(e.target.value)} placeholder="输入你的名字..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <p className="text-xs text-gray-400 mt-1">{character.name.length}/20</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">外貌</label>
                <div className="grid grid-cols-3 gap-3">
                  {AVATARS.map((a) => (
                    <button key={a.label} onClick={() => setCharacterAppearance(a.label)} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${character.appearance === a.label ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                      <span className="text-3xl">{a.emoji}</span>
                      <span className="text-xs mt-1 text-gray-600">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Stats & Traits */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">属性与特质</h2>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${remaining < 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-700'}`}>{remaining} 点数剩余</span>
              </div>
              <div className="space-y-3">
                {STAT_CONFIG.map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${color} shrink-0`} />
                    <span className="w-24 text-sm text-gray-700">{label}</span>
                    <input type="range" min={1} max={20} value={character.stats[key]} onChange={(e) => handleSlider(key, +e.target.value)} className="flex-1 accent-orange-500" />
                    <span className="w-6 text-center text-sm font-mono text-gray-800">{character.stats[key]}</span>
                  </div>
                ))}
              </div>
              {/* Simple radar chart */}
              <div className="flex justify-center">
                <svg viewBox="0 0 100 100" className="w-40 h-40">
                  <polygon points="50,10 86.6,30 86.6,70 50,90 13.4,70 13.4,30" fill="none" stroke="#fed7aa" strokeWidth="0.5" />
                  <polygon points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5" fill="none" stroke="#fed7aa" strokeWidth="0.5" />
                  <polygon points={radarPoints} fill="rgba(249,115,22,0.2)" stroke="#f97316" strokeWidth="1" />
                </svg>
              </div>
            </div>
          )}

          {/* Step 3: Difficulty */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-center text-gray-800">选择难度</h2>
              {difficultyPresets.map((d) => (
                <button key={d.id} onClick={() => setDifficulty(d.id)} className={`w-full text-left bg-white rounded-2xl shadow-lg p-5 border-2 transition-all ${character.difficulty === d.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent hover:border-orange-200'}`}>
                  <h3 className="font-bold text-gray-800">{d.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{d.description}</p>
                  <div className="flex gap-4 mt-3 text-xs text-gray-600">
                    <span>⚡ 精力: {d.maxEnergy}</span>
                    <span>😰 压力: ×{d.stressMultiplier}</span>
                    <span>📝 成绩: ×{d.gradeMultiplier}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 px-5 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
            <ChevronLeft className="w-4 h-4" /> 返回
          </button>
        )}
        <button onClick={handleNext} disabled={!canNext} className="flex items-center gap-1 px-5 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          {step === 2 ? (<><Play className="w-4 h-4" /> 开始游戏</>) : (<>下一步 <ChevronRight className="w-4 h-4" /></>)}
        </button>
      </div>
    </div>
  );
}
