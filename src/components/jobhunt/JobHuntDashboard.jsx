// components/jobhunt/JobHuntDashboard.jsx — SYSTEM STYLE
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Briefcase, Target, CheckCircle2, XCircle, Clock } from "lucide-react";
import JobCard from "./JobCard";
import AddJobModal from "./AddJobModal";

const COMPANIES = [
  { name: "NVIDIA", color: "#76B900", icon: "🎮" },
  { name: "AMD", color: "#ED1C24", icon: "🔴" },
  { name: "Qualcomm", color: "#3253DC", icon: "📱" },
  { name: "Intel", color: "#0071C5", icon: "💻" },
  { name: "Marvell", color: "#D21F3C", icon: "🔷" },
  { name: "Broadcom", color: "#D71920", icon: "📡" },
  { name: "Texas Instruments", color: "#E01F26", icon: "🔌" },
  { name: "Apple", color: "#000000", icon: "🍎" },
  { name: "ARM", color: "#0091BD", icon: "💪" },
  { name: "Micron", color: "#0A6EB4", icon: "🧠" },
  { name: "Siemens EDA", color: "#009999", icon: "⚡" },
  { name: "Infineon", color: "#000080", icon: "♾️" },
  { name: "Etched", color: "#FF6B35", icon: "🚀" },
  { name: "Ciena", color: "#ED1C24", icon: "🌐" },
];

// Status colors pulled from the locked System palette instead of generic Tailwind hex
const STATUS_COLORS = {
  targeted: "var(--accent-blue)",
  applied: "var(--accent-gold)",
  interview: "var(--accent-purple)",
  offer: "var(--accent-teal)",
  rejected: "var(--accent-red)",
};

export default function JobHuntDashboard({ jobs, onUpdateJobs }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredJobs = filterStatus === "all"
    ? jobs
    : jobs.filter((j) => j.status === filterStatus);

  const statusCounts = {
    targeted: jobs.filter((j) => j.status === "targeted").length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interview: jobs.filter((j) => j.status === "interview").length,
    offer: jobs.filter((j) => j.status === "offer").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatBadge icon={<Target className="w-4 h-4" />} label="Targeted" count={statusCounts.targeted} color={STATUS_COLORS.targeted} />
        <StatBadge icon={<Clock className="w-4 h-4" />} label="Applied" count={statusCounts.applied} color={STATUS_COLORS.applied} />
        <StatBadge icon={<Briefcase className="w-4 h-4" />} label="Interview" count={statusCounts.interview} color={STATUS_COLORS.interview} />
        <StatBadge icon={<CheckCircle2 className="w-4 h-4" />} label="Offer" count={statusCounts.offer} color={STATUS_COLORS.offer} />
        <StatBadge icon={<XCircle className="w-4 h-4" />} label="Rejected" count={statusCounts.rejected} color={STATUS_COLORS.rejected} />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {["all", "targeted", "applied", "interview", "offer", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-wider transition-all border"
              style={
                filterStatus === status
                  ? {
                      background: "rgba(0,208,255,0.1)",
                      color: "var(--accent-blue)",
                      borderColor: "rgba(0,208,255,0.35)",
                      textShadow: "0 0 8px rgba(0,208,255,0.4)",
                    }
                  : {
                      background: "rgba(255,255,255,0.02)",
                      color: "var(--text-muted)",
                      borderColor: "var(--border-hairline)",
                    }
              }
            >
              {status}
            </button>
          ))}
        </div>

        <motion.button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-sm border font-mono text-xs uppercase tracking-wider transition-all"
          style={{
            background: "rgba(0,208,255,0.1)",
            color: "var(--accent-blue)",
            borderColor: "rgba(0,208,255,0.35)",
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          <Plus className="w-4 h-4" />
          Add Application
        </motion.button>
      </div>

      {/* Job Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onEdit={() => {
              setEditingJob(job);
              setShowAddModal(true);
            }}
            onDelete={() => {
              onUpdateJobs(jobs.filter((j) => j.id !== job.id));
            }}
            onUpdate={(updates) => {
              onUpdateJobs(jobs.map((j) => (j.id === job.id ? { ...j, ...updates } : j)));
            }}
          />
        ))}
      </motion.div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 text-textMuted">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-mono text-xs uppercase tracking-[0.1em]">No applications found for this filter</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddJobModal
            companies={COMPANIES}
            existingJob={editingJob}
            onClose={() => {
              setShowAddModal(false);
              setEditingJob(null);
            }}
            onSave={(jobData) => {
              if (editingJob) {
                onUpdateJobs(jobs.map((j) => (j.id === editingJob.id ? { ...editingJob, ...jobData } : j)));
              } else {
                onUpdateJobs([...jobs, { ...jobData, id: Date.now().toString() }]);
              }
              setShowAddModal(false);
              setEditingJob(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBadge({ icon, label, count, color }) {
  return (
    <div className="card-glow p-4">
      <div className="flex items-center gap-2 mb-1" style={{ color }}>
        {icon}
        <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-heading text-2xl font-bold" style={{ color, textShadow: `0 0 10px ${color}55` }}>
        {count}
      </div>
    </div>
  );
}
