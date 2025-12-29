"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import { useInitialize } from "@/hooks/use-initialize";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { ContactFormDialog } from "@/components/contacts/contact-form-dialog";
import { ContactsExportButton } from "@/components/contacts/contacts-export-button";
import { AdvancedFilters } from "@/components/shared/advanced-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import type { ContactFilters } from "@/lib/types";

function ContactsContent() {
  const searchParams = useSearchParams();
  useInitialize();
  const contacts = useCRMStore((state) => state.contacts);
  const selectedContactIds = useCRMStore((state) => state.selectedContactIds);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ContactFilters>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<string | null>(null);

  useEffect(() => {
    const newParam = searchParams.get("new");
    const editParam = searchParams.get("edit");
    if (newParam === "true") {
      setIsDialogOpen(true);
      setEditingContact(null);
    } else if (editParam) {
      setIsDialogOpen(true);
      setEditingContact(editParam);
    }
  }, [searchParams]);

  const filteredContacts = useCRMStore((state) => {
    const allFilters: ContactFilters = {
      ...filters,
      search: searchQuery || undefined,
    };
    return state.filterContacts(allFilters);
  });

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Contacts</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  {contacts.length} total contacts
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <AdvancedFilters
                  type="contacts"
                  filters={filters}
                  onFiltersChange={setFilters}
                />
                <ContactsExportButton contacts={filteredContacts} selectedIds={selectedContactIds} />
              </div>
            </div>

            <ContactsTable
              contacts={filteredContacts}
              onEdit={(contact) => {
                setEditingContact(contact.id);
                setIsDialogOpen(true);
              }}
            />

            <ContactFormDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              contactId={editingContact || undefined}
              onSuccess={() => {
                setIsDialogOpen(false);
                setEditingContact(null);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactsContent />
    </Suspense>
  );
}

