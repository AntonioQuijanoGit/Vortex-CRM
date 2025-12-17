import React, { useState } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import "./BoardCard.css";

export default function BoardCard({
  item,
  onDragStart,
  onDragEnd,
  isDragging,
  onUpdate,
  onDelete,
  onUpdateProperties,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.title);

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(item.id, editValue);
    }
    setIsEditing(false);
  };

  const priorityColors = {
    high: "#FF0000",
    medium: "#FFA500",
    low: "#00FF00",
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      className={`board-card ${isDragging ? "dragging" : ""}`}
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
    >
      <div className="board-card-header">
        {item.priority && (
          <span
            className="card-priority"
            style={{ borderColor: priorityColors[item.priority] }}
          >
            {item.priority.toUpperCase()}
          </span>
        )}
        {item.type === "habit" && item.streak > 0 && (
          <span className="card-streak">
            {renderIcon(Icons.streak, 14)} {item.streak}
          </span>
        )}
      </div>

      {isEditing ? (
        <input
          type="text"
          className="card-edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setIsEditing(false);
              setEditValue(item.title);
            }
          }}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <h4
          className="card-title"
          onClick={() => setIsEditing(true)}
          title="Click to edit"
        >
          {item.title}
        </h4>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="card-tags">
          {item.tags.map((tag, index) => (
            <span key={index} className="card-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="card-footer">
        {item.dueDate && (
          <span className="card-due-date">
            📅 {formatDate(item.dueDate)}
          </span>
        )}
        <button
          className="card-delete-btn"
          onClick={() => onDelete(item.id)}
          title="Delete"
        >
          {renderIcon(Icons.delete, 16)}
        </button>
      </div>
    </div>
  );
}
