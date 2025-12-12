import React from "react";
import "./ProgressCircle.css";

export default function ProgressCircle({ percentage, size = 80, strokeWidth = 6, color = "var(--color-success)", label, showPercentage = true }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-circle-container" style={{ width: size, height: size }}>
      <svg
        className="progress-circle-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          className="progress-circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-panel)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          className="progress-circle-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="progress-circle-content">
        {showPercentage && (
          <div className="progress-circle-percentage" style={{ color }}>
            {Math.round(percentage)}%
          </div>
        )}
        {label && (
          <div className="progress-circle-label">{label}</div>
        )}
      </div>
    </div>
  );
}

