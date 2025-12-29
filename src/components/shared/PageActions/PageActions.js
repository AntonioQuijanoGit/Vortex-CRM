import React, { useState } from "react";
import { Icons } from "../../../utils/icons";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./PageActions.css";

/**
 * Page Actions - Duplicate, Move, Delete, Favorite
 */
export default function PageActions({
  page,
  onDuplicate,
  onMove,
  onDelete,
  onFavorite,
  onUnfavorite,
  isFavorite = false,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(page.id);
    setShowDeleteConfirm(false);
  };

  const handleDuplicate = () => {
    onDuplicate(page.id);
  };

  const handleFavorite = () => {
    if (isFavorite) {
      onUnfavorite(page.id);
    } else {
      onFavorite(page.id);
    }
  };

  return (
    <>
      <div className="page-actions">
        <button
          className="page-action-btn"
          onClick={handleFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "★" : "☆"}
        </button>
        <button
          className="page-action-btn"
          onClick={handleDuplicate}
          title="Duplicate page"
          aria-label="Duplicate page"
        >
          {Icons.add}
        </button>
        <button
          className="page-action-btn"
          onClick={() => setShowMoveMenu(!showMoveMenu)}
          title="Move page"
          aria-label="Move page"
        >
          {Icons.arrow}
        </button>
        <button
          className="page-action-btn delete"
          onClick={handleDelete}
          title="Delete page"
          aria-label="Delete page"
        >
          {Icons.delete}
        </button>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Page"
          message={`Are you sure you want to delete "${page.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}

