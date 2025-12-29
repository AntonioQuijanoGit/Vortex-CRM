import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import "../Block.css";
import "./TimerBlock.css";

/**
 * Timer Block - Pomodoro and custom timer
 */
export default function TimerBlock({ data, onUpdate }) {
  const [minutes, setMinutes] = useState(data?.minutes || 25);
  const [seconds, setSeconds] = useState(data?.seconds || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState(data?.mode || "pomodoro"); // pomodoro, custom
  const intervalRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  const pomodoroPresets = [
    { label: "Pomodoro", minutes: 25 },
    { label: "Short Break", minutes: 5 },
    { label: "Long Break", minutes: 15 },
  ];

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            setMinutes((prev) => {
              if (prev > 0) {
                return prev - 1;
              } else {
                // Timer finished
                setIsRunning(false);
                playNotification();
                return 0;
              }
            });
            return 59;
          }
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
  }, [isRunning, isPaused]);

  // Auto-save
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onUpdate({ minutes, seconds, mode, isRunning, isPaused });
    }, 1000);
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [minutes, seconds, mode, isRunning, isPaused, onUpdate]);

  const playNotification = () => {
    // Play notification sound or show alert
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Timer finished!");
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setMinutes(data?.minutes || 25);
    setSeconds(0);
  };

  const handleReset = () => {
    handleStop();
  };

  const handlePreset = (presetMinutes) => {
    setMinutes(presetMinutes);
    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const totalSeconds = minutes * 60 + seconds;
  const progress = mode === "pomodoro" && data?.minutes
    ? 1 - totalSeconds / (data.minutes * 60)
    : 0;

  return (
    <div className="block timer-block">
      <div className="timer-header">
        <div className="timer-mode-selector">
          <button
            className={mode === "pomodoro" ? "active" : ""}
            onClick={() => setMode("pomodoro")}
          >
            Pomodoro
          </button>
          <button
            className={mode === "custom" ? "active" : ""}
            onClick={() => setMode("custom")}
          >
            Custom
          </button>
        </div>
      </div>

      <div className="timer-content">
        {mode === "pomodoro" && (
          <div className="timer-presets">
            {pomodoroPresets.map((preset) => (
              <button
                key={preset.label}
                className="timer-preset-btn"
                onClick={() => handlePreset(preset.minutes)}
                disabled={isRunning}
              >
                {preset.label} ({preset.minutes}m)
              </button>
            ))}
          </div>
        )}

        {mode === "custom" && (
          <div className="timer-custom-input">
            <input
              type="number"
              min="0"
              max="99"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
              disabled={isRunning}
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              disabled={isRunning}
            />
          </div>
        )}

        <div className="timer-display">
          <div className="timer-circle">
            <svg viewBox="0 0 200 200" className="timer-svg">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="var(--color-stroke)"
                strokeWidth="8"
              />
              {mode === "pomodoro" && (
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress)}`}
                  transform="rotate(-90 100 100)"
                  className="timer-progress"
                />
              )}
            </svg>
            <div className="timer-time">{formatTime(minutes, seconds)}</div>
          </div>
        </div>

        <div className="timer-controls">
          {!isRunning ? (
            <button className="timer-btn timer-btn-primary" onClick={handleStart}>
              <Play size={20} />
              Start
            </button>
          ) : isPaused ? (
            <>
              <button className="timer-btn timer-btn-primary" onClick={handleResume}>
                <Play size={20} />
                Resume
              </button>
              <button className="timer-btn" onClick={handleStop}>
                <Square size={20} />
                Stop
              </button>
            </>
          ) : (
            <>
              <button className="timer-btn" onClick={handlePause}>
                <Pause size={20} />
                Pause
              </button>
              <button className="timer-btn" onClick={handleStop}>
                <Square size={20} />
                Stop
              </button>
            </>
          )}
          <button className="timer-btn" onClick={handleReset}>
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

