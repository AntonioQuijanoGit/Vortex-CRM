import React from "react";
import { useTodos } from "../../../hooks/useTodos";
import { Icons, renderIcon } from "../../../utils/icons";
import "./PagePreview.css";

export default function PagePreview({ page, getChildren }) {
  const { todos } = useTodos(page.id);
  const children = getChildren ? getChildren(page.id) : [];
  const tasks = todos.filter(t => t.type === "task");
  const habits = todos.filter(t => t.type === "habit");
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeHabits = habits.filter(h => !h.completed).length;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="page-preview">
      <div className="page-preview-header">
        <div className="page-preview-icon">{renderIcon(page.icon || Icons.page, 20)}</div>
        <div className="page-preview-title">{page.title}</div>
      </div>
      
      <div className="page-preview-content">
        {page.type === "database" && (
          <div className="page-preview-stats">
            <div className="preview-stat">
              <span className="preview-stat-icon">{renderIcon(Icons.task, 14)}</span>
              <span className="preview-stat-value">{tasks.length}</span>
              <span className="preview-stat-label">tasks</span>
            </div>
            <div className="preview-stat">
              <span className="preview-stat-icon">{renderIcon(Icons.habit, 14)}</span>
              <span className="preview-stat-value">{habits.length}</span>
              <span className="preview-stat-label">habits</span>
            </div>
          </div>
        )}
        
        {page.type === "page" && (
          <div className="page-preview-info">
            {todos.length > 0 && (
              <div className="preview-info-item">
                <span className="preview-info-icon">{renderIcon(Icons.task, 14)}</span>
                <span>{todos.length} {todos.length === 1 ? 'item' : 'items'}</span>
              </div>
            )}
            {children.length > 0 && (
              <div className="preview-info-item">
                <span className="preview-info-icon">{renderIcon(Icons.page, 14)}</span>
                <span>{children.length} {children.length === 1 ? 'subpage' : 'subpages'}</span>
              </div>
            )}
            {todos.length === 0 && children.length === 0 && (
              <div className="preview-empty">Empty page</div>
            )}
          </div>
        )}
        
        {page.createdAt && (
          <div className="page-preview-meta">
            Created {formatDate(page.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
}

