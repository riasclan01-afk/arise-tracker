// components/ui/PomodoroTimer.jsx — SHADOW MONARCH ANTIQUE SYSTEM
import { motion } from "framer-motion";
import { X, Play, Pause, RotateCcw, Coffee, Zap, Diamond, Timer as TimerIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const MODES = {
  focus:      { duration: 25 * 60, label: "FOCUS",       color: "#3b82f6", icon: <Zap      className="w-5 h-5" /> },
  shortBreak: { duration: 5  * 60, label: "SHORT BREAK", color: "#8b5cf6", icon: <Coffee   className="w-5 h-5" /> },
  longBreak:  { duration: 15 * 60, label: "LONG BREAK",  color: "#6366f1", icon: <Coffee   className="w-5 h-5" /> },
};

export default function PomodoroTimer({ onClose, sessionsToday, totalSessions, onSessionComplete }) {
  const [mode,           setMode]           = useState("focus");
  const [timeLeft,       setTimeLeft]       = useState(MODES.focus.duration);
  const [isRunning,      setIsRunning]      = useState(false);
  const [completedFocus, setCompletedFocus] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleComplete = () => {
    setIsRunning(false);
    if ("Notification" in window && Notification.permission === "granted")
      new Notification("System Alert", { body: `${MODES[mode].label} session complete.` });
    if (mode === "focus") {
      onSessionComplete();
      const n = completedFocus + 1;
      setCompletedFocus(n);
      switchMode(n % 4 === 0 ? "longBreak" : "shortBreak");
    } else {
      switchMode("focus");
    }
  };

  const switchMode = (m) => { setMode(m); setTimeLeft(MODES[m].duration); setIsRunning(false); };
  const reset      = ()  => { setTimeLeft(MODES[mode].duration); setIsRunning(false); };
  const requestNotif = () => {
    if ("Notification" in window && Notification.permission === "default")
      Notification.requestPermission();
  };

  const minutes     = Math.floor(timeLeft / 60);
  const seconds     = timeLeft % 60;
  const progress    = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100;
  const activeColor = MODES[mode].color;

  const radius        = 76;
  const circumference = 2 * Math.PI * radius;
  const dashOffset    = circumference - (progress / 100) * circumference;

  // 8 antique tick marks
  const ticks = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI / 4) * i - Math.PI / 2;
    const inner = radius + 6;
    const outer = radius + (i % 2 === 0 ? 13 : 9);
    return {
      x1: 100 + inner * Math.cos(angle),
      y1: 100 + inner * Math.sin(angle),
      x2: 100 + outer * Math.cos(angle),
      y2: 100 + outer * Math.sin(angle),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: 80, y: 80 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, x: 80, y: 80 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50"
    >
      <div className="card-glow" style={{ padding: "24px", width: "320px" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-4" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
            <h3 className="font-heading text-sm uppercase tracking-[0.18em] flex items-center gap-1.5" style={{ color: "#3b82f6" }}>
              <TimerIcon size={13} /> Focus Chamber
            </h3>
            <div className="h-[2px] w-4" style={{ background: "linear-gradient(90deg, #3b82f6, transparent)" }} />
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)", padding: "6px" }}
          >
            <X className="w-4 h-4" style={{ color: "#3b82f6", opacity: 0.6 }} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-5">
          {Object.entries(MODES).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className="flex-1 px-2 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all"
              style={
                mode === key
                  ? { border: `1px solid ${color}`, color, background: `${color}12` }
                  : { border: "1px solid rgba(59,130,246,0.12)", color: "rgba(59,130,246,0.35)", background: "transparent" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Timer Ring — antique clock style */}
        <div className="relative mb-5">
          <svg className="w-full h-auto" viewBox="0 0 200 200">
            {/* Outer orbit */}
            <motion.circle
              cx="100" cy="100" r="92"
              fill="none" stroke={activeColor} strokeWidth="0.4"
              opacity="0.15" strokeDasharray="3 9"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
            {/* Tick marks */}
            {ticks.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                stroke={activeColor} strokeWidth={i % 2 === 0 ? "1.5" : "0.8"} opacity="0.4"
              />
            ))}
            {/* Track */}
            <circle cx="100" cy="100" r={radius}
              fill="rgba(0,0,0,0.4)" stroke="rgba(59,130,246,0.08)" strokeWidth="8"
            />
            {/* Progress */}
            <motion.circle
              cx="100" cy="100" r={radius}
              fill="none" stroke={activeColor} strokeWidth="8"
              strokeLinecap="butt"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 100 100)"
              style={{
                filter: `drop-shadow(0 0 8px ${activeColor})`,
                transition: "stroke-dashoffset 1s linear",
              }}
            />
            {/* Center ornament */}
            <circle cx="100" cy="100" r="24"
              fill="none" stroke={`${activeColor}20`} strokeWidth="1"
            />
            <motion.circle cx="100" cy="100" r="3"
              fill={activeColor}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-mono font-bold text-4xl" style={{ color: activeColor, textShadow: `0 0 16px ${activeColor}` }}>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <div className="text-[9px] font-mono tracking-[0.2em] uppercase mt-1" style={{ color: activeColor, opacity: 0.55 }}>
              {MODES[mode].label}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setIsRunning(!isRunning); requestNotif(); }}
            className="flex-1 py-3 flex items-center justify-center gap-2 font-heading text-sm uppercase tracking-[0.12em] transition-all"
            style={{
              background: `${activeColor}0e`,
              border: `1px solid ${activeColor}`,
              color: activeColor,
            }}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Pause" : "Initiate"}
          </button>
          <button
            onClick={reset}
            style={{
              padding: "12px 14px",
              background: "rgba(59,130,246,0.04)",
              border: "1px solid rgba(59,130,246,0.18)",
            }}
          >
            <RotateCcw className="w-4 h-4" style={{ color: "#3b82f6", opacity: 0.5 }} />
          </button>
        </div>

        {/* Stats */}
        <div
          className="flex items-center justify-between text-[10px] font-mono tracking-[0.1em]"
          style={{ borderTop: "1px solid rgba(59,130,246,0.12)", paddingTop: "10px", color: "rgba(59,130,246,0.45)" }}
        >
          <span className="flex items-center gap-1.5"><Diamond size={8} strokeWidth={2.5} /> TODAY · {sessionsToday}</span>
          <span className="flex items-center gap-1.5">TOTAL · {totalSessions} <Diamond size={8} strokeWidth={2.5} /></span>
        </div>
      </div>
    </motion.div>
  );
}