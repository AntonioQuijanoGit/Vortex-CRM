import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a UUID with fallback for environments that don't support crypto.randomUUID
 * This ensures compatibility with older browsers and mobile devices
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

/**
 * Debounce function to delay execution until after wait time has passed
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Safe localStorage helper functions
 * Handles cases where localStorage might not be available (mobile private mode, etc.)
 */
export function safeLocalStorageGetItem(key: string, defaultValue: string | null = null): string | null {
  if (typeof window === "undefined") return defaultValue;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    // localStorage might be disabled or quota exceeded
    console.warn(`localStorage.getItem failed for key "${key}":`, error);
    return defaultValue;
  }
}

export function safeLocalStorageSetItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    // localStorage might be disabled, quota exceeded, or in private mode
    console.warn(`localStorage.setItem failed for key "${key}":`, error);
    return false;
  }
}

export function safeLocalStorageRemoveItem(key: string): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`localStorage.removeItem failed for key "${key}":`, error);
    return false;
  }
}









