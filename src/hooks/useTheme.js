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
    // Default to light mode (white mode) - don't respect system preference
    return "light";
  });

  useEffect(() => {
    // Only access document and localStorage in browser environment
    if (typeof window === 'undefined') return;
    
    // Apply theme to document immediately
    document.documentElement.setAttribute("data-theme", theme);
    safeSetItem("theme", theme);
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Ensure light theme is set by default if no theme is saved
    const savedTheme = safeGetItem("theme", null);
    if (!savedTheme) {
      document.documentElement.setAttribute("data-theme", "light");
      safeSetItem("theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, setTheme, toggleTheme };
}











