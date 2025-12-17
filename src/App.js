import React, { useState, useEffect, useMemo } from "react";
import { Sidebar } from "./components/Sidebar";
import { PageContent } from "./components/Page";
import { Onboarding, HelpButton, QuickSearch, ToastContainer, ShortcutsModal, ThemeToggle, QuickNotes, Achievements, FocusTimer, Goals } from "./components/shared";
import { usePages } from "./hooks/usePages";
import { useToast } from "./hooks/useToast";
import { SHORTCUTS, matchesShortcut } from "./utils/keyboardShortcuts";
import { safeGetItem } from "./utils/storage";
import { getAllTodosWithPages } from "./utils/todos";
import "./App.css";
import "./components/shared/FocusTimer/FocusTimer.css";

function App() {
  const {
    activePage,
    setActivePage,
    getPage,
    getRootPages,
    getChildren,
    addPage,
    updatePage,
    deletePage,
    toggleExpanded,
    isExpanded,
    getBreadcrumbs,
  } = usePages();

  const currentPage = getPage(activePage);
  // Always show breadcrumbs - if no active page or on home, show empty array (BreadcrumbTrail will show Home)
  const breadcrumbs = activePage && activePage !== "home" ? getBreadcrumbs(activePage) : [];

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  });
  // Sidebar collapsed by default on mobile, open on desktop
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768; // Collapsed on mobile, open on desktop
  });
  const { toasts, removeToast, showInfo } = useToast();
  
  // Get all todos for Goals component - memoized for performance
  const allTodosWithPages = useMemo(() => getAllTodosWithPages(getPage), [getPage]);
  const allTodos = useMemo(() => 
    allTodosWithPages.map(({ pageId, pageTitle, ...todo }) => todo),
    [allTodosWithPages]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasSeenTutorial = safeGetItem("has-seen-tutorial", null);
    if (!hasSeenTutorial) {
      // Small delay to let the page render
      setTimeout(() => setShowOnboarding(true), 500);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.matches("input, textarea, [contenteditable]")) {
        // Allow Escape to close modals even when in inputs
        if (e.key === "Escape") {
          if (showQuickSearch) setShowQuickSearch(false);
          if (showShortcuts) setShowShortcuts(false);
        }
        return;
      }

      // Quick Search (Cmd/Ctrl + K)
      if (matchesShortcut(e, SHORTCUTS.QUICK_SEARCH)) {
        e.preventDefault();
        setShowQuickSearch(true);
        return;
      }

      // New Page (Cmd/Ctrl + N)
      if (matchesShortcut(e, SHORTCUTS.NEW_PAGE)) {
        e.preventDefault();
        try {
          addPage("", null, "page");
          showInfo("New page created");
        } catch (error) {
          // Error handling
        }
        return;
      }

      // Toggle Sidebar (Cmd/Ctrl + B)
      if (matchesShortcut(e, SHORTCUTS.TOGGLE_SIDEBAR)) {
        e.preventDefault();
        if (typeof window !== "undefined" && window.innerWidth <= 768) {
          setSidebarCollapsed(!sidebarCollapsed);
        } else {
          // Keep sidebar fixed on desktop
          setSidebarCollapsed(false);
        }
        return;
      }

      // Show Shortcuts (Cmd/Ctrl + /)
      if (matchesShortcut(e, SHORTCUTS.SHOW_SHORTCUTS)) {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      // Escape to close modals
      if (e.key === "Escape") {
        if (showQuickSearch) setShowQuickSearch(false);
        if (showShortcuts) setShowShortcuts(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showQuickSearch, showShortcuts, sidebarCollapsed, addPage, showInfo]);

  // Update collapsed state when window is resized
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      // On desktop (>768px), always show sidebar
      // On mobile (<=768px), keep current state (user controls it)
      if (window.innerWidth > 768 && sidebarCollapsed) {
        setSidebarCollapsed(false);
      }
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  // Current context label for header (helps mobile users keep orientation when breadcrumbs are hidden)
  const activeContextLabel = useMemo(() => {
    if (activePage === "tasks") return "Tasks";
    if (activePage === "habits") return "Habits";
    if (activePage === "analytics") return "Analytics";
    if (activePage === "home" || !activePage) return "Dashboard";
    return currentPage?.title || "Page";
  }, [activePage, currentPage]);

  return (
    <div className="app-layout">
      <button
        className="back-dashboard-floating"
        onClick={() => setActivePage("home")}
        aria-label="Back to dashboard"
      >
        ← Dashboard
      </button>
      {/* Simple Header */}
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-header-left">
            {/* Hamburger menu button - only show on mobile */}
            {typeof window !== 'undefined' && window.innerWidth <= 768 && (
              <button
                className="mobile-menu-button"
                onClick={() => setSidebarCollapsed(false)}
                aria-label="Open menu"
              >
                ☰
              </button>
            )}
          </div>

          <div className="app-header-title-wrap">
            <h1 className="app-header-title">Taskline</h1>
            {isMobile && (
              <span className="app-header-context" aria-label="Current section">
                {activeContextLabel}
              </span>
            )}
          </div>

          <div className="app-header-right">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <Sidebar
        pages={getRootPages()}
        activePage={activePage}
        onPageSelect={(pageId) => {
          setActivePage(pageId);
          // Close sidebar on mobile when page is selected
          if (typeof window !== 'undefined' && window.innerWidth <= 768) {
            setSidebarCollapsed(true);
          }
        }}
        onAddPage={addPage}
        onUpdatePage={updatePage}
        onDeletePage={deletePage}
        onToggleExpanded={toggleExpanded}
        isExpanded={isExpanded}
        getChildren={getChildren}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
        onShowAchievements={() => setShowAchievements(true)}
        onShowFocusTimer={() => setShowFocusTimer(true)}
        onShowGoals={() => setShowGoals(true)}
      />
      {/* Mobile overlay */}
      {!sidebarCollapsed && typeof window !== 'undefined' && window.innerWidth <= 768 && (
        <div
          className="sidebar-overlay active"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
          <main className="app-main">
            <PageContent 
              page={currentPage} 
              breadcrumbs={breadcrumbs}
              onNavigate={setActivePage}
              onUpdatePage={updatePage}
              activePageId={activePage}
            />
          </main>
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
      {showQuickSearch && (
        <QuickSearch
          onPageSelect={setActivePage}
          onClose={() => setShowQuickSearch(false)}
        />
      )}
      <HelpButton onNavigate={setActivePage} />
      <QuickNotes />
      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Modals for Tools */}
      {showAchievements && (
        <Achievements
          stats={{
            totalTasks: allTodos.filter(t => t.type === "task").length,
            completedTasks: allTodos.filter(t => t.type === "task" && t.completed).length,
            totalHabits: allTodos.filter(t => t.type === "habit").length,
            activeHabits: allTodos.filter(t => t.type === "habit" && !t.completed).length,
            totalStreaks: allTodos.filter(t => t.type === "habit" && t.streak > 0).reduce((sum, t) => sum + (t.streak || 0), 0),
            unlockedAchievements: safeGetItem("achievements-unlocked", []).length,
          }}
          onClose={() => setShowAchievements(false)}
        />
      )}
      
      {showFocusTimer && (
        <div className="focus-timer-modal-overlay" onClick={() => setShowFocusTimer(false)}>
          <div className="focus-timer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="focus-timer-modal-header">
              <h2>Focus Timer</h2>
              <button onClick={() => setShowFocusTimer(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="focus-timer-modal-content">
              <FocusTimer />
            </div>
          </div>
        </div>
      )}
      
      {showGoals && (
        <div className="modal-overlay" onClick={() => setShowGoals(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Goals</h2>
              <button onClick={() => setShowGoals(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="modal-content">
              <Goals todos={allTodos} />
            </div>
          </div>
        </div>
      )}
      
      <footer className="app-footer">
        <p>Developed by Antonio Quijano with React</p>
      </footer>
    </div>
  );
}

export default App;
