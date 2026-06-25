// components/workout/DayCard.jsx - WITH WEIGHT LOGGING
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ProgressRing from "../ui/ProgressRing";
import ExerciseRow from "./ExerciseRow";

const expandVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

// Reserve day card
function ReserveDayCard({ day, getChecked, onToggle }) {
  const checked = day.reserveOptions.filter((o) => getChecked(o.id)).length;

  return (
    <div className="card-glow bg-bgCard p-4" style={{ position: "relative", overflow: "hidden" }}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-textSecondary">{`${day.dayLabel} - ${day.weekDay}`}</p>
          <h3 className="mt-1 font-heading text-lg uppercase tracking-[0.08em]" style={{ color: day.accentColor }}>
            {day.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-textMuted">
            {checked === 0 ? "Select what applies today" : `${checked} selected`}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {day.reserveOptions.map((option) => {
          const isChecked = getChecked(option.id);
          return (
            <button
              key={option.id}
              onClick={() => onToggle(option.id)}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-3 transition-all duration-200"
              style={{
                background: isChecked ? `${option.color}18` : "rgba(255,255,255,0.02)",
                border: `1px solid ${isChecked ? option.color : "rgba(255,255,255,0.06)"}`,
                boxShadow: isChecked ? `0 0 12px ${option.color}30` : "none",
              }}
            >
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                border: `2px solid ${isChecked ? option.color : "rgba(255,255,255,0.2)"}`,
                background: isChecked ? option.color : "transparent",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                boxShadow: isChecked ? `0 0 8px ${option.color}60` : "none",
              }}>
                {isChecked && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span
                className="font-heading text-sm uppercase tracking-[0.08em]"
                style={{ color: isChecked ? option.color : "rgba(255,255,255,0.5)" }}
              >
                {option.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Regular workout day card
export default function DayCard({ day, getChecked, onToggle, workoutLogs, onUpdateLog }) {
  if (day.isReserve) {
    return <ReserveDayCard day={day} getChecked={getChecked} onToggle={onToggle} />;
  }

  const completed = day.exercises.filter((e) => getChecked(e.id)).length;
  const percent = (completed / day.exercises.length) * 100;

  return (
    <details className="card-glow bg-bgCard p-4" style={{ position: "relative", overflow: "hidden" }} open>
      <summary className="list-none cursor-pointer" style={{ position: "relative", zIndex: 1 }}>
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
        <motion.div className="mt-4 space-y-2 overflow-hidden" style={{ position: "relative", zIndex: 1 }} initial="hidden" animate="visible" variants={expandVariants}>
          {day.exercises.map((exercise) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              checked={getChecked(exercise.id)}
              log={workoutLogs?.[exercise.id]}
              onToggle={() => onToggle(exercise.id)}
              onUpdateLog={(log) => onUpdateLog?.(exercise.id, log)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </details>
  );
}