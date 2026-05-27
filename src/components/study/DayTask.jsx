import { motion } from "framer-motion";
import { BOOK_COLORS } from "../../data/studyPlan";

export default function DayTask({ task, checked, onToggle }) {
  const colors = BOOK_COLORS[task.book] ?? BOOK_COLORS.Review;

  return (
    <motion.div
      className={`grid min-h-11 grid-cols-[auto_1fr_auto] items-start gap-3 rounded-lg border p-3 ${
        checked ? "border-[rgba(255,215,0,0.25)] bg-[rgba(255,215,0,0.04)]" : "border-[var(--border-dim)] bg-bgSecondary/70"
      }`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <span
        className="hex-clip mt-0.5 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
        style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
      >
        {task.book}
      </span>
      <div>
        <p className={`font-body text-sm ${checked ? "text-textMuted line-through" : "text-textPrimary"}`}>
          <span className="mr-2 font-heading text-xs uppercase tracking-[0.12em] text-textSecondary">{task.day}</span>
          {task.task}
        </p>
        <p className="mt-1 font-body text-xs text-textMuted">{task.side}</p>
      </div>
      <button
        className={`checkbox-glow mt-1 flex h-11 w-11 items-center justify-center rounded border transition ${
          checked ? "border-accentBlue bg-accentBlue/30" : "border-[var(--border-dim)] bg-transparent"
        }`}
        onClick={onToggle}
        aria-label={`Toggle ${task.id}`}
      >
        <span className={`h-4 w-4 rounded-sm border ${checked ? "border-accentBlue bg-accentBlue shadow-[0_0_12px_rgba(79,195,247,0.8)]" : "border-textMuted"}`} />
      </button>
    </motion.div>
  );
}
