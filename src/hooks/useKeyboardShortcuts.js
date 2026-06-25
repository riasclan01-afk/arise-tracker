import { useEffect } from "react";

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
}

export function useKeyboardShortcuts({
  onTogglePomodoro,
  onToggleQuests,
  onToggleCharacter,
  onCloseAll,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTypingTarget(e.target)) return;

      const key = e.key.toLowerCase();

      if (key === "escape") {
        e.preventDefault();
        onCloseAll?.();
        return;
      }

      if (key === "p") {
        e.preventDefault();
        onTogglePomodoro?.();
        return;
      }

      if (key === "q") {
        e.preventDefault();
        onToggleQuests?.();
        return;
      }

      if (key === "c") {
        e.preventDefault();
        onToggleCharacter?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTogglePomodoro, onToggleQuests, onToggleCharacter, onCloseAll]);
}
