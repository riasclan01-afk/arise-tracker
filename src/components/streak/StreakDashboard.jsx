// components/streak/StreakDashboard.jsx — FIXED: real data, no fake longest, no double brackets
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";

export default function StreakDashboard({ streak, studyChecked, workoutChecked, onClose }) {
  const [streakHistory, setStreakHistory] = useState([]);

  // ── Real counts from actual checked state ─────────────────────────────────
  const realStudyTotal = useMemo(
    () => Object.values(studyChecked || {}).filter(Boolean).length,
    [studyChecked]
  );

  const realWorkoutTotal = useMemo(
    () => Object.values(workoutChecked || {}).filter(Boolean).length,
    [workoutChecked]
  );

  useEffect(() => {
    const today = new Date();
    const history = [];
    const activeDayCount = Math.min(streak.count, 30);
    const studyPerDay = activeDayCount > 0 ? Math.round(realStudyTotal / activeDayCount) : 0;
    const workoutPerDay = activeDayCount > 0 ? Math.round(realWorkoutTotal / activeDayCount) : 0;

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const daysSinceStart = 29 - i;
      const hasActivity = daysSinceStart < streak.count;

      history.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        hasActivity,
        studyTasks: hasActivity ? studyPerDay : 0,
        workoutExercises: hasActivity ? workoutPerDay : 0,
        totalPoints: hasActivity ? studyPerDay + workoutPerDay : 0,
        isToday: i === 0,
      });
    }

    setStreakHistory(history);
  }, [streak.count, realStudyTotal, realWorkoutTotal]);

  const currentStreak = streak.count;

  // ✅ FIX: no longer hardcoded to 15 — uses real tracked longest or falls back to count
  const longestStreak = streak.longest ?? currentStreak;

  const totalActiveDays = streakHistory.filter((d) => d.hasActivity).length;
  const averageDailyPoints =
    totalActiveDays > 0
      ? Math.round((realStudyTotal + realWorkoutTotal) / totalActiveDays)
      : 0;

  // Guard against 0/0 in progress bar
  const progressPct =
    longestStreak > 0 ? Math.min(100, (currentStreak / longestStreak) * 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-bright)",
          borderRadius: "6px",
          boxShadow:
            "0 0 0 1px rgba(0,208,255,0.05), 0 32px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.04)",
          padding: "28px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing top edge */}
        <div style={{
          position: "absolute", top: 0, left: "20px", right: "20px", height: "1px",
          background: "linear-gradient(90deg, transparent 0%, var(--accent-gold) 50%, transparent 100%)",
          opacity: 0.7, pointerEvents: "none",
        }} />

        {/* HUD corner brackets — modal only, NOT on inner cards */}
        {[
          { top: 0, left: 0, borderTop: "1.5px solid var(--border-bright)", borderLeft: "1.5px solid var(--border-bright)" },
          { top: 0, right: 0, borderTop: "1.5px solid var(--border-bright)", borderRight: "1.5px solid var(--border-bright)" },
          { bottom: 0, left: 0, borderBottom: "1.5px solid var(--border-bright)", borderLeft: "1.5px solid var(--border-bright)" },
          { bottom: 0, right: 0, borderBottom: "1.5px solid var(--border-bright)", borderRight: "1.5px solid var(--border-bright)" },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: "12px", height: "12px", pointerEvents: "none", zIndex: 3, ...s }} />
        ))}

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex items-center justify-center w-8 h-8 rounded-sm transition-colors z-10"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-dim)", color: "var(--text-muted)" }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", color: "var(--accent-gold)", opacity: 0.8, marginBottom: "4px" }}>
            SYSTEM · STREAK LOG
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-primary)", lineHeight: 1 }}>
            Streak Stats
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            Your consistency journey
          </p>
        </div>

        <div style={{ height: "1px", background: "var(--border-hairline)", marginBottom: "24px" }} />

        {/* Stats Grid — plain panels, NO card-glow to avoid double brackets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <HUDStatCard value={currentStreak} label="Current Streak" accent="var(--accent-gold)" />
          <HUDStatCard value={longestStreak} label="Longest Streak" accent="var(--accent-purple)" />
          <HUDStatCard value={totalActiveDays} label="Active Days" accent="var(--accent-blue)" />
          <HUDStatCard value={averageDailyPoints} label="Avg Pts / Day" accent="var(--accent-teal)" />
        </div>

        {/* Streak Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Streak Progress
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-gold)" }}>
              {currentStreak} / {longestStreak > 0 ? longestStreak : "—"} days
            </p>
          </div>
          <div className="progress-track">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                height: "100%", borderRadius: "2px",
                background: "linear-gradient(90deg, var(--accent-gold), var(--accent-purple))",
                boxShadow: "0 0 8px rgba(255,199,54,0.5)",
              }}
            />
          </div>
        </div>

        {/* Daily Breakdown — real numbers */}
        <div className="mb-8">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent-blue)", marginBottom: "14px", opacity: 0.8 }}>
            Daily Breakdown
          </p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-secondary)" }}>Study Tasks Completed</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-blue)" }}>{realStudyTotal}</p>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill-blue"
                  style={{
                    width: `${realStudyTotal + realWorkoutTotal > 0
                      ? (realStudyTotal / (realStudyTotal + realWorkoutTotal)) * 100
                      : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-secondary)" }}>Workout Exercises Done</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-purple)" }}>{realWorkoutTotal}</p>
              </div>
              <div className="progress-track">
                <div style={{
                  height: "100%", borderRadius: "2px",
                  background: "linear-gradient(90deg, var(--accent-purple), var(--accent-pink))",
                  boxShadow: "0 0 8px rgba(124,77,255,0.5)",
                  width: `${realStudyTotal + realWorkoutTotal > 0
                    ? (realWorkoutTotal / (realStudyTotal + realWorkoutTotal)) * 100
                    : 0}%`,
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="mb-8">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent-blue)", marginBottom: "14px", opacity: 0.8 }}>
            Last 30 Days
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {streakHistory.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.018, duration: 0.2 }}
                className="relative group"
                style={{
                  aspectRatio: "1", borderRadius: "4px",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  background: day.hasActivity
                    ? "linear-gradient(135deg, rgba(0,208,255,0.10), rgba(124,77,255,0.10))"
                    : "rgba(255,255,255,0.025)",
                  border: day.isToday
                    ? "1px solid var(--accent-gold)"
                    : day.hasActivity
                    ? "1px solid rgba(0,208,255,0.25)"
                    : "1px solid var(--border-hairline)",
                  boxShadow: day.isToday ? "0 0 8px rgba(255,199,54,0.3)" : "none",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)" }}>{day.dayName}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: day.hasActivity ? "var(--accent-blue)" : "var(--text-muted)" }}>
                  {day.dateNum}
                </span>
                <div
                  className="absolute bottom-full left-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
                  style={{
                    transform: "translateX(-50%)",
                    background: "var(--bg-secondary)", border: "1px solid var(--border-bright)",
                    borderRadius: "4px", padding: "4px 8px", whiteSpace: "nowrap",
                    fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-secondary)", letterSpacing: "0.06em",
                  }}
                >
                  {day.month} {day.dateNum}{day.hasActivity ? ` · ${day.totalPoints} pts` : " · INACTIVE"}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Motivational panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(255,199,54,0.06), rgba(124,77,255,0.06))",
            border: "1px solid rgba(255,199,54,0.2)", borderRadius: "4px",
          }}
        >
          <p style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {currentStreak >= 7 ? (
              <><span style={{ color: "var(--accent-gold)", fontFamily: "var(--font-heading)", letterSpacing: "0.08em" }}>STREAK ACTIVE — </span>{currentStreak} days of continuous effort. The System acknowledges your discipline.</>
            ) : currentStreak >= 3 ? (
              <><span style={{ color: "var(--accent-blue)", fontFamily: "var(--font-heading)", letterSpacing: "0.08em" }}>PROGRESS DETECTED — </span>{7 - currentStreak} more days to reach a week-long streak.</>
            ) : (
              <><span style={{ color: "var(--accent-purple)", fontFamily: "var(--font-heading)", letterSpacing: "0.08em" }}>ARISE — </span>Every legend starts at day one. Begin your streak.</>
            )}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ✅ Plain panel — deliberately NO card-glow to prevent double bracket artifact
function HUDStatCard({ value, label, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "relative", padding: "16px", textAlign: "center",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-dim)",
        borderRadius: "4px", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: "1px", background: accent, opacity: 0.45, borderRadius: "1px" }} />
      <div style={{ position: "absolute", top: 0, left: "30%", right: "30%", height: "1px", background: accent, opacity: 0.3 }} />
      <p style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 700, letterSpacing: "0.08em", color: accent, textShadow: `0 0 12px ${accent}55`, lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "6px" }}>
        {label}
      </p>
    </motion.div>
  );
}