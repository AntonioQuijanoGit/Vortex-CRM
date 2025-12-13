import React, { useState, useEffect } from "react";
import { Icons } from "../../../utils/icons";
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
      title: "Welcome to Your Workspace",
      description: "This is your personal productivity hub. Organize tasks, track habits, and manage your content all in one place. Everything saves automatically.",
      position: "center",
      action: "Let's get started!"
    },
    {
      title: "Your First Steps",
      description: "1. Create a page using the '+' button in the sidebar\n2. Add tasks or habits to track your work\n3. Use the Dashboard (Home) to see your stats\n\nEverything is saved automatically - no need to save!",
      position: "center",
      action: "Got it!"
    },
    {
      title: "Navigate with the Sidebar",
      description: "The sidebar on the left shows all your pages. Click 'Home' to see your dashboard with stats, widgets, and quick access. Click any page to open it.",
      position: "center",
      action: "Next"
    },
    {
      title: "Quick Search (⌘K / Ctrl+K)",
      description: "Press Cmd/Ctrl + K anytime to quickly search across all your pages, tasks, and habits. Navigate directly to any item instantly - no need to click around!",
      position: "center",
      action: "Next"
    },
    {
      title: "Create Tasks & Habits",
      description: "• Tasks: Track one-time items with due dates\n• Habits: Track daily activities with streak counters\n• Convert tasks to habits anytime\n• Everything saves automatically",
      position: "center",
      action: "Next"
    },
    {
      title: "Multiple Views",
      description: "Switch between List, Board, Table, Calendar, and Dashboard views using the view buttons. Each view shows your data in a different way for better organization.",
      position: "center",
      action: "Next"
    },
    {
      title: "Add Content with Blocks",
      description: "On any page, click 'Add block' to add tasks, notes, or calendar events. You can have multiple blocks per page to organize different types of content.",
      position: "center",
      action: "Next"
    },
    {
      title: "You're All Set!",
      description: "Start by creating your first page or adding a task. Need help? Click the '?' button in the bottom-right corner anytime to see this tutorial again.",
      position: "center",
      action: "Get Started!"
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
      <div className="onboarding-overlay" onClick={handleSkip} />
      <div className={`onboarding-tooltip onboarding-${current.position}`}>
        <div className="tooltip-header">
          <div className="tooltip-progress">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentStep ? "active" : index < currentStep ? "completed" : ""}`}
              />
            ))}
          </div>
          <button className="tooltip-close" onClick={handleSkip} aria-label="Skip tutorial">
            {Icons.close}
          </button>
        </div>
        <div className="tooltip-content">
          <h3 className="tooltip-title">{current.title}</h3>
          <p className="tooltip-description" style={{ whiteSpace: 'pre-line' }}>{current.description}</p>
        </div>
        <div className="tooltip-footer">
          <button className="tooltip-skip" onClick={handleSkip}>
            Skip
          </button>
          <button className="tooltip-next" onClick={handleNext}>
            {current.action || (isLast ? "Get Started" : "Next")}
          </button>
        </div>
      </div>
    </>
  );
}

