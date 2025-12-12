export default function TodoFilters({ 
  filter, 
  onFilterChange, 
  typeFilter,
  onTypeFilterChange
}) {
  return (
    <div className="todoFilters" role="group" aria-label="Task filters">
      <div className="filterGroup">
        <span className="filterGroupLabel">Type:</span>
        <button
          className={`filterButton ${typeFilter === "all" ? "active" : ""}`}
          onClick={() => onTypeFilterChange("all")}
          aria-label="Show all items"
          title="Show all tasks and habits"
        >
          <span className="buttonText">All</span>
        </button>
        <button
          className={`filterButton ${typeFilter === "task" ? "active" : ""}`}
          onClick={() => onTypeFilterChange("task")}
          aria-label="Show tasks only"
          title="Show only one-time tasks"
        >
          <span className="buttonText">Tasks</span>
        </button>
        <button
          className={`filterButton ${typeFilter === "habit" ? "active" : ""}`}
          onClick={() => onTypeFilterChange("habit")}
          aria-label="Show habits only"
          title="Show only daily habits with streaks"
        >
          <span className="buttonText">Habits</span>
        </button>
      </div>
      
      <div className="filterGroup">
        <span className="filterGroupLabel">Time:</span>
        <button
          className={`filterButton ${filter === "all" ? "active" : ""}`}
          onClick={() => onFilterChange("all")}
          aria-label="Show all items"
          title="Show all items regardless of date"
        >
          <span className="buttonText">All</span>
        </button>
        <button
          className={`filterButton ${filter === "today" ? "active" : ""}`}
          onClick={() => onFilterChange("today")}
          aria-label="Show today's items"
          title="Show only items created or due today"
        >
          <span className="buttonText">Today</span>
        </button>
        <button
          className={`filterButton ${filter === "week" ? "active" : ""}`}
          onClick={() => onFilterChange("week")}
          aria-label="Show this week's items"
          title="Show items from this week"
        >
          <span className="buttonText">Week</span>
        </button>
      </div>
    </div>
  );
}

