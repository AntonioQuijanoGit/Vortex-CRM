"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { useCRMStore } from "@/lib/store";
import { shallow } from "zustand/shallow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths } from "date-fns";

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}

export const RevenueChart = memo(function RevenueChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [chartHeight, setChartHeight] = useState(300);
  
  // Use combined selector
  const { deals, settings } = useCRMStore((state) => ({
    deals: state.deals,
    settings: state.settings,
  }), shallow);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    
    // Set responsive chart height
    const updateHeight = () => {
      if (typeof window !== 'undefined') {
        setChartHeight(window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 280 : 300);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Memoize revenue calculation
  const months = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const revenue = deals
        .filter(
          (deal) =>
            deal.status === "won" &&
            new Date(deal.closeDate) >= monthStart &&
            new Date(deal.closeDate) <= monthEnd
        )
        .reduce((sum, deal) => sum + deal.value, 0);

      return {
        month: format(date, "MMM"),
        revenue,
      };
    });
  }, [deals]);

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

  if (isLoading || !mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-lift animate-fade-in">
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={months}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

