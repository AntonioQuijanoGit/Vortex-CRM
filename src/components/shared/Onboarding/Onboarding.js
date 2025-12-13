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
      description: "This is your personal productivity hub. Organize tasks, track habits, and manage your content all in one place.",
      position: "center"
    },
    {
      title: "Navigate with the Sidebar",
      description: "Use the sidebar on the left to switch between pages. Click 'Home' to see your dashboard with stats and quick access to your pages.",
      position: "center"
    },
    {
      title: "Quick Search",
      description: "Press Cmd/Ctrl + K to quickly search across all your pages, tasks, and habits. Navigate directly to any item instantly.",
      position: "center"
    },
    {
      title: "Create Tasks & Habits",
      description: "Add tasks to track one-time items. Convert tasks to habits to track daily activities with streak counters. Everything saves automatically.",
      position: "center"
    },
    {
      title: "Multiple Views",
      description: "Switch between List, Board, Table, Calendar, and Dashboard views to see your data in different ways. Each view offers unique insights.",
      position: "center"
    },
    {
      title: "Add Content with Blocks",
      description: "On any page, click 'Add block' to add tasks, notes, or calendar events. Organize your content with multiple blocks per page.",
      position: "center"
    },
    {
      title: "You're All Set!",
      description: "Start by creating a task, adding a block, or exploring your pages. Click the '?' button anytime to see this tutorial again.",
      position: "center"
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
          <p className="tooltip-description">{current.description}</p>
        </div>
        <div className="tooltip-footer">
          <button className="tooltip-skip" onClick={handleSkip}>
            Skip
          </button>
          <button className="tooltip-next" onClick={handleNext}>
            {isLast ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
}

