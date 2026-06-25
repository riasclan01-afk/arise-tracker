import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function SyncToast({ show, onDismiss }) {
  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(onDismiss, 2000);
    return () => clearTimeout(t);
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed top-4 right-4 z-[9997] px-4 py-3"
          style={{
            border: "1px solid rgba(59,130,246,0.5)",
            background: "rgba(10,10,20,0.95)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          initial={{ opacity: 0, x: 80, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <span
            className="font-mono text-xs tracking-[0.2em]"
            style={{ color: "#3b82f6", textShadow: "0 0 12px rgba(59,130,246,0.5)" }}
          >
            SYSTEM SYNCED
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
