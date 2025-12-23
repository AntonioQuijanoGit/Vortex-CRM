import { useState, useEffect } from "react";
import { Icons, normalizeIcon, iconToKey } from "../utils/icons";
import { safeGetItem, safeSetItem } from "../utils/storage";
import { validateTitle } from "../utils/validation";
import { logger } from "../utils/logger";

/**
 * Custom hook for managing hierarchical pages (Notion-style)
 */
export function usePages() {
  // Helper function to recover icon from page metadata when icon is lost
  const recoverIconFromPage = (page) => {
    if (!page) return Icons.page;
    
    const titleLower = (page.title || "").toLowerCase().trim();
    
    // Try to recover icon based on page type first
    if (page.type === "database") {
      if (titleLower.includes("task") || titleLower.includes("todo")) {
        return Icons.task;
      }
      if (titleLower.includes("habit") || titleLower.includes("habits")) {
        return Icons.habit;
      }
      return Icons.database;
    }
    
    if (page.type === "page") {
      if (titleLower === "home") {
        return Icons.home;
      }
      if (titleLower.includes("task") || titleLower.includes("todo")) {
        return Icons.task;
      }
      if (titleLower.includes("habit") || titleLower.includes("habits")) {
        return Icons.habit;
      }
      if (titleLower.includes("note") || titleLower.includes("notes")) {
        return Icons.note;
      }
      if (titleLower.includes("calendar")) {
        return Icons.calendar;
      }
      if (titleLower.includes("movie") || titleLower.includes("film")) {
        return Icons.movie;
      }
      // Use page ID hash for guaranteed variety (ID is always unique)
      const idHash = (page.id || "").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const variants = [Icons.page, Icons.note, Icons.folder, Icons.text, Icons.book];
      return variants[idHash % variants.length];
    }
    
    return Icons.page;
  };

  const [pages, setPages] = useState(() => {
    const savedPages = safeGetItem("notion-pages", null);
    
    if (savedPages && savedPages.length > 0) {
      // Check if migration is needed (all icons same or invalid)
      const iconKeys = savedPages.map(p => typeof p.icon === 'string' ? p.icon : null).filter(Boolean);
      const allSame = iconKeys.length > 1 && new Set(iconKeys).size === 1;
      
      // Convert to components and migrate if needed
      const normalizedPages = savedPages.map((page) => {
        let iconComponent = Icons.page; // Default fallback
        
        // Convert string key to component
        if (typeof page.icon === 'string') {
          iconComponent = Icons[page.icon];
          if (!iconComponent) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[usePages] Icon key "${page.icon}" not found in Icons, using page fallback`);
            }
            iconComponent = Icons.page;
          }
          // If all icons are same, force recovery for variety
          if (allSame) {
            iconComponent = recoverIconFromPage(page);
          }
        } 
        // If it's already a component (function or forwardRef), use it
        else if (typeof page.icon === 'function' || (page.icon && typeof page.icon === 'object' && page.icon.render)) {
          iconComponent = page.icon;
        }
        // If icon is lost/invalid, recover it
        else {
          iconComponent = recoverIconFromPage(page);
        }
        
        // Ensure we have a valid component
        if (!iconComponent) {
          iconComponent = Icons.page;
        }
        
        // Icon is now properly normalized - no debug log needed in production
        
        return {
          ...page,
          icon: iconComponent
        };
      });
      
      // Save migrated icons if needed
      if (allSame) {
        setTimeout(() => {
          const toSave = normalizedPages.map(p => ({
            ...p,
            icon: iconToKey(p.icon)
          }));
          safeSetItem("notion-pages", toSave);
        }, 0);
      }
      
      return normalizedPages;
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

  // Save to localStorage - convert icon functions to string keys for serialization
  useEffect(() => {
    try {
      // Convert icon components to string keys before saving
      const pagesToSave = pages.map(page => ({
        ...page,
        icon: iconToKey(page.icon) // Save as string key instead of function
      }));
      safeSetItem("notion-pages", pagesToSave);
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

  // Generate unique title for untitled pages
  const generateUniqueTitle = (baseTitle, parentId = null) => {
    const existingTitles = pages
      .filter(p => p.parentId === parentId)
      .map(p => p.title);
    
    if (!existingTitles.includes(baseTitle)) {
      return baseTitle;
    }
    
    let counter = 2;
    let newTitle = `${baseTitle} ${counter}`;
    while (existingTitles.includes(newTitle)) {
      counter++;
      newTitle = `${baseTitle} ${counter}`;
    }
    
    return newTitle;
  };

  // Add new page
  const addPage = (title, parentId = null, type = "page", icon = Icons.page) => {
    // If title is null, undefined, or empty string, throw error instead of creating Untitled
    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new Error("Page title is required");
    }
    
    let pageTitle = title.trim();
    
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
      const trimmedTitle = updates.title.trim();
      if (!trimmedTitle) {
        throw new Error("Page title cannot be empty");
      }
      const validation = validateTitle(trimmedTitle);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      updates.title = trimmedTitle;
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
      
      // Delete all associated data from localStorage
      if (typeof window !== 'undefined' && localStorage) {
        // Delete todos for this page
        const todosKey = `todos-${id}`;
        localStorage.removeItem(todosKey);
        
        // Delete events for this page
        const eventsKey = `events-${id}`;
        localStorage.removeItem(eventsKey);
        
        // Delete any other page-specific data
        // Check all localStorage keys and remove those related to this page
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith(`${id}-`) || key.endsWith(`-${id}`) || key === `page-${id}`)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
      
      // Remove page from state
      setPages((prev) => prev.filter((page) => page.id !== id));
    };

    deleteRecursive(pageId);

    // If we deleted the active page, go to home
    if (activePage === pageId) {
      setActivePage("home");
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
