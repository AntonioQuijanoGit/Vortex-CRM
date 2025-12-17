import React, { useState, useRef, useEffect } from "react";
import { Icons, renderIcon } from "../../utils/icons";
import { ConfirmDialog, PagePreview, Tooltip } from "../shared";
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
  const [showPreview, setShowPreview] = useState(false);
  const previewTimeoutRef = useRef(null);
  const itemRef = useRef(null);

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
    onAddChild("", page.id, "page"); // Empty string - will be "Untitled" by default
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

  const handleMouseEnter = () => {
    setShowOptions(true);
    // Show preview after a short delay
    previewTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 500);
  };

  const handleMouseLeave = (e) => {
    // Clear preview timeout
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    setShowPreview(false);
    
    // Don't hide if moving to options buttons or preview
    const relatedTarget = e.relatedTarget;
    const pageOptions = e.currentTarget.querySelector('.page-options');
    const preview = document.querySelector('.page-preview');
    
    if (relatedTarget && relatedTarget instanceof Node) {
      if (pageOptions && pageOptions.contains(relatedTarget)) {
        return;
      }
      if (preview && preview.contains(relatedTarget)) {
        return;
      }
    }
    setShowOptions(false);
  };

  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={itemRef}
        className={`page-item ${isActive ? "active" : ""}`}
        style={{ paddingLeft: `${12 + indent}px` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setShowOptions(true)}
        onBlur={(e) => {
          // Don't hide if clicking on options buttons
          // Check if relatedTarget is a valid Node before using contains
          const relatedTarget = e.relatedTarget;
          if (relatedTarget && relatedTarget instanceof Node) {
            if (!e.currentTarget.contains(relatedTarget)) {
              setShowOptions(false);
              setShowPreview(false);
            }
          } else {
            setShowOptions(false);
            setShowPreview(false);
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
              {renderIcon(isExpanded ? Icons.expand : Icons.collapse, 12)}
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
                <span className="page-icon">
                  {(() => {
                    // Debug: log what icon we're rendering
                    const iconToRender = page.icon || Icons.page;
                    const iconKey = typeof iconToRender === 'string' ? iconToRender : 
                                   (iconToRender === Icons.habit ? 'habit' :
                                    iconToRender === Icons.page ? 'page' :
                                    iconToRender === Icons.database ? 'database' : 'unknown');
                    console.log(`[PageItem] Rendering icon for "${page.title}":`, iconKey, iconToRender);
                    return renderIcon(iconToRender, 16);
                  })()}
                </span>
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
              <Tooltip content="Add a subpage to organize content hierarchically" position="bottom">
                <button
                  className="option-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddSubpage();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  aria-label="Add subpage"
                >
                  {renderIcon(Icons.add, 14)}
                </button>
              </Tooltip>
              <Tooltip content="Rename this page" position="bottom">
                <button
                  className="option-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  aria-label="Rename page"
                >
                  {renderIcon(Icons.edit, 14)}
                </button>
              </Tooltip>
              <Tooltip content="Delete this page and all its content (cannot be undone)" position="bottom">
                <button
                  className="option-button delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  aria-label="Delete page"
                >
                  {renderIcon(Icons.delete, 14)}
                </button>
              </Tooltip>
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

      {showPreview && itemRef.current && (
        <div
          className="page-preview-container"
          style={{
            position: 'fixed',
            top: itemRef.current.getBoundingClientRect().top + 'px',
            left: (itemRef.current.getBoundingClientRect().right + 12) + 'px',
            zIndex: 10000,
          }}
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => {
            setShowPreview(false);
            if (previewTimeoutRef.current) {
              clearTimeout(previewTimeoutRef.current);
            }
          }}
        >
          <PagePreview page={page} getChildren={getChildren} />
        </div>
      )}

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
