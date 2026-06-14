import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { subjects } from '@/data/subjects';
import { clubs } from '@/data/clubs';
import { identities } from '@/data/identities';
import { npcs } from '@/data/npcs';

const STAT_COLORS: Record<string, string> = {
  intelligence: 'bg-blue-500',
  charisma: 'bg-amber-500',
  athleticism: 'bg-red-500',
  creativity: 'bg-pink-500',
  diligence: 'bg-green-500',
  luck: 'bg-purple-500',
};

const STAT_LABELS: Record<string, string> = {
  intelligence: '智力',
  charisma: '魅力',
  athleticism: '运动',
  creativity: '创造力',
  diligence: '勤奋',
  luck: '运气',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CharacterPanel({ open, onClose }: Props) {
  const character = useGameStore((s) => s.character);
  const academics = useGameStore((s) => s.academics);
  const clubMemberships = useGameStore((s) => s.clubs);
  const romanceState = useGameStore((s) => s.romanceState);
  const relationships = useGameStore((s) => s.relationships);

  const identityData = identities.find((i) => i.id === character.identity);

  if (!open) return null;

  const partner = romanceState.partnerId
    ? { npc: npcs.find((n) => n.id === romanceState.partnerId), rel: relationships.find((r) => r.npcId === romanceState.partnerId) }
    : null;

  return (
    <motion.div
      className="fixed inset-y-0 right-0 z-40 w-full max-w-sm"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
    >
      <div className="h-full bg-amber-50 border-l border-amber-200 shadow-2xl overflow-y-auto p-5">
        {/* Close */}
        <button
          onClick={onClose}
          className="mb-4 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ✕ 关闭
        </button>

        {/* Name & identity */}
        <div className="text-center mb-5">
          <div className="text-5xl mb-1">{identityData?.emoji ?? '🧑‍🎓'}</div>
          <h2 className="text-lg font-bold text-slate-900">{character.name || '学生'}</h2>
          {identityData && (
            <p className="text-xs text-amber-600 font-medium">{identityData.name} · {identityData.description}</p>
          )}
          <p className="text-xs text-slate-500 mt-1">GPA: {character.gpa.toFixed(1)}</p>
        </div>

        {/* Identity mood info */}
        {identityData && (
          <div className="mb-5 bg-white rounded-lg p-3 border border-amber-200">
            <h4 className="text-xs font-bold text-slate-700 mb-1.5">心情偏好</h4>
            <div className="flex flex-wrap gap-1">
              {identityData.moodTriggers.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">
                  😊 +{t.happinessGain} {t.description}
                </span>
              ))}
              {identityData.moodDrains.map((d, i) => (
                <span key={i} className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-medium text-red-700">
                  😔 -{d.happinessLoss} {d.description}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stat bars */}
        <div className="space-y-2 mb-5">
          {(Object.keys(STAT_LABELS) as Array<keyof typeof STAT_LABELS>).map((key) => (
            <div key={key}>
              <div className="flex justify-between text-xs text-slate-700 mb-0.5">
                <span>{STAT_LABELS[key]}</span>
                <span>{character.stats[key]}</span>
              </div>
              <div className="h-2 rounded-full bg-amber-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${STAT_COLORS[key]}`}
                  style={{ width: `${(character.stats[key] / 20) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Energy / Stress / Happiness */}
        <div className="space-y-2 mb-5">
          <MeterBar label="精力" value={character.energy} max={character.maxEnergy} color="bg-emerald-500" />
          <MeterBar label="压力" value={character.stress} max={100} color="bg-orange-500" />
          <MeterBar label="幸福感" value={character.happiness} max={100} color="bg-yellow-400" />
        </div>

        {/* Romance */}
        <h3 className="text-sm font-bold text-slate-800 mb-2">💕 恋爱</h3>
        {partner?.npc ? (
          <div className="bg-pink-50 rounded-lg p-3 border border-pink-200 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{partner.npc.portrait}</span>
              <div>
                <p className="text-xs font-bold text-pink-800">{partner.npc.name}</p>
                <p className="text-[10px] text-pink-600">浪漫度 {partner.rel?.romance ?? 0} · 约会 {romanceState.datesCompleted} 次</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mb-5">单身</p>
        )}

        {/* Academic record */}
        <h3 className="text-sm font-bold text-slate-800 mb-2">学业</h3>
        <div className="space-y-1.5 mb-5">
          {academics.map((a) => {
            const sub = subjects.find((s) => s.id === a.subjectId);
            return (
              <div key={a.subjectId}>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>{sub?.name ?? a.subjectId}</span>
                  <span>{a.mastery}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-amber-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-400"
                    style={{ width: `${a.mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Clubs */}
        <h3 className="text-sm font-bold text-slate-800 mb-2">社团</h3>
        {clubMemberships.length === 0 && (
          <p className="text-xs text-slate-500">还没有加入社团。</p>
        )}
        <div className="space-y-1.5">
          {clubMemberships.map((c) => {
            const club = clubs.find((cl) => cl.id === c.clubId);
            return (
              <div key={c.clubId}>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>{club?.name ?? c.clubId}</span>
                  <span>{club?.skillName}: {c.skill}</span>
                </div>
                <div className="h-1.5 rounded-full bg-amber-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-pink-400"
                    style={{ width: `${c.skill}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function MeterBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-700 mb-0.5">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-amber-200 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }}
        />
      </div>
    </div>
  );
}
