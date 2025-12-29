"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useCRMStore } from "@/lib/store";
import { DealCard } from "@/components/pipeline/deal-card";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/types";

interface KanbanColumnProps {
  status: { value: string; label: string; color: string };
  deals: Deal[];
  totalValue: number;
  onDealClick: (dealId: string) => void;
  selectedDealId?: string | null;
  onDealSelect?: (dealId: string | null) => void;
  selectedDealIds?: string[];
}

export function KanbanColumn({
  status,
  deals,
  totalValue,
  onDealClick,
  selectedDealId,
  onDealSelect,
  selectedDealIds = [],
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.value,
  });

  const formatCurrency = (value: number) => {
    const settings = useCRMStore.getState().settings;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const dealIds = deals.map((deal) => deal.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-full min-w-[280px] sm:min-w-[300px] flex-col rounded-lg border border-border bg-card transition-colors flex-shrink-0",
        isOver && "border-primary bg-primary/5"
      )}
    >
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{status.label}</h3>
            <p className="text-sm text-muted-foreground">
              {deals.length} deals • {formatCurrency(totalValue)}
            </p>
          </div>
        </div>
      </div>

      <SortableContext items={dealIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onClick={() => onDealClick(deal.id)}
              isSelected={selectedDealId === deal.id || selectedDealIds.includes(deal.id)}
              onSelect={() => onDealSelect?.(deal.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
