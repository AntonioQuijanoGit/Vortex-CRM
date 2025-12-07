import { useState, useEffect } from "react";
import Todo from "./Todo";
import Calendar from "./Calendar";
import TodoForm from "./TodoForm";
import TodoControls from "./TodoControls";
import TodoStats from "./TodoStats";
import EmptyState from "./EmptyState";
import ProductivityDashboard from "./ProductivityDashboard";

import "./todoApp.css";

export default function TodoApp() {
  // Cargar tareas desde localStorage al iniciar
  const [title, setTitle] = useState("");
  const [todoType, setTodoType] = useState("task"); // 'task' o 'habit'
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsed = JSON.parse(savedTodos);
      // Resetear hábitos diarios si es un nuevo día
      return resetDailyHabits(parsed);
    }
    return [];
  });
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all"); // all, task, habit
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Función para resetear hábitos diarios
  function resetDailyHabits(todosList) {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem("lastReset");

    // Si es un nuevo día, resetear hábitos
    if (lastReset !== today) {
      localStorage.setItem("lastReset", today);
      return todosList.map((todo) => {
        if (todo.type === "habit") {
          // Verificar si se completó ayer para mantener la racha
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();
          const wasCompletedYesterday =
            todo.completedDates?.includes(yesterdayStr);

          // Si no se completó ayer, resetear racha
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

  // Resetear hábitos al cambiar de día
  useEffect(() => {
    const checkDayChange = setInterval(() => {
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem("lastReset");

      if (lastReset !== today) {
        setTodos((prev) => resetDailyHabits(prev));
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(checkDayChange);
  }, []);

  // Guardar tareas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleAddTodo() {
    if (!title.trim()) return;

    const newTodo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type: todoType,
      completed: false,
      createdAt: new Date().toISOString(),
      // Campos específicos para hábitos
      ...(todoType === "habit" && {
        streak: 0,
        completedDates: [],
        bestStreak: 0,
      }),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setTitle("");
  }

  function handleUpdate(id, value) {
    if (!value.trim()) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, title: value.trim() } : todo
      )
    );
  }

  function handleDelete(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function handleToggleComplete(id) {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== id) return todo;

        const isCompleting = !todo.completed;
        const today = new Date().toDateString();

        if (todo.type === "habit") {
          // Lógica para hábitos
          if (isCompleting) {
            // Completar hábito hoy
            const completedDates = todo.completedDates || [];
            const wasCompletedYesterday = checkCompletedYesterday(todo, today);
            const newStreak = wasCompletedYesterday
              ? (todo.streak || 0) + 1
              : 1; // Nueva racha si no se completó ayer

            return {
              ...todo,
              completed: true,
              streak: newStreak,
              bestStreak: Math.max(todo.bestStreak || 0, newStreak),
              completedDates: [...completedDates, today],
            };
          } else {
            // Desmarcar hábito (quitar de hoy)
            const completedDates = (todo.completedDates || []).filter(
              (date) => date !== today
            );
            // Si se desmarca hoy, la racha se rompe
            const newStreak = 0;

            return {
              ...todo,
              completed: false,
              streak: newStreak,
              completedDates,
            };
          }
        } else {
          // Lógica para tareas normales
          return { ...todo, completed: !todo.completed };
        }
      })
    );
  }

  // Verificar si el hábito se completó ayer
  function checkCompletedYesterday(todo, todayStr) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    return todo.completedDates?.includes(yesterdayStr) || false;
  }

  // Filtrar tareas según el filtro seleccionado y búsqueda
  function getFilteredTodos() {
    let filtered = todos;

    // Filtro por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter((todo) => todo.type === typeFilter);
    }

    // Filtro por fecha
    if (filter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      filtered = filtered.filter((todo) => {
        const todoDate = new Date(todo.createdAt);
        if (filter === "today") {
          return todoDate >= today;
        }
        if (filter === "week") {
          return todoDate >= weekAgo;
        }
        return true;
      });
    }

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter((t) => t.completed).length;
  const habits = todos.filter((t) => t.type === "habit");
  const habitsCount = habits.length;
  const activeStreaks = habits.filter((h) => (h.streak || 0) > 0).length;

  return (
    <div
      className="todoContainer"
      role="main"
      aria-label="Daily Productivity and Habit Tracker"
    >
      <header className="todoHeader">
        <h1 id="app-title">Daily Productivity Tracker</h1>
        <p className="todoSubtitle" id="app-description">
          Manage your tasks and track daily habits with streak counters
        </p>
        <div className="headerExplanation">
          <div className="explanationItem">
            <span className="explanationIcon">✓</span>
            <div className="explanationContent">
              <strong>Tasks</strong> - One-time items. Complete them and they're
              done.
            </div>
          </div>
          <div className="explanationItem">
            <span className="explanationIcon">↻</span>
            <div className="explanationContent">
              <strong>Habits</strong> - Daily routines. Reset each day and build
              streaks.
            </div>
          </div>
        </div>
      </header>

      <TodoForm
        title={title}
        onTitleChange={setTitle}
        onSubmit={handleAddTodo}
        todoType={todoType}
        onTypeChange={setTodoType}
      />

      {todos.length > 0 && (
        <>
          <div className="viewToggle">
            <button
              className={`viewToggleButton ${showDashboard ? "active" : ""}`}
              onClick={() => {
                setShowDashboard(true);
                setShowCalendar(false);
              }}
              aria-label="Show dashboard"
            >
              <span className="buttonText">Dashboard</span>
            </button>
            <button
              className={`viewToggleButton ${!showDashboard ? "active" : ""}`}
              onClick={() => {
                setShowDashboard(false);
                setShowCalendar(true);
              }}
              aria-label="Show calendar"
            >
              <span className="buttonText">Calendar</span>
            </button>
          </div>

          {showDashboard && (
            <ProductivityDashboard todos={todos} habits={habits} />
          )}

          {showCalendar && (
            <div className="calendarContainer">
              <Calendar todos={todos} />
            </div>
          )}

          <TodoControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filter={filter}
            onFilterChange={setFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />
        </>
      )}

      {todos.length === 0 ? (
        <EmptyState
          message="Get Started"
          hint="Create your first task or habit to begin tracking your productivity"
          showExamples={true}
        />
      ) : filteredTodos.length === 0 ? (
        <EmptyState
          message="No items found in this period"
          hint="Change the filter or add a new item"
        />
      ) : (
        <div
          className="todosContainer"
          role="list"
          aria-label={`List of ${filteredTodos.length} ${
            filteredTodos.length === 1 ? "item" : "items"
          }`}
        >
          {filteredTodos.map((item, index) => (
            <Todo
              key={item.id}
              item={item}
              index={index}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}

      <TodoStats
        totalTodos={todos.length}
        completedCount={completedCount}
        habitsCount={habitsCount}
        activeStreaks={activeStreaks}
      />
    </div>
  );
}
