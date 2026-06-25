// App.jsx
import { AnimatePresence, motion } from "framer-motion";
import { Swords, ScanLine, ShieldCheck, ShieldAlert, Timer } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import TabNav from "./components/TabNav";
import StudyDashboard from "./components/study/StudyDashboard";
import WorkoutDashboard from "./components/workout/WorkoutDashboard";
import JobHuntDashboard from "./components/jobhunt/JobHuntDashboard";
import MBADashboard from "./components/mba/MBADashboard";
import PomodoroTimer from "./components/ui/PomodoroTimer";
import QuestComplete from "./components/ui/QuestComplete";
import ShadowParticleBackground from "./components/ui/ShadowParticleBackground";
import LevelUpScreen from "./components/ui/LevelUpScreen";
import SyncToast from "./components/ui/SyncToast";
import StreakDashboard from "./components/streak/StreakDashboard";
import CharacterStats from "./components/CharacterStats";
import DailyQuests from "./components/DailyQuests";
import PenaltyScreen from "./components/PenaltyScreen";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useFirebaseSync } from "./hooks/useFirebaseSync";
import { usePenalty } from "./hooks/usePenalty";
import { useStats } from "./hooks/useStats";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { haptics } from "./utils/haptics";
import {
  ARISE_STORAGE_KEY,
  buildDefaultState,
  getTodayKey,           // ← ADDED
  getRankFromPercent,
  getStudyCompletedCount,
  getWorkoutCheckKey,
  getWorkoutCompletedForWeek,
  normalizeState,
  totalStudyTasks,
  updateStreak,
} from "./utils/progress";
import { WORKOUT_PLAN } from "./data/workoutPlan";

