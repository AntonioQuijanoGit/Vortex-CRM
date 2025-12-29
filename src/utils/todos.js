import { safeGetItem } from "./storage";

/**
 * Get all todos from all pages with their page information
 * Centralized utility to avoid code duplication
 */
export function getAllTodosWithPages(getPage) {
  let allTodos = [];

  // Check for todos stored in the old format (without page association)
  const oldFormatTodos = safeGetItem("todos", []);
  oldFormatTodos.forEach((todo) => {
    allTodos.push({ ...todo, pageId: null, pageTitle: "Orphaned" });
  });

  // Get all todos from pages (keys like "todos-{pageId}")
  // First, get all pages from localStorage to ensure we have the latest data
  const allPages = safeGetItem("notion-pages", []);

  // Only access localStorage in browser environment
  if (typeof window !== "undefined" && localStorage) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("todos-")) {
        const pageId = key.replace("todos-", "");
        const pageTodos = safeGetItem(key, []);

        // Try to find the page - first in the hook state, then in localStorage
        let page = getPage ? getPage(pageId) : null;
        if (!page) {
          page = allPages.find((p) => p.id === pageId);
        }

        // If page still not found, check if it's a valid UUID format
        // Sometimes pages might exist but not be in the current state
        const isValidPageId =
          pageId &&
          pageId.length > 0 &&
          pageId !== "null" &&
          pageId !== "undefined";

        pageTodos.forEach((todo) => {
          allTodos.push({
            ...todo,
            pageId: isValidPageId ? pageId : null,
            pageTitle: page
              ? page.title
              : isValidPageId
              ? "Unknown Page"
              : "Orphaned",
          });
        });
      }
    }
  }

  // Sort by creation date (newest first)
  return allTodos.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB - dateA;
  });
}
