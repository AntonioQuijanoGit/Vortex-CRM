import React, { useState, useEffect } from "react";
import { Icons } from "../../../utils/icons";
import { requestNotificationPermission, showNotification } from "../../../utils/notifications";
import { safeGetItem, safeSetItem } from "../../../utils/storage";
import "./Reminders.css";

export default function Reminders({ todos = [] }) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    return safeGetItem("reminders-enabled", false);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    requestNotificationPermission().then((granted) => {
      setPermissionGranted(granted);
      if (granted && !remindersEnabled) {
        // Auto-enable if permission is granted
        setRemindersEnabled(true);
        safeSetItem("reminders-enabled", true);
      }
    });
  }, []);

  useEffect(() => {
    safeSetItem("reminders-enabled", remindersEnabled);
  }, [remindersEnabled]);

  const handleToggleReminders = async () => {
    if (!permissionGranted) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setPermissionGranted(true);
        setRemindersEnabled(true);
      } else {
        showNotification("Please enable notifications in your browser settings", {
          body: "Go to your browser settings to enable notifications for this site.",
        });
      }
    } else {
      setRemindersEnabled(!remindersEnabled);
    }
  };

  const tasksWithDueDates = todos.filter(
    (todo) => todo.type === "task" && todo.dueDate && !todo.completed
  );

  const upcomingTasks = tasksWithDueDates
    .filter((task) => {
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return dueDate >= now && dueDate <= tomorrow;
    })
    .slice(0, 5);

  if (!permissionGranted && !remindersEnabled) {
    return null; // Don't show if no permission
  }

  return (
    <div className="reminders-widget">
      <div className="reminders-header">
        <div className="reminders-title">
          <span className="reminders-icon">{Icons.alert}</span>
          <span>Reminders</span>
        </div>
        <button
          className={`reminders-toggle ${remindersEnabled ? "enabled" : ""}`}
          onClick={handleToggleReminders}
          title={remindersEnabled ? "Disable reminders" : "Enable reminders"}
        >
          {remindersEnabled ? Icons.check : "○"}
        </button>
      </div>

      {remindersEnabled && (
        <div className="reminders-content">
          {upcomingTasks.length > 0 ? (
            <div className="reminders-list">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="reminder-item">
                  <span className="reminder-icon">{Icons.task}</span>
                  <div className="reminder-info">
                    <div className="reminder-title">{task.title}</div>
                    <div className="reminder-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="reminders-empty">
              <p>No upcoming tasks with due dates</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

