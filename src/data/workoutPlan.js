export const WORKOUT_PLAN = [
  {
    id: "chest1",
    dayLabel: "Day 1",
    name: "Chest — Heavy",
    weekDay: "Monday",
    icon: "chest",
    accentColor: "#ff1744",
    exercises: [
      { id: "c1e1", name: "Barbell Bench Press", sets: "4", reps: "6–8", note: "Focus on chest stretch at bottom" },
      { id: "c1e2", name: "Incline Dumbbell Press", sets: "3", reps: "8–10", note: "30–45° incline" },
      { id: "c1e3", name: "Cable Fly (low to high)", sets: "3", reps: "12–15", note: "Squeeze at top" },
      { id: "c1e4", name: "Push-ups to failure", sets: "2", reps: "Failure", note: "Slow eccentric" },
      { id: "c1e5", name: "Dips (chest focused)", sets: "3", reps: "10–12", note: "Lean forward slightly" }
    ]
  },
  {
    id: "back1",
    dayLabel: "Day 2",
    name: "Back — Pull",
    weekDay: "Tuesday",
    icon: "back",
    accentColor: "#4fc3f7",
    exercises: [
      { id: "b1e1", name: "Deadlift", sets: "4", reps: "5–6", note: "Keep spine neutral" },
      { id: "b1e2", name: "Pull-ups / Lat Pulldown", sets: "4", reps: "8–10", note: "Full stretch at top" },
      { id: "b1e3", name: "Barbell Row", sets: "3", reps: "8–10", note: "Drive elbows back" },
      { id: "b1e4", name: "Seated Cable Row", sets: "3", reps: "12", note: "Squeeze scapula" },
      { id: "b1e5", name: "Face Pulls", sets: "3", reps: "15–20", note: "Rear delt + rotator cuff health" }
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
      { id: "a1e1", name: "Overhead Press (Barbell/DB)", sets: "4", reps: "8–10", note: "Core tight, no arch" },
      { id: "a1e2", name: "Lateral Raises", sets: "4", reps: "15–20", note: "Slight forward tilt" },
      { id: "a1e3", name: "Barbell Curl", sets: "3", reps: "10–12", note: "Full supination at top" },
      { id: "a1e4", name: "Hammer Curl", sets: "3", reps: "12", note: "Brachialis focus" },
      { id: "a1e5", name: "Tricep Pushdown", sets: "3", reps: "12–15", note: "Elbows locked at sides" },
      { id: "a1e6", name: "Overhead Tricep Extension", sets: "3", reps: "12", note: "Long head stretch" }
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
      { id: "l1e1", name: "Barbell Squat", sets: "4", reps: "6–8", note: "Below parallel, drive knees out" },
      { id: "l1e2", name: "Romanian Deadlift", sets: "3", reps: "10–12", note: "Hamstring stretch focus" },
      { id: "l1e3", name: "Leg Press", sets: "3", reps: "12–15", note: "High foot placement for hamstrings" },
      { id: "l1e4", name: "Leg Curl (seated or lying)", sets: "3", reps: "12–15", note: "Slow eccentric" },
      { id: "l1e5", name: "Calf Raises", sets: "4", reps: "20–25", note: "Full stretch at bottom" },
      { id: "l1e6", name: "Leg Extension", sets: "3", reps: "15", note: "Quad finisher" }
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
      { id: "bi1e1", name: "Incline Dumbbell Curl", sets: "4", reps: "10–12", note: "Maximum stretch position" },
      { id: "bi1e2", name: "Concentration Curl", sets: "3", reps: "12–15", note: "Mind-muscle connection" },
      { id: "bi1e3", name: "Cable Curl (low pulley)", sets: "3", reps: "15", note: "Constant tension" },
      { id: "bi1e4", name: "21s Barbell Curl", sets: "3", reps: "21", note: "7 bottom + 7 top + 7 full" },
      { id: "bi1e5", name: "20 min incline treadmill walk", sets: "1", reps: "20 min", note: "Active recovery" }
    ]
  },
  {
    id: "chest2",
    dayLabel: "Day 6",
    name: "Chest — Volume",
    weekDay: "Saturday",
    icon: "chest",
    accentColor: "#ff1744",
    exercises: [
      { id: "c2e1", name: "Incline Barbell Press", sets: "4", reps: "10–12", note: "Upper chest emphasis" },
      { id: "c2e2", name: "Flat Dumbbell Press", sets: "3", reps: "12–15", note: "More range of motion than barbell" },
      { id: "c2e3", name: "Pec Deck / Machine Fly", sets: "3", reps: "15", note: "Isolation, squeeze hard" },
      { id: "c2e4", name: "Cable Crossover", sets: "3", reps: "15–20", note: "All three angles" },
      { id: "c2e5", name: "Push-ups superset Dips", sets: "3", reps: "Failure each", note: "Burnout finisher" }
    ]
  },
  {
    id: "back2",
    dayLabel: "Day 7",
    name: "Back — Width + Thickness",
    weekDay: "Sunday",
    icon: "back",
    accentColor: "#4fc3f7",
    exercises: [
      { id: "b2e1", name: "Wide Grip Pull-ups", sets: "4", reps: "8–10", note: "Lat width focus" },
      { id: "b2e2", name: "Single Arm DB Row", sets: "3", reps: "10–12 each", note: "Full range, no hip rotation" },
      { id: "b2e3", name: "T-Bar Row", sets: "3", reps: "10", note: "Thickness builder" },
      { id: "b2e4", name: "Straight Arm Pulldown", sets: "3", reps: "15", note: "Lat isolation" },
      { id: "b2e5", name: "Shrugs", sets: "3", reps: "15–20", note: "Trap development" }
    ]
  }
];
