/**
 * Validation utilities for inputs and data
 */

export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 2000;

export function validateTitle(title) {
  if (!title || typeof title !== "string") {
    return { valid: false, error: "Title is required" };
  }
  
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Title cannot be empty" };
  }
  
  if (trimmed.length > MAX_TITLE_LENGTH) {
    return { valid: false, error: `Title must be ${MAX_TITLE_LENGTH} characters or less` };
  }
  
  return { valid: true, error: null };
}

export function validateDescription(description) {
  if (!description || typeof description !== "string") {
    return { valid: true, error: null }; // Description is optional
  }
  
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return { valid: false, error: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less` };
  }
  
  return { valid: true, error: null };
}

export function validateDate(dateString) {
  if (!dateString) {
    return { valid: true, error: null }; // Date is optional
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { valid: false, error: "Invalid date format" };
  }
  
  return { valid: true, error: null };
}

export function validateTime(timeString) {
  if (!timeString) {
    return { valid: true, error: null }; // Time is optional
  }
  
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(timeString)) {
    return { valid: false, error: "Time must be in HH:MM format" };
  }
  
  return { valid: true, error: null };
}

export function validateDueDate(dueDate) {
  if (!dueDate) {
    return { valid: true, error: null }; // Due date is optional
  }
  
  const date = new Date(dueDate);
  if (isNaN(date.getTime())) {
    return { valid: false, error: "Invalid due date format" };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  // Allow dates from today onwards (no past dates)
  if (date < today) {
    return { valid: false, error: "Due date cannot be in the past" };
  }
  
  return { valid: true, error: null };
}
















