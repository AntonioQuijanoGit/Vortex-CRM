import React, { useState, useRef, useEffect } from "react";
import "./Tooltip.css";

export default function Tooltip({ 
  children, 
  content, 
  position = "top",
  delay = 300,
  disabled = false 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Adjust position if tooltip would go off-screen
      if (tooltipRef.current && triggerRef.current) {
        const tooltip = tooltipRef.current;
        const trigger = triggerRef.current;
        const rect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let newPosition = position;
        
        // Check if tooltip goes off screen
        if (position === "top" && rect.top - tooltipRect.height < 0) {
          newPosition = "bottom";
        } else if (position === "bottom" && rect.bottom + tooltipRect.height > window.innerHeight) {
          newPosition = "top";
        } else if (position === "left" && rect.left - tooltipRect.width < 0) {
          newPosition = "right";
        } else if (position === "right" && rect.right + tooltipRect.width > window.innerWidth) {
          newPosition = "left";
        }
        
        setActualPosition(newPosition);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  if (!content || disabled) {
    return children;
  }

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef}
    >
      {children}
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`tooltip tooltip-${actualPosition}`}
          role="tooltip"
        >
          <div className="tooltip-content">{content}</div>
          <div className={`tooltip-arrow tooltip-arrow-${actualPosition}`}></div>
        </div>
      )}
    </div>
  );
}




