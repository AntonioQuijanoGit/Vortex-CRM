"use client";

import { useCRMStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Activity } from "@/lib/types";
import { 
  UserPlus, 
  GitBranch, 
  MoveRight, 
  Trophy, 
  X, 
  FileText,
  Edit
} from "lucide-react";

interface EnhancedTimelineProps {
  contactId?: string;
  dealId?: string;
  limit?: number;
}

const activityIcons = {
  contact_created: UserPlus,
  deal_created: GitBranch,
  deal_moved: MoveRight,
  deal_won: Trophy,
  deal_lost: X,
  note_added: FileText,
  contact_updated: Edit,
};

const activityColors = {
  contact_created: "bg-blue-500",
  deal_created: "bg-green-500",
  deal_moved: "bg-yellow-500",
  deal_won: "bg-emerald-500",
  deal_lost: "bg-red-500",
  note_added: "bg-purple-500",
  contact_updated: "bg-indigo-500",
};

export function EnhancedTimeline({ contactId, dealId, limit }: EnhancedTimelineProps) {
  const activities = useCRMStore((state) => {
    if (contactId) {
      const contactActivities = state.getActivitiesByContact(contactId);
      return limit ? contactActivities.slice(0, limit) : contactActivities;
    }
    if (dealId) {
      const dealActivities = state.getActivitiesByDeal(dealId);
      return limit ? dealActivities.slice(0, limit) : dealActivities;
    }
    return [];
  });

  const contacts = useCRMStore((state) => state.contacts);
  const deals = useCRMStore((state) => state.deals);

  const groupByDate = (activities: Activity[]) => {
    const groups: Record<string, Activity[]> = {};
    activities.forEach((activity) => {
      const date = format(new Date(activity.createdAt), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(activity);
    });
    return groups;
  };

  const grouped = groupByDate(activities);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, dayActivities]) => (
        <div key={date} className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-muted-foreground">
              {format(new Date(date), "EEEE, MMMM dd, yyyy")}
            </h4>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-4">
            {dayActivities.map((activity) => {
              const Icon = activityIcons[activity.type] || FileText;
              const color = activityColors[activity.type] || "bg-gray-500";
              const contact = activity.contactId
                ? contacts.find((c) => c.id === activity.contactId)
                : null;
              const deal = activity.dealId
                ? deals.find((d) => d.id === activity.dealId)
                : null;

              return (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full p-2 ${color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="w-px h-full bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-4 space-y-2">
                      <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-medium">{activity.description}</p>
                          {(contact || deal) && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {contact?.name}
                              {deal && ` • ${deal.title}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.createdAt), "h:mm a")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No activities yet
        </p>
      )}
    </div>
  );
}

