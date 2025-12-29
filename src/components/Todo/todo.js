import { useState, useRef, useEffect } from "react";
import { Icons, renderIcon } from "../../utils/icons";
import { ConfirmDialog } from "../shared";
import TodoPropertiesEditor from "./TodoPropertiesEditor";
import "./TodoPropertiesEditor.css";

export default function Todo({ item, onUpdate, onDelete, onToggleComplete, onUpdateProperties, index }) {
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPropertiesEditor, setShowPropertiesEditor] = useState(false);
  const editInputRef = useRef(null);
  const isHabit = item.type === "habit";

  useEffect(() => {
    if (isEdit) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEdit]);

  function FormEdit() {
    const [newValue, setNewValue] = useState(item.title);

    function handleSubmit(e) {
      e.preventDefault();
      if (newValue.trim() && newValue.trim() !== item.title) {
        onUpdate(item.id, newValue);
      }
      setIsEdit(false);
    }

    function handleChange(e) {
      const value = e.target.value;
      setNewValue(value);
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setNewValue(item.title);
        setIsEdit(false);
      }
    }

    function handleClickUpdateTodo() {
      if (newValue.trim() && newValue.trim() !== item.title) {
        onUpdate(item.id, newValue);
      }
      setIsEdit(false);
    }

    return (
      <form 
        className="todoUpdateForm" 
        onSubmit={handleSubmit}
        aria-label={`Editing ${item.type === "habit" ? "habit" : "task"}: ${item.title}`}
      >
        <label htmlFor={`edit-input-${item.id}`} className="sr-only">
          Edit item
        </label>
        <input
          id={`edit-input-${item.id}`}
          ref={editInputRef}
          type="text"
          className="todoInput"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={newValue}
          aria-label="Edit item field"
          maxLength={200}
        />
        <div className="todoActions">
          <button 
            type="submit"
            className="button buttonSave" 
            onClick={handleClickUpdateTodo}
            aria-label="Save changes"
          >
            <span className="buttonText">Save</span>
          </button>
          <button 
            type="button"
            className="button buttonCancel" 
            onClick={() => {
              setNewValue(item.title);
              setIsEdit(false);
            }}
            aria-label="Cancel editing"
          >
            <span className="buttonText">Cancel</span>
          </button>
        </div>
      </form>
    );
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return `${daysDiff} ${daysDiff === 1 ? "day" : "days"} ago`;
    }

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }

  function formatDueDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays <= 7) return `In ${diffDays} days`;

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case "high":
        return "var(--color-error)";
      case "medium":
        return "var(--color-warning)";
      case "low":
        return "var(--color-success)";
      default:
        return "var(--color-text-secondary)";
    }
  }

  function TodoElement() {
    const streak = item.streak || 0;
    const bestStreak = item.bestStreak || 0;
    
    // Determine todo status for styling
    const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && !item.completed;
    const isPending = item.dueDate && !item.completed && !isOverdue;
    const todoStatusClass = item.completed 
      ? "completed" 
      : isOverdue 
        ? "overdue" 
        : isPending 
          ? "pending" 
          : "";

    return (
      <div className={`todoInfo ${todoStatusClass}`}>
        <div className="todoContent">
          <div className="todoHeaderRow">
            <button
              className={`todoCheckbox ${item.completed ? "completed" : ""} ${isHabit ? "habit" : ""}`}
              onClick={() => onToggleComplete(item.id)}
              aria-label={
                item.completed 
                  ? `Mark "${item.title}" as incomplete${isHabit ? " (habit will reset tomorrow)" : ""}`
                  : `Mark "${item.title}" as complete${isHabit ? " (adds to streak)" : ""}`
              }
              aria-checked={item.completed}
              role="checkbox"
              title={item.completed ? "Click to unmark" : "Click to complete"}
            >
              {item.completed && <span className="checkmark" aria-hidden="true">{renderIcon(Icons.check, 16)}</span>}
            </button>
            <div className="todoTitleWrapper">
              <span 
                className={`todoTitle ${item.completed ? "completed" : ""} ${isHabit ? "habit" : ""}`} 
                aria-label={`${isHabit ? "Habit" : "Task"} ${index + 1}: ${item.title}`}
              >
                {item.title}
              </span>
              {isHabit && (
                <span 
                  className="habitBadge" 
                  aria-label="Daily habit - resets each day and tracks streaks"
                  title="Daily habit - resets each day and tracks streaks"
                >
                  Habit
                </span>
              )}
            </div>
          </div>
          <div className="todoMeta">
            {isHabit && streak > 0 && (
              <span 
                className="streakBadge" 
                aria-label={`Current streak: ${streak} ${streak === 1 ? "day" : "days"}${bestStreak > streak ? `. Best streak: ${bestStreak} days` : ""}`}
                title={`Current streak: ${streak} ${streak === 1 ? "day" : "days"}${bestStreak > streak ? `. Best streak: ${bestStreak} days` : ""}`}
              >
                <span className="streakLabel" aria-hidden="true">Streak:</span> {streak} {streak === 1 ? "day" : "days"}
                {bestStreak > streak && (
                  <span className="bestStreak" aria-label={`Best streak: ${bestStreak} days`}>
                    {" "}(Best: {bestStreak})
                  </span>
                )}
              </span>
            )}
            {item.priority && (
              <span 
                className="priorityBadge" 
                style={{ backgroundColor: getPriorityColor(item.priority) }}
                aria-label={`Priority: ${item.priority}`}
                title={`Priority: ${item.priority}`}
              >
                {item.priority === "high" ? "High" : item.priority === "medium" ? "Medium" : "Low"}
              </span>
            )}
            {item.dueDate && (
              <span 
                className={`dueDateBadge ${new Date(item.dueDate) < new Date() && !item.completed ? "overdue" : ""}`}
                aria-label={`Due: ${formatDueDate(item.dueDate)}`}
                title={`Due: ${formatDueDate(item.dueDate)}`}
              >
                <span className="dueDateIcon" aria-hidden="true">{renderIcon(Icons.date, 14)}</span>
                {formatDueDate(item.dueDate)}
              </span>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="tagsContainer">
                {item.tags.map((tag, index) => (
                  <span key={index} className="tagBadge" aria-label={`Tag: ${tag}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {item.createdAt && (
              <span className="todoDate" aria-label={`Created ${formatDate(item.createdAt)}`}>
                {formatDate(item.createdAt)}
              </span>
            )}
          </div>
        </div>
        <div className="todoActions">
          {onUpdateProperties && (
            <>
              <button 
                className="button buttonProperties" 
                onClick={() => setShowPropertiesEditor(true)}
                aria-label="Edit properties (due date, priority, tags)"
                title="Edit properties (due date, priority, tags)"
              >
                <span className="buttonText">Properties</span>
              </button>
              <button 
                className="button buttonConvert" 
                onClick={() => {
                  const newType = item.type === "habit" ? "task" : "habit";
                  onUpdateProperties(item.id, { 
                    type: newType,
                    // If converting to habit, initialize habit fields
                    ...(newType === "habit" && !item.streak && {
                      streak: 0,
                      completedDates: [],
                      bestStreak: 0,
                    })
                  });
                }}
                aria-label={`Convert to ${item.type === "habit" ? "task" : "daily habit"}`}
                title={item.type === "habit" ? "Convert to one-time task" : "Convert to daily habit (tracks streaks)"}
              >
                <span className="buttonText">
                  {item.type === "habit" ? "→ Task" : "→ Habit"}
                </span>
              </button>
            </>
          )}
          <button 
            className="button buttonEdit" 
            onClick={() => setIsEdit(true)}
            aria-label={`Edit ${isHabit ? "habit" : "task"}: ${item.title}`}
          >
            <span className="buttonText">Edit</span>
          </button>
          <button 
            className="buttonDelete" 
            onClick={() => setShowDeleteConfirm(true)}
            aria-label={`Delete ${isHabit ? "habit" : "task"}: ${item.title}`}
          >
            <span className="buttonText">Delete</span>
          </button>
        </div>
      </div>
    );
  }

  // Determine todo status for styling
  const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && !item.completed;
  const isPending = item.dueDate && !item.completed && !isOverdue;
  const todoStatusClass = item.completed 
    ? "completed" 
    : isOverdue 
      ? "overdue" 
      : isPending 
        ? "pending" 
        : "";

  return (
    <>
      <article 
        className={`todo ${todoStatusClass}`}
        role="listitem"
        aria-label={`${item.type === "habit" ? "Habit" : "Task"}: ${item.title}`}
      >
        {isEdit ? <FormEdit /> : <TodoElement />}
      </article>
      {showPropertiesEditor && onUpdateProperties && (
        <div className="properties-editor-overlay" onClick={() => setShowPropertiesEditor(false)}>
          <div className="properties-editor-container" onClick={(e) => e.stopPropagation()}>
            <TodoPropertiesEditor
              item={item}
              onSave={(properties) => {
                onUpdateProperties(item.id, properties);
                setShowPropertiesEditor(false);
              }}
              onCancel={() => setShowPropertiesEditor(false)}
            />
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={`Delete ${isHabit ? "Habit" : "Task"}`}
        message={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          onDelete(item.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
