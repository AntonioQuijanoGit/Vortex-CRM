import { useState, useEffect, useMemo, useCallback } from "react";
import Todo from "./todo";
import TodoForm from "./TodoForm";
import TodoControls from "./TodoControls";
import TodoStats from "./TodoStats";
import { Calendar, EmptyState } from "../shared";
import { ProductivityDashboard } from "../ProductivityDashboard";
import { BoardView } from "../Views/BoardView";
import { TableView } from "../Views/TableView";
import GalleryView from "../Views/GalleryView/GalleryView";
import DatabaseFilters from "../Database/DatabaseFilters";
import DatabaseSorting from "../Database/DatabaseSorting";
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
  const [filters, setFilters] = useState([]);
  const [sorts, setSorts] = useState([]);
  // Determine if type is locked by filter
  const isTypeLocked = typeFilter === "habit" || typeFilter === "task";
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
  }, [initialTypeFilter]);

  const handleAddTodo = useCallback(() => {
    if (!title.trim()) {
      showError("Please enter a title for your task or habit.");
      return;
    }

    try {
      // Create as the selected type
      addTodo(title, selectedType);
      setTitle("");
      const successMessage = selectedType === "habit" 
        ? "Habit created successfully" 
        : "Task created successfully";
      showSuccess(successMessage);
    } catch (error) {
      // Show user-friendly error message
      const errorMessage = error.message || "Failed to create item. Please try again.";
      showError(errorMessage);
      console.error("Error creating todo:", error);
    }
  }, [title, selectedType, addTodo, showSuccess, showError]);

  // Memoize filtered todos to avoid recalculating on every render
  const filteredTodos = useMemo(() => {
    return applyFilters(todos, {
      typeFilter,
      dateFilter: filter,
      searchQuery,
    });
  }, [todos, typeFilter, filter, searchQuery]);

  // Memoize statistics calculations
  const { completedCount, habits, habitsCount, activeStreaks } = useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    const habitList = todos.filter((t) => t.type === "habit");
    return {
      completedCount: completed,
      habits: habitList,
      habitsCount: habitList.length,
      activeStreaks: habitList.filter((h) => (h.streak || 0) > 0).length,
    };
  }, [todos]);

  // Memoize handlers to avoid recreating on every render
  const handleUpdateTodo = useCallback((id, value) => {
    updateTodo(id, value);
    showSuccess("Task updated");
  }, [updateTodo, showSuccess]);

  const handleDeleteTodo = useCallback((id) => {
    deleteTodo(id);
    showSuccess("Task deleted");
  }, [deleteTodo, showSuccess]);

  const handleUpdateProperties = useCallback((id, props) => {
    updateTodoProperties(id, props);
    const newType = props.type === "habit" ? "habit" : "task";
    showSuccess(`Converted to ${newType}`);
  }, [updateTodoProperties, showSuccess]);

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
              className={`viewButton ${currentView === "gallery" ? "active" : ""}`}
              onClick={() => setCurrentView("gallery")}
            >
              <span className="buttonText">Gallery</span>
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

          {/* Filters for List/Board/Table/Gallery views */}
          {(currentView === "list" || currentView === "board" || currentView === "table" || currentView === "gallery") && (
            <>
              <TodoControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filter={filter}
                onFilterChange={setFilter}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
              />
              <div className="database-advanced-filters">
                <DatabaseFilters
                  properties={[
                    { id: "status", name: "Status", type: "select" },
                    { id: "priority", name: "Priority", type: "select" },
                    { id: "dueDate", name: "Due Date", type: "date" },
                  ]}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
                <DatabaseSorting
                  properties={[
                    { id: "title", name: "Title", type: "text" },
                    { id: "createdAt", name: "Created", type: "date" },
                    { id: "dueDate", name: "Due Date", type: "date" },
                  ]}
                  sorts={sorts}
                  onSortsChange={setSorts}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* Show empty state only when there are no todos and we're in list/board/table view */}
      {todos.length === 0 && (currentView === "list" || currentView === "board" || currentView === "table") && (
        <EmptyState
          message="Get Started"
          hint="Create your first task or habit using the form above. Tasks are one-time items, while habits track daily activities with streaks."
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
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                  onToggleComplete={toggleComplete}
                  onUpdateProperties={handleUpdateProperties}
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

          {/* Gallery View */}
          {currentView === "gallery" && (
            <GalleryView
              items={filteredTodos.map(todo => ({
                id: todo.id,
                completed: todo.completed,
                properties: {
                  title: todo.title,
                  status: todo.status || "todo",
                  priority: todo.priority || null,
                  type: todo.type,
                  dueDate: todo.dueDate || null,
                  createdAt: todo.createdAt,
                }
              }))}
              properties={[
                { id: "title", name: "Title", type: "title" },
                { id: "status", name: "Status", type: "select" },
                { id: "priority", name: "Priority", type: "select" },
                { id: "type", name: "Type", type: "select" },
                { id: "dueDate", name: "Due Date", type: "date" },
                { id: "createdAt", name: "Created", type: "date" },
              ]}
              onUpdate={(id, value) => updateTodo(id, value)}
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
