import React, { useState, useEffect } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import { safeGetItem, safeSetItem } from "../../../utils/storage";
import "./Onboarding.css";

export default function Onboarding({ onComplete, forceShow = false }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
    } else {
      if (typeof window === 'undefined') return;
      const hasSeenTutorial = safeGetItem("has-seen-tutorial", null);
      if (!hasSeenTutorial) {
        setIsVisible(true);
      }
    }
  }, [forceShow]);

  const steps = [
    {
      title: "¡Bienvenido a Taskline! 🎉",
      description: "Tu centro de productividad personal.\n\n✨ Todo se guarda automáticamente\n📝 Crea tareas y hábitos\n📄 Organiza con páginas\n📊 Rastrea tu progreso",
      position: "center",
      action: "Siguiente",
      highlight: null
    },
    {
      title: "Navegación",
      description: "Usa la barra lateral para navegar:\n\n🏠 Home: Tu espacio de trabajo principal\n✅ Tasks: Ver todas las tareas\n🔄 Habits: Rastrear rutinas diarias\n📄 Pages: Organizar contenido\n📊 Analytics: Ver tu progreso",
      position: "left",
      action: "Siguiente",
      highlight: "sidebar"
    },
    {
      title: "Crear Contenido",
      description: "Añade tareas y hábitos a cualquier página:\n\n1️⃣ Escribe en el campo de arriba\n2️⃣ Presiona Enter para crear\n3️⃣ Establece fechas de vencimiento para tareas\n4️⃣ Marca hábitos como completados diariamente",
      position: "center",
      action: "Siguiente",
      highlight: "content"
    },
    {
      title: "Páginas",
      description: "Organiza todo con páginas:\n\n➕ Haz clic en el botón + para crear páginas\n📁 Añade subpáginas para jerarquía\n📝 Cada página puede tener tareas, hábitos y notas\n🎯 Todo se organiza automáticamente",
      position: "left",
      action: "Siguiente",
      highlight: "pages"
    },
    {
      title: "Atajos de Teclado",
      description: "Usa atajos para ser más rápido:\n\n⌨️ Cmd/Ctrl + K: Búsqueda rápida\n⌨️ Cmd/Ctrl + N: Nueva página\n⌨️ Cmd/Ctrl + /: Ver todos los atajos\n⌨️ ?: Ayuda en cualquier momento",
      position: "center",
      action: "Siguiente",
      highlight: null
    },
    {
      title: "¡Todo Listo! 🚀",
      description: "Empieza creando tu primera tarea o hábito.\n\n💡 Tip: Pasa el mouse sobre los botones para ver qué hacen.\n\n💡 Tip: Usa los ejemplos rápidos en la página principal para empezar.\n\n❓ Haz clic en el botón '?' cuando necesites ayuda.",
      position: "center",
      action: "Empezar",
      highlight: null
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    safeSetItem("has-seen-tutorial", "true");
    if (onComplete) onComplete();
  };

  if (!isVisible) return null;

  const current = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <>
      <div className={`onboarding-overlay ${current.highlight ? `highlight-${current.highlight}` : ''}`} onClick={handleSkip} />
      <div className={`onboarding-tooltip onboarding-${current.position}`}>
        <div className="tooltip-header">
          <div className="tooltip-progress">
            <span className="progress-text">{currentStep + 1} of {steps.length}</span>
            <div className="progress-dots">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${index === currentStep ? "active" : index < currentStep ? "completed" : ""}`}
                />
              ))}
            </div>
          </div>
          <button className="tooltip-close" onClick={handleSkip} aria-label="Skip tutorial">
            {renderIcon(Icons.close, 18)}
          </button>
        </div>
        <div className="tooltip-content">
          <h3 className="tooltip-title">{current.title}</h3>
          <p className="tooltip-description" style={{ whiteSpace: 'pre-line' }}>{current.description}</p>
        </div>
        <div className="tooltip-footer">
          <button className="tooltip-skip" onClick={handleSkip}>
            Skip Tutorial
          </button>
          <button className="tooltip-next" onClick={handleNext}>
            {current.action || (isLast ? "Get Started" : "Next")}
          </button>
        </div>
      </div>
    </>
  );
}

