export default function TodoStats({ totalTodos, completedCount, habitsCount, activeStreaks }) {
  if (totalTodos === 0) return null;

  const completionPercentage = totalTodos > 0 ? Math.round((completedCount / totalTodos) * 100) : 0;

  return (
    <footer className="todoFooter">
      <div className="todoStats">
        {totalTodos > 0 && (
          <div className="progressBarContainer">
            <div className="progressBarLabel">
              <span>Progress</span>
              <span className="progressBarPercentage">{completionPercentage}%</span>
            </div>
            <div className="progressBar">
              <div 
                className="progressBarFill" 
                style={{ width: `${completionPercentage}%` }}
                role="progressbar"
                aria-valuenow={completionPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`${completionPercentage}% of tasks completed`}
              />
            </div>
          </div>
        )}
        <div className="todoStatsGrid">
          <p className="todoCount" aria-live="polite">
            <span className="statNumber">{totalTodos}</span>{" "}
            {totalTodos === 1 ? "item" : "items"}
          </p>
          {completedCount > 0 && (
            <p className="todoCompleted" aria-live="polite">
              <span className="statNumber">{completedCount}</span>{" "}
              {completedCount === 1 ? "completed" : "completed"}
            </p>
          )}
          {habitsCount > 0 && (
            <p className="habitsCount" aria-live="polite">
              <span className="statNumber">{habitsCount}</span>{" "}
              {habitsCount === 1 ? "habit" : "habits"}
            </p>
          )}
          {activeStreaks > 0 && (
            <p className="activeStreaks" aria-live="polite">
              <span className="statNumber">{activeStreaks}</span>{" "}
              {activeStreaks === 1 ? "active streak" : "active streaks"}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

