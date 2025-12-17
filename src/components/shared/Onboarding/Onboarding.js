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
      title: "Welcome",
      description: "Your personal productivity hub. Everything saves automatically.\n\n• Create tasks and habits\n• Organize with pages\n• Track your progress",
      position: "center",
      action: "Next",
      highlight: null
    },
    {
      title: "Navigation",
      description: "Use the sidebar to navigate:\n\n• Home: Your main workspace\n• Tasks: View all tasks\n• Habits: Track daily routines\n• Pages: Organize content\n• Analytics: See your progress",
      position: "left",
      action: "Next",
      highlight: "sidebar"
    },
    {
      title: "Creating Content",
      description: "Add tasks and habits to any page:\n\n• Type in the input field at the top\n• Press Enter to create\n• Set due dates for tasks\n• Mark habits complete daily",
      position: "center",
      action: "Next",
      highlight: "content"
    },
    {
      title: "Pages",
      description: "Organize everything with pages:\n\n• Click the + button to create pages\n• Add subpages for hierarchy\n• Each page can have tasks, habits, and notes",
      position: "left",
      action: "Next",
      highlight: "pages"
    },
    {
      title: "Quick Actions",
      description: "Use keyboard shortcuts for speed:\n\n• Cmd/Ctrl + K: Quick search\n• Cmd/Ctrl + N: New page\n• Cmd/Ctrl + /: View shortcuts\n• ?: Help anytime",
      position: "center",
      action: "Next",
      highlight: null
    },
    {
      title: "You're All Set!",
      description: "Start by creating your first task or habit.\n\n💡 Tip: Hover over buttons to see what they do.\n\nClick the '?' button anytime for help.",
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

