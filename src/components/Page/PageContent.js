import React, { useState } from "react";
import { TodoApp } from "../Todo";
import { Dashboard } from "../Dashboard";
import { BlockManager } from "../BlockManager";
import { getAllTodosWithPages } from "../../utils/todos";
import { usePages } from "../../hooks/usePages";
import { useIsMobile } from "../../hooks/useIsMobile";
import { ActivityHeatmap, ProgressCircle, MiniLineChart, EmptyState, ConfirmDialog } from "../shared";
import { Icons, renderIcon } from "../../utils/icons";
import { safeGetItem, safeSetItem } from "../../utils/storage";
import "./PageContent.css";

export default function PageContent({
  page,
  breadcrumbs,
  onNavigate,
  onUpdatePage,
  activePageId,
}) {
  // Use centralized mobile detection hook
  const isMobile = useIsMobile();
  
  // Show dashboard when no page or when on home page, but always show breadcrumbs
  // Check both page?.id and activePageId for special views
  const pageId = page?.id || activePageId;
  const isDashboard = !pageId || pageId === "home" || pageId === "overview";
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
        <AnalyticsView onNavigate={onNavigate} />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="page-content page-not-found" role="region" aria-live="polite">
        <EmptyState
          icon={Icons.page}
          message="Page Not Found"
          hint="The page you're looking for doesn't exist or has been deleted."
          detailedHint="This might happen if the page was deleted or the link is incorrect. You can navigate back to Home or create a new page."
          actionLabel="Go to Home"
          onAction={() => onNavigate("home")}
          tips={[
            "Use the sidebar to navigate between pages",
            "Press Cmd/Ctrl + K to search for pages",
            "Create new pages using the + button in the sidebar"
          ]}
        />
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
        <h2>Welcome to Productivity</h2>
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

      {/* Inline task manager so users can create and switch views without ir a Home */}
      <div className="section-card">
        <h2 className="card-title">Manage your tasks</h2>
        <p className="card-hint">Create tasks, switch between list/board/table/calendar and filter without salir de esta vista.</p>
        <TodoApp pageId="tasks" initialTypeFilter="task" />
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={Icons.task}
          message="No Tasks Yet"
          hint="Get started by creating your first task"
          detailedHint="Tasks help you organize one-time items with due dates. You can add tasks to any page, set priorities, and track completion."
          actionLabel="Create Task"
          onAction={() => {
            // Navigate to home and show task creation
            onNavigate("home");
          }}
          showExamples={true}
          tips={[
            "Click the + button in the sidebar to create a new page",
            "Add tasks directly to any page using the task input",
            "Set due dates to track deadlines and priorities",
            "Use filters to view tasks by date or completion status"
          ]}
        />
      ) : (
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
              <div className="empty-state-card">
                <p className="empty-state">No tasks for today</p>
                <p className="empty-hint">You're all caught up! 🎉</p>
              </div>
            )}
          </div>

          <div className="section-card">
            <h2 className="card-title">All Tasks</h2>
            <p className="card-hint">Usa el gestor superior para ver todas las tareas por vista o aplicar filtros.</p>
          </div>
        </div>
      )}
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

  const [habitToDelete, setHabitToDelete] = useState(null);

  const handleDeleteHabit = (habitId, pageId, habitTitle) => {
    setHabitToDelete({ habitId, pageId, habitTitle });
  };

  const confirmDeleteHabit = () => {
    if (!habitToDelete) return;
    
    const { habitId, pageId } = habitToDelete;
    
    try {
      let deleted = false;
      
      // If pageId exists, try to delete from that page first
      if (pageId) {
        const todosKey = `todos-${pageId}`;
        const pageTodos = safeGetItem(todosKey, []);
        if (pageTodos.some(t => t.id === habitId)) {
          const updatedTodos = pageTodos.filter(t => t.id !== habitId);
          safeSetItem(todosKey, updatedTodos);
          deleted = true;
        }
      }
      
      // If not found in page or pageId is null, search in all localStorage keys
      if (!deleted && typeof window !== 'undefined' && localStorage) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("todos-")) {
            const todos = safeGetItem(key, []);
            if (todos.some(t => t.id === habitId)) {
              const updatedTodos = todos.filter(t => t.id !== habitId);
              safeSetItem(key, updatedTodos);
              deleted = true;
              break;
            }
          }
        }
      }
      
      // Also check old format (todos without page)
      if (!deleted) {
        const oldTodos = safeGetItem("todos", []);
        if (oldTodos.some(t => t.id === habitId)) {
          const updatedTodos = oldTodos.filter(t => t.id !== habitId);
          safeSetItem("todos", updatedTodos);
          deleted = true;
        }
      }
      
      if (deleted) {
        // Trigger page reload to refresh the view
        // TODO: Replace with state update mechanism instead of reload
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error deleting habit:", error);
      }
    } finally {
      setHabitToDelete(null);
    }
  };

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

      {/* Inline habit manager to add and view habits without cambiar de vista */}
      <div className="section-card">
        <h2 className="card-title">Manage your habits</h2>
        <p className="card-hint">Crea hábitos y cambia de lista a tablero/tabla/calendario desde aquí.</p>
        <TodoApp pageId="habits" initialTypeFilter="habit" />
      </div>

      <div className="section-content-grid">
        <div className="section-card">
          <h2 className="card-title">All Habits</h2>
          <p className="card-hint">Manage all your habits. Click the delete button to remove a habit.</p>
          {habits.length > 0 ? (
            <div className="habit-list-full">
              {allTodosWithPages
                .filter(({ type }) => type === "habit")
                .map(({ pageId, pageTitle, ...habit }) => (
                  <div key={habit.id} className="habit-item-full">
                    <span className="habit-icon">{renderIcon(Icons.habit, 16)}</span>
                    <div className="habit-info-full">
                      <span className="habit-title">{habit.title}</span>
                      <span className="habit-meta">
                        <span className="habit-streak">Streak: {habit.streak || 0} days</span>
                        {pageTitle && pageTitle !== "Unknown Page" && (
                          <span className="habit-page">• {pageTitle}</span>
                        )}
                      </span>
                    </div>
                    <button
                      className="habit-delete-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteHabit(habit.id, pageId, habit.title);
                      }}
                      aria-label={`Delete habit: ${habit.title}`}
                      title="Delete habit"
                    >
                      {renderIcon(Icons.delete, 16)}
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <EmptyState
              icon={Icons.habit}
              message="No Habits Yet"
              hint="Start building daily routines with habits"
              detailedHint="Habits help you track recurring activities and build streaks. Mark them complete each day to maintain your progress."
              actionLabel="Go to Home"
              onAction={() => onNavigate("home")}
              tips={[
                "Add habits to any page using the habit input",
                "Mark habits complete daily to build streaks",
                "Track your progress with visual streak counters",
                "Habits reset daily, so you can track them consistently"
              ]}
            />
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
            <div className="streak-list">
              {[
                { title: "Drink 2L of water", streak: 0 },
                { title: "Read 10 pages", streak: 0 },
                { title: "Walk 20 minutes", streak: 0 },
              ].map((item) => (
                <div key={item.title} className="streak-item streak-placeholder">
                  <span className="streak-icon">{renderIcon(Icons.streak, 16)}</span>
                  <span className="streak-title">{item.title}</span>
                  <span className="streak-value">{item.streak} days</span>
                </div>
              ))}
              <p className="empty-state">Add your first habit above to start building streaks.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!habitToDelete}
        title="Delete Habit"
        message={habitToDelete ? `Are you sure you want to delete "${habitToDelete.habitTitle}"? This action cannot be undone.` : ""}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDeleteHabit}
        onCancel={() => setHabitToDelete(null)}
      />
    </div>
  );
}

