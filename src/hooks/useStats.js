// src/hooks/useStats.js
import { useMemo } from "react";
import { WORKOUT_PLAN } from "../data/workoutPlan";
import { totalStudyTasks } from "../utils/progress";

function clamp(val, min = 0, max = 100) {
  return Math.min(max, Math.max(min, val));
}

export function useStats({ studyChecked, workoutChecked, streak, jobs }) {
  return useMemo(() => {
    // INT — study completion %
    const studyDone = Object.values(studyChecked || {}).filter(Boolean).length;
    const INT = clamp(Math.round((studyDone / Math.max(totalStudyTasks, 1)) * 100));

    // STR — workout completion %
    let totalWorkout = 0;
    let workoutDone  = 0;
    WORKOUT_PLAN.forEach((day) => {
      if (!day.isReserve) {
        day.exercises.forEach((ex) => {
          totalWorkout++;
          const key = `${ex.id}_checked`;
          if (workoutChecked?.[key]) workoutDone++;
        });
      }
    });
    const STR = clamp(Math.round((workoutDone / Math.max(totalWorkout, 1)) * 100));

    // AGI — streak consistency (30 days = 100)
    const AGI = clamp(Math.round(((streak?.count || 0) / 30) * 100));

    // VIT — average of study + workout
    const VIT = clamp(Math.round((INT + STR) / 2));

    // SEN — job hunt activity
    const jobTotal  = (jobs || []).length;
    const jobActive = (jobs || []).filter((j) => j.status && j.status !== "rejected").length;
    const SEN = clamp(Math.round((jobActive / Math.max(jobTotal, 1)) * 100));

    const level = Math.max(1, Math.floor(VIT / 2) + 1);
    const HP    = 1000 + STR * 50 + VIT * 30;
    const MP    = 500  + INT * 40 + SEN * 20;

    return { STR, INT, AGI, VIT, SEN, level, HP, MP };
  }, [studyChecked, workoutChecked, streak, jobs]);
}