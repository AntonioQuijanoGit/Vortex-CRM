/**
 * Extended Store with new features
 * This extends the base store with tags, tasks, events, filter presets, etc.
 */

import { create } from "zustand";
import type {
  Tag,
  FilterPreset,
  Task,
  Event,
  CustomReport,
  ContactFilters,
  DealFilters,
  SavedView,
} from "./types";
import { STORAGE_KEYS, TAG_COLORS } from "./constants";

interface ExtendedStore {
  // Tags
  tags: Tag[];
  addTag: (name: string, color?: string) => Tag;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  getTag: (id: string) => Tag | undefined;

  // Filter Presets
  filterPresets: FilterPreset[];
  addFilterPreset: (preset: Omit<FilterPreset, "id" | "createdAt">) => FilterPreset;
  updateFilterPreset: (id: string, updates: Partial<FilterPreset>) => void;
  deleteFilterPreset: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByContact: (contactId: string) => Task[];
  getTasksByDeal: (dealId: string) => Task[];
  getPendingTasks: () => Task[];
  completeTask: (id: string) => void;

  // Events
  events: Event[];
  addEvent: (event: Omit<Event, "id" | "createdAt" | "updatedAt">) => Event;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsByContact: (contactId: string) => Event[];
  getEventsByDeal: (dealId: string) => Event[];
  getEventsByDateRange: (start: string, end: string) => Event[];

  // Custom Reports
  customReports: CustomReport[];
  addCustomReport: (report: Omit<CustomReport, "id" | "createdAt">) => CustomReport;
  updateCustomReport: (id: string, updates: Partial<CustomReport>) => void;
  deleteCustomReport: (id: string) => void;

  // Saved Views (for deals)
  savedViews: SavedView[];
  addSavedView: (view: Omit<SavedView, "id" | "createdAt" | "updatedAt">) => SavedView;
  updateSavedView: (id: string, updates: Partial<SavedView>) => void;
  deleteSavedView: (id: string) => void;
  getSavedView: (id: string) => SavedView | undefined;

  // Persistence
  loadExtendedData: () => void;
  saveExtendedData: () => void;
}

export const useExtendedStore = create<ExtendedStore>((set, get) => ({
  // Tags
  tags: [],

  addTag: (name, color) => {
    const tag: Tag = {
      id: crypto.randomUUID(),
      name,
      color: color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      tags: [...state.tags, tag],
    }));

    get().saveExtendedData();
    return tag;
  },

  updateTag: (id, updates) => {
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.id === id ? { ...tag, ...updates } : tag
      ),
    }));

    get().saveExtendedData();
  },

  deleteTag: (id) => {
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
    }));

    get().saveExtendedData();
  },

  getTag: (id) => {
    return get().tags.find((tag) => tag.id === id);
  },

  // Filter Presets
  filterPresets: [],

  addFilterPreset: (presetData) => {
    const preset: FilterPreset = {
      ...presetData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      filterPresets: [...state.filterPresets, preset],
    }));

    get().saveExtendedData();
    return preset;
  },

  updateFilterPreset: (id, updates) => {
    set((state) => ({
      filterPresets: state.filterPresets.map((preset) =>
        preset.id === id ? { ...preset, ...updates } : preset
      ),
    }));

    get().saveExtendedData();
  },

  deleteFilterPreset: (id) => {
    set((state) => ({
      filterPresets: state.filterPresets.filter((preset) => preset.id !== id),
    }));

    get().saveExtendedData();
  },

  // Tasks
  tasks: [],

  addTask: (taskData) => {
    const task: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      tasks: [...state.tasks, task],
    }));

    get().saveExtendedData();
    return task;
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      ),
    }));

    get().saveExtendedData();
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));

    get().saveExtendedData();
  },

  getTasksByContact: (contactId) => {
    return get().tasks.filter((task) => task.contactId === contactId);
  },

  getTasksByDeal: (dealId) => {
    return get().tasks.filter((task) => task.dealId === dealId);
  },

  getPendingTasks: () => {
    return get().tasks.filter((task) => !task.completed);
  },

  completeTask: (id) => {
    get().updateTask(id, { completed: true });
  },

  // Events
  events: [],

  addEvent: (eventData) => {
    const event: Event = {
      ...eventData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      events: [...state.events, event],
    }));

    get().saveExtendedData();
    return event;
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updates, updatedAt: new Date().toISOString() } : event
      ),
    }));

    get().saveExtendedData();
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));

    get().saveExtendedData();
  },

  getEventsByContact: (contactId) => {
    return get().events.filter((event) => event.contactId === contactId);
  },

  getEventsByDeal: (dealId) => {
    return get().events.filter((event) => event.dealId === dealId);
  },

  getEventsByDateRange: (start, end) => {
    return get().events.filter((event) => {
      const eventStart = new Date(event.startDate);
      return eventStart >= new Date(start) && eventStart <= new Date(end);
    });
  },

  // Custom Reports
  customReports: [],

  addCustomReport: (reportData) => {
    const report: CustomReport = {
      ...reportData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      customReports: [...state.customReports, report],
    }));

    get().saveExtendedData();
    return report;
  },

  updateCustomReport: (id, updates) => {
    set((state) => ({
      customReports: state.customReports.map((report) =>
        report.id === id ? { ...report, ...updates } : report
      ),
    }));

    get().saveExtendedData();
  },

  deleteCustomReport: (id) => {
    set((state) => ({
      customReports: state.customReports.filter((report) => report.id !== id),
    }));

    get().saveExtendedData();
  },

  // Saved Views
  savedViews: [],

  addSavedView: (viewData) => {
    const now = new Date().toISOString();
    const view: SavedView = {
      ...viewData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      savedViews: [...state.savedViews, view],
    }));

    get().saveExtendedData();
    return view;
  },

  updateSavedView: (id, updates) => {
    set((state) => ({
      savedViews: state.savedViews.map((view) =>
        view.id === id ? { ...view, ...updates, updatedAt: new Date().toISOString() } : view
      ),
    }));

    get().saveExtendedData();
  },

  deleteSavedView: (id) => {
    set((state) => ({
      savedViews: state.savedViews.filter((view) => view.id !== id),
    }));

    get().saveExtendedData();
  },

  getSavedView: (id) => {
    return get().savedViews.find((view) => view.id === id);
  },

  // Persistence
  loadExtendedData: () => {
    if (typeof window === "undefined") return;

    try {
      const tags = JSON.parse(localStorage.getItem(STORAGE_KEYS.TAGS) || "[]");
      const filterPresets = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILTER_PRESETS) || "[]");
      const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
      const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || "[]");
      const customReports = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_REPORTS) || "[]");
      const savedViews = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_VIEWS) || "[]");

      set({ tags, filterPresets, tasks, events, customReports, savedViews });
    } catch (error) {
      console.error("Error loading extended data:", error);
    }
  },

  saveExtendedData: () => {
    if (typeof window === "undefined") return;

    const { tags, filterPresets, tasks, events, customReports, savedViews } = get();

    try {
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
      localStorage.setItem(STORAGE_KEYS.FILTER_PRESETS, JSON.stringify(filterPresets));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      localStorage.setItem(STORAGE_KEYS.CUSTOM_REPORTS, JSON.stringify(customReports));
      localStorage.setItem(STORAGE_KEYS.SAVED_VIEWS, JSON.stringify(savedViews));
    } catch (error) {
      console.error("Error saving extended data:", error);
    }
  },
}));


