import React, { useState } from "react";
import { Icons } from "../../utils/icons";
import { ConfirmDialog } from "../shared";
import { useTodos } from "../../hooks/useTodos";
import "./PageItem.css";

export default function PageItem({
  page,
  isActive,
  isExpanded,
  hasChildren,
  onSelect,
  onToggleExpanded,
  onUpdate,
  onDelete,
  onAddChild,
  getChildren,
  activePageId, // Add this prop to check if child is active
  level = 0,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(page.title);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const children = getChildren(page.id);
  const indent = level * 20;
  
  // Get todos count for this page
  const { todos } = useTodos(page.id);
  const todosCount = todos.length;

  const handleUpdate = () => {
    if (editTitle.trim() && editTitle !== page.title) {
      onUpdate(page.id, { title: editTitle.trim() });
    } else {
      setEditTitle(page.title);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    try {
      onDelete(page.id, true); // Pass force=true to actually delete
      setShowDeleteConfirm(false);
    } catch (error) {
      // If page has content, show confirmation
      setShowDeleteConfirm(false);
      // Re-open with force confirmation
      setShowDeleteConfirm(true);
    }
  };

  const handleAddSubpage = () => {
    onAddChild("Untitled", page.id, "page");
    setShowOptions(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (typeof onSelect === 'function') {
        onSelect(page.id);
      }
    }
    if (event.key === "ArrowRight" && hasChildren && !isExpanded) {
      onToggleExpanded();
    }
    if (event.key === "ArrowLeft" && hasChildren && isExpanded) {
      onToggleExpanded();
    }
  };

  return (
    <>
      <div
        className={`page-item ${isActive ? "active" : ""}`}
        style={{ paddingLeft: `${12 + indent}px` }}
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={(e) => {
          // Don't hide if moving to options buttons
          // Check if relatedTarget is a valid Node before using contains
          const relatedTarget = e.relatedTarget;
          const pageOptions = e.currentTarget.querySelector('.page-options');
          if (relatedTarget && relatedTarget instanceof Node && pageOptions) {
            if (!pageOptions.contains(relatedTarget)) {
              setShowOptions(false);
            }
          } else {
            setShowOptions(false);
          }
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={(e) => {
          // Don't hide if clicking on options buttons
          // Check if relatedTarget is a valid Node before using contains
          const relatedTarget = e.relatedTarget;
          if (relatedTarget && relatedTarget instanceof Node) {
            if (!e.currentTarget.contains(relatedTarget)) {
              setShowOptions(false);
            }
          } else {
            setShowOptions(false);
          }
        }}
        role="treeitem"
        aria-selected={isActive}
        aria-expanded={hasChildren ? isExpanded : undefined}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="page-item-content">
          {hasChildren && (
            <button
              className="expand-button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpanded();
              }}
              aria-label={isExpanded ? "Collapse subpages" : "Expand subpages"}
              aria-expanded={isExpanded}
            >
              {isExpanded ? Icons.expand : Icons.collapse}
            </button>
          )}

          <button
            className="page-link"
            onClick={() => {
              if (typeof onSelect === 'function') {
                onSelect(page.id);
              }
            }}
            style={{ marginLeft: hasChildren ? "0" : "20px" }}
            aria-label={`Open ${page.title}`}
          >
            {isEditing ? (
              <input
                type="text"
                className="page-edit-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdate();
                  if (e.key === "Escape") {
                    setIsEditing(false);
                    setEditTitle(page.title);
                  }
                }}
                onBlur={handleUpdate}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <>
                <span className="page-title">{page.title}</span>
                {todosCount > 0 && (
                  <span className="page-todos-badge" aria-label={`${todosCount} ${todosCount === 1 ? "item" : "items"}`}>
                    {todosCount}
                  </span>
                )}
              </>
            )}
          </button>

          {showOptions && !isEditing && (
            <div className="page-options">
              <button
                className="option-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddSubpage();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                title="Add subpage"
                aria-label="Add subpage"
              >
                {Icons.add}
              </button>
              <button
                className="option-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                title="Rename"
                aria-label="Rename page"
              >
                {Icons.edit}
              </button>
              <button
                className="option-button delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                title="Delete"
                aria-label="Delete page"
              >
                {Icons.delete}
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Page"
        message={`Are you sure you want to delete "${page.title}"${children.length > 0 ? ' and all its subpages' : ''}? This will also delete all tasks, habits, and content in this page. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {isExpanded && children.length > 0 && (
        <div className="page-children" role="group">
          {children.map((child) => {
            const childIsExpanded = typeof isExpanded === 'function' ? isExpanded(child.id) : false;
            return (
              <PageItem
                key={child.id}
                page={child}
                isActive={activePageId === child.id}
                isExpanded={childIsExpanded}
                hasChildren={getChildren(child.id).length > 0}
                onSelect={(pageId) => {
                  if (typeof onSelect === 'function') {
                    onSelect(pageId || child.id);
                  }
                }}
                onToggleExpanded={(pageId) => {
                  if (typeof onToggleExpanded === 'function') {
                    onToggleExpanded(pageId || child.id);
                  }
                }}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAddChild={onAddChild}
                getChildren={getChildren}
                activePageId={activePageId}
                level={level + 1}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
