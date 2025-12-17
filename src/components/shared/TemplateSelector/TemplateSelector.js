import React, { useState } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import { getTemplateDescription, initialTemplates } from "../../../utils/templates";
import "./TemplateSelector.css";

export default function TemplateSelector({ onAccept, onSkip }) {
  const [isLoading, setIsLoading] = useState(false);
  const templateInfo = getTemplateDescription();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept();
      // Small delay for visual feedback
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error applying templates:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="template-selector-overlay">
      <div className="template-selector-modal">
        <div className="template-selector-header">
          <div className="template-selector-icon">{renderIcon(Icons.page, 24)}</div>
          <h2 className="template-selector-title">{templateInfo.title}</h2>
          <p className="template-selector-description">{templateInfo.description}</p>
        </div>

        <div className="template-selector-features">
          {templateInfo.features.map((feature, index) => (
            <div key={index} className="template-feature-card">
              <div className="template-feature-icon">{renderIcon(feature.icon, 20)}</div>
              <div className="template-feature-content">
                <h3 className="template-feature-title">{feature.title}</h3>
                <p className="template-feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="template-selector-preview">
          <h3 className="template-preview-title">Includes:</h3>
          <div className="template-preview-stats">
            <div className="template-stat">
              <span className="template-stat-value">{initialTemplates.pages.length}</span>
              <span className="template-stat-label">Pages</span>
            </div>
            <div className="template-stat">
              <span className="template-stat-value">
                {Object.values(initialTemplates.todos).reduce((sum, todos) => sum + todos.length, 0)}
              </span>
              <span className="template-stat-label">Tasks & Habits</span>
            </div>
            <div className="template-stat">
              <span className="template-stat-value">
                {Object.values(initialTemplates.blocks).reduce((sum, blocks) => sum + blocks.length, 0)}
              </span>
              <span className="template-stat-label">Blocks</span>
            </div>
          </div>
        </div>

        <div className="template-selector-actions">
          <button
            className="template-action-button secondary"
            onClick={onSkip}
            disabled={isLoading}
          >
            Start from scratch
          </button>
          <button
            className="template-action-button primary"
            onClick={handleAccept}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="template-loading-spinner"></span>
                Loading...
              </>
            ) : (
              <>
                <span className="template-action-icon">{renderIcon(Icons.add, 16)}</span>
                Use templates
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

