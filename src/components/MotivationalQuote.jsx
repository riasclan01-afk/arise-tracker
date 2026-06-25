// components/MotivationalQuote.jsx — SYSTEM REDESIGN, click-to-cycle
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you've ever wanted is on the other side of fear.",
  "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.",
  "I learned that courage was not the absence of fear, but the triumph over it.",
  "There is only one way to avoid criticism: do nothing, say nothing, and be nothing.",
  "Do what you can with all you have, wherever you are.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work, the luckier you get.",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Work hard in silence, let your success be the noise.",
  "The difference between ordinary and extraordinary is that little extra.",
  "Opportunities don't happen. You create them.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Perseverance is not a long race; it is many short races one after the other.",
  "Push yourself, because no one else is going to do it for you.",
  "Sometimes later becomes never. Do it now.",
  "Don't limit your challenges. Challenge your limits.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Strive for progress, not perfection.",
  "The comeback is always stronger than the setback.",
  "Fall seven times, stand up eight.",
  "Every champion was once a contender that refused to give up.",
  "You don't have to be great to start, but you have to start to be great.",
  "A little progress each day adds up to big results.",
  "The body achieves what the mind believes.",
  "Discipline is choosing between what you want now and what you want most.",
  "Motivation gets you started. Habit keeps you going.",
  "Be stronger than your excuses.",
  "The mind is everything. What you think you become.",
  "An investment in knowledge pays the best interest.",
  "The expert in anything was once a beginner.",
  "Study while others are sleeping; work while others are loafing.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "Knowledge is power. Information is liberating.",
  "Learning is a treasure that will follow its owner everywhere.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Consistency is what transforms average into excellence.",
  "If it doesn't challenge you, it won't change you.",
  "You are what you do, not what you say you'll do.",
  "The way to get started is to quit talking and begin doing.",
  "Be so good they can't ignore you.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "The future depends on what you do today.",
  "You miss 100% of the shots you don't take.",
  "I never dreamed about success. I worked for it.",
  "Success seems to be connected with action. Successful people keep moving.",
  "If you really look closely, most overnight successes took a long time.",
];

function randomQuote(exclude = "") {
  let q;
  do { q = QUOTES[Math.floor(Math.random() * QUOTES.length)]; }
  while (q === exclude && QUOTES.length > 1);
  return q;
}

export default function MotivationalQuote() {
  const [quote, setQuote] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setQuote(randomQuote());
  }, []);

  const cycleQuote = () => {
    setVisible(false);
    setTimeout(() => {
      setQuote((prev) => randomQuote(prev));
      setVisible(true);
    }, 180);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={cycleQuote}
      className="card-glow p-4 cursor-pointer group"
      style={{ userSelect: "none" }}
    >
      <div className="flex items-start gap-3">
        {/* Left accent bar */}
        <div style={{
          flexShrink: 0, width: "2px", alignSelf: "stretch", minHeight: "32px",
          background: "linear-gradient(180deg, var(--accent-blue), var(--accent-purple))",
          borderRadius: "1px", opacity: 0.7,
        }} />

        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-blue)", opacity: 0.7, marginBottom: "6px" }}>
            SYSTEM · DAILY DIRECTIVE
          </p>

          <AnimatePresence mode="wait">
            {visible && (
              <motion.p
                key={quote}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, fontStyle: "italic" }}
              >
                "{quote}"
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Refresh hint — only visible on hover */}
        <div style={{
          flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: "11px",
          color: "var(--text-muted)", paddingTop: "2px",
          opacity: 0, transition: "opacity 0.2s",
        }} className="group-hover:opacity-100">
          ↺
        </div>
      </div>
    </motion.div>
  );
}