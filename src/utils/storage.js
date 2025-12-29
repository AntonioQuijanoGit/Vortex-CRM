/**
 * Safe localStorage wrapper with error handling
 * Includes browser environment checks for SSR/build compatibility
 */

export function safeGetItem(key, defaultValue = null) {
  // Only access localStorage in browser environment
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    // Silently fail in production, log in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error reading from localStorage (${key}):`, error);
    }
    return defaultValue;
  }
}

export function safeSetItem(key, value) {
  // Only access localStorage in browser environment
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { success: true, error: null };
  } catch (error) {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
    
    // Check if it's a quota exceeded error
    if (error.name === "QuotaExceededError" || error.code === 22) {
      const quotaError = new Error("Storage quota exceeded. Please free up some space.");
      return { success: false, error: quotaError };
    }
    
    return { success: false, error };
  }
}

export function safeRemoveItem(key) {
  // Only access localStorage in browser environment
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    // Silently fail in production, log in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
    return false;
  }
}

