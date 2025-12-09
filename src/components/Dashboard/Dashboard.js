import React from "react";
import { usePages } from "../../hooks/usePages";
import DashboardCalendar from "./DashboardCalendar";
import { Icons } from "../../utils/icons";
import "./Dashboard.css";

export default function Dashboard({ onNavigate }) {
  const { getRootPages } = usePages();

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
  const tasks = allTodos.filter((t) => t.type === "task");
  const habits = allTodos.filter((t) => t.type === "habit");
  const completedTasks = tasks.filter((t) => t.completed).length;
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
  const totalMovies = allMovies.length;

  // Only show stats that have content
  const stats = [
    {
      label: "Total Pages",
      value: rootPages.length,
      icon: Icons.page,
      color: "var(--color-accent)",
    },
    ...(tasks.length > 0
      ? [
          {
            label: "Total Tasks",
            value: tasks.length,
            icon: Icons.task,
            color: "var(--color-accent)",
          },
        ]
      : []),
    ...(completedTasks > 0
      ? [
          {
            label: "Completed",
            value: completedTasks,
            icon: Icons.completed,
            color: "var(--color-success)",
          },
        ]
      : []),
    ...(habits.length > 0
      ? [
          {
            label: "Active Habits",
            value: habits.length,
            icon: Icons.habit,
            color: "var(--color-accent)",
          },
        ]
      : []),
    ...(totalStreaks > 0
      ? [
          {
            label: "Total Streaks",
            value: totalStreaks,
            icon: Icons.streak,
            color: "var(--color-warning)",
          },
        ]
      : []),
    ...(totalMovies > 0
      ? [
          {
            label: "Movies",
            value: totalMovies,
            icon: Icons.movie,
            color: "var(--color-accent)",
          },
        ]
      : []),
  ];

  const quickLinks = rootPages.slice(0, 6).map((page) => ({
    ...page,
    onClick: () => onNavigate(page.id),
  }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <h1 className="dashboard-title">Welcome back</h1>
          <p className="dashboard-subtitle">
            Here's what's happening in your workspace
          </p>
        </div>
        <div className="dashboard-hero-stats">
          {stats.slice(0, 3).map((stat) => (
            <div key={stat.label} className="hero-stat">
              <div className="hero-stat-value">{stat.value}</div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {stats.length > 3 && (
        <div className="dashboard-stats-grid">
          {stats.slice(3).map((stat) => (
            <div key={stat.label} className="stat-card-modern">
              <div className="stat-card-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{stat.value}</div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-main-content">
        {quickLinks.length > 0 && (
          <section className="dashboard-section-modern">
            <div className="section-header">
              <h2 className="section-title-modern">Quick Access</h2>
              <p className="section-subtitle">Jump to your pages</p>
            </div>
            <div className="quick-links-modern">
              {quickLinks.map((page) => (
                <button
                  key={page.id}
                  className="quick-link-modern"
                  onClick={page.onClick}
                >
                  <div className="quick-link-info">
                    <div className="quick-link-title-modern">{page.title}</div>
                  </div>
                  <div className="quick-link-arrow">{Icons.arrowRight}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {allTodos.length > 0 && (
          <section className="dashboard-section-modern">
            <div className="section-header">
              <h2 className="section-title-modern">Recent Activity</h2>
              <p className="section-subtitle">Your latest updates</p>
            </div>
            <div className="activity-list-modern">
              {allTodos.slice(0, 5).map((todo) => (
                <div key={todo.id} className="activity-item-modern">
                  <div className="activity-icon-modern">
                    {todo.type === "task" ? Icons.task : Icons.habit}
                  </div>
                  <div className="activity-content">
                    <div className="activity-text-modern">
                      {todo.completed ? "Completed" : "Created"}{" "}
                      <strong>{todo.title}</strong>
                    </div>
                    <div className="activity-meta">
                      <span className="activity-type-modern">{todo.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Calendar at the bottom */}
      <section className="dashboard-section-modern dashboard-calendar-section">
        <div className="section-header">
          <h2 className="section-title-modern">Calendar</h2>
          <p className="section-subtitle">Your schedule and events</p>
        </div>
        <DashboardCalendar todos={allTodos} onNavigate={onNavigate} />
      </section>
    </div>
  );
}
