import React, { useState, useEffect } from "react";
import { Icons } from "../../../utils/icons";
import "./Onboarding.css";

export default function Onboarding({ onComplete, forceShow = false }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
    } else {
      const hasSeenTutorial = localStorage.getItem("has-seen-tutorial");
      if (!hasSeenTutorial) {
        setIsVisible(true);
      }
    }
  }, [forceShow]);

  // Reduced to 3 essential steps for better UX
  const steps = [
    {
      title: "Welcome! 👋",
      description: "This is your productivity workspace. Create pages, add tasks, and track habits—all in one place. Everything saves automatically.",
      position: "center"
    },
    {
      title: "Quick Actions",
      description: "Press Cmd/Ctrl + K to search, Cmd/Ctrl + N to create a page, or use the sidebar to navigate. Click the '?' button anytime for help.",
      position: "center"
    },
    {
      title: "Get Started",
      description: "Create your first page or task to begin. Use the dashboard to see your progress and quick access to everything.",
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
    localStorage.setItem("has-seen-tutorial", "true");
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