const tabVariants = {
  enter:  (direction) => ({ x: direction > 0 ?  60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (direction) => ({ x: direction < 0 ?  60 : -60, opacity: 0 }),
};

export default function App() {
  const [storedState, setStoredState] = useLocalStorage(ARISE_STORAGE_KEY, buildDefaultState());
  const state = normalizeState(storedState);
  const { user, isSync, lastSync, isOnline, syncToFirebase, enableSync } = useFirebaseSync(state, setStoredState);

  const [activeTab,           setActiveTab]           = useState("study");
  const [direction,           setDirection]           = useState(1);
  const [questTrigger,        setQuestTrigger]        = useState(0);
  const [showStreakDashboard, setShowStreakDashboard] = useState(false);
  const [showPomodoro,        setShowPomodoro]        = useState(false);
  const [showCharacterStats,  setShowCharacterStats]  = useState(false);
  const [showDailyQuests,     setShowDailyQuests]     = useState(false);
  const [showPenalty,         setShowPenalty]         = useState(false);
  const [showLevelUp,         setShowLevelUp]         = useState(null);
  const [showSyncToast,       setShowSyncToast]       = useState(false);

  const { level } = useStats({
    studyChecked: state.studyChecked,
    workoutChecked: state.workoutChecked,
    streak: state.streak,
    jobs: state.jobs || [],
  });

  const prevLevelRef = useRef(level);
  const prevIsSyncRef = useRef(isSync);

  useEffect(() => {
    if (level > prevLevelRef.current) {
      setShowLevelUp({ prev: prevLevelRef.current, next: level });
      prevLevelRef.current = level;
    }
  }, [level]);

  useEffect(() => {
    if (!isSync && prevIsSyncRef.current) {
      setShowSyncToast(true);
    }
    prevIsSyncRef.current = isSync;
  }, [isSync]);

  useKeyboardShortcuts({
    onTogglePomodoro: () => setShowPomodoro((p) => !p),
    onToggleQuests: () => setShowDailyQuests((p) => !p),
    onToggleCharacter: () => setShowCharacterStats((p) => !p),
    onCloseAll: () => {
      setShowPomodoro(false);
      setShowDailyQuests(false);
      setShowCharacterStats(false);
      setShowPenalty(false);
      setShowStreakDashboard(false);
    },
  });

  const syncTimeoutRef = useRef(null);
  useEffect(() => {
    if (user && isOnline) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => syncToFirebase(state), 1000);
    }
    return () => clearTimeout(syncTimeoutRef.current);
  }, [state, user, isOnline]);

  const touchStartX    = useRef(0);
  const touchStartY    = useRef(0);
  const touchEndX      = useRef(0);
  const touchEndY      = useRef(0);
  const touchStartTime = useRef(0);
  const isSwiping      = useRef(false);

  const getWorkoutChecked = (exerciseId) =>
    Boolean(state.workoutChecked[getWorkoutCheckKey(exerciseId)]);

  const getWorkoutPoints = () => {
    let totalPossible = 0;
    let earned = 0;
    WORKOUT_PLAN.forEach((day) => {
      if (!day.isReserve) {
        const dayTotal          = day.exercises.length;
        totalPossible          += dayTotal;
        const completedNormally = day.exercises.filter((e) => getWorkoutChecked(e.id)).length;
        const madeUp1           = getWorkoutChecked(`res1_${day.id}`);
        const madeUp2           = getWorkoutChecked(`res2_${day.id}`);
        earned += (madeUp1 || madeUp2) ? dayTotal : completedNormally;
      }
    });
    return { earned, totalPossible };
  };

  const studyDone      = getStudyCompletedCount(state.studyChecked);
  const studyPercent   = totalStudyTasks > 0 ? (studyDone / totalStudyTasks) * 100 : 0;
  const workoutStats   = getWorkoutPoints();
  const workoutPercent = workoutStats.totalPossible > 0
    ? (workoutStats.earned / workoutStats.totalPossible) * 100 : 0;
  const overallPercent = ((studyDone + workoutStats.earned) /
    (totalStudyTasks + workoutStats.totalPossible)) * 100;
  const workoutDone    = Math.min(7, getWorkoutCompletedForWeek(state.workoutChecked));
  const rank           = getRankFromPercent(studyPercent);

  const todayKey   = new Date().toISOString().split("T")[0];
  const questState = state.questState || { completed: {}, totalXP: 0, totalGold: 0, fatigue: 0 };
  const todayDone  = (questState.completed?.[todayKey] || []).length;

  const { debuffs, fatigue } = usePenalty({ questState, streak: state.streak });
  const hasPenalties = debuffs.length > 0 && questState.penaltyAcknowledgedDate !== todayKey;

  const ACKNOWLEDGE_RELIEF = 10;

  const handleApplyPenalty = () => {
    if (questState.penaltyAcknowledgedDate === todayKey) return;

    const { missedCount, xpPenalty } = (() => {
      const yesterday     = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const yesterdayDone = (questState?.completed?.[yesterday] || []).length;
      const missed        = Math.max(0, 4 - yesterdayDone);
      return { missedCount: missed, xpPenalty: missed * 50 };
    })();

    const fatigueAfterPenalty = Math.min(100, (questState.fatigue || 0) + missedCount * 10);
    const newXP               = Math.max(0, (questState.totalXP || 0) - xpPenalty);
    const newFatigue          = Math.max(0, fatigueAfterPenalty - ACKNOWLEDGE_RELIEF);

    setStoredState({
      ...state,
      questState: {
        ...questState,
        fatigue:  newFatigue,
        totalXP:  newXP,
        penaltyAcknowledgedDate: todayKey,
      },
    });
  };

  useEffect(() => {
    if (todayDone === 4 && (questState.fatigue || 0) > 0) {
      setStoredState({
        ...state,
        questState: {
          ...questState,
          fatigue: Math.max(0, (questState.fatigue || 0) - 15),
        },
      });
    }
  }, [todayDone]);

  // ── UPDATED toggleStudy: sets studyStartDate on very first tick ──────────
  const toggleStudy = (id) => {
    const next        = { ...state.studyChecked, [id]: !state.studyChecked[id] };
    const didComplete = next[id] && !state.studyChecked[id];
    didComplete ? haptics.success() : haptics.light();

    // Lock in today as the anchor the moment the first checkbox is ever ticked
    const studyStartDate =
      state.studyStartDate
        ? state.studyStartDate
        : didComplete
        ? getTodayKey()
        : null;

    setStoredState({
      ...state,
      studyChecked: next,
      studyNotes: state.studyNotes || {},
      studyStartDate,                                              // ← ADDED
      streak: didComplete ? updateStreak(state.streak) : state.streak,
    });

    if (didComplete) {
      const stamp = Date.now();
      setQuestTrigger(stamp);
      window.setTimeout(() => setQuestTrigger(0), 1500);
    }
  };

  const toggleWorkout = (exerciseId) => {
    const key         = getWorkoutCheckKey(exerciseId);
    const next        = { ...state.workoutChecked, [key]: !state.workoutChecked[key] };
    const didComplete = next[key] && !state.workoutChecked[key];
    didComplete ? haptics.success() : haptics.light();
    setStoredState({ ...state, workoutChecked: next, workoutLogs: state.workoutLogs || {},
      streak: didComplete ? updateStreak(state.streak) : state.streak });
    if (didComplete) {
      const stamp = Date.now();
      setQuestTrigger(stamp);
      window.setTimeout(() => setQuestTrigger(0), 1500);
    }
  };

  const toggleMBA = (questId) => {
    const next        = { ...(state.mbaProgress || {}), [questId]: !(state.mbaProgress || {})[questId] };
    const didComplete = next[questId] && !(state.mbaProgress || {})[questId];
    didComplete ? haptics.success() : haptics.light();
    setStoredState({ ...state, mbaProgress: next });
    if (didComplete) {
      const stamp = Date.now();
      setQuestTrigger(stamp);
      window.setTimeout(() => setQuestTrigger(0), 1500);
    }
  };

  const tabContent = useMemo(() => {
    if (activeTab === "study") {
      return (
        <StudyDashboard
          studyChecked={state.studyChecked}
          studyNotes={state.studyNotes || {}}
          onToggleStudy={toggleStudy}
          onUpdateNote={(id, note) =>
            setStoredState({ ...state, studyNotes: { ...(state.studyNotes || {}), [id]: note } })
          }
          studyStartDate={state.studyStartDate}   // ← ADDED
        />
      );
    } else if (activeTab === "workout") {
      return (
        <WorkoutDashboard
          getWorkoutChecked={getWorkoutChecked}
          onToggleWorkout={toggleWorkout}
          workoutLogs={state.workoutLogs || {}}
          onUpdateLog={(exerciseId, log) =>
            setStoredState({ ...state, workoutLogs: { ...(state.workoutLogs || {}), [exerciseId]: log } })
          }
        />
      );
    } else if (activeTab === "jobs") {
      return (
        <JobHuntDashboard
          jobs={state.jobs || []}
          onUpdateJobs={(jobs) => setStoredState({ ...state, jobs })}
        />
      );
    } else {
      return (
        <MBADashboard
          mbaProgress={state.mbaProgress || {}}
          onToggleQuest={toggleMBA}
        />
      );
    }
  }, [activeTab, state]);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartX.current    = touch.clientX;
    touchStartY.current    = touch.clientY;
    touchEndX.current      = touch.clientX;
    touchEndY.current      = touch.clientY;
    touchStartTime.current = Date.now();
    isSwiping.current      = false;
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    touchEndX.current = touch.clientX;
    touchEndY.current = touch.clientY;
    const dx = Math.abs(touchEndX.current - touchStartX.current);
    const dy = Math.abs(touchEndY.current - touchStartY.current);
    if (dx > 15 && dx > dy * 1.5) isSwiping.current = true;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    const dx       = touchStartX.current - touchEndX.current;
    const dy       = Math.abs(touchStartY.current - touchEndY.current);
    const timeDiff = Date.now() - touchStartTime.current;
    const velocity = Math.abs(dx) / timeDiff;
    const minSwipeDistance = velocity > 0.5 ? 50 : 80;
    if (Math.abs(dx) > minSwipeDistance && Math.abs(dx) > dy * 1.5) {
      haptics.light();
      const tabs         = ["study", "workout", "jobs", "mba"];
      const currentIndex = tabs.indexOf(activeTab);
      if (dx > 0 && currentIndex < tabs.length - 1) {
        setDirection(1);
        setActiveTab(tabs[currentIndex + 1]);
      } else if (dx < 0 && currentIndex > 0) {
        setDirection(-1);
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
    isSwiping.current = false;
  };

  return (
    <div
      className="min-h-screen font-body"
      style={{
        position: "relative", overflowX: "hidden",
        backgroundColor: "#000000", color: "var(--text-primary)",
        touchAction: "pan-y", WebkitOverflowScrolling: "touch",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <QuestComplete trigger={questTrigger} />
      <ShadowParticleBackground />
      <SyncToast show={showSyncToast} onDismiss={() => setShowSyncToast(false)} />
      <LevelUpScreen
        show={Boolean(showLevelUp)}
        prevLevel={showLevelUp?.prev ?? 1}
        nextLevel={showLevelUp?.next ?? 1}
        onDismiss={() => setShowLevelUp(null)}
      />

      {/* ── MODALS ── */}
      <CharacterStats
        open={showCharacterStats}
        onClose={() => setShowCharacterStats(false)}
        studyChecked={state.studyChecked}
        workoutChecked={state.workoutChecked}
        streak={state.streak}
        jobs={state.jobs || []}
        rank={rank}
        questState={questState}
      />

      <DailyQuests
        open={showDailyQuests}
        onClose={() => setShowDailyQuests(false)}
        questState={questState}
        onUpdateQuestState={(newQuestState) =>
          setStoredState({ ...state, questState: newQuestState })
        }
      />

      <PenaltyScreen
        open={showPenalty}
        onClose={() => setShowPenalty(false)}
        questState={questState}
        streak={state.streak}
        rank={rank}
        onApplyPenalty={handleApplyPenalty}
      />

      <AnimatePresence>
        {showStreakDashboard && (
          <StreakDashboard
            streak={state.streak}
            studyChecked={state.studyChecked}
            workoutChecked={state.workoutChecked}
            onClose={() => setShowStreakDashboard(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPomodoro && (
          <PomodoroTimer
            onClose={() => setShowPomodoro(false)}
            sessionsToday={state.pomodoroSessionsToday || 0}
            totalSessions={state.pomodoroTotalSessions || 0}
            onSessionComplete={() => {
              const today   = new Date().toISOString().split("T")[0];
              const isToday = state.pomodoroDate === today;
              setStoredState({
                ...state,
                pomodoroSessionsToday: isToday ? (state.pomodoroSessionsToday || 0) + 1 : 1,
                pomodoroTotalSessions: (state.pomodoroTotalSessions || 0) + 1,
                pomodoroDate: today,
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Pomodoro FAB */}
      <motion.button
        onClick={() => setShowPomodoro(!showPomodoro)}
        className="fixed bottom-6 right-6 w-14 h-14 z-40 flex items-center justify-center text-2xl"
        style={{
          background:   "linear-gradient(135deg, #8b5cf6, #3b82f6)",
          border:       "1px solid rgba(59,130,246,0.4)",
          borderRadius: 0,
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 18 }}
      >
        <Timer size={24} strokeWidth={2} color="#0a0a14" />
      </motion.button>

      <main
        className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-3 pb-8 pt-4 sm:px-4 md:px-6"
        style={{ position: "relative", zIndex: 2 }}
      >
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Header
            overallPercent={overallPercent}
            studyPercent={studyPercent}
            workoutPercent={workoutPercent}
            user={user} isSync={isSync} isOnline={isOnline}
            lastSync={lastSync} onEnableSync={enableSync}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}>
          <StatsBar
            studyDone={studyDone} workoutDone={workoutDone}
            streakCount={state.streak.count} rank={rank}
            onStreakClick={() => setShowStreakDashboard(true)}
          />
        </motion.div>

        {/* ── ACTION BUTTONS ── */}
        <motion.div
          className="grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12 }}
        >
          {/* Daily Quests */}
          <motion.button
            onClick={() => { haptics.light(); setShowDailyQuests(true); }}
            className="relative flex flex-col items-center justify-center gap-1 py-3 font-heading text-xs uppercase tracking-[0.14em] overflow-hidden"
            style={{
              background: "rgba(59,130,246,0.05)",
              border:     "1px solid rgba(59,130,246,0.3)",
              color:      "#3b82f6",
            }}
            whileHover={{ background: "rgba(59,130,246,0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            <Swords size={18} strokeWidth={2} />
            <span>Daily Quests</span>
            <span className="font-mono text-[8px]"
              style={{ color: todayDone === 4 ? "#22c55e" : "rgba(59,130,246,0.5)" }}>
              {todayDone}/4
            </span>
          </motion.button>

          {/* Character */}
          <motion.button
            onClick={() => { haptics.light(); setShowCharacterStats(true); }}
            className="relative flex flex-col items-center justify-center gap-1 py-3 font-heading text-xs uppercase tracking-[0.14em] overflow-hidden"
            style={{
              background: "rgba(59,130,246,0.05)",
              border:     "1px solid rgba(59,130,246,0.3)",
              color:      "#3b82f6",
            }}
            whileHover={{ background: "rgba(59,130,246,0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            <ScanLine size={18} strokeWidth={2} />
            <span>Character</span>
            <span className="font-mono text-[8px]" style={{ color: "rgba(59,130,246,0.4)" }}>
              STATUS
            </span>
          </motion.button>

          {/* Penalty */}
          <motion.button
            onClick={() => { haptics.light(); setShowPenalty(true); }}
            className="relative flex flex-col items-center justify-center gap-1 py-3 font-heading text-xs uppercase tracking-[0.14em] overflow-hidden"
            style={{
              background: hasPenalties ? "rgba(220,38,38,0.08)" : "rgba(59,130,246,0.05)",
              border:     hasPenalties ? "1px solid rgba(220,38,38,0.45)" : "1px solid rgba(59,130,246,0.3)",
              color:      hasPenalties ? "#dc2626" : "#3b82f6",
            }}
            whileHover={{ background: hasPenalties ? "rgba(220,38,38,0.15)" : "rgba(59,130,246,0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            {hasPenalties && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ border: "1px solid rgba(220,38,38,0.5)" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            {hasPenalties
              ? <ShieldAlert size={18} strokeWidth={2} color="#dc2626" />
              : <ShieldCheck size={18} strokeWidth={2} />}
            <span>Penalty</span>
            <span className="font-mono text-[8px]"
              style={{ color: hasPenalties ? "#dc2626" : "rgba(59,130,246,0.4)" }}>
              {hasPenalties ? `${debuffs.length} ACTIVE` : "CLEAR"}
            </span>
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.16 }}>
          <TabNav
            activeTab={activeTab}
            onChange={(tab) => {
              haptics.light();
              setDirection(
                tab === "study"   ? -1 :
                tab === "workout" ? (activeTab === "study" ? 1 : -1) : 1
              );
              setActiveTab(tab);
            }}
          />
        </motion.div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {tabContent}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}