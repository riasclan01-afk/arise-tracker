// components/study/WeekCard.jsx
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lock } from "lucide-react";
import DayTask from "./DayTask";

const expandVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

export default function WeekCard({
  week,
  checkedMap,
  notesMap,
  onToggle,
  onUpdateNote,
  isLocked,
  isCurrent,
}) {
  const completed = week.days.filter((d) => checkedMap[d.id]).length;
  const percent   = (completed / week.days.length) * 100;

  return (
    <details
      className="group card-glow bg-bgCard p-4"
      style={{
        position: "relative",
        opacity: isLocked ? 0.45 : 1,
        pointerEvents: isLocked ? "none" : "auto",
        transition: "opacity 0.3s",
      }}
      open={isCurrent}
    >
      <summary className="list-none cursor-pointer" style={{ position: "relative", zIndex: 1 }}>
        <div className="flex min-h-11 items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accentPurple">
              {week.phase}
            </p>
            <h3 className="mt-1 font-heading text-xl uppercase tracking-[0.08em] text-textPrimary flex flex-wrap items-center gap-2">
              <span className="rounded-sm border border-accentBlue/40 px-2 py-0.5 text-sm text-accentBlue">
                {`Week ${week.week}`}
              </span>
              {isCurrent && (
                <span className="rounded-sm border border-yellow-500/50 bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400 font-mono tracking-widest animate-pulse">
                  ● ACTIVE
                </span>
              )}
              {isLocked && (
                <span className="rounded-sm border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-textMuted font-mono tracking-widest flex items-center gap-1">
                  <Lock className="w-3 h-3" /> LOCKED
                </span>
              )}
              <span className="text-base">{week.title}</span>
            </h3>
            <p className="mt-1 text-sm text-textSecondary">{week.subtitle}</p>
          </div>
          <ChevronDown className="mt-1 text-textSecondary transition group-open:rotate-180 shrink-0" />
        </div>

        {/* Progress bar */}
        <div className="progress-track mt-3" style={{ height: "8px" }}>
          <motion.div
            className="progress-fill-blue"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: percent / 100 }}
            transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translate(50%, -50%)",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "var(--accent-blue)",
                boxShadow: "0 0 10px var(--accent-blue), 0 0 20px rgba(0,208,255,0.6)",
                opacity: percent > 0 && percent < 100 ? 1 : 0,
              }}
            />
          </motion.div>
        </div>

        <p className="mt-2 font-mono text-xs text-textSecondary tracking-[0.04em]">
          {`${completed}/${week.days.length} COMPLETE — ${Math.round(percent)}%`}
        </p>
      </summary>

      {isLocked && (
        <div className="mt-4 flex items-center justify-center gap-2 py-6 text-textMuted font-mono text-xs uppercase tracking-widest">
          <Lock className="w-4 h-4" />
          <span>Complete the current week to unlock</span>
        </div>
      )}

      <AnimatePresence initial={false}>
        {!isLocked && (
          <motion.div
            className="mt-4 space-y-2 overflow-hidden"
            style={{ position: "relative", zIndex: 1 }}
            initial="hidden"
            animate="visible"
            variants={expandVariants}
          >
            {week.days.map((day) => (
              <DayTask
                key={day.id}
                task={day}
                checked={Boolean(checkedMap[day.id])}
                note={notesMap?.[day.id] || ""}
                onToggle={() => onToggle(day.id)}
                onUpdateNote={(note) => onUpdateNote?.(day.id, note)}
                isToday={day.isToday}
                isPast={day.isPast}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </details>
  );
}