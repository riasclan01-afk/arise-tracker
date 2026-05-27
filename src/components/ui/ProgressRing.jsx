import { motion } from "framer-motion";

export default function ProgressRing({ percent, size = 74, stroke = 7, color = "#4fc3f7" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.max(0, Math.min(100, percent));
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="drop-shadow-[0_0_10px_rgba(79,195,247,0.35)]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(79,195,247,0.15)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute font-mono text-xs text-textPrimary">{Math.round(normalized)}%</span>
    </div>
  );
}
