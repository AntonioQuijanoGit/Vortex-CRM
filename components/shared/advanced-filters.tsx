"use client";

import { useState } from "react";
import { useExtendedStore } from "@/lib/store-extended";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ContactFilters, DealFilters } from "@/lib/types";
import { CONTACT_STATUSES, DEAL_STATUSES } from "@/lib/constants";

interface AdvancedFiltersProps<T extends ContactFilters | DealFilters> {
  type: "contacts" | "deals";
  filters: T;
  onFiltersChange: (filters: T) => void;
  availableTags?: string[];
}

export function AdvancedFilters<T extends ContactFilters | DealFilters>({
  type,
  filters,
  onFiltersChange,
  availableTags = [],
}: AdvancedFiltersProps<T>) {
  const [open, setOpen] = useState(false);
  const filterPresets = useExtendedStore((state) => state.filterPresets);
  const addFilterPreset = useExtendedStore((state) => state.addFilterPreset);
  const deleteFilterPreset = useExtendedStore((state) => state.deleteFilterPreset);
  const [presetName, setPresetName] = useState("");

  const typePresets = filterPresets.filter((p) => p.type === type);

  const applyPreset = (preset: typeof filterPresets[0]) => {
    onFiltersChange(preset.filters as T);
    setOpen(false);
  };

  const savePreset = () => {
    if (!presetName.trim()) return;
    addFilterPreset({
      name: presetName.trim(),
      type,
      filters,
    });
    setPresetName("");
  };

  const clearFilters = () => {
    onFiltersChange({} as T);
  };

  const activeFiltersCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof T];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim() !== "";
    return value !== undefined && value !== null;
  }).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {type === "contacts" && (
            <>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="space-y-2">
                  {CONTACT_STATUSES.map((status) => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status.value}`}
                        checked={(filters as ContactFilters).status?.includes(status.value as any) || false}
                        onCheckedChange={(checked) => {
                          const current = (filters as ContactFilters).status || [];
                          const newStatus = checked
                            ? [...current, status.value as any]
                            : current.filter((s) => s !== status.value);
                          onFiltersChange({ ...filters, status: newStatus } as T);
                        }}
                      />
                      <Label htmlFor={`status-${status.value}`} className="text-sm font-normal cursor-pointer">
                        {status.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Value Range</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={(filters as ContactFilters).minValue || ""}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        minValue: e.target.value ? Number(e.target.value) : undefined,
                      } as T)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={(filters as ContactFilters).maxValue || ""}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        maxValue: e.target.value ? Number(e.target.value) : undefined,
                      } as T)
                    }
                  />
                </div>
              </div>
            </>
          )}

          {type === "deals" && (
            <>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="space-y-2">
                  {DEAL_STATUSES.map((status) => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`deal-status-${status.value}`}
                        checked={(filters as DealFilters).status?.includes(status.value as any) || false}
                        onCheckedChange={(checked) => {
                          const current = (filters as DealFilters).status || [];
                          const newStatus = checked
                            ? [...current, status.value as any]
                            : current.filter((s) => s !== status.value);
                          onFiltersChange({ ...filters, status: newStatus } as T);
                        }}
                      />
                      <Label htmlFor={`deal-status-${status.value}`} className="text-sm font-normal cursor-pointer">
                        {status.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-2 border-t pt-4">
            <Label>Saved Presets</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {typePresets.map((preset) => (
                <div key={preset.id} className="flex items-center justify-between">
                  <button
                    onClick={() => applyPreset(preset)}
                    className="text-sm hover:underline flex-1 text-left"
                  >
                    {preset.name}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => deleteFilterPreset(preset.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && savePreset()}
              />
              <Button variant="outline" size="icon" onClick={savePreset}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}





