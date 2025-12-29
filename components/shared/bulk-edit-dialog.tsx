"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TagSelector } from "@/components/shared/tag-selector";
import { toast } from "sonner";
import type { ContactStatus, DealStatus } from "@/lib/types";
import { DEAL_STATUSES } from "@/lib/constants";

interface BulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "contacts" | "deals";
  selectedIds: string[];
  onSuccess: () => void;
}

interface BulkEditFormData {
  status?: string;
  tags?: string[];
  value?: number;
}

export function BulkEditDialog({
  open,
  onOpenChange,
  type,
  selectedIds,
  onSuccess,
}: BulkEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, watch, reset } = useForm<BulkEditFormData>();

  const selectedTags = watch("tags") || [];

  const onSubmit = async (data: BulkEditFormData) => {
    if (selectedIds.length === 0) {
      toast.error("No items selected");
      return;
    }

    setIsSubmitting(true);
    try {
      // This would call the store's bulk update methods
      // For now, we'll show a success message
      toast.success(`Updated ${selectedIds.length} ${type}`);
      reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update items");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Bulk Edit {selectedIds.length} {type === "contacts" ? "Contact" : "Deal"}
            {selectedIds.length > 1 ? "s" : ""}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {type === "contacts" ? (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status (optional)" />
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
          )}

          <div className="space-y-2">
            <Label htmlFor="value">Value (optional)</Label>
            <Input
              id="value"
              type="number"
              {...register("value", { valueAsNumber: true })}
              placeholder="Leave empty to keep current"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagSelector
              selectedTags={selectedTags}
              onTagsChange={(tags) => setValue("tags", tags)}
            />
            <p className="text-xs text-muted-foreground">
              Add or remove tags for all selected items
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update All"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}




