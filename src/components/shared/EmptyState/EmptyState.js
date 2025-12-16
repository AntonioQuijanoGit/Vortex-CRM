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
  onSecondaryAction 
}) {
  return (
    <div className="emptyState" role="status" aria-live="polite">
      {icon && <div className="emptyStateIcon" aria-hidden="true">{renderIcon(icon, 48)}</div>}
      <p className="emptyStateText">{message}</p>
      <p className="emptyStateHint">{hint}</p>
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
            >
              <span className="actionIcon">{renderIcon(Icons.add, 16)}</span>
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && (
            <button 
              className="emptyStateAction secondary"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

