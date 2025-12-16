import React, { useState, useEffect } from "react";
import { TodoApp } from "../Todo";
import { Dashboard } from "../Dashboard";
import { BlockManager } from "../BlockManager";
import { getAllTodosWithPages } from "../../utils/todos";
import { usePages } from "../../hooks/usePages";
import { ActivityHeatmap, ProgressCircle, MiniLineChart } from "../shared";
import { Icons, renderIcon } from "../../utils/icons";
import "./PageContent.css";

export default function PageContent({
  page,
  breadcrumbs,
  onNavigate,
  onUpdatePage,
  activePageId,
}) {
  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Show dashboard when no page or when on home page, but always show breadcrumbs
  // Check both page?.id and activePageId for special views
  const pageId = page?.id || activePageId;
  const isDashboard = !pageId || pageId === "home" || pageId === "dashboard";
  const isTasks = pageId === "tasks";
  const isHabits = pageId === "habits";
  const isAnalytics = pageId === "analytics";
  
  // Don't render breadcrumbs on mobile - everything should be in hamburger menu
  const shouldShowBreadcrumbs = !isMobile;
  
  if (isDashboard) {
    return (
      <div
        className="page-content page-content-dashboard"
        role="region"
        aria-live="polite"
      >
        {shouldShowBreadcrumbs && <BreadcrumbTrail items={breadcrumbs} onNavigate={onNavigate} />}
        <Dashboard onNavigate={onNavigate} />
      </div>
    );
  }

  // Special sections
  if (isTasks) {
    return (
      <div className="page-content" role="region" aria-live="polite">
        {shouldShowBreadcrumbs && <BreadcrumbTrail items={breadcrumbs} onNavigate={onNavigate} />}
        <TasksView onNavigate={onNavigate} />
      </div>
    );
  }

  if (isHabits) {
    return (
      <div className="page-content" role="region" aria-live="polite">
        {shouldShowBreadcrumbs && <BreadcrumbTrail items={breadcrumbs} onNavigate={onNavigate} />}
        <HabitsView onNavigate={onNavigate} />
      </div>
    );
  }

  if (isAnalytics) {
    return (
      <div className="page-content" role="region" aria-live="polite">
        {shouldShowBreadcrumbs && <BreadcrumbTrail items={breadcrumbs} onNavigate={onNavigate} />}
        <AnalyticsView />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="page-content" role="region" aria-live="polite">
        <p>Page not found</p>
      </div>
    );
  }

  return (
    <div className="page-content" role="region" aria-live="polite">
      {shouldShowBreadcrumbs && <BreadcrumbTrail items={breadcrumbs} onNavigate={onNavigate} />}
      <PageHero page={page} onUpdatePage={onUpdatePage} />
      <div className="page-body">
        {page.type === "database" ? (
          <DatabaseView page={page} />
        ) : (
          <RegularPageView page={page} onUpdatePage={onUpdatePage} />
        )}
      </div>
    </div>
  );
}

function BreadcrumbTrail({ items, onNavigate }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb navigation">
      <button
        className="breadcrumb-item breadcrumb-home"
        onClick={() => onNavigate && onNavigate("home")}
        aria-label="Go to home"
      >
        <span className="breadcrumb-title">Home</span>
      </button>
      {items.length > 0 && items.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          <span className="breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <button
            className="breadcrumb-item"
            onClick={() => onNavigate && onNavigate(crumb.id)}
            aria-label={`Go to ${crumb.title}`}
          >
            <span className="breadcrumb-title">{crumb.title}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}

function PageHero({ page, onUpdatePage }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(page?.title || "");
  
  if (!page) return null;

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle !== page.title) {
      onUpdatePage(page.id, { title: editTitle.trim() });
    } else {
      setEditTitle(page.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="page-hero">
      <div className="page-hero-content">
        {isEditingTitle ? (
          <input
            type="text"
            className="page-title-edit"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSave();
              if (e.key === "Escape") {
                setIsEditingTitle(false);
                setEditTitle(page.title);
              }
            }}
            autoFocus
          />
        ) : (
          <h1
            className="page-title-large editable-title"
            onClick={() => setIsEditingTitle(true)}
            title="Click to edit title"
          >
            {page.title}
          </h1>
        )}
        {page.type === "database" && (
          <p className="page-subtitle">
            Manage your {page.title.toLowerCase()} with filters, views, and
            organization tools.
          </p>
        )}
      </div>
    </header>
  );
}

