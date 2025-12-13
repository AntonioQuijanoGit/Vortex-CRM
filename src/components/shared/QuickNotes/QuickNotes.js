import React, { useState, useEffect } from "react";
import { Icons } from "../../../utils/icons";
import { safeGetItem, safeSetItem } from "../../../utils/storage";
import "./QuickNotes.css";

export default function QuickNotes() {
  const [notes, setNotes] = useState(() => {
    return safeGetItem("quick-notes", []);
  });
  
  const [isExpanded, setIsExpanded] = useState(() => {
    return safeGetItem("quick-notes-expanded", true);
  });

  useEffect(() => {
    safeSetItem("quick-notes", notes);
  }, [notes]);

  useEffect(() => {
    safeSetItem("quick-notes-expanded", isExpanded);
  }, [isExpanded]);

  const addNote = () => {
    const newNote = {
      id: crypto.randomUUID(),
      content: "",
      color: "yellow",
      position: { x: 50, y: 50 },
      createdAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id, updates) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...updates } : note))
    );
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const colors = [
    { name: "yellow", value: "#FFEB3B" },
    { name: "blue", value: "#2196F3" },
    { name: "green", value: "#4CAF50" },
    { name: "pink", value: "#E91E63" },
    { name: "purple", value: "#9C27B0" },
    { name: "orange", value: "#FF9800" },
  ];

  if (!isExpanded) {
    return (
      <div className="quick-notes-collapsed">
        <button
          className="quick-notes-toggle"
          onClick={() => setIsExpanded(true)}
          title="Show quick notes"
        >
          {Icons.note}
          {notes.length > 0 && (
            <span className="quick-notes-count">{notes.length}</span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="quick-notes-container">
      <div className="quick-notes-header">
        <div className="quick-notes-title">
          <span className="quick-notes-icon">{Icons.note}</span>
          <span>Quick Notes</span>
          {notes.length > 0 && (
            <span className="quick-notes-badge">{notes.length}</span>
          )}
        </div>
        <div className="quick-notes-actions">
          <button
            className="quick-notes-action"
            onClick={addNote}
            title="Add note"
          >
            {Icons.add}
          </button>
          <button
            className="quick-notes-action"
            onClick={() => setIsExpanded(false)}
            title="Minimize"
          >
            {Icons.minimize}
          </button>
        </div>
      </div>

      <div className="quick-notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            className="quick-note"
            style={{
              backgroundColor: colors.find((c) => c.name === note.color)?.value || colors[0].value,
            }}
          >
            <div className="quick-note-header">
              <div className="quick-note-color-picker">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    className={`quick-note-color-option ${
                      note.color === color.name ? "active" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => updateNote(note.id, { color: color.name })}
                    title={color.name}
                  />
                ))}
              </div>
              <button
                className="quick-note-delete"
                onClick={() => deleteNote(note.id)}
                title="Delete note"
              >
                {Icons.delete}
              </button>
            </div>
            <textarea
              className="quick-note-content"
              value={note.content}
              onChange={(e) => updateNote(note.id, { content: e.target.value })}
              placeholder="Write your note here..."
              autoFocus={note.content === ""}
            />
          </div>
        ))}

        {notes.length === 0 && (
          <div className="quick-notes-empty">
            <div className="quick-notes-empty-icon">{Icons.note}</div>
            <p>No notes yet</p>
            <button className="quick-notes-empty-button" onClick={addNote}>
              Create first note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

