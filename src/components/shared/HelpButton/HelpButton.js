import React, { useState, useEffect } from "react";
import Onboarding from "../Onboarding/Onboarding";
import OrphanedItems from "../OrphanedItems/OrphanedItems";
import { Icons, renderIcon } from "../../../utils/icons";
import { safeGetItem } from "../../../utils/storage";
import "./HelpButton.css";

export default function HelpButton({ onNavigate }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showOrphanedItems, setShowOrphanedItems] = useState(false);
  
  // Check if there are orphaned items
  const hasOrphanedItems = () => {
    if (typeof window === 'undefined' || !localStorage) return false;
    
    const allPages = safeGetItem("notion-pages", []);
    const pageIds = new Set(allPages.map(p => p.id));

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("todos-")) {
        const pageId = key.replace("todos-", "");
        if (!pageIds.has(pageId) && pageId && pageId !== "null" && pageId !== "undefined") {
          const pageTodos = safeGetItem(key, []);
          if (pageTodos.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const [orphanedCount, setOrphanedCount] = useState(0);

  // Check for orphaned items periodically
  useEffect(() => {
    if (typeof window === 'undefined' || !localStorage) return;
    
    const checkOrphaned = () => {
      const allPages = safeGetItem("notion-pages", []);
      const pageIds = new Set(allPages.map(p => p.id));
      let count = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("todos-")) {
          const pageId = key.replace("todos-", "");
          if (!pageIds.has(pageId) && pageId && pageId !== "null" && pageId !== "undefined") {
            const pageTodos = safeGetItem(key, []);
            count += pageTodos.length;
          }
        }
      }
      setOrphanedCount(count);
    };

    checkOrphaned();
    // Check every 5 seconds
    const interval = setInterval(checkOrphaned, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  // Keyboard shortcut: ? key to show tutorial
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e) => {
      // Only trigger if not typing in an input
      if (e.key === "?" && !e.target.matches("input, textarea")) {
        e.preventDefault();
        handleShowTutorial();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="help-buttons-container">
        {orphanedCount > 0 && (
          <button
            className="help-button orphaned-items-button"
            onClick={() => setShowOrphanedItems(true)}
            aria-label={`Show ${orphanedCount} orphaned item${orphanedCount !== 1 ? 's' : ''}`}
            title={`${orphanedCount} item${orphanedCount !== 1 ? 's' : ''} in deleted pages`}
          >
            <span className="help-button-icon" aria-hidden="true">
              {renderIcon(Icons.warning, 18)}
            </span>
            {orphanedCount > 0 && (
              <span className="orphaned-count-badge">{orphanedCount}</span>
            )}
          </button>
        )}
        <button
          className="help-button"
          onClick={handleShowTutorial}
          aria-label="Show tutorial"
          title="Show tutorial (Press ? for help)"
        >
          <span className="help-button-icon" aria-hidden="true">
            {renderIcon(Icons.help, 18)}
          </span>
        </button>
      </div>
      {showTutorial && (
        <Onboarding onComplete={handleTutorialComplete} forceShow={true} />
      )}
      {showOrphanedItems && onNavigate && (
        <OrphanedItems
          onNavigate={onNavigate}
          onClose={() => setShowOrphanedItems(false)}
        />
      )}
    </>
  );
}
