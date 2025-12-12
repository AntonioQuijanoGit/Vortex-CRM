import React, { useState, useEffect, useRef } from "react";
import "../Block.css";

export default function TextBlock({ data, onUpdate }) {
  const [content, setContent] = useState(data?.content || "");
  const [isEditing, setIsEditing] = useState(!content);
  const saveTimeoutRef = useRef(null);

  // Auto-save when content changes (debounced)
  useEffect(() => {
    if (content !== (data?.content || "")) {
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Save after 500ms of no typing
      saveTimeoutRef.current = setTimeout(() => {
        onUpdate({ content });
      }, 500);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, data?.content, onUpdate]);

  const handleSave = () => {
    onUpdate({ content });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setContent(data?.content || "");
    }
  };

  if (isEditing) {
    return (
      <div className="block text-block">
        <textarea
          className="block-textarea"
          value={content}
          onChange={handleChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder="Start writing..."
          autoFocus
        />
        <div className="block-hint">
          Auto-saves as you type • Press Ctrl+Enter to finish, Esc to cancel
        </div>
      </div>
    );
  }

  return (
    <div className="block text-block" onClick={() => setIsEditing(true)}>
      <div className="block-content">
        {content || <span className="block-placeholder">Click to add text...</span>}
      </div>
    </div>
  );
}

