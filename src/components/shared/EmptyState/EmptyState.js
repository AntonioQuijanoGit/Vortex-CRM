export default function EmptyState({ message, hint, showExamples }) {
  return (
    <div className="emptyState" role="status" aria-live="polite">
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
    </div>
  );
}

