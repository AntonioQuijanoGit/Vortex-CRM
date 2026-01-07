import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import type {
  Contact,
  Deal,
  Activity,
  Note,
  Settings,
  ContactFilters,
  DealFilters,
  DashboardStats,
  DealStatus,
} from "./types";
import { STORAGE_KEYS } from "./constants";
import { seedDataIfNeeded } from "./data-generator";
import { generateUUID, debounce, safeLocalStorageGetItem, safeLocalStorageSetItem } from "./utils";

interface CRMStore {
  // Data
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
  notes: Note[];
  settings: Settings;

  // UI State
  selectedContactIds: string[];
  selectedDealIds: string[];

  // Initialization
  initialize: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  
  // Initialize extended store
  initializeExtended: () => void;

  // Contacts
  addContact: (contact: Omit<Contact, "id" | "createdAt" | "updatedAt">) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  deleteContacts: (ids: string[]) => void;
  getContact: (id: string) => Contact | undefined;
  getContactsByDeal: (dealId: string) => Contact[];
  
  // Deals
  addDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => Deal;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  deleteDeals: (ids: string[]) => void;
  duplicateDeal: (id: string) => Deal;
  getDeal: (id: string) => Deal | undefined;
  getDealsByContact: (contactId: string) => Deal[];
  getDealsByStatus: (status: Deal["status"]) => Deal[];
  getDealsWithReminders: () => Deal[];
  
  // Activities
  addActivity: (activity: Omit<Activity, "id" | "createdAt">) => Activity;
  getActivitiesByContact: (contactId: string) => Activity[];
  getActivitiesByDeal: (dealId: string) => Activity[];
  getRecentActivities: (limit?: number) => Activity[];
  
  // Notes
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNotesByContact: (contactId: string) => Note[];
  getNotesByDeal: (dealId: string) => Note[];
  
  // Settings
  updateSettings: (updates: Partial<Settings>) => void;
  
  // Filters & Search
  filterContacts: (filters: ContactFilters) => Contact[];
  filterDeals: (filters: DealFilters) => Deal[];
  
  // Stats
  getDashboardStats: () => DashboardStats;
  
  // Selection
  toggleContactSelection: (id: string) => void;
  toggleDealSelection: (id: string) => void;
  clearContactSelection: () => void;
  clearDealSelection: () => void;
  selectAllContacts: () => void;
  selectAllDeals: () => void;
  
  // Export/Import
  exportData: () => string;
  importData: (data: string) => void;
  clearAllData: () => void;
}

// Create debounced save function outside the store to avoid recreation
let debouncedSaveFn: (() => void) | null = null;

