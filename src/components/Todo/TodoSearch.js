export default function TodoSearch({ searchQuery, onSearchChange }) {
  return (
    <div className="searchContainer">
      <input
        type="text"
        className="searchInput"
        placeholder="Search your tasks and habits..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search tasks and habits"
      />
    </div>
  );
}

