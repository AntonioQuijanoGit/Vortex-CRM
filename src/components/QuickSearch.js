import React, { useState, useEffect, useRef } from "react";
import { usePages } from "../hooks/usePages";
import { Icons } from "../utils/icons";
import "./QuickSearch.css";

export default function QuickSearch({ onPageSelect, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const { pages } = usePages();

  // Get all todos for search
  const getAllTodos = () => {
    let allTodos = [];
    const legacyTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    allTodos = [...legacyTodos];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("todos-")) {
        const pageTodos = JSON.parse(localStorage.getItem(key) || "[]");
        allTodos = [...allTodos, ...pageTodos];
      }
    }
    return allTodos;
  };

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
    pages.forEach((page) => {
      if (page.title.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          type: "page",
          id: page.id,
          title: page.title,
          icon: Icons.page,
        });
      }
    });

    // Search todos
    const todos = getAllTodos();
    todos.forEach((todo) => {
      if (todo.title.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          type: "todo",
          id: todo.id,
          title: todo.title,
          icon: todo.type === "task" ? Icons.task : Icons.habit,
        });
      }
    });

    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, pages]);

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
    }
    onClose();
  };

  return (
    <div className="quick-search-overlay" onClick={onClose}>
      <div className="quick-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quick-search-header">
          <span className="quick-search-icon">🔍</span>
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
          <button className="quick-search-close" onClick={onClose}>
            {Icons.close}
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
                <span className="result-icon">{result.icon}</span>
                <span className="result-title">{result.title}</span>
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

