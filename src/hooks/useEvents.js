import { useState, useEffect } from "react";
import { safeGetItem, safeSetItem } from "../utils/storage";
import { validateTitle } from "../utils/validation";
import { logger } from "../utils/logger";

/**
 * Custom hook for managing calendar events
 * @param {string} pageId - Optional page ID to store events per page
 */
export function useEvents(pageId = null) {
  const storageKey = pageId ? `events-${pageId}` : "events";
  
  const [events, setEvents] = useState(() => {
    return safeGetItem(storageKey, []);
  });

  useEffect(() => {
    try {
      safeSetItem(storageKey, events);
    } catch (error) {
      logger.error("Failed to save events:", error);
    }
  }, [events, storageKey]);

  const addEvent = (event) => {
    const validation = validateTitle(event.title);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const newEvent = {
      id: crypto.randomUUID(),
      title: event.title.trim(),
      date: event.date,
      time: event.time || null,
      description: event.description || "",
      color: event.color || "var(--color-accent)",
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, newEvent].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || "00:00"}`);
      const dateB = new Date(`${b.date} ${b.time || "00:00"}`);
      return dateA - dateB;
    }));
    return newEvent.id;
  };

  const updateEvent = (id, updates) => {
    // Validate title if it's being updated
    if (updates.title !== undefined) {
      const validation = validateTitle(updates.title);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      updates.title = updates.title.trim();
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      ).sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time || "00:00"}`);
        const dateB = new Date(`${b.date} ${b.time || "00:00"}`);
        return dateA - dateB;
      })
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const getEventsForDate = (dateString) => {
    return events.filter((event) => event.date === dateString);
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
  };
}


