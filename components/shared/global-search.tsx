"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useCRMStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Users, GitBranch, FileText, Info } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { parseSearchQuery, applySearchQuery } from "@/lib/search-parser";
import { Badge } from "@/components/ui/badge";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const contacts = useCRMStore((state) => state.contacts);
  const deals = useCRMStore((state) => state.deals);
  const notes = useCRMStore((state) => state.notes);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const parsedQuery = parseSearchQuery(debouncedSearch);

  const filteredContacts = applySearchQuery(
    contacts,
    parsedQuery,
    {
      name: (c) => c.name,
      email: (c) => c.email,
      company: (c) => c.company,
      status: (c) => c.status,
      value: (c) => c.value,
      tag: (c) => c.tags,
    }
  );

  const filteredDeals = applySearchQuery(
    deals,
    parsedQuery,
    {
      title: (d) => d.title,
      status: (d) => d.status,
      value: (d) => d.value,
      tag: (d) => d.tags,
    }
  );

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const hasAdvancedQuery = parsedQuery.operators.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Global Search</DialogTitle>
          <DialogDescription>Search everything in your CRM</DialogDescription>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md" shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            <Command.Input
              placeholder="Search everything... (try: value > 1000, status:won, tag:important)"
              aria-label="Global search"
              autoFocus
              value={search}
              onValueChange={setSearch}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0"
            />
          </div>
          {hasAdvancedQuery && (
            <div className="px-3 py-2 border-b bg-muted/50 flex items-center gap-2 text-xs">
              <Info className="h-3 w-3" />
              <span>Advanced search active:</span>
              {parsedQuery.operators.map((op, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {op.field} {op.operator} {op.value}
                </Badge>
              ))}
            </div>
          )}
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty>No results found.</Command.Empty>

            {debouncedSearch && filteredContacts.length > 0 && (
              <Command.Group heading="Contacts">
                {filteredContacts.slice(0, 5).map((contact) => (
                  <Command.Item
                    key={contact.id}
                    onSelect={() => {
                      router.push(`/contacts/${contact.id}`);
                      onOpenChange(false);
                    }}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {contact.name} - {contact.company}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {debouncedSearch && filteredDeals.length > 0 && (
              <Command.Group heading="Deals">
                {filteredDeals.slice(0, 5).map((deal) => (
                  <Command.Item
                    key={deal.id}
                    onSelect={() => {
                      router.push(`/pipeline?deal=${deal.id}`);
                      onOpenChange(false);
                    }}
                  >
                    <GitBranch className="mr-2 h-4 w-4" />
                    {deal.title}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {debouncedSearch && filteredNotes.length > 0 && (
              <Command.Group heading="Notes">
                {filteredNotes.slice(0, 5).map((note) => (
                  <Command.Item
                    key={note.id}
                    onSelect={() => {
                      if (note.contactId) {
                        router.push(`/contacts/${note.contactId}`);
                      } else if (note.dealId) {
                        router.push(`/pipeline?deal=${note.dealId}`);
                      }
                      onOpenChange(false);
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {note.content.substring(0, 50)}...
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

