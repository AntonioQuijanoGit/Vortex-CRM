/**
 * Utility functions for habit management
 */

/**
 * Reset daily habits when a new day starts
 * @param {Array} todosList - List of todos
 * @returns {Array} Updated todos list with habits reset
 */
export function resetDailyHabits(todosList) {
  const today = new Date().toDateString();
  const lastReset = localStorage.getItem("lastReset");

  // If it's a new day, reset habits
  if (lastReset !== today) {
    localStorage.setItem("lastReset", today);
    return todosList.map((todo) => {
      if (todo.type === "habit") {
        // Check if it was completed yesterday to maintain streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        const wasCompletedYesterday =
          todo.completedDates?.includes(yesterdayStr);

        // If not completed yesterday, reset streak
        const newStreak = wasCompletedYesterday ? todo.streak || 0 : 0;

        return {
          ...todo,
          completed: false,
          streak: newStreak,
        };
      }
      return todo;
    });
  }
  return todosList;
}

/**
 * Check if a habit was completed yesterday
 * @param {Object} todo - Habit todo item
 * @param {string} todayStr - Today's date string
 * @returns {boolean} Whether the habit was completed yesterday
 */
export function checkCompletedYesterday(todo, todayStr) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  return todo.completedDates?.includes(yesterdayStr) || false;
}

/**
 * Calculate streak for a habit when completing it
 * @param {Object} todo - Habit todo item
 * @param {string} today - Today's date string
 * @returns {number} New streak value
 */
export function calculateStreak(todo, today) {
  const wasCompletedYesterday = checkCompletedYesterday(todo, today);
  return wasCompletedYesterday ? (todo.streak || 0) + 1 : 1;
}

