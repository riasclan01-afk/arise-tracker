// src/utils/haptics.js
export const haptics = {
  light: () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  },
  
  medium: () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  },
  
  heavy: () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  },
  
  success: () => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 25, 50, 25, 50]);
    }
  },
  
  error: () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 50, 200]);
    }
  }
};