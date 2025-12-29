import React, { useMemo } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import "./DashboardWidgets.css";

export default function UpcomingDeadlinesWidget({ todos }) {
  const upcomingTasks = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return todos
      .filter((todo) => {
        if (todo.type !== "task" || todo.completed || !todo.dueDate) return false;
        const dueDate = new Date(todo.dueDate);
        return dueDate >= now && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [todos]);

  if (upcomingTasks.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  return (
    <div className="dashboard-widget">
      <div className="widget-header">
        <span className="widget-icon">{renderIcon(Icons.date, 20)}</span>
        <h3 className="widget-title">Upcoming Deadlines</h3>
      </div>
      <div className="widget-content">
        <div className="widget-deadlines-list">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="widget-deadline-item">
              <div className="widget-deadline-date">
                {formatDate(task.dueDate)}
              </div>
              <div className="widget-deadline-title">{task.title}</div>
              {task.priority && (
                <span className={`widget-task-priority priority-${task.priority}`}>
                  {task.priority}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

