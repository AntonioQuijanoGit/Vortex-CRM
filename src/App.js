import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import PageContent from "./components/PageContent";
import Onboarding from "./components/Onboarding";
import HelpButton from "./components/HelpButton";
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

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("has-seen-tutorial");
    if (!hasSeenTutorial) {
      // Small delay to let the page render
      setTimeout(() => setShowOnboarding(true), 500);
    }
  }, []);

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
      <HelpButton />
    </div>
  );
}

export default App;
