"use client";

import { useEffect } from "react";
import { useCRMStore } from "@/lib/store";

export function useReminderNotifications() {
  const deals = useCRMStore((state) => state.deals);
  const getDealsWithReminders = useCRMStore((state) => state.getDealsWithReminders);

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      if (Notification.permission !== "granted") return;

      const dealsWithReminders = getDealsWithReminders();
      const now = new Date();

      dealsWithReminders.forEach((deal) => {
        if (deal.reminderDate) {
          const reminderDate = new Date(deal.reminderDate);
          const timeDiff = reminderDate.getTime() - now.getTime();
          
          // Notify if reminder is within the next 5 minutes and hasn't been notified
          if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
            const contact = useCRMStore.getState().getContact(deal.contactId);
            new Notification("Deal Reminder", {
              body: `Follow up on "${deal.title}"${contact ? ` with ${contact.name}` : ""}`,
              icon: "/favicon.ico",
              tag: `reminder-${deal.id}`, // Prevent duplicate notifications
            });
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60 * 1000);
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [deals, getDealsWithReminders]);
}




