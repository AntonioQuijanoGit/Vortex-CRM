"use client";

import { useEffect, useState, useMemo } from "react";
import { useExtendedStore } from "@/lib/store-extended";
import { shallow } from "zustand/shallow";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";

export default function TasksPage() {
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use shallow comparison to avoid unnecessary re-renders
  const { tasks, completeTask, deleteTask, loadExtendedData } = useExtendedStore(
    (state) => ({
      tasks: state.tasks,
      completeTask: state.completeTask,
      deleteTask: state.deleteTask,
      loadExtendedData: state.loadExtendedData,
    }),
    shallow
  );

  // Memoize pending tasks calculation
  const pendingTasks = useMemo(() => {
    return tasks.filter((task) => !task.completed);
  }, [tasks]);

  // Memoize completed tasks
  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.completed);
  }, [tasks]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && tasks.length === 0) {
      // Only load if data is not already loaded
      loadExtendedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-4xl">
              <div className="animate-pulse">Loading tasks...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Tasks</h1>
                <p className="text-muted-foreground mt-1">
                  {pendingTasks.length} pending tasks
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pendingTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No pending tasks
                    </p>
                  ) : (
                    pendingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => completeTask(task.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{task.title}</p>
                            <Badge variant={getPriorityColor(task.priority) as any}>
                              {task.priority}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                          {task.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                        >
                          ×
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completed Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {completedTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No completed tasks
                    </p>
                  ) : (
                    completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-3 border rounded-lg opacity-60"
                      >
                        <Checkbox checked={true} disabled />
                        <div className="flex-1">
                          <p className="font-medium line-through">{task.title}</p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <TaskFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
