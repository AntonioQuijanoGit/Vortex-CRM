import React, { useState, useMemo, useEffect } from "react";
import { usePages } from "../../hooks/usePages";
import DashboardCalendar from "./DashboardCalendar";
import { Icons, renderIcon } from "../../utils/icons";
import { safeGetItem, safeSetItem } from "../../utils/storage";
import { getAllTodosWithPages } from "../../utils/todos";
import { useToast } from "../../hooks/useToast";
import { logger } from "../../utils/logger";
import OrphanedItems from "../shared/OrphanedItems/OrphanedItems";
import { DataExportImport, ProgressCircle, MiniLineChart, ActivityHeatmap, TemplateSelector, Achievements, QuickActions, FocusTimer, EmptyStateEnhanced } from "../shared";
import { TodayTasksWidget, UpcomingDeadlinesWidget } from "../shared/DashboardWidgets";
import { applyTemplates } from "../../utils/templates";
import { applyExampleTemplate } from "../../utils/exampleTemplates";
import "./Dashboard.css";

export default function Dashboard({ onNavigate }) {
  const { getRootPages, getPage, addPage, updatePage } = usePages();
  const { showToast } = useToast();
  const [showOrphanedItems, setShowOrphanedItems] = useState(false);
  const [showDataExportImport, setShowDataExportImport] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);

  const rootPages = getRootPages();

  // Use centralized utility to get all todos with page info - memoized for performance
  const allTodosWithPages = useMemo(() => getAllTodosWithPages(getPage), [getPage]);
  const allTodos = useMemo(() => 
    allTodosWithPages.map(({ pageId, pageTitle, ...todo }) => todo),
    [allTodosWithPages]
  );
  
  // Check if we should show template selector
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const templatesApplied = safeGetItem("templates-applied", false);
    const hasSeenTutorial = safeGetItem("has-seen-tutorial", false);
    
    // Show template selector if:
    // - Templates haven't been applied
    // - User has seen tutorial (so they know what they're doing)
    // - App is empty (no pages except home, no todos)
    if (!templatesApplied && hasSeenTutorial && rootPages.length <= 1 && allTodos.length === 0) {
      // Small delay to let the page render
      setTimeout(() => {
        setShowTemplateSelector(true);
      }, 1000);
    }
  }, [rootPages.length, allTodos.length]);

  // Handle template application
  const handleApplyTemplates = async () => {
    try {
      await applyTemplates(addPage, updatePage);
      showToast("Templates applied! Explore the example pages.", "success");
      setShowTemplateSelector(false);
      // Force re-render by updating a key or triggering state update
      // Note: Templates system may require a reload due to complex state dependencies
      // TODO: Refactor to avoid reload in future
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      logger.error("Error applying templates:", error);
      showToast("Error applying templates. Please try again.", "error");
    }
  };
  
  const handleSkipTemplates = () => {
    safeSetItem("templates-applied", "skipped");
    setShowTemplateSelector(false);
  };
  const tasks = allTodos.filter((t) => t.type === "task");
  const habits = allTodos.filter((t) => t.type === "habit");
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const activeStreaks = habits.filter((h) => (h.streak || 0) > 0).length;
  const totalStreaks = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;
  
  // Prepare stats for achievements
  const achievementStats = useMemo(() => {
    const unlockedAchievements = safeGetItem("achievements-unlocked", []);
    const completedWeeklyGoals = safeGetItem("completed-weekly-goals", 0);
    
    return {
      completedTasks,
      totalHabits: habits.length,
      maxStreak,
      totalPages: rootPages.length,
      completedWeeklyGoals,
      unlockedAchievements: unlockedAchievements.length,
    };
  }, [completedTasks, habits.length, maxStreak, rootPages.length]);

  // Calculate completion percentage
  const completionPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  const todayStr = new Date().toISOString().split("T")[0];
  const completedToday = tasks.filter(
    (t) => t.completedAt && new Date(t.completedAt).toISOString().startsWith(todayStr)
  ).length;
  const createdThisWeek = allTodos.filter((t) => {
    if (!t.createdAt) return false;
    const created = new Date(t.createdAt);
    const diff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  // Activity summary for heatmap (90d)
  const heatmapDays = 90;

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

  // Prepare activity data for heatmap (created/completed)
  const activityData = useMemo(() => {
    const activities = [];
    allTodos.forEach((todo) => {
      if (todo.completedAt) {
        activities.push({ date: todo.completedAt, type: "completed" });
      }
      if (todo.createdAt) {
        activities.push({ date: todo.createdAt, type: "created" });
      }
    });
    return activities;
  }, [allTodos]);

  const activitySummary = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (heatmapDays - 1));
    let created = 0;
    let completed = 0;
    let mostActiveDay = null;
    let mostActiveTotal = 0;
    const perDay = new Map();

    activityData.forEach(({ date, type }) => {
      if (!date) return;
      const d = new Date(date);
      if (isNaN(d.getTime()) || d < cutoff) return;
      const key = d.toISOString().split("T")[0];
      if (!perDay.has(key)) perDay.set(key, { created: 0, completed: 0 });
      const entry = perDay.get(key);
      if (type === "created") {
        entry.created += 1;
        created += 1;
      }
      if (type === "completed") {
        entry.completed += 1;
        completed += 1;
      }
      const total = entry.created + entry.completed;
      if (total > mostActiveTotal) {
        mostActiveTotal = total;
        mostActiveDay = key;
      }
    });

    return { created, completed, mostActiveDay, mostActiveTotal };
  }, [activityData]);

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

  const isEmptyWorkspace = rootPages.length <= 1 && allTodos.length === 0;
  const hasQuickActions = rootPages.length > 1 || allTodos.length > 0;

  const kpiItems = [
    { label: "Pending tasks", value: pendingTasks, icon: Icons.task },
    { label: "Done today", value: completedToday, icon: Icons.completed },
    { label: "Active streaks", value: activeStreaks, icon: Icons.streak },
    { label: "New this week", value: createdThisWeek, icon: Icons.add },
  ];

  const smartSuggestions = [
    {
      title: "Plan tomorrow",
      desc: "Take 5 minutes to pick your top 3 tasks",
      icon: Icons.calendar,
    },
    {
      title: "Protect streaks",
      desc: "Mark active habits before streaks break",
      icon: Icons.streak,
    },
    {
      title: "Inbox zero (quick)",
      desc: "Capture ideas fast in Quick Notes",
      icon: Icons.note,
    },
  ];

  const starterTemplates = [
    { title: "Work", desc: "Tasks, meetings and deadlines", icon: Icons.briefcase },
    { title: "Personal", desc: "Habits, health and finances", icon: Icons.heart },
    { title: "Study", desc: "Courses, reading and review", icon: Icons.book },
  ];

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

      {/* Enhanced empty state with examples */}
      {isEmptyWorkspace && (
        <section className="dashboard-section-modern welcome-empty-state">
          <EmptyStateEnhanced
            onAction={() => {
              try {
                const newPage = addPage("My First Page", null, "page");
                if (newPage && newPage.id) {
                  onNavigate(newPage.id);
                }
              } catch (error) {
                logger.error("Error creating first page:", error);
                showToast("Error creating page. Please try again.", "error");
              }
            }}
            examples={[
              {
                id: 'work',
                title: 'Work Tasks',
                icon: Icons.briefcase,
                items: [
                  { type: 'task', title: 'Review pending emails', dueDate: null },
                  { type: 'task', title: 'Prepare client presentation', dueDate: null },
                  { type: 'habit', title: 'Daily productivity review', dueDate: null }
                ],
                description: 'Organize your work tasks'
              },
              {
                id: 'personal',
                title: 'Personal',
                icon: Icons.heart,
                items: [
                  { type: 'habit', title: 'Drink 2L water', dueDate: null },
                  { type: 'habit', title: 'Exercise 30 min', dueDate: null },
                  { type: 'task', title: 'Grocery shopping', dueDate: null }
                ],
                description: 'Keep healthy habits and personal tasks'
              },
              {
                id: 'study',
                title: 'Study',
                icon: Icons.book,
                items: [
                  { type: 'habit', title: 'Read 30 minutes', dueDate: null },
                  { type: 'task', title: 'Complete math homework', dueDate: null },
                  { type: 'task', title: 'Study for final exam', dueDate: null }
                ],
                description: 'Organize your learning and study habits'
              }
            ]}
            onUseExample={(example) => {
              try {
                applyExampleTemplate(example, addPage, onNavigate);
                showToast(`${example.title} created successfully!`, "success");
              } catch (error) {
                logger.error("Error applying example:", error);
                showToast("Error creating example. Please try again.", "error");
              }
            }}
          />
        </section>
      )}

      {/* Quick Actions prioritized near the top */}
      {hasQuickActions && (
        <section className="dashboard-section-modern dashboard-quick-actions-section">
          <div className="section-header">
            <h2 className="section-title-modern">Quick Actions</h2>
          </div>
          <QuickActions
            onNavigate={onNavigate}
            onAddPage={addPage}
            onShowAchievements={() => setShowAchievements(true)}
            onShowFocusTimer={() => setShowFocusTimer(true)}
          />
        </section>
      )}

      {/* KPI glance to fill whitespace and give context */}
      <section className="dashboard-section-modern kpi-bar">
        <div className="kpi-grid">
          {kpiItems.map((item) => (
            <div key={item.label} className="kpi-card">
              <div className="kpi-icon">{renderIcon(item.icon, 18)}</div>
              <div className="kpi-meta">
                <div className="kpi-value">{item.value}</div>
                <div className="kpi-label">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Today & Tomorrow strip */}
      <section className="dashboard-section-modern timeline-strip">
        <div className="timeline-grid">
          <div className="timeline-card">
            <div className="timeline-header">
              <span className="timeline-dot today"></span>
              <div>
                <div className="timeline-title">Today</div>
                <div className="timeline-subtitle">Immediate priorities</div>
              </div>
            </div>
            <ul className="timeline-list">
              <li>Review pending tasks ({pendingTasks})</li>
              <li>Check active habits ({activeStreaks} streaks)</li>
              <li>Run one short Focus Timer</li>
            </ul>
          </div>
          <div className="timeline-card">
            <div className="timeline-header">
              <span className="timeline-dot tomorrow"></span>
              <div>
                <div className="timeline-title">Tomorrow</div>
                <div className="timeline-subtitle">Quick prep</div>
              </div>
            </div>
            <ul className="timeline-list">
              <li>Plan 3 key tasks</li>
              <li>Schedule one focus block</li>
              <li>Check upcoming deadlines</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Focus first, then charts, then secondary stats */}
      <div className="dashboard-main-content">
        <section className="dashboard-section-modern dashboard-focus-section">
          <div className="section-header">
            <h2 className="section-title-modern">Today's Focus</h2>
            <p className="section-subtitle">What needs your attention today</p>
          </div>
          <div className="focus-content">
            <TodayTasksWidget todos={allTodos} onNavigate={onNavigate} />
            <UpcomingDeadlinesWidget todos={allTodos} />
          </div>
        </section>
      </div>

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

          <div className="visual-data-card">
            <h3 className="visual-data-title">Habit Streaks</h3>
            <div className="visual-data-content">
              <div className="visual-data-stats">
                <div className="visual-stat">
                  <span className="visual-stat-value">{activeStreaks}</span>
                  <span className="visual-stat-label">Active streaks</span>
                </div>
                <div className="visual-stat">
                  <span className="visual-stat-value">{maxStreak}</span>
                  <span className="visual-stat-label">Best streak</span>
                </div>
                <div className="visual-stat">
                  <span className="visual-stat-value">{totalStreaks}</span>
                  <span className="visual-stat-label">Total streak days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="visual-data-card">
            <h3 className="visual-data-title">Quick Focus</h3>
            <div className="visual-data-content">
              <div className="visual-data-stats">
                <div className="visual-stat">
                  <span className="visual-stat-value">{pendingTasks}</span>
                  <span className="visual-stat-label">Pending tasks</span>
                </div>
                <div className="visual-stat">
                  <span className="visual-stat-value">{completedToday}</span>
                  <span className="visual-stat-label">Done today</span>
                </div>
              </div>
              <button
                className="dashboard-button-modern"
                onClick={() => setShowFocusTimer(true)}
              >
                {renderIcon(Icons.timer, 16)} Start Focus Timer
              </button>
            </div>
          </div>

          <div className="visual-data-card heatmap-card">
            <div className="visual-data-card-header heatmap-header">
              <div>
                <h3 className="visual-data-title">Activity Overview</h3>
                <p className="visual-data-subtitle">Created vs completed over the last 90 days</p>
              </div>
              <div className="heatmap-legend">
                <span className="legend-item">
                  <span className="legend-dot created"></span> Created
                </span>
                <span className="legend-item">
                  <span className="legend-dot completed"></span> Completed
                </span>
              </div>
            </div>
            <div className="heatmap-stats">
              <div className="heatmap-stat">
                <span className="heatmap-stat-label">Created (90d)</span>
                <span className="heatmap-stat-value">{activitySummary.created}</span>
              </div>
              <div className="heatmap-stat">
                <span className="heatmap-stat-label">Completed (90d)</span>
                <span className="heatmap-stat-value">{activitySummary.completed}</span>
              </div>
              <div className="heatmap-stat">
                <span className="heatmap-stat-label">Most active</span>
                <span className="heatmap-stat-value">
                  {activitySummary.mostActiveDay
                    ? `${new Date(activitySummary.mostActiveDay).toLocaleDateString(undefined, { month: "short", day: "numeric" })} (${activitySummary.mostActiveTotal})`
                    : "—"}
                </span>
              </div>
            </div>
            <ActivityHeatmap
              data={activityData}
              days={90}
              hideHeader
            />
          </div>
        </div>
      </div>

      {stats.length > 3 && (
        <div className="dashboard-stats-grid">
          {stats.slice(3).map((stat) => (
            <div key={stat.label} className="stat-card-modern">
                  <div className="stat-card-icon">
                    {stat.icon ? renderIcon(stat.icon, 24) : null}
                  </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{stat.value}</div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Access - Only show if there are pages */}
      {quickLinks.length > 0 && (
        <section className="dashboard-section-modern">
          <div className="section-header">
            <h2 className="section-title-modern">Quick Access</h2>
            <p className="section-subtitle">Your recent pages</p>
          </div>
          <div className="quick-links-modern">
            {quickLinks.slice(0, 6).map((page) => (
              <button
                key={page.id}
                className="quick-link-modern"
                onClick={page.onClick}
                title={`Go to ${page.title}`}
              >
                <div className="quick-link-info">
                  <div className="quick-link-title-modern">{page.title}</div>
                </div>
                <div className="quick-link-arrow">{renderIcon(Icons.arrowRight, 16)}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {allTodos.length > 0 && (
        <section className="dashboard-section-modern">
          <div className="section-header">
            <div>
              <h2 className="section-title-modern">Recent Activity</h2>
              <p className="section-subtitle">Your latest updates</p>
            </div>
          </div>
          <div className="activity-list-modern">
            {allTodosWithPages.slice(0, 8).map((todo) => {
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
                    {renderIcon(todo.type === "task" ? Icons.task : Icons.habit, 16)}
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
                    <div className="activity-arrow">{renderIcon(Icons.arrowRight, 16)}</div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Smart suggestions and starter templates */}
      <section className="dashboard-section-modern suggestions-section">
        <div className="suggestions-grid">
          {smartSuggestions.map((item) => (
            <div key={item.title} className="suggestion-card">
              <div className="suggestion-icon">{renderIcon(item.icon, 18)}</div>
              <div className="suggestion-meta">
                <div className="suggestion-title">{item.title}</div>
                <div className="suggestion-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="templates-grid">
          {starterTemplates.map((item) => (
            <div key={item.title} className="template-card">
              <div className="template-icon">{renderIcon(item.icon, 18)}</div>
              <div className="template-meta">
                <div className="template-title">{item.title}</div>
                <div className="template-desc">{item.desc}</div>
              </div>
              <button
                className="template-cta"
                onClick={() => setShowTemplateSelector(true)}
              >
                Use template
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Calendar at the bottom */}
      <section className="dashboard-section-modern dashboard-calendar-section">
        <div className="section-header">
          <h2 className="section-title-modern">Calendar</h2>
          <p className="section-subtitle">Your schedule and events</p>
        </div>
        <DashboardCalendar todos={allTodos} onNavigate={onNavigate} />
      </section>
      
      {/* Tools Section - Consolidate Achievements and Data Management */}
      <section className="dashboard-section-modern">
        <div className="section-header">
          <h2 className="section-title-modern">Tools</h2>
          <p className="section-subtitle">Additional features and settings</p>
        </div>
        <div className="dashboard-tools-grid">
          <button
            className="dashboard-tool-button"
            onClick={() => setShowAchievements(true)}
            aria-label="View achievements"
          >
            <span className="tool-icon">{renderIcon(Icons.streak, 18)}</span>
            <span className="tool-text">Achievements</span>
          </button>
          <button
            className="dashboard-tool-button"
            onClick={() => setShowDataExportImport(true)}
            aria-label="Export or import data"
          >
            <span className="tool-icon">{renderIcon(Icons.arrowDown, 18)}</span>
            <span className="tool-text">Export / Import</span>
          </button>
        </div>
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
      
      {showTemplateSelector && (
        <TemplateSelector
          onAccept={handleApplyTemplates}
          onSkip={handleSkipTemplates}
        />
      )}
      
      {showAchievements && (
        <Achievements
          stats={achievementStats}
          onClose={() => setShowAchievements(false)}
        />
      )}
      
      {showFocusTimer && (
        <div className="focus-timer-modal-overlay" onClick={() => setShowFocusTimer(false)}>
          <div className="focus-timer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="focus-timer-modal-header">
              <h2>Focus Timer</h2>
              <button onClick={() => setShowFocusTimer(false)} aria-label="Close">
                {renderIcon(Icons.close, 18)}
              </button>
            </div>
            <div className="focus-timer-modal-content">
              <FocusTimer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
