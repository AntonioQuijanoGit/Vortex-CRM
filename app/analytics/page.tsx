"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useInitialize } from "@/hooks/use-initialize";
import { useCRMStore } from "@/lib/store";
import { shallow } from "zustand/shallow";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, subMonths } from "date-fns";

const COLORS = ["#10B981", "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6"];
type TimePeriod = "lastMonth" | "lastQuarter" | "lastYear" | "allTime" | "custom";

export default function AnalyticsPage() {
  useInitialize();
  
  // Use combined selector to minimize re-renders
  const { deals, contacts, settings } = useCRMStore((state) => ({
    deals: state.deals,
    contacts: state.contacts,
    settings: state.settings,
  }), shallow);

  const [timePeriod, setTimePeriod] = useState<TimePeriod>("lastYear");
  const [comparePeriod, setComparePeriod] = useState(false);

  // Memoize date range functions
  const getDateRange = useCallback((period: TimePeriod) => {
    const now = new Date();
    switch (period) {
      case "lastMonth":
        return {
          start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          end: new Date(now.getFullYear(), now.getMonth(), 0),
        };
      case "lastQuarter":
        const quarter = Math.floor(now.getMonth() / 3);
        return {
          start: new Date(now.getFullYear(), (quarter - 1) * 3, 1),
          end: new Date(now.getFullYear(), quarter * 3, 0),
        };
      case "lastYear":
        return {
          start: new Date(now.getFullYear() - 1, 0, 1),
          end: new Date(now.getFullYear() - 1, 11, 31),
        };
      case "allTime":
        return {
          start: new Date(2000, 0, 1),
          end: now,
        };
      default:
        return {
          start: new Date(now.getFullYear() - 1, 0, 1),
          end: new Date(now.getFullYear() - 1, 11, 31),
        };
    }
  }, []);

  const getPreviousPeriodRange = useCallback((period: TimePeriod) => {
    const current = getDateRange(period);
    const diff = current.end.getTime() - current.start.getTime();
    return {
      start: new Date(current.start.getTime() - diff),
      end: current.start,
    };
  }, [getDateRange]);

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

  // Memoize date ranges
  const dateRange = useMemo(() => getDateRange(timePeriod), [getDateRange, timePeriod]);
  const previousRange = useMemo(
    () => (comparePeriod ? getPreviousPeriodRange(timePeriod) : null),
    [comparePeriod, getPreviousPeriodRange, timePeriod]
  );

  // Calculate number of months to show based on period
  const monthsCount = useMemo(() => {
    switch (timePeriod) {
      case "lastMonth":
        return 1;
      case "lastQuarter":
        return 3;
      case "lastYear":
        return 12;
      case "allTime":
        return Math.min(24, Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      default:
        return 12;
    }
  }, [timePeriod, dateRange]);

  // Create contacts map for efficient lookup
  const contactsMap = useMemo(() => {
    return new Map(contacts.map(c => [c.id, c]));
  }, [contacts]);

  // Memoize filtered deals by period - only recalculate when deals or dateRange changes
  const periodDeals = useMemo(() => {
    return deals.filter((d) => {
      const dealDate = new Date(d.closeDate);
      return dealDate >= dateRange.start && dealDate <= dateRange.end;
    });
  }, [deals, dateRange]);

  const previousPeriodDeals = useMemo(() => {
    if (!comparePeriod || !previousRange) return [];
    return deals.filter((d) => {
      const dealDate = new Date(d.closeDate);
      return dealDate >= previousRange.start && dealDate <= previousRange.end;
    });
  }, [deals, comparePeriod, previousRange]);

  // Memoize all stats calculations
  const stats = useMemo(() => {
    const wonDealsInPeriod = periodDeals.filter((d) => d.status === "won");
    const lostDealsInPeriod = periodDeals.filter((d) => d.status === "lost");
    
    const totalRevenue = wonDealsInPeriod.reduce((sum, d) => sum + d.value, 0);
    const previousRevenue = previousPeriodDeals
      .filter((d) => d.status === "won")
      .reduce((sum, d) => sum + d.value, 0);
    
    const revenueChange = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const wonCount = wonDealsInPeriod.length;
    const lostCount = lostDealsInPeriod.length;
    const averageDealSize = wonCount > 0 ? totalRevenue / wonCount : 0;
    const conversionRate = wonCount + lostCount > 0
      ? (wonCount / (wonCount + lostCount)) * 100
      : 0;

    const totalDeals = periodDeals.length;
    const activeDeals = periodDeals.filter((d) => 
      !["won", "lost"].includes(d.status)
    ).length;

    // Calculate contact values efficiently using map
    const contactValues = new Map<string, number>();
    periodDeals.forEach((deal) => {
      const currentValue = contactValues.get(deal.contactId) || 0;
      contactValues.set(deal.contactId, currentValue + deal.value);
    });

    const topContacts = Array.from(contactValues.entries())
      .map(([contactId, value]) => {
        const contact = contactsMap.get(contactId);
        return { name: contact?.name || "Unknown", value };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Deal status distribution
    const statusCounts = {
      lead: 0,
      contacted: 0,
      proposal: 0,
      negotiation: 0,
    };
    periodDeals.forEach((deal) => {
      if (deal.status in statusCounts) {
        statusCounts[deal.status as keyof typeof statusCounts]++;
      }
    });

    const statusDistribution = [
      { name: "Lead", value: statusCounts.lead },
      { name: "Contacted", value: statusCounts.contacted },
      { name: "Proposal", value: statusCounts.proposal },
      { name: "Negotiation", value: statusCounts.negotiation },
    ];

    return {
      totalRevenue,
      previousRevenue,
      revenueChange,
      wonDealsInPeriod: wonCount,
      lostDealsInPeriod: lostCount,
      averageDealSize,
      conversionRate,
      totalDeals,
      activeDeals,
      topContacts,
      statusDistribution,
    };
  }, [periodDeals, previousPeriodDeals, contactsMap]);

  // Revenue over time - memoized
  const revenueData = useMemo(() => {
    return Array.from({ length: monthsCount }, (_, i) => {
      let date: Date;
      if (timePeriod === "allTime") {
        const totalDays = (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24);
        const daysPerPoint = totalDays / monthsCount;
        date = new Date(dateRange.start.getTime() + daysPerPoint * i * (1000 * 60 * 60 * 24));
      } else {
        date = subMonths(dateRange.end, monthsCount - 1 - i);
      }
      
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const revenue = periodDeals
        .filter(
          (deal) =>
            deal.status === "won" &&
            new Date(deal.closeDate) >= monthStart &&
            new Date(deal.closeDate) <= monthEnd
        )
        .reduce((sum, deal) => sum + deal.value, 0);
      
      let previousRevenue = 0;
      if (comparePeriod && previousRange) {
        const diff = dateRange.end.getTime() - dateRange.start.getTime();
        const prevMonthStart = new Date(monthStart.getTime() - diff);
        const prevMonthEnd = new Date(monthEnd.getTime() - diff);
        previousRevenue = previousPeriodDeals
          .filter(
            (deal) =>
              deal.status === "won" &&
              new Date(deal.closeDate) >= prevMonthStart &&
              new Date(deal.closeDate) <= prevMonthEnd
          )
          .reduce((sum, deal) => sum + deal.value, 0);
      }
      
      return {
        month: format(date, timePeriod === "allTime" ? "MMM yyyy" : "MMM"),
        revenue,
        previousRevenue,
      };
    });
  }, [periodDeals, previousPeriodDeals, monthsCount, timePeriod, dateRange, comparePeriod, previousRange]);

  // Avg sales cycle - memoized
  const avgSalesCycle = useMemo(() => {
    const closedDeals = deals.filter((d) => 
      ["won", "lost"].includes(d.status)
    );
    if (closedDeals.length === 0) return 0;
    const totalDays = closedDeals.reduce((sum, deal) => {
      const created = new Date(deal.createdAt);
      const closed = new Date(deal.closeDate);
      return sum + Math.max(0, (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    return Math.round(totalDays / closedDeals.length);
  }, [deals]);

  // Pie data
  const pieData = useMemo(() => [
    { name: "Won", value: stats.wonDealsInPeriod },
    { name: "Lost", value: stats.lostDealsInPeriod },
  ], [stats.wonDealsInPeriod, stats.lostDealsInPeriod]);

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Insights and performance metrics
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Label htmlFor="compare" className="text-sm">Compare Period</Label>
                  <Switch
                    id="compare"
                    checked={comparePeriod}
                    onCheckedChange={setComparePeriod}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="period" className="text-sm">Time Period</Label>
                  <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
                    <SelectTrigger id="period" className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                      <SelectItem value="lastYear">Last Year</SelectItem>
                      <SelectItem value="allTime">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  {comparePeriod && stats.previousRevenue > 0 && (
                    <p className={`text-sm mt-1 ${stats.revenueChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {stats.revenueChange >= 0 ? "↑" : "↓"} {Math.abs(stats.revenueChange).toFixed(1)}% vs previous period
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Deal Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.averageDealSize)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.conversionRate.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contacts.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Deals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeDeals}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalDeals > 0 ? ((stats.activeDeals / stats.totalDeals) * 100).toFixed(0) : 0}% of total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg Sales Cycle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgSalesCycle} days</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average time to close
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Deals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDeals}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All time deals
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
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
                        name="Current"
                      />
                      {comparePeriod && (
                        <Line
                          type="monotone"
                          dataKey="previousRevenue"
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: "hsl(var(--muted-foreground))", r: 4 }}
                          name="Previous"
                        />
                      )}
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Deals Won vs Lost</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Top 10 Contacts by Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.topContacts}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
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
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Deal Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.statusDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="name"
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}