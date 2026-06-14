import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { npcs } from '@/data/npcs';

export default function EventDialog() {
  const currentEvent = useGameStore((s) => s.currentEvent);
  const resolveChoice = useGameStore((s) => s.resolveChoice);

  if (!currentEvent) return null;

  const npc = currentEvent.npcId
    ? npcs.find((n) => n.id === currentEvent.npcId)
    : null;

  return (
    <AnimatePresence>
      {currentEvent && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-lg rounded-2xl bg-amber-50 p-6 shadow-2xl border border-amber-200"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          >
            {/* NPC portrait */}
            {npc && (
              <div className="mb-3 text-5xl text-center">{npc.portrait}</div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold text-navy-900 text-center mb-2">
              {currentEvent.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-navy-700 leading-relaxed mb-5 text-center">
              {currentEvent.description}
            </p>

            {/* Choices */}
            <div className="flex flex-col gap-2">
              {currentEvent.choices.map((choice, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => resolveChoice(idx)}
                  className="w-full rounded-xl bg-amber-100 px-4 py-3 text-sm font-medium text-navy-800 border border-amber-300 hover:bg-amber-200 transition-colors text-left"
                >
                  {choice.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
