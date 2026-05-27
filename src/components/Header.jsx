import { Activity } from "lucide-react";

export default function Header({ completionPercent }) {
  const now = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "short", day: "numeric" });

  return (
    <header className="card-glow hex-clip rounded-xl bg-bgCard p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="glow-blue font-heading text-4xl uppercase tracking-[0.14em] text-accentBlue sm:text-5xl">ARISE</h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-textSecondary">HUNTER PROTOCOL - KARAN</p>
          <p className="mt-3 font-body text-sm text-textSecondary">{now}</p>
        </div>
        <div className="text-right">
          <p className="font-body text-xs uppercase tracking-[0.12em] text-textSecondary">Overall Completion</p>
          <p className="glow-blue font-mono text-3xl text-textPrimary">{Math.round(completionPercent)}%</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(0,230,118,0.4)] bg-[rgba(0,230,118,0.08)] px-3 py-1">
            <Activity size={13} className="animate-pulse text-success" />
            <span className="font-mono text-xs tracking-[0.12em] text-success">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
