import { useState, useEffect } from "react";
import { safeGetItem, safeSetItem } from "../utils/storage";

/**
 * Custom hook for managing theme (light/dark mode)
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Only access localStorage and window in browser environment
    if (typeof window === 'undefined') return "light";
    
    // Check localStorage first
    const savedTheme = safeGetItem("theme", null);
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    // Only access document and localStorage in browser environment
    if (typeof window === 'undefined') return;
    
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme);
    safeSetItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, setTheme, toggleTheme };
}

