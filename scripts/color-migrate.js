import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const files = [
  "src/components/Header.jsx",
  "src/components/DailyQuests.jsx",
  "src/components/PenaltyScreen.jsx",
  "src/components/CharacterStats.jsx",
  "src/App.jsx",
  "src/components/ui/PomodoroTimer.jsx",
  "src/components/ui/QuestComplete.jsx",
  "src/components/TabNav.jsx",
  "src/components/StatsBar.jsx",
  "src/components/ui/ProgressRing.jsx",
  "src/hooks/usePenalty.js",
  "src/utils/progress.js",
];

const replacements = [
  ["#fbbf24", "#3b82f6"],
  ["#d97706", "#8b5cf6"],
  ["#b45309", "#6366f1"],
  ["#fde68a", "#93c5fd"],
  ["#fef9e7", "#e0e7ff"],
  ["#0e0e00", "#0a0a14"],
  ["#080800", "#080808"],
  ["#141400", "#0f0f1a"],
  ["#0a0900", "#0a0a14"],
  ["rgba(251,191,36", "rgba(59,130,246"],
  ["rgba(217,119,6", "rgba(139,92,246"],
  ["rgba(180,83,9", "rgba(99,102,241"],
  ["rgba(254,249,231", "rgba(224,231,255"],
  ["rgba(212,168,0", "rgba(96,165,250"],
  ["rgba(251, 191, 36", "rgba(59, 130, 246"],
  ["rgba(217, 119, 6", "rgba(139, 92, 246"],
  ["rgba(180, 83, 9", "rgba(99, 102, 241"],
  ['"251,191,36"', '"59,130,246"'],
  ['"217,119,6"', '"139,92,246"'],
  ['"180,83,9"', '"99,102,241"'],
  ["251,191,36", "59,130,246"],
  ["217,119,6", "139,92,246"],
  ["180,83,9", "99,102,241"],
  ["#f59e0b", "#3b82f6"],
  ["#d4a800", "#93c5fd"],
  ["#7a5f00", "#475569"],
  ["rgba(26,22,8", "rgba(10,10,20"],
];

for (const f of files) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) {
    console.log("skip", f);
    continue;
  }
  let c = fs.readFileSync(p, "utf8");
  for (const [a, b] of replacements) {
    c = c.split(a).join(b);
  }
  fs.writeFileSync(p, c);
  console.log("updated", f);
}
