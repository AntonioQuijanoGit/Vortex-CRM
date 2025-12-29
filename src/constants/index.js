/**
 * Application constants
 * Centralized location for magic numbers, strings, and configuration values
 */

// Storage keys
export const STORAGE_KEYS = {
  PAGES: 'notion-pages',
  ACTIVE_PAGE: 'notion-active-page',
  EXPANDED_PAGES: 'notion-expanded-pages',
  THEME: 'theme',
  LAST_RESET: 'lastReset',
  HAS_SEEN_TUTORIAL: 'has-seen-tutorial',
  // Dynamic keys (functions)
  TODOS: (pageId) => pageId ? `todos-${pageId}` : 'todos',
  EVENTS: (pageId) => pageId ? `events-${pageId}` : 'events',
  MOVIES: (pageId) => pageId ? `movies-${pageId}` : 'movies',
};

// Intervals and timeouts
export const INTERVALS = {
  DAY_CHECK: 60000, // 1 minute - check for day change
  ONBOARDING_DELAY: 500, // milliseconds - delay before showing onboarding
};

// Validation limits
export const LIMITS = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 2000,
};

// Default values
export const DEFAULTS = {
  PAGE_TITLE: 'Untitled',
  THEME: 'light',
  ACTIVE_PAGE: 'home',
};

// Toast durations
export const TOAST_DURATION = {
  SHORT: 2000,
  DEFAULT: 3000,
  LONG: 5000,
};


