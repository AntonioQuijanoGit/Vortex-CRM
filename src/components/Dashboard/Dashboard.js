import React, { useState, useMemo } from "react";
import { usePages } from "../../hooks/usePages";
import DashboardCalendar from "./DashboardCalendar";
import { Icons } from "../../utils/icons";
import { safeGetItem } from "../../utils/storage";
import { getAllTodosWithPages } from "../../utils/todos";
import { useToast } from "../../hooks/useToast";
import { logger } from "../../utils/logger";
import OrphanedItems from "../shared/OrphanedItems/OrphanedItems";
import { DataExportImport, ProgressCircle, MiniLineChart, ActivityHeatmap, ConfirmDialog } from "../shared";
import { useEvents } from "../../hooks/useEvents";
import "./Dashboard.css";

export default function Dashboard({ onNavigate }) {
  const { getRootPages, getPage, addPage, updatePage, deletePage, pages } = usePages();
  
  // Helper function to find existing page by title (case-insensitive)
  const findPageByTitle = (title, type = null) => {
    const normalizedTitle = title.trim().toLowerCase();
    return pages.find(page => {
      const pageTitleMatch = page.title.trim().toLowerCase() === normalizedTitle;
      const typeMatch = type ? page.type === type : true;
      return pageTitleMatch && typeMatch;
    });
  };
  
  // Helper function to find or create a page with initial block
  const findOrCreatePageWithBlock = (title, type, blockType = null) => {
    try {
      // First, check if page already exists
      const existingPage = findPageByTitle(title, type);
      if (existingPage) {
        console.log("findOrCreatePageWithBlock - Found existing:", existingPage.id);
        return existingPage.id;
      }
      
      // Create initial content if blockType is specified
      let initialContent = null;
      if (blockType && type === "page") {
        const newBlock = {
          id: crypto.randomUUID(),
          type: blockType,
          data: getDefaultBlockData(blockType),
          createdAt: new Date().toISOString(),
        };
        initialContent = [newBlock];
      }
      
      // Create new page with content
      const pageId = addPage(title, null, type, Icons.page, initialContent);
      console.log("findOrCreatePageWithBlock - Created new:", { title, type, blockType, pageId });
      return pageId;
    } catch (error) {
      console.error("Error in findOrCreatePageWithBlock:", error);
      throw error;
    }
  };
  
  // Legacy function for backward compatibility (now uses findOrCreate)
  const createPageWithBlock = findOrCreatePageWithBlock;
  
  // Helper to get default block data
  const getDefaultBlockData = (type) => {
    switch (type) {
      case "text":
        return { content: "" };
      case "notes":
        return { content: "" };
      case "tasks":
        return {};
      case "calendar":
        return {};
      case "movies":
        return {};
      default:
        return {};
    }
  };
  const { showToast } = useToast();
  const { events } = useEvents(); // Get all events
  const [showOrphanedItems, setShowOrphanedItems] = useState(false);
  const [showDataExportImport, setShowDataExportImport] = useState(false);
  const [editingPageId, setEditingPageId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  // Upcoming deadlines (tasks with dueDate in next 7 days)
  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return tasks
      .filter((task) => {
        if (!task.dueDate || task.completed) return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= today && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  // Upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .slice(0, 5);
  }, [events]);

  // Top habits by streak
  const topHabits = useMemo(() => {
    return [...habits]
      .sort((a, b) => (b.streak || 0) - (a.streak || 0))
      .slice(0, 5);
  }, [habits]);

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

  // Check if this is a new user (no content)
  const isNewUser = rootPages.length <= 1 && allTodos.length === 0;

  // Available features/functionalities - ALL features visible for portfolio
  const availableFeatures = [
    {
      id: "text",
      title: "Text Blocks",
      description: "Rich text editor for writing and formatting content",
      icon: Icons.text,
      color: "var(--color-accent)",
      action: () => {
        try {
          const pageId = createPageWithBlock("New Page", "page", "text");
          console.log("Text page created, ID:", pageId);
          if (pageId && onNavigate) {
            setTimeout(() => onNavigate(pageId), 100);
            showToast("Text page created", "success");
          } else {
            showToast("Failed to create page", "error");
          }
        } catch (error) {
          console.error("Error creating text page:", error);
          showToast("Failed to create page", "error");
        }
      },
    },
    {
      id: "notes",
      title: "Notes Editor",
      description: "Create and organize notes with markdown support",
      icon: Icons.note,
      color: "var(--color-info)",
      action: () => {
        try {
          const pageId = createPageWithBlock("Notes", "page", "notes");
          if (pageId && onNavigate) {
            onNavigate(pageId);
            showToast("Notes page created", "success");
          } else {
            showToast("Failed to create page", "error");
          }
        } catch (error) {
          console.error("Error creating notes page:", error);
          showToast("Failed to create page", "error");
        }
      },
    },
    {
      id: "tasks",
      title: "Tasks & Habits",
      description: "Task management with habits, streaks, and multiple views (list, board, table, calendar)",
      icon: Icons.task,
      color: "var(--color-success)",
      action: () => {
        try {
          const pageId = addPage("Tasks", null, "database");
          console.log("Tasks page created, ID:", pageId);
          if (pageId && onNavigate) {
            setTimeout(() => onNavigate(pageId), 100);
            showToast("Tasks page created", "success");
          } else {
            showToast("Failed to create page", "error");
          }
        } catch (error) {
          console.error("Error creating tasks page:", error);
          showToast("Failed to create page", "error");
        }
      },
    },
    {
      id: "calendar",
      title: "Calendar & Events",
      description: "Schedule events, view calendar, and track time-based activities",
      icon: Icons.calendar,
      color: "var(--color-warning)",
      action: () => {
        try {
          const existingPage = findPageByTitle("Calendar", "page");
          if (existingPage) {
            // Page exists, navigate to it
            onNavigate(existingPage.id);
            showToast("Navigated to Calendar", "success");
          } else {
            // Create new page
            const pageId = createPageWithBlock("Calendar", "page", "calendar");
            if (pageId && onNavigate) {
              setTimeout(() => onNavigate(pageId), 100);
              showToast("Calendar page created", "success");
            } else {
              showToast("Failed to create page", "error");
            }
          }
        } catch (error) {
          console.error("Error with calendar page:", error);
          showToast("Failed to access calendar", "error");
        }
      },
    },
    {
      id: "movies",
      title: "Movie Tracker",
      description: "Track movies you want to watch and mark as watched",
      icon: Icons.movie,
      color: "var(--color-accent)",
      action: () => {
        try {
          const existingPage = findPageByTitle("Movies", "page");
          if (existingPage) {
            onNavigate(existingPage.id);
            showToast("Navigated to Movies", "success");
          } else {
            const pageId = createPageWithBlock("Movies", "page", "movies");
            if (pageId && onNavigate) {
              setTimeout(() => onNavigate(pageId), 100);
              showToast("Movie tracker page created", "success");
            } else {
              showToast("Failed to create page", "error");
            }
          }
        } catch (error) {
          console.error("Error with movie page:", error);
          showToast("Failed to access movies", "error");
        }
      },
    },
    {
      id: "database",
      title: "Database Pages",
      description: "Create database views with filters, sorting, and multiple view types",
      icon: Icons.database,
      color: "var(--color-info)",
      action: () => {
        try {
          // For generic "Database", always create new (user might want multiple)
          const pageId = addPage("Database", null, "database");
          if (pageId && onNavigate) {
            setTimeout(() => onNavigate(pageId), 100);
            showToast("Database page created", "success");
          } else {
            showToast("Failed to create page", "error");
          }
        } catch (error) {
          console.error("Error creating database page:", error);
          showToast("Failed to create page", "error");
        }
      },
    },
    {
      id: "pages",
      title: "Hierarchical Pages",
      description: "Create pages and subpages in a tree structure (Notion-style)",
      icon: Icons.page,
      color: "var(--color-muted)",
      action: () => {
        try {
          const pageId = createPageWithBlock("New Page", "page", "text");
          onNavigate(pageId);
        } catch (error) {
          showToast("Failed to create page", "error");
        }
      },
    },
    {
      id: "views",
      title: "Multiple Views",
      description: "Switch between list, board, table, and calendar views",
      icon: Icons.dashboard,
      color: "var(--color-success)",
      action: () => {
        try {
          const pageId = addPage("Tasks", null, "database");
          onNavigate(pageId);
        } catch (error) {
          showToast("Failed to create page", "error");
        }
      },
    },
  ];

  return (
    <div className="dashboard-container">
      {/* NEW FEATURES BANNER - Very visible */}
      <div className="new-features-banner">
        <div className="banner-content">
          <div className="banner-icon">✨</div>
          <div className="banner-text">
            <strong>NEW FEATURES AVAILABLE!</strong>
            <span>Rich Text Editor • Drag & Drop • Timer • Templates • Gallery View • Advanced Filters</span>
          </div>
        </div>
      </div>

      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-header">
            <div className="hero-text-section">
              <h1 className="dashboard-title">
                {isNewUser ? "Welcome to Your Workspace" : "Dashboard"}
              </h1>
              <p className="dashboard-subtitle">
                {isNewUser 
                  ? "Get started by creating your first page, task, or habit"
                  : "Your productivity hub - manage tasks, habits, and pages"}
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
          
          {/* Quick Actions CTA Section */}
          {isNewUser && (
            <div className="dashboard-quick-actions">
              <button
                className="cta-button cta-primary"
                onClick={() => onNavigate("home")}
                aria-label="Create new page"
              >
                <span className="cta-icon">{Icons.add}</span>
                <span className="cta-text">Create Your First Page</span>
                <span className="cta-arrow">{Icons.arrowRight}</span>
              </button>
              <p className="cta-hint">Or press <kbd>Ctrl/Cmd + N</kbd> to create a page</p>
            </div>
          )}
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

          {/* Upcoming Deadlines Widget */}
          {upcomingDeadlines.length > 0 && (
            <div className="visual-data-card">
              <h3 className="visual-data-title">
                <span>{Icons.date}</span>
                Upcoming Deadlines
              </h3>
              <div className="upcoming-list">
                {upcomingDeadlines.map((task) => {
                  const dueDate = new Date(task.dueDate);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                  const isToday = daysUntil === 0;
                  const isOverdue = daysUntil < 0;

                  return (
                    <div
                      key={task.id}
                      className={`upcoming-item ${isOverdue ? "overdue" : isToday ? "today" : ""}`}
                      onClick={() => {
                        const page = allTodosWithPages.find((t) => t.id === task.id);
                        if (page?.pageId) onNavigate(page.pageId);
                      }}
                    >
                      <div className="upcoming-item-content">
                        <div className="upcoming-item-title">{task.title}</div>
                        <div className="upcoming-item-meta">
                          {isOverdue
                            ? `${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? "s" : ""} overdue`
                            : isToday
                            ? "Due today"
                            : `${daysUntil} day${daysUntil !== 1 ? "s" : ""} left`}
                        </div>
                      </div>
                      <div className="upcoming-item-date">
                        {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Events Widget */}
          {upcomingEvents.length > 0 && (
            <div className="visual-data-card">
              <h3 className="visual-data-title">
                <span>{Icons.calendar}</span>
                Upcoming Events
              </h3>
              <div className="upcoming-list">
                {upcomingEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
                  const isToday = daysUntil === 0;

                  return (
                    <div
                      key={event.id}
                      className={`upcoming-item ${isToday ? "today" : ""}`}
                    >
                      <div className="upcoming-item-content">
                        <div className="upcoming-item-title">{event.title}</div>
                        <div className="upcoming-item-meta">
                          {isToday ? "Today" : `${daysUntil} day${daysUntil !== 1 ? "s" : ""} away`}
                          {event.time && ` • ${event.time}`}
                        </div>
                      </div>
                      <div className="upcoming-item-date">
                        {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top Habits Widget */}
          {topHabits.length > 0 && (
            <div className="visual-data-card">
              <h3 className="visual-data-title">
                <span>{Icons.streak}</span>
                Top Habits
              </h3>
              <div className="habits-list">
                {topHabits.map((habit) => (
                  <div key={habit.id} className="habit-item">
                    <div className="habit-item-content">
                      <div className="habit-item-title">{habit.title}</div>
                      <div className="habit-item-streak">
                        <span className="streak-value">{habit.streak || 0}</span>
                        <span className="streak-label">day streak</span>
                      </div>
                    </div>
                    {habit.bestStreak > (habit.streak || 0) && (
                      <div className="habit-item-best">
                        Best: {habit.bestStreak}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions Widget */}
          <div className="visual-data-card">
            <h3 className="visual-data-title">
              <span>{Icons.dashboard}</span>
              Quick Actions
            </h3>
            <div className="quick-actions-grid">
              <button
                className="quick-action-btn"
                onClick={() => {
                  const pageId = addPage("New Page", null, "page");
                  onNavigate(pageId);
                }}
              >
                <span className="quick-action-icon">{Icons.add}</span>
                <span className="quick-action-label">New Page</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => {
                  const pageId = addPage("Tasks", null, "database");
                  onNavigate(pageId);
                }}
              >
                <span className="quick-action-icon">{Icons.task}</span>
                <span className="quick-action-label">New Task</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => {
                  const pageId = addPage("Calendar", null, "page");
                  onNavigate(pageId);
                }}
              >
                <span className="quick-action-icon">{Icons.calendar}</span>
                <span className="quick-action-label">New Event</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => setShowDataExportImport(true)}
              >
                <span className="quick-action-icon">{Icons.arrowDown}</span>
                <span className="quick-action-label">Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-content">
        {/* Available Features Section - Always visible for portfolio */}
        <section className="dashboard-section-modern features-showcase">
          <div className="section-header">
            <h2 className="section-title-modern">
              🚀 All Available Features - Click to Try!
            </h2>
            <p className="section-subtitle">
              <strong>NEW:</strong> Rich Text Editor • Drag & Drop • Timer (Pomodoro) • Templates • Gallery View • Advanced Filters & Sorting
            </p>
          </div>
          <div className="features-grid">
            {availableFeatures.map((feature) => (
              <button
                key={feature.id}
                className="feature-card"
                onClick={feature.action}
                aria-label={`Try ${feature.title}`}
                style={{ '--feature-color': feature.color }}
              >
                <div className="feature-icon-wrapper">
                  <div className="feature-icon" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
                <div className="feature-arrow">{Icons.arrowRight}</div>
              </button>
            ))}
          </div>
        </section>

        {quickLinks.length > 0 && (
          <section className="dashboard-section-modern">
            <div className="section-header">
              <h2 className="section-title-modern">Quick Access</h2>
              <p className="section-subtitle">Jump to your pages</p>
            </div>
            <div className="quick-links-modern">
              {quickLinks.map((page) => (
                <EditablePageItem
                  key={page.id}
                  page={page}
                  isEditing={editingPageId === page.id}
                  onEdit={() => setEditingPageId(page.id)}
                  onSave={(newTitle) => {
                    try {
                      updatePage(page.id, { title: newTitle });
                      setEditingPageId(null);
                      showToast("Page updated", "success");
                    } catch (error) {
                      showToast("Failed to update page", "error");
                    }
                  }}
                  onCancel={() => setEditingPageId(null)}
                  onDelete={() => {
                    const pageObj = getPage(page.id);
                    if (pageObj) {
                      setDeleteConfirm({
                        id: page.id,
                        title: pageObj.title,
                      });
                    }
                  }}
                  onNavigate={page.onClick}
                />
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

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title="Delete Page"
          message={`Are you sure you want to delete "${deleteConfirm.title}"? This will also delete all tasks, habits, and content in this page. This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={() => {
            try {
              deletePage(deleteConfirm.id, true);
              setDeleteConfirm(null);
              showToast("Page deleted", "success");
            } catch (error) {
              showToast("Failed to delete page", "error");
              setDeleteConfirm(null);
            }
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

// Editable Page Item Component
function EditablePageItem({ page, isEditing, onEdit, onSave, onCancel, onDelete, onNavigate }) {
  const [editTitle, setEditTitle] = useState(page.title);
  const [showActions, setShowActions] = useState(false);

  // Update editTitle when page title changes externally
  React.useEffect(() => {
    if (!isEditing) {
      setEditTitle(page.title);
    }
  }, [page.title, isEditing]);

  const handleSave = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== page.title) {
      onSave(trimmed);
    } else {
      setEditTitle(page.title);
      onCancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setEditTitle(page.title);
      onCancel();
    }
  };

  const handleNavigate = (e) => {
    if (!isEditing && !showActions) {
      onNavigate();
    }
  };

  return (
    <div
      className="quick-link-modern editable-page-item"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleNavigate}
    >
      <div className="quick-link-info" style={{ flex: 1 }}>
        {isEditing ? (
          <input
            type="text"
            className="quick-link-title-edit"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className="quick-link-title-modern quick-link-title-clickable"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Click to open, double-click to edit"
          >
            {page.title}
          </div>
        )}
      </div>
      
      {!isEditing && showActions && (
        <div className="quick-link-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="quick-link-action-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="Edit page title"
            title="Edit title"
          >
            {Icons.edit}
          </button>
          <button
            className="quick-link-action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete page"
            title="Delete page"
          >
            {Icons.delete}
          </button>
        </div>
      )}
      
      {!isEditing && !showActions && (
        <div className="quick-link-arrow">{Icons.arrowRight}</div>
      )}
    </div>
  );
}
