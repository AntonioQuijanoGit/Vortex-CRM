"use client";

import { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { useCRMStore } from "@/lib/store";
import { KanbanColumn } from "@/components/pipeline/kanban-column";
import { DEAL_STATUSES } from "@/lib/constants";
import type { DealStatus, DealFilters } from "@/lib/types";

interface KanbanBoardProps {
  onDealClick: (dealId: string) => void;
  selectedDealId?: string | null;
  onDealSelect?: (dealId: string | null) => void;
  selectedDealIds?: string[];
  filters?: DealFilters;
}

export function KanbanBoard({ onDealClick, selectedDealId, onDealSelect, selectedDealIds = [], filters }: KanbanBoardProps) {
  const deals = useCRMStore((state) => state.deals);
  const filterDeals = useCRMStore((state) => state.filterDeals);
  const updateDeal = useCRMStore((state) => state.updateDeal);

  // Apply filters if provided
  const filteredDeals = filters && Object.keys(filters).length > 0
    ? filterDeals(filters)
    : deals;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDealMove = (dealId: string, newStatus: DealStatus) => {
    updateDeal(dealId, { status: newStatus });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const dealId = active.id as string;
    const targetStatus = over.id as DealStatus;

    // Check if the target is a valid status
    if (DEAL_STATUSES.some((s) => s.value === targetStatus)) {
      handleDealMove(dealId, targetStatus);
    }
  };

  const columnsData = useMemo(() => {
    return DEAL_STATUSES.map((status) => {
      const columnDeals = filteredDeals.filter((deal) => deal.status === status.value);
      const totalValue = columnDeals.reduce((sum, deal) => sum + deal.value, 0);
      return { status, deals: columnDeals, totalValue };
    });
  }, [filteredDeals]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {columnsData.map(({ status, deals: columnDeals, totalValue }) => (
          <KanbanColumn
            key={status.value}
            status={status}
            deals={columnDeals}
            totalValue={totalValue}
            onDealClick={onDealClick}
            selectedDealId={selectedDealId}
            onDealSelect={onDealSelect}
            selectedDealIds={selectedDealIds}
          />
        ))}
      </div>
    </DndContext>
  );
}
