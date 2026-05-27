import { motion } from "framer-motion";
import { STUDY_PLAN } from "../../data/studyPlan";
import WeekCard from "./WeekCard";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function StudyDashboard({ studyChecked, onToggleStudy }) {
  return (
    <motion.section variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {STUDY_PLAN.map((week) => (
        <motion.div key={week.week} variants={itemVariants}>
          <WeekCard week={week} checkedMap={studyChecked} onToggle={onToggleStudy} />
        </motion.div>
      ))}
    </motion.section>
  );
}