// Analytics View - Dedicated section for analytics
function AnalyticsView({ onNavigate }) {
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

  // Habits statistics
  const habits = allTodos.filter(t => t.type === "habit");
  const activeHabits = habits.filter(h => !h.completed);
  const totalStreaks = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0), 0) : 0;
  const avgStreak = habits.length > 0 ? Math.round(totalStreaks / habits.length) : 0;

  // Habit trend data (last 7 days)
  const habitTrendData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    const dayHabits = habits.filter(h => h.completedDates?.includes(dateKey));
    habitTrendData.push(dayHabits.length);
  }

  // Check if there's any data
  const hasData = tasks.length > 0 || habits.length > 0;

  if (!hasData) {
    return (
      <div className="section-view">
        <div className="section-hero">
          <h1 className="section-title">Analytics</h1>
          <p className="section-description">Track your productivity and progress over time</p>
        </div>
        <EmptyState
          icon={Icons.stats}
          message="No Data Yet"
          hint="Start tracking to see your productivity insights"
          detailedHint="Analytics will show your completion rates, streaks, and productivity trends once you start creating tasks and habits."
          actionLabel="Create Your First Task"
          onAction={() => onNavigate("tasks")}
          tips={[
            "Create tasks and habits to generate data",
            "Complete items daily to see progress trends",
            "View detailed stats in the Analytics section",
            "Track streaks and completion rates over time"
          ]}
        />
      </div>
    );
  }

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

        {habits.length > 0 && (
          <div className="analytics-card">
            <h2 className="card-title">Habit Performance</h2>
            <div className="analytics-content">
              <MiniLineChart
                data={habitTrendData}
                width={240}
                height={100}
                color="var(--color-success)"
                showPoints={true}
              />
              <div className="analytics-stats">
                <div className="analytics-stat">
                  <span className="stat-value">{activeHabits.length}</span>
                  <span className="stat-label">Active Habits</span>
                </div>
                <div className="analytics-stat">
                  <span className="stat-value">{maxStreak}</span>
                  <span className="stat-label">Best Streak</span>
                </div>
                <div className="analytics-stat">
                  <span className="stat-value">{avgStreak}</span>
                  <span className="stat-label">Avg Streak</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="analytics-card">
            <h2 className="card-title">Task Statistics</h2>
            <div className="analytics-content">
              <div className="analytics-stats-grid">
                <div className="analytics-stat-large">
                  <span className="stat-value-large">{tasks.length}</span>
                  <span className="stat-label">Total Tasks</span>
                </div>
                <div className="analytics-stat-large">
                  <span className="stat-value-large">{completedTasks}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="analytics-stat-large">
                  <span className="stat-value-large">{tasks.length - completedTasks}</span>
                  <span className="stat-label">Pending</span>
                </div>
                <div className="analytics-stat-large">
                  <span className="stat-value-large">{Math.round(completionPercentage)}%</span>
                  <span className="stat-label">Completion Rate</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activityData.length > 0 && (
          <div className="analytics-card heatmap-card">
            <h2 className="card-title">Activity Heatmap</h2>
            <ActivityHeatmap data={activityData} days={90} />
          </div>
        )}
      </div>
    </div>
  );
}
