import React, { useState } from "react";
import { Icons } from "../../../utils/icons";
import { safeGetItem } from "../../../utils/storage";
import { logger } from "../../../utils/logger";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./DateDetailsModal.css";

export default function DateDetailsModal({ 
  date, 
  items, 
  onNavigate, 
  onClose, 
  onAddEvent, 
  onEditEvent,
  onDeleteEvent,
  getPage 
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get page info for todos (similar to Dashboard)
  const getTodoPageInfo = (todo) => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined' && localStorage) {
      // Search in localStorage for which page contains this todo
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("todos-")) {
          const pageId = key.replace("todos-", "");
          const pageTodos = safeGetItem(key, []);
          if (pageTodos.some(t => t.id === todo.id)) {
            const allPages = safeGetItem("notion-pages", []);
            let page = getPage ? getPage(pageId) : null;
            if (!page) {
              page = allPages.find(p => p.id === pageId);
            }
            return { pageId, pageTitle: page ? page.title : "Unknown Page" };
          }
        }
      }
    }
    // Check for todos stored in the old format (without page association)
    const oldFormatTodos = safeGetItem("todos", []);
    if (oldFormatTodos.some(t => t.id === todo.id)) {
      return { pageId: null, pageTitle: "Orphaned" };
    }
    return { pageId: null, pageTitle: null };
  };

  return (
    <div className="event-form-overlay" onClick={onClose}>
      <div className="event-form date-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="event-form-header">
          <h4>{formatDate(date)}</h4>
          <button className="event-form-close" onClick={onClose}>
            {Icons.close}
          </button>
        </div>

        <div className="date-details-content">
          {items.tasks.length > 0 && (
            <div className="date-details-section">
              <h5 className="date-details-section-title">
                {Icons.task} Tasks ({items.tasks.length})
              </h5>
              <div className="date-details-list">
                {items.tasks.map((task) => {
                  const pageInfo = getTodoPageInfo(task);
                  // Allow navigation if we have a pageId, even if title is "Unknown Page"
                  const isClickable = pageInfo.pageId && pageInfo.pageTitle !== "Orphaned";
                  return (
                    <div
                      key={task.id}
                      className={`date-details-item ${isClickable ? "clickable" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isClickable && pageInfo.pageId) {
                          try {
                            onNavigate(pageInfo.pageId);
                            onClose();
                          } catch (error) {
                            logger.error("Error navigating to page:", error);
                          }
                        }
                      }}
                      title={isClickable ? (pageInfo.pageTitle !== "Unknown Page" ? `Go to ${pageInfo.pageTitle}` : `Go to page (ID: ${pageInfo.pageId})`) : "Item without associated page"}
                    >
                      <span className={`date-details-icon ${task.completed ? "completed" : ""}`}>
                        {task.completed ? Icons.check : Icons.task}
                      </span>
                      <span className="date-details-text">
                        <strong>{task.title}</strong>
                        {pageInfo.pageTitle && pageInfo.pageId && (
                          <span className="date-details-meta"> • {pageInfo.pageTitle !== "Unknown Page" ? pageInfo.pageTitle : "Page"}</span>
                        )}
                      </span>
                      {isClickable && (
                        <span className="date-details-arrow">{Icons.arrowRight}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {items.habits.length > 0 && (
            <div className="date-details-section">
              <h5 className="date-details-section-title">
                {Icons.habit} Habits Completed ({items.habits.length})
              </h5>
              <div className="date-details-list">
                {items.habits.map((habit) => {
                  const pageInfo = getTodoPageInfo(habit);
                  // Allow navigation if we have a pageId, even if title is "Unknown Page"
                  const isClickable = pageInfo.pageId && pageInfo.pageTitle !== "Orphaned";
                  return (
                    <div
                      key={habit.id}
                      className={`date-details-item ${isClickable ? "clickable" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isClickable && pageInfo.pageId) {
                          try {
                            onNavigate(pageInfo.pageId);
                            onClose();
                          } catch (error) {
                            logger.error("Error navigating to page:", error);
                          }
                        }
                      }}
                      title={isClickable ? (pageInfo.pageTitle !== "Unknown Page" ? `Go to ${pageInfo.pageTitle}` : `Go to page (ID: ${pageInfo.pageId})`) : "Item without associated page"}
                    >
                      <span className="date-details-icon completed">
                        {Icons.check}
                      </span>
                      <span className="date-details-text">
                        <strong>{habit.title}</strong>
                        {habit.streak > 0 && (
                          <span className="date-details-meta"> • Streak: {habit.streak}</span>
                        )}
                        {pageInfo.pageTitle && pageInfo.pageId && (
                          <span className="date-details-meta"> • {pageInfo.pageTitle !== "Unknown Page" ? pageInfo.pageTitle : "Page"}</span>
                        )}
                      </span>
                      {isClickable && (
                        <span className="date-details-arrow">{Icons.arrowRight}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {items.events.length > 0 && (
            <div className="date-details-section">
              <h5 className="date-details-section-title">
                {Icons.calendar} Events ({items.events.length})
              </h5>
              <div className="date-details-list">
                {items.events.map((event) => (
                  <div
                    key={event.id}
                    className="date-details-item event-item"
                  >
                    <div 
                      className="date-details-item-content clickable"
                      onClick={() => onEditEvent(event)}
                    >
                      <span
                        className="date-details-icon"
                        style={{ color: event.color }}
                      >
                        {Icons.calendar}
                      </span>
                      <span className="date-details-text">
                        <strong>{event.title}</strong>
                        {event.time && (
                          <span className="date-details-meta"> • {event.time}</span>
                        )}
                      </span>
                      <span className="date-details-arrow">{Icons.arrowRight}</span>
                    </div>
                    {onDeleteEvent && (
                      <button
                        className="date-details-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEventToDelete(event);
                          setShowDeleteConfirm(true);
                        }}
                        aria-label={`Delete event: ${event.title}`}
                        title={`Delete event: ${event.title}`}
                      >
                        {Icons.delete}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!items.hasItems && (
            <div className="date-details-empty">
              <p>No items scheduled for this day</p>
            </div>
          )}
        </div>

        <div className="event-form-actions">
          <button type="button" onClick={onAddEvent}>
            {Icons.add} Add Event
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {showDeleteConfirm && eventToDelete && onDeleteEvent && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Event"
          message={`Are you sure you want to delete the event "${eventToDelete.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={() => {
            onDeleteEvent(eventToDelete.id);
            setShowDeleteConfirm(false);
            setEventToDelete(null);
          }}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setEventToDelete(null);
          }}
        />
      )}
    </div>
  );
}

