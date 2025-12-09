import { useState, useEffect } from "react";
import { resetDailyHabits, calculateStreak, checkCompletedYesterday } from "../utils/habits";

/**
 * Custom hook for managing todos with localStorage persistence
 */
export function useTodos() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsed = JSON.parse(savedTodos);
      return resetDailyHabits(parsed);
    }
    return [];
  });

  // Save todos to localStorage when they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Reset habits when day changes
  useEffect(() => {
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
      id: crypto.randomUUID(),
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
    if (!value.trim()) return;

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

