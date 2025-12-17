import React, { useState } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import "./TableView.css";

export default function TableView({
  todos,
  onUpdate,
  onDelete,
  onToggleComplete,
  onUpdateProperties,
}) {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleCellClick = (todoId, field, currentValue) => {
    setEditingCell({ todoId, field });
    setEditValue(currentValue || "");
  };

  const handleCellSave = (todoId, field) => {
    if (field === "title") {
      if (editValue.trim()) {
        onUpdate(todoId, editValue);
      }
    } else {
      onUpdateProperties(todoId, { [field]: editValue });
    }
    setEditingCell(null);
  };

  const handlePropertyChange = (todoId, field, value) => {
    onUpdateProperties(todoId, { [field]: value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="table-view-wrapper">
      <div className="table-view">
        <table className="data-table">
          <thead>
            <tr>
              <th className="col-checkbox">{renderIcon(Icons.check, 16)}</th>
              <th className="col-title">Title</th>
              <th className="col-status">Status</th>
              <th className="col-priority">Priority</th>
              <th className="col-type">Type</th>
              <th className="col-tags">Tags</th>
              <th className="col-due-date">Due Date</th>
              <th className="col-created">Created</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 ? (
              <tr>
                <td colSpan="9" className="table-empty">
                  No items to display
                </td>
              </tr>
            ) : (
              todos.map((todo) => (
                <tr key={todo.id} className={todo.completed ? "row-completed" : ""}>
                  {/* Checkbox */}
                  <td className="col-checkbox">
                    <button
                      className={`table-checkbox ${todo.completed ? "checked" : ""}`}
                      onClick={() => onToggleComplete(todo.id)}
                    >
                      {todo.completed && renderIcon(Icons.check, 16)}
                    </button>
                  </td>

                  {/* Title */}
                  <td className="col-title">
                    {editingCell?.todoId === todo.id && editingCell?.field === "title" ? (
                      <input
                        type="text"
                        className="table-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCellSave(todo.id, "title");
                          if (e.key === "Escape") setEditingCell(null);
                        }}
                        onBlur={() => handleCellSave(todo.id, "title")}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="table-cell-content"
                        onClick={() => handleCellClick(todo.id, "title", todo.title)}
                      >
                        {todo.title}
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="col-status">
                    <select
                      className="table-select"
                      value={todo.status || "todo"}
                      onChange={(e) => handlePropertyChange(todo.id, "status", e.target.value)}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>

                  {/* Priority */}
                  <td className="col-priority">
                    <select
                      className="table-select"
                      value={todo.priority || ""}
                      onChange={(e) => handlePropertyChange(todo.id, "priority", e.target.value || null)}
                    >
                      <option value="">None</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </td>

                  {/* Type */}
                  <td className="col-type">
                    <span className={`type-badge ${todo.type}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {renderIcon(todo.type === "habit" ? Icons.habit : Icons.task, 14)}
                      {todo.type === "habit" ? "Habit" : "Task"}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="col-tags">
                    {editingCell?.todoId === todo.id && editingCell?.field === "tags" ? (
                      <input
                        type="text"
                        className="table-input"
                        placeholder="tag1, tag2"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const tags = editValue.split(",").map((t) => t.trim()).filter((t) => t);
                            handlePropertyChange(todo.id, "tags", tags);
                            setEditingCell(null);
                          }
                          if (e.key === "Escape") setEditingCell(null);
                        }}
                        onBlur={() => {
                          const tags = editValue.split(",").map((t) => t.trim()).filter((t) => t);
                          handlePropertyChange(todo.id, "tags", tags);
                          setEditingCell(null);
                        }}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="table-cell-content"
                        onClick={() =>
                          handleCellClick(todo.id, "tags", (todo.tags || []).join(", "))
                        }
                      >
                        {todo.tags && todo.tags.length > 0
                          ? todo.tags.join(", ")
                          : "-"}
                      </span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="col-due-date">
                    <input
                      type="date"
                      className="table-date-input"
                      value={todo.dueDate ? todo.dueDate.split("T")[0] : ""}
                      onChange={(e) =>
                        handlePropertyChange(todo.id, "dueDate", e.target.value ? new Date(e.target.value).toISOString() : null)
                      }
                    />
                  </td>

                  {/* Created */}
                  <td className="col-created">
                    <span className="table-date">{formatDate(todo.createdAt)}</span>
                  </td>

                  {/* Actions */}
                  <td className="col-actions">
                    <button
                      className="table-delete-btn"
                      onClick={() => onDelete(todo.id)}
                      title="Delete"
                    >
                      {renderIcon(Icons.delete, 16)}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
