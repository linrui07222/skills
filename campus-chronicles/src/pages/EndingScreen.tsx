import { useGameStore } from "@/store/gameStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ENDINGS: Record<string, { emoji: string; title: string; desc: string }> = {
  Valedictorian: {
    emoji: "🎓",
    title: "Valedictorian",
    desc: "Your brilliance shone brightest. You graduate at the top of your class, ready to conquer the world.",
  },
  "Popular Star": {
    emoji: "⭐",
    title: "Popular Star",
    desc: "Everyone knows your name. You leave high school with more friends than you can count and memories to last a lifetime.",
  },
  "Athlete Champion": {
    emoji: "🏆",
    title: "Athlete Champion",
    desc: "From tryouts to trophies, you proved that dedication and sweat pay off. The crowd cheers your name one last time.",
  },
  "Artist Prodigy": {
    emoji: "🎨",
    title: "Artist Prodigy",
    desc: "Your creativity knew no bounds. The school walls still echo with your art, music, and performances.",
  },
  Burnout: {
    emoji: "😩",
    title: "Burnout",
    desc: "The pressure was too much. You made it through, but at what cost? Sometimes surviving is enough.",
  },
  "Struggling Graduate": {
    emoji: "😅",
    title: "Struggling Graduate",
    desc: "It wasn't easy, and the grades weren't great, but you crossed that stage. That takes guts.",
  },
  "Average Graduate": {
    emoji: "📜",
    title: "Average Graduate",
    desc: "High school wasn't extraordinary, but it was yours. And sometimes, ordinary is perfectly fine.",
  },
};

function determineEnding(
  gpa: number,
  stats: { intelligence: number; charisma: number; athleticism: number; creativity: number },
  happiness: number,
  stress: number,
  clubs: { skill: number }[]
): string {
  if (gpa >= 3.8 && stats.intelligence >= 15) return "Valedictorian";
  if (stats.charisma >= 15 && happiness >= 70) return "Popular Star";
  if (stats.athleticism >= 15 && clubs.some((c) => c.skill >= 50)) return "Athlete Champion";
  if (stats.creativity >= 15 && clubs.some((c) => c.skill >= 50)) return "Artist Prodigy";
  if (stress >= 80) return "Burnout";
  if (gpa < 2.0) return "Struggling Graduate";
  return "Average Graduate";
}

function ConfettiParticle({ index }: { index: number }) {
  const colors = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6"];
  const color = colors[index % colors.length];
  const left = (index * 17 + 5) % 100;
  const delay = (index * 0.3) % 3;
  const duration = 2.5 + (index % 5) * 0.5;

  return (
    <motion.div
      className="absolute top-0 rounded-sm"
      style={{
        left: `${left}%`,
        width: 8,
        height: 8,
        backgroundColor: color,
      }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: "100vh", opacity: 0, rotate: 720 }}
      transition={{ duration, delay, ease: "easeIn", repeat: Infinity, repeatDelay: 1 }}
    />
  );
}

export default function EndingScreen() {
  const navigate = useNavigate();
  const { character, clubs, relationships, eventLog, newGame } = useGameStore();

  const endingKey = determineEnding(
    character.gpa,
    character.stats,
    character.happiness,
    character.stress,
    clubs
  );
  const ending = ENDINGS[endingKey];
  const friendCount = relationships.filter((r) => r.trust >= 40).length;
  const keyMoments = eventLog.slice(-4);

  const handlePlayAgain = () => {
    newGame();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-amber-900 text-white">
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiParticle key={i} index={i} />
      ))}

      <div className="relative z-10 mx-auto max-w-lg px-4 py-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="block text-7xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            {ending.emoji}
          </motion.span>
          <motion.h1
            className="mt-4 text-4xl font-extrabold tracking-tight text-amber-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {ending.title}
          </motion.h1>
          <motion.p
            className="mt-3 text-lg leading-relaxed text-purple-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {ending.desc}
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-amber-300">
            Stats Summary
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="GPA" value={character.gpa.toFixed(2)} />
            <Stat label="Happiness" value={`${character.happiness}%`} />
            <Stat label="Intelligence" value={character.stats.intelligence} />
            <Stat label="Charisma" value={character.stats.charisma} />
            <Stat label="Athleticism" value={character.stats.athleticism} />
            <Stat label="Creativity" value={character.stats.creativity} />
            <Stat label="Clubs Joined" value={clubs.length} />
            <Stat label="Friends Made" value={friendCount} />
          </div>
        </motion.div>

        {keyMoments.length > 0 && (
          <motion.div
            className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-amber-300">
              Photo Album
            </h2>
            <div className="space-y-2">
              {keyMoments.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm"
                >
                  <span className="text-amber-400">📷</span>
                  <span className="text-purple-100">{m.eventId.replace(/evt-/g, "").replace(/-/g, " ")}</span>
                  <span className="ml-auto text-xs text-white/40">Week {m.week}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="mt-8 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
        >
          <button
            onClick={handlePlayAgain}
            className="flex-1 rounded-xl bg-amber-400 py-3 text-sm font-bold text-indigo-950 shadow-lg transition hover:bg-amber-300"
          >
            Play Again
          </button>
          <button
            className="flex-1 rounded-xl border border-white/20 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            onClick={() => alert("Share feature coming soon!")}
          >
            Share
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold text-amber-200">{value}</span>
    </div>
  );
}
