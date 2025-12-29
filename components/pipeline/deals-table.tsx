"use client";

import { useState, useMemo, memo } from "react";
import Link from "next/link";
import { useCRMStore } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Eye, Bell } from "lucide-react";
import { format } from "date-fns";
import type { Deal, DealFilters } from "@/lib/types";
import { DEAL_STATUSES } from "@/lib/constants";

interface DealsTableProps {
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
  selectedDealIds: string[];
  onToggleSelection: (dealId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  filters?: DealFilters;
}

export const DealsTable = memo(function DealsTable({
  deals,
  onEdit,
  onDelete,
  selectedDealIds,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  filters,
}: DealsTableProps) {
  const settings = useCRMStore((state) => state.settings);
  const getContact = useCRMStore((state) => state.getContact);

  const formatCurrency = useMemo(() => {
    return (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: settings.currency,
        minimumFractionDigits: 0,
      }).format(value);
    };
  }, [settings.currency]);

  const allSelected = deals.length > 0 && selectedDealIds.length === deals.length;
  const someSelected = selectedDealIds.length > 0 && !allSelected;

  const sortedDeals = useMemo(() => {
    return [...deals].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [deals]);

  const getStatusColor = (status: Deal["status"]) => {
    const statusConfig = DEAL_STATUSES.find((s) => s.value === status);
    return statusConfig?.color || "default";
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectAll();
                  } else {
                    onClearSelection();
                  }
                }}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden sm:table-cell">Contact</TableHead>
            <TableHead className="hidden md:table-cell">Value</TableHead>
            <TableHead className="hidden lg:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Probability</TableHead>
            <TableHead className="hidden lg:table-cell">Close Date</TableHead>
            <TableHead className="hidden xl:table-cell">Tags</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDeals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12">
                <p className="text-muted-foreground">No deals found</p>
              </TableCell>
            </TableRow>
          ) : (
            sortedDeals.map((deal) => {
              const isSelected = selectedDealIds.includes(deal.id);
              const contact = getContact(deal.contactId);
              const statusConfig = DEAL_STATUSES.find((s) => s.value === deal.status);

              return (
                <TableRow
                  key={deal.id}
                  className={`transition-smooth hover:bg-accent/50 animate-fade-in ${
                    isSelected ? "bg-primary/5" : ""
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelection(deal.id)}
                      aria-label={`Select ${deal.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-0">
                      {deal.reminderDate && (
                        <Bell className="h-4 w-4 text-yellow-500 flex-shrink-0" aria-label="Has reminder" />
                      )}
                      <span
                        className="font-medium truncate cursor-pointer hover:text-primary hover:underline"
                        onClick={() => onEdit(deal)}
                      >
                        {deal.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {contact ? (
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="text-sm transition-colors hover:text-primary hover:underline truncate"
                      >
                        {contact.name}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    {formatCurrency(deal.value)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge
                      variant="outline"
                      style={{
                        backgroundColor: statusConfig?.color
                          ? `${statusConfig.color}20`
                          : undefined,
                        borderColor: statusConfig?.color || undefined,
                        color: statusConfig?.color || undefined,
                      }}
                    >
                      {statusConfig?.label || deal.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-10">
                        {deal.probability}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {format(new Date(deal.closeDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex gap-1 flex-wrap">
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
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(deal)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(deal.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
});

