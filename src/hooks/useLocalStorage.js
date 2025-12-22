import { useState, useEffect, useCallback } from "react";
import { safeGetItem, safeSetItem } from "../utils/storage";
import { logger } from "../utils/logger";

/**
 * Generic hook for managing localStorage state
 * Eliminates code duplication across useTodos, useEvents, useMovies, etc.
 * 
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @param {Function} validator - Optional function to validate data structure
 * @returns {[any, Function]} - [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue, validator = null) {
  // Initialize state from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = safeGetItem(key, initialValue);
      
      // Validate data structure if validator provided
      if (validator && item !== initialValue) {
        const isValid = validator(item);
        if (!isValid) {
          logger.warn(`Invalid data structure for key "${key}", using initial value`);
          return initialValue;
        }
      }
      
      return item;
    } catch (error) {
      logger.error(`Error reading from localStorage (${key}):`, error);
      return initialValue;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      safeSetItem(key, storedValue);
    } catch (error) {
      logger.error(`Failed to save to localStorage (${key}):`, error);
      // Note: Could integrate with toast system here if needed
    }
  }, [key, storedValue]);

  // Memoized setter function
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Validate before setting if validator provided
      if (validator) {
        const isValid = validator(valueToStore);
        if (!isValid) {
          logger.warn(`Invalid data structure for key "${key}", update rejected`);
          return;
        }
      }
      
      setStoredValue(valueToStore);
    } catch (error) {
      logger.error(`Error setting localStorage value (${key}):`, error);
    }
  }, [key, storedValue, validator]);

  return [storedValue, setValue];
}

