export default function ExerciseRow({ exercise, checked, onToggle }) {
  return (
    <div className="grid min-h-11 grid-cols-[1fr_auto] items-start gap-3 rounded-lg border border-[var(--border-dim)] bg-bgSecondary/60 p-3">
      <div>
        <p className={`font-body text-sm ${checked ? "text-textMuted line-through" : "text-textPrimary"}`}>{exercise.name}</p>
        <p className="font-mono text-xs text-textSecondary">{`${exercise.sets} sets x ${exercise.reps}`}</p>
        <p className="mt-0.5 text-xs text-textMuted">{exercise.note}</p>
      </div>
      <button
        className={`checkbox-glow mt-1 flex h-11 w-11 items-center justify-center rounded border ${checked ? "border-accentTeal bg-accentTeal/30" : "border-[var(--border-dim)]"}`}
        onClick={onToggle}
        aria-label={`Toggle ${exercise.id}`}
      >
        <span className={`h-4 w-4 rounded-sm border ${checked ? "border-accentTeal bg-accentTeal" : "border-textMuted"}`} />
      </button>
    </div>
  );
}
