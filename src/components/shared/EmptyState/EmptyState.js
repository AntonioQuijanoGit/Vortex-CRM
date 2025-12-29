export default function EmptyState({ message, hint, showExamples, icon, actionLabel, onAction }) {
  return (
    <div className="emptyState" role="status" aria-live="polite">
      {icon && <div className="emptyStateIcon" aria-hidden="true">{icon}</div>}
      <h3 className="emptyStateText">{message}</h3>
      {hint && <p className="emptyStateHint">{hint}</p>}
      {onAction && actionLabel && (
        <button 
          className="emptyStateAction"
          onClick={onAction}
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
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
    </div>
  );
}

