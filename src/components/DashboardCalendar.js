import React, { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import "./DashboardCalendar.css";

export default function DashboardCalendar({ todos, onNavigate }) {
  const [currentDate] = useState(new Date());
  const today = new Date();
  
  // Get all events from all pages
  const getAllEvents = () => {
    let allEvents = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("events-")) {
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

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getDayInfo = (day) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
      (todo) =>
        todo.type === "habit" &&
        todo.completedDates?.includes(dateKey)
    ).length;

    // Get events for this day
    const dayEvents = allEvents.filter((event) => event.date === dateString);

    return {
      pendingTasks: pendingTasks.length,
      totalTasks: dayTasks.length,
      habitsCompleted,
      events: dayEvents.length,
      hasActivity: pendingTasks.length > 0 || habitsCompleted > 0 || dayEvents.length > 0,
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

  return (
    <div className="dashboard-calendar">
      <div className="dashboard-calendar-header">
        <h3 className="dashboard-calendar-title">Today</h3>
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
            {todayInfo.pendingTasks === 0 && todayInfo.habitsCompleted === 0 && todayInfo.events === 0 && (
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
            return <div key={`empty-${index}`} className="dashboard-cal-day-empty" />;
          }

          const dayInfo = getDayInfo(day);
          const today = isToday(day);

          return (
            <div
              key={day}
              className={`dashboard-cal-day ${today ? "today" : ""} ${
                dayInfo.hasActivity ? "has-activity" : ""
              }`}
            >
              <span className="dashboard-cal-day-number">{day}</span>
              <div className="dashboard-cal-day-indicators">
                {dayInfo.pendingTasks > 0 && (
                  <span className="dashboard-cal-indicator pending" title={`${dayInfo.pendingTasks} pending tasks`}>
                    {dayInfo.pendingTasks}
                  </span>
                )}
                {dayInfo.habitsCompleted > 0 && (
                  <span className="dashboard-cal-indicator habits" title={`${dayInfo.habitsCompleted} habits completed`}>
                    ✓
                  </span>
                )}
                {dayInfo.events > 0 && (
                  <span className="dashboard-cal-indicator events" title={`${dayInfo.events} events`}>
                    •
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {todayInfo.pendingTasks > 0 && (
        <div className="dashboard-pending-tasks">
          <h4>Pending Tasks Today</h4>
          <div className="pending-tasks-list">
            {todos
              .filter((todo) => {
                if (todo.type === "task" && !todo.completed) {
                  const date = todo.dueDate ? new Date(todo.dueDate) : new Date(todo.createdAt);
                  return date.toDateString() === today.toDateString();
                }
                return false;
              })
              .slice(0, 5)
              .map((todo) => (
                <div key={todo.id} className="pending-task-item">
                  <span className="pending-task-icon">✓</span>
                  <span className="pending-task-title">{todo.title}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

