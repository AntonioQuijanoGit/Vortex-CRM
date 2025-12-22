import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { validateTitle } from "../utils/validation";
import { STORAGE_KEYS } from "../constants";

/**
 * Validates event structure
 */
function validateEventStructure(event) {
  return (
    event &&
    typeof event === 'object' &&
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.date === 'string'
  );
}

/**
 * Validates events array
 */
function validateEventsArray(events) {
  if (!Array.isArray(events)) return false;
  return events.every(validateEventStructure);
}

/**
 * Custom hook for managing calendar events
 * @param {string} pageId - Optional page ID to store events per page
 */
export function useEvents(pageId = null) {
  const storageKey = STORAGE_KEYS.EVENTS(pageId);
  
  // Use the generic useLocalStorage hook with validation
  const [events, setEvents] = useLocalStorage(storageKey, [], validateEventsArray);

  // Helper function to sort events by date/time
  const sortEvents = useCallback((eventsList) => {
    return [...eventsList].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || "00:00"}`);
      const dateB = new Date(`${b.date} ${b.time || "00:00"}`);
      return dateA - dateB;
    });
  }, []);

  const addEvent = useCallback((event) => {
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
    
    setEvents((prev) => sortEvents([...prev, newEvent]));
    return newEvent.id;
  }, [setEvents, sortEvents]);

  const updateEvent = useCallback((id, updates) => {
    // Validate title if it's being updated
    if (updates.title !== undefined) {
      const validation = validateTitle(updates.title);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      updates.title = updates.title.trim();
    }

    setEvents((prev) => {
      const updated = prev.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      );
      return sortEvents(updated);
    });
  }, [setEvents, sortEvents]);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, [setEvents]);

  const getEventsForDate = useCallback((dateString) => {
    return events.filter((event) => event.date === dateString);
  }, [events]);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
  };
}


