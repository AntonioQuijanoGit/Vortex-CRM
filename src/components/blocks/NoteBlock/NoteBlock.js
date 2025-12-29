import React, { useState, useEffect } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import { safeGetItem, safeSetItem } from "../../../utils/storage";
import "../Block.css";

export default function NoteBlock({ pageId, data, onUpdate }) {
  const [content, setContent] = useState(data?.content || "");
  const blockPageId = pageId ? `${pageId}-notes` : "notes";

  useEffect(() => {
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') return;
    
    // Load from localStorage if available
    const saved = safeGetItem(`note-${blockPageId}`, null);
    if (saved && !data?.content) {
      setContent(saved);
      onUpdate({ content: saved });
    }
  }, [blockPageId, data?.content, onUpdate]);

  useEffect(() => {
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') return;
    
    // Save to localStorage
    if (content) {
      safeSetItem(`note-${blockPageId}`, content);
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
        <span className="block-icon">{renderIcon(Icons.note, 18)}</span>
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

