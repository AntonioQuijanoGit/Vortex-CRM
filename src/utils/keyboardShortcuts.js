/**
 * Keyboard shortcuts configuration and handlers
 */

export const SHORTCUTS = {
  NEW_PAGE: { key: "n", meta: true, label: "New Page" },
  QUICK_SEARCH: { key: "k", meta: true, label: "Quick Search" },
  TOGGLE_SIDEBAR: { key: "b", meta: true, label: "Toggle Sidebar" },
  SHOW_SHORTCUTS: { key: "/", meta: true, label: "Show Shortcuts" },
  ESCAPE: { key: "Escape", meta: false, label: "Close Modal" },
  HELP: { key: "?", meta: false, label: "Show Help" },
};

export function getShortcutDisplay(shortcut) {
  const metaKey = navigator.platform.includes("Mac") ? "⌘" : "Ctrl";
  if (shortcut.meta) {
    return `${metaKey} + ${shortcut.key.toUpperCase()}`;
  }
  return shortcut.key;
}

export function matchesShortcut(e, shortcut) {
  const metaPressed = e.metaKey || e.ctrlKey;
  const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
  
  if (shortcut.meta) {
    return metaPressed && keyMatches;
  }
  return !metaPressed && keyMatches;
}
















