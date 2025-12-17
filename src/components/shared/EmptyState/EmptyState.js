import { Icons, renderIcon } from "../../../utils/icons";
import "./EmptyState.css";

export default function EmptyState({ 
  message, 
  hint, 
  showExamples, 
  icon, 
  actionLabel, 
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  detailedHint,
  tips
}) {
  return (
    <div className="emptyState" role="status" aria-live="polite">
      {icon && <div className="emptyStateIcon" aria-hidden="true">{renderIcon(icon, 48)}</div>}
      <h3 className="emptyStateText">{message}</h3>
      {hint && <p className="emptyStateHint">{hint}</p>}
      {detailedHint && <p className="emptyStateDetailedHint">{detailedHint}</p>}
      {tips && tips.length > 0 && (
        <div className="emptyStateTips">
          <p className="tipsTitle">💡 Quick tips:</p>
          <ul className="tipsList">
            {tips.map((tip, index) => (
              <li key={index} className="tipItem">{tip}</li>
            ))}
          </ul>
        </div>
      )}
      {showExamples && (
        <div className="emptyStateExamples">
          <p className="examplesTitle">Examples:</p>
          <div className="examplesList">
            <div className="exampleItem">
              <strong>Task:</strong> "Review project proposal"
            </div>
            <div className="exampleItem">
              <strong>Habit:</strong> "Drink 8 glasses of water"
            </div>
          </div>
        </div>
      )}
      {(actionLabel || secondaryActionLabel) && (
        <div className="emptyStateActions">
          {actionLabel && (
            <button 
              className="emptyStateAction primary"
              onClick={onAction}
              aria-label={actionLabel}
            >
              <span className="actionIcon">{renderIcon(Icons.add, 16)}</span>
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && (
            <button 
              className="emptyStateAction secondary"
              onClick={onSecondaryAction}
              aria-label={secondaryActionLabel}
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

