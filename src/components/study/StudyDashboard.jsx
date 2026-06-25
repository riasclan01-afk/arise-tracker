// components/study/StudyDashboard.jsx
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { STUDY_PLAN } from "../../data/studyPlan";
import WeekCard from "./WeekCard";
import {
  getCurrentWeekIndex,
  getDatesForWeek,
  getDayLabel,
  getMsUntilNextWeek,
} from "../../utils/progress";

function WeekAnalytics({ enrichedWeeks, checkedMap }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-sm p-4"
      style={{ border: "1px solid rgba(59,130,246,0.12)", background: "rgba(59,130,246,0.03)" }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accentBlue/60 mb-3">
        ◆ Phase Progress
      </p>
      <div className="flex flex-col gap-2">
        {enrichedWeeks.map((week) => {
          const done = week.days.filter((d) => checkedMap[d.id]).length;
          const pct = Math.round((done / week.days.length) * 100);
          return (
            <div key={week.week} className="flex items-center gap-3">
              <span
                className="font-mono text-[9px] w-12 shrink-0 text-right"
                style={{ color: "rgba(224,231,255,0.35)" }}
              >
                W{week.week}
              </span>
              <div className="flex-1 h-[6px] relative" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(59,130,246,0.08)" }}>
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{
                    background: pct === 100
                      ? "linear-gradient(90deg, #22c55e88, #22c55e)"
                      : week.isCurrent
                      ? "linear-gradient(90deg, #3b82f688, #3b82f6)"
                      : week.isLocked
                      ? "rgba(59,130,246,0.15)"
                      : "linear-gradient(90deg, #8b5cf688, #8b5cf6)",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: week.week * 0.04 }}
                />
              </div>
              <span
                className="font-mono text-[9px] w-8 shrink-0 text-right"
                style={{
                  color: pct === 100 ? "#22c55e" : week.isCurrent ? "#3b82f6" : "rgba(224,231,255,0.3)",
                }}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function StudyDashboard({
  studyChecked,
  studyNotes,
  onToggleStudy,
  onUpdateNote,
  studyStartDate,
  onResetWeek,
  onFocusTask,
}) {
  const today    = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const hasStarted = Boolean(studyStartDate);

  // Current week index — 0 until user starts
  const currentWeekIndex = useMemo(
    () => (hasStarted ? getCurrentWeekIndex(studyStartDate, today) : 0),
    [studyStartDate, hasStarted]
  );

  // ── Countdown to next week ──────────────────────────────────────────────
  const [countdown, setCountdown] = useState("--:--:--");
  useEffect(() => {
    if (!hasStarted) {
      setCountdown("CHECK A TASK TO BEGIN");
      return;
    }
    const update = () => {
      const ms           = getMsUntilNextWeek(studyStartDate, new Date());
      const totalSeconds = Math.floor(ms / 1000);
      const days         = Math.floor(totalSeconds / 86400);
      const hours        = Math.floor((totalSeconds % 86400) / 3600);
      const minutes      = Math.floor((totalSeconds % 3600) / 60);
      const seconds      = totalSeconds % 60;
      if (days > 0) {
        setCountdown(
          `${days}D ${String(hours).padStart(2, "0")}H ${String(minutes).padStart(2, "0")}M`
        );
      } else {
        setCountdown(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [studyStartDate, hasStarted]);

  // ── Enrich weeks with dynamic day labels + lock state ──────────────────
  const enrichedWeeks = useMemo(() => {
    return STUDY_PLAN.map((week, index) => {
      const isLocked  = hasStarted ? index > currentWeekIndex : index > 0;
      const isCurrent = hasStarted ? index === currentWeekIndex : index === 0;

      // If not started yet, don't attach real dates — use plan's static labels
      if (!hasStarted) {
        return { ...week, isLocked, isCurrent };
      }

      const weekDates   = getDatesForWeek(studyStartDate, index);
      const enrichedDays = week.days.map((day, dayIndex) => {
        const date    = weekDates[dayIndex];
        const dateKey = date.toISOString().slice(0, 10);
        return {
          ...day,
          day:     getDayLabel(date),
          dateKey,
          isToday: dateKey === todayKey,
          isPast:  date < today && dateKey !== todayKey,
        };
      });

      return { ...week, days: enrichedDays, isLocked, isCurrent };
    });
  }, [studyStartDate, hasStarted, currentWeekIndex, todayKey]);

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* ── Countdown banner + Reset ─────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="rounded-sm border border-accentBlue/20 bg-accentBlue/5 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <span className="font-heading text-xs uppercase tracking-[0.14em] text-accentBlue/70">
            {hasStarted ? "⏱ Next Week Unlocks In" : "⚔ Start Your Journey"}
          </span>
          <span className="font-heading text-sm font-bold tracking-[0.1em] text-accentBlue">
            {countdown}
          </span>
        </div>
        {hasStarted && (
          <motion.button
            onClick={onResetWeek}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] rounded-sm"
            style={{
              border: "1px solid rgba(139,92,246,0.4)",
              background: "rgba(139,92,246,0.08)",
              color: "#8b5cf6",
            }}
            whileHover={{ background: "rgba(139,92,246,0.16)" }}
            whileTap={{ scale: 0.96 }}
            title="Reset your start date to today — use this to redo missed weeks"
          >
            ⟳ Reset Week
          </motion.button>
        )}
      </motion.div>

      {/* ── Analytics chart ─────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <WeekAnalytics enrichedWeeks={enrichedWeeks} checkedMap={studyChecked} />
      </motion.div>

      {enrichedWeeks.map((week) => (
        <motion.div key={week.week} variants={itemVariants}>
          <WeekCard
            week={week}
            checkedMap={studyChecked}
            notesMap={studyNotes}
            onToggle={onToggleStudy}
            onUpdateNote={onUpdateNote}
            isLocked={week.isLocked}
            isCurrent={week.isCurrent}
            onFocus={onFocusTask}
          />
        </motion.div>
      ))}
    </motion.section>
  );
}