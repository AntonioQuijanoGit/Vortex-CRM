import React from "react";
import { Link } from "lucide-react";
import { getBacklinks } from "../../../utils/backlinks";
import "./Backlinks.css";

/**
 * Backlinks Component - Show pages that link to this page
 */
export default function Backlinks({ pageId, allPages, onNavigate }) {
  const backlinks = getBacklinks(pageId, allPages);

  if (backlinks.length === 0) {
    return null;
  }

  return (
    <div className="backlinks-container">
      <div className="backlinks-header">
        <Link size={16} />
        <h3 className="backlinks-title">Linked from</h3>
      </div>
      <div className="backlinks-list">
        {backlinks.map(({ pageId: linkPageId, pageTitle }) => (
          <button
            key={linkPageId}
            className="backlink-item"
            onClick={() => onNavigate(linkPageId)}
          >
            {pageTitle}
          </button>
        ))}
      </div>
    </div>
  );
}

