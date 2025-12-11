import React, { useState, useMemo } from "react";
import { usePages } from "../../hooks/usePages";
import DashboardCalendar from "./DashboardCalendar";
import { Icons } from "../../utils/icons";
import { safeGetItem } from "../../utils/storage";
import { getAllTodosWithPages } from "../../utils/todos";
import { useToast } from "../../hooks/useToast";
import { logger } from "../../utils/logger";
import OrphanedItems from "../shared/OrphanedItems/OrphanedItems";
import { DataExportImport, ProgressCircle, MiniLineChart, ActivityHeatmap } from "../shared";
import "./Dashboard.css";

export default function Dashboard({ onNavigate }) {
  const { getRootPages, getPage } = usePages();
  const { showToast } = useToast();
  const [showOrphanedItems, setShowOrphanedItems] = useState(false);
  const [showDataExportImport, setShowDataExportImport] = useState(false);

  const rootPages = getRootPages();

  // Use centralized utility to get all todos with page info
  const allTodosWithPages = getAllTodosWithPages(getPage);
  const allTodos = allTodosWithPages.map(({ pageId, pageTitle, ...todo }) => todo);
  const tasks = allTodos.filter((t) => t.type === "task");
  const habits = allTodos.filter((t) => t.type === "habit");
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalStreaks = habits.reduce((sum, h) => sum + (h.streak || 0), 0);

  // Calculate completion percentage
  const completionPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  // Generate trend data for last 7 days
  const trendData = useMemo(() => {
    const days = 7;
    const today = new Date();
    const trend = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      // Count completed tasks for this day
      const dayTasks = tasks.filter((t) => {
        if (!t.completedAt) return false;
        const taskDate = new Date(t.completedAt).toISOString().split("T")[0];
        return taskDate === dateStr;
      });
      
      trend.push(dayTasks.length);
    }
    
    return trend;
  }, [tasks]);

  // Prepare activity data for heatmap
  const activityData = useMemo(() => {
    return allTodos
      .filter((todo) => todo.completedAt || todo.createdAt)
      .map((todo) => ({
        date: todo.completedAt || todo.createdAt,
        createdAt: todo.createdAt,
        completedAt: todo.completedAt,
      }));
  }, [allTodos]);

  // Movies functionality has been removed, so we don't count them anymore

  // Only show stats that have content
  const stats = [
    {
      label: "Total Pages",
      value: rootPages.length,
      icon: null,
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
  ];

  const quickLinks = rootPages.slice(0, 6).map((page) => ({
    ...page,
    onClick: () => onNavigate(page.id),
  }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="dashboard-hero-stats">
              {stats.slice(0, 3).map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <div className="hero-stat-value">{stat.value}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
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

      {/* Visual Data Section - Always visible */}
      <div className="dashboard-visual-data">
        <div className="visual-data-grid">
          {tasks.length > 0 ? (
            <div className="visual-data-card">
              <h3 className="visual-data-title">Task Completion</h3>
              <div className="visual-data-content">
                <ProgressCircle
                  percentage={completionPercentage}
                  size={140}
                  strokeWidth={10}
                  color="var(--color-success)"
                  showPercentage={true}
                />
                <div className="visual-data-stats">
                  <div className="visual-stat">
                    <span className="visual-stat-value">{completedTasks}</span>
                    <span className="visual-stat-label">Completed</span>
                  </div>
                  <div className="visual-stat">
                    <span className="visual-stat-value">{tasks.length - completedTasks}</span>
                    <span className="visual-stat-label">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="visual-data-card">
              <h3 className="visual-data-title">Task Completion</h3>
              <div className="visual-data-content">
                <ProgressCircle
                  percentage={0}
                  size={140}
                  strokeWidth={10}
                  color="var(--color-muted)"
                  showPercentage={true}
                />
                <div className="visual-data-stats">
                  <div className="visual-stat">
                    <span className="visual-stat-value">0</span>
                    <span className="visual-stat-label">Completed</span>
                  </div>
                  <div className="visual-stat">
                    <span className="visual-stat-value">0</span>
                    <span className="visual-stat-label">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {trendData.length > 0 ? (
            <div className="visual-data-card">
              <h3 className="visual-data-title">7-Day Trend</h3>
              <div className="visual-data-content">
                <MiniLineChart
                  data={trendData}
                  width={240}
                  height={100}
                  color="var(--color-info)"
                  showPoints={true}
                />
                <div className="visual-data-stats">
                  <div className="visual-stat">
                    <span className="visual-stat-value">{trendData.reduce((a, b) => a + b, 0)}</span>
                    <span className="visual-stat-label">This Week</span>
                  </div>
                  <div className="visual-stat">
                    <span className="visual-stat-value">{Math.max(...trendData)}</span>
                    <span className="visual-stat-label">Peak Day</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="visual-data-card">
              <h3 className="visual-data-title">7-Day Trend</h3>
              <div className="visual-data-content">
                <MiniLineChart
                  data={[0, 0, 0, 0, 0, 0, 0]}
                  width={240}
                  height={100}
                  color="var(--color-muted)"
                  showPoints={true}
                />
                <div className="visual-data-stats">
                  <div className="visual-stat">
                    <span className="visual-stat-value">0</span>
                    <span className="visual-stat-label">This Week</span>
                  </div>
                  <div className="visual-stat">
                    <span className="visual-stat-value">0</span>
                    <span className="visual-stat-label">Peak Day</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activityData.length > 0 ? (
            <div className="visual-data-card heatmap-card">
              <ActivityHeatmap data={activityData} days={90} />
            </div>
          ) : (
            <div className="visual-data-card heatmap-card">
              <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--color-muted)' }}>
                <p>No activity data yet. Start creating tasks and habits to see your activity!</p>
              </div>
            </div>
          )}
        </div>
      </div>

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
              {allTodosWithPages.slice(0, 5).map((todo) => {
                // Allow navigation if we have a pageId, even if title is "Unknown Page"
                // The page might exist but just not be found in the current state
                const isClickable = todo.pageId && todo.pageTitle !== "Orphaned";
                const handleClick = () => {
                  if (isClickable && todo.pageId) {
                    // Verify the page exists before navigating
                    const page = getPage(todo.pageId);
                    if (page) {
                      onNavigate(todo.pageId);
                    } else {
                      // Page doesn't exist - try to find it in localStorage
                      const allPages = safeGetItem("notion-pages", []);
                      const foundPage = allPages.find(p => p.id === todo.pageId);
                      if (foundPage) {
                        // Page exists in localStorage but not in state - navigate anyway
                        // The state should update on next render
                        onNavigate(todo.pageId);
                      } else {
                        // Page truly doesn't exist - show toast and open orphaned items
                        logger.warn(`Page ${todo.pageId} not found. Todo: ${todo.title}`);
                        showToast(`The page containing "${todo.title}" no longer exists. Opening Orphaned Items...`, "warning", 3000);
                        setTimeout(() => setShowOrphanedItems(true), 500);
                      }
                    }
                  }
                };
                return (
                  <button
                    key={todo.id}
                    className={`activity-item-modern ${isClickable ? "activity-item-clickable" : ""}`}
                    onClick={handleClick}
                    disabled={!isClickable}
                    title={isClickable ? (todo.pageTitle !== "Unknown Page" ? `Go to ${todo.pageTitle}` : `Go to page (ID: ${todo.pageId})`) : "Item without associated page"}
                  >
                    <div className={`activity-icon-modern activity-icon-${todo.type} ${todo.completed ? "completed" : ""}`}>
                      {todo.type === "task" ? Icons.task : Icons.habit}
                    </div>
                    <div className="activity-content">
                      <div className="activity-text-modern">
                        <span className="activity-action">
                          {todo.completed ? "Completed" : "Created"}
                        </span>{" "}
                        <strong className="activity-title">{todo.title}</strong>
                      </div>
                      <div className="activity-meta">
                        <span className={`activity-type-modern activity-type-${todo.type}`}>
                          {todo.type}
                        </span>
                        {todo.pageTitle && todo.pageId && (
                          <>
                            <span className="activity-separator">•</span>
                            <span className="activity-page" title={todo.pageTitle !== "Unknown Page" ? `In page: ${todo.pageTitle}` : `Page ID: ${todo.pageId}`}>
                              {todo.pageTitle !== "Unknown Page" ? todo.pageTitle : "Page"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {isClickable && (
                      <div className="activity-arrow">{Icons.arrowRight}</div>
                    )}
                  </button>
                );
              })}
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
      
      {/* Data Export/Import Section */}
      <section className="dashboard-section-modern">
        <div className="section-header">
          <h2 className="section-title-modern">Data Management</h2>
          <p className="section-subtitle">Export or import your data</p>
        </div>
        <button
          className="dashboard-button-modern"
          onClick={() => setShowDataExportImport(true)}
          aria-label="Export or import data"
        >
          <span className="button-icon">{Icons.arrowDown}</span>
          <span className="button-text">Export / Import Data</span>
        </button>
      </section>
      
      {showOrphanedItems && (
        <OrphanedItems
          onNavigate={onNavigate}
          onClose={() => setShowOrphanedItems(false)}
        />
      )}
      
      {showDataExportImport && (
        <div className="modal-overlay" onClick={() => setShowDataExportImport(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <DataExportImport onClose={() => setShowDataExportImport(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
