import React, { useState, useEffect } from "react";
import { Icons, renderIcon } from "../../../utils/icons";
import { ACHIEVEMENTS, getAchievementProgress } from "../../../utils/achievements";
import { safeGetItem, safeSetItem } from "../../../utils/storage";
import "./Achievements.css";

export default function Achievements({ stats, onClose }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    return safeGetItem("achievements-unlocked", []);
  });
  
  const [newAchievements, setNewAchievements] = useState([]);
  const [showUnlocked, setShowUnlocked] = useState(false);

  useEffect(() => {
    // Check for new achievements
    const allAchievements = Object.values(ACHIEVEMENTS);
    const newlyUnlocked = allAchievements.filter(
      (achievement) =>
        !unlockedAchievements.includes(achievement.id) &&
        achievement.condition(stats)
    );

    if (newlyUnlocked.length > 0) {
      const newIds = newlyUnlocked.map((a) => a.id);
      const updated = [...unlockedAchievements, ...newIds];
      setUnlockedAchievements(updated);
      safeSetItem("achievements-unlocked", updated);
      setNewAchievements(newlyUnlocked);
      setShowUnlocked(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowUnlocked(false);
        setNewAchievements([]);
      }, 5000);
    }
  }, [stats, unlockedAchievements]);

  const allAchievements = Object.values(ACHIEVEMENTS);
  const lockedAchievements = allAchievements.filter(
    (a) => !unlockedAchievements.includes(a.id)
  );
  const unlocked = allAchievements.filter((a) =>
    unlockedAchievements.includes(a.id)
  );

  return (
    <>
      {/* New Achievement Notification */}
      {showUnlocked && newAchievements.length > 0 && (
        <div className="achievement-notification">
          {newAchievements.map((achievement) => (
            <div key={achievement.id} className="achievement-notification-card">
              <div className="achievement-notification-icon">{renderIcon(achievement.icon, 32)}</div>
              <div className="achievement-notification-content">
                <div className="achievement-notification-title">
                  Achievement Unlocked!
                </div>
                <div className="achievement-notification-name">{achievement.title}</div>
                <div className="achievement-notification-description">
                  {achievement.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements Modal */}
      <div className="achievements-overlay" onClick={onClose}>
        <div
          className="achievements-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="achievements-header">
            <h2 className="achievements-title">
              <span className="achievements-title-icon">{renderIcon(Icons.streak, 24)}</span>
              Achievements
            </h2>
            <button
              className="achievements-close"
              onClick={onClose}
              aria-label="Close"
            >
              {renderIcon(Icons.close, 18)}
            </button>
          </div>

          <div className="achievements-stats">
            <div className="achievement-stat">
              <span className="achievement-stat-value">
                {unlocked.length}/{allAchievements.length}
              </span>
              <span className="achievement-stat-label">Unlocked</span>
            </div>
            <div className="achievement-stat">
              <span className="achievement-stat-value">
                {Math.round((unlocked.length / allAchievements.length) * 100)}%
              </span>
              <span className="achievement-stat-label">Complete</span>
            </div>
          </div>

          <div className="achievements-content">
            <div className="achievements-section">
              <h3 className="achievements-section-title">Unlocked</h3>
              <div className="achievements-grid">
                {unlocked.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="achievement-card unlocked"
                  >
                    <div className="achievement-icon">{renderIcon(achievement.icon, 32)}</div>
                    <div className="achievement-info">
                      <div className="achievement-name">{achievement.title}</div>
                      <div className="achievement-description">
                        {achievement.description}
                      </div>
                    </div>
                    <div className="achievement-badge">✓</div>
                  </div>
                ))}
              </div>
            </div>

            {lockedAchievements.length > 0 && (
              <div className="achievements-section">
                <h3 className="achievements-section-title">Locked</h3>
                <div className="achievements-grid">
                  {lockedAchievements.map((achievement) => {
                    const progress = getAchievementProgress(achievement, stats);
                    const progressPercent = Math.min(
                      (progress.current / progress.target) * 100,
                      100
                    );

                    return (
                      <div
                        key={achievement.id}
                        className="achievement-card locked"
                      >
                        <div className="achievement-icon locked-icon">
                          {renderIcon(achievement.icon, 32)}
                        </div>
                        <div className="achievement-info">
                          <div className="achievement-name locked-name">
                            ???
                          </div>
                          <div className="achievement-progress">
                            <div className="achievement-progress-bar">
                              <div
                                className="achievement-progress-fill"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <div className="achievement-progress-text">
                              {progress.current}/{progress.target}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

