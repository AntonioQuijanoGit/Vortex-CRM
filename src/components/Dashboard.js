import React from "react";
import { useTodos } from "../hooks/useTodos";
import { usePages } from "../hooks/usePages";
import DashboardCalendar from "./DashboardCalendar";
import "./Dashboard.css";

export default function Dashboard({ onNavigate }) {
  const { pages, getRootPages } = usePages();

  const rootPages = getRootPages();

  // Sum all todos from all pages
  const getAllTodos = () => {
    let allTodos = [];
    // Check legacy "todos" key for backward compatibility
    const legacyTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    allTodos = [...legacyTodos];
    
    // Get all todos from pages (keys like "todos-{pageId}")
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("todos-")) {
        const pageTodos = JSON.parse(localStorage.getItem(key) || "[]");
        allTodos = [...allTodos, ...pageTodos];
      }
    }
    return allTodos;
  };

  const allTodos = getAllTodos();
  const tasks = allTodos.filter(t => t.type === "task");
  const habits = allTodos.filter(t => t.type === "habit");
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeStreaks = habits.filter(h => (h.streak || 0) > 0).length;
  const totalStreaks = habits.reduce((sum, h) => sum + (h.streak || 0), 0);

  // Sum all movies from all pages
  const getAllMovies = () => {
    let allMovies = [];
    // Check legacy "movies" key for backward compatibility
    const legacyMovies = JSON.parse(localStorage.getItem("movies") || "[]");
    allMovies = [...legacyMovies];
    
    // Get all movies from pages (keys like "movies-{pageId}")
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("movies-")) {
        const pageMovies = JSON.parse(localStorage.getItem(key) || "[]");
        allMovies = [...allMovies, ...pageMovies];
      }
    }
    return allMovies;
  };
  
  const allMovies = getAllMovies();
  const watchedMovies = allMovies.filter(m => m.watched).length;
  const totalMovies = allMovies.length;

  // Only show stats that have content
  const stats = [
    {
      label: "Total Pages",
      value: rootPages.length,
      icon: "📄",
      color: "var(--color-accent)"
    },
    ...(tasks.length > 0 ? [{
      label: "Total Tasks",
      value: tasks.length,
      icon: "✓",
      color: "var(--color-accent)"
    }] : []),
    ...(completedTasks > 0 ? [{
      label: "Completed",
      value: completedTasks,
      icon: "✓",
      color: "var(--color-success)"
    }] : []),
    ...(habits.length > 0 ? [{
      label: "Active Habits",
      value: habits.length,
      icon: "↻",
      color: "var(--color-accent)"
    }] : []),
    ...(totalStreaks > 0 ? [{
      label: "Total Streaks",
      value: totalStreaks,
      icon: "🔥",
      color: "var(--color-warning)"
    }] : []),
    ...(totalMovies > 0 ? [{
      label: "Movies",
      value: totalMovies,
      icon: "🎬",
      color: "var(--color-accent)"
    }] : [])
  ];

  const quickLinks = rootPages.slice(0, 6).map(page => ({
    ...page,
    onClick: () => onNavigate(page.id)
  }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your workspace</p>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat, index) => (
          <div 
            key={stat.label} 
            className="stat-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <section className="dashboard-section dashboard-calendar-section">
          <DashboardCalendar todos={allTodos} onNavigate={onNavigate} />
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Quick Access</h2>
          <div className="quick-links-grid">
            {quickLinks.map((page) => (
              <button
                key={page.id}
                className="quick-link-card"
                onClick={page.onClick}
              >
                <span className="quick-link-icon">{page.icon}</span>
                <span className="quick-link-title">{page.title}</span>
                {page.type === "database" && (
                  <span className="quick-link-badge">{page.viewType}</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {allTodos.length > 0 ? (
              allTodos.slice(0, 5).map((todo) => (
                <div key={todo.id} className="activity-item">
                  <span className="activity-icon">
                    {todo.type === "task" ? "✓" : "↻"}
                  </span>
                  <span className="activity-text">
                    {todo.completed ? "Completed" : "Created"} {todo.title}
                  </span>
                  <span className="activity-type">{todo.type}</span>
                </div>
              ))
            ) : (
              <p className="activity-empty">No recent activity</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

