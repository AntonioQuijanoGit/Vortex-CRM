"use client";

import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCRMStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/types";

interface DealCardProps {
  deal: Deal;
  onClick: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const DealCard = memo(function DealCard({ deal, onClick, isSelected, onSelect }: DealCardProps) {
  const getContact = useCRMStore((state) => state.getContact);
  const settings = useCRMStore((state) => state.settings);
  const contact = getContact(deal.contactId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (e.detail === 1) {
          // Single click - select
          onSelect?.();
        } else if (e.detail === 2) {
          // Double click - open
          onClick();
        }
      }}
      className={cn(
        "cursor-grab active:cursor-grabbing rounded-lg border p-3 sm:p-4 transition-all duration-150 ease-in-out hover:shadow-md hover:-translate-y-0.5",
        isSelected
          ? "border-primary bg-primary/10 shadow-md"
          : "border-border bg-background hover:border-primary/20"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm sm:text-base truncate">{deal.title}</h4>
          <div className="mt-2">
            <span className="text-xs sm:text-sm text-muted-foreground truncate">
              {contact?.name || "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="font-bold text-sm sm:text-base">{formatCurrency(deal.value)}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {deal.reminderDate && (
            <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" aria-label="Has reminder" />
          )}
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {format(new Date(deal.closeDate), "MMM dd")}
          </div>
        </div>
      </div>

      {deal.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {deal.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {deal.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{deal.tags.length - 2}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
});
