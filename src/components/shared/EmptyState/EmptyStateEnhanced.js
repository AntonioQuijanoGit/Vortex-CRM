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
      title: 'Tareas del Trabajo',
                icon: Icons.briefcase,
      items: [
        { type: 'task', title: 'Revisar emails pendientes', dueDate: null },
        { type: 'task', title: 'Preparar presentación para el cliente', dueDate: null },
        { type: 'habit', title: 'Revisar productividad diaria', dueDate: null }
      ],
      description: 'Organiza tus tareas profesionales'
    },
    {
      id: 'personal',
      title: 'Vida Personal',
      icon: Icons.heart,
      items: [
        { type: 'habit', title: 'Beber 2L de agua', dueDate: null },
        { type: 'habit', title: 'Hacer ejercicio 30 min', dueDate: null },
        { type: 'task', title: 'Hacer compras del supermercado', dueDate: null }
      ],
      description: 'Mantén hábitos saludables y tareas personales'
    },
    {
      id: 'study',
      title: 'Estudio',
      icon: Icons.book,
      items: [
        { type: 'habit', title: 'Leer 30 minutos', dueDate: null },
        { type: 'task', title: 'Completar tarea de matemáticas', dueDate: null },
        { type: 'task', title: 'Estudiar para examen final', dueDate: null }
      ],
      description: 'Organiza tu aprendizaje y hábitos de estudio'
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
        <h2 className="emptyStateText">¡Bienvenido a Taskline!</h2>
        <p className="emptyStateHint">
          Tu centro de productividad personal. Todo se guarda automáticamente.
        </p>
      </div>

      {/* Sección de ejemplos interactivos */}
      <div className="emptyState-examples-section">
        <h3 className="examples-section-title">
          🚀 Empieza rápido con ejemplos:
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
                      +{example.items.length - 3} más...
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
        <h3 className="steps-guide-title">📋 Primeros pasos:</h3>
        <ol className="steps-list">
          <li className="step-item">
            <span className="step-number">1</span>
            <div className="step-content">
              <strong>Crea una página</strong>
              <span>Organiza tu contenido en páginas personalizadas</span>
            </div>
          </li>
          <li className="step-item">
            <span className="step-number">2</span>
            <div className="step-content">
              <strong>Añade tareas y hábitos</strong>
              <span>Escribe en el campo de arriba y presiona Enter</span>
            </div>
          </li>
          <li className="step-item">
            <span className="step-number">3</span>
            <div className="step-content">
              <strong>Explora las vistas</strong>
              <span>Cambia entre Lista, Tablero, Tabla y Calendario</span>
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
            <span>Crear mi primera página</span>
          </button>
        )}
        <p className="welcome-hint">
          O usa el botón <strong>+</strong> en el sidebar para crear una página
        </p>
      </div>

      {/* Tips adicionales */}
      <div className="emptyState-tips">
        <div className="tip-box">
          <span className="tip-icon">💡</span>
          <div className="tip-content">
            <strong>Tip:</strong> Puedes crear páginas dentro de páginas para organizar mejor tu contenido
          </div>
        </div>
        <div className="tip-box">
          <span className="tip-icon">⌨️</span>
          <div className="tip-content">
            <strong>Atajos:</strong> Presiona <kbd>Cmd/Ctrl + K</kbd> para búsqueda rápida o <kbd>?</kbd> para ayuda
          </div>
        </div>
      </div>
    </div>
  );
}

