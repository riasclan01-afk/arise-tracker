// Confetti.jsx — Particle celebration burst
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#3b82f6", "#8b5cf6", "#6366f1", "#93c5fd", "#a78bfa", "#22c55e", "#60a5fa"];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export default function Confetti({ trigger }) {
  const particles = useMemo(() => {
    if (!trigger) return [];
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: rand(5, 95),
      color: COLORS[i % COLORS.length],
      w: rand(5, 11),
      h: rand(8, 16),
      delay: rand(0, 0.6),
      duration: rand(1.8, 3),
      rotation: rand(0, 360),
      drift: rand(-120, 120),
    }));
  }, [trigger]);

  return (
    <AnimatePresence>
      {trigger > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[1099] overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={`${trigger}-${p.id}`}
              style={{
                position: "absolute",
                top: "-20px",
                left: `${p.x}%`,
                width: `${p.w}px`,
                height: `${p.h}px`,
                background: p.color,
                borderRadius: "2px",
                opacity: 0,
              }}
              animate={{
                y: ["0vh", "105vh"],
                opacity: [0, 1, 1, 0],
                rotate: [p.rotation, p.rotation + rand(400, 720)],
                x: [0, p.drift],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.2, 0, 0.8, 1],
                opacity: { times: [0, 0.1, 0.7, 1] },
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
