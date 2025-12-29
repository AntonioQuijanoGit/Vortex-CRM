/**
 * Achievement/Badge system
 */

import { Icons } from "./icons";

export const ACHIEVEMENTS = {
  FIRST_TASK: {
    id: "first_task",
    title: "First Task",
    description: "Complete your first task",
    icon: Icons.task,
    condition: (stats) => stats.completedTasks >= 1,
  },
  FIRST_HABIT: {
    id: "first_habit",
    title: "First Habit",
    description: "Create your first habit",
    icon: Icons.habit,
    condition: (stats) => stats.totalHabits >= 1,
  },
  STREAK_7: {
    id: "streak_7",
    title: "Perfect Week",
    description: "Maintain a 7-day streak",
    icon: Icons.streak,
    condition: (stats) => stats.maxStreak >= 7,
  },
  STREAK_30: {
    id: "streak_30",
    title: "Perfect Month",
    description: "Maintain a 30-day streak",
    icon: Icons.streak,
    condition: (stats) => stats.maxStreak >= 30,
  },
  TASKS_10: {
    id: "tasks_10",
    title: "Productive",
    description: "Complete 10 tasks",
    icon: Icons.completed,
    condition: (stats) => stats.completedTasks >= 10,
  },
  TASKS_50: {
    id: "tasks_50",
    title: "Very Productive",
    description: "Complete 50 tasks",
    icon: Icons.completed,
    condition: (stats) => stats.completedTasks >= 50,
  },
  TASKS_100: {
    id: "tasks_100",
    title: "Productivity Master",
    description: "Complete 100 tasks",
    icon: Icons.completed,
    condition: (stats) => stats.completedTasks >= 100,
  },
  FIRST_PAGE: {
    id: "first_page",
    title: "Organizer",
    description: "Create your first page",
    icon: Icons.page,
    condition: (stats) => stats.totalPages > 1, // More than just "Home"
  },
  WEEKLY_GOAL: {
    id: "weekly_goal",
    title: "Goal Oriented",
    description: "Complete a weekly goal",
    icon: Icons.calendar,
    condition: (stats) => stats.completedWeeklyGoals >= 1,
  },
};

/**
 * Check and unlock achievements
 */
export function checkAchievements(stats, unlockedAchievements = []) {
  const newAchievements = [];
  
  Object.values(ACHIEVEMENTS).forEach((achievement) => {
    if (!unlockedAchievements.includes(achievement.id)) {
      if (achievement.condition(stats)) {
        newAchievements.push(achievement);
      }
    }
  });
  
  return newAchievements;
}

/**
 * Get achievement progress
 */
export function getAchievementProgress(achievement, stats) {
  if (achievement.id === "first_task") {
    return { current: stats.completedTasks, target: 1 };
  }
  if (achievement.id === "tasks_10") {
    return { current: stats.completedTasks, target: 10 };
  }
  if (achievement.id === "tasks_50") {
    return { current: stats.completedTasks, target: 50 };
  }
  if (achievement.id === "tasks_100") {
    return { current: stats.completedTasks, target: 100 };
  }
  if (achievement.id === "streak_7") {
    return { current: stats.maxStreak, target: 7 };
  }
  if (achievement.id === "streak_30") {
    return { current: stats.maxStreak, target: 30 };
  }
  if (achievement.id === "first_habit") {
    return { current: stats.totalHabits, target: 1 };
  }
  if (achievement.id === "first_page") {
    return { current: stats.totalPages - 1, target: 1 }; // Exclude "Home"
  }
  if (achievement.id === "weekly_goal") {
    return { current: stats.completedWeeklyGoals, target: 1 };
  }
  
  return { current: 0, target: 1 };
}

