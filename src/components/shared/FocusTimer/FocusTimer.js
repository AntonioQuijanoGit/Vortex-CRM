import React, { useState, useEffect, useRef } from "react";
import { Icons } from "../../../utils/icons";
import "./FocusTimer.css";

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

export default function FocusTimer({ onStart, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // pomodoro, shortBreak, longBreak
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
    if (onStart) onStart();
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode));
  };

  const handleComplete = () => {
    setIsRunning(false);
    if (mode === "pomodoro") {
      setCompletedPomodoros((prev) => prev + 1);
      // Auto start short break after 4 pomodoros
      if (completedPomodoros + 1 >= 4) {
        setMode("longBreak");
        setTimeLeft(LONG_BREAK);
        setCompletedPomodoros(0);
      } else {
        setMode("shortBreak");
        setTimeLeft(SHORT_BREAK);
      }
    } else {
      setMode("pomodoro");
      setTimeLeft(POMODORO_DURATION);
    }
    if (onComplete) onComplete(mode);
  };

  const handleModeChange = (newMode) => {
    if (isRunning) return;
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode));
  };

  const getDurationForMode = (m) => {
    switch (m) {
      case "shortBreak":
        return SHORT_BREAK;
      case "longBreak":
        return LONG_BREAK;
      default:
        return POMODORO_DURATION;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const percentage = (timeLeft / getDurationForMode(mode)) * 100;

  return (
    <div className="focus-timer">
      <div className="focus-timer-header">
        <span className="focus-timer-icon">{Icons.calendar}</span>
        <h3 className="focus-timer-title">Focus Timer</h3>
      </div>

      <div className="focus-timer-modes">
        <button
          className={`focus-mode-button ${mode === "pomodoro" ? "active" : ""}`}
          onClick={() => handleModeChange("pomodoro")}
          disabled={isRunning}
        >
          Pomodoro
        </button>
        <button
          className={`focus-mode-button ${mode === "shortBreak" ? "active" : ""}`}
          onClick={() => handleModeChange("shortBreak")}
          disabled={isRunning}
        >
          Short Break
        </button>
        <button
          className={`focus-mode-button ${mode === "longBreak" ? "active" : ""}`}
          onClick={() => handleModeChange("longBreak")}
          disabled={isRunning}
        >
          Long Break
        </button>
      </div>

      <div className="focus-timer-display">
        <div className="focus-timer-circle">
          <svg className="focus-timer-svg" viewBox="0 0 100 100">
            <circle
              className="focus-timer-bg"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--color-panel)"
              strokeWidth="4"
            />
            <circle
              className="focus-timer-progress"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="focus-timer-time">{formatTime(timeLeft)}</div>
        </div>
      </div>

      <div className="focus-timer-controls">
        {!isRunning ? (
          <button className="focus-timer-button primary" onClick={handleStart}>
            {Icons.check} Start
          </button>
        ) : (
          <button className="focus-timer-button secondary" onClick={handlePause}>
            Pause
          </button>
        )}
        <button className="focus-timer-button" onClick={handleReset}>
          Reset
        </button>
      </div>

      {mode === "pomodoro" && completedPomodoros > 0 && (
        <div className="focus-timer-stats">
          <span>Completed: {completedPomodoros} pomodoros</span>
        </div>
      )}
    </div>
  );
}

