// components/TabNav.jsx
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { haptics } from "../utils/haptics";

const TABS = [
  { id: "study",   label: "STUDY QUEST"  },
  { id: "workout", label: "TRAINING ARC" },
  { id: "jobs",    label: "JOB HUNT"     },
  { id: "mba",     label: "MBA TRACK"    },
];

export default function TabNav({ activeTab, onChange }) {
  const containerRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderLeft, setSliderLeft]   = useState(0);
  const tabRefs     = useRef({});
  const touchStartX = useRef(0);
  const touchEndX   = useRef(0);

  useEffect(() => {
    const activeElement = tabRefs.current[activeTab];
    if (activeElement && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const activeRect    = activeElement.getBoundingClientRect();
      setSliderLeft(activeRect.left - containerRect.left);
      setSliderWidth(activeRect.width);
    }
  }, [activeTab]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove  = (e) => { touchEndX.current   = e.touches[0].clientX; };
  const handleTouchEnd   = () => {
    const swipeDistance   = touchEndX.current - touchStartX.current;
    const minSwipeDistance = 50;
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      haptics.light();
      const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
      if (swipeDistance > 0 && currentIndex > 0)
        onChange(TABS[currentIndex - 1].id);
      else if (swipeDistance < 0 && currentIndex < TABS.length - 1)
        onChange(TABS[currentIndex + 1].id);
    }
    touchStartX.current = 0;
    touchEndX.current   = 0;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative flex p-1"
      style={{
        background:   "#000000",
        border:       "1px solid rgba(59, 130, 246, 0.25)",
        touchAction:  "pan-y pinch-zoom",
        transform:    "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      }}
    >
      {/* Active tab background fill */}
      {sliderWidth > 0 && (
        <motion.div
          className="absolute"
          style={{
            height: "calc(100% - 8px)",
            top:    "4px",
            left:   sliderLeft,
            width:  sliderWidth,
            background: "rgba(59, 130, 246, 0.08)",
            border: "1px solid rgba(59, 130, 246, 0.35)",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
          }}
          initial={false}
          animate={{ left: sliderLeft, width: sliderWidth }}
          transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
        />
      )}

      {TABS.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => { if (el) tabRefs.current[tab.id] = el; }}
            className="relative z-10 min-h-11 flex-1 px-4 py-3 font-heading text-sm tracking-[0.16em]"
            onClick={() => onChange(tab.id)}
            style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
          >
            <span
              style={{
                display:    "inline-block",
                color:      active ? "#3b82f6" : "rgba(212, 168, 0, 0.45)",
                opacity:    active ? 1 : 0.7,
                fontWeight: active ? 700 : 500,
                transition: "color 0.2s ease, opacity 0.2s ease",
                letterSpacing: "0.16em",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}

      {/* Gold underline indicator */}
      {sliderWidth > 0 && (
        <motion.div
          className="absolute bottom-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, #8b5cf6, #3b82f6, #93c5fd)",
            width: sliderWidth,
            left:  sliderLeft,
          }}
          initial={false}
          animate={{ left: sliderLeft, width: sliderWidth }}
          transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
        />
      )}
    </div>
  );
}