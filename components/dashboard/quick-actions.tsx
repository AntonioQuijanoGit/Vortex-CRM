"use client";

import { useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GitBranch, BarChart3 } from "lucide-react";

export const QuickActions = memo(function QuickActions() {
  const router = useRouter();

  const actions = useMemo(() => [
    {
      title: "Add Contact",
      description: "Create a new contact in your CRM",
      icon: Users,
      onClick: () => router.push("/contacts?new=true"),
    },
    {
      title: "Add Deal",
      description: "Create a new deal in the pipeline",
      icon: GitBranch,
      onClick: () => router.push("/pipeline?new=true"),
    },
    {
      title: "View Reports",
      description: "Analyze your sales performance",
      icon: BarChart3,
      onClick: () => router.push("/analytics"),
    },
  ], [router]);

  return (
    <Card className="hover-lift animate-fade-in">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto flex-col items-start p-4 transition-smooth hover:bg-accent hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={action.onClick}
              >
                <Icon className="mb-2 h-5 w-5 transition-smooth group-hover:scale-110" />
                <span className="font-semibold">{action.title}</span>
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});


