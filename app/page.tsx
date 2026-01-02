"use client";

import { useState, useEffect } from "react";
import { useInitialize } from "@/hooks/use-initialize";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { NotificationManager } from "@/components/shared/notifications";
import { useReminderNotifications } from "@/hooks/use-reminder-notifications";
import { WelcomeScreen } from "@/components/shared/welcome-screen";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useInitialize();
  useReminderNotifications();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Overview of your CRM activity
                </p>
              </div>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
                <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <WelcomeScreen />
      <NotificationManager />
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Overview of your CRM activity
                </p>
              </div>

              <DashboardStats />

              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                <RevenueChart />
                <ActivityFeed />
              </div>

              <QuickActions />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

