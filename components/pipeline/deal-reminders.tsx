"use client";

import { useEffect, useState, useMemo } from "react";
import { useCRMStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, Calendar } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export function DealReminders() {
  const deals = useCRMStore((state) => state.deals);
  const getDealsWithReminders = useCRMStore((state) => state.getDealsWithReminders);
  const updateDeal = useCRMStore((state) => state.updateDeal);
  const getContact = useCRMStore((state) => state.getContact);

  const reminders = useMemo(() => {
    const dealsWithReminders = getDealsWithReminders();
    return dealsWithReminders
      .map((deal) => {
        const contact = getContact(deal.contactId);
        return {
          deal,
          contact,
          reminderDate: new Date(deal.reminderDate!),
        };
      })
      .sort((a, b) => a.reminderDate.getTime() - b.reminderDate.getTime());
  }, [deals, getDealsWithReminders, getContact]);

  const dismissReminder = (dealId: string) => {
    updateDeal(dealId, { reminderDate: undefined });
    toast.success("Reminder dismissed");
  };

  if (reminders.length === 0) {
    return null;
  }

  return (
    <Card className="border-yellow-500/50 bg-yellow-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg">Upcoming Reminders</CardTitle>
          </div>
          <Badge variant="secondary">{reminders.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.slice(0, 5).map(({ deal, contact, reminderDate }) => (
          <div
            key={deal.id}
            className="flex items-start justify-between rounded-lg border border-border bg-card p-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{deal.title}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {contact?.name || "Unknown contact"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(reminderDate, "MMM dd, yyyy 'at' HH:mm")} •{" "}
                {formatDistanceToNow(reminderDate, { addSuffix: true })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => dismissReminder(deal.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {reminders.length > 5 && (
          <p className="text-xs text-center text-muted-foreground">
            +{reminders.length - 5} more reminders
          </p>
        )}
      </CardContent>
    </Card>
  );
}




