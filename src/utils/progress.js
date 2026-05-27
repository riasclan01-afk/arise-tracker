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
  if (percent >= 95) return { label: "S RANK", color: "text-[#ff8a80] glow-gold" };
  if (percent >= 80) return { label: "A RANK", color: "text-accentGold glow-gold" };
  if (percent >= 60) return { label: "B RANK", color: "text-accentPurple glow-purple" };
  if (percent >= 40) return { label: "C RANK", color: "text-accentBlue glow-blue" };
  if (percent >= 20) return { label: "D RANK", color: "text-success" };
  return { label: "E RANK", color: "text-slate-400" };
};

export const buildDefaultState = () => ({
  studyChecked: {},
  workoutChecked: {},
  streak: { lastDate: "", count: 0 },
  startDate: getTodayKey(),
});

export const normalizeState = (state) => ({
  ...buildDefaultState(),
  ...state,
  studyChecked: state?.studyChecked ?? {},
  workoutChecked: state?.workoutChecked ?? {},
  streak: {
    lastDate: state?.streak?.lastDate ?? "",
    count: state?.streak?.count ?? 0,
  },
});

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
