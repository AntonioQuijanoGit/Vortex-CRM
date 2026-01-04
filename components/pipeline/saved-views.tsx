"use client";

import { useState } from "react";
import { useExtendedStore } from "@/lib/store-extended";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Bookmark, Plus, Trash2, Save } from "lucide-react";
import type { DealFilters } from "@/lib/types";
import { toast } from "sonner";

interface SavedViewsProps {
  filters: DealFilters;
  onFiltersChange: (filters: DealFilters) => void;
}

export function SavedViews({ filters, onFiltersChange }: SavedViewsProps) {
  const savedViews = useExtendedStore((state) => state.savedViews);
  const addSavedView = useExtendedStore((state) => state.addSavedView);
  const deleteSavedView = useExtendedStore((state) => state.deleteSavedView);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewName, setViewName] = useState("");

  const dealViews = savedViews.filter((view) => view.type === "deals");

  const handleSaveView = () => {
    if (!viewName.trim()) {
      toast.error("Please enter a view name");
      return;
    }

    addSavedView({
      name: viewName.trim(),
      type: "deals",
      filters,
    });

    setViewName("");
    setIsDialogOpen(false);
    toast.success("View saved successfully");
  };

  const handleApplyView = (view: typeof savedViews[0]) => {
    onFiltersChange(view.filters as DealFilters);
    toast.success(`Applied view: ${view.name}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Bookmark className="mr-2 h-4 w-4" />
            Saved Views
            {dealViews.length > 0 && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                {dealViews.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Saved Views</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dealViews.length === 0 ? (
            <DropdownMenuItem disabled>
              <span className="text-sm text-muted-foreground">
                No saved views yet
              </span>
            </DropdownMenuItem>
          ) : (
            dealViews.map((view) => (
              <DropdownMenuItem
                key={view.id}
                className="flex items-center justify-between"
                onSelect={() => handleApplyView(view)}
              >
                <span>{view.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete view "${view.name}"?`)) {
                      deleteSavedView(view.id);
                      toast.success("View deleted");
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Save Current View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save View</DialogTitle>
            <DialogDescription>
              Save your current view settings for quick access
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">View Name</label>
              <Input
                placeholder="e.g., Hot Leads, This Month"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveView();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveView}>
                <Save className="mr-2 h-4 w-4" />
                Save View
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}









