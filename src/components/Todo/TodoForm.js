import { useState, useRef, useEffect } from "react";
import { Icons, renderIcon } from "../../utils/icons";
import { FirstTimeTooltip } from "../shared";
import { useFirstTime } from "../../hooks/useFirstTime";

export default function TodoForm({ title, onTitleChange, onSubmit, typeFilter = "all", onTypeChange }) {
  const inputRef = useRef(null);
  const formRef = useRef(null);
  
  // Determine initial type based on filter, default to "task"
  // If filter is set to a specific type, lock to that type
  const isTypeLocked = typeFilter === "habit" || typeFilter === "task";
  const [selectedType, setSelectedType] = useState(() => {
    return typeFilter === "habit" ? "habit" : "task";
  });

  // Show tooltip on first time
  const [showCreateHint, markCreateHintAsSeen] = useFirstTime('create-todo');

  useEffect(() => {
    // Focus on mount
    inputRef.current?.focus();
  }, []);

  // Update selected type when filter changes
  useEffect(() => {
    if (typeFilter === "habit") {
      setSelectedType("habit");
    } else if (typeFilter === "task") {
      setSelectedType("task");
    }
  }, [typeFilter]);

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim()) {
      onSubmit();
      inputRef.current?.focus();
    }
  }

  return (
    <form
      ref={formRef}
      className="todoCreateForm"
      onSubmit={handleSubmit}
      aria-labelledby="app-title"
      noValidate
      style={{ position: 'relative' }}
    >
      {showCreateHint && (
        <FirstTimeTooltip
          message={selectedType === "habit" 
            ? "Escribe aquí tu hábito diario y presiona Enter para crearlo. Los hábitos se pueden marcar como completados cada día."
            : "Escribe aquí tu tarea y presiona Enter para crearla. Puedes establecer fechas de vencimiento después."}
          position="bottom"
          onDismiss={markCreateHintAsSeen}
        />
      )}
      {/* Type selector - only show if type is not locked by filter */}
      {!isTypeLocked && (
        <div className="type-selector">
          <button
            type="button"
            className={`type-option ${selectedType === "task" ? "active" : ""}`}
            onClick={() => {
              setSelectedType("task");
              if (onTypeChange) onTypeChange("task");
            }}
            aria-label="Create a task"
            title="One-time task"
          >
            <span className="type-icon">{renderIcon(Icons.task, 16)}</span>
            <span className="type-label">Task</span>
          </button>
          <button
            type="button"
            className={`type-option ${selectedType === "habit" ? "active" : ""}`}
            onClick={() => {
              setSelectedType("habit");
              if (onTypeChange) onTypeChange("habit");
            }}
            aria-label="Create a habit"
            title="Daily habit with streak tracking"
          >
            <span className="type-icon">{renderIcon(Icons.habit, 16)}</span>
            <span className="type-label">Habit</span>
          </button>
        </div>
      )}

      <div className="formRow">
        <label htmlFor="todo-input" className="sr-only">
          {selectedType === "habit" ? "Add a new habit" : "Add a new task"}
        </label>
        <input
          id="todo-input"
          ref={inputRef}
          onChange={(e) => onTitleChange(e.target.value)}
          className="todoInput"
          value={title}
          placeholder={
            selectedType === "habit" 
              ? "What habit do you want to build? (e.g., Exercise daily, Read 30 min)"
              : "What needs to be done? (e.g., Buy groceries, Call dentist)"
          }
          aria-label={selectedType === "habit" ? "Add a new habit" : "Add a new task"}
          aria-describedby="input-hint"
          maxLength={200}
        />
      </div>
      <span id="input-hint" className="sr-only">
        {selectedType === "habit" 
          ? "Press Enter or click the Add button to create a new daily habit with streak tracking."
          : "Press Enter or click the Add button to create a new task."}
      </span>
      <button
        type="submit"
        className="buttonCreate"
        aria-label={selectedType === "habit" ? "Add new habit" : "Add new task"}
        disabled={!title.trim()}
      >
        <span className="buttonText">
          {selectedType === "habit" ? "Add Habit" : "Add Task"}
        </span>
        <span className="buttonIcon" aria-hidden="true">+</span>
      </button>
    </form>
  );
}

