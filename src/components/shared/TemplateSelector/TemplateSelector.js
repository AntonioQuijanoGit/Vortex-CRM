import React, { useState } from "react";
import { getAllTemplates } from "../../../utils/templates";
import { Icons } from "../../../utils/icons";
import "./TemplateSelector.css";

/**
 * Template Selector - Choose a template when creating a new page
 */
export default function TemplateSelector({ onSelect, onCancel }) {
  const templates = getAllTemplates();

  return (
    <div className="template-selector-overlay" onClick={onCancel}>
      <div className="template-selector" onClick={(e) => e.stopPropagation()}>
        <div className="template-selector-header">
          <h2>Choose a Template</h2>
          <button className="close-btn" onClick={onCancel} aria-label="Close">
            {Icons.close}
          </button>
        </div>
        <div className="template-grid">
          {templates.map((template) => (
            <button
              key={template.id}
              className="template-card"
              onClick={() => onSelect(template)}
            >
              <div className="template-icon">{template.icon}</div>
              <div className="template-info">
                <div className="template-name">{template.name}</div>
                <div className="template-description">{template.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

