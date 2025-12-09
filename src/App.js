import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import PageContent from "./components/PageContent";
import Onboarding from "./components/Onboarding";
import HelpButton from "./components/HelpButton";
import QuickSearch from "./components/QuickSearch";
import { usePages } from "./hooks/usePages";
import "./App.css";

function App() {
  const {
    pages,
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
  const breadcrumbs = activePage ? getBreadcrumbs(activePage) : [];

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("has-seen-tutorial");
    if (!hasSeenTutorial) {
      // Small delay to let the page render
      setTimeout(() => setShowOnboarding(true), 500);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K for quick search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowQuickSearch(true);
      }
      // Escape to close search
      if (e.key === "Escape" && showQuickSearch) {
        setShowQuickSearch(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showQuickSearch]);

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
      <HelpButton />
    </div>
  );
}

export default App;
