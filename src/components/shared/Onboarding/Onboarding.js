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
      description: "Your personal productivity hub. Everything is organized into clear sections: Home, Tasks, Habits, Pages, Analytics, and Tools. Everything saves automatically.",
      position: "center",
      action: "Let's get started!"
    },
    {
      title: "Navigation is Simple",
      description: "Use the sidebar to navigate:\n\n🏠 Home - Your dashboard with overview\n✓ Tasks - Manage all your tasks\n↻ Habits - Track daily habits\n📄 Pages - Your content pages\n📊 Analytics - View your progress\n🛠️ Tools - Utilities and settings",
      position: "center",
      action: "Got it!"
    },
    {
      title: "Start with Home",
      description: "The Home section shows:\n• Your key stats\n• Today's focus (tasks for today)\n• Quick actions to create content\n• Recent activity\n\nThis is your starting point every day!",
      position: "center",
      action: "Next"
    },
    {
      title: "Tasks Section",
      description: "Click 'Tasks' in the sidebar to:\n• See all your tasks in one place\n• Filter by today, upcoming, or completed\n• Switch between List, Board, Table, or Calendar views\n• Create and manage tasks easily",
      position: "center",
      action: "Next"
    },
    {
      title: "Habits Section",
      description: "Click 'Habits' to:\n• View all your active habits\n• See streak counters\n• Track daily progress\n• Build consistent routines",
      position: "center",
      action: "Next"
    },
    {
      title: "Quick Search (⌘K / Ctrl+K)",
      description: "Press Cmd/Ctrl + K anytime to quickly search across all your pages, tasks, and habits. Navigate directly to any item instantly!",
      position: "center",
      action: "Next"
    },
    {
      title: "You're All Set!",
      description: "Start by clicking 'Tasks' or 'Habits' in the sidebar, or create your first page. Need help? Click the '?' button anytime to see this tutorial again.",
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

