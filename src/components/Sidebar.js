import React, { useState } from "react";
import PageItem from "./PageItem";
import { Icons } from "../utils/icons";
import "./Sidebar.css";

export default function Sidebar({
  pages,
  activePage,
  onPageSelect,
  onAddPage,
  onUpdatePage,
  onDeletePage,
  onToggleExpanded,
  isExpanded,
  getChildren
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNewPageInput, setShowNewPageInput] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");

  const rootPages = pages.filter(page => page.parentId === null);

  const handleAddPage = () => {
    if (newPageTitle.trim()) {
      onAddPage(newPageTitle, null, "page");
      setNewPageTitle("");
      setShowNewPageInput(false);
    }
  };

  return (
    <nav
      className={`notion-sidebar ${isCollapsed ? "collapsed" : ""}`}
      aria-label="Workspace navigation"
    >
      <div className="sidebar-scroll">
        <div className="sidebar-header">
          <button
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? "→" : "←"}
          </button>
          {!isCollapsed && (
            <div className="sidebar-workspace">
              <span className="workspace-name">My Workspace</span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <section className="sidebar-content" aria-labelledby="pages-title">
            <header className="pages-section">
              <div className="pages-header">
                <h2 id="pages-title">Pages</h2>
                <button
                  className="add-page-button"
                  onClick={() => setShowNewPageInput(true)}
                  aria-label="Open new page input"
                >
                  {Icons.add}
                </button>
              </div>

              {showNewPageInput && (
                <div className="new-page-input-container" role="region" aria-live="polite">
                  <input
                    type="text"
                    className="new-page-input"
                    placeholder="Page name..."
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddPage();
                      if (e.key === "Escape") {
                        setShowNewPageInput(false);
                        setNewPageTitle("");
                      }
                    }}
                    onBlur={handleAddPage}
                    autoFocus
                    aria-label="New page title"
                  />
                </div>
              )}
            </header>

            <div className="pages-list" role="tree" aria-label="Workspace pages">
              {rootPages.map((page) => (
                <PageItem
                  key={page.id}
                  page={page}
                  isActive={activePage === page.id}
                  isExpanded={isExpanded(page.id)}
                  hasChildren={getChildren(page.id).length > 0}
                  onSelect={() => onPageSelect(page.id)}
                  onToggleExpanded={() => onToggleExpanded(page.id)}
                  onUpdate={onUpdatePage}
                  onDelete={onDeletePage}
                  onAddChild={onAddPage}
                  getChildren={getChildren}
                  level={0}
                />
              ))}
            </div>
          </section>
        )}

        {!isCollapsed && (
          <div className="sidebar-footer">
            <button className="new-page-button" onClick={() => setShowNewPageInput(true)}>
              <span className="button-icon">{Icons.add}</span>
              <span className="button-text">New Page</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
