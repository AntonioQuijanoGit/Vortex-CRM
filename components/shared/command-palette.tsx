"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import { Command } from "cmdk";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { LayoutDashboard, Users, GitBranch, FileText, Calendar, CheckSquare, BarChart3, Settings } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const contacts = useCRMStore((state) => state.contacts);
  const deals = useCRMStore((state) => state.deals);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Search contacts and deals
  const searchResults = useMemo(() => {
    if (!search.trim()) return { contacts: [], deals: [] };
    
    const query = search.toLowerCase();
    const matchedContacts = contacts
      .filter((c) => 
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query)
      )
      .slice(0, 5);
    
    const matchedDeals = deals
      .filter((d) =>
        d.title.toLowerCase().includes(query) ||
        d.notes.toLowerCase().includes(query)
      )
      .slice(0, 5);

    return { contacts: matchedContacts, deals: matchedDeals };
  }, [search, contacts, deals]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <Command className="rounded-lg" shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Command.Input
              placeholder="Search contacts, deals, or navigate..."
              value={search}
              onValueChange={setSearch}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0"
            />
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            {search.trim() ? (
              <>
                {searchResults.contacts.length === 0 && searchResults.deals.length === 0 ? (
                  <Command.Empty>No results found.</Command.Empty>
                ) : (
                  <>
                    {searchResults.contacts.length > 0 && (
                      <Command.Group heading="Contacts">
                        {searchResults.contacts.map((contact) => (
                          <Command.Item
                            key={contact.id}
                            onSelect={() => {
                              router.push(`/contacts/${contact.id}`);
                              onOpenChange(false);
                            }}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            <span>{contact.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {contact.company}
                            </span>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}
                    {searchResults.deals.length > 0 && (
                      <Command.Group heading="Deals">
                        {searchResults.deals.map((deal) => (
                          <Command.Item
                            key={deal.id}
                            onSelect={() => {
                              router.push(`/pipeline?deal=${deal.id}`);
                              onOpenChange(false);
                            }}
                          >
                            <GitBranch className="mr-2 h-4 w-4" />
                            <span>{deal.title}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              ${deal.value.toLocaleString()}
                            </span>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Command.Group heading="Navigation">
                  <Command.Item
                    onSelect={() => {
                      router.push("/");
                      onOpenChange(false);
                    }}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      router.push("/contacts");
                      onOpenChange(false);
                    }}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Contacts
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      router.push("/pipeline");
                      onOpenChange(false);
                    }}
                  >
                    <GitBranch className="mr-2 h-4 w-4" />
                    Pipeline
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      router.push("/calendar");
                      onOpenChange(false);
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      router.push("/tasks");
                      onOpenChange(false);
                    }}
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Tasks
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      router.push("/analytics");
                      onOpenChange(false);
                    }}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      router.push("/reports");
                      onOpenChange(false);
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Reports
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      router.push("/settings");
                      onOpenChange(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Quick Actions">
                  <Command.Item
                    onSelect={() => {
                      router.push("/contacts?new=true");
                      onOpenChange(false);
                    }}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Add Contact
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      router.push("/pipeline?new=true");
                      onOpenChange(false);
                    }}
                  >
                    <GitBranch className="mr-2 h-4 w-4" />
                    Add Deal
                  </Command.Item>
                </Command.Group>
              </>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
