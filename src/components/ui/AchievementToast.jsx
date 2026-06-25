// AchievementToast.jsx — Achievement unlock notification
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    if (!achievement) return;
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [achievement, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed top-6 left-1/2 z-[1100]"
          style={{ transform: "translateX(-50%)", pointerEvents: "none" }}
          initial={{ y: -80, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <div
            style={{
              background: "#060612",
              border: "1px solid rgba(59,130,246,0.7)",
              padding: "14px 22px",
              minWidth: "320px",
              maxWidth: "90vw",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 0 50px rgba(59,130,246,0.25), 0 24px 80px rgba(0,0,0,0.9)",
            }}
          >
            {/* Animated scan line */}
            <motion.div
              style={{
                position: "absolute",
                left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent)",
                opacity: 0.8,
              }}
              animate={{ top: ["-1px", "101%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />

            {/* Corner brackets */}
            {[
              ["top-0 left-0", "2px 0 0 2px"],
              ["top-0 right-0", "2px 2px 0 0"],
              ["bottom-0 left-0", "0 0 2px 2px"],
              ["bottom-0 right-0", "0 2px 2px 0"],
            ].map(([pos, bw], i) => (
              <div
                key={i}
                className={`absolute ${pos}`}
                style={{ width: "14px", height: "14px", border: "2px solid #3b82f6", borderWidth: bw, opacity: 0.9 }}
              />
            ))}

            <div className="flex items-center gap-4">
              <motion.span
                style={{ fontSize: "2.8rem", lineHeight: 1, display: "block" }}
                animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {achievement.icon}
              </motion.span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: "9px",
                    letterSpacing: "0.22em", color: "#3b82f6",
                    textTransform: "uppercase", opacity: 0.85,
                  }}
                >
                  ◆ ACHIEVEMENT UNLOCKED
                </p>
                <motion.p
                  style={{
                    fontFamily: "var(--font-heading)", fontSize: "1.15rem",
                    letterSpacing: "0.12em", color: "#e0e7ff",
                    textTransform: "uppercase", marginTop: "3px",
                  }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {achievement.title}
                </motion.p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "rgba(224,231,255,0.5)", marginTop: "3px" }}>
                  {achievement.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: "10px",
                      color: "#22c55e", letterSpacing: "0.1em",
                    }}
                  >
                    +{achievement.xp} XP
                  </span>
                  <div style={{ width: "1px", height: "10px", background: "rgba(59,130,246,0.3)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "rgba(59,130,246,0.6)", letterSpacing: "0.1em" }}>
                    REWARD COLLECTED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
