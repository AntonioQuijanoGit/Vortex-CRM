import React, { useEffect, useRef } from "react";
import { Icons } from "../../../utils/icons";
import { SHORTCUTS, getShortcutDisplay } from "../../../utils/keyboardShortcuts";
import "./ShortcutsModal.css";

export default function ShortcutsModal({ onClose }) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Focus management
  useEffect(() => {
    previousActiveElement.current = document.activeElement;
    
    const timer = setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }, 0);

    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscape);
      previousActiveElement.current?.focus();
    };
  }, [onClose]);
  const shortcutGroups = [
    {
      title: "Navigation",
      shortcuts: [
        SHORTCUTS.QUICK_SEARCH,
        SHORTCUTS.TOGGLE_SIDEBAR,
        SHORTCUTS.NEW_PAGE,
      ],
    },
    {
      title: "General",
      shortcuts: [
        SHORTCUTS.SHOW_SHORTCUTS,
        SHORTCUTS.HELP,
        SHORTCUTS.ESCAPE,
      ],
    },
  ];

  return (
    <div className="shortcuts-modal-overlay" onClick={onClose}>
      <div ref={modalRef} className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-modal-header">
          <h2>Keyboard Shortcuts</h2>
          <button className="shortcuts-modal-close" onClick={onClose} aria-label="Close">
            {Icons.close}
          </button>
        </div>
        <div className="shortcuts-modal-content">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="shortcuts-group">
              <h3 className="shortcuts-group-title">{group.title}</h3>
              <div className="shortcuts-list">
                {group.shortcuts.map((shortcut) => (
                  <div key={shortcut.key} className="shortcut-item">
                    <span className="shortcut-label">{shortcut.label}</span>
                    <kbd className="shortcut-key">{getShortcutDisplay(shortcut)}</kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="shortcuts-modal-footer">
          <button className="shortcuts-modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}






