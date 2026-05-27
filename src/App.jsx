import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import TabNav from "./components/TabNav";
import StudyDashboard from "./components/study/StudyDashboard";
import WorkoutDashboard from "./components/workout/WorkoutDashboard";
import QuestComplete from "./components/ui/QuestComplete";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  ARISE_STORAGE_KEY,
  buildDefaultState,
  getRankFromPercent,
  getStudyCompletedCount,
  getWorkoutCheckKey,
  getWorkoutCompletedForWeek,
  normalizeState,
  totalStudyTasks,
  updateStreak,
} from "./utils/progress";

const tabVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

export default function App() {
  const [storedState, setStoredState] = useLocalStorage(ARISE_STORAGE_KEY, buildDefaultState());
  const state = normalizeState(storedState);
  const [activeTab, setActiveTab] = useState("study");
  const [direction, setDirection] = useState(1);
  const [questTrigger, setQuestTrigger] = useState(0);

  const studyDone = getStudyCompletedCount(state.studyChecked);
  const studyPercent = (studyDone / totalStudyTasks) * 100;
  const workoutDone = Math.min(7, getWorkoutCompletedForWeek(state.workoutChecked));
  const overallPercent = ((studyDone + workoutDone) / (totalStudyTasks + 7)) * 100;
  const rank = getRankFromPercent(studyPercent);

  const getWorkoutChecked = (exerciseId) => Boolean(state.workoutChecked[getWorkoutCheckKey(exerciseId)]);

  const toggleStudy = (id) => {
    const next = { ...state.studyChecked, [id]: !state.studyChecked[id] };
    const didComplete = next[id] && !state.studyChecked[id];
    setStoredState({
      ...state,
      studyChecked: next,
      streak: didComplete ? updateStreak(state.streak) : state.streak,
    });
    if (didComplete) {
      const stamp = Date.now();
      setQuestTrigger(stamp);
      window.setTimeout(() => setQuestTrigger(0), 1500);
    }
  };

  const toggleWorkout = (exerciseId) => {
    const key = getWorkoutCheckKey(exerciseId);
    const next = { ...state.workoutChecked, [key]: !state.workoutChecked[key] };
    const didComplete = next[key] && !state.workoutChecked[key];
    setStoredState({
      ...state,
      workoutChecked: next,
      streak: didComplete ? updateStreak(state.streak) : state.streak,
    });
    if (didComplete) {
      const stamp = Date.now();
      setQuestTrigger(stamp);
      window.setTimeout(() => setQuestTrigger(0), 1500);
    }
  };

  const tabContent = useMemo(
    () =>
      activeTab === "study" ? (
        <StudyDashboard studyChecked={state.studyChecked} onToggleStudy={toggleStudy} />
      ) : (
        <WorkoutDashboard getWorkoutChecked={getWorkoutChecked} onToggleWorkout={toggleWorkout} />
      ),
    [activeTab, state.studyChecked, state.workoutChecked]
  );

  return (
    <div className="min-h-screen bg-bgPrimary font-body text-textPrimary">
      <QuestComplete trigger={questTrigger} />
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-3 pb-8 pt-4 sm:px-4 md:px-6">
        <Header completionPercent={overallPercent} />
        <StatsBar studyDone={studyDone} workoutDone={workoutDone} streakCount={state.streak.count} rank={rank} />
        <TabNav
          activeTab={activeTab}
          onChange={(tab) => {
            setDirection(tab === "study" ? -1 : 1);
            setActiveTab(tab);
          }}
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {tabContent}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
