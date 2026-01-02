"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useExtendedStore } from "@/lib/store-extended";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { EventFormDialog } from "@/components/calendar/event-form-dialog";
import { shallow } from "zustand/shallow";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Use shallow comparison to avoid unnecessary re-renders
  const { events, loadExtendedData } = useExtendedStore(
    (state) => ({
      events: state.events,
      loadExtendedData: state.loadExtendedData,
    }),
    shallow
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadExtendedData();
    }
  }, []); // Only run once on mount

  // Memoize month calculations
  const { monthStart, monthEnd, daysInMonth, today } = useMemo(() => ({
    monthStart: startOfMonth(currentDate),
    monthEnd: endOfMonth(currentDate),
    daysInMonth: eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) }),
    today: new Date(),
  }), [currentDate]);

  // Pre-calculate events by date for better performance
  const eventsByDate = useMemo(() => {
    const map = new Map<string, Array<typeof events[0]>>();
    events.forEach((event) => {
      const eventDate = new Date(event.startDate);
      const dateKey = format(eventDate, "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(event);
    });
    return map;
  }, [events]);

  // Function to get events for a specific date (uses pre-calculated map)
  const getEventsForDate = useCallback((date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return eventsByDate.get(dateKey) || [];
  }, [eventsByDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your events and meetings
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {format(currentDate, "MMMM yyyy")}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-2 text-center font-semibold text-sm">
                      {day}
                    </div>
                  ))}
                  {daysInMonth.map((day) => {
                    const dayEvents = getEventsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, today);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => handleDateClick(day)}
                        className={`min-h-[80px] p-2 border rounded-lg text-left hover:bg-accent transition-colors ${
                          !isCurrentMonth ? "opacity-30" : ""
                        } ${isToday ? "border-primary bg-primary/5" : ""}`}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>
                          {format(day, "d")}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs p-1 bg-primary/10 text-primary rounded truncate"
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <EventFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultDate={selectedDate || undefined}
        onSuccess={() => {
          setIsDialogOpen(false);
          setSelectedDate(null);
        }}
      />
    </div>
  );
}
