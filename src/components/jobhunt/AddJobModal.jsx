// components/jobhunt/AddJobModal.jsx — SYSTEM REDESIGN + crash fix
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

const fieldStyle = {
  width: "100%",
  padding: "10px 14px",
  background: "var(--bg-primary)",
  border: "1px solid var(--border-dim)",
  borderRadius: "4px",
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.15s ease",
};

const labelStyle = {
  display: "block",
  fontSize: "10px",
  fontFamily: "var(--font-mono)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: "6px",
};

export default function AddJobModal({ companies, existingJob, onClose, onSave }) {
  const [formData, setFormData] = useState(
    existingJob || {
      company: "",
      icon: "",
      position: "",
      status: "targeted",
      priority: false,
      appliedDate: "",
      prepTips: "",
      notes: "",
    }
  );
  const [focusedField, setFocusedField] = useState(null);

  const getFocusStyle = (name) => ({
    ...fieldStyle,
    borderColor: focusedField === name ? "var(--accent-blue)" : "var(--border-dim)",
    boxShadow: focusedField === name ? "0 0 0 1px rgba(0,208,255,0.15)" : "none",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 12 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-bright)",
          borderRadius: "6px",
          boxShadow:
            "0 0 0 1px rgba(0,208,255,0.06), 0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
          padding: "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing top-edge line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "16px",
            right: "16px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, var(--accent-blue) 50%, transparent 100%)",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        {/* HUD corner brackets */}
        {[
          { top: 0, left: 0, borderTop: "1.5px solid var(--border-bright)", borderLeft: "1.5px solid var(--border-bright)" },
          { top: 0, right: 0, borderTop: "1.5px solid var(--border-bright)", borderRight: "1.5px solid var(--border-bright)" },
          { bottom: 0, left: 0, borderBottom: "1.5px solid var(--border-bright)", borderLeft: "1.5px solid var(--border-bright)" },
          { bottom: 0, right: 0, borderBottom: "1.5px solid var(--border-bright)", borderRight: "1.5px solid var(--border-bright)" },
        ].map((s, i) => (
          <div
            key={i}
            style={{ position: "absolute", width: "10px", height: "10px", pointerEvents: "none", zIndex: 3, ...s }}
          />
        ))}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", color: "var(--accent-blue)", opacity: 0.7, marginBottom: "2px" }}>
              SYSTEM · JOB HUNT
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)", lineHeight: 1 }}>
              {existingJob ? "Edit Application" : "New Application"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-sm"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-dim)", color: "var(--text-muted)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div style={{ height: "1px", background: "var(--border-hairline)", marginBottom: "20px" }} />

        <div className="space-y-4">
          {/* Company */}
          <div>
            <label style={labelStyle}>Company</label>
            <select
              value={formData.company}
              onChange={(e) => {
                // ✅ CRASH FIX: guard against blank "Select company..." option
                const company = companies.find((c) => c.name === e.target.value);
                if (!company) return;
                setFormData({ ...formData, company: company.name, icon: company.icon });
              }}
              onFocus={() => setFocusedField("company")}
              onBlur={() => setFocusedField(null)}
              style={getFocusStyle("company")}
            >
              <option value="">Select company...</option>
              {companies.map((c) => (
                <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {/* Position */}
          <div>
            <label style={labelStyle}>Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="e.g., ASIC Design Engineer"
              onFocus={() => setFocusedField("position")}
              onBlur={() => setFocusedField(null)}
              style={getFocusStyle("position")}
            />
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              onFocus={() => setFocusedField("status")}
              onBlur={() => setFocusedField(null)}
              style={getFocusStyle("status")}
            >
              <option value="targeted">Targeted</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Applied Date */}
          <div>
            <label style={labelStyle}>Applied Date</label>
            <input
              type="date"
              value={formData.appliedDate}
              onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
              onFocus={() => setFocusedField("date")}
              onBlur={() => setFocusedField(null)}
              style={{ ...getFocusStyle("date"), colorScheme: "dark" }}
            />
          </div>

          {/* Prep Tips */}
          <div>
            <label style={labelStyle}>Prep Tips</label>
            <textarea
              value={formData.prepTips}
              onChange={(e) => setFormData({ ...formData, prepTips: e.target.value })}
              placeholder="Interview prep notes, technical topics to review..."
              rows={3}
              onFocus={() => setFocusedField("prepTips")}
              onBlur={() => setFocusedField(null)}
              style={{ ...getFocusStyle("prepTips"), resize: "none" }}
            />
          </div>

          {/* Interview Notes */}
          <div>
            <label style={labelStyle}>Interview Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes from interviews, follow-ups..."
              rows={3}
              onFocus={() => setFocusedField("notes")}
              onBlur={() => setFocusedField(null)}
              style={{ ...getFocusStyle("notes"), resize: "none" }}
            />
          </div>

          {/* Priority toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none" style={{ paddingTop: "4px" }}>
            <div
              onClick={() => setFormData({ ...formData, priority: !formData.priority })}
              style={{
                width: "18px", height: "18px", borderRadius: "3px", flexShrink: 0,
                border: `1px solid ${formData.priority ? "var(--accent-gold)" : "var(--border-dim)"}`,
                background: formData.priority ? "rgba(255,199,54,0.15)" : "var(--bg-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s ease",
              }}
            >
              {formData.priority && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: formData.priority ? "var(--accent-gold)" : "var(--text-muted)",
              transition: "color 0.15s ease",
            }}>
              Mark as Priority
            </span>
          </label>
        </div>

        <div style={{ height: "1px", background: "var(--border-hairline)", margin: "20px 0 16px" }} />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 font-heading text-sm uppercase tracking-widest transition-all rounded-sm"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-dim)", color: "var(--text-secondary)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-bright)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-dim)"}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={!formData.company}
            className="flex-1 py-3 font-heading text-sm uppercase tracking-widest transition-all rounded-sm"
            style={{
              background: formData.company ? "linear-gradient(135deg, rgba(0,208,255,0.15), rgba(124,77,255,0.15))" : "rgba(255,255,255,0.03)",
              border: `1px solid ${formData.company ? "var(--accent-blue)" : "var(--border-dim)"}`,
              color: formData.company ? "var(--accent-blue)" : "var(--text-muted)",
              boxShadow: formData.company ? "0 0 12px rgba(0,208,255,0.15)" : "none",
              cursor: formData.company ? "pointer" : "not-allowed",
              opacity: formData.company ? 1 : 0.5,
            }}
          >
            {existingJob ? "Update" : "Add"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}