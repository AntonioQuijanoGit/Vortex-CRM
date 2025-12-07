import TodoSearch from "./TodoSearch";
import TodoFilters from "./TodoFilters";

export default function TodoControls({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  typeFilter,
  onTypeFilterChange,
}) {
  return (
    <div className="todoControls">
      <TodoSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <TodoFilters
        filter={filter}
        onFilterChange={onFilterChange}
        typeFilter={typeFilter}
        onTypeFilterChange={onTypeFilterChange}
      />
    </div>
  );
}

