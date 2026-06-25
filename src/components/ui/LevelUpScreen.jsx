import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

function MonarchSeal({ size = 120 }) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const points6 = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return [cx + (r - 8) * Math.cos(angle), cy + (r - 8) * Math.sin(angle)];
  });

  return (
    <svg width={size} height={size} className="opacity-30">
      <motion.polygon
        points={points6.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="rgba(59,130,246,0.4)"
        strokeWidth="1"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1" />
    </svg>
  );
}

export default function LevelUpScreen({ show, prevLevel, nextLevel, onDismiss }) {
  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [show, onDismiss]);

  const rings = ["#3b82f6", "#8b5cf6", "#6366f1"];

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          {rings.map((color, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{ borderColor: color, width: 80, height: 80 }}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 2, delay: i * 0.2, ease: "easeOut" }}
            />
          ))}

          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute origin-center"
              style={{
                width: "2px",
                height: "60px",
                background: `linear-gradient(180deg, ${rings[i % 3]}, transparent)`,
                rotate: `${i * 45}deg`,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 2.5, opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, delay: 0.1 + i * 0.05, ease: "easeOut" }}
            />
          ))}

          <div className="relative flex flex-col items-center gap-4">
            <motion.div
              className="absolute -z-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <MonarchSeal size={140} />
            </motion.div>

            {[
              { top: 0, left: 0, borderWidth: "2px 0 0 2px" },
              { top: 0, right: 0, borderWidth: "2px 2px 0 0" },
              { bottom: 0, left: 0, borderWidth: "0 0 2px 2px" },
              { bottom: 0, right: 0, borderWidth: "0 2px 2px 0" },
            ].map((corner, i) => (
              <div
                key={i}
                className="absolute w-6 h-6 border-[#3b82f6]"
                style={{ ...corner, borderStyle: "solid", borderWidth: corner.borderWidth }}
              />
            ))}

            <motion.span
              className="font-mono text-xs tracking-[0.4em] text-[#8b5cf6]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              [ SYSTEM NOTIFICATION ]
            </motion.span>

            <motion.h2
              className="font-heading text-5xl md:text-6xl uppercase tracking-[0.2em]"
              style={{ color: "#3b82f6", textShadow: "0 0 24px rgba(59,130,246,0.8)" }}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
            >
              LEVEL UP
            </motion.h2>

            <motion.p
              className="font-mono text-lg tracking-[0.2em] text-[#93c5fd]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              LV.{prevLevel} → LV.{nextLevel}
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
