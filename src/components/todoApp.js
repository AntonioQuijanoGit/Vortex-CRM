import { useState } from "react";
import Todo from "./Todo";
import Calendar from "./Calendar";
import TodoForm from "./TodoForm";
import TodoControls from "./TodoControls";
import TodoStats from "./TodoStats";
import EmptyState from "./EmptyState";
import ProductivityDashboard from "./ProductivityDashboard";
import { useTodos } from "../hooks/useTodos";
import { applyFilters } from "../utils/filters";

import "./todoApp.css";

export default function TodoApp() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete } = useTodos();

  const [title, setTitle] = useState("");
  const [todoType, setTodoType] = useState("task"); // 'task' or 'habit'
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all"); // all, task, habit
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  function handleAddTodo() {
    addTodo(title, todoType);
    setTitle("");
  }

  const filteredTodos = applyFilters(todos, {
    typeFilter,
    dateFilter: filter,
    searchQuery,
  });
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
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onToggleComplete={toggleComplete}
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
