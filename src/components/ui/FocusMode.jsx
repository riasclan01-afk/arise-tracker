// FocusMode.jsx — Full-screen focus timer overlay
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { BOOK_COLORS } from "../../data/studyPlan";

const PRESETS = [
  { label: "25 MIN", minutes: 25 },
  { label: "50 MIN", minutes: 50 },
  { label: "90 MIN", minutes: 90 },
];

export default function FocusMode({ task, onClose, onComplete }) {
  const [presetIdx, setPresetIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PRESETS[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  const totalSeconds = PRESETS[presetIdx].minutes * 60;
  const colors = task ? (BOOK_COLORS[task.book] ?? BOOK_COLORS.Review) : {};

  // Reset when preset changes
  const applyPreset = (idx) => {
    setPresetIdx(idx);
    setTimeLeft(PRESETS[idx].minutes * 60);
    setRunning(false);
    setDone(false);
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setTimeLeft(totalSeconds);
    setDone(false);
  };

  const handleComplete = () => {
    onComplete?.();
    onClose();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / totalSeconds;
  const R = 130;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[1050]"
            style={{ background: "rgba(0,0,4,0.97)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className="fixed inset-0 z-[1051] flex flex-col items-center justify-center p-6 gap-8"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5"
              style={{
                padding: "8px", border: "1px solid rgba(59,130,246,0.25)",
                background: "rgba(59,130,246,0.05)", color: "#3b82f6",
              }}
            >
              <X size={18} />
            </button>

            {/* Mode label */}
            <div className="flex flex-col items-center gap-1">
              <motion.p
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.3em", color: "#3b82f6", textTransform: "uppercase" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡ FOCUS MODE ACTIVE
              </motion.p>

              {/* Preset selector */}
              <div className="flex gap-2 mt-1">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(i)}
                    style={{
                      padding: "2px 10px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      border: i === presetIdx ? "1px solid rgba(59,130,246,0.7)" : "1px solid rgba(59,130,246,0.2)",
                      background: i === presetIdx ? "rgba(59,130,246,0.12)" : "transparent",
                      color: i === presetIdx ? "#93c5fd" : "rgba(224,231,255,0.3)",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer ring */}
            <div style={{ position: "relative", width: "300px", height: "300px" }}>
              <svg width="300" height="300" style={{ position: "absolute", inset: 0 }}>
                {/* Outer glow ring */}
                <circle cx="150" cy="150" r={R + 8} fill="none" stroke={done ? "rgba(34,197,94,0.08)" : "rgba(59,130,246,0.05)"} strokeWidth="16" />
                {/* Track */}
                <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="3" />
                {/* Progress arc */}
                <motion.circle
                  cx="150" cy="150" r={R}
                  fill="none"
                  stroke={done ? "#22c55e" : running ? "#3b82f6" : "#6366f1"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 150 150)"
                  style={{ filter: `drop-shadow(0 0 10px ${done ? "#22c55e" : "#3b82f6"})`, transition: "stroke-dashoffset 0.5s linear, stroke 0.3s" }}
                />
                {/* Tick marks */}
                {Array.from({ length: 60 }, (_, i) => {
                  const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
                  const isMajor = i % 5 === 0;
                  const rIn = R - (isMajor ? 10 : 5);
                  return (
                    <line
                      key={i}
                      x1={150 + (R + 4) * Math.cos(angle)}
                      y1={150 + (R + 4) * Math.sin(angle)}
                      x2={150 + rIn * Math.cos(angle)}
                      y2={150 + rIn * Math.sin(angle)}
                      stroke="rgba(59,130,246,0.15)"
                      strokeWidth={isMajor ? 1.5 : 0.8}
                    />
                  );
                })}
              </svg>

              <div
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "4px",
                }}
              >
                <motion.p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: done ? "2.8rem" : "3.8rem",
                    color: done ? "#22c55e" : "#e0e7ff",
                    letterSpacing: "0.04em", lineHeight: 1,
                  }}
                  animate={done ? { scale: [1, 1.06, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {done ? "DONE" : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
                </motion.p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "rgba(224,231,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {done ? "SESSION COMPLETE" : running ? PRESETS[presetIdx].label + " SESSION" : "PRESS START"}
                </p>
                {running && (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "rgba(59,130,246,0.5)", marginTop: "4px" }}>
                    {Math.round(progress * 100)}% COMPLETE
                  </p>
                )}
              </div>
            </div>

            {/* Task info */}
            <div style={{ textAlign: "center", maxWidth: "480px", width: "100%" }}>
              <motion.span
                style={{
                  display: "inline-block", padding: "3px 12px",
                  border: `1px solid ${colors.border || "rgba(59,130,246,0.4)"}`,
                  background: colors.bg || "rgba(59,130,246,0.08)",
                  color: colors.text || "#93c5fd",
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  letterSpacing: "0.12em", marginBottom: "10px",
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {task.book}
              </motion.span>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#e0e7ff", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.4 }}>
                {task.task}
              </p>
              {task.side && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "rgba(224,231,255,0.4)", marginTop: "6px" }}>
                  {task.side}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {!done ? (
                <>
                  <motion.button
                    onClick={() => setRunning((r) => !r)}
                    style={{
                      padding: "12px 36px", display: "flex", alignItems: "center", gap: "8px",
                      background: running ? "rgba(220,38,38,0.08)" : "rgba(59,130,246,0.1)",
                      border: `1px solid ${running ? "rgba(220,38,38,0.4)" : "rgba(59,130,246,0.5)"}`,
                      color: running ? "#ef4444" : "#3b82f6",
                      fontFamily: "var(--font-heading)", letterSpacing: "0.12em",
                      textTransform: "uppercase", fontSize: "0.85rem",
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {running ? <Pause size={18} /> : <Play size={18} />}
                    {running ? "PAUSE" : "START"}
                  </motion.button>
                  <motion.button
                    onClick={reset}
                    style={{
                      padding: "12px 16px",
                      background: "rgba(139,92,246,0.06)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      color: "#8b5cf6",
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={16} />
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={handleComplete}
                  style={{
                    padding: "14px 40px",
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.5)",
                    color: "#22c55e",
                    fontFamily: "var(--font-heading)", letterSpacing: "0.14em",
                    textTransform: "uppercase", fontSize: "0.9rem",
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✓ MARK COMPLETE & EXIT
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