export const useCRMStore = createWithEqualityFn<CRMStore>(
  (set, get) => {
  // Initialize debounced save function once
  if (!debouncedSaveFn && typeof window !== "undefined") {
    debouncedSaveFn = debounce(() => {
      const { contacts, deals, activities, notes, settings } = get();
      try {
        safeLocalStorageSetItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
        safeLocalStorageSetItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
        safeLocalStorageSetItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
        safeLocalStorageSetItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        safeLocalStorageSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (error) {
        // Silently fail - localStorage might not be available
        console.warn("Error saving to storage:", error);
      }
    }, 500);
  }

  return {
    // Initial state
  contacts: [],
  deals: [],
  activities: [],
  notes: [],
  settings: {
    theme: "dark",
    currency: "USD",
    dateFormat: "MMM dd, yyyy",
    notifications: true,
  },
  selectedContactIds: [],
  selectedDealIds: [],

  // Initialization
  initialize: () => {
    if (typeof window === "undefined") return;
    
    try {
      const state = get();
      // Check if data exists in localStorage first (using safe helper)
      const hasStoredData = safeLocalStorageGetItem(STORAGE_KEYS.CONTACTS) || safeLocalStorageGetItem(STORAGE_KEYS.DEALS);
      
      // Only prevent initialization if we have data in both store AND localStorage
      if ((state.contacts.length > 0 || state.deals.length > 0) && hasStoredData) {
        return;
      }
      
      // Generate seed data if needed (this will check localStorage internally)
      seedDataIfNeeded();
      
      // Always load from storage after seeding
      state.loadFromStorage();
      state.initializeExtended();
    } catch (error) {
      // Don't throw - allow app to continue even if initialization fails
      console.error("Error initializing store:", error);
    }
  },
  
  initializeExtended: () => {
    // Load extended store data
    try {
      if (typeof window !== "undefined") {
        // Use dynamic import to avoid circular dependency issues
        import("./store-extended").then((module) => {
          module.useExtendedStore.getState().loadExtendedData();
        }).catch((err) => {
          console.warn("Extended store not available:", err);
        });
      }
    } catch (error) {
      // Silently fail if extended store is not available
    }
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;

    try {
      const contacts = JSON.parse(
        safeLocalStorageGetItem(STORAGE_KEYS.CONTACTS) || "[]"
      );
      const deals = JSON.parse(
        safeLocalStorageGetItem(STORAGE_KEYS.DEALS) || "[]"
      );
      const activities = JSON.parse(
        safeLocalStorageGetItem(STORAGE_KEYS.ACTIVITIES) || "[]"
      );
      const notes = JSON.parse(
        safeLocalStorageGetItem(STORAGE_KEYS.NOTES) || "[]"
      );
      const settings = JSON.parse(
        safeLocalStorageGetItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(get().settings)
      );

      set({ 
        contacts, 
        deals, 
        activities, 
        notes, 
        settings,
      });
      console.log(`✅ Loaded from storage: ${contacts.length} contacts, ${deals.length} deals`);
    } catch (error) {
      // Don't throw - allow app to continue with empty state
      console.warn("Error loading from storage:", error);
    }
  },

  saveToStorage: () => {
    if (typeof window === "undefined") return;

    const { contacts, deals, activities, notes, settings } = get();
    
    try {
      safeLocalStorageSetItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
      safeLocalStorageSetItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
      safeLocalStorageSetItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      safeLocalStorageSetItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      safeLocalStorageSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      // Silently fail - localStorage might not be available
      console.warn("Error saving to storage:", error);
    }
  },

  // Contacts
  addContact: (contactData) => {
    const now = new Date().toISOString();
    const contact: Contact = {
      ...contactData,
      id: generateUUID(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      contacts: [...state.contacts, contact],
    }));

    // Add activity
    get().addActivity({
      type: "contact_created",
      contactId: contact.id,
      description: `${contact.name} was added as a contact`,
    });

    debouncedSaveFn?.();
    return contact;
  },

  updateContact: (id, updates) => {
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    }));

    get().addActivity({
      type: "contact_updated",
      contactId: id,
      description: "Contact information was updated",
    });

    debouncedSaveFn?.();
  },

  deleteContact: (id) => {
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
      deals: state.deals.filter((d) => d.contactId !== id),
      notes: state.notes.filter((n) => n.contactId !== id),
      activities: state.activities.filter((a) => a.contactId !== id),
    }));

    debouncedSaveFn?.();
  },

  deleteContacts: (ids) => {
    set((state) => ({
      contacts: state.contacts.filter((c) => !ids.includes(c.id)),
      deals: state.deals.filter((d) => !ids.includes(d.contactId)),
      notes: state.notes.filter((n) => !n.contactId || !ids.includes(n.contactId)),
      activities: state.activities.filter((a) => !a.contactId || !ids.includes(a.contactId)),
      selectedContactIds: [],
    }));

    debouncedSaveFn?.();
  },

  getContact: (id) => {
    return get().contacts.find((c) => c.id === id);
  },

  getContactsByDeal: (dealId) => {
    const deal = get().getDeal(dealId);
    if (!deal) return [];
    return get().contacts.filter((c) => c.id === deal.contactId);
  },

  // Deals
  addDeal: (dealData) => {
    const now = new Date().toISOString();
    const deal: Deal = {
      ...dealData,
      id: generateUUID(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      deals: [...state.deals, deal],
    }));

    get().addActivity({
      type: "deal_created",
      contactId: deal.contactId,
      dealId: deal.id,
      description: `Deal "${deal.title}" was created`,
    });

    debouncedSaveFn?.();
    return deal;
  },

  updateDeal: (id, updates) => {
    const oldDeal = get().getDeal(id);
    
    set((state) => ({
      deals: state.deals.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      ),
    }));

    if (updates.status && oldDeal && updates.status !== oldDeal.status) {
      get().addActivity({
        type: "deal_moved",
        contactId: oldDeal.contactId,
        dealId: id,
        description: `Deal status changed to ${updates.status}`,
      });

      if (updates.status === "won") {
        get().addActivity({
          type: "deal_won",
          contactId: oldDeal.contactId,
          dealId: id,
          description: `Deal "${oldDeal.title}" was won`,
        });
      } else if (updates.status === "lost") {
        get().addActivity({
          type: "deal_lost",
          contactId: oldDeal.contactId,
          dealId: id,
          description: `Deal "${oldDeal.title}" was lost`,
        });
      }
    }

    debouncedSaveFn?.();
  },

  deleteDeal: (id) => {
    set((state) => ({
      deals: state.deals.filter((d) => d.id !== id),
      notes: state.notes.filter((n) => n.dealId !== id),
      activities: state.activities.filter((a) => a.dealId !== id),
    }));

    debouncedSaveFn?.();
  },

  deleteDeals: (ids) => {
    set((state) => ({
      deals: state.deals.filter((d) => !ids.includes(d.id)),
      notes: state.notes.filter((n) => !n.dealId || !ids.includes(n.dealId)),
      activities: state.activities.filter((a) => !a.dealId || !ids.includes(a.dealId)),
      selectedDealIds: [],
    }));

    debouncedSaveFn?.();
  },

  getDeal: (id) => {
    return get().deals.find((d) => d.id === id);
  },

  getDealsByContact: (contactId) => {
    return get().deals.filter((d) => d.contactId === contactId);
  },

  getDealsByStatus: (status) => {
    return get().deals.filter((d) => d.status === status);
  },

  duplicateDeal: (id) => {
    const originalDeal = get().getDeal(id);
    if (!originalDeal) {
      throw new Error("Deal not found");
    }

    const now = new Date().toISOString();
    const duplicatedDeal: Deal = {
      ...originalDeal,
      id: generateUUID(),
      title: `${originalDeal.title} (Copy)`,
      status: "lead" as DealStatus, // Reset to initial status
      createdAt: now,
      updatedAt: now,
      reminderDate: undefined, // Clear reminder
    };

    set((state) => ({
      deals: [...state.deals, duplicatedDeal],
    }));

    get().addActivity({
      type: "deal_created",
      contactId: duplicatedDeal.contactId,
      dealId: duplicatedDeal.id,
      description: `Deal "${duplicatedDeal.title}" was duplicated`,
    });

    debouncedSaveFn?.();
    return duplicatedDeal;
  },

  getDealsWithReminders: () => {
    const now = new Date();
    return get().deals.filter((deal) => {
      if (!deal.reminderDate) return false;
      const reminderDate = new Date(deal.reminderDate);
      // Return deals with reminders in the next 7 days
      return reminderDate >= now && reminderDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    });
  },

  // Activities
  addActivity: (activityData) => {
    const activity: Activity = {
      ...activityData,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 1000), // Limit to 1000 activities
    }));

    debouncedSaveFn?.();
    return activity;
  },

  getActivitiesByContact: (contactId) => {
    return get().activities
      .filter((a) => a.contactId === contactId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getActivitiesByDeal: (dealId) => {
    return get().activities
      .filter((a) => a.dealId === dealId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getRecentActivities: (limit = 10) => {
    return get().activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  // Notes
  addNote: (noteData) => {
    const now = new Date().toISOString();
    const note: Note = {
      ...noteData,
      id: generateUUID(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      notes: [...state.notes, note],
    }));

    get().addActivity({
      type: "note_added",
      contactId: noteData.contactId,
      dealId: noteData.dealId,
      description: "A note was added",
    });

    debouncedSaveFn?.();
    return note;
  },

  updateNote: (id, updates) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      ),
    }));

    debouncedSaveFn?.();
  },

  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    }));

    debouncedSaveFn?.();
  },

  getNotesByContact: (contactId) => {
    return get().notes
      .filter((n) => n.contactId === contactId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getNotesByDeal: (dealId) => {
    return get().notes
      .filter((n) => n.dealId === dealId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Settings
  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));

    debouncedSaveFn?.();
  },

  // Filters
  filterContacts: (filters) => {
    let filtered = [...get().contacts];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.company.toLowerCase().includes(search)
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((c) => filters.status!.includes(c.status));
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((c) =>
        filters.tags!.some((tag) => c.tags.includes(tag))
      );
    }

    if (filters.minValue !== undefined) {
      filtered = filtered.filter((c) => c.value >= filters.minValue!);
    }

    if (filters.maxValue !== undefined) {
      filtered = filtered.filter((c) => c.value <= filters.maxValue!);
    }

    // Sort
    const sortBy = filters.sortBy || "name";
    const sortOrder = filters.sortOrder || "asc";

    filtered.sort((a, b) => {
      let aVal: string | number = a[sortBy];
      let bVal: string | number = b[sortBy];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  },

  filterDeals: (filters) => {
    let filtered = [...get().deals];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(search) ||
          d.notes.toLowerCase().includes(search)
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((d) => filters.status!.includes(d.status));
    }

    if (filters.contactId) {
      filtered = filtered.filter((d) => d.contactId === filters.contactId);
    }

    if (filters.minValue !== undefined) {
      filtered = filtered.filter((d) => d.value >= filters.minValue!);
    }

    if (filters.maxValue !== undefined) {
      filtered = filtered.filter((d) => d.value <= filters.maxValue!);
    }

    if (filters.closeDateFrom) {
      filtered = filtered.filter(
        (d) => new Date(d.closeDate) >= new Date(filters.closeDateFrom!)
      );
    }

    if (filters.closeDateTo) {
      filtered = filtered.filter(
        (d) => new Date(d.closeDate) <= new Date(filters.closeDateTo!)
      );
    }

    return filtered;
  },

  // Stats (memoized internally)
  getDashboardStats: () => {
    const { contacts, deals } = get();
    
    // Memoize calculations to avoid recalculation
    const statsCache = (get() as any).__statsCache;
    const contactsLength = contacts.length;
    const dealsLength = deals.length;
    
    // Check if cache is valid (simple check based on data length)
    if (statsCache && 
        statsCache.contactsLength === contactsLength && 
        statsCache.dealsLength === dealsLength) {
      return statsCache.stats;
    }
    
    const totalContacts = contactsLength;
    const activeDeals = deals.filter((d) => 
      !["won", "lost"].includes(d.status)
    ).length;
    
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthRevenue = deals
      .filter((d) => d.status === "won" && new Date(d.closeDate) >= thisMonthStart)
      .reduce((sum, d) => sum + d.value, 0);

    const lastMonthRevenue = deals
      .filter(
        (d) =>
          d.status === "won" &&
          new Date(d.closeDate) >= lastMonthStart &&
          new Date(d.closeDate) <= lastMonthEnd
      )
      .reduce((sum, d) => sum + d.value, 0);

    const revenueChange = lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    const wonDeals = deals.filter((d) => d.status === "won").length;
    const lostDeals = deals.filter((d) => d.status === "lost").length;
    const totalClosed = wonDeals + lostDeals;
    const winRate = totalClosed > 0 ? (wonDeals / totalClosed) * 100 : 0;

    const lastMonthWon = deals.filter(
      (d) =>
        d.status === "won" &&
        new Date(d.closeDate) >= lastMonthStart &&
        new Date(d.closeDate) <= lastMonthEnd
    ).length;

    const lastMonthLost = deals.filter(
      (d) =>
        d.status === "lost" &&
        new Date(d.closeDate) >= lastMonthStart &&
        new Date(d.closeDate) <= lastMonthEnd
    ).length;

    const lastMonthClosed = lastMonthWon + lastMonthLost;
    const lastMonthWinRate = lastMonthClosed > 0
      ? (lastMonthWon / lastMonthClosed) * 100
      : 0;

    const winRateChange = winRate - lastMonthWinRate;

    // Calculate changes (compare with last month)
    const lastMonthContacts = contacts.filter(
      (c) => new Date(c.createdAt) >= lastMonthStart && new Date(c.createdAt) <= lastMonthEnd
    ).length;
    const contactsChange = lastMonthContacts > 0 
      ? ((contactsLength - lastMonthContacts) / lastMonthContacts) * 100 
      : contactsLength > 0 ? 100 : 0;

    const lastMonthDeals = deals.filter(
      (d) => new Date(d.createdAt) >= lastMonthStart && new Date(d.createdAt) <= lastMonthEnd
    ).length;
    const dealsChange = lastMonthDeals > 0
      ? ((activeDeals - lastMonthDeals) / lastMonthDeals) * 100
      : activeDeals > 0 ? 100 : 0;

    const stats = {
      totalContacts,
      activeDeals,
      monthlyRevenue: thisMonthRevenue,
      winRate,
      contactsChange,
      dealsChange,
      revenueChange,
      winRateChange,
    };

    // Cache the results
    (get() as any).__statsCache = {
      contactsLength,
      dealsLength,
      stats,
    };

    return stats;
  },

  // Selection
  toggleContactSelection: (id) => {
    set((state) => ({
      selectedContactIds: state.selectedContactIds.includes(id)
        ? state.selectedContactIds.filter((cid) => cid !== id)
        : [...state.selectedContactIds, id],
    }));
  },

  toggleDealSelection: (id) => {
    set((state) => ({
      selectedDealIds: state.selectedDealIds.includes(id)
        ? state.selectedDealIds.filter((did) => did !== id)
        : [...state.selectedDealIds, id],
    }));
  },

  clearContactSelection: () => {
    set({ selectedContactIds: [] });
  },

  clearDealSelection: () => {
    set({ selectedDealIds: [] });
  },

  selectAllContacts: () => {
    set((state) => ({
      selectedContactIds: state.contacts.map((c) => c.id),
    }));
  },

  selectAllDeals: () => {
    set((state) => ({
      selectedDealIds: state.deals.map((d) => d.id),
    }));
  },

  // Export/Import
  exportData: () => {
    const { contacts, deals, activities, notes, settings } = get();
    return JSON.stringify(
      { contacts, deals, activities, notes, settings },
      null,
      2
    );
  },

  importData: (dataString) => {
    try {
      const data = JSON.parse(dataString);
      set({
        contacts: data.contacts || [],
        deals: data.deals || [],
        activities: data.activities || [],
        notes: data.notes || [],
        settings: data.settings || get().settings,
      });
      debouncedSaveFn?.();
    } catch (error) {
      console.error("Error importing data:", error);
      throw new Error("Invalid data format");
    }
  },

  clearAllData: () => {
    set({
      contacts: [],
      deals: [],
      activities: [],
      notes: [],
      selectedContactIds: [],
      selectedDealIds: [],
    });
    debouncedSaveFn?.();
  },

  _debouncedSave: () => {
    debouncedSaveFn?.();
  },
  };
  },
  Object.is
);

