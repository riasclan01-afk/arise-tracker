// components/jobhunt/JobCard.jsx — SYSTEM REDESIGN
import { motion, AnimatePresence } from "framer-motion";
import { Star, MoreVertical, Trash2, Edit, ChevronDown } from "lucide-react";
import { useState } from "react";

// Locked palette — mirrors what JobHuntDashboard.jsx uses
const STATUS_COLORS = {
  targeted: "var(--accent-blue)",      // #00d0ff
  applied:  "var(--accent-gold)",      // #ffc736
  interview:"var(--accent-purple)",    // #7c4dff
  offer:    "var(--accent-teal)",      // #00e6a8
  rejected: "var(--accent-red)",       // #ff3b3b
};

const STATUS_BG = {
  targeted: "rgba(0,208,255,0.08)",
  applied:  "rgba(255,199,54,0.08)",
  interview:"rgba(124,77,255,0.08)",
  offer:    "rgba(0,230,168,0.08)",
  rejected: "rgba(255,59,59,0.08)",
};

const STATUS_BORDER = {
  targeted: "rgba(0,208,255,0.30)",
  applied:  "rgba(255,199,54,0.30)",
  interview:"rgba(124,77,255,0.30)",
  offer:    "rgba(0,230,168,0.30)",
  rejected: "rgba(255,59,59,0.30)",
};

export default function JobCard({ job, onEdit, onDelete, onUpdate }) {
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="card-glow p-4 relative"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.985 }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center text-lg rounded-sm"
            style={{
              background: "rgba(0,208,255,0.06)",
              border: "1px solid var(--border-dim)",
            }}
          >
            {job.icon}
          </div>
          <div>
            <h3 className="font-heading text-base uppercase tracking-wider text-textPrimary leading-tight">
              {job.company}
            </h3>
            <p className="font-mono text-[11px] text-textMuted tracking-wide">
              {job.position || "Software Engineer"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Priority star */}
          <button
            onClick={() => onUpdate({ priority: !job.priority })}
            className="p-1 rounded-sm transition-all"
            style={{ color: job.priority ? "var(--accent-gold)" : "var(--text-muted)" }}
          >
            <Star
              className="w-4 h-4"
              fill={job.priority ? "var(--accent-gold)" : "none"}
              stroke="currentColor"
            />
          </button>

          {/* Menu toggle */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-sm transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute right-4 top-12 z-20 overflow-hidden"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-bright)",
              borderRadius: "4px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              minWidth: "130px",
            }}
          >
            <button
              onClick={() => { onEdit(); setShowMenu(false); }}
              className="flex items-center gap-2 px-4 py-2.5 w-full text-left text-sm font-body transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,208,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Edit className="w-3.5 h-3.5" />
              EDIT
            </button>
            <div style={{ height: "1px", background: "var(--border-hairline)" }} />
            <button
              onClick={() => { onDelete(); setShowMenu(false); }}
              className="flex items-center gap-2 px-4 py-2.5 w-full text-left text-sm font-body transition-colors"
              style={{ color: "var(--accent-red)" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,59,59,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Trash2 className="w-3.5 h-3.5" />
              DELETE
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status badge/select */}
      <select
        value={job.status}
        onChange={(e) => onUpdate({ status: e.target.value })}
        className="w-full px-3 py-2 mb-3 font-mono text-[11px] uppercase tracking-widest outline-none transition-all"
        style={{
          background: STATUS_BG[job.status],
          border: `1px solid ${STATUS_BORDER[job.status]}`,
          color: STATUS_COLORS[job.status],
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <option value="targeted">◈ Targeted</option>
        <option value="applied">◈ Applied</option>
        <option value="interview">◈ Interview</option>
        <option value="offer">◈ Offer</option>
        <option value="rejected">◈ Rejected</option>
      </select>

      {/* Applied date */}
      {job.appliedDate && (
        <p className="font-mono text-[10px] tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
          APPLIED · {new Date(job.appliedDate).toLocaleDateString()}
        </p>
      )}

      {/* Prep Tips collapsible */}
      {job.prepTips && (
        <div className="mb-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors"
            style={{ color: "var(--accent-blue)" }}
          >
            <ChevronDown
              className="w-3.5 h-3.5 transition-transform"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            />
            Prep Tips
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs mt-2 pl-5 font-body leading-relaxed"
                style={{ color: "var(--text-secondary)", overflow: "hidden" }}
              >
                {job.prepTips}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Interview notes */}
      {job.notes && (
        <div
          className="mt-3 p-2.5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border-hairline)",
            borderRadius: "4px",
          }}
        >
          <p className="font-body text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <span style={{ color: "var(--accent-blue)" }}>▸</span> {job.notes}
          </p>
        </div>
      )}
    </motion.div>
  );
}