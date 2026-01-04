"use client";

import { useState } from "react";
import { useExtendedStore } from "@/lib/store-extended";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { ContactFilters, DealFilters } from "@/lib/types";

interface CustomReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const contactFields = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "company", label: "Company" },
  { key: "position", label: "Position" },
  { key: "value", label: "Value" },
  { key: "status", label: "Status" },
  { key: "tags", label: "Tags" },
  { key: "createdAt", label: "Created At" },
];

const dealFields = [
  { key: "title", label: "Title" },
  { key: "value", label: "Value" },
  { key: "status", label: "Status" },
  { key: "probability", label: "Probability" },
  { key: "closeDate", label: "Close Date" },
  { key: "tags", label: "Tags" },
  { key: "createdAt", label: "Created At" },
];

export function CustomReportDialog({
  open,
  onOpenChange,
  onSuccess,
}: CustomReportDialogProps) {
  const addCustomReport = useExtendedStore((state) => state.addCustomReport);
  const [name, setName] = useState("");
  const [type, setType] = useState<"contacts" | "deals">("contacts");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const fields = type === "contacts" ? contactFields : dealFields;

  const toggleField = (fieldKey: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((f) => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Report name is required");
      return;
    }

    if (selectedFields.length === 0) {
      toast.error("Select at least one field");
      return;
    }

    addCustomReport({
      name: name.trim(),
      type,
      filters: {},
      fields: selectedFields,
    });

    toast.success("Report created");
    setName("");
    setSelectedFields([]);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Custom Report</DialogTitle>
          <DialogDescription>
            Create a customized report with your selected data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Report Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Report"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => {
              setType(v as any);
              setSelectedFields([]);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contacts">Contacts</SelectItem>
                <SelectItem value="deals">Deals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fields to Include</Label>
            <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
              {fields.map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={selectedFields.includes(field.key)}
                    onCheckedChange={() => toggleField(field.key)}
                  />
                  <Label
                    htmlFor={field.key}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}










