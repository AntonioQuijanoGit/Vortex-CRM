/**
 * Utility functions for filtering todos
 */

/**
 * Filter todos by type (task, habit, or all)
 * @param {Array} todos - List of todos
 * @param {string} typeFilter - Filter type: 'all', 'task', or 'habit'
 * @returns {Array} Filtered todos
 */
export function filterByType(todos, typeFilter) {
  if (typeFilter === "all") return todos;
  return todos.filter((todo) => todo.type === typeFilter);
}

/**
 * Filter todos by date range
 * @param {Array} todos - List of todos
 * @param {string} filter - Filter type: 'all', 'today', or 'week'
 * @returns {Array} Filtered todos
 */
export function filterByDate(todos, filter) {
  if (filter === "all") return todos;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return todos.filter((todo) => {
    const todoDate = new Date(todo.createdAt);
    if (filter === "today") {
      return todoDate >= today;
    }
    if (filter === "week") {
      return todoDate >= weekAgo;
    }
    return true;
  });
}

/**
 * Filter todos by search query
 * @param {Array} todos - List of todos
 * @param {string} searchQuery - Search query string
 * @returns {Array} Filtered todos
 */
export function filterBySearch(todos, searchQuery) {
  if (!searchQuery.trim()) return todos;
  const query = searchQuery.toLowerCase();
  return todos.filter((todo) => todo.title.toLowerCase().includes(query));
}

/**
 * Apply all filters to todos
 * @param {Array} todos - List of todos
 * @param {Object} filters - Filter options
 * @param {string} filters.typeFilter - Type filter: 'all', 'task', or 'habit'
 * @param {string} filters.dateFilter - Date filter: 'all', 'today', or 'week'
 * @param {string} filters.searchQuery - Search query string
 * @returns {Array} Filtered todos
 */
export function applyFilters(todos, { typeFilter, dateFilter, searchQuery }) {
  let filtered = todos;
  filtered = filterByType(filtered, typeFilter);
  filtered = filterByDate(filtered, dateFilter);
  filtered = filterBySearch(filtered, searchQuery);
  return filtered;
}






