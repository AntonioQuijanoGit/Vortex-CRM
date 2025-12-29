"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { DealFormDialog } from "@/components/pipeline/deal-form-dialog";
import { DealReminders } from "@/components/pipeline/deal-reminders";
import { BulkActions } from "@/components/pipeline/bulk-actions";
import { SavedViews } from "@/components/pipeline/saved-views";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Copy, LayoutGrid, Table as TableIcon } from "lucide-react";
import { useInitialize } from "@/hooks/use-initialize";
import { useCRMStore } from "@/lib/store";
import { useExtendedStore } from "@/lib/store-extended";
import { toast } from "sonner";
import type { DealFilters, Deal } from "@/lib/types";
import { DealsTable } from "@/components/pipeline/deals-table";

function PipelineContent() {
  const searchParams = useSearchParams();
  useInitialize();
  const loadExtendedData = useExtendedStore((state) => state.loadExtendedData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<string | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedDealIds, setSelectedDealIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<DealFilters>({});
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const duplicateDeal = useCRMStore((state) => state.duplicateDeal);
  const deleteDeal = useCRMStore((state) => state.deleteDeal);
  const getDeal = useCRMStore((state) => state.getDeal);
  const deals = useCRMStore((state) => state.deals);
  const filterDeals = useCRMStore((state) => state.filterDeals);

  useEffect(() => {
    loadExtendedData();
  }, [loadExtendedData]);

  useEffect(() => {
    const newParam = searchParams.get("new");
    const dealParam = searchParams.get("deal");
    if (newParam === "true") {
      setIsDialogOpen(true);
      setEditingDeal(null);
    } else if (dealParam) {
      setIsDialogOpen(true);
      setEditingDeal(dealParam);
    }
  }, [searchParams]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // D - New Deal
      if (e.key === "d" && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setIsDialogOpen(true);
        setEditingDeal(null);
      }

      // E - Edit selected deal
      if (e.key === "e" && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && selectedDealId) {
        e.preventDefault();
        setIsDialogOpen(true);
        setEditingDeal(selectedDealId);
      }

      // Delete - Delete selected deal
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        !e.ctrlKey &&
        !e.metaKey &&
        selectedDealId
      ) {
        e.preventDefault();
        const deal = getDeal(selectedDealId);
        if (deal && confirm(`Delete deal "${deal.title}"?`)) {
          deleteDeal(selectedDealId);
          toast.success("Deal deleted");
          setSelectedDealId(null);
        }
      }

      // Escape - Clear selection
      if (e.key === "Escape") {
        setSelectedDealId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDealId, deleteDeal, getDeal]);

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="mx-auto max-w-full space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Pipeline</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Manage your sales pipeline
                </p>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {selectedDealId && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        try {
                          duplicateDeal(selectedDealId);
                          toast.success("Deal duplicated");
                        } catch (error) {
                          toast.error("Failed to duplicate deal");
                        }
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(true);
                        setEditingDeal(selectedDealId);
                      }}
                    >
                      Edit
                    </Button>
                  </>
                )}
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Deal
                </Button>
              </div>
            </div>

            <DealReminders />

            {selectedDealIds.length > 0 && (
              <BulkActions
                selectedDealIds={selectedDealIds}
                onClearSelection={() => setSelectedDealIds([])}
              />
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
              <SavedViews filters={filters} onFiltersChange={setFilters} />
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "kanban" | "table")}>
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="kanban" className="flex-1 sm:flex-initial">
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Kanban</span>
                    <span className="sm:hidden">Board</span>
                  </TabsTrigger>
                  <TabsTrigger value="table" className="flex-1 sm:flex-initial">
                    <TableIcon className="h-4 w-4 mr-2" />
                    Table
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {viewMode === "kanban" ? (
              <KanbanBoard
                onDealClick={(dealId) => {
                  setSelectedDealId(dealId);
                  setEditingDeal(dealId);
                  setIsDialogOpen(true);
                }}
                selectedDealId={selectedDealId}
                onDealSelect={(dealId) => {
                  setSelectedDealId(dealId);
                  if (dealId) {
                    setSelectedDealIds((prev) =>
                      prev.includes(dealId)
                        ? prev.filter((id) => id !== dealId)
                        : [...prev, dealId]
                    );
                  }
                }}
                selectedDealIds={selectedDealIds}
                filters={filters}
              />
            ) : (
              <DealsTable
                deals={
                  filters && Object.keys(filters).length > 0
                    ? filterDeals(filters)
                    : deals
                }
                onEdit={(deal) => {
                  setEditingDeal(deal.id);
                  setIsDialogOpen(true);
                }}
                onDelete={(dealId) => {
                  const deal = getDeal(dealId);
                  if (deal && confirm(`Delete deal "${deal.title}"?`)) {
                    deleteDeal(dealId);
                    toast.success("Deal deleted");
                  }
                }}
                selectedDealIds={selectedDealIds}
                onToggleSelection={(dealId) => {
                  setSelectedDealIds((prev) =>
                    prev.includes(dealId)
                      ? prev.filter((id) => id !== dealId)
                      : [...prev, dealId]
                  );
                }}
                onSelectAll={() => {
                  const filtered = filters && Object.keys(filters).length > 0
                    ? filterDeals(filters)
                    : deals;
                  setSelectedDealIds(filtered.map((d) => d.id));
                }}
                onClearSelection={() => setSelectedDealIds([])}
                filters={filters}
              />
            )}

            <DealFormDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              dealId={editingDeal || undefined}
              onSuccess={() => {
                setIsDialogOpen(false);
                setEditingDeal(null);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PipelineContent />
    </Suspense>
  );
}

