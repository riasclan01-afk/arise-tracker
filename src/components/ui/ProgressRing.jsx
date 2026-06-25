// ProgressRing.jsx — SHADOW MONARCH ANTIQUE SEAL
import { motion } from "framer-motion";

export default function ProgressRing({ percent, color = "#3b82f6", size = 52 }) {
  const radius        = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset        = circumference - (percent / 100) * circumference;

  // 6-point star burst tick marks
  const ticks = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const inner = radius + 5;
    const outer = radius + 9;
    return {
      x1: size / 2 + inner * Math.cos(angle),
      y1: size / 2 + inner * Math.sin(angle),
      x2: size / 2 + outer * Math.cos(angle),
      y2: size / 2 + outer * Math.sin(angle),
    };
  });

  return (
    <div className="relative" style={{ width: size, height: size, overflow: "visible" }}>
      <svg width={size} height={size} className="transform -rotate-90" style={{ overflow: "visible" }}>

        {/* Outer dashed orbit ring */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius + 10}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.18"
          strokeDasharray="3 9"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />

        {/* Tick marks — antique clock feel */}
        {ticks.map((t, i) => (
          <motion.line
            key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, delay: i * 0.33, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Track ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="5"
        />

        {/* Blue inner shadow */}
        <circle
          cx={size / 2} cy={size / 2} r={radius - 3}
          fill="none"
          stroke={`${color}18`}
          strokeWidth="2"
        />

        {/* Progress arc */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 3px ${color})` }}
        />

        {/* Endpoint gold orb */}
        {percent > 0 && (
          <motion.circle
            cx={size / 2 + radius * Math.cos((-percent / 100) * 2 * Math.PI)}
            cy={size / 2 + radius * Math.sin((-percent / 100) * 2 * Math.PI)}
            r="3.5"
            fill={color}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.7, 1, 0.7], scale: [0.9, 1.3, 0.9] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        )}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-mono font-bold tracking-wider"
          style={{
            fontSize: size < 44 ? "9px" : "12px",
            color: color,
            textShadow: `0 0 10px ${color}`,
          }}
        >
          {Math.round(percent)}%
        </span>
      </div>

      {/* Rotating outer diamond frame */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
          border: `1px solid ${color}22`,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}