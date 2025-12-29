import React, { useState, useEffect, useRef } from "react";
import { usePages } from "../../../hooks/usePages";
import { Icons, renderIcon } from "../../../utils/icons";
import { getAllTodosWithPages } from "../../../utils/todos";
import "./QuickSearch.css";

export default function QuickSearch({ onPageSelect, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterType, setFilterType] = useState("all"); // all, page, task, habit
  const inputRef = useRef(null);
  const { pages, getPage } = usePages();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const searchResults = [];

    // Search pages
    if (filterType === "all" || filterType === "page") {
      pages.forEach((page) => {
        if (page.title.toLowerCase().includes(searchQuery)) {
          searchResults.push({
            type: "page",
            id: page.id,
            title: page.title,
            icon: Icons.page,
            pageType: page.type,
          });
        }
      });
    }

    // Search todos
    if (filterType === "all" || filterType === "task" || filterType === "habit") {
      const todosWithPages = getAllTodosWithPages(getPage);
      todosWithPages.forEach(({ todo, pageId, pageTitle }) => {
        const matchesType = filterType === "all" || 
          (filterType === "task" && todo.type === "task") ||
          (filterType === "habit" && todo.type === "habit");
        
        if (matchesType && todo.title.toLowerCase().includes(searchQuery)) {
          searchResults.push({
            type: "todo",
            id: todo.id,
            title: todo.title,
            icon: todo.type === "task" ? Icons.task : Icons.habit,
            pageId: pageId,
            pageTitle: pageTitle,
            todoType: todo.type,
            completed: todo.completed,
            dueDate: todo.dueDate,
          });
        }
      });
    }

    // Sort results: pages first, then todos
    searchResults.sort((a, b) => {
      if (a.type === "page" && b.type !== "page") return -1;
      if (a.type !== "page" && b.type === "page") return 1;
      return 0;
    });

    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, pages, getPage, filterType]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (result) => {
    if (result.type === "page") {
      onPageSelect(result.id);
    } else if (result.type === "todo" && result.pageId) {
      // Navigate to the page that contains this todo
      onPageSelect(result.pageId);
    }
    onClose();
  };

  return (
    <div className="quick-search-overlay" onClick={onClose}>
      <div className="quick-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quick-search-header">
          <span className="quick-search-icon">{renderIcon(Icons.search, 20)}</span>
          <input
            ref={inputRef}
            type="text"
            className="quick-search-input"
            placeholder="Search pages, tasks, habits..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="quick-search-filters">
            <button
              className={`quick-search-filter ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
              title="All"
            >
              All
            </button>
            <button
              className={`quick-search-filter ${filterType === "page" ? "active" : ""}`}
              onClick={() => setFilterType("page")}
              title="Pages"
            >
              {renderIcon(Icons.page, 14)}
            </button>
            <button
              className={`quick-search-filter ${filterType === "task" ? "active" : ""}`}
              onClick={() => setFilterType("task")}
              title="Tasks"
            >
              {renderIcon(Icons.task, 14)}
            </button>
            <button
              className={`quick-search-filter ${filterType === "habit" ? "active" : ""}`}
              onClick={() => setFilterType("habit")}
              title="Habits"
            >
              {renderIcon(Icons.habit, 14)}
            </button>
          </div>
          <button className="quick-search-close" onClick={onClose}>
            {renderIcon(Icons.close, 18)}
          </button>
        </div>
        {results.length > 0 && (
          <div className="quick-search-results">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                className={`quick-search-result ${
                  index === selectedIndex ? "selected" : ""
                }`}
                onClick={() => handleSelect(result)}
              >
                <span className="result-icon">{renderIcon(result.icon, 16)}</span>
                <div className="result-content">
                  <span className="result-title">{result.title}</span>
                  {result.pageTitle && result.type === "todo" && (
                    <span className="result-meta">in {result.pageTitle}</span>
                  )}
                  {result.dueDate && (
                    <span className="result-meta">
                      Due {new Date(result.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <span className="result-type">{result.type}</span>
              </button>
            ))}
          </div>
        )}
        {query && results.length === 0 && (
          <div className="quick-search-empty">No results found</div>
        )}
        <div className="quick-search-footer">
          <span className="quick-search-hint">
            <kbd>↑</kbd> <kbd>↓</kbd> Navigate • <kbd>Enter</kbd> Select •{" "}
            <kbd>Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}

