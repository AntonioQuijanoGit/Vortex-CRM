import React from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import "./DashboardWidgets.css";

export default function TodayTasksWidget({ todos, onNavigate }) {
  const today = new Date().toDateString();
  const todayTasks = todos.filter((todo) => {
    if (todo.type !== "task" || todo.completed) return false;
    if (todo.dueDate) {
      return new Date(todo.dueDate).toDateString() === today;
    }
    return new Date(todo.createdAt).toDateString() === today;
  });

  if (todayTasks.length === 0) {
    return (
      <div className="dashboard-widget">
        <div className="widget-header">
          <h3 className="widget-title">Today's Tasks</h3>
        </div>
        <div className="widget-content">
          <p className="widget-empty">No tasks for today! 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-widget">
      <div className="widget-header">
        <h3 className="widget-title">Today's Tasks ({todayTasks.length})</h3>
      </div>
      <div className="widget-content">
        <div className="widget-tasks-list">
          {todayTasks.slice(0, 5).map((task) => (
            <div key={task.id} className="widget-task-item">
              <span className="widget-task-icon">{renderIcon(Icons.task, 16)}</span>
              <span className="widget-task-title">{task.title}</span>
              {task.priority && (
                <span className={`widget-task-priority priority-${task.priority}`}>
                  {task.priority}
                </span>
              )}
            </div>
          ))}
          {todayTasks.length > 5 && (
            <div className="widget-more">
              +{todayTasks.length - 5} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

