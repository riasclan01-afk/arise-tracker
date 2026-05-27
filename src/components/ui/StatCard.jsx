import { motion } from "framer-motion";

export default function StatCard({ title, value, valueClassName = "", subtext = "" }) {
  return (
    <motion.div
      className="card-glow hex-clip min-h-24 rounded-lg bg-bgCard p-4 transition-transform duration-300 hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <p className="font-body text-xs uppercase tracking-[0.12em] text-textSecondary">{title}</p>
      <p className={`mt-1 font-heading text-2xl uppercase tracking-wider ${valueClassName}`}>{value}</p>
      {subtext ? <p className="mt-1 font-body text-xs text-textMuted">{subtext}</p> : null}
    </motion.div>
  );
}
