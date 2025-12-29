import React, { useEffect } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import "./Toast.css";

export default function Toast({ message, type = "info", onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: Icons.check,
    error: Icons.close,
    warning: Icons.warning,
    info: Icons.stats,
  };

  return (
    <div
      className={`toast toast-${type}`}
      role="alert"
      aria-live="polite"
      onClick={onClose}
    >
      <span className="toast-icon">{renderIcon(icons[type], 18)}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close notification"
      >
        {renderIcon(Icons.close, 16)}
      </button>
    </div>
  );
}











