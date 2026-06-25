// useSoundEffects.js — Web Audio API sound effects
import { useCallback, useRef } from "react";

let sharedCtx = null;

function getCtx() {
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume suspended context (browsers suspend until user gesture)
  if (sharedCtx.state === "suspended") sharedCtx.resume();
  return sharedCtx;
}

function tone(ctx, freq, start, dur, type = "sine", vol = 0.22) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(freq, start);
  osc.type = type;
  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.start(start);
  osc.stop(start + dur + 0.01);
}

export function useSoundEffects(enabled = true) {
  const play = useCallback(
    (fn) => {
      if (!enabled) return;
      try { fn(getCtx()); } catch (_) {}
    },
    [enabled]
  );

  const success = useCallback(() => {
    play((ctx) => {
      const t = ctx.currentTime;
      tone(ctx, 523.25, t,        0.08);
      tone(ctx, 659.25, t + 0.09, 0.08);
      tone(ctx, 783.99, t + 0.18, 0.18);
    });
  }, [play]);

  const click = useCallback(() => {
    play((ctx) => {
      tone(ctx, 880, ctx.currentTime, 0.04, "square", 0.08);
    });
  }, [play]);

  const levelUp = useCallback(() => {
    play((ctx) => {
      const t = ctx.currentTime;
      [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        tone(ctx, f, t + i * 0.07, 0.18, "sine", 0.18);
      });
    });
  }, [play]);

  const achievement = useCallback(() => {
    play((ctx) => {
      const t = ctx.currentTime;
      [440, 554, 659, 880].forEach((f, i) => {
        tone(ctx, f, t + i * 0.06, 0.14, "sine", 0.16);
      });
      tone(ctx, 1318, t + 0.28, 0.35, "sine", 0.12);
    });
  }, [play]);

  const error = useCallback(() => {
    play((ctx) => {
      const t = ctx.currentTime;
      tone(ctx, 220, t,       0.12, "sawtooth", 0.15);
      tone(ctx, 185, t + 0.1, 0.20, "sawtooth", 0.12);
    });
  }, [play]);

  return { success, click, levelUp, achievement, error };
}
