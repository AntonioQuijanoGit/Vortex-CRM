import React from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import "./FirstTimeTooltip.css";

/**
 * Tooltip contextual que aparece la primera vez que el usuario hace algo
 */
export default function FirstTimeTooltip({
  message,
  position = "top",
  targetSelector = null,
  onDismiss,
  showClose = true,
  arrow = true
}) {
  const positionClasses = {
    top: "tooltip-top",
    bottom: "tooltip-bottom",
    left: "tooltip-left",
    right: "tooltip-right"
  };

  return (
    <div
      className={`first-time-tooltip ${positionClasses[position] || positionClasses.top}`}
      role="tooltip"
      aria-live="polite"
    >
      {arrow && <div className={`tooltip-arrow arrow-${position}`}></div>}
      <div className="tooltip-content-wrapper">
        <div className="tooltip-icon">
          {renderIcon(Icons.help, 16)}
        </div>
        <p className="tooltip-message">{message}</p>
        {showClose && (
          <button
            className="tooltip-close-btn"
            onClick={onDismiss}
            aria-label="Cerrar hint"
            title="No mostrar más"
          >
            {renderIcon(Icons.close, 14)}
          </button>
        )}
      </div>
    </div>
  );
}

