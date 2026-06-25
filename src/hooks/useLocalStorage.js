import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Listen to Firebase changes in real time
  useEffect(() => {
    const dbRef = ref(db, `arise/${key}`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const firebaseData = snapshot.val();
        setValue(firebaseData);
        try {
          window.localStorage.setItem(key, JSON.stringify(firebaseData));
        } catch {}
      }
    });
    return () => unsubscribe();
  }, [key]);

  // Write to both localStorage and Firebase on every change
  const setValueSync = (newValue) => {
    setValue(newValue);
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch {}
    const dbRef = ref(db, `arise/${key}`);
    set(dbRef, newValue);
  };

  return [value, setValueSync];
}