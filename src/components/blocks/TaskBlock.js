import React from "react";
import TodoApp from "../todoApp";
import "./Block.css";

export default function TaskBlock({ pageId, data, onUpdate }) {
  return (
    <div className="block task-block">
      <div className="block-header">
        <span className="block-icon">✓</span>
        <h3 className="block-title">Tasks</h3>
      </div>
      <TodoApp pageId={pageId ? `${pageId}-tasks` : "tasks"} viewType="list" />
    </div>
  );
}

