import { motion } from "framer-motion";
import StatCard from "./ui/StatCard";

export default function StatsBar({ studyDone, workoutDone, streakCount, rank, onStreakClick }) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard
        title="Study Progress"
        value={`${studyDone} / 56`}
        valueClassName="text-accentBlue glow-blue"
      />

      <StatCard
        title="Workout Progress"
        value={`${workoutDone} / 7`}
        valueClassName="text-accentPurple glow-purple"
        subtext="days this week"
      />

      {/* Streak Card */}
      <motion.button
        onClick={onStreakClick}
        className="card-glow min-h-24 p-4 text-left w-full group"
        style={{ position: "relative", overflow: "hidden" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at center, rgba(59,130,246,0.08) 0%, transparent 70%)",
          opacity: 0, transition: "opacity 0.3s",
        }} className="group-hover:opacity-100" />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-textSecondary opacity-80">
              Current Streak
            </p>
            <motion.svg
              className="w-4 h-4 text-textSecondary group-hover:text-accentGold transition-colors"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
              whileHover={{ x: 3 }} transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </div>
          <p className="mt-2 font-heading text-2xl uppercase tracking-wider text-accentGold glow-gold">
            {streakCount} days
          </p>
          <p className="mt-1 text-xs font-mono text-textMuted opacity-0 group-hover:opacity-60 transition-opacity">
            View streak details →
          </p>
        </div>
      </motion.button>

      {/* Rank Card */}
      <motion.div
        className="card-glow min-h-24 p-4"
        style={{ position: "relative", overflow: "hidden" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Gold base glow */}
        <motion.div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            background: "radial-gradient(ellipse 120% 120% at 50% 120%, rgba(59,130,246,0.15) 0%, transparent 65%)",
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-textSecondary opacity-80">Rank</p>
          <p className={`mt-1 font-heading text-2xl uppercase tracking-wider animate-rank ${rank.color}`}>
            {rank.label}
          </p>
          <div style={{
            marginTop: "8px", height: "2px",
            background: "linear-gradient(90deg, var(--mana-cyan), var(--mana-violet), transparent)",
            opacity: 0.6,
          }} />
        </div>
      </motion.div>
    </section>
  );
}