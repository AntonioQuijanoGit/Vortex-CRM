import React, { useState, useEffect } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import {
  getWeeklyGoal,
  setWeeklyGoal,
  getMonthlyGoal,
  setMonthlyGoal,
  getWeeklyProgress,
  getMonthlyProgress,
} from "../../../utils/goals";
import "./Goals.css";

export default function Goals({ todos = [] }) {
  const [showWeeklyEditor, setShowWeeklyEditor] = useState(false);
  const [showMonthlyEditor, setShowMonthlyEditor] = useState(false);
  const [weeklyTarget, setWeeklyTarget] = useState("");
  const [monthlyTarget, setMonthlyTarget] = useState("");

  const weeklyGoal = getWeeklyGoal();
  const monthlyGoal = getMonthlyGoal();
  const weeklyProgress = getWeeklyProgress(todos);
  const monthlyProgress = getMonthlyProgress(todos);

  useEffect(() => {
    if (weeklyGoal) {
      setWeeklyTarget(weeklyGoal.target.toString());
    }
    if (monthlyGoal) {
      setMonthlyTarget(monthlyGoal.target.toString());
    }
  }, []);

  const handleSaveWeeklyGoal = () => {
    const target = parseInt(weeklyTarget);
    if (target > 0) {
      setWeeklyGoal({ target, createdAt: new Date().toISOString() });
      setShowWeeklyEditor(false);
    }
  };

  const handleSaveMonthlyGoal = () => {
    const target = parseInt(monthlyTarget);
    if (target > 0) {
      setMonthlyGoal({ target, createdAt: new Date().toISOString() });
      setShowMonthlyEditor(false);
    }
  };

  return (
    <div className="goals-widget">
      <div className="goals-header">
        <span className="goals-icon">{renderIcon(Icons.target, 20)}</span>
        <h3 className="goals-title">Goals</h3>
      </div>

      <div className="goals-content">
        {/* Weekly Goal */}
        <div className="goal-section">
          <div className="goal-header">
            <span className="goal-label">Weekly Goal</span>
            {!showWeeklyEditor && (
              <button
                className="goal-edit-button"
                onClick={() => setShowWeeklyEditor(true)}
                title="Edit weekly goal"
              >
                {renderIcon(Icons.edit, 16)}
              </button>
            )}
          </div>

          {showWeeklyEditor ? (
            <div className="goal-editor">
              <input
                type="number"
                className="goal-input"
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(e.target.value)}
                placeholder="Tasks to complete"
                min="1"
                autoFocus
              />
              <div className="goal-editor-actions">
                <button
                  className="goal-save-button"
                  onClick={handleSaveWeeklyGoal}
                >
                  Save
                </button>
                <button
                  className="goal-cancel-button"
                  onClick={() => {
                    setShowWeeklyEditor(false);
                    setWeeklyTarget(weeklyGoal?.target.toString() || "");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : weeklyProgress ? (
            <div className="goal-progress">
              <div className="goal-progress-bar">
                <div
                  className="goal-progress-fill"
                  style={{ width: `${weeklyProgress.percentage}%` }}
                />
              </div>
              <div className="goal-progress-text">
                {weeklyProgress.current} / {weeklyProgress.target} tasks
              </div>
            </div>
          ) : (
            <div className="goal-empty">
              <p>No weekly goal set</p>
              <button
                className="goal-set-button"
                onClick={() => setShowWeeklyEditor(true)}
              >
                Set Goal
              </button>
            </div>
          )}
        </div>

        {/* Monthly Goal */}
        <div className="goal-section">
          <div className="goal-header">
            <span className="goal-label">Monthly Goal</span>
            {!showMonthlyEditor && (
              <button
                className="goal-edit-button"
                onClick={() => setShowMonthlyEditor(true)}
                title="Edit monthly goal"
              >
                {renderIcon(Icons.edit, 16)}
              </button>
            )}
          </div>

          {showMonthlyEditor ? (
            <div className="goal-editor">
              <input
                type="number"
                className="goal-input"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                placeholder="Tasks to complete"
                min="1"
                autoFocus
              />
              <div className="goal-editor-actions">
                <button
                  className="goal-save-button"
                  onClick={handleSaveMonthlyGoal}
                >
                  Save
                </button>
                <button
                  className="goal-cancel-button"
                  onClick={() => {
                    setShowMonthlyEditor(false);
                    setMonthlyTarget(monthlyGoal?.target.toString() || "");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : monthlyProgress ? (
            <div className="goal-progress">
              <div className="goal-progress-bar">
                <div
                  className="goal-progress-fill"
                  style={{ width: `${monthlyProgress.percentage}%` }}
                />
              </div>
              <div className="goal-progress-text">
                {monthlyProgress.current} / {monthlyProgress.target} tasks
              </div>
            </div>
          ) : (
            <div className="goal-empty">
              <p>No monthly goal set</p>
              <button
                className="goal-set-button"
                onClick={() => setShowMonthlyEditor(true)}
              >
                Set Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

