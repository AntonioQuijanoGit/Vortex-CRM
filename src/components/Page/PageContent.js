import React, { useState } from "react";
import { TodoApp } from "../Todo";
import { Dashboard } from "../Dashboard";
import { BlockManager } from "../BlockManager";
import { PageActions, Backlinks, TagSelector } from "../shared";
import DatabaseView from "../Database/DatabaseView";
import { usePages } from "../../hooks/usePages";
import "./PageContent.css";

export default function PageContent({
  page,
  breadcrumbs,
  onNavigate,
  onUpdatePage,
  onDeletePage,
  onDuplicatePage,
}) {
  // Show dashboard when no page or when on home page, but always show breadcrumbs
  const isDashboard = !page || page.id === "home" || page.id === "dashboard";
  
  if (isDashboard) {
    return (
      <div
        className="page-content page-content-dashboard"
        role="region"
        aria-live="polite"
      >
        <BreadcrumbTrail items={breadcrumbs} onNavigate={onNavigate} />
        <Dashboard onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="page-content" role="region" aria-live="polite">
      <BreadcrumbTrail items={breadcrumbs} onNavigate={onNavigate} />
      <PageHero 
        page={page} 
        onUpdatePage={onUpdatePage}
        onDeletePage={onDeletePage}
        onDuplicatePage={onDuplicatePage}
      />
      <div className="page-body">
        {page.type === "database" ? (
          <DatabaseView page={page} onUpdatePage={onUpdatePage} />
        ) : (
          <RegularPageView page={page} onUpdatePage={onUpdatePage} onNavigate={onNavigate} />
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
        <span className="breadcrumb-title">Home</span>
      </button>
      {items.length > 0 && items.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          <span className="breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <button
            className="breadcrumb-item"
            onClick={() => onNavigate && onNavigate(crumb.id)}
            aria-label={`Go to ${crumb.title}`}
          >
            <span className="breadcrumb-title">{crumb.title}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}

function PageHero({ page, onUpdatePage, onDeletePage, onDuplicatePage }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(page.title);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tags, setTags] = useState(page.tags || []);

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle !== page.title) {
      onUpdatePage(page.id, { title: editTitle.trim() });
    } else {
      setEditTitle(page.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="page-hero">
      <div className="page-hero-content">
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
            Manage your {page.title.toLowerCase()} with filters, views, and
            organization tools.
          </p>
        )}
        <div className="page-hero-actions">
          <PageActions
            page={page}
            onDuplicate={onDuplicatePage}
            onMove={() => {}}
            onDelete={onDeletePage}
            onFavorite={() => setIsFavorite(true)}
            onUnfavorite={() => setIsFavorite(false)}
            isFavorite={isFavorite}
          />
        </div>
        <div className="page-hero-tags">
          <TagSelector
            selectedTags={tags}
            onChange={(newTags) => {
              setTags(newTags);
              onUpdatePage(page.id, { tags: newTags });
            }}
          />
        </div>
      </div>
    </header>
  );
}

// DatabaseView is now imported from Database/DatabaseView.js

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
      title: "Hierarchical Pages",
      copy: "Create pages and subpages to organize your content in a clear tree structure.",
    },
    {
      title: "Multiple Views",
      copy: "Switch between list, board, table, and calendar views to visualize your data.",
    },
    {
      title: "Task Management",
      copy: "Track tasks and habits with streak counters and completion metrics.",
    },
    {
      title: "Productivity Dashboard",
      copy: "Monitor your progress with visual analytics and productivity insights.",
    },
  ];

  return (
    <div className="welcome-content">
      <section className="welcome-hero">
        <h2>Welcome to Your Workspace</h2>
        <p>
          A productivity app designed for clarity and efficiency. Manage tasks,
          track habits, and organize your work with a clean, functional
          interface.
        </p>
      </section>

      <section className="highlight-grid">
        {features.map((feature) => (
          <article key={feature.title} className="highlight-card">
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="roadmap-section">
        <h3>Quick Start Guide</h3>
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
