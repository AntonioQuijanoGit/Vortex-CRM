import React from "react";
import { Bold, Italic, Code, Link, List, ListOrdered } from "lucide-react";
import "./FormattingToolbar.css";

export function FormattingToolbar({ position, onFormat, onClose }) {
  const handleFormat = (command, value = null) => {
    onFormat(command, value);
  };

  return (
    <div
      className="formatting-toolbar"
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
      }}
    >
      <button
        className="toolbar-btn"
        onClick={() => handleFormat("bold")}
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </button>
      <button
        className="toolbar-btn"
        onClick={() => handleFormat("italic")}
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </button>
      <button
        className="toolbar-btn"
        onClick={() => handleFormat("underline")}
        title="Underline"
      >
        <u>U</u>
      </button>
      <div className="toolbar-divider" />
      <button
        className="toolbar-btn"
        onClick={() => handleFormat("insertUnorderedList")}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        className="toolbar-btn"
        onClick={() => handleFormat("insertOrderedList")}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>
      <div className="toolbar-divider" />
      <button
        className="toolbar-btn"
        onClick={() => handleFormat("createLink", "#")}
        title="Link (Ctrl+K)"
      >
        <Link size={16} />
      </button>
      <button
        className="toolbar-btn"
        onClick={() => handleFormat("formatCode")}
        title="Code"
      >
        <Code size={16} />
      </button>
    </div>
  );
}

