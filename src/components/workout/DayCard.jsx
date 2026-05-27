import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ProgressRing from "../ui/ProgressRing";
import ExerciseRow from "./ExerciseRow";

const expandVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function DayCard({ day, getChecked, onToggle }) {
  const completed = day.exercises.filter((e) => getChecked(e.id)).length;
  const percent = (completed / day.exercises.length) * 100;

  return (
    <details className="card-glow rounded-xl bg-bgCard p-4" open>
      <summary className="list-none cursor-pointer">
        <div className="flex min-h-11 items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-textSecondary">{`${day.dayLabel} - ${day.weekDay}`}</p>
            <h3 className="mt-1 font-heading text-lg uppercase tracking-[0.08em]" style={{ color: day.accentColor }}>
              {day.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <ProgressRing percent={percent} color={day.accentColor} />
            <ChevronDown className="text-textSecondary transition group-open:rotate-180" />
          </div>
        </div>
      </summary>
      <AnimatePresence initial={false}>
        <motion.div className="mt-4 space-y-2 overflow-hidden" initial="hidden" animate="visible" variants={expandVariants}>
          {day.exercises.map((exercise) => (
            <ExerciseRow key={exercise.id} exercise={exercise} checked={getChecked(exercise.id)} onToggle={() => onToggle(exercise.id)} />
          ))}
        </motion.div>
      </AnimatePresence>
    </details>
  );
}
