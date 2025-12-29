import { useState, useEffect } from "react";
import { Icons, renderIcon } from "../../utils/icons";
import "./TodoPropertiesEditor.css";

export default function TodoPropertiesEditor({ item, onSave, onCancel }) {
  const [dueDate, setDueDate] = useState(item.dueDate || "");
  const [priority, setPriority] = useState(item.priority || null);
  const [tags, setTags] = useState(item.tags?.join(", ") || "");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById(`due-date-${item.id}`);
    if (dateInput) {
      dateInput.setAttribute("min", today);
    }
  }, [item.id]);

  const handleSave = () => {
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSave({
      dueDate: dueDate || null,
      priority: priority || null,
      tags: tagsArray,
    });
  };

  const getPriorityColor = (priority) => {
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
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return "None";
    }
  };

  const formatDueDate = (dateString) => {
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
  };

  return (
    <div className="todo-properties-editor">
      <div className="properties-header">
        <h3>Edit Properties</h3>
        <button
          className="properties-close"
          onClick={onCancel}
          aria-label="Close properties editor"
        >
          {renderIcon(Icons.close, 18)}
        </button>
      </div>

      <div className="properties-content">
        {/* Due Date */}
        <div className="property-group">
          <label htmlFor={`due-date-${item.id}`} className="property-label">
            <span className="property-icon">{renderIcon(Icons.date, 16)}</span>
            Due Date
          </label>
          <div className="property-input-group">
            <input
              id={`due-date-${item.id}`}
              type="date"
              className="property-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
            />
            {dueDate && (
              <span className="property-preview">
                {formatDueDate(dueDate)}
              </span>
            )}
            {dueDate && (
              <button
                className="property-clear"
                onClick={() => setDueDate("")}
                aria-label="Clear due date"
                title="Clear due date"
              >
                {renderIcon(Icons.delete, 16)}
              </button>
            )}
          </div>
        </div>

        {/* Priority */}
        <div className="property-group">
          <label className="property-label">
            <span className="property-icon">⚡</span>
            Priority
          </label>
          <div className="priority-buttons">
            {["high", "medium", "low"].map((p) => (
              <button
                key={p}
                type="button"
                className={`priority-button ${priority === p ? "active" : ""}`}
                onClick={() => setPriority(priority === p ? null : p)}
                style={
                  priority === p
                    ? {
                        backgroundColor: getPriorityColor(p),
                        color: "white",
                      }
                    : {}
                }
                aria-label={`Set priority to ${p}`}
              >
                {getPriorityLabel(p)}
              </button>
            ))}
            <button
              type="button"
              className={`priority-button ${priority === null ? "active" : ""}`}
              onClick={() => setPriority(null)}
              aria-label="Remove priority"
            >
              None
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="property-group">
          <label htmlFor={`tags-${item.id}`} className="property-label">
            <span className="property-icon">🏷️</span>
            Tags
          </label>
          <input
            id={`tags-${item.id}`}
            type="text"
            className="property-input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Separate tags with commas (e.g., work, urgent, personal)"
            aria-label="Tags"
          />
          {tags && (
            <div className="tags-preview">
              {tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0)
                .map((tag, index) => (
                  <span key={index} className="tag-preview">
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="properties-actions">
        <button
          className="button buttonSave"
          onClick={handleSave}
          aria-label="Save properties"
        >
          Save
        </button>
        <button
          className="button buttonCancel"
          onClick={onCancel}
          aria-label="Cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}












