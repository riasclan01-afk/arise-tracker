// utils/achievements.js — Achievement definitions and logic
export const ACHIEVEMENTS = [
  {
    id: "first_task",
    title: "First Step",
    description: "Complete your first study task",
    icon: "⭐",
    xp: 10,
    condition: (s) => s.studyTasks >= 1,
  },
  {
    id: "shadow_emerges",
    title: "Shadow Emerges",
    description: "Complete your first workout session",
    icon: "🌑",
    xp: 15,
    condition: (s) => s.workoutSessions >= 1,
  },
  {
    id: "three_day",
    title: "Three Day Hunter",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    xp: 25,
    condition: (s) => s.streak >= 3,
  },
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "⚔️",
    xp: 50,
    condition: (s) => s.streak >= 7,
  },
  {
    id: "double_week",
    title: "Fortnight Hunter",
    description: "Maintain a 14-day streak",
    icon: "🗡️",
    xp: 100,
    condition: (s) => s.streak >= 14,
  },
  {
    id: "month_legend",
    title: "Month Legend",
    description: "Maintain a 30-day streak",
    icon: "👑",
    xp: 200,
    condition: (s) => s.streak >= 30,
  },
  {
    id: "ten_tasks",
    title: "Apprentice Scholar",
    description: "Complete 10 study tasks",
    icon: "📖",
    xp: 30,
    condition: (s) => s.studyTasks >= 10,
  },
  {
    id: "study_master",
    title: "Study Master",
    description: "Complete 50 study tasks",
    icon: "📚",
    xp: 100,
    condition: (s) => s.studyTasks >= 50,
  },
  {
    id: "shadow_scholar",
    title: "Shadow Scholar",
    description: "Complete all 63 study tasks",
    icon: "🏛️",
    xp: 300,
    condition: (s) => s.studyTasks >= 63,
  },
  {
    id: "first_workout",
    title: "Iron Will",
    description: "Complete 5 workout sessions",
    icon: "💪",
    xp: 40,
    condition: (s) => s.workoutSessions >= 5,
  },
  {
    id: "workout_beast",
    title: "Workout Beast",
    description: "Complete 30 workout sessions",
    icon: "🦾",
    xp: 100,
    condition: (s) => s.workoutSessions >= 30,
  },
  {
    id: "job_hunter",
    title: "Job Hunter",
    description: "Add 5 job applications",
    icon: "🎯",
    xp: 35,
    condition: (s) => s.jobCount >= 5,
  },
  {
    id: "networking",
    title: "Shadow Network",
    description: "Add 10 job applications",
    icon: "🕸️",
    xp: 60,
    condition: (s) => s.jobCount >= 10,
  },
  {
    id: "pomodoro_novice",
    title: "Focus Initiate",
    description: "Complete 5 Pomodoro sessions",
    icon: "⏱️",
    xp: 20,
    condition: (s) => s.pomodoroTotal >= 5,
  },
  {
    id: "pomodoro_master",
    title: "Pomodoro King",
    description: "Complete 50 Pomodoro sessions",
    icon: "⌛",
    xp: 80,
    condition: (s) => s.pomodoroTotal >= 50,
  },
  {
    id: "century_club",
    title: "Century Club",
    description: "Complete 100 total tasks",
    icon: "🏆",
    xp: 150,
    condition: (s) => s.totalTasks >= 100,
  },
  {
    id: "quest_completionist",
    title: "Quest Master",
    description: "Complete 20 daily quests",
    icon: "📜",
    xp: 70,
    condition: (s) => s.questsCompleted >= 20,
  },
  {
    id: "mba_start",
    title: "Aspirant",
    description: "Complete your first MBA quest",
    icon: "🎓",
    xp: 20,
    condition: (s) => s.mbaQuests >= 1,
  },
];

/**
 * Given a stats object, returns array of achievement IDs that are currently unlocked.
 * stats: { studyTasks, workoutSessions, streak, totalTasks, jobCount, pomodoroTotal, questsCompleted, mbaQuests }
 */
export function getUnlockedIds(stats) {
  return ACHIEVEMENTS.filter((a) => a.condition(stats)).map((a) => a.id);
}

/**
 * Returns newly unlocked achievement objects by comparing previous and current states.
 */
export function getNewlyUnlocked(prevIds = [], currentStats) {
  const currentIds = new Set(getUnlockedIds(currentStats));
  return ACHIEVEMENTS.filter((a) => currentIds.has(a.id) && !prevIds.includes(a.id));
}

export function buildStatsForAchievements({ studyChecked, workoutChecked, streak, jobs, pomodoroTotal, questState, mbaProgress }) {
  const studyTasks = Object.values(studyChecked || {}).filter(Boolean).length;
  const workoutSessions = Object.values(workoutChecked || {}).filter(Boolean).length;
  const mbaQuests = Object.values(mbaProgress || {}).filter(Boolean).length;
  const questsCompleted = Object.values(questState?.completed || {}).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0
  );
  return {
    studyTasks,
    workoutSessions,
    streak: streak?.count || 0,
    totalTasks: studyTasks + workoutSessions,
    jobCount: (jobs || []).length,
    pomodoroTotal: pomodoroTotal || 0,
    questsCompleted,
    mbaQuests,
  };
}

export function calculateLevel(xp) {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progress = xpNeededForNextLevel > 0 ? (xpInCurrentLevel / xpNeededForNextLevel) * 100 : 0;
  return { level, xp, xpForNext: xpForNextLevel, xpInLevel: xpInCurrentLevel, xpNeeded: xpNeededForNextLevel, progress };
}
