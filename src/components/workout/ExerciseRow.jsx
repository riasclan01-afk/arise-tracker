// components/workout/ExerciseRow.jsx - WITH WEIGHT LOGGING
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Dumbbell } from "lucide-react";
import { useState } from "react";
import { haptics } from "../../utils/haptics";

export default function ExerciseRow({ exercise, checked, log, onToggle, onUpdateLog }) {
  const [showLog, setShowLog] = useState(false);
  const [weight, setWeight] = useState(log?.weight || "");
  const [reps, setReps] = useState(log?.reps || "");

  const handleSaveLog = () => {
    onUpdateLog?.({
      weight: parseFloat(weight) || 0,
      reps: parseInt(reps) || 0,
      date: new Date().toISOString()
    });
    setShowLog(false);
    haptics.light();
  };

  const lastWeekWeight = log?.lastWeek?.weight || 0;
  const currentWeight = parseFloat(weight) || log?.weight || 0;
  
  let trend = null;
  if (lastWeekWeight && currentWeight) {
    if (currentWeight > lastWeekWeight) trend = "up";
    else if (currentWeight < lastWeekWeight) trend = "down";
    else trend = "same";
  }

  return (
    <motion.div
      className={`rounded-sm border p-3 transition-all duration-300 ${
        checked
          ? "border-accentTeal/40 bg-accentTeal/10 shadow-lg shadow-teal-500/10"
          : "border-white/10 bg-white/5 hover:border-accentTeal/20 hover:bg-accentTeal/5"
      }`}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`font-body text-sm transition-all ${
            checked ? "text-textMuted line-through" : "text-textPrimary"
          }`}>
            {exercise.name}
          </p>
          <p className="mt-0.5 font-mono text-xs text-textMuted">
            {exercise.sets} × {exercise.reps}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Log Button */}
          {onUpdateLog && (
            <motion.button
              onClick={() => setShowLog(!showLog)}
              className={`flex h-9 w-9 items-center justify-center rounded border transition-all ${
                log || showLog
                  ? "border-accentGold/50 bg-accentGold/20 text-accentGold"
                  : "border-white/10 bg-transparent hover:border-accentGold/30 hover:bg-accentGold/10 text-textMuted"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Log weight"
            >
              <Dumbbell className="w-4 h-4" />
            </motion.button>
          )}

          {/* Checkbox */}
          <motion.button
            onClick={onToggle}
            className={`flex h-9 w-9 items-center justify-center rounded border transition-all ${
              checked
                ? "border-accentTeal bg-accentTeal/30 shadow-lg shadow-teal-500/20"
                : "border-white/10 bg-transparent hover:border-accentTeal/50 hover:bg-accentTeal/10"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={`h-4 w-4 rounded-sm border transition-all ${
                checked
                  ? "border-accentTeal bg-accentTeal shadow-[0_0_12px_rgba(0,229,204,0.8)]"
                  : "border-textMuted"
              }`}
              animate={{
                rotateZ: checked ? [0, 360] : 0,
                scale: checked ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </div>

      {/* Weight Logging Section */}
      <AnimatePresence>
        {showLog && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="p-3 bg-bgPrimary border border-white/10 rounded space-y-3">
              {lastWeekWeight > 0 && (
                <div className="flex items-center justify-between text-xs text-textMuted">
                  <span>Last week:</span>
                  <span className="font-mono">{lastWeekWeight} lbs × {log?.lastWeek?.reps || "?"}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-textMuted mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-bgSecondary border border-white/10 rounded text-sm text-textPrimary focus:border-accentGold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textMuted mb-1">Reps</label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-bgSecondary border border-white/10 rounded text-sm text-textPrimary focus:border-accentGold/50 focus:outline-none"
                  />
                </div>
              </div>

              {trend && (
                <div className={`flex items-center gap-2 text-xs ${
                  trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-yellow-400"
                }`}>
                  {trend === "up" && <><TrendingUp className="w-4 h-4" /> Strength increased!</>}
                  {trend === "down" && <><TrendingDown className="w-4 h-4" /> Lower than last week</>}
                  {trend === "same" && <><Minus className="w-4 h-4" /> Same as last week</>}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSaveLog}
                  className="flex-1 px-3 py-1.5 bg-accentGold/20 border border-accentGold/40 rounded text-xs text-accentGold hover:bg-accentGold/30 transition-colors"
                >
                  Save Log
                </button>
                <button
                  onClick={() => setShowLog(false)}
                  className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-textMuted hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Preview */}
      {log && !showLog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 flex items-center gap-2 text-xs text-accentGold"
        >
          <Dumbbell className="w-3 h-3" />
          <span className="font-mono">{log.weight} lbs × {log.reps}</span>
          {trend && (
            <span className={trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-yellow-400"}>
              {trend === "up" && "↑"}{trend === "down" && "↓"}{trend === "same" && "="}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}