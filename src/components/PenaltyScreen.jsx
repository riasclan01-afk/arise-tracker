// src/components/PenaltyScreen.jsx — SHADOW MONARCH PENALTY SYSTEM
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldPlus, Skull, AlertTriangle, CheckCircle2, ShieldCheck, Diamond } from "lucide-react";
import { usePenalty } from "../hooks/usePenalty";

// ── Fatigue Bar ───────────────────────────────────────────────────────────────
function FatigueBar({ fatigue }) {
  const color =
    fatigue >= 75 ? "#dc2626" :
    fatigue >= 50 ? "#f97316" :
    fatigue >= 25 ? "#3b82f6" : "#22c55e";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: "rgba(224,231,255,0.5)" }}>
          FATIGUE LEVEL
        </span>
        <span className="font-heading text-sm" style={{ color }}>
          {fatigue}/100
        </span>
      </div>
      <div className="progress-track">
        <motion.div
          className="h-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
          initial={{ width: "0%" }}
          animate={{ width: `${fatigue}%` }}
          transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
      <div className="flex justify-between">
        {["FRESH", "TIRED", "FATIGUED", "EXHAUSTED"].map((label, i) => (
          <span key={label} className="font-mono text-[8px] tracking-wider"
            style={{ color: fatigue >= i * 25 ? color : "rgba(224,231,255,0.2)" }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Debuff Card ───────────────────────────────────────────────────────────────
function DebuffCard({ debuff, index }) {
  return (
    <motion.div
      className="flex items-center gap-3 p-3 relative overflow-hidden"
      style={{
        background: `${debuff.color}0d`,
        border:     `1px solid ${debuff.color}44`,
      }}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1,  x: 0   }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      {/* Left color bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: "3px", background: debuff.color,
      }} />

      <span className="text-xl select-none">{debuff.icon}</span>

      <div className="flex-1">
        <p className="font-heading text-xs uppercase tracking-[0.16em]"
          style={{ color: debuff.color }}>
          {debuff.label}
        </p>
        <p className="font-mono text-[10px] tracking-wider mt-0.5"
          style={{ color: "rgba(224,231,255,0.45)" }}>
          {debuff.desc}
        </p>
      </div>

      {/* Pulse dot */}
      <motion.div
        style={{ width: "6px", height: "6px", borderRadius: "50%", background: debuff.color, flexShrink: 0 }}
        animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

// ── Recovery Tips ─────────────────────────────────────────────────────────────
function RecoveryTips({ fatigue }) {
  if (fatigue < 25) return null;

  const tips =
    fatigue >= 75 ? [
      "Complete ALL 4 daily quests today",
      "Do not break your streak again",
      "Rank demotion is imminent",
    ] :
    fatigue >= 50 ? [
      "Complete at least 3 quests today",
      "Maintain your streak",
      "STR and AGI are debuffed",
    ] : [
      "Complete your daily quests",
      "One miss won't break you — recover now",
    ];

  return (
    <motion.div
      className="flex flex-col gap-2 p-3"
      style={{ border: "1px solid rgba(59,130,246,0.2)", background: "rgba(59,130,246,0.04)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] flex items-center gap-1.5"
        style={{ color: "rgba(59,130,246,0.5)" }}>
        <ShieldPlus size={11} strokeWidth={2.5} /> RECOVERY PROTOCOL
      </span>
      {tips.map((tip, i) => (
        <div key={i} className="flex items-start gap-2">
          <span style={{ color: "#3b82f6", fontSize: "10px", marginTop: "1px" }}>▸</span>
          <span className="font-body text-xs" style={{ color: "rgba(224,231,255,0.6)" }}>
            {tip}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function PenaltyScreen({
  open, onClose, questState, streak, rank,
  onApplyPenalty,
}) {
  const {
    fatigue, debuffs, todayDone,
    yesterdayDone, missedCount,
    xpPenalty, streakBroken, demotionWarning,
  } = usePenalty({ questState, streak });

  const hasIssues       = debuffs.length > 0;
  const todayKey         = new Date().toISOString().split("T")[0];
  const acknowledgedToday = questState?.penaltyAcknowledgedDate === todayKey;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[998]"
            style={{
              background: "rgba(0,0,0,0.92)",
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
              className="w-full max-w-sm relative"
              style={{
                background: "#0a0a14",
                border: `1px solid ${hasIssues ? "rgba(220,38,38,0.5)" : "rgba(59,130,246,0.45)"}`,
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
                  border: `2px solid ${hasIssues ? "#dc2626" : "#3b82f6"}`,
                  borderWidth: i === 0 ? "2px 0 0 2px" : i === 1 ? "2px 2px 0 0" : i === 2 ? "0 0 2px 2px" : "0 2px 2px 0",
                  [i === 0 || i === 2 ? "left" : "right"]: "0px",
                  [i === 0 || i === 1 ? "top"  : "bottom"]: "0px",
                  opacity: 0.7, zIndex: 10,
                }} />
              ))}

              <div className="p-6 flex flex-col gap-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div style={{ width: "14px", height: "1px",
                        background: hasIssues ? "#dc2626" : "#3b82f6", opacity: 0.6 }} />
                      <h2 className="font-heading text-base uppercase tracking-[0.22em] flex items-center gap-2"
                        style={{ color: hasIssues ? "#dc2626" : "#3b82f6" }}>
                        {hasIssues ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
                        {hasIssues ? "PENALTY SYSTEM" : "SYSTEM CLEAR"}
                      </h2>
                    </div>
                    <p className="font-mono text-[9px] tracking-[0.14em]"
                      style={{ color: "rgba(59,130,246,0.4)" }}>
                      SHADOW MONARCH ACCOUNTABILITY PROTOCOL
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    style={{ padding: "6px",
                      background: "rgba(59,130,246,0.05)",
                      border: "1px solid rgba(59,130,246,0.2)" }}
                  >
                    <X className="w-4 h-4" style={{ color: "#3b82f6", opacity: 0.6 }} />
                  </button>
                </div>

                {/* Demotion warning banner */}
                <AnimatePresence>
                  {demotionWarning && !acknowledgedToday && (
                    <motion.div
                      className="flex items-center gap-3 p-3"
                      style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.5)" }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.span
                        style={{ display: "inline-flex" }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <Skull size={18} color="#dc2626" strokeWidth={2} />
                      </motion.span>
                      <div>
                        <p className="font-heading text-xs uppercase tracking-[0.16em]"
                          style={{ color: "#dc2626" }}>
                          RANK DEMOTION WARNING
                        </p>
                        <p className="font-mono text-[9px] mt-0.5"
                          style={{ color: "rgba(224,231,255,0.45)" }}>
                          Current rank: {rank?.label || "E RANK"} — at risk
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2"
                  style={{ borderTop: "1px solid rgba(59,130,246,0.12)", paddingTop: "12px" }}>
                  {[
                    { label: "TODAY",     value: `${todayDone}/4`,     color: todayDone === 4 ? "#22c55e" : "#3b82f6" },
                    { label: "YESTERDAY", value: `${yesterdayDone}/4`, color: yesterdayDone === 4 ? "#22c55e" : "#f97316" },
                    { label: "MISSED",    value: missedCount,           color: missedCount === 0 ? "#22c55e" : "#dc2626" },
                  ].map((item) => (
                    <div key={item.label}
                      className="flex flex-col items-center p-2"
                      style={{ border: "1px solid rgba(59,130,246,0.1)", background: "rgba(59,130,246,0.03)" }}
                    >
                      <span className="font-mono text-[8px] tracking-[0.12em]"
                        style={{ color: "rgba(59,130,246,0.4)" }}>
                        {item.label}
                      </span>
                      <span className="font-heading text-lg mt-0.5" style={{ color: item.color }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Fatigue bar */}
                <FatigueBar fatigue={fatigue} />

                {/* Divider */}
                <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3) 50%, transparent)" }} />

                {/* Debuffs */}
                {hasIssues ? (
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em]"
                      style={{ color: "rgba(59,130,246,0.4)" }}>
                      ACTIVE DEBUFFS
                    </span>
                    {debuffs.map((debuff, i) => (
                      <DebuffCard key={debuff.id} debuff={debuff} index={i} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="flex flex-col items-center gap-2 py-4"
                    style={{ border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.06)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ShieldCheck size={28} color="#22c55e" strokeWidth={1.8} />
                    <span className="font-heading text-sm tracking-[0.2em]"
                      style={{ color: "#22c55e" }}>
                      NO PENALTIES ACTIVE
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.12em]"
                      style={{ color: "rgba(224,231,255,0.35)" }}>
                      HUNTER STATUS: OPTIMAL
                    </span>
                  </motion.div>
                )}

                {/* Recovery tips */}
                <RecoveryTips fatigue={fatigue} />

                {/* XP penalty info */}
                {xpPenalty > 0 && (
                  <motion.div
                    className="flex items-center justify-between p-3"
                    style={{ border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.06)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: "rgba(224,231,255,0.5)" }}>
                      XP DEDUCTED
                    </span>
                    <span className="font-heading text-lg" style={{ color: "#dc2626" }}>
                      -{xpPenalty} XP
                    </span>
                  </motion.div>
                )}

                {/* Acknowledge button */}
                <motion.button
                  onClick={() => { if (!acknowledgedToday) { onApplyPenalty(); } onClose(); }}
                  className="w-full py-3 font-heading text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                  style={{
                    background:  acknowledgedToday ? "rgba(34,197,94,0.08)" : hasIssues ? "rgba(220,38,38,0.1)"  : "rgba(59,130,246,0.06)",
                    border:      acknowledgedToday ? "1px solid rgba(34,197,94,0.4)" : hasIssues ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(59,130,246,0.35)",
                    color:       acknowledgedToday ? "#22c55e" : hasIssues ? "#dc2626" : "#3b82f6",
                  }}
                  whileHover={{ background: acknowledgedToday ? "rgba(34,197,94,0.08)" : hasIssues ? "rgba(220,38,38,0.18)" : "rgba(59,130,246,0.12)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {acknowledgedToday
                    ? <CheckCircle2 size={15} />
                    : hasIssues ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
                  {acknowledgedToday ? "ACKNOWLEDGED TODAY" : hasIssues ? "ACKNOWLEDGE PENALTY" : "CONFIRMED"}
                </motion.button>

                <p className="font-mono text-[8px] text-center tracking-[0.1em] flex items-center justify-center gap-1.5"
                  style={{ color: "rgba(59,130,246,0.2)" }}>
                  <Diamond size={7} strokeWidth={2.5} /> The System sees all. There is no escape. <Diamond size={7} strokeWidth={2.5} />
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}