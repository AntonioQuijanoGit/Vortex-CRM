import { useState, useRef, useEffect } from "react";
import { Icons } from "../utils/icons";

export default function Todo({ item, onUpdate, onDelete, onToggleComplete, index }) {
  const [isEdit, setIsEdit] = useState(false);
  const editInputRef = useRef(null);

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

  function TodoElement() {
    const isHabit = item.type === "habit";
    const streak = item.streak || 0;
    const bestStreak = item.bestStreak || 0;

    return (
      <div className="todoInfo">
        <div className="todoContent">
          <div className="todoHeaderRow">
            <button
              className={`todoCheckbox ${item.completed ? "completed" : ""} ${isHabit ? "habit" : ""}`}
              onClick={() => onToggleComplete(item.id)}
              aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
              aria-checked={item.completed}
              role="checkbox"
            >
              {item.completed && <span className="checkmark">{Icons.check}</span>}
            </button>
            <div className="todoTitleWrapper">
              <span 
                className={`todoTitle ${item.completed ? "completed" : ""} ${isHabit ? "habit" : ""}`} 
                aria-label={`${isHabit ? "Habit" : "Task"} ${index + 1}: ${item.title}`}
              >
                {item.title}
              </span>
              {isHabit && (
                <span className="habitBadge" aria-label="Daily habit">
                  Habit
                </span>
              )}
            </div>
          </div>
          <div className="todoMeta">
            {isHabit && streak > 0 && (
              <span className="streakBadge" aria-label={`${streak} day streak`}>
                <span className="streakLabel">Streak:</span> {streak} {streak === 1 ? "day" : "days"}
                {bestStreak > streak && (
                  <span className="bestStreak" aria-label={`Best streak: ${bestStreak} days`}>
                    {" "}(Best: {bestStreak})
                  </span>
                )}
              </span>
            )}
            {item.createdAt && (
              <span className="todoDate" aria-label={`Created ${formatDate(item.createdAt)}`}>
                {formatDate(item.createdAt)}
              </span>
            )}
          </div>
        </div>
        <div className="todoActions">
          <button 
            className="button buttonEdit" 
            onClick={() => setIsEdit(true)}
            aria-label={`Edit ${isHabit ? "habit" : "task"}: ${item.title}`}
          >
            <span className="buttonText">Edit</span>
          </button>
          <button 
            className="buttonDelete" 
            onClick={() => onDelete(item.id)}
            aria-label={`Delete ${isHabit ? "habit" : "task"}: ${item.title}`}
          >
            <span className="buttonText">Delete</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <article 
      className="todo"
      role="listitem"
      aria-label={`${item.type === "habit" ? "Habit" : "Task"}: ${item.title}`}
    >
      {isEdit ? <FormEdit /> : <TodoElement />}
    </article>
  );
}
