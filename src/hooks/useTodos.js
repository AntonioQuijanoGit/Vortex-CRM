import { useState, useEffect } from "react";
import { resetDailyHabits, calculateStreak, checkCompletedYesterday } from "../utils/habits";

// Helper function to generate UUID with fallback
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Custom hook for managing todos with localStorage persistence
 */
export function useTodos() {
  const [todos, setTodos] = useState(() => {
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') return [];
    
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos);
        return resetDailyHabits(parsed);
      } catch (e) {
        console.error('Error parsing saved todos:', e);
        return [];
      }
    }
    return [];
  });

  // Save todos to localStorage when they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Reset habits when day changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkDayChange = setInterval(() => {
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem("lastReset");

      if (lastReset !== today) {
        setTodos((prev) => resetDailyHabits(prev));
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkDayChange);
  }, []);

  const addTodo = (title, type) => {
    if (!title.trim()) return;

    const newTodo = {
      id: generateId(),
      title: title.trim(),
      type: type,
      completed: false,
      createdAt: new Date().toISOString(),
      // Habit-specific fields
      ...(type === "habit" && {
        streak: 0,
        completedDates: [],
        bestStreak: 0,
      }),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const updateTodo = (id, value) => {
    if (!value.trim()) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, title: value.trim() } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== id) return todo;

        const isCompleting = !todo.completed;
        const today = new Date().toDateString();

        if (todo.type === "habit") {
          // Habit logic
          if (isCompleting) {
            // Complete habit today
            const completedDates = todo.completedDates || [];
            const newStreak = calculateStreak(todo, today);

            return {
              ...todo,
              completed: true,
              streak: newStreak,
              bestStreak: Math.max(todo.bestStreak || 0, newStreak),
              completedDates: [...completedDates, today],
            };
          } else {
            // Unmark habit (remove from today)
            const completedDates = (todo.completedDates || []).filter(
              (date) => date !== today
            );
            // If unmarked today, streak breaks
            const newStreak = 0;

            return {
              ...todo,
              completed: false,
              streak: newStreak,
              completedDates,
            };
          }
        } else {
          // Regular task logic
          return { ...todo, completed: !todo.completed };
        }
      })
    );
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };
}


