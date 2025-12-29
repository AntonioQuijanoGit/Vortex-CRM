/**
 * Tags System
 */

export const DEFAULT_TAGS = [
  { id: "work", name: "Work", color: "#3b82f6" },
  { id: "personal", name: "Personal", color: "#10b981" },
  { id: "project", name: "Project", color: "#f59e0b" },
  { id: "idea", name: "Idea", color: "#8b5cf6" },
  { id: "important", name: "Important", color: "#ef4444" },
];

/**
 * Get all tags from pages
 */
export function getAllTags(pages) {
  const tagSet = new Set();
  pages.forEach(page => {
    if (page.tags && Array.isArray(page.tags)) {
      page.tags.forEach(tag => tagSet.add(tag));
    }
  });
  return Array.from(tagSet);
}

/**
 * Get pages by tag
 */
export function getPagesByTag(tag, pages) {
  return pages.filter(page => 
    page.tags && Array.isArray(page.tags) && page.tags.includes(tag)
  );
}

