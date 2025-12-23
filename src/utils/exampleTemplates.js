import { safeGetItem, safeSetItem } from './storage';

/**
 * Helper function to generate a unique ID
 */
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

/**
 * Apply example template to create a page with todos
 * @param {Object} example - Example object with title, items, etc.
 * @param {Function} addPage - Function to add a new page
 * @param {Function} onNavigate - Function to navigate to the created page
 * @returns {Object} - Created page object
 */
export function applyExampleTemplate(example, addPage, onNavigate) {
  if (!example || !example.items || example.items.length === 0) {
    throw new Error('Invalid example template');
  }

  try {
    // Create the page
    const newPage = addPage(example.title, null, 'page');
    
    if (!newPage || !newPage.id) {
      throw new Error('Failed to create page');
    }

    // Wait a bit for the page to be saved, then add todos
    setTimeout(() => {
      const pageId = newPage.id;
      const storageKey = `todos-${pageId}`;
      
      // Get existing todos (should be empty for new page)
      const existingTodos = safeGetItem(storageKey, []);
      
      // Create todos from example items
      const newTodos = example.items.map(item => ({
        id: generateId(),
        title: item.title,
        type: item.type || 'task',
        completed: false,
        createdAt: new Date().toISOString(),
        status: 'todo',
        priority: null,
        tags: [],
        dueDate: item.dueDate || null,
        // Habit-specific fields
        ...(item.type === 'habit' && {
          streak: 0,
          completedDates: [],
          bestStreak: 0,
        }),
      }));
      
      // Combine existing with new todos
      const allTodos = [...existingTodos, ...newTodos];
      
      // Save to localStorage
      safeSetItem(storageKey, allTodos);
      
      // Navigate to the new page after todos are added
      // Don't reload - React will update automatically when state changes
      if (onNavigate) {
        setTimeout(() => {
          onNavigate(pageId);
        }, 100);
      }
    }, 50);

    return newPage;
  } catch (error) {
    console.error('Error applying example template:', error);
    throw error;
  }
}

