/**
 * Weekly and monthly goals system
 */

import { safeGetItem, safeSetItem } from "./storage";

export function getCurrentWeek() {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek.toISOString().split("T")[0];
}

export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getWeeklyGoal() {
  if (typeof window === 'undefined') return null;
  const week = getCurrentWeek();
  return safeGetItem(`weekly-goal-${week}`, null);
}

export function setWeeklyGoal(goal) {
  if (typeof window === 'undefined') return;
  const week = getCurrentWeek();
  safeSetItem(`weekly-goal-${week}`, goal);
}

export function getMonthlyGoal() {
  if (typeof window === 'undefined') return null;
  const month = getCurrentMonth();
  return safeGetItem(`monthly-goal-${month}`, null);
}

export function setMonthlyGoal(goal) {
  if (typeof window === 'undefined') return;
  const month = getCurrentMonth();
  safeSetItem(`monthly-goal-${month}`, goal);
}

export function getWeeklyProgress(todos) {
  const week = getCurrentWeek();
  const weekStart = new Date(week);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const goal = getWeeklyGoal();
  if (!goal) return null;

  const completedTasks = todos.filter((todo) => {
    if (todo.type !== "task" || !todo.completed || !todo.completedAt) return false;
    const completedDate = new Date(todo.completedAt);
    return completedDate >= weekStart && completedDate < weekEnd;
  }).length;

  return {
    current: completedTasks,
    target: goal.target,
    percentage: Math.min((completedTasks / goal.target) * 100, 100),
  };
}

export function getMonthlyProgress(todos) {
  const month = getCurrentMonth();
  const [year, monthNum] = month.split("-");
  const monthStart = new Date(year, parseInt(monthNum) - 1, 1);
  const monthEnd = new Date(year, parseInt(monthNum), 1);

  const goal = getMonthlyGoal();
  if (!goal) return null;

  const completedTasks = todos.filter((todo) => {
    if (todo.type !== "task" || !todo.completed || !todo.completedAt) return false;
    const completedDate = new Date(todo.completedAt);
    return completedDate >= monthStart && completedDate < monthEnd;
  }).length;

  return {
    current: completedTasks,
    target: goal.target,
    percentage: Math.min((completedTasks / goal.target) * 100, 100),
  };
}

export function completeWeeklyGoal() {
  if (typeof window === 'undefined') return;
  const completed = safeGetItem("completed-weekly-goals", 0);
  safeSetItem("completed-weekly-goals", completed + 1);
}

export function completeMonthlyGoal() {
  if (typeof window === 'undefined') return;
  const completed = safeGetItem("completed-monthly-goals", 0);
  safeSetItem("completed-monthly-goals", completed + 1);
}

