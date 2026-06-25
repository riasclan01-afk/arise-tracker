// src/components/CharacterStats.jsx — SHADOW MONARCH STATUS SCREEN
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useStats } from "../hooks/useStats";

const STAT_COLORS = {
  STR: "#ef4444",
  INT: "#3b82f6",
  AGI: "#22c55e",
  VIT: "#3b82f6",
  SEN: "#a855f7",
};

const STAT_LABELS = {
  STR: "STRENGTH",
  INT: "INTELLIGENCE",
  AGI: "AGILITY",
  VIT: "VITALITY",
  SEN: "PERCEPTION",
};

// ── Stat Bar Row ─────────────────────────────────────────────────────────────
function StatRow({ label, value, color, delay }) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Label */}
      <span
        className="font-mono text-[10px] uppercase tracking-[0.14em] w-28 shrink-0"
        style={{ color: "rgba(224,231,255,0.55)" }}
      >
        {STAT_LABELS[label]}
      </span>

      {/* Bar track */}
      <div
        className="flex-1 h-[6px] relative"
        style={{
          background: "rgba(0,0,0,0.6)",
          border: `1px solid ${color}33`,
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
          initial={{ width: "0%" }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.0, delay: delay + 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>

      {/* Value */}
      <span
        className="font-heading text-sm w-8 text-right shrink-0"
        style={{ color }}
      >
        {value}
      </span>
    </motion.div>
  );
}

// ── Divider ──────────────────────────────────────────────────────────────────
function BlueDivider() {
  return (
    <div
      style={{
        height: "1px",
        background: "linear-gradient(90deg, transparent, #3b82f6 50%, transparent)",
        opacity: 0.35,
        margin: "4px 0",
      }}
    />
  );
}

// ── Main Modal ───────────────────────────────────────────────────────────────
export default function CharacterStats({ open, onClose, studyChecked, workoutChecked, streak, jobs, rank, questState }) {
  const { STR, INT, AGI, VIT, SEN, level, HP, MP } = useStats({
    studyChecked, workoutChecked, streak, jobs,
  });
  const totalXP   = questState?.totalXP   || 0;
  const totalGold = questState?.totalGold || 0;
  const fatigue   = questState?.fatigue   || 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[998]"
            style={{
              background: "rgba(0,0,0,0.85)",
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
              className="relative w-full max-w-sm md:max-w-md"
              style={{
                background: "#0a0a14",
                border: "1px solid rgba(59,130,246,0.45)",
                clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
              }}
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1,    y: 0,  opacity: 1 }}
              exit={{    scale: 0.88, y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Corner accents */}
              {[0,1,2,3].map((i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: "20px", height: "20px",
                    border: "2px solid #3b82f6",
                    borderWidth:
                      i === 0 ? "2px 0 0 2px" :
                      i === 1 ? "2px 2px 0 0" :
                      i === 2 ? "0 0 2px 2px" : "0 2px 2px 0",
                    [i === 0 || i === 2 ? "left" : "right"]: "0px",
                    [i === 0 || i === 1 ? "top"  : "bottom"]: "0px",
                    opacity: 0.7,
                  }}
                />
              ))}

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10"
                style={{
                  padding: "6px",
                  background: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <X className="w-4 h-4" style={{ color: "#3b82f6", opacity: 0.6 }} />
              </button>

              <div className="p-6 flex flex-col gap-4">
                {/* ── TITLE ── */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div style={{ height: "1px", width: "16px", background: "#3b82f6", opacity: 0.5 }} />
                    <h2
                      className="font-heading uppercase tracking-[0.25em] text-lg"
                      style={{ color: "#3b82f6" }}
                    >
                      STATUS
                    </h2>
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #3b82f6, transparent)", opacity: 0.4 }} />
                  </div>
                </motion.div>

                {/* ── IDENTITY BLOCK ── */}
                <motion.div
                  className="flex flex-col gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[11px] tracking-[0.14em]" style={{ color: "rgba(224,231,255,0.5)" }}>
                      NAME:
                    </span>
                    <span className="font-heading text-sm tracking-wider" style={{ color: "#e0e7ff" }}>
                      KARAN &nbsp;
                      <span style={{ color: "#3b82f6" }}>LV.{level}</span>
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[11px] tracking-[0.14em]" style={{ color: "rgba(224,231,255,0.5)" }}>
                      CLASS:
                    </span>
                    <span className="font-heading text-sm tracking-wider" style={{ color: "#e0e7ff" }}>
                      SHADOW MONARCH
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[11px] tracking-[0.14em]" style={{ color: "rgba(224,231,255,0.5)" }}>
                      RANK:
                    </span>
                    <span className="font-heading text-sm tracking-wider" style={{ color: "#3b82f6" }}>
                      {rank?.label || "E RANK"}
                    </span>
                  </div>
                </motion.div>

                <BlueDivider />

                {/* ── HP / MP ── */}
                <motion.div
                  className="grid grid-cols-2 gap-x-6 gap-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18 }}
                >
                  {[
                    { label: "HP", value: HP.toLocaleString(), color: "#ef4444" },
                    { label: "MP", value: MP.toLocaleString(), color: "#3b82f6" },
                    { label: "TOTAL XP", value: totalXP.toLocaleString(), color: "#3b82f6" },
                    { label: "GOLD", value: totalGold.toLocaleString(), color: "#93c5fd" },
                    { label: "FATIGUE", value: `${fatigue}/100`, color: fatigue >= 75 ? "#dc2626" : fatigue >= 50 ? "#f97316" : fatigue >= 25 ? "#3b82f6" : "#22c55e" },
                    { label: "STREAK", value: streak?.count || 0, color: "#3b82f6" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-baseline gap-2">
                      <span className="font-mono text-[10px] tracking-[0.12em]" style={{ color: "rgba(224,231,255,0.45)" }}>
                        {item.label}:
                      </span>
                      <span className="font-heading text-sm" style={{ color: item.color }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </motion.div>

                <BlueDivider />

                {/* ── CORE STATS ── */}
                <div className="flex flex-col gap-3">
                  {[
                    { label: "STR", value: STR },
                    { label: "INT", value: INT },
                    { label: "AGI", value: AGI },
                    { label: "VIT", value: VIT },
                    { label: "SEN", value: SEN },
                  ].map(({ label, value }, i) => (
                    <StatRow
                      key={label}
                      label={label}
                      value={value}
                      color={STAT_COLORS[label]}
                      delay={0.25 + i * 0.07}
                    />
                  ))}
                </div>

                <BlueDivider />

                {/* ── COMBAT STATS ── */}
                <motion.div
                  className="grid grid-cols-2 gap-x-6 gap-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                >
                  {[
                    { label: "PHYS DMG REDUCTION", value: `${Math.round(STR * 0.65)}%` },
                    { label: "MAGIC DMG REDUCTION", value: `${Math.round(INT * 0.44)}%` },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-0.5 col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: "rgba(224,231,255,0.4)" }}>
                          {item.label}:
                        </span>
                        <span className="font-heading text-xs" style={{ color: "#3b82f6" }}>
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>

              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}