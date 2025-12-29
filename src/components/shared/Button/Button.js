import React from "react";
import "./Button.css";

/**
 * Button component - Base button with variants
 */
export default function Button({
  children,
  variant = "primary", // primary, secondary, ghost, danger
  size = "md", // sm, md, lg
  onClick,
  disabled = false,
  type = "button",
  icon,
  iconPosition = "left", // left, right
  className = "",
  ...props
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    icon && `btn-with-icon`,
    icon && `btn-icon-${iconPosition}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="btn-icon">{icon}</span>}
      {children && <span className="btn-text">{children}</span>}
      {icon && iconPosition === "right" && <span className="btn-icon">{icon}</span>}
    </button>
  );
}

