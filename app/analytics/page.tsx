"use client";

import { useEffect, useState, useMemo } from "react";
import { useCRMStore } from "@/lib/store";
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
  const initialize = useCRMStore((state) => state.initialize);
  const deals = useCRMStore((state) => state.deals);
  const contacts = useCRMStore((state) => state.contacts);
  const settings = useCRMStore((state) => state.settings);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("lastYear");
  const [comparePeriod, setComparePeriod] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getDateRange = (period: TimePeriod) => {
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
          end: now,
        };
    }
  };

  const getPreviousPeriodRange = (period: TimePeriod) => {
    const current = getDateRange(period);
    const diff = current.end.getTime() - current.start.getTime();
    return {
      start: new Date(current.start.getTime() - diff),
      end: current.start,
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const dateRange = getDateRange(timePeriod);
  const previousRange = comparePeriod ? getPreviousPeriodRange(timePeriod) : null;

  // Calculate number of months to show based on period
  const getMonthsCount = () => {
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
  };

  const monthsCount = getMonthsCount();

  // Revenue over time
  const revenueData = useMemo(() => {
    const data = Array.from({ length: monthsCount }, (_, i) => {
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

      const revenue = deals
        .filter(
          (deal) =>
            deal.status === "won" &&
            new Date(deal.closeDate) >= monthStart &&
            new Date(deal.closeDate) <= monthEnd
        )
        .reduce((sum, deal) => sum + deal.value, 0);

      let previousRevenue = 0;
      if (comparePeriod && previousRange) {
        const prevMonthStart = new Date(monthStart.getTime() - (dateRange.end.getTime() - dateRange.start.getTime()));
        const prevMonthEnd = new Date(monthEnd.getTime() - (dateRange.end.getTime() - dateRange.start.getTime()));
        previousRevenue = deals
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
    return data;
  }, [deals, timePeriod, monthsCount, dateRange, comparePeriod, previousRange]);

  // Stats filtered by time period
  const periodDeals = deals.filter((d) => {
    const dealDate = new Date(d.closeDate);
    return dealDate >= dateRange.start && dealDate <= dateRange.end;
  });

  const previousPeriodDeals = comparePeriod && previousRange
    ? deals.filter((d) => {
        const dealDate = new Date(d.closeDate);
        return dealDate >= previousRange.start && dealDate <= previousRange.end;
      })
    : [];

  const totalRevenue = periodDeals
    .filter((d) => d.status === "won")
    .reduce((sum, d) => sum + d.value, 0);
  
  const previousRevenue = previousPeriodDeals
    .filter((d) => d.status === "won")
    .reduce((sum, d) => sum + d.value, 0);

  const revenueChange = previousRevenue > 0
    ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
    : 0;

  const wonDealsInPeriod = periodDeals.filter((d) => d.status === "won").length;
  const lostDealsInPeriod = periodDeals.filter((d) => d.status === "lost").length;

  // Deals won vs lost (filtered by period)
  const pieData = [
    { name: "Won", value: wonDealsInPeriod },
    { name: "Lost", value: lostDealsInPeriod },
  ];

  // Top contacts by value (filtered by period deals)
  const contactValues = new Map<string, number>();
  periodDeals
    .filter((d) => d.status === "won")
    .forEach((deal) => {
      const contact = contacts.find((c) => c.id === deal.contactId);
      if (contact) {
        contactValues.set(
          contact.id,
          (contactValues.get(contact.id) || 0) + deal.value
        );
      }
    });

  const topContacts = Array.from(contactValues.entries())
    .map(([contactId, value]) => {
      const contact = contacts.find((c) => c.id === contactId);
      return { name: contact?.name || "Unknown", value };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  
  const averageDealSize =
    wonDealsInPeriod > 0
      ? totalRevenue / wonDealsInPeriod
      : 0;
  const conversionRate =
    wonDealsInPeriod + lostDealsInPeriod > 0
      ? (wonDealsInPeriod / (wonDealsInPeriod + lostDealsInPeriod)) * 100
      : 0;
  
  // Additional metrics (filtered by period)
  const totalDeals = periodDeals.length;
  const activeDeals = periodDeals.filter((d) => 
    !["won", "lost"].includes(d.status)
  ).length;
  const avgSalesCycle = (() => {
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
  })();
  
  // Deal status distribution (filtered by period)
  const statusDistribution = [
    { name: "Lead", value: periodDeals.filter((d) => d.status === "lead").length },
    { name: "Contacted", value: periodDeals.filter((d) => d.status === "contacted").length },
    { name: "Proposal", value: periodDeals.filter((d) => d.status === "proposal").length },
    { name: "Negotiation", value: periodDeals.filter((d) => d.status === "negotiation").length },
    { name: "Won", value: wonDealsInPeriod },
    { name: "Lost", value: lostDealsInPeriod },
  ];

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
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                  {comparePeriod && previousRevenue > 0 && (
                    <p className={`text-sm mt-1 ${revenueChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {revenueChange >= 0 ? "↑" : "↓"} {Math.abs(revenueChange).toFixed(1)}% vs previous period
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
                    {formatCurrency(averageDealSize)}
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
                    {conversionRate.toFixed(1)}%
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
                  <div className="text-2xl font-bold">{activeDeals}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((activeDeals / totalDeals) * 100).toFixed(0)}% of total
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
                  <div className="text-2xl font-bold">{totalDeals}</div>
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
                    <BarChart data={topContacts}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="name"
                        className="text-xs"
                        stroke="hsl(var(--muted-foreground))"
                        angle={-45}
                        textAnchor="end"
                        height={100}
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
                    <BarChart data={statusDistribution}>
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

