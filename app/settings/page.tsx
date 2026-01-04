"use client";
import { useEffect } from "react";
import { useInitialize } from "@/hooks/use-initialize";
import { useCRMStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { TagManager } from "@/components/shared/tag-manager";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { toast } from "sonner";
import { useState } from "react";

export default function SettingsPage() {
  useInitialize();
  const settings = useCRMStore((state) => state.settings);
  const updateSettings = useCRMStore((state) => state.updateSettings);
  const exportData = useCRMStore((state) => state.exportData);
  const importData = useCRMStore((state) => state.importData);
  const clearAllData = useCRMStore((state) => state.clearAllData);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crm-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = event.target?.result as string;
            importData(data);
            toast.success("Data imported successfully");
          } catch (error) {
            toast.error("Failed to import data");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      clearAllData();
      toast.success("All data cleared");
    }
  };
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your CRM preferences
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Tags Management</CardTitle>
                <CardDescription>
                  Create and manage custom tags for contacts and deals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setTagManagerOpen(true)}>
                  Manage Tags
                </Button>
                <TagManager open={tagManagerOpen} onOpenChange={setTagManagerOpen} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between dark and light theme
                    </p>
                  </div>
                  <Switch 
                    checked={settings.theme === "dark"} 
                    onCheckedChange={(checked) => {
                      updateSettings({ theme: checked ? "dark" : "light" });
                      const root = document.documentElement;
                      root.classList.remove("light", "dark");
                      root.classList.add(checked ? "dark" : "light");
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Configure default settings for your CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) =>
                      updateSettings({ currency: e.target.value })
                    }
                    placeholder="USD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Input
                    id="dateFormat"
                    value={settings.dateFormat}
                    onChange={(e) =>
                      updateSettings({ dateFormat: e.target.value })
                    }
                    placeholder="MMM dd, yyyy"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable notifications (mock)
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      updateSettings({ notifications: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Export, import, or reset your CRM data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleExport}>
                    Export Data
                  </Button>
                  <Button variant="outline" onClick={handleImport}>
                    Import Data
                  </Button>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Button variant="destructive" onClick={handleClearData}>
                      Clear All Data
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete all contacts, deals, activities, and notes. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
