"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
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
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import type { Contact } from "@/lib/types";
import { toast } from "sonner";

interface VirtualizedContactsTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  formatCurrency: (value: number) => string;
}

const ROW_HEIGHT = 72; // Height of each row in pixels

const ContactRow = memo(function ContactRow({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: {
    contacts: Contact[];
    selectedContactIds: string[];
    toggleContactSelection: (id: string) => void;
    deleteContact: (id: string) => void;
    onEdit: (contact: Contact) => void;
    formatCurrency: (value: number) => string;
  };
}) {
  const contact = data.contacts[index];
  const isSelected = data.selectedContactIds.includes(contact.id);

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
      data.deleteContact(contact.id);
      toast.success("Contact deleted");
    }
  };

  return (
    <div style={style}>
      <TableRow className="transition-smooth hover:bg-accent/50">
        <TableCell>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => data.toggleContactSelection(contact.id)}
            aria-label={`Select ${contact.name}`}
          />
        </TableCell>
        <TableCell>
          <Link
            href={`/contacts/${contact.id}`}
            className="flex items-center gap-3 transition-colors hover:text-primary hover:underline"
          >
            <span className="font-medium">{contact.name}</span>
          </Link>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {contact.email}
        </TableCell>
        <TableCell>{contact.company}</TableCell>
        <TableCell className="font-medium">
          {data.formatCurrency(contact.value)}
        </TableCell>
        <TableCell>
          <Badge variant="outline">{contact.status}</Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            {contact.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {contact.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{contact.tags.length - 2}
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {format(new Date(contact.createdAt), "MMM dd, yyyy")}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/contacts/${contact.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => data.onEdit(contact)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </div>
  );
});

export function VirtualizedContactsTable({
  contacts,
  onEdit,
  formatCurrency,
}: VirtualizedContactsTableProps) {
  const [isMounted, setIsMounted] = useState(false);
  const deleteContact = useCRMStore((state) => state.deleteContact);
  const selectedContactIds = useCRMStore((state) => state.selectedContactIds);
  const toggleContactSelection = useCRMStore(
    (state) => state.toggleContactSelection
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rowData = useMemo(
    () => ({
      contacts,
      selectedContactIds,
      toggleContactSelection,
      deleteContact,
      onEdit,
      formatCurrency,
    }),
    [contacts, selectedContactIds, toggleContactSelection, deleteContact, onEdit, formatCurrency]
  );

  if (contacts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No contacts found</p>
      </div>
    );
  }

  // Don't render virtualized list until mounted (client-side only)
  if (!isMounted) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.slice(0, 10).map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  const tableHeight = Math.min(contacts.length * ROW_HEIGHT, 600);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody style={{ position: "relative" }}>
            <List
              height={tableHeight}
              itemCount={contacts.length}
              itemSize={ROW_HEIGHT}
              itemData={rowData}
              width="100%"
            >
              {ContactRow}
            </List>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

