import { useState, useEffect } from "react";
import Todo from "./todo";
import TodoForm from "./TodoForm";
import TodoControls from "./TodoControls";
import TodoStats from "./TodoStats";
import { Calendar, EmptyState } from "../shared";
import { ProductivityDashboard } from "../ProductivityDashboard";
import { BoardView } from "../Views/BoardView";
import { TableView } from "../Views/TableView";
import { useTodos } from "../../hooks/useTodos";
import { useToast } from "../../hooks/useToast";
import { applyFilters } from "../../utils/filters";
import { Icons } from "../../utils/icons";

import "./todoApp.css";

export default function TodoApp({ pageId, viewType: initialViewType, initialTypeFilter = "all" }) {
  const { todos, addTodo, updateTodo, updateTodoProperties, deleteTodo, toggleComplete } = useTodos(pageId);
  const { showSuccess, showError } = useToast();

  const [currentView, setCurrentView] = useState(initialViewType || "list");
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter); // all, task, habit
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(() => {
    // Initialize based on filter if set, otherwise default to "task"
    return initialTypeFilter === "habit" ? "habit" : "task";
  });

  // Update selected type when filter changes (and lock it)
  useEffect(() => {
    if (typeFilter === "habit") {
      setSelectedType("habit");
    } else if (typeFilter === "task") {
      setSelectedType("task");
    }
  }, [typeFilter]);

  // Update typeFilter when initialTypeFilter changes (e.g., when navigating to a different page)
  useEffect(() => {
    if (initialTypeFilter !== typeFilter) {
      setTypeFilter(initialTypeFilter);
    }
  }, [initialTypeFilter, typeFilter]);

  function handleAddTodo() {
    try {
      // Create as the selected type
      addTodo(title, selectedType);
      setTitle("");
      const successMessage = selectedType === "habit" 
        ? "Habit created successfully" 
        : "Task created successfully";
      showSuccess(successMessage);
    } catch (error) {
      showError(error.message || "Failed to create item. Please try again.");
    }
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
      {/* Form always visible at the top */}
      <TodoForm
        title={title}
        onTitleChange={setTitle}
        onSubmit={handleAddTodo}
        typeFilter={typeFilter}
        onTypeChange={setSelectedType}
      />


      {/* Always show view selector and content */}
      {todos.length > 0 && (
        <>
          {/* View Selector */}
          <div className="viewSelector">
            <button
              className={`viewButton ${currentView === "list" ? "active" : ""}`}
              onClick={() => setCurrentView("list")}
            >
              <span className="buttonText">List</span>
            </button>
            <button
              className={`viewButton ${currentView === "board" ? "active" : ""}`}
              onClick={() => setCurrentView("board")}
            >
              <span className="buttonText">Board</span>
            </button>
            <button
              className={`viewButton ${currentView === "table" ? "active" : ""}`}
              onClick={() => setCurrentView("table")}
            >
              <span className="buttonText">Table</span>
            </button>
            <button
              className={`viewButton ${currentView === "calendar" ? "active" : ""}`}
              onClick={() => setCurrentView("calendar")}
            >
              <span className="buttonText">Calendar</span>
            </button>
            <button
              className={`viewButton ${currentView === "dashboard" ? "active" : ""}`}
              onClick={() => setCurrentView("dashboard")}
            >
              <span className="buttonText">Dashboard</span>
            </button>
          </div>

          {/* Dashboard View */}
          {currentView === "dashboard" && (
            <ProductivityDashboard todos={todos} habits={habits} />
          )}

          {/* Calendar View */}
          {currentView === "calendar" && (
            <div className="calendarContainer">
              <Calendar todos={todos} />
            </div>
          )}

          {/* Filters for List/Board/Table views */}
          {(currentView === "list" || currentView === "board" || currentView === "table") && (
            <TodoControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filter={filter}
              onFilterChange={setFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
            />
          )}
        </>
      )}

      {/* Show empty state only when there are no todos and we're in list/board/table view */}
      {todos.length === 0 && (currentView === "list" || currentView === "board" || currentView === "table") && (
        <EmptyState
          message="Get Started"
          hint="Create your first task or habit using the form above"
          showExamples={true}
          icon={Icons.task}
        />
      )}

      {/* Show filtered empty state */}
      {todos.length > 0 && filteredTodos.length === 0 && (currentView === "list" || currentView === "board" || currentView === "table") && (
        <EmptyState
          message="No items found in this period"
          hint="Change the filter or add a new item"
          icon={Icons.search}
        />
      )}

      {/* Show todos when we have them */}
      {todos.length > 0 && filteredTodos.length > 0 && (
        <>
          {/* List View */}
          {currentView === "list" && (
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
                  onUpdate={(id, value) => {
                    updateTodo(id, value);
                    showSuccess("Task updated");
                  }}
                  onDelete={(id) => {
                    deleteTodo(id);
                    showSuccess("Task deleted");
                  }}
                  onToggleComplete={toggleComplete}
                  onUpdateProperties={(id, props) => {
                    updateTodoProperties(id, props);
                    const newType = props.type === "habit" ? "habit" : "task";
                    showSuccess(`Converted to ${newType}`);
                  }}
                />
              ))}
            </div>
          )}

          {/* Board View */}
          {currentView === "board" && (
            <BoardView
              todos={filteredTodos}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onToggleComplete={toggleComplete}
              onUpdateProperties={updateTodoProperties}
            />
          )}

          {/* Table View */}
          {currentView === "table" && (
            <TableView
              todos={filteredTodos}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onToggleComplete={toggleComplete}
              onUpdateProperties={updateTodoProperties}
            />
          )}
        </>
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
