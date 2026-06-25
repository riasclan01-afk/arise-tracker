// utils/progress.js
import { STUDY_PLAN } from "../data/studyPlan";

export const ARISE_STORAGE_KEY = "arise_state";

export const getTodayKey = (date = new Date()) => date.toISOString().slice(0, 10);

export const getIsoWeekKey = (date = new Date()) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

export const getWorkoutCheckKey = (exerciseId, date = new Date()) =>
  `${getIsoWeekKey(date)}-${exerciseId}`;

export const totalStudyTasks = STUDY_PLAN.reduce((sum, week) => sum + week.days.length, 0);

export const getStudyCompletedCount = (studyChecked = {}) =>
  Object.values(studyChecked).filter(Boolean).length;

export const getWorkoutCompletedForWeek = (workoutChecked = {}, date = new Date()) => {
  const isoWeek = getIsoWeekKey(date);
  return Object.entries(workoutChecked).filter(([key, done]) => done && key.startsWith(`${isoWeek}-`)).length;
};

export const getRankFromPercent = (percent) => {
  if (percent >= 95) return { label: "S RANK", color: "text-[#ff8a80] glow-blue" };
  if (percent >= 80) return { label: "A RANK", color: "text-accentBlue glow-blue" };
  if (percent >= 60) return { label: "B RANK", color: "text-accentPurple glow-purple" };
  if (percent >= 40) return { label: "C RANK", color: "text-accentBlue glow-blue" };
  if (percent >= 20) return { label: "D RANK", color: "text-success" };
  return { label: "E RANK", color: "text-slate-400" };
};

// ─── ROLLING WEEK HELPERS ────────────────────────────────────────────────────

export const getCurrentWeekIndex = (studyStartDate, today = new Date()) => {
  const start = new Date(studyStartDate + "T00:00:00");
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffMs = todayMidnight - start;
  if (diffMs < 0) return 0;
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
};

export const getDatesForWeek = (studyStartDate, weekIndex) => {
  const start = new Date(studyStartDate + "T00:00:00");
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + weekIndex * 7 + i);
    return d;
  });
};

export const getDayLabel = (date) =>
  date.toLocaleDateString("en-US", { weekday: "short" });

export const getMsUntilNextWeek = (studyStartDate, today = new Date()) => {
  const start = new Date(studyStartDate + "T00:00:00");
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.floor((todayMidnight - start) / (24 * 60 * 60 * 1000));
  const daysIntoCurrentWeek = diffDays % 7;
  const daysUntilNextWeek = 7 - daysIntoCurrentWeek;
  const nextWeekStart = new Date(todayMidnight);
  nextWeekStart.setDate(todayMidnight.getDate() + daysUntilNextWeek);
  return nextWeekStart - today;
};

// ─── STATE ───────────────────────────────────────────────────────────────────

export const buildDefaultState = () => {
  const now = getTodayKey();
  return {
    studyChecked: {},
    studyNotes: {},
    workoutChecked: {},
    workoutLogs: {},
    jobs: [],
    pomodoroSessionsToday: 0,
    pomodoroTotalSessions: 0,
    pomodoroDate: now,
    streak: { lastDate: "", count: 0 },
    startDate: now,
    studyStartDate: now,   // ← THIS sets today as start date automatically
  };
};

export const normalizeState = (state) => {
  const defaults = buildDefaultState();
  const today = getTodayKey();
  return {
    ...defaults,
    ...state,
    studyChecked: state?.studyChecked ?? {},
    studyNotes: state?.studyNotes ?? {},
    workoutChecked: state?.workoutChecked ?? {},
    workoutLogs: state?.workoutLogs ?? {},
    jobs: state?.jobs ?? [],
    pomodoroSessionsToday: state?.pomodoroSessionsToday ?? 0,
    pomodoroTotalSessions: state?.pomodoroTotalSessions ?? 0,
    pomodoroDate: state?.pomodoroDate ?? defaults.pomodoroDate,
    // ← Always falls back to today if missing or null
    studyStartDate: state?.studyStartDate ?? today,
    streak: {
      lastDate: state?.streak?.lastDate ?? "",
      count: state?.streak?.count ?? 0,
    },
    startDate: state?.startDate ?? defaults.startDate,
  };
};

export const updateStreak = (previous, date = new Date()) => {
  const today = getTodayKey(date);
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  const yesterdayKey = getTodayKey(yesterday);
  const lastDate = previous?.lastDate ?? "";
  const count = previous?.count ?? 0;
  if (lastDate === today) return previous;
  if (!lastDate) return { lastDate: today, count: 1 };
  if (lastDate === yesterdayKey) return { lastDate: today, count: count + 1 };
  return { lastDate: today, count: 1 };
};