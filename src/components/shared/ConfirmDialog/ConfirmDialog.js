import React from "react";
import { createPortal } from "react-dom";
import { Icons } from "../../../utils/icons";
import "./ConfirmDialog.css";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "danger", // 'danger', 'warning', 'info'
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <div className="confirm-dialog-header">
          <h3 id="confirm-dialog-title" className="confirm-dialog-title">
            {title}
          </h3>
          <button
            className="confirm-dialog-close"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            {Icons.close}
          </button>
        </div>
        <div id="confirm-dialog-message" className="confirm-dialog-message">
          {message}
        </div>
        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-button confirm-dialog-button-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`confirm-dialog-button confirm-dialog-button-confirm confirm-dialog-button-${type}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

