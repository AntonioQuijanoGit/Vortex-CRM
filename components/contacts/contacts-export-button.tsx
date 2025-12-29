"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { exportContactsToCSV } from "@/lib/utils/csv-export";
import { exportContactsToPDF } from "@/lib/utils/pdf-export";
import type { Contact } from "@/lib/types";
import { toast } from "sonner";

interface ContactsExportButtonProps {
  contacts: Contact[];
  selectedIds?: string[];
}

export function ContactsExportButton({ contacts, selectedIds }: ContactsExportButtonProps) {
  const handleExportAll = () => {
    exportContactsToCSV(contacts);
    toast.success(`Exported ${contacts.length} contacts`);
  };

  const handleExportSelected = () => {
    if (!selectedIds || selectedIds.length === 0) {
      toast.error("No contacts selected");
      return;
    }
    const selectedContacts = contacts.filter((c) => selectedIds.includes(c.id));
    exportContactsToCSV(selectedContacts);
    toast.success(`Exported ${selectedContacts.length} contacts`);
  };

  const handleExportAllPDF = () => {
    exportContactsToPDF(contacts);
    toast.success(`Exported ${contacts.length} contacts to PDF`);
  };

  const handleExportSelectedPDF = () => {
    if (!selectedIds || selectedIds.length === 0) {
      toast.error("No contacts selected");
      return;
    }
    const selectedContacts = contacts.filter((c) => selectedIds.includes(c.id));
    exportContactsToPDF(selectedContacts);
    toast.success(`Exported ${selectedContacts.length} contacts to PDF`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportAll}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export All CSV ({contacts.length})
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportAllPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export All PDF ({contacts.length})
        </DropdownMenuItem>
        {selectedIds && selectedIds.length > 0 && (
          <>
            <DropdownMenuItem onClick={handleExportSelected}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Selected CSV ({selectedIds.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportSelectedPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Export Selected PDF ({selectedIds.length})
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


