// utils/achievements.js
export const ACHIEVEMENTS = [
    {
      id: 'first_task',
      title: 'First Step',
      description: 'Complete your first task',
      icon: '⭐',
      xp: 10,
      condition: (stats) => stats.totalTasks >= 1
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      xp: 50,
      condition: (stats) => stats.streak >= 7
    },
    {
      id: 'study_master',
      title: 'Study Master',
      description: 'Complete 50 study tasks',
      icon: '📚',
      xp: 100,
      condition: (stats) => stats.studyTasks >= 50
    },
    {
      id: 'workout_beast',
      title: 'Workout Beast',
      description: 'Complete 30 workout sessions',
      icon: '💪',
      xp: 100,
      condition: (stats) => stats.workoutSessions >= 30
    },
    {
      id: 'month_legend',
      title: 'Month Legend',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      xp: 200,
      condition: (stats) => stats.streak >= 30
    },
    {
      id: 'century_club',
      title: 'Century Club',
      description: 'Complete 100 total tasks',
      icon: '🏆',
      xp: 150,
      condition: (stats) => stats.totalTasks >= 100
    }
  ];
  
  export function calculateLevel(xp) {
    // Level formula: level = floor(sqrt(xp / 100))
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
    const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
    const xpForNextLevel = Math.pow(level, 2) * 100;
    const xpInCurrentLevel = xp - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
    
    return {
      level,
      xp,
      xpForNext: xpForNextLevel,
      xpInLevel: xpInCurrentLevel,
      xpNeeded: xpNeededForNextLevel,
      progress
    };
  }