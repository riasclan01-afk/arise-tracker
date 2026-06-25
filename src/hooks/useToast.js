// hooks/useToast.js
import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, duration);
  }, []);

  return { toast, showToast };
}