import React, { useState } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import "./EmptyState.css";
import "./EmptyStateEnhanced.css";

/**
 * Enhanced Empty State con ejemplos interactivos y mejor guía
 */
export default function EmptyStateEnhanced({ 
  onAction,
  examples = [],
  onUseExample
}) {
  const [selectedExample, setSelectedExample] = useState(null);

  const defaultExamples = examples.length > 0 ? examples : [
    {
      id: 'work',
      title: 'Work Tasks',
      icon: Icons.briefcase,
      items: [
        { type: 'task', title: 'Review pending emails', dueDate: null },
        { type: 'task', title: 'Prepare client presentation', dueDate: null },
        { type: 'habit', title: 'Daily productivity review', dueDate: null }
      ],
      description: 'Organize your work tasks'
    },
    {
      id: 'personal',
      title: 'Personal',
      icon: Icons.heart,
      items: [
        { type: 'habit', title: 'Drink 2L water', dueDate: null },
        { type: 'habit', title: 'Exercise 30 min', dueDate: null },
        { type: 'task', title: 'Grocery shopping', dueDate: null }
      ],
      description: 'Keep healthy habits and personal tasks'
    },
    {
      id: 'study',
      title: 'Study',
      icon: Icons.book,
      items: [
        { type: 'habit', title: 'Read 30 minutes', dueDate: null },
        { type: 'task', title: 'Complete math homework', dueDate: null },
        { type: 'task', title: 'Study for final exam', dueDate: null }
      ],
      description: 'Organize your learning and study habits'
    }
  ];

  const handleUseExample = (example) => {
    setSelectedExample(example.id);
    if (onUseExample) {
      onUseExample(example);
    }
  };

  return (
    <div className="emptyState-enhanced">
      <div className="emptyState-header">
        <div className="emptyStateIcon" aria-hidden="true">
          {renderIcon(Icons.page, 64)}
        </div>
        <h2 className="emptyStateText">Welcome to Taskline</h2>
        <p className="emptyStateHint">
          Your productivity hub. Everything auto-saves.
        </p>
      </div>

      {/* Sección de ejemplos interactivos */}
      <div className="emptyState-examples-section">
        <h3 className="examples-section-title">
          Quick start with examples:
        </h3>
        <div className="examples-grid">
          {defaultExamples.map((example) => (
            <button
              key={example.id}
              className={`example-card ${selectedExample === example.id ? 'selected' : ''}`}
              onClick={() => handleUseExample(example)}
              disabled={selectedExample !== null}
            >
              <div className="example-card-icon">
                {renderIcon(example.icon || Icons.page, 24)}
              </div>
              <div className="example-card-content">
                <h4 className="example-card-title">{example.title}</h4>
                <p className="example-card-description">{example.description}</p>
                <div className="example-card-items">
                  {example.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="example-item-preview">
                      <span className="example-item-icon">
                        {renderIcon(item.type === 'habit' ? Icons.habit : Icons.task, 14)}
                      </span>
                      <span className="example-item-text">{item.title}</span>
                    </div>
                  ))}
                  {example.items.length > 3 && (
                    <div className="example-item-preview muted">
                      +{example.items.length - 3} more...
                    </div>
                  )}
                </div>
              </div>
              <div className="example-card-action">
                {selectedExample === example.id ? (
                  <span className="example-check">{renderIcon(Icons.check, 18)}</span>
                ) : (
                  <span className="example-arrow">{renderIcon(Icons.arrowRight, 16)}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Separador */}
      <div className="emptyState-divider">
        <span>o</span>
      </div>

      {/* Guía de primeros pasos */}
      <div className="emptyState-steps-guide">
        <h3 className="steps-guide-title">Getting started:</h3>
        <ol className="steps-list">
          <li className="step-item">
            <span className="step-number">1</span>
            <div className="step-content">
              <strong>Create a page</strong>
              <span>Organize content in custom pages</span>
            </div>
          </li>
          <li className="step-item">
            <span className="step-number">2</span>
            <div className="step-content">
              <strong>Add tasks & habits</strong>
              <span>Type in the field above and press Enter</span>
            </div>
          </li>
          <li className="step-item">
            <span className="step-number">3</span>
            <div className="step-content">
              <strong>Explore views</strong>
              <span>Switch between List, Board, Table & Calendar</span>
            </div>
          </li>
        </ol>
      </div>

      {/* Acción principal */}
      <div className="emptyState-actions">
        {onAction && (
          <button 
            className="emptyStateAction primary"
            onClick={onAction}
            aria-label="Create your first page"
          >
            <span className="actionIcon">{renderIcon(Icons.add, 18)}</span>
            <span>Create my first page</span>
          </button>
        )}
        <p className="welcome-hint">
          Or use the <strong>+</strong> button in the sidebar to create a page
        </p>
      </div>

      {/* Tips adicionales */}
      <div className="emptyState-tips">
        <div className="tip-box">
          <span className="tip-icon">💡</span>
          <div className="tip-content">
            <strong>Tip:</strong> Create pages inside pages to organize better
          </div>
        </div>
        <div className="tip-box">
          <span className="tip-icon">⌨️</span>
          <div className="tip-content">
            <strong>Shortcuts:</strong> Press <kbd>Cmd/Ctrl + K</kbd> for quick search or <kbd>?</kbd> for help
          </div>
        </div>
      </div>
    </div>
  );
}

