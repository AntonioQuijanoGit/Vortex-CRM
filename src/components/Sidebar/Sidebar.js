import React, { useState } from "react";
import { PageItem } from "../Page";
import { Icons } from "../../utils/icons";
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
  onToggleCollapse
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
  const [expandedSections, setExpandedSections] = useState({
    pages: true, // Expanded by default on mobile
    tools: false
  });

  const rootPages = pages.filter(page => page.parentId === null);

  const handleAddPage = () => {
    if (newPageTitle.trim()) {
      onAddPage(newPageTitle, null, "page");
      setNewPageTitle("");
      setShowNewPageInput(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Navigation sections
  const navigationSections = [
    {
      id: "home",
      label: "Home",
      icon: Icons.home,
      action: () => onPageSelect("home")
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: Icons.task,
      action: () => onPageSelect("tasks")
    },
    {
      id: "habits",
      label: "Habits",
      icon: Icons.habit,
      action: () => onPageSelect("habits")
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: Icons.stats,
      action: () => onPageSelect("analytics")
    }
  ];

  return (
    <nav
      className={`notion-sidebar ${isCollapsed ? "collapsed" : ""}`}
      aria-label="Workspace navigation"
    >
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
              <span className="workspace-name">Workspace</span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <section className="sidebar-content">
            {/* Main Navigation */}
            <div className="sidebar-navigation">
              {navigationSections.map((section) => (
                <button
                  key={section.id}
                  className={`nav-item ${activePage === section.id ? "active" : ""}`}
                  onClick={section.action}
                  aria-label={section.label}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-label">{section.label}</span>
                </button>
              ))}
            </div>

            {/* Pages Section */}
            <div className="sidebar-section">
              <button
                className="section-header"
                onClick={() => toggleSection("pages")}
                aria-expanded={expandedSections.pages}
              >
                <span className="section-icon">{Icons.page}</span>
                <span className="section-title">Pages</span>
                <span className="section-toggle">
                  {expandedSections.pages ? "−" : "+"}
                </span>
              </button>
              
              {expandedSections.pages && (
                <div className="section-content">
                  <div className="pages-header-inline">
                    <button
                      className="add-page-button-small"
                      onClick={() => setShowNewPageInput(true)}
                      aria-label="Add new page"
                      title="Add new page"
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

                  <div className="pages-list" role="tree" aria-label="Workspace pages">
                    {rootPages.length > 0 ? (
                      rootPages.map((page) => (
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
                      ))
                    ) : (
                      <div className="empty-pages-hint">
                        <p>No pages yet</p>
                        <button
                          className="create-first-page"
                          onClick={() => setShowNewPageInput(true)}
                        >
                          Create your first page
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tools Section */}
            <div className="sidebar-section">
              <button
                className="section-header"
                onClick={() => toggleSection("tools")}
                aria-expanded={expandedSections.tools}
              >
                <span className="section-icon">{Icons.stats}</span>
                <span className="section-title">Tools</span>
                <span className="section-toggle">
                  {expandedSections.tools ? "−" : "+"}
                </span>
              </button>
              
              {expandedSections.tools && (
                <div className="section-content">
                  <div className="tools-list">
                    <button
                      className="tool-item"
                      onClick={() => onPageSelect("focus-timer")}
                    >
                      <span className="tool-icon">{Icons.calendar}</span>
                      <span className="tool-label">Focus Timer</span>
                    </button>
                    <button
                      className="tool-item"
                      onClick={() => onPageSelect("quick-notes")}
                    >
                      <span className="tool-icon">{Icons.note}</span>
                      <span className="tool-label">Quick Notes</span>
                    </button>
                    <button
                      className="tool-item"
                      onClick={() => onPageSelect("goals")}
                    >
                      <span className="tool-icon">{Icons.streak}</span>
                      <span className="tool-label">Goals</span>
                    </button>
                    <button
                      className="tool-item"
                      onClick={() => onPageSelect("achievements")}
                    >
                      <span className="tool-icon">{Icons.stats}</span>
                      <span className="tool-label">Achievements</span>
                    </button>
                    <button
                      className="tool-item"
                      onClick={() => onPageSelect("settings")}
                    >
                      <span className="tool-icon">{Icons.page}</span>
                      <span className="tool-label">Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

      </div>
    </nav>
  );
}
