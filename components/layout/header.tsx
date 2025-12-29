"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { HelpTutorial } from "@/components/shared/help-tutorial";
import { GlobalSearch } from "@/components/shared/global-search";

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setGlobalSearchOpen(true);
    } else {
      setGlobalSearchOpen(true);
    }
  };

  const handleSearchFocus = () => {
    setGlobalSearchOpen(true);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-2 sm:px-4 md:px-6 gap-2 md:pl-6" role="banner">
      <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-md ml-16 md:ml-0" role="search">
        <div className="relative">
          <Search className="absolute left-2 sm:left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search (Ctrl+K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            className="pl-8 sm:pl-10 cursor-pointer text-sm sm:text-base"
            aria-label="Search contacts, deals, and notes"
          />
        </div>
      </form>
      <GlobalSearch open={globalSearchOpen} onOpenChange={setGlobalSearchOpen} />
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <ThemeToggle />
        <HelpTutorial />
        <Button
          variant="default"
          size="sm"
          onClick={() => router.push("/contacts?new=true")}
          className="hidden sm:flex"
          aria-label="Add new contact"
        >
          <Plus className="mr-1 sm:mr-2 h-4 w-4" aria-hidden="true" />
          <span className="hidden md:inline">Add Contact</span>
          <span className="md:hidden">Add</span>
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={() => router.push("/contacts?new=true")}
          className="sm:hidden"
          aria-label="Add new contact"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}

