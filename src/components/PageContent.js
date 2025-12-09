import React from "react";
import TodoApp from "./todoApp";
import "./PageContent.css";

export default function PageContent({ page, breadcrumbs }) {
  if (!page) {
    return (
      <div className="page-content">
        <div className="empty-page">
          <p>Select a page or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              <span className="breadcrumb-item">
                <span className="breadcrumb-icon">{crumb.icon}</span>
                <span className="breadcrumb-title">{crumb.title}</span>
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Page header */}
      <div className="page-header">
        <div className="page-icon-large">{page.icon}</div>
        <h1 className="page-title-large">{page.title}</h1>
      </div>

      {/* Page content based on type */}
      <div className="page-body">
        {page.type === "database" ? (
          <DatabaseView page={page} />
        ) : (
          <RegularPageView page={page} />
        )}
      </div>
    </div>
  );
}

// Database view (integrates existing TodoApp)
function DatabaseView({ page }) {
  return (
    <div className="database-view">
      <TodoApp pageId={page.id} viewType={page.viewType} />
    </div>
  );
}

// Regular page view (for text content pages)
function RegularPageView({ page }) {
  return (
    <div className="regular-page-view">
      {page.id === "welcome" ? (
        <WelcomePage />
      ) : (
        <div className="page-empty-content">
          <p className="empty-hint">Start writing or add a block...</p>
          <div className="quick-actions">
            <button className="quick-action-btn">
              <span>📝</span> Add text
            </button>
            <button className="quick-action-btn">
              <span>✓</span> Add to-do list
            </button>
            <button className="quick-action-btn">
              <span>📋</span> Add database
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Welcome page content
function WelcomePage() {
  return (
    <div className="welcome-content">
      <h2>Welcome to Your Notion-Style Workspace! 👋</h2>

      <section className="welcome-section">
        <h3>Getting Started</h3>
        <p>
          This workspace is inspired by Notion's powerful organization system.
          You can create pages, nest them, and organize your work however you like.
        </p>
      </section>

      <section className="welcome-section">
        <h3>Key Features</h3>
        <ul className="feature-list">
          <li>
            <strong>📄 Hierarchical Pages:</strong> Create pages and subpages to organize
            your content in a tree structure
          </li>
          <li>
            <strong>📊 Database Pages:</strong> Special pages like "My Tasks" and "Daily Habits"
            that show your todos and habits with multiple view options
          </li>
          <li>
            <strong>🎯 Quick Actions:</strong> Use the + button in the sidebar to quickly
            add new pages
          </li>
          <li>
            <strong>✏️ Easy Editing:</strong> Hover over any page in the sidebar to see
            edit, add subpage, and delete options
          </li>
        </ul>
      </section>

      <section className="welcome-section">
        <h3>Try These Actions</h3>
        <div className="action-cards">
          <div className="action-card">
            <span className="action-icon">✓</span>
            <h4>My Tasks</h4>
            <p>Click on "My Tasks" in the sidebar to manage your to-do list</p>
          </div>
          <div className="action-card">
            <span className="action-icon">↻</span>
            <h4>Daily Habits</h4>
            <p>Track your daily habits and build streaks</p>
          </div>
          <div className="action-card">
            <span className="action-icon">+</span>
            <h4>New Page</h4>
            <p>Create a new page to organize your thoughts or projects</p>
          </div>
        </div>
      </section>

      <section className="welcome-section">
        <h3>What's Next?</h3>
        <p>
          We'll be adding more features like:
        </p>
        <ul className="roadmap-list">
          <li>Multiple view types (Board, Table, Calendar)</li>
          <li>Flexible block system for rich content</li>
          <li>Custom properties and tags</li>
          <li>Templates for common use cases</li>
          <li>And much more!</li>
        </ul>
      </section>
    </div>
  );
}
