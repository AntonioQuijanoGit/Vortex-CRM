/**
 * Page Templates
 */
export const TEMPLATES = {
  BLANK: {
    id: "blank",
    name: "Blank Page",
    description: "Start from scratch",
    icon: "◉",
    content: [],
  },
  TODO_LIST: {
    id: "todo-list",
    name: "Todo List",
    description: "Organize your tasks",
    icon: "✓",
    content: [
      {
        id: crypto.randomUUID(),
        type: "heading",
        data: { text: "My Todo List", level: 1 },
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        type: "tasks",
        data: {},
        createdAt: new Date().toISOString(),
      },
    ],
  },
  NOTES: {
    id: "notes",
    name: "Notes",
    description: "Take notes and ideas",
    icon: "◉",
    content: [
      {
        id: crypto.randomUUID(),
        type: "heading",
        data: { text: "My Notes", level: 1 },
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        type: "notes",
        data: { content: "## Ideas\n\nWrite your notes here..." },
        createdAt: new Date().toISOString(),
      },
    ],
  },
  JOURNAL: {
    id: "journal",
    name: "Journal",
    description: "Daily journal entry",
    icon: "◉",
    content: [
      {
        id: crypto.randomUUID(),
        type: "heading",
        data: { text: new Date().toLocaleDateString(), level: 1 },
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        type: "rich-text",
        data: { content: "<p>Today I...</p>" },
        createdAt: new Date().toISOString(),
      },
    ],
  },
  MEETING_NOTES: {
    id: "meeting-notes",
    name: "Meeting Notes",
    description: "Structure for meeting notes",
    icon: "◉",
    content: [
      {
        id: crypto.randomUUID(),
        type: "heading",
        data: { text: "Meeting Notes", level: 1 },
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        type: "list",
        data: {
          items: ["Attendees:", "Agenda:", "Action Items:"],
          type: "unordered",
        },
        createdAt: new Date().toISOString(),
      },
    ],
  },
  PROJECT_PLAN: {
    id: "project-plan",
    name: "Project Plan",
    description: "Plan your project",
    icon: "◉",
    content: [
      {
        id: crypto.randomUUID(),
        type: "heading",
        data: { text: "Project Plan", level: 1 },
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        type: "rich-text",
        data: { content: "<h2>Goals</h2><p>Define your project goals...</p>" },
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        type: "tasks",
        data: {},
        createdAt: new Date().toISOString(),
      },
    ],
  },
};

export function getTemplate(templateId) {
  return TEMPLATES[templateId.toUpperCase().replace("-", "_")] || TEMPLATES.BLANK;
}

export function getAllTemplates() {
  return Object.values(TEMPLATES);
}

