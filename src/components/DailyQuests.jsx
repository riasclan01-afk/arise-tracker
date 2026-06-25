// src/components/DailyQuests.jsx — SHADOW MONARCH DAILY QUEST BOARD
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Sword, BookOpen, Brain, Zap, Target, Diamond } from "lucide-react";

// ── Quest definitions ────────────────────────────────────────────────────────
const QUEST_POOL = [
  { id: "pushups",    icon: "⚔",  label: "Complete 50 push-ups",         xp: 120, gold: 80,  stat: "STR", type: "workout" },
  { id: "run",        icon: "👟",  label: "Run or walk for 20 minutes",   xp: 100, gold: 60,  stat: "AGI", type: "workout" },
  { id: "study2h",    icon: "📖",  label: "Study for 2 focused hours",    xp: 150, gold: 100, stat: "INT", type: "study"   },
  { id: "notes",      icon: "✍",  label: "Write summary notes",           xp: 80,  gold: 50,  stat: "INT", type: "study"   },
  { id: "meditate",   icon: "🧘",  label: "Meditate for 10 minutes",      xp: 60,  gold: 40,  stat: "VIT", type: "misc"    },
  { id: "hydrate",    icon: "💧",  label: "Drink 3L of water today",      xp: 40,  gold: 30,  stat: "VIT", type: "misc"    },
  { id: "nophone",    icon: "📵",  label: "No phone for 1 hour",          xp: 90,  gold: 70,  stat: "SEN", type: "misc"    },
  { id: "stretch",    icon: "🤸",  label: "Full body stretch 15 min",     xp: 70,  gold: 45,  stat: "AGI", type: "workout" },
  { id: "apply",      icon: "💼",  label: "Apply to 2 jobs",              xp: 130, gold: 90,  stat: "SEN", type: "jobs"    },
  { id: "hdlbits",    icon: "⚡",  label: "Solve 2 HDLBits problems",     xp: 110, gold: 75,  stat: "INT", type: "study"   },
  { id: "sleep",      icon: "🌙",  label: "Sleep before midnight",        xp: 80,  gold: 55,  stat: "VIT", type: "misc"    },
  { id: "cold",       icon: "🧊",  label: "Take a cold shower",           xp: 60,  gold: 40,  stat: "STR", type: "misc"    },
];

const STAT_COLORS = {
  STR: "#ef4444",
  INT: "#3b82f6",
  AGI: "#22c55e",
  VIT: "#3b82f6",
  SEN: "#a855f7",
};

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getDailyQuests(dateKey) {
  // Seeded shuffle — same 4 quests per day, changes daily
  const seed = dateKey.split("-").join("") | 0;
  const shuffled = [...QUEST_POOL].sort((a, b) => {
    const ha = Math.sin(seed + a.id.length) * 10000;
    const hb = Math.sin(seed + b.id.length) * 10000;
    return (ha - Math.floor(ha)) - (hb - Math.floor(hb));
  });
  return shuffled.slice(0, 4);
}

// ── XP/Gold popup ────────────────────────────────────────────────────────────
function RewardPop({ xp, gold, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ scale: 0.6, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: -40, opacity: 1 }}
        exit={{ opacity: 0, y: -80 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          className="font-heading text-3xl tracking-widest"
          style={{ color: "#3b82f6", textShadow: "0 0 20px #3b82f6" }}
        >
          +{xp} XP
        </span>
        <span
          className="font-heading text-xl tracking-widest"
          style={{ color: "#93c5fd", textShadow: "0 0 14px #3b82f6" }}
        >
          +{gold} GOLD
        </span>
      </motion.div>
    </motion.div>
  );
}

