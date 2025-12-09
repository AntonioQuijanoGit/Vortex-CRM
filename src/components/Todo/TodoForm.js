import { useRef, useEffect, useState } from "react";

export default function TodoForm({ title, onTitleChange, onSubmit, todoType, onTypeChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus al montar
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim()) {
      onSubmit();
      inputRef.current?.focus();
    }
  }

  return (
    <form
      className="todoCreateForm"
      onSubmit={handleSubmit}
      aria-labelledby="app-title"
      noValidate
    >
      <div className="formRow">
        <label htmlFor="todo-input" className="sr-only">
          New task or habit
        </label>
        <input
          id="todo-input"
          ref={inputRef}
          onChange={(e) => onTitleChange(e.target.value)}
          className="todoInput"
          value={title}
          placeholder={todoType === "habit" ? "e.g., Exercise, Read 20 pages, Meditate..." : "e.g., Buy groceries, Call dentist, Finish report..."}
          aria-label="Input field for new task or habit"
          aria-describedby="input-hint"
          maxLength={200}
        />
        <div className="typeSelector">
          <button
            type="button"
            className={`typeButton ${todoType === "task" ? "active" : ""}`}
            onClick={() => onTypeChange("task")}
            aria-label="Create normal task"
            title="Normal task"
          >
            <span className="buttonText">Task</span>
          </button>
          <button
            type="button"
            className={`typeButton ${todoType === "habit" ? "active" : ""}`}
            onClick={() => onTypeChange("habit")}
            aria-label="Create daily habit"
            title="Daily habit"
          >
            <span className="buttonText">Habit</span>
          </button>
        </div>
      </div>
      <span id="input-hint" className="sr-only">
        Press Enter or click the button to add the item
      </span>
      <button
        type="submit"
        className="buttonCreate"
        aria-label="Add new item"
        disabled={!title.trim()}
      >
        <span className="buttonText">Add</span>
        <span className="buttonIcon" aria-hidden="true">+</span>
      </button>
    </form>
  );
}

