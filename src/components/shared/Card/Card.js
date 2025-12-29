import React from "react";
import "./Card.css";

/**
 * Card component - Base card container
 */
export default function Card({
  children,
  variant = "default", // default, elevated, outlined, flat
  padding = "md", // none, sm, md, lg
  className = "",
  onClick,
  ...props
}) {
  const classes = [
    "card",
    `card-${variant}`,
    `card-padding-${padding}`,
    onClick && "card-clickable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
}

