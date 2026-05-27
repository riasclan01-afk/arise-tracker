import { motion } from "framer-motion";

const TABS = [
  { id: "study", label: "STUDY QUEST" },
  { id: "workout", label: "TRAINING ARC" },
];

export default function TabNav({ activeTab, onChange }) {
  return (
    <div className="flex rounded-lg border border-[var(--border-dim)] bg-bgSecondary">
      {TABS.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            className="relative min-h-11 flex-1 px-4 py-3 font-heading text-sm tracking-[0.12em] text-textPrimary"
            onClick={() => onChange(tab.id)}
          >
            <span className={active ? "text-accentBlue glow-blue" : "text-textMuted"}>{tab.label}</span>
            {active ? (
              <motion.span
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-accentBlue shadow-[0_0_12px_rgba(79,195,247,0.8)]"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
