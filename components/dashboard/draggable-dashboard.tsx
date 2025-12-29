"use client";

import { useState } from "react";
import { DashboardStats } from "./stats-cards";
import { RevenueChart } from "./revenue-chart";
import { ActivityFeed } from "./activity-feed";
import { QuickActions } from "./quick-actions";

const widgetTypes = ["stats", "revenue", "activity", "actions"] as const;
type WidgetType = typeof widgetTypes[number];

interface Widget {
  id: string;
  type: WidgetType;
}

export function DraggableDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "1", type: "stats" },
    { id: "2", type: "revenue" },
    { id: "3", type: "activity" },
    { id: "4", type: "actions" },
  ]);

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "stats":
        return <DashboardStats key={widget.id} />;
      case "revenue":
        return <RevenueChart key={widget.id} />;
      case "activity":
        return <ActivityFeed key={widget.id} />;
      case "actions":
        return <QuickActions key={widget.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {widgets.map((widget) => renderWidget(widget))}
    </div>
  );
}





