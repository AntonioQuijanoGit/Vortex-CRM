import React, { useState, useEffect } from "react";
import { safeGetItem, safeSetItem } from "../../utils/storage";
import "./NoteEditor.css";

export default function NoteEditor({ pageId, initialContent = "" }) {
  const [content, setContent] = useState(() => {
    if (typeof window === 'undefined') return initialContent;
    const saved = safeGetItem(`note-${pageId}`, null);
    return saved || initialContent;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    safeSetItem(`note-${pageId}`, content);
  }, [content, pageId]);

  return (
    <div className="note-editor">
      <div className="note-toolbar">
        <button className="toolbar-btn" title="Bold">B</button>
        <button className="toolbar-btn" title="Italic">I</button>
        <button className="toolbar-btn" title="List">•</button>
        <button className="toolbar-btn" title="Link">🔗</button>
      </div>
      <textarea
        className="note-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your notes here..."
      />
      <div className="note-stats">
        <span>{content.length} characters</span>
        <span>{content.split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
}

