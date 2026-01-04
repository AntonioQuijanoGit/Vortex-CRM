import React from "react";
import "./ActivityHeatmap.css";

export default function ActivityHeatmap({ data, days = 90, startDate, hideHeader = false }) {
  // Generate dates for the last N days
  const today = new Date();
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  // Count activity per day
  const activityMap = {};
  if (data && Array.isArray(data) && data.length > 0) {
    data.forEach((item) => {
      if (!item || (!item.date && !item.createdAt && !item.completedAt)) return;
      
      const dateStr = item.date || item.createdAt || item.completedAt;
      if (!dateStr) return;
      
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return; // Invalid date
        
        const dateKey = date.toISOString().split("T")[0];
        activityMap[dateKey] = (activityMap[dateKey] || 0) + 1;
      } catch (error) {
        console.warn("Invalid date in activity data:", dateStr, error);
      }
    });
  }

  // Get activity level for a date
  const getActivityLevel = (date) => {
    const dateKey = date.toISOString().split("T")[0];
    const count = activityMap[dateKey] || 0;
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  };

  // Group by weeks
  const weeks = [];
  let currentWeek = [];
  dates.forEach((date, index) => {
    if (index % 7 === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    currentWeek.push(date);
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className="activity-heatmap">
      {!hideHeader && (
        <div className="heatmap-header">
          <h3 className="heatmap-title">Activity Heatmap</h3>
          <div className="heatmap-legend">
            <span className="legend-label">Less</span>
            <div className="legend-squares">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`legend-square level-${level}`}
                  aria-label={`Activity level ${level}`}
                />
              ))}
            </div>
            <span className="legend-label">More</span>
          </div>
        </div>
      )}
      <div className="heatmap-grid">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="heatmap-week">
            {week.map((date, dayIndex) => {
              const level = getActivityLevel(date);
              const isToday = date.toDateString() === today.toDateString();
              const dateKey = date.toISOString().split("T")[0];
              const count = activityMap[dateKey] || 0;
              
              return (
                <div
                  key={dayIndex}
                  className={`heatmap-day level-${level} ${isToday ? "today" : ""}`}
                  title={`${date.toLocaleDateString()}: ${count} ${count === 1 ? "activity" : "activities"}`}
                  aria-label={`${date.toLocaleDateString()}: ${count} activities`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

















