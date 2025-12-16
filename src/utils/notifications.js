/**
 * Browser notifications utility
 */

export function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return Promise.resolve(false);
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission().then((permission) => {
      return permission === 'granted';
    });
  }

  return Promise.resolve(false);
}

export function showNotification(title, options = {}) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }
}

export function scheduleTaskReminder(task, dueDate) {
  if (typeof window === 'undefined') return null;

  const now = new Date().getTime();
  const due = new Date(dueDate).getTime();
  const timeUntilDue = due - now;

  // Only schedule if due date is in the future
  if (timeUntilDue <= 0) return null;

  // Schedule notification 15 minutes before due date
  const reminderTime = timeUntilDue - 15 * 60 * 1000;

  if (reminderTime > 0) {
    return setTimeout(() => {
      showNotification(`Task due soon: ${task.title}`, {
        body: `This task is due in 15 minutes`,
        tag: `task-${task.id}`,
      });
    }, reminderTime);
  }

  return null;
}

export function scheduleHabitReminder(habit) {
  if (typeof window === 'undefined') return null;

  // Schedule for 9 AM if not completed today
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const reminderTime = new Date(today);
  reminderTime.setHours(9, 0, 0, 0);

  // If it's already past 9 AM, schedule for tomorrow
  if (now > reminderTime) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const timeUntilReminder = reminderTime.getTime() - now.getTime();

  return setTimeout(() => {
    showNotification(`Habit reminder: ${habit.title}`, {
      body: "Don't forget to complete your habit today!",
      tag: `habit-${habit.id}`,
    });
  }, timeUntilReminder);
}


