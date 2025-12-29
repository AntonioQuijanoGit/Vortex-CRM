"use client";

import { useEffect, useState } from "react";
import { useCRMStore } from "@/lib/store";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export function NotificationManager() {
  const [lastActivityCount, setLastActivityCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const activities = useCRMStore((state) => state.activities);
  const contacts = useCRMStore((state) => state.contacts);
  const deals = useCRMStore((state) => state.deals);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    // Notify on new activities
    if (activities.length > lastActivityCount && lastActivityCount > 0) {
      const newActivities = activities.slice(0, activities.length - lastActivityCount);
      
      newActivities.forEach((activity) => {
        const contact = activity.contactId
          ? contacts.find((c) => c.id === activity.contactId)
          : null;
        const deal = activity.dealId
          ? deals.find((d) => d.id === activity.dealId)
          : null;

        let message = "";
        let icon: React.ReactNode = null;

        switch (activity.type) {
          case "deal_won":
            message = `🎉 Deal "${deal?.title || "Untitled"}" was won!`;
            icon = <CheckCircle2 className="h-4 w-4 text-green-500" />;
            toast.success(message, { icon });
            break;
          case "deal_lost":
            message = `Deal "${deal?.title || "Untitled"}" was lost`;
            icon = <XCircle className="h-4 w-4 text-red-500" />;
            toast.error(message, { icon });
            break;
          case "deal_created":
            message = `New deal "${deal?.title || "Untitled"}" created`;
            icon = <Info className="h-4 w-4 text-blue-500" />;
            toast.info(message, { icon });
            break;
          case "contact_created":
            message = `New contact "${contact?.name || "Unknown"}" added`;
            icon = <Info className="h-4 w-4 text-blue-500" />;
            toast.info(message, { icon });
            break;
        }
      });
    }

    setLastActivityCount(activities.length);
  }, [activities.length, lastActivityCount, contacts, deals, isMounted]);

  return null; // This component doesn't render anything
}

