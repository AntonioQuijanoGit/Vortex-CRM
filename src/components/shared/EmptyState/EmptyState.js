import { Icons } from "../../../utils/icons";

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
      {icon && <div className="emptyStateIcon" aria-hidden="true">{icon}</div>}
      <p className="emptyStateText">{message}</p>
      <p className="emptyStateHint">{hint}</p>
      {showExamples && (
        <div className="emptyStateExamples">
          <p className="examplesTitle">Ejemplos:</p>
          <div className="examplesList">
            <div className="exampleItem">
              <strong>Tarea:</strong> "Revisar propuesta del proyecto"
            </div>
            <div className="exampleItem">
              <strong>Hábito:</strong> "Beber 8 vasos de agua"
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
              <span className="actionIcon">{Icons.add}</span>
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

