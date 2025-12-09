import React, { useState } from "react";
import TodoApp from "./todoApp";
import EmptyState from "./EmptyState";
import Dashboard from "./Dashboard";
import MovieTracker from "./MovieTracker";
import NoteEditor from "./NoteEditor";
import WelcomeGuide from "./WelcomeGuide";
import BlockManager from "./BlockManager";
import "./PageContent.css";

export default function PageContent({ page, breadcrumbs, onNavigate, onUpdatePage }) {
  if (!page) {
    return (
      <div className="page-content" role="region" aria-live="polite">
        <Dashboard onNavigate={onNavigate} />
      </div>
    );
  }

  // Show dashboard for home page
  if (page.id === "home" || page.id === "dashboard") {
    return (
      <div className="page-content page-content-dashboard" role="region" aria-live="polite">
        <Dashboard onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="page-content" role="region" aria-live="polite">
      <BreadcrumbTrail items={breadcrumbs} onNavigate={onNavigate} />
      <PageHero page={page} onUpdatePage={onUpdatePage} />
      <div className="page-body">
        {page.type === "database" ? (
          <DatabaseView page={page} />
        ) : (
          <RegularPageView page={page} onUpdatePage={onUpdatePage} />
        )}
      </div>
    </div>
  );
}

function BreadcrumbTrail({ items, onNavigate }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb navigation">
      <button 
        className="breadcrumb-item breadcrumb-home"
        onClick={() => onNavigate && onNavigate("home")}
        aria-label="Go to home"
      >
        <span className="breadcrumb-icon" aria-hidden="true">🏠</span>
        <span className="breadcrumb-title">Home</span>
      </button>
      {items.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          <span className="breadcrumb-separator" aria-hidden="true">/</span>
          <span className="breadcrumb-item">
            <span className="breadcrumb-icon" aria-hidden="true">{crumb.icon}</span>
            <span className="breadcrumb-title">{crumb.title}</span>
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}

function PageHero({ page, onUpdatePage }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingIcon, setIsEditingIcon] = useState(false);
  const [editTitle, setEditTitle] = useState(page.title);
  const [editIcon, setEditIcon] = useState(page.icon);

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle !== page.title) {
      onUpdatePage(page.id, { title: editTitle.trim() });
    } else {
      setEditTitle(page.title);
    }
    setIsEditingTitle(false);
  };

  const handleIconSave = () => {
    if (editIcon !== page.icon) {
      onUpdatePage(page.id, { icon: editIcon });
    } else {
      setEditIcon(page.icon);
    }
    setIsEditingIcon(false);
  };

  const commonIcons = ["📄", "📝", "✓", "🎬", "📅", "📊", "🎯", "💡", "🔖", "📌", "⭐", "🔥"];

  return (
    <header className="page-hero">
      <div 
        className="page-icon-large editable-icon" 
        onClick={() => setIsEditingIcon(true)}
        title="Click to change icon"
      >
        {isEditingIcon ? (
          <div className="icon-picker">
            <input
              type="text"
              value={editIcon}
              onChange={(e) => setEditIcon(e.target.value)}
              onBlur={handleIconSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleIconSave();
                if (e.key === "Escape") {
                  setIsEditingIcon(false);
                  setEditIcon(page.icon);
                }
              }}
              className="icon-input"
              autoFocus
              maxLength={2}
            />
            <div className="icon-suggestions">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className="icon-option"
                  onClick={() => {
                    setEditIcon(icon);
                    handleIconSave();
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        ) : (
          page.icon
        )}
      </div>
      <div className="page-hero-content">
        <p className="page-eyebrow">{page.viewType?.toUpperCase() || "PAGE"}</p>
        {isEditingTitle ? (
          <input
            type="text"
            className="page-title-edit"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSave();
              if (e.key === "Escape") {
                setIsEditingTitle(false);
                setEditTitle(page.title);
              }
            }}
            autoFocus
          />
        ) : (
          <h1 
            className="page-title-large editable-title" 
            onClick={() => setIsEditingTitle(true)}
            title="Click to edit title"
          >
            {page.title}
          </h1>
        )}
        {page.type === "database" && (
          <p className="page-subtitle">
            Manage your {page.title.toLowerCase()} with filters, views, and organization tools.
          </p>
        )}
      </div>
    </header>
  );
}

function DatabaseView({ page }) {
  return (
    <section className="database-view" aria-label={`${page.title} database view`}>
      <TodoApp pageId={page.id} viewType={page.viewType} />
    </section>
  );
}

function RegularPageView({ page, onUpdatePage }) {
  if (page.id === "welcome") {
    return (
      <section className="regular-page-view">
        <WelcomePage />
      </section>
    );
  }

  const handleUpdateBlocks = (blocks) => {
    onUpdatePage(page.id, { content: blocks });
  };

  // For backward compatibility, check if page has old-style content
  const blocks = Array.isArray(page.content) ? page.content : [];

  return (
    <section className="regular-page-view">
      <BlockManager
        pageId={page.id}
        blocks={blocks}
        onUpdateBlocks={handleUpdateBlocks}
      />
    </section>
  );
}

function WelcomePage() {
  const features = [
    {
      icon: "📄",
      title: "Hierarchical Pages",
      copy: "Create pages and subpages to organize your content in a clear tree structure."
    },
    {
      icon: "📊",
      title: "Multiple Views",
      copy: "Switch between list, board, table, and calendar views to visualize your data."
    },
    {
      icon: "✓",
      title: "Task Management",
      copy: "Track tasks and habits with streak counters and completion metrics."
    },
    {
      icon: "🎯",
      title: "Productivity Dashboard",
      copy: "Monitor your progress with visual analytics and productivity insights."
    },
  ];

  return (
    <div className="welcome-content">
      <section className="welcome-hero">
        <h2>Welcome to Your Workspace</h2>
        <p>
          A productivity app designed for clarity and efficiency. 
          Manage tasks, track habits, and organize your work with a clean, functional interface.
        </p>
      </section>

      <section className="highlight-grid">
        {features.map((feature) => (
          <article key={feature.title} className="highlight-card">
            <span aria-hidden="true">{feature.icon}</span>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="roadmap-section">
        <h3>Getting Started</h3>
        <ul>
          <li>Create a new page from the sidebar</li>
          <li>Add tasks and habits to track your progress</li>
          <li>Switch between different views to find what works best</li>
          <li>Use filters and search to organize your content</li>
        </ul>
      </section>
    </div>
  );
}
