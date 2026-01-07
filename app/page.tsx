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
              {/* Visual Header */}
              <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-primary/5 p-6 sm:p-8 md:p-10">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate">
                            Dashboard
                          </h1>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm md:text-base pl-0 sm:pl-[52px]">
                        Overview of your CRM activity and performance metrics
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:pl-4">
                      <div className="hidden sm:flex items-center gap-2 rounded-lg border bg-card/50 px-4 py-2 backdrop-blur-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium">Live Data</span>
                      </div>
                    </div>
                  </div>
                </div>
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

