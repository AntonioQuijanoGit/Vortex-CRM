"use client";

import { useMemo, memo, useState, useEffect } from "react";
import { useCRMStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, XCircle, PlusCircle, ArrowRight, FileText, Edit } from "lucide-react";

export const ActivityFeed = memo(function ActivityFeed() {
  const [mounted, setMounted] = useState(false);
  const activities = useCRMStore((state) => state.getRecentActivities(10));
  const contacts = useCRMStore((state) => state.contacts);
  const deals = useCRMStore((state) => state.deals);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Memoize activity descriptions
  const activityItems = useMemo(() => {
    return activities.map((activity) => {
      const contact = activity.contactId
        ? contacts.find((c) => c.id === activity.contactId)
        : null;
      const deal = activity.dealId
        ? deals.find((d) => d.id === activity.dealId)
        : null;

      let description: string;
      switch (activity.type) {
        case "contact_created":
          description = `${contact?.name || "A contact"} was added`;
          break;
        case "deal_created":
          description = `Deal "${deal?.title || "Untitled"}" was created`;
          break;
        case "deal_moved":
          description = `Deal "${deal?.title || "Untitled"}" status was updated`;
          break;
        case "deal_won":
          description = `Deal "${deal?.title || "Untitled"}" was won! 🎉`;
          break;
        case "deal_lost":
          description = `Deal "${deal?.title || "Untitled"}" was lost`;
          break;
        case "note_added":
          description = "A note was added";
          break;
        case "contact_updated":
          description = `${contact?.name || "Contact"} information was updated`;
          break;
        default:
          description = activity.description;
      }

      return { ...activity, contact, description };
    });
  }, [activities, contacts, deals]);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-3 w-1/2 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityItems.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No activity yet
            </p>
          ) : (
            activityItems.map((item, index) => {
              // Get icon component based on activity type
              const getActivityIcon = () => {
                const iconClass = "h-4 w-4";
                switch (item.type) {
                  case "deal_won":
                    return <CheckCircle2 className={iconClass} />;
                  case "deal_lost":
                    return <XCircle className={iconClass} />;
                  case "deal_created":
                    return <PlusCircle className={iconClass} />;
                  case "deal_moved":
                    return <ArrowRight className={iconClass} />;
                  case "contact_created":
                    return <PlusCircle className={iconClass} />;
                  case "contact_updated":
                    return <Edit className={iconClass} />;
                  case "note_added":
                    return <FileText className={iconClass} />;
                  default:
                    return <div className="h-2 w-2 rounded-full bg-muted-foreground" />;
                }
              };

              const getIconColor = () => {
                switch (item.type) {
                  case "deal_won":
                    return "text-green-500 bg-green-500/10";
                  case "deal_lost":
                    return "text-red-500 bg-red-500/10";
                  case "deal_created":
                  case "contact_created":
                    return "text-blue-500 bg-blue-500/10";
                  case "deal_moved":
                    return "text-orange-500 bg-orange-500/10";
                  case "contact_updated":
                    return "text-purple-500 bg-purple-500/10";
                  case "note_added":
                    return "text-cyan-500 bg-cyan-500/10";
                  default:
                    return "text-muted-foreground bg-muted";
                }
              };

              return (
                <div 
                  key={item.id} 
                  className="flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getIconColor()}`}>
                    {getActivityIcon()}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
});


