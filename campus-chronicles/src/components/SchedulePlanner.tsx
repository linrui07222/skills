import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import type { TimeSlot } from '@/engine/types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS: TimeSlot[] = ['morning', 'afternoon', 'evening'];
const ACTIVITIES = ['Class', 'Study', 'Homework', 'Club', 'Socialize', 'Rest'];

const ACTIVITY_COLORS: Record<string, string> = {
  Class: 'bg-blue-200 text-blue-800',
  Study: 'bg-amber-200 text-amber-800',
  Homework: 'bg-green-200 text-green-800',
  Club: 'bg-pink-200 text-pink-800',
  Socialize: 'bg-purple-200 text-purple-800',
  Rest: 'bg-slate-200 text-slate-700',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SchedulePlanner({ open, onClose }: Props) {
  const schedule = useGameStore((s) => s.schedule);
  const updateScheduleSlot = useGameStore((s) => s.updateScheduleSlot);

  const [editingCell, setEditingCell] = useState<{ day: number; slot: TimeSlot } | null>(null);

  if (!open) return null;

  const getEntry = (day: number, slot: TimeSlot) =>
    schedule.find((e) => e.day === day && e.slot === slot)?.activity ?? '';

  const handleSelect = (day: number, slot: TimeSlot, activity: string) => {
    updateScheduleSlot(day, slot, activity);
    setEditingCell(null);
  };

  return (
    <motion.div
      className="fixed inset-y-0 right-0 z-40 w-full max-w-lg"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
    >
      <div className="h-full bg-amber-50 border-l border-amber-200 shadow-2xl overflow-y-auto p-5">
        <button
          onClick={onClose}
          className="mb-4 text-sm font-medium text-navy-600 hover:text-navy-900"
        >
          ✕ Close
        </button>

        <h2 className="text-lg font-bold text-navy-900 mb-4">Schedule Planner</h2>

        {/* Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-1.5 text-navy-600 font-medium" />
                {DAYS.map((d) => (
                  <th key={d} className="p-1.5 text-navy-600 font-medium text-center">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot}>
                  <td className="p-1.5 text-navy-700 font-medium capitalize align-top">
                    {slot}
                  </td>
                  {DAYS.map((_, dayIdx) => {
                    const activity = getEntry(dayIdx, slot);
                    const isEditing =
                      editingCell?.day === dayIdx && editingCell?.slot === slot;

                    return (
                      <td key={dayIdx} className="p-0.5 align-top">
                        {isEditing ? (
                          <div className="flex flex-col gap-0.5">
                            {ACTIVITIES.map((a) => (
                              <button
                                key={a}
                                onClick={() => handleSelect(dayIdx, slot, a)}
                                className={`rounded px-1 py-0.5 text-[10px] font-medium ${ACTIVITY_COLORS[a]}`}
                              >
                                {a}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingCell({ day: dayIdx, slot })}
                            className={`w-full h-10 rounded text-[10px] font-medium border border-amber-200 transition-colors ${
                              activity
                                ? ACTIVITY_COLORS[activity] ?? 'bg-amber-100 text-navy-700'
                                : 'bg-amber-50 text-navy-400 hover:bg-amber-100'
                            }`}
                          >
                            {activity || '+'}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
