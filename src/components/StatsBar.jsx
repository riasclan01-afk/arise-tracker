import StatCard from "./ui/StatCard";

export default function StatsBar({ studyDone, workoutDone, streakCount, rank }) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard title="Study Progress" value={`${studyDone} / 56`} valueClassName="text-accentBlue glow-blue" />
      <StatCard title="Workout Progress" value={`${workoutDone} / 7`} valueClassName="text-accentTeal" subtext="days this week" />
      <StatCard title="Current Streak" value={`${streakCount} days`} valueClassName="text-accentGold glow-gold" />
      <StatCard title="Rank" value={rank.label} valueClassName={rank.color} />
    </section>
  );
}
