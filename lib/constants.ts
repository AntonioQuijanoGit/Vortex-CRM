export const DEAL_STATUSES: { value: string; label: string; color: string }[] = [
  { value: "lead", label: "Lead", color: "gray" },
  { value: "contacted", label: "Contacted", color: "blue" },
  { value: "proposal", label: "Proposal", color: "yellow" },
  { value: "negotiation", label: "Negotiation", color: "orange" },
  { value: "won", label: "Won", color: "green" },
  { value: "lost", label: "Lost", color: "red" },
];

export const CONTACT_STATUSES: { value: string; label: string; color: string }[] = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "gray" },
  { value: "lead", label: "Lead", color: "blue" },
];

export const DEFAULT_TAGS = ["VIP", "Lead", "Client", "Partner", "Prospect"];

export const TAG_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
];

export const STORAGE_KEYS = {
  CONTACTS: "crm-contacts",
  DEALS: "crm-deals",
  ACTIVITIES: "crm-activities",
  NOTES: "crm-notes",
  SETTINGS: "crm-settings",
  DATA_VERSION: "crm-data-version",
  TAGS: "crm-tags",
  FILTER_PRESETS: "crm-filter-presets",
  TASKS: "crm-tasks",
  EVENTS: "crm-events",
  CUSTOM_REPORTS: "crm-custom-reports",
  SAVED_VIEWS: "crm-saved-views",
};

export const DATA_VERSION = "2.0.0";

export const QUICK_FILTERS = {
  highValue: { name: "High Value", minValue: 50000 },
  recent: { name: "Recent", days: 30 },
  vip: { name: "VIP", tags: ["VIP"] },
};

