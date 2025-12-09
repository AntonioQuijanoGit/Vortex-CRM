import { useState } from "react";

export default function Calendar({ todos }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Obtener primer día del mes y número de días
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Day and month names
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

  // Get activity summary for a day
  function getDayActivity(day) {
    const date = new Date(year, month, day);
    const dateString = date.toDateString();
    
    const habitsCompleted = todos.filter(
      (todo) => todo.type === "habit" && todo.completedDates?.includes(dateString)
    ).length;
    
    const tasksCreated = todos.filter((todo) => {
      if (todo.type === "task") {
        const todoDate = new Date(todo.createdAt);
        return todoDate.toDateString() === dateString;
      }
      return false;
    }).length;
    
    const tasksCompleted = todos.filter((todo) => {
      if (todo.type === "task" && todo.completed) {
        const todoDate = new Date(todo.createdAt);
        return todoDate.toDateString() === dateString;
      }
      return false;
    }).length;
    
    return {
      habitsCompleted,
      tasksCreated,
      tasksCompleted,
      total: habitsCompleted + tasksCreated,
    };
  }

  // Verificar si es hoy
  function isToday(day) {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }

  // Navegar meses
  function goToPreviousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function goToNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  // Crear array de días
  const days = [];
  
  // Días vacíos al inicio
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Calculate monthly stats
  const monthlyHabits = todos.filter((t) => t.type === "habit").reduce((sum, h) => {
    const completedThisMonth = (h.completedDates || []).filter((date) => {
      const dateObj = new Date(date);
      return dateObj.getMonth() === month && dateObj.getFullYear() === year;
    }).length;
    return sum + completedThisMonth;
  }, 0);

  const monthlyTasks = todos.filter((t) => {
    if (t.type === "task") {
      const created = new Date(t.createdAt);
      return created.getMonth() === month && created.getFullYear() === year;
    }
    return false;
  }).length;

  return (
    <div className="calendar" role="region" aria-label="Activity calendar">
      <div className="calendarHeader">
        <button
          className="calendarNavButton"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          <span className="buttonText">‹</span>
        </button>
        <div className="calendarTitle">
          <div>
            <h3 className="calendarMonthYear">
              {monthNames[month]} {year}
            </h3>
            <p className="calendarStats">
              {monthlyHabits} habits • {monthlyTasks} tasks
            </p>
          </div>
          <button
            className="calendarTodayButton"
            onClick={goToToday}
            aria-label="Go to today"
          >
            <span className="buttonText">Today</span>
          </button>
        </div>
        <button
          className="calendarNavButton"
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          <span className="buttonText">›</span>
        </button>
      </div>
      
      <div className="calendarLegend">
        <div className="legendItem">
          <span className="legendDot habit"></span>
          <span className="legendText">Habits completed</span>
        </div>
        <div className="legendItem">
          <span className="legendNumber">1</span>
          <span className="legendText">Tasks created</span>
        </div>
      </div>

      <div className="calendarGrid">
        {/* Días de la semana */}
        {dayNames.map((day) => (
          <div key={day} className="calendarDayName">
            {day}
          </div>
        ))}

        {/* Días del mes */}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendarDayEmpty" />;
          }

          const activity = getDayActivity(day);
          const today = isToday(day);
          const hasActivity = activity.total > 0;

          return (
            <div
              key={day}
              className={`calendarDay ${today ? "today" : ""} ${
                hasActivity ? "hasActivity" : ""
              } ${activity.habitsCompleted > 0 ? "hasHabits" : ""}`}
              aria-label={`${day} of ${monthNames[month]}, ${activity.habitsCompleted} ${
                activity.habitsCompleted === 1 ? "habit" : "habits"
              } completed, ${activity.tasksCreated} ${
                activity.tasksCreated === 1 ? "task" : "tasks"
              } created`}
              title={`${activity.habitsCompleted} habits, ${activity.tasksCreated} tasks`}
            >
              <span className="calendarDayNumber">{day}</span>
              {hasActivity && (
                <div className="calendarIndicators">
                  {activity.habitsCompleted > 0 && (
                    <span className="calendarHabitDot" aria-hidden="true" title={`${activity.habitsCompleted} habits completed`} />
                  )}
                  {activity.tasksCreated > 0 && (
                    <span className="calendarTaskCount" aria-hidden="true">
                      {activity.tasksCreated}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

