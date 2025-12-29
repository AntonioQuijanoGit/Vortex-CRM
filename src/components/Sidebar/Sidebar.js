import React, { useState } from "react";
import { PageItem } from "../Page";
import { Icons } from "../../utils/icons";
import { TemplateSelector } from "../shared";
import { getAllTemplates } from "../../utils/templates";
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
  getChildren,
  isCollapsed: externalCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse(!isCollapsed);
    } else {
      setInternalCollapsed(!isCollapsed);
    }
  };
  const [showNewPageInput, setShowNewPageInput] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const rootPages = pages.filter(page => page.parentId === null);

  const handleAddPage = () => {
    if (newPageTitle.trim()) {
      onAddPage(newPageTitle, null, "page");
      setNewPageTitle("");
      setShowNewPageInput(false);
    }
  };

  const handleAddPageWithTemplate = (template) => {
    onAddPage(template.name, null, "page", Icons.page, null, template);
    setShowTemplateSelector(false);
  };

  const handleShowTemplateSelector = () => {
    setShowTemplateSelector(true);
  };

  return (
    <nav
      className={`notion-sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}
      aria-label="Workspace navigation"
    >
      {/* Mobile close button */}
      {isMobileOpen && (
        <button
          className="sidebar-mobile-close"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
        >
          ×
        </button>
      )}
      <div className="sidebar-scroll">
        <div className="sidebar-header">
          <button
            className="sidebar-toggle"
            onClick={handleToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? Icons.arrowRight : Icons.arrowLeft}
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
                <div className="add-page-buttons">
                  <button
                    className="add-page-button"
                    onClick={handleShowTemplateSelector}
                    aria-label="Add page with template"
                    title="Add page with template"
                  >
                    {Icons.page}
                  </button>
                  <button
                    className="add-page-button"
                    onClick={() => setShowNewPageInput(true)}
                    aria-label="Add blank page"
                    title="Add blank page"
                  >
                    {Icons.add}
                  </button>
                </div>
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
                  onSelect={(pageId) => onPageSelect(pageId || page.id)}
                  onToggleExpanded={(pageId) => onToggleExpanded(pageId || page.id)}
                  onUpdate={onUpdatePage}
                  onDelete={onDeletePage}
                  onAddChild={onAddPage}
                  getChildren={getChildren}
                  activePageId={activePage}
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
              <span className="buttonText">New Page</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
