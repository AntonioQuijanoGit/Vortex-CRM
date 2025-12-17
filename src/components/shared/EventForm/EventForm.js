import React, { useState } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import "./EventForm.css";

export default function EventForm({ date, event, onSave, onCancel }) {
  const [title, setTitle] = useState(event?.title || "");
  const [time, setTime] = useState(event?.time || "");
  const [description, setDescription] = useState(event?.description || "");
  const [color, setColor] = useState(event?.color || "var(--color-accent)");

  const colors = [
    "var(--color-accent)",
    "var(--color-success)",
    "var(--color-warning)",
    "var(--color-error)",
    "#000000",
    "#666666",
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title, time, description, color });
    }
  };

  return (
    <div className="event-form-overlay" onClick={onCancel}>
      <div className="event-form" onClick={(e) => e.stopPropagation()}>
        <div className="event-form-header">
          <h4>{event ? "Edit Event" : "New Event"}</h4>
          <button className="event-form-close" onClick={onCancel}>
            {renderIcon(Icons.close, 18)}
          </button>
        </div>
        {date && <p className="event-form-date">{formatDate(date)}</p>}
        <form onSubmit={handleSubmit}>
          <div className="event-form-field">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title..."
              required
              autoFocus
              maxLength={200}
            />
          </div>
          <div className="event-form-field">
            <label>Time (optional)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="event-form-field">
            <label>Description / Notes (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes or description..."
              rows={3}
              maxLength={2000}
            />
          </div>
          <div className="event-form-field">
            <label>Color</label>
            <div className="event-color-picker">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-option ${color === c ? "selected" : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <div className="event-form-actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

