import React from "react";
import Sidebar from "./components/Sidebar";
import PageContent from "./components/PageContent";
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
        <PageContent page={currentPage} breadcrumbs={breadcrumbs} />
      </main>
    </div>
  );
}

export default App;
