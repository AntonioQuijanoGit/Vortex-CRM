"use client";

import { useEffect } from "react";
import { useCRMStore } from "@/lib/store";

export function useReminderNotifications() {
  const deals = useCRMStore((state) => state.deals);
  const getDealsWithReminders = useCRMStore((state) => state.getDealsWithReminders);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    try {
      // Request notification permission safely
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().catch((error) => {
          console.warn("Failed to request notification permission:", error);
        });
      }

      const checkReminders = () => {
        try {
          if (!("Notification" in window) || Notification.permission !== "granted") {
            return;
          }

          const dealsWithReminders = getDealsWithReminders();
          const now = new Date();

          dealsWithReminders.forEach((deal) => {
            try {
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
            } catch (error) {
              // Silently fail for individual reminder
              console.warn("Error processing reminder:", error);
            }
          });
        } catch (error) {
          // Silently fail - notifications are not critical
          console.warn("Error checking reminders:", error);
        }
      };

      // Check every minute
      const interval = setInterval(checkReminders, 60 * 1000);
      checkReminders(); // Check immediately

      return () => clearInterval(interval);
    } catch (error) {
      // Silently fail - notifications are not critical
      console.warn("Error setting up reminder notifications:", error);
    }
  }, [deals, getDealsWithReminders]);
}









