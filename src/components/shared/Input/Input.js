import React from "react";
import "./Input.css";

/**
 * Input component - Base input field
 */
export default function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  label,
  error,
  helperText,
  icon,
  iconPosition = "left",
  size = "md", // sm, md, lg
  disabled = false,
  className = "",
  ...props
}) {
  const classes = [
    "input-wrapper",
    error && "input-error",
    disabled && "input-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [
    "input",
    `input-${size}`,
    icon && `input-with-icon`,
    icon && `input-icon-${iconPosition}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {icon && iconPosition === "left" && (
          <span className="input-icon-left">{icon}</span>
        )}
        <input
          type={type}
          className={inputClasses}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <span className="input-icon-right">{icon}</span>
        )}
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && (
        <span className="input-helper-text">{helperText}</span>
      )}
    </div>
  );
}

