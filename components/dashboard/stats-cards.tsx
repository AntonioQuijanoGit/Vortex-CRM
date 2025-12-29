"use client";

import { useState, useEffect, memo, useMemo } from "react";
import { useCRMStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GitBranch, DollarSign, TrendingUp } from "lucide-react";

function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export const DashboardStats = memo(function DashboardStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const contacts = useCRMStore((state) => state.contacts);
  const deals = useCRMStore((state) => state.deals);
  const settings = useCRMStore((state) => state.settings);
  const getDashboardStats = useCRMStore((state) => state.getDashboardStats);

  useEffect(() => {
    setMounted(true);
    // Simulate loading state on mount
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Memoize stats calculation - only calculate after mount
  const stats = useMemo(() => {
    if (!mounted) {
      return {
        totalContacts: 0,
        activeDeals: 0,
        monthlyRevenue: 0,
        winRate: 0,
        contactsChange: 0,
        dealsChange: 0,
        revenueChange: 0,
        winRateChange: 0,
      };
    }
    return getDashboardStats();
  }, [getDashboardStats, contacts.length, deals.length, mounted]);
  
  // Memoize currency formatter
  const formatCurrency = useMemo(() => {
    return (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: settings.currency,
        minimumFractionDigits: 0,
      }).format(value);
    };
  }, [settings.currency]);

  const statCards = useMemo(() => [
    {
      title: "Total Contacts",
      value: stats.totalContacts.toLocaleString(),
      change: stats.contactsChange,
      icon: Users,
      description: "All contacts",
    },
    {
      title: "Active Deals",
      value: stats.activeDeals.toString(),
      change: stats.dealsChange,
      icon: GitBranch,
      description: "In pipeline",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      change: stats.revenueChange,
      icon: DollarSign,
      description: "This month",
    },
    {
      title: "Win Rate",
      value: `${stats.winRate.toFixed(1)}%`,
      change: stats.winRateChange,
      icon: TrendingUp,
      description: "Success rate",
    },
  ], [stats, formatCurrency]);

  if (isLoading || !mounted) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;

        return (
          <Card 
            key={stat.title} 
            className="hover-lift animate-fade-in transition-smooth"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    {stat.title}
                  </p>
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold truncate">{stat.value}</p>
                  <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isPositive ? "↑" : "↓"} {Math.abs(stat.change).toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-primary/10 p-2 sm:p-3 transition-smooth hover:bg-primary/20 flex-shrink-0">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});
