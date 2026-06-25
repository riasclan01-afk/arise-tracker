// components/auth/QuickAuth.jsx - FINAL FIX
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudOff, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function QuickAuth({ user, isSync, isOnline, lastSync, onEnableSync }) {
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // KEY FIX: If user exists, they ARE online (Firebase Auth requires internet)
  // So we completely ignore isOnline when user is authenticated
  const actuallyOnline = user ? true : isOnline;
  
  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {/* ONLY show offline when NO user AND actually offline */}
        {!user && !actuallyOnline && (
          <motion.div
            key="offline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <CloudOff className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400 hidden sm:inline">Offline</span>
          </motion.div>
        )}
        
        {/* Show enable sync when online but no user */}
        {!user && actuallyOnline && (
          <motion.button
            key="enable"
            onClick={onEnableSync}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CloudOff className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400">Enable Sync</span>
          </motion.button>
        )}
        
        {/* Show synced status when user exists */}
        {user && (
          <motion.div
            key="synced"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-1">
                <Cloud className="w-4 h-4 text-green-400" />
                {isSync && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </div>
              <span className="text-xs text-green-400 hidden sm:inline">
                {isSync ? 'Syncing...' : `Synced ${lastSync || 'now'}`}
              </span>
            </div>

            <motion.button
              onClick={handleSignOut}
              className="flex items-center gap-1 px-2 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Disable Sync"
            >
              <LogOut className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400 hidden sm:inline">Disable</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}