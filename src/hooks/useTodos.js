import { useState, useEffect } from "react";
import { resetDailyHabits, calculateStreak } from "../utils/habits";
import { safeGetItem, safeSetItem } from "../utils/storage";
import { validateTitle } from "../utils/validation";
import { logger } from "../utils/logger";

// Helper function to generate UUID with fallback
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

/**
 * Custom hook for managing todos with localStorage persistence
 * @param {string} pageId - Optional page ID to store todos per page
 */
export function useTodos(pageId = null) {
  const storageKey = pageId ? `todos-${pageId}` : "todos";
  
  const [todos, setTodos] = useState(() => {
    const savedTodos = safeGetItem(storageKey, []);
    if (savedTodos && savedTodos.length > 0) {
      return resetDailyHabits(savedTodos);
    }
    return [];
  });

  // Save todos to localStorage when they change
  useEffect(() => {
    try {
      safeSetItem(storageKey, todos);
    } catch (error) {
      logger.error("Failed to save todos:", error);
      // Could show a toast here if we had access to it
    }
  }, [todos, storageKey]);

  // Reset habits when day changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkDayChange = setInterval(() => {
      const today = new Date().toDateString();
      const lastReset = safeGetItem("lastReset", null);

      if (lastReset !== today) {
        safeSetItem("lastReset", today);
        setTodos((prev) => resetDailyHabits(prev));
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkDayChange);
  }, []);

  const addTodo = (title, type) => {
    const validation = validateTitle(title);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const newTodo = {
      id: generateId(),
      title: title.trim(),
      type: type,
      completed: false,
      createdAt: new Date().toISOString(),
      // Notion-style properties
      status: "todo", // "todo" | "in-progress" | "done"
      priority: null, // "high" | "medium" | "low" | null
      tags: [],
      dueDate: null,
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
    const validation = validateTitle(value);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, title: value.trim() } : todo
      )
    );
  };

  const updateTodoProperties = (id, properties) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, ...properties } : todo
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
    updateTodoProperties,
    deleteTodo,
    toggleComplete,
  };
}


