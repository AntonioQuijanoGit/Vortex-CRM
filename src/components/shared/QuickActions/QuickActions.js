import React from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import "./QuickActions.css";

export default function QuickActions({ onNavigate, onAddPage, onShowAchievements, onShowFocusTimer }) {
  const quickActions = [
    {
      id: "new-page",
      icon: Icons.add,
      title: "New Page",
      description: "Create a new page",
      onClick: () => {
        try {
          const newPage = onAddPage("", null, "page");
          if (newPage && newPage.id) {
            onNavigate(newPage.id);
          }
        } catch (error) {
          console.error("Error creating page:", error);
        }
      },
      color: "primary",
    },
    {
      id: "new-database",
      icon: Icons.database,
      title: "New Database",
      description: "Create a database view",
      onClick: () => {
        try {
          const newPage = onAddPage("", null, "database");
          if (newPage && newPage.id) {
            onNavigate(newPage.id);
          }
        } catch (error) {
          console.error("Error creating database:", error);
        }
      },
      color: "info",
    },
    {
      id: "achievements",
      icon: Icons.streak,
      title: "Achievements",
      description: "View your progress",
      onClick: () => onShowAchievements && onShowAchievements(),
      color: "success",
    },
    {
      id: "focus-timer",
      icon: Icons.calendar,
      title: "Focus Timer",
      description: "Start a pomodoro",
      onClick: () => onShowFocusTimer && onShowFocusTimer(),
      color: "accent",
    },
  ];

  return (
    <div className="quick-actions">
      {quickActions.map((action) => (
        <button
          key={action.id}
          className={`quick-action-card quick-action-${action.color}`}
          onClick={action.onClick}
          aria-label={action.title}
          title={action.description}
        >
          <div className="quick-action-icon-wrapper">
            <span className="quick-action-icon">{renderIcon(action.icon, 24)}</span>
          </div>
          <span className="quick-action-title">{action.title}</span>
        </button>
      ))}
    </div>
  );
}

