import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { PageContent } from "./components/Page";
import { Onboarding, HelpButton, QuickSearch, ToastContainer, ShortcutsModal, ThemeToggle, QuickNotes } from "./components/shared";
import { usePages } from "./hooks/usePages";
import { useToast } from "./hooks/useToast";
import { SHORTCUTS, matchesShortcut } from "./utils/keyboardShortcuts";
import { safeGetItem, safeSetItem } from "./utils/storage";
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
  const { toasts, removeToast, showInfo } = useToast();

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
        setSidebarCollapsed(!sidebarCollapsed);
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

  return (
    <div className="app-layout">
      <Sidebar
        pages={getRootPages()}
        activePage={activePage}
        onPageSelect={setActivePage}
        onAddPage={addPage}
        onUpdatePage={updatePage}
        onDeletePage={deletePage}
        onToggleExpanded={toggleExpanded}
        isExpanded={isExpanded}
        getChildren={getChildren}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />
      <main className="app-main">
        <PageContent 
          page={currentPage} 
          breadcrumbs={breadcrumbs}
          onNavigate={setActivePage}
          onUpdatePage={updatePage}
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
      <ThemeToggle />
      <HelpButton onNavigate={setActivePage} />
      <QuickNotes />
      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
