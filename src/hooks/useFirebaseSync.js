// hooks/useFirebaseSync.js
import { useState, useEffect } from 'react';
import { ref, set, get, onValue, off } from 'firebase/database';
import { db, auth } from '../firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export const useFirebaseSync = (localData, setLocalData) => {
  const [user, setUser] = useState(null);
  const [isSync, setIsSync] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Firebase sync logic
  useEffect(() => {
    if (!user || !isOnline) return;

    const userDataRef = ref(db, `users/${user.uid}/ariseProgress`);
    
    const loadInitialData = async () => {
      try {
        setIsSync(true);
        const snapshot = await get(userDataRef);
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          if (firebaseData.lastSync > (localData.lastSync || 0)) {
            setLocalData(prev => ({ ...prev, ...firebaseData }));
            setLastSync(new Date(firebaseData.lastSync).toLocaleTimeString());
          }
        }
      } catch (error) {
        console.error('Firebase load error:', error);
      } finally {
        setIsSync(false);
      }
    };

    loadInitialData();

    const unsubscribe = onValue(userDataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.lastSync > (localData.lastSync || 0)) {
          setLocalData(prev => ({ ...prev, ...data }));
          setLastSync(new Date(data.lastSync).toLocaleTimeString());
        }
      }
    });

    return () => off(userDataRef, 'value', unsubscribe);
  }, [user, isOnline]);

  const syncToFirebase = async (data) => {
    if (!user || !isOnline || isSync) return false;

    try {
      setIsSync(true);
      const userDataRef = ref(db, `users/${user.uid}/ariseProgress`);
      const syncData = { ...data, lastSync: Date.now() };
      await set(userDataRef, syncData);
      setLastSync(new Date().toLocaleTimeString());
      return true;
    } catch (error) {
      console.error('Firebase sync error:', error);
      return false;
    } finally {
      setIsSync(false);
    }
  };

  const enableSync = async () => {
    try {
      await signInAnonymously(auth);
      return true;
    } catch (error) {
      console.error('Auth error:', error);
      return false;
    }
  };

  return { 
    user, 
    isSync, 
    lastSync, 
    isOnline, 
    syncToFirebase, 
    enableSync 
  };
};