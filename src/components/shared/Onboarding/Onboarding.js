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
      title: "Welcome to Taskline",
      description: "Your productivity hub.",
      items: [
        "Auto-saves everything",
        "Create tasks & habits",
        "Organize with pages",
        "Track your progress"
      ],
      position: "center",
      action: "Next",
      highlight: null
    },
    {
      title: "Navigation",
      description: "Use the sidebar to navigate:",
      items: [
        "🏠 Home: Main workspace",
        "✅ Tasks: View all tasks",
        "🔄 Habits: Daily routines",
        "📄 Pages: Organize content",
        "📊 Analytics: Your progress"
      ],
      position: "left",
      action: "Next",
      highlight: "sidebar"
    },
    {
      title: "Create Content",
      description: "Add tasks and habits to any page:",
      items: [
        "Type in the field above",
        "Press Enter to create",
        "Set due dates for tasks",
        "Mark habits daily"
      ],
      position: "center",
      action: "Next",
      highlight: "content"
    },
    {
      title: "Pages",
      description: "Organize everything with pages:",
      items: [
        "Click + to create pages",
        "Add subpages for hierarchy",
        "Each page has tasks, habits & notes",
        "Everything auto-organizes"
      ],
      position: "left",
      action: "Next",
      highlight: "pages"
    },
    {
      title: "Keyboard Shortcuts",
      description: "Use shortcuts to work faster:",
      items: [
        "⌨️ Cmd/Ctrl + K: Quick search",
        "⌨️ Cmd/Ctrl + N: New page",
        "⌨️ Cmd/Ctrl + /: All shortcuts",
        "⌨️ ?: Help anytime"
      ],
      position: "center",
      action: "Next",
      highlight: null
    },
    {
      title: "You're All Set",
      description: "Start by creating your first task or habit.",
      items: [
        "💡 Hover buttons for hints",
        "💡 Use quick examples on home",
        "❓ Click ? for help"
      ],
      position: "center",
      action: "Get Started",
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
          <p className="tooltip-description">{current.description}</p>
          {current.items && (
            <ul className="tooltip-list">
              {current.items.map((item, index) => (
                <li key={index} className="tooltip-list-item">{item}</li>
              ))}
            </ul>
          )}
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

