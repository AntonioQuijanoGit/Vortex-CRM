import React, { useState } from "react";
import { Icons } from "../../utils/icons";
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
  level = 0,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(page.title);
  const [showOptions, setShowOptions] = useState(false);

  const children = getChildren(page.id);
  const indent = level * 20;

  const handleUpdate = () => {
    if (editTitle.trim() && editTitle !== page.title) {
      onUpdate(page.id, { title: editTitle.trim() });
    } else {
      setEditTitle(page.title);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${page.title}" and all its subpages?`)) {
      onDelete(page.id);
    }
  };

  const handleAddSubpage = () => {
    onAddChild("Untitled", page.id, "page");
    setShowOptions(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
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
        onMouseLeave={() => setShowOptions(false)}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setShowOptions(false)}
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
            onClick={onSelect}
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
              <span className="page-title">{page.title}</span>
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
                title="Delete"
                aria-label="Delete page"
              >
                {Icons.delete}
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && children.length > 0 && (
        <div className="page-children" role="group">
          {children.map((child) => (
            <PageItem
              key={child.id}
              page={child}
              isActive={isActive}
              isExpanded={isExpanded}
              hasChildren={getChildren(child.id).length > 0}
              onSelect={onSelect}
              onToggleExpanded={onToggleExpanded}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
              getChildren={getChildren}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}
