export type ContactStatus = "active" | "inactive" | "lead";
export type DealStatus = "lead" | "contacted" | "proposal" | "negotiation" | "won" | "lost";
export type ActivityType = 
  | "contact_created"
  | "deal_created"
  | "deal_moved"
  | "deal_won"
  | "deal_lost"
  | "note_added"
  | "contact_updated";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  avatar: string;
  value: number;
  status: ContactStatus;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  status: DealStatus;
  probability: number;
  closeDate: string;
  notes: string;
  tags: string[];
  reminderDate?: string; // New: reminder for follow-up
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  contactId?: string;
  dealId?: string;
  description: string;
  userId?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  contactId?: string;
  dealId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalContacts: number;
  activeDeals: number;
  monthlyRevenue: number;
  winRate: number;
  contactsChange: number;
  dealsChange: number;
  revenueChange: number;
  winRateChange: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: ContactFilters | DealFilters;
  type: "contacts" | "deals";
}

export interface ContactFilters {
  search?: string;
  status?: ContactStatus[];
  tags?: string[];
  minValue?: number;
  maxValue?: number;
  sortBy?: "name" | "company" | "value" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface DealFilters {
  search?: string;
  status?: DealStatus[];
  contactId?: string;
  minValue?: number;
  maxValue?: number;
  closeDateFrom?: string;
  closeDateTo?: string;
}

export interface Settings {
  theme: "light" | "dark";
  currency: string;
  dateFormat: string;
  notifications: boolean;
  accentColor?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  type: "contacts" | "deals";
  filters: ContactFilters | DealFilters;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  contactId?: string;
  dealId?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  contactId?: string;
  dealId?: string;
  startDate: string;
  endDate: string;
  type: "meeting" | "call" | "email" | "other";
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomReport {
  id: string;
  name: string;
  type: "contacts" | "deals" | "analytics";
  filters?: ContactFilters | DealFilters;
  fields: string[];
  createdAt: string;
}

export interface SavedView {
  id: string;
  name: string;
  type: "deals";
  filters: DealFilters;
  createdAt: string;
  updatedAt: string;
}

