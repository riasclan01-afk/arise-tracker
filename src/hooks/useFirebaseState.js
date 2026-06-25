import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";

export function useFirebaseState(key, defaultValue) {
  const [state, setState] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const dbRef = ref(db, `arise/${key}`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setState(snapshot.val());
      } else {
        setState(defaultValue);
      }
      setLoaded(true);
    });
    return () => unsubscribe();
  }, [key]);

  const updateState = (newValue) => {
    const dbRef = ref(db, `arise/${key}`);
    set(dbRef, newValue);
    setState(newValue);
  };

  return [state, updateState, loaded];
}