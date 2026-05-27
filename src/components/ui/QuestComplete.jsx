import { AnimatePresence, motion } from "framer-motion";

export default function QuestComplete({ trigger }) {
  return (
    <AnimatePresence>
      {trigger ? (
        <motion.div
          key={trigger}
          className="pointer-events-none fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.35 }}
        >
          <div className="relative flex items-center justify-center">
            <span className="glow-gold font-heading text-2xl tracking-[0.16em] text-accentGold">QUEST COMPLETE</span>
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="quest-particle absolute h-1.5 w-1.5 rounded-full bg-accentBlue"
                style={{ "--i": i }}
              />
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
