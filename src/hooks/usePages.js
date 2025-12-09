import { useState, useEffect } from "react";
import { Icons, normalizeIcon } from "../utils/icons";

/**
 * Custom hook for managing hierarchical pages (Notion-style)
 */
export function usePages() {
  const [pages, setPages] = useState(() => {
    const savedPages = localStorage.getItem("notion-pages");
    if (savedPages) {
      const parsed = JSON.parse(savedPages);
      // Normalize icons in saved pages
      return parsed.map(page => ({
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
    const saved = localStorage.getItem("notion-active-page");
    return saved || "home";
  });

  const [expandedPages, setExpandedPages] = useState(() => {
    const saved = localStorage.getItem("notion-expanded-pages");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("notion-pages", JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem("notion-active-page", activePage);
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem("notion-expanded-pages", JSON.stringify(expandedPages));
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
    const newPage = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled",
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
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, ...updates } : page
      )
    );
  };

  // Delete page and its children
  const deletePage = (pageId) => {
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