// ── Quest Row ────────────────────────────────────────────────────────────────
function QuestRow({ quest, done, onComplete, index }) {
  return (
    <motion.div
      className="flex items-center gap-4 p-4 relative overflow-hidden"
      style={{
        background: done ? "rgba(59,130,246,0.06)" : "rgba(0,0,0,0.3)",
        border: `1px solid ${done ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.12)"}`,
        opacity: done ? 0.65 : 1,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: done ? 0.65 : 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      {/* Stat color bar */}
      <div
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: "3px",
          background: STAT_COLORS[quest.stat],
          opacity: done ? 0.4 : 0.9,
        }}
      />

      {/* Icon */}
      <span className="text-2xl select-none" style={{ minWidth: "32px", textAlign: "center" }}>
        {quest.icon}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="font-body text-sm tracking-wide"
          style={{
            color: done ? "rgba(224,231,255,0.45)" : "#e0e7ff",
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {quest.label}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span
            className="font-mono text-[9px] tracking-[0.12em] px-1.5 py-0.5"
            style={{
              color: STAT_COLORS[quest.stat],
              border: `1px solid ${STAT_COLORS[quest.stat]}44`,
              background: `${STAT_COLORS[quest.stat]}11`,
            }}
          >
            {quest.stat}
          </span>
          <span className="font-mono text-[9px] tracking-[0.1em]" style={{ color: "#3b82f6", opacity: 0.7 }}>
            +{quest.xp} XP
          </span>
          <span className="font-mono text-[9px] tracking-[0.1em]" style={{ color: "#93c5fd", opacity: 0.6 }}>
            +{quest.gold} GOLD
          </span>
        </div>
      </div>

      {/* Complete button */}
      {!done ? (
        <motion.button
          onClick={() => onComplete(quest)}
          className="shrink-0 px-3 py-1.5 font-heading text-[10px] uppercase tracking-[0.14em]"
          style={{
            border: "1px solid rgba(59,130,246,0.5)",
            background: "rgba(59,130,246,0.08)",
            color: "#3b82f6",
          }}
          whileHover={{ background: "rgba(59,130,246,0.18)", borderColor: "rgba(59,130,246,0.8)" }}
          whileTap={{ scale: 0.95 }}
        >
          Complete
        </motion.button>
      ) : (
        <div
          className="shrink-0 w-7 h-7 flex items-center justify-center"
          style={{ border: "1px solid rgba(59,130,246,0.35)", background: "rgba(59,130,246,0.1)" }}
        >
          <span style={{ color: "#3b82f6", fontSize: "14px" }}>✓</span>
        </div>
      )}
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function DailyQuests({ open, onClose, questState, onUpdateQuestState }) {
  const todayKey  = getTodayKey();
  const quests    = getDailyQuests(todayKey);
  const completed = questState?.completed?.[todayKey] || [];
  const totalXP   = questState?.totalXP   || 0;
  const totalGold = questState?.totalGold || 0;

  const [rewardPop, setRewardPop] = useState(null);

  const handleComplete = (quest) => {
    if (completed.includes(quest.id)) return;
    const newCompleted = [...completed, quest.id];
    onUpdateQuestState({
      ...questState,
      completed: { ...(questState?.completed || {}), [todayKey]: newCompleted },
      totalXP:   totalXP   + quest.xp,
      totalGold: totalGold + quest.gold,
    });
    setRewardPop({ xp: quest.xp, gold: quest.gold, key: Date.now() });
  };

  const doneCount = quests.filter((q) => completed.includes(q.id)).length;
  const allDone   = doneCount === quests.length;

  return (
    <>
      <AnimatePresence>
        {rewardPop && (
          <RewardPop
            key={rewardPop.key}
            xp={rewardPop.xp}
            gold={rewardPop.gold}
            onDone={() => setRewardPop(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[998]"
              style={{
                background: "rgba(0,0,0,0.88)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              className="fixed inset-0 z-[999] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md md:max-w-lg relative"
                style={{
                  background: "#0a0a14",
                  border: "1px solid rgba(59,130,246,0.45)",
                  clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
                initial={{ scale: 0.88, y: 40, opacity: 0 }}
                animate={{ scale: 1,    y: 0,  opacity: 1 }}
                exit={{    scale: 0.88, y: 40, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Corner accents */}
                {[0,1,2,3].map((i) => (
                  <div key={i} className="absolute" style={{
                    width: "18px", height: "18px",
                    border: "2px solid #3b82f6",
                    borderWidth: i === 0 ? "2px 0 0 2px" : i === 1 ? "2px 2px 0 0" : i === 2 ? "0 0 2px 2px" : "0 2px 2px 0",
                    [i === 0 || i === 2 ? "left" : "right"]: "0px",
                    [i === 0 || i === 1 ? "top"  : "bottom"]: "0px",
                    opacity: 0.65,
                    zIndex: 10,
                  }} />
                ))}

                <div className="p-6 flex flex-col gap-5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div style={{ width: "14px", height: "1px", background: "#3b82f6", opacity: 0.5 }} />
                        <h2 className="font-heading text-base uppercase tracking-[0.22em]" style={{ color: "#3b82f6" }}>
                          Daily Quests
                        </h2>
                      </div>
                      <p className="font-mono text-[9px] tracking-[0.14em]" style={{ color: "rgba(59,130,246,0.45)" }}>
                        {todayKey} · {doneCount}/{quests.length} COMPLETE
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      style={{ padding: "6px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)" }}
                    >
                      <X className="w-4 h-4" style={{ color: "#3b82f6", opacity: 0.6 }} />
                    </button>
                  </div>

                  {/* XP / Gold totals */}
                  <div
                    className="grid grid-cols-2 gap-3"
                    style={{ borderTop: "1px solid rgba(59,130,246,0.15)", paddingTop: "12px" }}
                  >
                    {[
                      { label: "TOTAL XP",   value: totalXP,   color: "#3b82f6" },
                      { label: "TOTAL GOLD", value: totalGold, color: "#93c5fd" },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center p-3"
                        style={{ border: "1px solid rgba(59,130,246,0.15)", background: "rgba(59,130,246,0.04)" }}
                      >
                        <span className="font-mono text-[9px] tracking-[0.14em]" style={{ color: "rgba(59,130,246,0.5)" }}>
                          {item.label}
                        </span>
                        <span className="font-heading text-2xl mt-1" style={{ color: item.color }}>
                          {item.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="progress-track">
                      <motion.div
                        className="progress-fill-blue"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(doneCount / quests.length) * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="font-mono text-[9px]" style={{ color: "rgba(59,130,246,0.4)" }}>QUEST PROGRESS</span>
                      <span className="font-mono text-[9px]" style={{ color: "rgba(59,130,246,0.4)" }}>{Math.round((doneCount / quests.length) * 100)}%</span>
                    </div>
                  </div>

                  {/* Quest list */}
                  <div className="flex flex-col gap-2">
                    {quests.map((quest, i) => (
                      <QuestRow
                        key={quest.id}
                        quest={quest}
                        done={completed.includes(quest.id)}
                        onComplete={handleComplete}
                        index={i}
                      />
                    ))}
                  </div>

                  {/* All done banner */}
                  <AnimatePresence>
                    {allDone && (
                      <motion.div
                        className="flex flex-col items-center gap-1 py-4"
                        style={{ border: "1px solid rgba(59,130,246,0.4)", background: "rgba(59,130,246,0.07)" }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="font-heading text-base tracking-[0.2em] flex items-center gap-2" style={{ color: "#3b82f6" }}>
                          <Diamond size={11} strokeWidth={2.5} /> ALL QUESTS CLEAR <Diamond size={11} strokeWidth={2.5} />
                        </span>
                        <span className="font-mono text-[9px] tracking-[0.14em]" style={{ color: "rgba(59,130,246,0.5)" }}>
                          RETURN TOMORROW FOR NEW MISSIONS
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reset note */}
                  <p className="font-mono text-[9px] text-center tracking-[0.1em] flex items-center justify-center gap-1.5" style={{ color: "rgba(59,130,246,0.25)" }}>
                    <Diamond size={8} strokeWidth={2.5} /> Quests reset daily at midnight <Diamond size={8} strokeWidth={2.5} />
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}