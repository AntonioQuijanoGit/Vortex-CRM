import React, { useState } from "react";
import { PageItem } from "../Page";
import { Icons, renderIcon } from "../../utils/icons";
import { Tooltip } from "../shared";
import { useIsMobile } from "../../hooks/useIsMobile";
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
  onShowAchievements,
  onShowFocusTimer,
  onShowGoals
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const isMobile = useIsMobile();
  const handleToggleCollapse = () => {
    // Allow collapsing only on mobile
    if (isMobile) {
      if (onToggleCollapse) {
        onToggleCollapse(!isCollapsed);
      } else {
        setInternalCollapsed(!isCollapsed);
      }
    } else {
      if (onToggleCollapse) onToggleCollapse(false);
      setInternalCollapsed(false);
    }
  };
  // Filter out the default "Home" page from the pages list
  const rootPages = pages.filter(page => page.parentId === null && page.id !== "home");
  
  const [showNewPageInput, setShowNewPageInput] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");

  const handleAddPage = () => {
    if (newPageTitle.trim()) {
      onAddPage(newPageTitle.trim(), null, "page");
      setNewPageTitle("");
      setShowNewPageInput(false);
    } else {
      // Cancel if no title entered
      setNewPageTitle("");
      setShowNewPageInput(false);
    }
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
      aria-label="Productivity navigation"
    >
      <div className="sidebar-scroll">
        <div className="sidebar-header">
          <button
            className="sidebar-toggle"
            onClick={handleToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {renderIcon(isCollapsed ? Icons.arrowRight : Icons.arrowLeft, 16)}
          </button>
          {!isCollapsed && (
            <div className="sidebar-workspace">
              <span className="workspace-name">Taskline</span>
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
                  <span className="nav-icon">{renderIcon(section.icon, 18)}</span>
                  <span className="nav-label">{section.label}</span>
                </button>
              ))}
            </div>

            {/* Tools - surfaced near top for quicker discovery */}
            <div className="sidebar-divider"></div>
            <div className="tools-section-direct">
              <div className="tools-section-header">
                <span className="tools-section-label">Tools</span>
              </div>
              <div className="tools-list-direct">
                {onShowFocusTimer && (
                  <button
                    className="nav-item"
                    onClick={() => {
                      onShowFocusTimer();
                      if (onToggleCollapse && isMobile) onToggleCollapse(true);
                    }}
                  >
                    <span className="nav-icon">{renderIcon(Icons.timer, 18)}</span>
                    <span className="nav-label">Focus Timer</span>
                  </button>
                )}
                {onShowGoals && (
                  <button
                    className="nav-item"
                    onClick={() => {
                      onShowGoals();
                      if (onToggleCollapse && isMobile) onToggleCollapse(true);
                    }}
                  >
                    <span className="nav-icon">{renderIcon(Icons.target, 18)}</span>
                    <span className="nav-label">Goals</span>
                  </button>
                )}
                {onShowAchievements && (
                  <button
                    className="nav-item"
                    onClick={() => {
                      onShowAchievements();
                      if (onToggleCollapse && isMobile) onToggleCollapse(true);
                    }}
                  >
                    <span className="nav-icon">{renderIcon(Icons.trophy, 18)}</span>
                    <span className="nav-label">Achievements</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pages - Show directly in navigation if there are pages */}
            {rootPages.length > 0 && (
              <>
                <div className="sidebar-divider"></div>
                <div className="pages-section-direct">
                  <div className="pages-section-header">
                    <span className="pages-section-label">Pages</span>
                    <Tooltip content="Create a new page to organize your content" position="right">
                      <button
                        className="add-page-button-inline"
                        onClick={() => setShowNewPageInput(true)}
                        aria-label="Add new page"
                      >
                        {renderIcon(Icons.add, 16)}
                      </button>
                    </Tooltip>
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
                        onBlur={(e) => {
                          // Use setTimeout to check if focus moved to cancel button
                          setTimeout(() => {
                            // Only create if there's actual content
                            if (newPageTitle.trim() && document.activeElement !== e.target) {
                              handleAddPage();
                            } else if (!newPageTitle.trim()) {
                              // Cancel if empty
                              setShowNewPageInput(false);
                              setNewPageTitle("");
                            }
                          }, 150);
                        }}
                        autoFocus
                        aria-label="New page title"
                      />
                    </div>
                  )}

                  <div className="pages-list-direct" role="tree" aria-label="Productivity pages">
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
                </div>
              </>
            )}

            {/* Show "Create page" option if no pages exist */}
            {rootPages.length === 0 && (
              <>
                <div className="sidebar-divider"></div>
                <Tooltip content="Click here to create your first page and start organizing your content" position="right">
                  <button
                    className="nav-item create-page-nav highlight-action"
                    onClick={() => setShowNewPageInput(true)}
                  >
                    <span className="nav-icon">{renderIcon(Icons.add, 18)}</span>
                    <span className="nav-label">New Page</span>
                    <span className="action-hint">Click to create</span>
                  </button>
                </Tooltip>
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
              </>
            )}
          </section>
        )}

      </div>
    </nav>
  );
}
