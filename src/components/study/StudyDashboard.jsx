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
  studyStartDate,   // null until first checkbox tick
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
      {/* ── Countdown banner ─────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="rounded-sm border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 flex items-center justify-between"
      >
        <span className="font-heading text-xs uppercase tracking-[0.14em] text-yellow-400/70">
          {hasStarted ? "⏱ Next Week Unlocks In" : "⚔ Start Your Journey"}
        </span>
        {/* ← font-heading here makes the timer match the week headings */}
        <span className="font-heading text-sm font-bold tracking-[0.1em] text-yellow-400">
          {countdown}
        </span>
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