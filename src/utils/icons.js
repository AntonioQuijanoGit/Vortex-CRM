/**
 * Sistema de iconos accesible y claro
 * Iconos diseñados para ser intuitivos y comunicar significado claramente
 */

export const Icons = {
  // Navegación y estructura
  home: "⌂",
  page: "📄",
  folder: "📁",
  workspace: "📋",
  
  // Acciones - claras y reconocibles
  add: "+",
  delete: "×",
  edit: "✎",
  check: "✓",
  close: "×",
  arrow: "→",
  arrowRight: "→",
  arrowLeft: "←",
  expand: "▼",
  collapse: "▶",
  
  // Tipos de contenido - iconos que comunican función claramente
  task: "✓",
  habit: "↻",
  note: "📝",
  text: "📄",
  calendar: "📅",
  movie: "🎬",
  database: "📊",
  
  // Estados
  completed: "✓",
  pending: "○",
  inProgress: "◐",
  empty: "○",
  
  // Características
  streak: "🔥",
  date: "📅",
  stats: "📊",
  dashboard: "📊",
  
  // Board view states
  todo: "○",
  doing: "◐",
  done: "●",
};

/**
 * Mapeo de iconos antiguos (emojis) a nuevos iconos
 */
export const iconMap = {
  "🏠": Icons.home,
  "📄": Icons.page,
  "📝": Icons.note,
  "✓": Icons.check,
  "🎬": Icons.movie,
  "📅": Icons.calendar,
  "📊": Icons.dashboard,
  "🎯": Icons.task,
  "💡": Icons.note,
  "🔖": Icons.page,
  "📌": Icons.page,
  "⭐": Icons.stats,
  "🔥": Icons.streak,
  "📋": Icons.workspace,
  "↻": Icons.habit,
};

/**
 * Iconos organizados por categorías para el selector
 */
export const iconCategories = {
  pages: {
    label: "Pages & Documents",
    icons: [
      { icon: Icons.page, label: "Page" },
      { icon: Icons.note, label: "Note" },
      { icon: Icons.folder, label: "Folder" },
      { icon: Icons.workspace, label: "Workspace" },
    ]
  },
  tasks: {
    label: "Tasks & Productivity",
    icons: [
      { icon: Icons.task, label: "Task" },
      { icon: Icons.check, label: "Check" },
      { icon: Icons.completed, label: "Completed" },
      { icon: Icons.habit, label: "Habit" },
      { icon: Icons.streak, label: "Streak" },
    ]
  },
  time: {
    label: "Time & Calendar",
    icons: [
      { icon: Icons.calendar, label: "Calendar" },
      { icon: Icons.date, label: "Date" },
      { icon: Icons.home, label: "Home" },
    ]
  },
  data: {
    label: "Data & Analytics",
    icons: [
      { icon: Icons.dashboard, label: "Dashboard" },
      { icon: Icons.stats, label: "Stats" },
      { icon: Icons.database, label: "Database" },
    ]
  },
  media: {
    label: "Media",
    icons: [
      { icon: Icons.movie, label: "Movie" },
    ]
  },
  symbols: {
    label: "Symbols",
    icons: [
      { icon: "○", label: "Circle" },
      { icon: "◐", label: "Half" },
      { icon: "◑", label: "Three Quarter" },
      { icon: "◒", label: "Quarter" },
      { icon: "●", label: "Filled" },
      { icon: "◉", label: "Dot" },
    ]
  }
};

/**
 * Iconos comunes para el selector de iconos (flat list)
 */
export const commonIcons = [
  Icons.page,
  Icons.note,
  Icons.check,
  Icons.calendar,
  Icons.dashboard,
  Icons.task,
  Icons.folder,
  Icons.workspace,
  Icons.stats,
  Icons.streak,
  Icons.habit,
];

/**
 * Convierte un icono antiguo (emoji) al nuevo sistema
 */
export function normalizeIcon(icon) {
  if (!icon) return Icons.page;
  return iconMap[icon] || icon;
}

