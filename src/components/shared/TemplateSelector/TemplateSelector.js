import React, { useState } from "react";
import { Icons } from "../../../utils/icons";
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
          <div className="template-selector-icon">{Icons.page}</div>
          <h2 className="template-selector-title">{templateInfo.title}</h2>
          <p className="template-selector-description">{templateInfo.description}</p>
        </div>

        <div className="template-selector-features">
          {templateInfo.features.map((feature, index) => (
            <div key={index} className="template-feature-card">
              <div className="template-feature-icon">{feature.icon}</div>
              <div className="template-feature-content">
                <h3 className="template-feature-title">{feature.title}</h3>
                <p className="template-feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="template-selector-preview">
          <h3 className="template-preview-title">Incluye:</h3>
          <div className="template-preview-stats">
            <div className="template-stat">
              <span className="template-stat-value">{initialTemplates.pages.length}</span>
              <span className="template-stat-label">Páginas</span>
            </div>
            <div className="template-stat">
              <span className="template-stat-value">
                {Object.values(initialTemplates.todos).reduce((sum, todos) => sum + todos.length, 0)}
              </span>
              <span className="template-stat-label">Tareas y Hábitos</span>
            </div>
            <div className="template-stat">
              <span className="template-stat-value">
                {Object.values(initialTemplates.blocks).reduce((sum, blocks) => sum + blocks.length, 0)}
              </span>
              <span className="template-stat-label">Bloques</span>
            </div>
          </div>
        </div>

        <div className="template-selector-actions">
          <button
            className="template-action-button secondary"
            onClick={onSkip}
            disabled={isLoading}
          >
            Empezar desde cero
          </button>
          <button
            className="template-action-button primary"
            onClick={handleAccept}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="template-loading-spinner"></span>
                Cargando...
              </>
            ) : (
              <>
                <span className="template-action-icon">{Icons.add}</span>
                Usar plantillas
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

