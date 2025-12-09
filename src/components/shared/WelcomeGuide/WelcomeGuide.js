import React from "react";
import { Icons } from "../../../utils/icons";
import "./WelcomeGuide.css";

export default function WelcomeGuide({ onGetStarted }) {
  return (
    <div className="welcome-guide">
      <div className="guide-header">
        <h2>Welcome to Your Workspace</h2>
        <p>Your all-in-one productivity hub</p>
      </div>

      <div className="guide-features">
        <div className="feature-item">
          <span className="feature-icon">{Icons.page}</span>
          <div>
            <h3>Tasks & Habits</h3>
            <p>Manage tasks and build daily habits with streak tracking</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">{Icons.page}</span>
          <div>
            <h3>Movie Tracker</h3>
            <p>Keep track of movies you want to watch</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">{Icons.page}</span>
          <div>
            <h3>Notes</h3>
            <p>Write and organize your thoughts</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">{Icons.page}</span>
          <div>
            <h3>Dashboard</h3>
            <p>See all your stats and activity in one place</p>
          </div>
        </div>
      </div>

      <div className="guide-actions">
        <button className="guide-button primary" onClick={onGetStarted}>
          Get Started
        </button>
        <p className="guide-hint">
          Click the <strong>?</strong> button anytime for help
        </p>
      </div>
    </div>
  );
}
