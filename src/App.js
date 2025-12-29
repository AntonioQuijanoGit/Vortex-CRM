import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { PageContent } from "./components/Page";
import { Onboarding, HelpButton, QuickSearch, ToastContainer, ShortcutsModal, ThemeToggle } from "./components/shared";
import { usePages } from "./hooks/usePages";
import { useToast } from "./hooks/useToast";
import { SHORTCUTS, matchesShortcut } from "./utils/keyboardShortcuts";
import { STORAGE_KEYS, INTERVALS } from "./constants";
import "./App.css";

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
    duplicatePage,
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const { toasts, removeToast, showInfo } = useToast();

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_TUTORIAL);
    if (!hasSeenTutorial) {
      // Small delay to let the page render
      const timer = setTimeout(() => setShowOnboarding(true), INTERVALS.ONBOARDING_DELAY);
      return () => clearTimeout(timer);
    }
  }, []);

  // Memoize handlers to avoid recreating on every render
  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const handleToggleMobileSidebar = useCallback(() => {
    setSidebarMobileOpen(prev => !prev);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setSidebarMobileOpen(false);
  }, []);

  const handleShowQuickSearch = useCallback(() => {
    setShowQuickSearch(true);
  }, []);

  const handleCloseQuickSearch = useCallback(() => {
    setShowQuickSearch(false);
  }, []);

  const handleShowShortcuts = useCallback(() => {
    setShowShortcuts(true);
  }, []);

  const handleCloseShortcuts = useCallback(() => {
    setShowShortcuts(false);
  }, []);

  const handleCreatePage = useCallback(() => {
    try {
      addPage("", null, "page");
      showInfo("New page created");
    } catch (error) {
      // Error handling - could show error toast here
      console.error("Failed to create page:", error);
    }
  }, [addPage, showInfo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.matches("input, textarea, [contenteditable]")) {
        // Allow Escape to close modals even when in inputs
        if (e.key === "Escape") {
          if (showQuickSearch) handleCloseQuickSearch();
          if (showShortcuts) handleCloseShortcuts();
        }
        return;
      }

      // Quick Search (Cmd/Ctrl + K)
      if (matchesShortcut(e, SHORTCUTS.QUICK_SEARCH)) {
        e.preventDefault();
        handleShowQuickSearch();
        return;
      }

      // New Page (Cmd/Ctrl + N)
      if (matchesShortcut(e, SHORTCUTS.NEW_PAGE)) {
        e.preventDefault();
        handleCreatePage();
        return;
      }

      // Toggle Sidebar (Cmd/Ctrl + B)
      if (matchesShortcut(e, SHORTCUTS.TOGGLE_SIDEBAR)) {
        e.preventDefault();
        handleToggleSidebar();
        return;
      }

      // Show Shortcuts (Cmd/Ctrl + /)
      if (matchesShortcut(e, SHORTCUTS.SHOW_SHORTCUTS)) {
        e.preventDefault();
        handleShowShortcuts();
        return;
      }

      // Escape to close modals
      if (e.key === "Escape") {
        if (showQuickSearch) handleCloseQuickSearch();
        if (showShortcuts) handleCloseShortcuts();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showQuickSearch,
    showShortcuts,
    handleShowQuickSearch,
    handleCloseQuickSearch,
    handleShowShortcuts,
    handleCloseShortcuts,
    handleToggleSidebar,
    handleCreatePage,
  ]);

  return (
    <div className="app-layout">
      {/* Mobile hamburger button */}
      <button
        className="mobile-menu-button"
        onClick={handleToggleMobileSidebar}
        aria-label="Toggle sidebar"
        aria-expanded={sidebarMobileOpen}
      >
        <span className="mobile-menu-icon">☰</span>
      </button>

      {/* Mobile overlay */}
      {sidebarMobileOpen && (
        <div
          className="sidebar-mobile-overlay"
          onClick={handleCloseMobileSidebar}
          aria-hidden="true"
        />
      )}

      <Sidebar
        pages={getRootPages()}
        activePage={activePage}
        onPageSelect={(pageId) => {
          setActivePage(pageId);
          setSidebarMobileOpen(false); // Close mobile sidebar on page select
        }}
        onAddPage={addPage}
        onUpdatePage={updatePage}
        onDeletePage={deletePage}
        onToggleExpanded={toggleExpanded}
        isExpanded={isExpanded}
        getChildren={getChildren}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
        isMobileOpen={sidebarMobileOpen}
        onCloseMobile={handleCloseMobileSidebar}
      />
      <main className="app-main">
        <PageContent
          page={currentPage}
          breadcrumbs={breadcrumbs}
          onNavigate={setActivePage}
          onUpdatePage={updatePage}
          onDeletePage={deletePage}
          onDuplicatePage={duplicatePage}
        />
      </main>
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
      {showQuickSearch && (
        <QuickSearch
          onPageSelect={setActivePage}
          onClose={handleCloseQuickSearch}
        />
      )}
      <ThemeToggle />
      <HelpButton onNavigate={setActivePage} />
      {showShortcuts && (
        <ShortcutsModal onClose={handleCloseShortcuts} />
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
