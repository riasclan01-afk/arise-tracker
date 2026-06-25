import { AnimatePresence, motion } from "framer-motion";

export default function QuestComplete({ trigger }) {
  return (
    <AnimatePresence>
      {trigger ? (
        <motion.div
          key={trigger}
          className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background flash */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          {/* Expansion rings */}
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
            {[0, 1].map((i) => (
              <motion.circle
                key={i}
                cx="50%" cy="50%" r="50"
                fill="none"
                stroke={i === 0 ? "#3b82f6" : "#8b5cf6"}
                strokeWidth="2"
                strokeDasharray="12 18"
                initial={{ r: 50, opacity: 0 }}
                animate={{ r: [50, 600], opacity: [0, 0.9, 0] }}
                transition={{ duration: 1.3, delay: i * 0.18, ease: "easeOut" }}
              />
            ))}
          </svg>

          {/* Main panel */}
          <motion.div
            className="relative flex flex-col items-center gap-5 px-14 py-8"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(10,10,20,0.95) 100%)",
              border: "2px solid rgba(59, 130, 246, 0.7)",
              clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)",
            }}
            initial={{ scale: 0.6, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top line */}
            <div className="flex items-center gap-3">
              <motion.div
                className="h-[2px] w-16"
                style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.div
                style={{
                  width: "12px", height: "12px",
                  background: "#3b82f6",
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="h-[2px] w-16"
                style={{ background: "linear-gradient(90deg, #8b5cf6, transparent)" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>

            {/* Text */}
            <div className="flex flex-col items-center gap-2">
              <motion.span
                className="font-mono text-xs tracking-[0.4em]"
                style={{ color: "#8b5cf6", opacity: 0.8 }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                [ SYSTEM NOTIFICATION ]
              </motion.span>

              <motion.span
                className="font-heading text-5xl md:text-6xl uppercase tracking-[0.15em]"
                style={{ color: "#3b82f6" }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              >
                QUEST CLEAR
              </motion.span>

              <motion.span
                className="font-mono text-sm tracking-[0.3em]"
                style={{ color: "#8b5cf6", opacity: 0.7 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.45 }}
              >
                MISSION ACCOMPLISHED
              </motion.span>
            </div>

            {/* Bottom line */}
            <div className="flex items-center gap-3">
              <motion.div
                className="h-[2px] w-16"
                style={{ background: "linear-gradient(90deg, transparent, #8b5cf6)" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
              <motion.div
                style={{ width: "8px", height: "8px", background: "#3b82f6", borderRadius: "50%" }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="h-[2px] w-16"
                style={{ background: "linear-gradient(90deg, #3b82f6, transparent)" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            </div>

            {/* Corner accents */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: "28px", height: "28px",
                  border: "2px solid #3b82f6",
                  borderWidth:
                    i === 0 ? "2px 0 0 2px" :
                    i === 1 ? "2px 2px 0 0" :
                    i === 2 ? "0 0 2px 2px" : "0 2px 2px 0",
                  [i === 0 || i === 2 ? "left" : "right"]: "-2px",
                  [i === 0 || i === 1 ? "top" : "bottom"]: "-2px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
              />
            ))}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}