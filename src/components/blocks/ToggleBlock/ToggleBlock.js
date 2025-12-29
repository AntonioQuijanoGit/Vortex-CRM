import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import "../Block.css";
import "./ToggleBlock.css";

/**
 * Toggle Block - Collapsible content
 */
export default function ToggleBlock({ data, onUpdate }) {
  const [isOpen, setIsOpen] = useState(data?.isOpen ?? false);
  const [title, setTitle] = useState(data?.title || "Toggle");
  const [content, setContent] = useState(data?.content || "");

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onUpdate({ ...data, isOpen: newState });
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdate({ ...data, title: newTitle });
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate({ ...data, content: newContent });
  };

  return (
    <div className="block toggle-block">
      <div className="toggle-header" onClick={handleToggle}>
        <button className="toggle-icon" aria-label={isOpen ? "Collapse" : "Expand"}>
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        <input
          className="toggle-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          onClick={(e) => e.stopPropagation()}
          placeholder="Toggle title"
        />
      </div>
      {isOpen && (
        <div className="toggle-content">
          <textarea
            className="toggle-textarea"
            value={content}
            onChange={handleContentChange}
            placeholder="Add content..."
            rows={4}
          />
        </div>
      )}
    </div>
  );
}

