import React, { useState, useEffect } from "react";
import { Icons } from "../../../utils/icons";
import "../Block.css";

export default function NoteBlock({ pageId, data, onUpdate }) {
  const [content, setContent] = useState(data?.content || "");
  const blockPageId = pageId ? `${pageId}-notes` : "notes";

  useEffect(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem(`note-${blockPageId}`);
    if (saved && !data?.content) {
      setContent(saved);
      onUpdate({ content: saved });
    }
  }, [blockPageId, data?.content, onUpdate]);

  useEffect(() => {
    // Save to localStorage
    if (content) {
      localStorage.setItem(`note-${blockPageId}`, content);
    }
  }, [content, blockPageId]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate({ content: newContent });
  };

  return (
    <div className="block note-block">
      <div className="block-header">
        <span className="block-icon">{Icons.note}</span>
        <h3 className="block-title">Notes</h3>
      </div>
      <div className="note-block-content">
        <textarea
          className="block-textarea"
          value={content}
          onChange={handleChange}
          placeholder="Start writing your notes here..."
        />
        <div className="note-stats">
          <span>{content.length} characters</span>
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>
    </div>
  );
}

