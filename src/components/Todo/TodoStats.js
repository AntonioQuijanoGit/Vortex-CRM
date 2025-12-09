export default function TodoStats({ totalTodos, completedCount, habitsCount, activeStreaks }) {
  if (totalTodos === 0) return null;

  return (
    <footer className="todoFooter">
      <div className="todoStats">
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
    </footer>
  );
}

