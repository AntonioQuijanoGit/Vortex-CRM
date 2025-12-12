import { useState, useEffect } from "react";
import { Icons, normalizeIcon } from "../utils/icons";
import { safeGetItem, safeSetItem } from "../utils/storage";
import { validateTitle } from "../utils/validation";
import { logger } from "../utils/logger";

/**
 * Custom hook for managing hierarchical pages (Notion-style)
 */
export function usePages() {
  const [pages, setPages] = useState(() => {
    const savedPages = safeGetItem("notion-pages", null);
    if (savedPages && savedPages.length > 0) {
      // Normalize icons in saved pages
      return savedPages.map(page => ({
        ...page,
        icon: normalizeIcon(page.icon)
      }));
    }
    // Default pages - only essential ones
    return [
      {
        id: "home",
        title: "Home",
        icon: Icons.page,
        parentId: null,
        type: "page",
        createdAt: new Date().toISOString(),
        content: [],
      },
    ];
  });

  const [activePage, setActivePage] = useState(() => {
    return safeGetItem("notion-active-page", "home");
  });

  const [expandedPages, setExpandedPages] = useState(() => {
    return safeGetItem("notion-expanded-pages", []);
  });

  // Save to localStorage
  useEffect(() => {
    try {
      safeSetItem("notion-pages", pages);
    } catch (error) {
      logger.error("Failed to save pages:", error);
    }
  }, [pages]);

  useEffect(() => {
    try {
      safeSetItem("notion-active-page", activePage);
    } catch (error) {
      logger.error("Failed to save active page:", error);
    }
  }, [activePage]);

  useEffect(() => {
    try {
      safeSetItem("notion-expanded-pages", expandedPages);
    } catch (error) {
      logger.error("Failed to save expanded pages:", error);
    }
  }, [expandedPages]);

  // Get children of a page
  const getChildren = (pageId) => {
    return pages.filter((page) => page.parentId === pageId);
  };

  // Get page by id
  const getPage = (pageId) => {
    return pages.find((page) => page.id === pageId);
  };

  // Get root pages (no parent)
  const getRootPages = () => {
    return pages.filter((page) => page.parentId === null);
  };

  // Add new page
  const addPage = (title, parentId = null, type = "page", icon = Icons.page) => {
    const pageTitle = title.trim() || "Untitled";
    const validation = validateTitle(pageTitle);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const newPage = {
      id: crypto.randomUUID(),
      title: pageTitle,
      icon: Icons.page, // Always use neutral icon
      parentId,
      type,
      viewType: type === "database" ? "list" : undefined,
      createdAt: new Date().toISOString(),
      content: [],
    };

    setPages((prev) => [...prev, newPage]);

    // If adding to a parent, expand that parent
    if (parentId && !expandedPages.includes(parentId)) {
      setExpandedPages((prev) => [...prev, parentId]);
    }

    return newPage.id;
  };

  // Update page
  const updatePage = (pageId, updates) => {
    // Validate title if it's being updated
    if (updates.title !== undefined) {
      const pageTitle = updates.title.trim() || "Untitled";
      const validation = validateTitle(pageTitle);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      updates.title = pageTitle;
    }

    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, ...updates } : page
      )
    );
  };

  // Check if page has content (todos, children, or blocks)
  const pageHasContent = (pageId) => {
    // Check for children
    const children = getChildren(pageId);
    if (children.length > 0) return true;

    // Check for todos in this page
    try {
      const todos = safeGetItem(`todos-${pageId}`, []);
      if (todos.length > 0) return true;
    } catch (error) {
      logger.error("Error checking todos for page:", error);
    }

    // Check for content blocks
    const page = getPage(pageId);
    if (page && Array.isArray(page.content) && page.content.length > 0) {
      return true;
    }

    return false;
  };

  // Delete page and its children
  const deletePage = (pageId, force = false) => {
    // If not forced and page has content, don't delete (should show confirmation first)
    if (!force && pageHasContent(pageId)) {
      throw new Error("Page has content. Please confirm deletion.");
    }

    const deleteRecursive = (id) => {
      const children = getChildren(id);
      children.forEach((child) => deleteRecursive(child.id));
      setPages((prev) => prev.filter((page) => page.id !== id));
    };

    deleteRecursive(pageId);

    // If we deleted the active page, go to first page
    if (activePage === pageId) {
      setActivePage(pages[0]?.id || null);
    }
  };

  // Toggle expanded state
  const toggleExpanded = (pageId) => {
    setExpandedPages((prev) =>
      prev.includes(pageId)
        ? prev.filter((id) => id !== pageId)
        : [...prev, pageId]
    );
  };

  // Check if page is expanded
  const isExpanded = (pageId) => {
    return expandedPages.includes(pageId);
  };

  // Get breadcrumbs for a page
  const getBreadcrumbs = (pageId) => {
    const breadcrumbs = [];
    let currentPage = getPage(pageId);

    while (currentPage) {
      breadcrumbs.unshift(currentPage);
      currentPage = currentPage.parentId ? getPage(currentPage.parentId) : null;
    }

    return breadcrumbs;
  };

  return {
    pages,
    activePage,
    setActivePage,
    getPage,
    getRootPages,
    getChildren,
    addPage,
    updatePage,
    deletePage,
    toggleExpanded,
    isExpanded,
    getBreadcrumbs,
  };
}
