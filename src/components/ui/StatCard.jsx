import { motion } from "framer-motion";

export default function StatCard({ title, value, valueClassName = "", subtext = "" }) {
  return (
    <motion.div
      className="card-glow min-h-28 p-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative z-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-textSecondary opacity-80">
          {title}
        </p>
        <p className={`mt-2 font-heading text-3xl uppercase tracking-wider ${valueClassName}`}>
          {value}
        </p>
        {subtext && (
          <p className="mt-1 font-mono text-[11px] text-textMuted opacity-60">{subtext}</p>
        )}
      </div>
    </motion.div>
  );
}