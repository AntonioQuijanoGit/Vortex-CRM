import React, { useState } from "react";
import { useEvents } from "../../hooks/useEvents";
import { Icons } from "../../utils/icons";
import "./Block.css";
import "./CalendarBlock.css";

export default function CalendarBlock({ pageId, data, onUpdate }) {
  const { events, addEvent, updateEvent, deleteEvent, getEventsForDate } = useEvents(pageId);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const handleDayClick = (day) => {
    if (day === null) return;
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateString);
    setShowEventForm(true);
    setEditingEvent(null);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent({ ...eventData, date: selectedDate });
    }
    setShowEventForm(false);
    setEditingEvent(null);
    setSelectedDate(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="block calendar-block">
      <div className="block-header">
        <span className="block-icon">{Icons.calendar}</span>
        <h3 className="block-title">Calendar</h3>
      </div>

      <div className="calendar-block-content">
        <div className="calendar-nav">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="calendar-nav-btn">
            ‹
          </button>
          <h4 className="calendar-month-year">
            {monthNames[month]} {year}
          </h4>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="calendar-nav-btn">
            ›
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="calendar-today-btn">
            Today
          </button>
        </div>

        <div className="calendar-grid">
          {dayNames.map((day) => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="calendar-day-empty" />;
            }
            const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = getEventsForDate(dateString);
            const today = isToday(day);

            return (
              <div
                key={day}
                className={`calendar-day ${today ? "today" : ""} ${dayEvents.length > 0 ? "has-events" : ""}`}
                onClick={() => handleDayClick(day)}
              >
                <span className="calendar-day-number">{day}</span>
                {dayEvents.length > 0 && (
                  <div className="calendar-day-events">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="calendar-event-dot"
                        style={{ backgroundColor: event.color }}
                        onClick={(e) => handleEventClick(event, e)}
                        title={event.title}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="calendar-event-more">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className="calendar-selected-date">
            <h5>{formatDate(selectedDate)}</h5>
            <div className="calendar-date-events">
              {getEventsForDate(selectedDate).map((event) => (
                <div key={event.id} className="calendar-event-item">
                  <div className="event-color" style={{ backgroundColor: event.color }} />
                  <div className="event-content">
                    <div className="event-title">{event.title}</div>
                    {event.time && <div className="event-time">{event.time}</div>}
                    {event.description && <div className="event-description">{event.description}</div>}
                  </div>
                  <button
                    className="event-edit-btn"
                    onClick={() => {
                      setEditingEvent(event);
                      setShowEventForm(true);
                    }}
                  >
                    {Icons.edit}
                  </button>
                  <button
                    className="event-delete-btn"
                    onClick={() => deleteEvent(event.id)}
                  >
                    {Icons.delete}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showEventForm && (
        <EventForm
          date={selectedDate}
          event={editingEvent}
          onSave={handleSaveEvent}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}

function EventForm({ date, event, onSave, onCancel }) {
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
          <button className="event-form-close" onClick={onCancel}>{Icons.close}</button>
        </div>
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
            <label>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
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
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

