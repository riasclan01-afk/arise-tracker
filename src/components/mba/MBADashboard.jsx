// src/components/mba/MBADashboard.jsx — MBA ASCENSION TRACK
import { motion } from "framer-motion";
import { GraduationCap, Trophy, Lock } from "lucide-react";
import { useState } from "react";
import ProgressRing from "../ui/ProgressRing";  

const TIERS = [
{ id: "NOVICE", label: "NOVICE HUNTER",  min: 0  },
{ id: "D",      label: "D-RANK HUNTER",  min: 3  },
{ id: "C",      label: "C-RANK HUNTER",  min: 7  },
{ id: "B",      label: "B-RANK HUNTER",  min: 11 },
{ id: "A",      label: "A-RANK HUNTER",  min: 15 },
{ id: "S",      label: "S-RANK — MBA MONARCH", min: 18 },
];  

const GATES = [
{
id: "y1",
tier: "NOVICE → D",
period: "NOW — MID 2027",
title: "GATE I · FOUNDATION",
flavor: "Clear the entry gate. Secure ground before you climb.",
quests: [
{ id: "y1-1", text: "Lock down a DV / RTL / FPGA job offer" },
{ id: "y1-2", text: "Document the WISE Lab LUT accelerator as a clean story" },
{ id: "y1-3", text: "Refresh 2–3 core MS subjects you feel rusty on" },
{ id: "y1-4", text: "Settle into the role — chase visible ownership, not just tasks" },
{ id: "y1-5", text: "Start light GMAT prep — vocab + quant fundamentals" },
{ id: "y1-6", text: "Take a free GMAT diagnostic" },
{ id: "y1-7", text: "Start a monthly achievements log" },
],
},
{
id: "y2",
tier: "C → B",
period: "MID 2027 — MID 2028",
title: "GATE II · ASCENSION",
flavor: "The grind year. Power and story compound here.",
quests: [
{ id: "y2-1", text: "Land a promotion, bigger project, or lead role" },
{ id: "y2-2", text: "Structured GMAT prep — 3 to 4 months" },
{ id: "y2-3", text: "Sit the GMAT — target 700+" },
{ id: "y2-4", text: "Retake if needed" },
{ id: "y2-5", text: "Deep-dive target schools — Yonsei, KAIST, SKK GSB, ISB, INSEAD" },
{ id: "y2-6", text: "Talk to alumni, attend info sessions" },
{ id: "y2-7", text: "Draft the why-MBA narrative — include the 2.11 → graduate arc" },
],
},
{
id: "y3",
tier: "A → S",
period: "MID 2028 — 2029",
title: "GATE III · THE MONARCH'S TRIAL",
flavor: "Final gate. Everything you built gets named here.",
quests: [
{ id: "y3-1", text: "Finalize school list — reach, match, safety" },
{ id: "y3-2", text: "Applications open (~12 months before intake)" },
{ id: "y3-3", text: "Polish essays" },
{ id: "y3-4", text: "Secure recommendations — Prof. Chatterjee + a manager" },
{ id: "y3-5", text: "Interview prep" },
{ id: "y3-6", text: "Submit applications" },
{ id: "y3-7", text: "Admission decisions + scholarship negotiation" },
],
},
];  

const ALL_QUEST_IDS = GATES.flatMap((g) => g.quests.map((q) => q.id));  

function getTier(completedCount) {
let current = TIERS[0];
for (const t of TIERS) if (completedCount >= t.min) current = t;
return current;
}
function getNextTier(completedCount) {
return TIERS.find((t) => t.min > completedCount) || null;
}  

export default function MBADashboard({ mbaProgress = {}, onToggleQuest }) {
const [openGate, setOpenGate] = useState("y1");  

const completedCount = ALL_QUEST_IDS.filter((id) => mbaProgress[id]).length;
const totalCount     = ALL_QUEST_IDS.length;
const percent        = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
const tier           = getTier(completedCount);
const nextTier       = getNextTier(completedCount);  

return (
<div className="flex flex-col gap-4">
{/* ── TIER BANNER ── */}
<motion.div
className="card-glow p-5"
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35 }}
>
<div className="flex items-center gap-4">
<ProgressRing percent={percent} size={64} />
<div className="flex-1">
<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-textSecondary opacity-80">
MBA Track Rank
</p>
<p className="mt-1 font-heading text-xl uppercase tracking-wider glow-blue">
{tier.label}
</p>
<p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-textMuted opacity-70">
{completedCount} / {totalCount} QUESTS ·{" "}
{nextTier
? `NEXT AT ${nextTier.min}`
: "MAX TIER ACHIEVED"}
</p>
</div>
</div>
</motion.div>  

{/* ── GATES ── */}
{GATES.map((gate, gi) => {
const gateCompleted = gate.quests.filter((q) => mbaProgress[q.id]).length;
const gateTotal     = gate.quests.length;
const isOpen        = openGate === gate.id;
const isCleared     = gateCompleted === gateTotal;  

return (
<motion.div
key={gate.id}
className="card-glow overflow-hidden"
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35, delay: 0.06 * gi }}
>
<button
onClick={() => setOpenGate(isOpen ? null : gate.id)}
className="w-full flex items-center justify-between p-4 text-left"
style={{ background: "transparent", border: "none" }}
>
<div className="flex items-center gap-3">
{isCleared ? (
<Trophy size={18} strokeWidth={2} color="#3b82f6" />
) : (
<GraduationCap size={18} strokeWidth={2} color="rgba(59,130,246,0.6)" />
)}
<div>
<p
className="font-mono text-[9px] uppercase tracking-[0.15em]"
style={{ color: isCleared ? "#22c55e" : "rgba(59,130,246,0.55)" }}
>
TIER {gate.tier} · {gate.period}
</p>
<p className="font-heading text-sm uppercase tracking-wider text-textPrimary mt-0.5">
{gate.title}
</p>
</div>
</div>
<span className="font-mono text-xs text-textMuted opacity-70 shrink-0 ml-2">
{gateCompleted}/{gateTotal}
</span>
</button>  

{isOpen && (
<div className="px-4 pb-4">
<p
className="font-mono text-[11px] italic mb-3"
style={{ color: "rgba(59,130,246,0.5)" }}
>
{gate.flavor}
</p>
<div className="flex flex-col">
{gate.quests.map((q) => {
const done = !!mbaProgress[q.id];
return (
<button
key={q.id}
onClick={() => onToggleQuest(q.id)}
className="flex items-center gap-3 py-2.5 text-left"
style={{
background: "transparent",
border: "none",
borderBottom: "1px solid rgba(59,130,246,0.1)",
}}
>
<span
className="checkbox-glow shrink-0"
style={{
width: "14px",
height: "14px",
border: `1.5px solid ${done ? "#22c55e" : "rgba(59,130,246,0.4)"}`,
background: done ? "#22c55e" : "transparent",
transform: "rotate(45deg)",
display: "inline-block",
}}
/>
<span
className="font-body text-sm"
style={{
color: done ? "var(--text-muted)" : "var(--text-primary)",
textDecoration: done ? "line-through" : "none",
}}
>
{q.text}
</span>
</button>
);
})}
</div>
</div>
)}
</motion.div>
);
})}  

<p
className="text-center font-mono text-[10px] tracking-[0.1em] py-2"
style={{ color: "rgba(59,130,246,0.35)" }}
>
2.11 WAS THE PROBATION GATE. THIS IS THE NEXT ONE.
</p>
</div>
);
}