import React, { useState } from "react";
import Onboarding from "./Onboarding";
import "./HelpButton.css";

export default function HelpButton() {
  const [showTutorial, setShowTutorial] = useState(false);

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  return (
    <>
      <button
        className="help-button"
        onClick={handleShowTutorial}
        aria-label="Show tutorial"
        title="Show tutorial"
      >
        ?
      </button>
      {showTutorial && <Onboarding onComplete={handleTutorialComplete} />}
    </>
  );
}

