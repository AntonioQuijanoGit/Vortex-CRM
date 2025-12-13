import React, { useState } from "react";
import { useEvents } from "../../hooks/useEvents";
import { usePages } from "../../hooks/usePages";
import { Icons } from "../../utils/icons";
import { DateDetailsModal, EventForm } from "../shared";
import "./DashboardCalendar.css";

export default function DashboardCalendar({ todos, onNavigate }) {
  const { getPage } = usePages();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [clickedDate, setClickedDate] = useState(null); // Track which day was clicked
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDateDetails, setShowDateDetails] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const today = new Date();

  // Use events hook for dashboard calendar (stored under "dashboard" key)
  const { events, addEvent, updateEvent, deleteEvent, getEventsForDate } =
    useEvents("dashboard");

  // Get all events from all pages for display
  const getAllEvents = () => {
    let allEvents = [...events]; // Include dashboard events
    
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined' && localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("events-") && key !== "events-dashboard") {
          try {
            const pageEvents = JSON.parse(localStorage.getItem(key) || "[]");
            allEvents = [...allEvents, ...pageEvents];
          } catch (error) {
            // Skip invalid JSON
          }
        }
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

  const getDateItems = (dateString) => {
    const dateObj = new Date(dateString);
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

    // Get habits completed this day
    const habitsCompleted = todos.filter(
      (todo) => todo.type === "habit" && todo.completedDates?.includes(dateKey)
    );

    // Get events for this day
    const dayEvents = allEvents.filter((event) => event.date === dateString);

    return {
      tasks: dayTasks,
      habits: habitsCompleted,
      events: dayEvents,
      hasItems: dayTasks.length > 0 || habitsCompleted.length > 0 || dayEvents.length > 0,
    };
  };

  const handleDayClick = (day) => {
    if (day === null) return;
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    setSelectedDate(dateString);
    setClickedDate(dateString); // Track clicked date for visual feedback
    
    const dateItems = getDateItems(dateString);
    
    // If there are items, show details modal. Otherwise, show event form
    if (dateItems.hasItems) {
      setShowDateDetails(true);
      setShowEventForm(false);
    } else {
      setShowDateDetails(false);
      setShowEventForm(true);
      setEditingEvent(null);
    }
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

  const handleDeleteEvent = (eventId) => {
    // First try to delete from dashboard events
    const dashboardEvent = events.find(e => e.id === eventId);
    if (dashboardEvent) {
      deleteEvent(eventId);
      return;
    }
    
    // Only access localStorage in browser environment
    if (typeof window === 'undefined' || !localStorage) return;
    
    // If not found in dashboard, search in other pages
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("events-") && key !== "events-dashboard") {
        try {
          const pageEvents = JSON.parse(localStorage.getItem(key) || "[]");
          const eventIndex = pageEvents.findIndex(e => e.id === eventId);
          if (eventIndex !== -1) {
            // Remove the event from this page's events
            const updatedEvents = pageEvents.filter(e => e.id !== eventId);
            localStorage.setItem(key, JSON.stringify(updatedEvents));
            // Force re-render by updating state
            setSelectedDate(selectedDate);
            return;
          }
        } catch (error) {
          // Skip invalid JSON
        }
      }
    }
  };

  return (
    <div className="dashboard-calendar">
      <div className="dashboard-calendar-header">
        <div className="calendar-header-top">
          <h2 className="dashboard-calendar-title">
            Calendar
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
          const isSelected = clickedDate === dateString;

          return (
            <div
              key={day}
              className={`dashboard-cal-day ${isTodayDay ? "today" : ""} ${
                dayInfo.hasActivity ? "has-activity" : ""
              } ${isSelected ? "selected" : ""}`}
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

      {showDateDetails && selectedDate && (
        <DateDetailsModal
          date={selectedDate}
          items={getDateItems(selectedDate)}
          onNavigate={onNavigate}
          onClose={() => {
            setShowDateDetails(false);
            setSelectedDate(null);
            setClickedDate(null); // Clear visual selection
          }}
          onAddEvent={() => {
            setShowDateDetails(false);
            setShowEventForm(true);
            setEditingEvent(null);
          }}
          onEditEvent={(event) => {
            setShowDateDetails(false);
            setEditingEvent(event);
            setShowEventForm(true);
          }}
          onDeleteEvent={handleDeleteEvent}
          getPage={getPage}
        />
      )}

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

