import { useGameStore } from "@/store/gameStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { npcs } from "@/data/npcs";
import { identities } from "@/data/identities";

const ENDINGS: Record<string, { emoji: string; title: string; desc: string }> = {
  Valedictorian: {
    emoji: "🎓",
    title: "毕业生代表",
    desc: "你的才华最为耀眼。你以班级第一的成绩毕业，准备好征服世界。",
  },
  "Popular Star": {
    emoji: "⭐",
    title: "校园明星",
    desc: "每个人都知道你的名字。你带着数不清的朋友和难忘的回忆离开了高中。",
  },
  "Athlete Champion": {
    emoji: "🏆",
    title: "运动冠军",
    desc: "从选拔到奖杯，你证明了汗水和坚持终有回报。人群最后一次为你的名字欢呼。",
  },
  "Artist Prodigy": {
    emoji: "🎨",
    title: "艺术天才",
    desc: "你的创造力没有边界。校园的墙壁仍在回响着你的画作、音乐和表演。",
  },
  "True Love": {
    emoji: "💕",
    title: "真爱至上",
    desc: "在学业之外，你找到了最珍贵的宝藏——一段真挚的感情。你们约定毕业后也要在一起。",
  },
  Burnout: {
    emoji: "😩",
    title: "身心俱疲",
    desc: "压力太大了。你撑过来了，但代价是什么？有时候，能挺过来就足够了。",
  },
  "Struggling Graduate": {
    emoji: "😅",
    title: "艰难毕业",
    desc: "并不容易，成绩也不算好，但你走过了那个舞台。这需要勇气。",
  },
  "Average Graduate": {
    emoji: "📜",
    title: "普通毕业生",
    desc: "高中并不特别，但那是属于你的。有时候，平凡也挺好的。",
  },
};

function determineEnding(
  gpa: number,
  stats: { intelligence: number; charisma: number; athleticism: number; creativity: number },
  happiness: number,
  stress: number,
  clubs: { skill: number }[],
  romanceState: { partnerId: string | null; datingLevel: number; datesCompleted: number },
): string {
  if (romanceState.partnerId && romanceState.datingLevel >= 3 && romanceState.datesCompleted >= 5) return "True Love";
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
  const { character, clubs, relationships, eventLog, romanceState, newGame } = useGameStore();

  const identityData = identities.find((i) => i.id === character.identity);

  const endingKey = determineEnding(
    character.gpa,
    character.stats,
    character.happiness,
    character.stress,
    clubs,
    romanceState
  );
  const ending = ENDINGS[endingKey];
  const friendCount = relationships.filter((r) => r.trust >= 40).length;
  const keyMoments = eventLog.slice(-4);
  const partner = romanceState.partnerId ? npcs.find((n) => n.id === romanceState.partnerId) : null;

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
            数据总结
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="身份" value={identityData ? `${identityData.emoji} ${identityData.name}` : '学生'} />
            <Stat label="GPA" value={character.gpa.toFixed(2)} />
            <Stat label="幸福感" value={`${character.happiness}%`} />
            <Stat label="智力" value={character.stats.intelligence} />
            <Stat label="魅力" value={character.stats.charisma} />
            <Stat label="运动" value={character.stats.athleticism} />
            <Stat label="创造力" value={character.stats.creativity} />
            <Stat label="加入社团" value={clubs.length} />
            <Stat label="结交朋友" value={friendCount} />
            {partner && <Stat label="恋人" value={`${partner.portrait} ${partner.name.split(' ')[0]}`} />}
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
              相册回忆
            </h2>
            <div className="space-y-2">
              {keyMoments.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm"
                >
                  <span className="text-amber-400">📷</span>
                  <span className="text-purple-100">{m.eventId.replace(/evt-/g, "").replace(/-/g, " ")}</span>
                  <span className="ml-auto text-xs text-white/40">第{m.week}周</span>
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
            重新开始
          </button>
          <button
            className="flex-1 rounded-xl border border-white/20 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            onClick={() => alert("Share feature coming soon!")}
          >
            分享
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
