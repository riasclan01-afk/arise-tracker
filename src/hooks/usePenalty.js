// src/hooks/usePenalty.js
import { useMemo } from "react";

const QUEST_COUNT = 4;

export function usePenalty({ questState, streak }) {
  return useMemo(() => {
    const today     = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // How many daily quests done today
    const todayDone     = (questState?.completed?.[today]     || []).length;
    const yesterdayDone = (questState?.completed?.[yesterday] || []).length;

    // Streak broken = no activity yesterday
    const streakBroken = streak?.lastDate !== today && streak?.lastDate !== yesterday;

    // Missed quests yesterday
    const missedYesterday = yesterdayDone < QUEST_COUNT;

    // Fatigue score (0–100) — accumulates from misses
    const missedCount = Math.max(0, QUEST_COUNT - yesterdayDone);
    const fatigue     = Math.min(100, (questState?.fatigue || 0));

    // XP penalty per missed quest
    const xpPenalty = missedCount * 50;

    // ✅ Check if penalty was already acknowledged today
    const alreadyAcknowledged = questState?.penaltyAcknowledgedDate === today;

    // Active debuffs
    const debuffs = [];

    if (fatigue >= 75) {
      debuffs.push({ id: "exhausted",   label: "EXHAUSTED",        desc: "All stats -20%",    color: "#dc2626", icon: "💀" });
    } else if (fatigue >= 50) {
      debuffs.push({ id: "fatigued",    label: "FATIGUED",         desc: "STR & AGI -15%",    color: "#f97316", icon: "😓" });
    } else if (fatigue >= 25) {
      debuffs.push({ id: "tired",       label: "TIRED",            desc: "AGI -10%",          color: "#3b82f6", icon: "😴" });
    }

    if (streakBroken && streak?.count > 0) {
      debuffs.push({ id: "streak_lost", label: "STREAK BROKEN",    desc: "Streak reset to 0", color: "#dc2626", icon: "💔" });
    }

    // ✅ Only add miss-based debuffs if NOT yet acknowledged today
    if (!alreadyAcknowledged) {
      if (missedYesterday && yesterdayDone === 0) {
        debuffs.push({ id: "no_show",    label: "PENALTY: NO SHOW",  desc: `-${xpPenalty} XP`, color: "#dc2626", icon: "⚠" });
      } else if (missedYesterday && missedCount > 0) {
        debuffs.push({ id: "incomplete", label: "QUESTS INCOMPLETE", desc: `-${xpPenalty} XP`, color: "#f97316", icon: "⚠" });
      }
    }

    // Rank demotion warning
    const demotionWarning = fatigue >= 80;

    return {
      fatigue,
      debuffs,
      todayDone,
      yesterdayDone,
      missedCount,
      xpPenalty,
      streakBroken,
      demotionWarning,
    };
  }, [questState, streak]);
}