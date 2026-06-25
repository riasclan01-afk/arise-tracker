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
          />
        </motion.div>
      ))}
    </motion.section>
  );
}