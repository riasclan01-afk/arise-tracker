import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import DayTask from "./DayTask";

const expandVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function WeekCard({ week, checkedMap, onToggle }) {
  const completed = week.days.filter((d) => checkedMap[d.id]).length;
  const percent = (completed / week.days.length) * 100;

  return (
    <details className="group card-glow rounded-xl bg-bgCard p-4" open>
      <summary className="list-none cursor-pointer">
        <div className="flex min-h-11 items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accentPurple">{week.phase}</p>
            <h3 className="mt-1 font-heading text-xl uppercase tracking-[0.08em] text-textPrimary">
              <span className="mr-2 rounded border border-accentBlue/40 px-2 py-0.5 text-sm text-accentBlue">{`Week ${week.week}`}</span>
              {week.title}
            </h3>
            <p className="mt-1 text-sm text-textSecondary">{week.subtitle}</p>
          </div>
          <ChevronDown className="mt-1 text-textSecondary transition group-open:rotate-180" />
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-bgSecondary">
          <motion.div
            className="h-full rounded-full bg-accentBlue shadow-[0_0_14px_rgba(79,195,247,0.7)]"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: percent / 100 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-textSecondary">{`${completed}/${week.days.length} complete (${Math.round(percent)}%)`}</p>
      </summary>
      <AnimatePresence initial={false}>
        <motion.div className="mt-4 space-y-2 overflow-hidden" initial="hidden" animate="visible" variants={expandVariants}>
          {week.days.map((day) => (
            <DayTask key={day.id} task={day} checked={Boolean(checkedMap[day.id])} onToggle={() => onToggle(day.id)} />
          ))}
        </motion.div>
      </AnimatePresence>
    </details>
  );
}
