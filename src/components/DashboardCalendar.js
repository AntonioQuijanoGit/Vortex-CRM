import React, { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import { Icons } from "../utils/icons";
import "./DashboardCalendar.css";

export default function DashboardCalendar({ todos, onNavigate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const today = new Date();

  // Use events hook for dashboard calendar (stored under "dashboard" key)
  const { events, addEvent, updateEvent, getEventsForDate } =
    useEvents("dashboard");

  // Get all events from all pages for display
  const getAllEvents = () => {
    let allEvents = [...events]; // Include dashboard events
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("events-") && key !== "events-dashboard") {
        const pageEvents = JSON.parse(localStorage.getItem(key) || "[]");
        allEvents = [...allEvents, ...pageEvents];
      }
    }
    return allEvents;
  };

  const allEvents = getAllEvents();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getDayInfo = (day) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const dateObj = new Date(year, month, day);
    const dateKey = dateObj.toDateString();

    // Get tasks for this day
    const dayTasks = todos.filter((todo) => {
      if (todo.type === "task") {
        if (todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          return dueDate.toDateString() === dateKey;
        }
        const createdDate = new Date(todo.createdAt);
        return createdDate.toDateString() === dateKey;
      }
      return false;
    });

    // Get incomplete tasks
    const pendingTasks = dayTasks.filter((t) => !t.completed);

    // Get habits completed this day
    const habitsCompleted = todos.filter(
      (todo) => todo.type === "habit" && todo.completedDates?.includes(dateKey)
    ).length;

    // Get events for this day (from dashboard and all pages)
    const dayEvents = allEvents.filter((event) => event.date === dateString);

    return {
      pendingTasks: pendingTasks.length,
      totalTasks: dayTasks.length,
      habitsCompleted,
      events: dayEvents.length,
      hasActivity:
        pendingTasks.length > 0 || habitsCompleted > 0 || dayEvents.length > 0,
    };
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Get today's info
  const todayInfo = getDayInfo(today.getDate());

  const handleDayClick = (day) => {
    if (day === null) return;
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    setSelectedDate(dateString);
    setShowEventForm(true);
    setEditingEvent(null);
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

  return (
    <div className="dashboard-calendar">
      <div className="dashboard-calendar-header">
        <div className="calendar-header-top">
          <h2 className="dashboard-calendar-title">
            {Icons.calendar} Calendar
          </h2>
          <div className="calendar-nav">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="calendar-nav-btn"
              aria-label="Previous month"
            >
              {Icons.arrowLeft}
            </button>
            <span className="calendar-month-year">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="calendar-nav-btn"
              aria-label="Next month"
            >
              {Icons.arrowRight}
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="calendar-today-btn"
            >
              Today
            </button>
          </div>
        </div>
        <div className="dashboard-today-info">
          <div className="today-date">
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="today-stats">
            {todayInfo.pendingTasks > 0 && (
              <span className="today-stat pending">
                {todayInfo.pendingTasks} pending
              </span>
            )}
            {todayInfo.habitsCompleted > 0 && (
              <span className="today-stat habits">
                {todayInfo.habitsCompleted} habits
              </span>
            )}
            {todayInfo.events > 0 && (
              <span className="today-stat events">
                {todayInfo.events} events
              </span>
            )}
            {todayInfo.pendingTasks === 0 &&
              todayInfo.habitsCompleted === 0 &&
              todayInfo.events === 0 && (
                <span className="today-stat empty">All clear!</span>
              )}
          </div>
        </div>
      </div>

      <div className="dashboard-calendar-grid">
        {dayNames.map((day) => (
          <div key={day} className="dashboard-cal-day-header">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          if (day === null) {
            return (
              <div key={`empty-${index}`} className="dashboard-cal-day-empty" />
            );
          }

          const dayInfo = getDayInfo(day);
          const isTodayDay = isToday(day);

          const dateString = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          const allDayEvents = allEvents.filter(
            (event) => event.date === dateString
          );

          return (
            <div
              key={day}
              className={`dashboard-cal-day ${isTodayDay ? "today" : ""} ${
                dayInfo.hasActivity ? "has-activity" : ""
              }`}
              onClick={() => handleDayClick(day)}
            >
              <span className="dashboard-cal-day-number">{day}</span>
              <div className="dashboard-cal-day-indicators">
                {dayInfo.pendingTasks > 0 && (
                  <span
                    className="dashboard-cal-indicator pending"
                    title={`${dayInfo.pendingTasks} pending tasks`}
                  >
                    {dayInfo.pendingTasks}
                  </span>
                )}
                {dayInfo.habitsCompleted > 0 && (
                  <span
                    className="dashboard-cal-indicator habits"
                    title={`${dayInfo.habitsCompleted} habits completed`}
                  >
                    {Icons.check}
                  </span>
                )}
                {allDayEvents.length > 0 && (
                  <span
                    className="dashboard-cal-indicator events"
                    title={`${allDayEvents.length} events`}
                  >
                    {allDayEvents.length}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(() => {
        const todayDateString = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(today.getDate()).padStart(2, "0")}`;
        const todayEvents = getEventsForDate(todayDateString);
        const hasContent = todayInfo.pendingTasks > 0 || todayEvents.length > 0;

        if (!hasContent) return null;

        return (
          <div className="dashboard-pending-tasks">
            {todayInfo.pendingTasks > 0 && (
              <>
                <h4>Pending Tasks Today</h4>
                <div className="pending-tasks-list">
                  {todos
                    .filter((todo) => {
                      if (todo.type === "task" && !todo.completed) {
                        const date = todo.dueDate
                          ? new Date(todo.dueDate)
                          : new Date(todo.createdAt);
                        return date.toDateString() === today.toDateString();
                      }
                      return false;
                    })
                    .slice(0, 5)
                    .map((todo) => (
                      <div key={todo.id} className="pending-task-item">
                        <span className="pending-task-icon">{Icons.task}</span>
                        <span className="pending-task-title">{todo.title}</span>
                      </div>
                    ))}
                </div>
              </>
            )}
            {todayEvents.length > 0 && (
              <>
                <h4>Events Today</h4>
                <div className="pending-tasks-list">
                  {todayEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="pending-task-item"
                      onClick={() => {
                        setEditingEvent(event);
                        setSelectedDate(event.date);
                        setShowEventForm(true);
                      }}
                    >
                      <span
                        className="pending-task-icon"
                        style={{ color: event.color }}
                      >
                        {Icons.calendar}
                      </span>
                      <span className="pending-task-title">
                        {event.title}
                        {event.time && ` - ${event.time}`}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })()}

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
            {Icons.close}
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
