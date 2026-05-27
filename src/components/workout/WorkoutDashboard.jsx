import { motion } from "framer-motion";
import { WORKOUT_PLAN } from "../../data/workoutPlan";
import DayCard from "./DayCard";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function WorkoutDashboard({ getWorkoutChecked, onToggleWorkout }) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {WORKOUT_PLAN.map((day) => (
        <motion.div key={day.id} variants={itemVariants}>
          <DayCard day={day} getChecked={getWorkoutChecked} onToggle={onToggleWorkout} />
        </motion.div>
      ))}
    </motion.section>
  );
}
