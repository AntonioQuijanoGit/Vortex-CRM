"use client";

import { useState } from "react";
import { useCRMStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreVertical, Trash2, Tag, ArrowRight } from "lucide-react";
import { DEAL_STATUSES } from "@/lib/constants";
import type { DealStatus } from "@/lib/types";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedDealIds: string[];
  onClearSelection: () => void;
}

export function BulkActions({ selectedDealIds, onClearSelection }: BulkActionsProps) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<DealStatus>("lead");
  const updateDeal = useCRMStore((state) => state.updateDeal);
  const deleteDeals = useCRMStore((state) => state.deleteDeals);
  const deals = useCRMStore((state) => state.deals);

  if (selectedDealIds.length === 0) {
    return null;
  }

  const handleBulkStatusChange = () => {
    selectedDealIds.forEach((dealId) => {
      updateDeal(dealId, { status: newStatus });
    });
    toast.success(`Updated ${selectedDealIds.length} deals`);
    setIsStatusDialogOpen(false);
    onClearSelection();
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedDealIds.length} deals?`)) {
      deleteDeals(selectedDealIds);
      toast.success(`Deleted ${selectedDealIds.length} deals`);
      onClearSelection();
    }
  };

  const selectedDeals = deals.filter((d) => selectedDealIds.includes(d.id));
  const totalValue = selectedDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {selectedDealIds.length} deal{selectedDealIds.length !== 1 ? "s" : ""} selected
          </span>
          <span className="text-sm text-muted-foreground">
            Total value: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(totalValue)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStatusDialogOpen(true)}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Change Status
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsTagDialogOpen(true)}>
                <Tag className="mr-2 h-4 w-4" />
                Add Tags
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleBulkDelete}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Clear
          </Button>
        </div>
      </div>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status for {selectedDealIds.length} Deals</DialogTitle>
            <DialogDescription>
              Select a new status for the selected deals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as DealStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleBulkStatusChange}>
                Update {selectedDealIds.length} Deals
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags to {selectedDealIds.length} Deals</DialogTitle>
            <DialogDescription>
              Manage tags for the selected deals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tag functionality coming soon...
            </p>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}









