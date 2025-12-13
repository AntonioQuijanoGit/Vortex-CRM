import React, { useState } from "react";
import { Icons } from "../../../utils/icons";
import { safeGetItem, safeSetItem } from "../../../utils/storage";
import { logger } from "../../../utils/logger";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./OrphanedItems.css";

export default function OrphanedItems({ onNavigate, onClose }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Find all todos that are in pages that don't exist
  const getOrphanedItems = () => {
    const orphanedItems = [];
    const allPages = safeGetItem("notion-pages", []);
    const pageIds = new Set(allPages.map(p => p.id));

    // Only access localStorage in browser environment
    if (typeof window !== 'undefined' && localStorage) {
      // Check all todos from pages
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("todos-")) {
          const pageId = key.replace("todos-", "");
          const pageTodos = safeGetItem(key, []);
          const page = allPages.find(p => p.id === pageId);
          
          // If page doesn't exist, these todos are orphaned
          if (!page && pageId && pageId !== "null" && pageId !== "undefined") {
            pageTodos.forEach(todo => {
              orphanedItems.push({
                ...todo,
                pageId: pageId,
                storageKey: key
              });
            });
          }
        }
      }
    }

    return orphanedItems;
  };

  const orphanedItems = getOrphanedItems();

  const handleDeleteOrphaned = (item) => {
    const todos = safeGetItem(item.storageKey, []);
    const updatedTodos = todos.filter(t => t.id !== item.id);
    try {
      safeSetItem(item.storageKey, updatedTodos);
      // If no more todos in this key, we could delete the key, but let's leave it
    } catch (error) {
      logger.error("Error deleting orphaned item:", error);
    }
  };

  const handleTryNavigate = (pageId) => {
    // Try to navigate - if page doesn't exist, nothing will happen
    if (pageId) {
      onNavigate(pageId);
    }
  };

  if (orphanedItems.length === 0) {
    return (
      <div className="event-form-overlay" onClick={onClose}>
        <div className="event-form orphaned-items-modal" onClick={(e) => e.stopPropagation()}>
          <div className="event-form-header">
            <h4>Orphaned Items</h4>
            <button className="event-form-close" onClick={onClose}>
              {Icons.close}
            </button>
          </div>
          <div className="orphaned-items-empty">
            <p>No orphaned items found. All items are in valid pages.</p>
          </div>
          <div className="event-form-actions">
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="event-form-overlay" onClick={onClose}>
        <div className="event-form orphaned-items-modal" onClick={(e) => e.stopPropagation()}>
          <div className="event-form-header">
            <h4>Orphaned Items ({orphanedItems.length})</h4>
            <button className="event-form-close" onClick={onClose}>
              {Icons.close}
            </button>
          </div>
          <div className="orphaned-items-content">
            <p className="orphaned-items-description">
              These items are in pages that no longer exist. You can try to navigate to them or delete them.
            </p>
            <div className="orphaned-items-list">
              {orphanedItems.map((item) => (
                <div key={item.id} className="orphaned-item">
                  <div className="orphaned-item-content">
                    <span className={`orphaned-item-icon ${item.type === "habit" ? "habit" : "task"}`}>
                      {item.type === "task" ? Icons.task : Icons.habit}
                    </span>
                    <div className="orphaned-item-info">
                      <strong className="orphaned-item-title">{item.title}</strong>
                      <span className="orphaned-item-meta">
                        {item.type} • Page ID: {item.pageId.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                  <div className="orphaned-item-actions">
                    <button
                      className="orphaned-item-button try-navigate"
                      onClick={() => handleTryNavigate(item.pageId)}
                      title="Try to navigate to page (may not exist)"
                    >
                      {Icons.arrowRight} Try Navigate
                    </button>
                    <button
                      className="orphaned-item-button delete"
                      onClick={() => setShowDeleteConfirm(item)}
                      title="Delete this item"
                    >
                      {Icons.delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="event-form-actions">
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={!!showDeleteConfirm}
          title="Delete Orphaned Item"
          message={`Are you sure you want to delete "${showDeleteConfirm.title}"? This item is in a page that no longer exists.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={() => {
            handleDeleteOrphaned(showDeleteConfirm);
            setShowDeleteConfirm(null);
          }}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </>
  );
}

