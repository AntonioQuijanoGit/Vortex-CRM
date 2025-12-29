"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCRMStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dealSchema, type DealFormData } from "@/lib/validations";
import { DEAL_STATUSES } from "@/lib/constants";
import { TagSelector } from "@/components/shared/tag-selector";
import { toast } from "sonner";

interface DealFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealId?: string;
  onSuccess?: () => void;
}

export function DealFormDialog({
  open,
  onOpenChange,
  dealId,
  onSuccess,
}: DealFormDialogProps) {
  const addDeal = useCRMStore((state) => state.addDeal);
  const updateDeal = useCRMStore((state) => state.updateDeal);
  const getDeal = useCRMStore((state) => state.getDeal);
  const contacts = useCRMStore((state) => state.contacts);

  const deal = dealId ? getDeal(dealId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: "",
      contactId: "",
      value: 0,
      status: "lead",
      probability: 50,
      closeDate: "",
      reminderDate: "",
      notes: "",
      tags: [],
    },
  });

  const selectedTags = watch("tags");
  const selectedContactId = watch("contactId");

  useEffect(() => {
    if (deal) {
      const reminderDateValue = deal.reminderDate 
        ? new Date(deal.reminderDate).toISOString().slice(0, 16)
        : "";
      
      reset({
        title: deal.title,
        contactId: deal.contactId,
        value: deal.value,
        status: deal.status,
        probability: deal.probability,
        closeDate: deal.closeDate.split("T")[0],
        reminderDate: reminderDateValue,
        notes: deal.notes,
        tags: deal.tags,
      });
    } else {
      reset({
        title: "",
        contactId: "",
        value: 0,
        status: "lead",
        probability: 50,
        closeDate: "",
        reminderDate: "",
        notes: "",
        tags: [],
      });
    }
  }, [deal, reset, open]);

  const onSubmit = async (data: DealFormData) => {
    try {
      if (deal) {
        updateDeal(deal.id, {
          ...data,
          closeDate: new Date(data.closeDate).toISOString(),
          reminderDate: data.reminderDate ? new Date(data.reminderDate).toISOString() : undefined,
        });
        toast.success("Deal updated successfully");
      } else {
        addDeal({
          ...data,
          closeDate: new Date(data.closeDate).toISOString(),
          reminderDate: data.reminderDate ? new Date(data.reminderDate).toISOString() : undefined,
          notes: data.notes || "",
        });
        toast.success("Deal created successfully");
      }
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save deal");
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{deal ? "Edit Deal" : "Add Deal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactId">
                Contact <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedContactId}
                onValueChange={(value) => setValue("contactId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} ({contact.company})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.contactId && (
                <p className="text-sm text-destructive">{errors.contactId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                Value <span className="text-destructive">*</span>
              </Label>
              <Input
                id="value"
                type="number"
                {...register("value", { valueAsNumber: true })}
              />
              {errors.value && (
                <p className="text-sm text-destructive">{errors.value.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as any)}
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

            <div className="space-y-2">
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min={0}
                max={100}
                {...register("probability", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closeDate">
                Close Date <span className="text-destructive">*</span>
              </Label>
              <Input id="closeDate" type="date" {...register("closeDate")} />
              {errors.closeDate && (
                <p className="text-sm text-destructive">{errors.closeDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderDate">Reminder Date</Label>
              <Input 
                id="reminderDate" 
                type="datetime-local" 
                {...register("reminderDate")}
                placeholder="Set a reminder for follow-up"
              />
              <p className="text-xs text-muted-foreground">
                Get notified when it&apos;s time to follow up
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagSelector
              selectedTags={selectedTags || []}
              onTagsChange={(tags) => setValue("tags", tags)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              {...register("notes")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Saving..." : deal ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

