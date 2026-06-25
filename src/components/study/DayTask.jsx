// components/study/DayTask.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Edit3 } from "lucide-react";
import { useState } from "react";
import { BOOK_COLORS } from "../../data/studyPlan";
import { haptics } from "../../utils/haptics";

export default function DayTask({ task, checked, note, onToggle, onUpdateNote, isToday, isPast }) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText]           = useState(note);
  const colors = BOOK_COLORS[task.book] ?? BOOK_COLORS.Review;

  const handleToggle = () => {
    if (!checked) haptics.success();
    else haptics.light();
    onToggle();
  };

  const handleSaveNote = () => {
    onUpdateNote(noteText);
    setShowNoteInput(false);
    haptics.light();
  };

  const containerClass = checked
    ? "border-accentBlue/40 bg-accentBlue/8 shadow-lg shadow-accentBlue/10"
    : isToday
    ? "border-accentBlue/50 bg-accentBlue/5 shadow-lg shadow-accentBlue/10"
    : isPast && !checked
    ? "border-red-500/20 bg-red-500/5"
    : "border-[var(--border-dim)] bg-bgSecondary/70 hover:border-[rgba(59,130,246,0.2)] hover:bg-[rgba(59,130,246,0.02)]";

  return (
    <motion.div
      className={`rounded-sm border p-3 transition-all duration-300 ${containerClass}`}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="grid min-h-11 grid-cols-[auto_1fr_auto_auto] items-start gap-3">
        <motion.span
          className="hex-clip mt-0.5 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            color: colors.text,
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {task.book}
        </motion.span>

        <div className="min-w-0">
          <motion.p
            className={`font-body text-sm transition-all duration-300 ${
              checked ? "text-textMuted line-through" : "text-textPrimary"
            }`}
            layout
          >
            <span className="mr-2 font-heading text-xs uppercase tracking-[0.12em] text-textSecondary">
              {task.day}
            </span>
            {isToday && (
              <span className="mr-2 rounded-sm bg-accentBlue/20 border border-accentBlue/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-accentBlue">
                TODAY
              </span>
            )}
            {task.task}
          </motion.p>
          <motion.p className="mt-1 font-body text-xs text-textMuted" layout>
            {task.side}
          </motion.p>
        </div>

        {/* Notes Button */}
        <motion.button
          onClick={() => setShowNoteInput(!showNoteInput)}
          className={`mt-1 flex h-11 w-11 items-center justify-center rounded border transition-all duration-200 ${
            note || showNoteInput
              ? "border-purple-500/50 bg-purple-500/20 text-purple-400"
              : "border-[var(--border-dim)] bg-transparent hover:border-purple-500/30 hover:bg-purple-500/10 text-textMuted"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Add note"
        >
          <Edit3 className="w-4 h-4" />
        </motion.button>

        {/* ── Checkbox ─────────────────────────────────────────────────── */}
        <motion.button
          className={`mt-1 flex h-11 w-11 items-center justify-center rounded border transition-all duration-200 ${
            checked
              ? "border-accentBlue bg-accentBlue/20 shadow-lg shadow-accentBlue/30"
              : "border-[var(--border-dim)] bg-transparent hover:border-accentBlue/40 hover:bg-accentBlue/5"
          }`}
          onClick={handleToggle}
          aria-label={`Toggle ${task.id}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className={`h-4 w-4 rounded-sm border transition-all duration-200 ${
              checked
                ? "border-accentBlue bg-accentBlue shadow-[0_0_12px_rgba(59,130,246,0.9)]"
                : "border-textMuted"
            }`}
            animate={{
              rotateZ: checked ? [0, 360] : 0,
              scale:   checked ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>

      {/* Note Input */}
      <AnimatePresence>
        {showNoteInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 overflow-hidden"
          >
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add study notes..."
              className="w-full px-3 py-2 bg-bgPrimary border border-white/10 rounded text-sm text-textPrimary placeholder-textMuted focus:border-purple-500/50 focus:outline-none resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveNote}
                className="flex-1 px-3 py-1.5 bg-purple-500/20 border border-purple-500/40 rounded text-xs text-purple-400 hover:bg-purple-500/30 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => { setShowNoteInput(false); setNoteText(note); }}
                className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-textMuted hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note Preview */}
      {note && !showNoteInput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-2 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300"
        >
          📝 {note}
        </motion.div>
      )}
    </motion.div>
  );
}