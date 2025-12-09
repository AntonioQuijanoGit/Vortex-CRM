export default function ProductivityDashboard({ todos, habits }) {
  // Calcular métricas
  const totalTasks = todos.filter((t) => t.type === "task").length;
  const completedTasks = todos.filter((t) => t.type === "task" && t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalHabits = habits.length;
  const completedHabitsToday = habits.filter((h) => h.completed).length;
  const habitCompletionRate = totalHabits > 0 ? Math.round((completedHabitsToday / totalHabits) * 100) : 0;

  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak || 0), 0);

  // Calcular productividad de la semana
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekTasks = todos.filter((t) => {
    if (t.type === "task") {
      const created = new Date(t.createdAt);
      return created >= weekStart && t.completed;
    }
    return false;
  }).length;

  const weekHabits = habits.reduce((sum, h) => {
    const completedThisWeek = (h.completedDates || []).filter((date) => {
      const dateObj = new Date(date);
      return dateObj >= weekStart;
    }).length;
    return sum + completedThisWeek;
  }, 0);

  if (todos.length === 0) return null;

  return (
    <div className="productivityDashboard" role="region" aria-label="Productivity Dashboard">
      <div className="dashboardHeader">
        <h2 className="dashboardTitle">Your Progress</h2>
        <p className="dashboardSubtitle">Track your daily productivity and habit consistency</p>
      </div>
      
      <div className="dashboardGrid">
        <div className="dashboardCard">
          <div className="dashboardCardHeader">
            <span className="dashboardCardLabel">Tasks Completed</span>
            <span className="dashboardCardValue">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div className="dashboardProgressBar">
            <div
              className="dashboardProgressFill"
              style={{ width: `${taskCompletionRate}%` }}
              aria-label={`${taskCompletionRate}% tasks completed`}
            />
          </div>
          <span className="dashboardCardPercentage">{taskCompletionRate}% complete</span>
          <div className="dashboardCardSubtext">
            One-time tasks you've finished
          </div>
        </div>

        <div className="dashboardCard">
          <div className="dashboardCardHeader">
            <span className="dashboardCardLabel">Habits Today</span>
            <span className="dashboardCardValue">
              {completedHabitsToday}/{totalHabits}
            </span>
          </div>
          <div className="dashboardProgressBar">
            <div
              className="dashboardProgressFill habit"
              style={{ width: `${habitCompletionRate}%` }}
              aria-label={`${habitCompletionRate}% habits completed today`}
            />
          </div>
          <span className="dashboardCardPercentage">{habitCompletionRate}% complete</span>
          <div className="dashboardCardSubtext">
            Daily habits completed today (reset tomorrow)
          </div>
        </div>

        <div className="dashboardCard">
          <div className="dashboardCardHeader">
            <span className="dashboardCardLabel">Total Streak Days</span>
            <span className="dashboardCardValue">{totalStreak}</span>
          </div>
          <div className="dashboardCardSubtext">
            Sum of all active habit streaks
            {longestStreak > 0 && ` • Best: ${longestStreak} days`}
          </div>
        </div>

        <div className="dashboardCard">
          <div className="dashboardCardHeader">
            <span className="dashboardCardLabel">This Week</span>
            <span className="dashboardCardValue">
              {weekTasks + weekHabits}
            </span>
          </div>
          <div className="dashboardCardSubtext">
            {weekTasks} tasks completed + {weekHabits} habit completions
          </div>
        </div>
      </div>
    </div>
  );
}

