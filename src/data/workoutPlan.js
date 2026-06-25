export const WORKOUT_PLAN = [
  {
    id: "chest",
    dayLabel: "Day 1",
    name: "Chest + Triceps",
    weekDay: "Monday",
    icon: "chest",
    accentColor: "#ff1744",
    exercises: [
      { id: "ch_e1", name: "Incline Dumbbell Press", sets: "4", reps: "8–10", note: "Bench at 30–45° incline" },
      { id: "ch_e2", name: "Flat Dumbbell Press", sets: "3", reps: "8–12", note: "Lie flat on bench, control the negative" },
      { id: "ch_e3", name: "Cable Fly (High to Low)", sets: "2", reps: "12–15", note: "Targets lower chest, squeeze at bottom" },
      { id: "ch_e4", name: "Cable Fly (Low to High)", sets: "2", reps: "12–15", note: "Targets upper chest, constant tension" },
      { id: "ch_e5", name: "Parallel Bar Dips (Leaning)", sets: "3", reps: "AMRAP", note: "Lean forward to target lower chest" },
      { id: "ch_e6", name: "Standing Tricep Cable Pushdown", sets: "3", reps: "12–15", note: "Standing, elbows locked at sides" },
      { id: "ch_e7", name: "Seated Overhead DB Extension", sets: "3", reps: "10-12", note: "Seated on bench, stretch the long head" },
      { id: "ch_e8", name: "30 min elliptical", sets: "1", reps: "30 min", note: "Active recovery & Fat burn" }
    ]
  },
  {
    id: "back",
    dayLabel: "Day 2",
    name: "Back — Full",
    weekDay: "Tuesday",
    icon: "back",
    accentColor: "#4fc3f7",
    exercises: [
      { id: "bk_e1", name: "Lat Pulldown (Wide Grip)", sets: "3", reps: "8–10", note: "Seated on ground, full stretch" },
      { id: "bk_e2", name: "Lat Pulldown (Inner Hold)", sets: "3", reps: "8–10", note: "Seated on ground, close neutral grip" },
      { id: "bk_e3", name: "Lat Pulldown (Reverse Grip Inner)", sets: "3", reps: "8–10", note: "Seated on ground, underhand close grip" },
      { id: "bk_e4", name: "Cable Row", sets: "3", reps: "10-12", note: "Seated on ground, squeeze scapula" },
      { id: "bk_e5", name: "Single Arm DB Row", sets: "3", reps: "10–12 each", note: "Knee and hand braced on bench" },
      { id: "bk_e6", name: "Straight Arm Cable Pulldown", sets: "3", reps: "12-15", note: "Standing, lat isolation, slight hinge" },
      { id: "bk_e7", name: "Standing Face Pulls", sets: "3", reps: "15–20", note: "Rear delt + rotator cuff health" },
      { id: "bk_e8", name: "Standing DB Shrugs", sets: "3", reps: "15", note: "Trap development, pause at top" },
      { id: "bk_e9", name: "30 min elliptical", sets: "1", reps: "30 min", note: "Active recovery & Fat burn" }
    ]
  },
  {
    id: "arms",
    dayLabel: "Day 3",
    name: "Arms + Shoulders",
    weekDay: "Wednesday",
    icon: "arms",
    accentColor: "#7c4dff",
    exercises: [
      { id: "ar_e1", name: "Seated DB Overhead Press", sets: "4", reps: "8–10", note: "Seated on bench (back straight up), core tight" },
      { id: "ar_e2", name: "Standing Lateral Raises", sets: "4", reps: "15–20", note: "Slight forward tilt, lead with elbows" },
      { id: "ar_e3", name: "Parallel Bar Dips (Upright)", sets: "3", reps: "AMRAP", note: "Torso straight up, targets front delts & triceps" },
      { id: "ar_e4", name: "Seated DB Bicep Curl", sets: "3", reps: "10–12", note: "Seated on bench, full supination at top" },
      { id: "ar_e5", name: "Standing DB Hammer Curl", sets: "3", reps: "12", note: "Brachialis focus, neutral grip" },
      { id: "ar_e6", name: "30 min elliptical", sets: "1", reps: "30 min", note: "Active recovery & Fat burn" }
    ]
  },
  {
    id: "legs",
    dayLabel: "Day 4",
    name: "Leg Day",
    weekDay: "Thursday",
    icon: "legs",
    accentColor: "#ffd700",
    exercises: [
      { id: "lg_e1", name: "Dumbbell Goblet Squat", sets: "4", reps: "8–12", note: "Standing, keep chest up" },
      { id: "lg_e2", name: "Dumbbell Romanian Deadlift", sets: "4", reps: "10–12", note: "Standing, hamstring stretch focus" },
      { id: "lg_e3", name: "Bulgarian Split Squats", sets: "3", reps: "8-10 each", note: "Rest back foot on the bench, brutal for quads" },
      { id: "lg_e4", name: "Dumbbell Lying Leg Curl", sets: "3", reps: "12–15", note: "Lie on stomach on the floor, hold DB between feet" },
      { id: "lg_e5", name: "Standing DB Calf Raises", sets: "4", reps: "20–25", note: "Hold DBs, use a plate under toes if possible" },
      { id: "lg_e6", name: "30 min elliptical", sets: "1", reps: "30 min", note: "Active recovery & Fat burn" }
    ]
  },
  {
    id: "biceps",
    dayLabel: "Day 5",
    name: "Biceps + Light Cardio",
    weekDay: "Friday",
    icon: "biceps",
    accentColor: "#00e5cc",
    exercises: [
      { id: "bi_e1", name: "Incline Dumbbell Curl", sets: "4", reps: "10–12", note: "Bench at 45°, maximum stretch on biceps" },
      { id: "bi_e2", name: "Concentration Curl", sets: "3", reps: "12–15", note: "Seated on bench, elbow locked inside thigh" },
      { id: "bi_e3", name: "Standing Cable Curl (low pulley)", sets: "3", reps: "15", note: "Constant tension, squeeze at top" },
      { id: "bi_e4", name: "Cable Wrist Curls (small bar)", sets: "3", reps: "15–20", note: "Standing/kneeling, forearm flexors" },
      { id: "bi_e5", name: "Cable Reverse Wrist Curls", sets: "3", reps: "15–20", note: "Standing/kneeling, knuckles up" },
      { id: "bi_e6", name: "30 min elliptical", sets: "1", reps: "30 min", note: "Active recovery & Fat burn" }
    ]
  },
  {
    id: "reserve1",
    dayLabel: "Day 6",
    name: "Reserve / Rest",
    weekDay: "Saturday",
    isReserve: true,
    accentColor: "#546e7a",
    reserveOptions: [
      { id: "res1_chest", name: "Chest + Triceps", color: "#ff1744" },
      { id: "res1_back", name: "Back — Full", color: "#4fc3f7" },
      { id: "res1_arms", name: "Arms + Shoulders", color: "#7c4dff" },
      { id: "res1_legs", name: "Leg Day", color: "#ffd700" },
      { id: "res1_rest", name: "Rest Day ✦", color: "#00e676" }
    ]
  },
  {
    id: "reserve2",
    dayLabel: "Day 7",
    name: "Reserve / Rest",
    weekDay: "Sunday",
    isReserve: true,
    accentColor: "#546e7a",
    reserveOptions: [
      { id: "res2_chest", name: "Chest + Triceps", color: "#ff1744" },
      { id: "res2_back", name: "Back — Full", color: "#4fc3f7" },
      { id: "res2_arms", name: "Arms + Shoulders", color: "#7c4dff" },
      { id: "res2_legs", name: "Leg Day", color: "#ffd700" },
      { id: "res2_rest", name: "Rest Day ✦", color: "#00e676" }
    ]
  }
];