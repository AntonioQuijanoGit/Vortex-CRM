import React, { useState } from "react";
import BoardCard from "./BoardCard";
import { Icons } from "../utils/icons";
import "./BoardView.css";

export default function BoardView({ todos, onUpdate, onDelete, onToggleComplete, onUpdateProperties }) {
  const [draggedItem, setDraggedItem] = useState(null);

  // Group todos by status
  const columns = {
    todo: {
      id: "todo",
      title: "To Do",
      icon: Icons.todo,
      items: todos.filter((t) => t.status === "todo"),
    },
    "in-progress": {
      id: "in-progress",
      title: "In Progress",
      icon: Icons.inProgress,
      items: todos.filter((t) => t.status === "in-progress"),
    },
    done: {
      id: "done",
      title: "Done",
      icon: Icons.done,
      items: todos.filter((t) => t.status === "done" || t.completed),
    },
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== columnId) {
      onUpdateProperties(draggedItem.id, {
        status: columnId,
        completed: columnId === "done"
      });
    }
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="board-view">
      {Object.values(columns).map((column) => (
        <div
          key={column.id}
          className="board-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="board-column-header">
            <span className="column-icon">{column.icon}</span>
            <h3 className="column-title">{column.title}</h3>
            <span className="column-count">{column.items.length}</span>
          </div>

          <div className="board-column-content">
            {column.items.length === 0 ? (
              <div className="board-empty-state">
                <p>Drop tasks here</p>
              </div>
            ) : (
              column.items.map((item) => (
                <BoardCard
                  key={item.id}
                  item={item}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedItem?.id === item.id}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                  onUpdateProperties={onUpdateProperties}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
