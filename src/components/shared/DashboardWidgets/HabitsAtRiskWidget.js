import React, { useMemo } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import "./DashboardWidgets.css";

export default function HabitsAtRiskWidget({ habits }) {
  const atRiskHabits = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    return habits.filter((habit) => {
      if (habit.completed) return false; // Already completed today
      const wasCompletedYesterday = habit.completedDates?.includes(yesterdayStr);
      // At risk if streak > 0 and wasn't completed yesterday
      return (habit.streak || 0) > 0 && !wasCompletedYesterday;
    }).slice(0, 5);
  }, [habits]);

  if (atRiskHabits.length === 0) {
    return null;
  }

  return (
    <div className="dashboard-widget widget-warning">
      <div className="widget-header">
        <span className="widget-icon">{renderIcon(Icons.warning, 20)}</span>
        <h3 className="widget-title">Habits at Risk</h3>
      </div>
      <div className="widget-content">
        <p className="widget-description">
          These habits have active streaks that could be lost if you don't complete them today.
        </p>
        <div className="widget-habits-list">
          {atRiskHabits.map((habit) => (
            <div key={habit.id} className="widget-habit-item">
              <span className="widget-habit-icon">{renderIcon(Icons.habit, 16)}</span>
              <div className="widget-habit-info">
                <div className="widget-habit-title">{habit.title}</div>
                <div className="widget-habit-streak">
                  Streak: {habit.streak} days
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