function DatabaseView({ page }) {
  // Determine initial typeFilter based on page title
  const getInitialTypeFilter = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("task") && !lowerTitle.includes("habit")) {
      return "task";
    }
    if (lowerTitle.includes("habit")) {
      return "habit";
    }
    return "all";
  };

  const initialTypeFilter = getInitialTypeFilter(page.title);

  return (
    <section
      className="database-view"
      aria-label={`${page.title} database view`}
    >
      <TodoApp 
        pageId={page.id} 
        viewType={page.viewType} 
        initialTypeFilter={initialTypeFilter}
      />
    </section>
  );
}

function RegularPageView({ page, onUpdatePage }) {
  if (page.id === "welcome") {
    return (
      <section className="regular-page-view">
        <WelcomePage />
      </section>
    );
  }

  const handleUpdateBlocks = (blocks) => {
    onUpdatePage(page.id, { content: blocks });
  };

  // For backward compatibility, check if page has old-style content
  const blocks = Array.isArray(page.content) ? page.content : [];

  return (
    <section className="regular-page-view">
      <BlockManager
        pageId={page.id}
        blocks={blocks}
        onUpdateBlocks={handleUpdateBlocks}
      />
    </section>
  );
}

function WelcomePage() {
  const features = [
    {
      title: "Hierarchical Pages",
      copy: "Create pages and subpages to organize your content in a clear tree structure.",
    },
    {
      title: "Multiple Views",
      copy: "Switch between list, board, table, and calendar views to visualize your data.",
    },
    {
      title: "Task Management",
      copy: "Track tasks and habits with streak counters and completion metrics.",
    },
    {
      title: "Productivity Dashboard",
      copy: "Monitor your progress with visual analytics and productivity insights.",
    },
  ];

  return (
    <div className="welcome-content">
      <section className="welcome-hero">
        <h2>Welcome to Your Workspace</h2>
        <p>
          A productivity app designed for clarity and efficiency. Manage tasks,
          track habits, and organize your work with a clean, functional
          interface.
        </p>
      </section>

      <section className="highlight-grid">
        {features.map((feature) => (
          <article key={feature.title} className="highlight-card">
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="roadmap-section">
        <h3>Quick Start Guide</h3>
        <ul>
          <li>Create a new page from the sidebar</li>
          <li>Add tasks and habits to track your progress</li>
          <li>Switch between different views to find what works best</li>
          <li>Use filters and search to organize your content</li>
        </ul>
      </section>
    </div>
  );
}

// Tasks View - Dedicated section for task management
function TasksView({ onNavigate }) {
  const { getPage } = usePages();
  const allTodosWithPages = getAllTodosWithPages(getPage);
  const allTodos = allTodosWithPages.map(({ pageId, pageTitle, ...todo }) => todo);
  const tasks = allTodos.filter(t => t.type === "task");
  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter(t => t.dueDate === today && !t.completed);
  const upcomingTasks = tasks.filter(t => t.dueDate && t.dueDate > today && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="section-view">
      <div className="section-hero">
        <h1 className="section-title">Tasks</h1>
        <p className="section-description">Manage and track all your tasks in one place</p>
      </div>

      <div className="section-stats">
        <div className="stat-item">
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{todayTasks.length}</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{upcomingTasks.length}</div>
          <div className="stat-label">Upcoming</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{completedTasks.length}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="section-content-grid">
        <div className="section-card">
          <h2 className="card-title">Today's Tasks</h2>
          {todayTasks.length > 0 ? (
            <div className="task-list">
              {todayTasks.map(task => (
                <div key={task.id} className="task-item">
                  <span className="task-icon">{renderIcon(Icons.task, 16)}</span>
                  <span className="task-title">{task.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No tasks for today</p>
          )}
        </div>

        <div className="section-card">
          <h2 className="card-title">All Tasks</h2>
          <p className="card-hint">View and manage all tasks across your workspace</p>
          <button
            className="primary-action"
            onClick={() => {
              onNavigate("home");
            }}
          >
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
}

// Habits View - Dedicated section for habit tracking
function HabitsView({ onNavigate }) {
  const { getPage } = usePages();
  const allTodosWithPages = getAllTodosWithPages(getPage);
  const allTodos = allTodosWithPages.map(({ pageId, pageTitle, ...todo }) => todo);
  const habits = allTodos.filter(t => t.type === "habit");
  const activeHabits = habits.filter(h => !h.completed);
  const totalStreaks = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

  return (
    <div className="section-view">
      <div className="section-hero">
        <h1 className="section-title">Habits</h1>
        <p className="section-description">Build and maintain daily habits with streak tracking</p>
      </div>

      <div className="section-stats">
        <div className="stat-item">
          <div className="stat-value">{habits.length}</div>
          <div className="stat-label">Total Habits</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{activeHabits.length}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalStreaks}</div>
          <div className="stat-label">Total Streaks</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{maxStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      <div className="section-content-grid">
        <div className="section-card">
          <h2 className="card-title">Active Habits</h2>
          {activeHabits.length > 0 ? (
            <div className="habit-list">
              {activeHabits.slice(0, 5).map(habit => (
                <div key={habit.id} className="habit-item">
                  <span className="habit-icon">{renderIcon(Icons.habit, 16)}</span>
                  <div className="habit-info">
                    <span className="habit-title">{habit.title}</span>
                    <span className="habit-streak">Streak: {habit.streak || 0} days</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No active habits. Create one to get started!</p>
          )}
        </div>

        <div className="section-card">
          <h2 className="card-title">Streak Leaderboard</h2>
          {habits.length > 0 ? (
            <div className="streak-list">
              {habits
                .sort((a, b) => (b.streak || 0) - (a.streak || 0))
                .slice(0, 5)
                .map(habit => (
                  <div key={habit.id} className="streak-item">
                    <span className="streak-icon">{renderIcon(Icons.streak, 16)}</span>
                    <span className="streak-title">{habit.title}</span>
                    <span className="streak-value">{habit.streak || 0} days</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="empty-state">No habits yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Analytics View - Dedicated section for analytics
function AnalyticsView() {
  const { getPage } = usePages();
  const allTodosWithPages = getAllTodosWithPages(getPage);
  const allTodos = allTodosWithPages.map(({ pageId, pageTitle, ...todo }) => todo);
  const tasks = allTodos.filter(t => t.type === "task");
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  // Generate trend data
  const today = new Date();
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayTasks = tasks.filter(t => {
      if (!t.completedAt) return false;
      return t.completedAt.startsWith(dateStr);
    });
    trendData.push(dayTasks.length);
  }

  // Activity data
  const activityData = allTodos
    .filter(todo => todo.completedAt || todo.createdAt)
    .map(todo => ({
      date: todo.completedAt || todo.createdAt,
      createdAt: todo.createdAt,
      completedAt: todo.completedAt,
    }));

  return (
    <div className="section-view">
      <div className="section-hero">
        <h1 className="section-title">Analytics</h1>
        <p className="section-description">Track your productivity and progress over time</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h2 className="card-title">Task Completion</h2>
          <div className="analytics-content">
            <ProgressCircle
              percentage={completionPercentage}
              size={120}
              strokeWidth={10}
              color="var(--color-success)"
              showPercentage={true}
            />
            <div className="analytics-stats">
              <div className="analytics-stat">
                <span className="stat-value">{completedTasks}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="analytics-stat">
                <span className="stat-value">{tasks.length - completedTasks}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h2 className="card-title">7-Day Trend</h2>
          <div className="analytics-content">
            <MiniLineChart
              data={trendData}
              width={240}
              height={100}
              color="var(--color-info)"
              showPoints={true}
            />
            <div className="analytics-stats">
              <div className="analytics-stat">
                <span className="stat-value">{trendData.reduce((a, b) => a + b, 0)}</span>
                <span className="stat-label">This Week</span>
              </div>
              <div className="analytics-stat">
                <span className="stat-value">{Math.max(...trendData, 0)}</span>
                <span className="stat-label">Peak Day</span>
              </div>
            </div>
          </div>
        </div>

        {activityData.length > 0 && (
          <div className="analytics-card heatmap-card">
            <ActivityHeatmap data={activityData} days={90} />
          </div>
        )}
      </div>
    </div>
  );
}
