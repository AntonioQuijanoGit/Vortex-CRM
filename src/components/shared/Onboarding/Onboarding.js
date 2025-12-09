import React, { useState, useEffect } from "react";
import "./Onboarding.css";

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("has-seen-tutorial");
    if (!hasSeenTutorial) {
      setIsVisible(true);
    }
  }, []);

  const steps = [
    {
      title: "Welcome to Your Workspace",
      description: "This is your personal productivity hub. Organize tasks, track habits, watch movies, and take notes all in one place.",
      position: "center"
    },
    {
      title: "Navigate with the Sidebar",
      description: "Use the sidebar on the left to switch between pages. Click 'Home' to see your dashboard with all your stats.",
      position: "center"
    },
    {
      title: "Create New Pages",
      description: "Click the '+' button or 'New Page' at the bottom of the sidebar to create pages for tasks, notes, movies, or anything else.",
      position: "center"
    },
    {
      title: "Add Content with Blocks",
      description: "On any page, click 'Add block' to add text, movies, notes, or tasks. You can add multiple blocks to organize your content.",
      position: "center"
    },
    {
      title: "You're All Set!",
      description: "Start by creating a task, adding a block, or exploring your pages. Everything is saved automatically.",
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
            ×
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

