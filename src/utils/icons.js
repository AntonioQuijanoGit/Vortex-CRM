/**
 * Icon system using Lucide React - Accessible and Apple System-like
 * Lucide provides consistent, accessible icons similar to SF Symbols
 */
import {
  Home,
  FileText,
  Folder,
  Plus,
  X,
  Edit,
  Check,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ChevronDown as Expand,
  ChevronRight as Collapse,
  Minus,
  CheckSquare,
  RotateCw as Habit,
  StickyNote,
  Calendar,
  Film,
  Database,
  Circle,
  CircleDot,
  AlertCircle,
  Sun,
  Moon,
  BarChart3 as Stats,
  LayoutDashboard as Dashboard,
  Flame as Streak,
  Clock,
  Target,
  Bell,
  Settings,
  Trophy,
  Timer,
  BookOpen,
  List,
  Grid3x3,
  Table,
  Filter,
  MoreVertical,
  Trash2,
  Copy,
  Move,
  Star,
  Zap,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';

// Export individual icons for direct use
export {
  Home,
  FileText,
  Folder,
  Plus,
  X,
  Edit,
  Check,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Expand,
  Collapse,
  Minus,
  CheckSquare,
  Habit,
  StickyNote,
  Calendar,
  Film,
  Database,
  Circle,
  CircleDot,
  AlertCircle,
  Sun,
  Moon,
  Stats,
  Dashboard,
  Streak,
  Clock,
  Target,
  Bell,
  Settings,
  Trophy,
  Timer,
  BookOpen,
  List,
  Grid3x3,
  Table,
  Filter,
  MoreVertical,
  Trash2,
  Copy,
  Move,
  Star,
  Zap,
  TrendingUp,
  HelpCircle,
};

// Icon mapping object for backward compatibility
export const Icons = {
  // Navigation and structure
  home: Home,
  page: FileText,
  folder: Folder,
  workspace: Folder,
  
  // Actions
  add: Plus,
  delete: X,
  edit: Edit,
  check: Check,
  close: X,
  search: Search,
  arrow: ChevronRight,
  arrowRight: ChevronRight,
  arrowLeft: ChevronLeft,
  arrowUp: ChevronUp,
  arrowDown: ChevronDown,
  expand: Expand,
  collapse: Collapse,
  minimize: Minus,
  
  // Content types
  task: CheckSquare,
  habit: Habit,
  note: StickyNote,
  text: FileText,
  calendar: Calendar,
  movie: Film,
  database: Database,
  
  // States
  completed: Check,
  pending: Circle,
  inProgress: CircleDot,
  empty: Circle,
  
  // Features
  streak: Streak,
  date: Calendar,
  stats: Stats,
  dashboard: Dashboard,
  
  // Board view states
  todo: Circle,
  doing: CircleDot,
  done: CheckSquare,
  
  // Alerts and warnings
  warning: AlertCircle,
  alert: AlertCircle,
  
  // Theme
  sun: Sun,
  moon: Moon,
  
  // Additional
  clock: Clock,
  target: Target,
  bell: Bell,
  settings: Settings,
  trophy: Trophy,
  timer: Timer,
  book: BookOpen,
  list: List,
  grid: Grid3x3,
  table: Table,
  filter: Filter,
  more: MoreVertical,
  trash: Trash2,
  copy: Copy,
  move: Move,
  star: Star,
  zap: Zap,
  trending: TrendingUp,
  help: HelpCircle,
};

/**
 * Icon component wrapper for easy use
 * Usage: <Icon name="home" size={20} />
 */
export function Icon({ name, size = 20, className = "", ...props }) {
  const IconComponent = Icons[name] || Icons.page;
  if (!IconComponent) return null;
  
  return (
    <IconComponent 
      size={size} 
      className={className}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Legacy icon map for backward compatibility
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
 * Icon categories for icon selector
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
};

/**
 * Common icons for icon selector (flat list)
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
 * Normalize icon - converts old emoji icons to new system
 */
export function normalizeIcon(icon) {
  if (!icon) return Icons.page;
  
  // If it's already a Lucide component, return it
  if (typeof icon === 'function' || typeof icon === 'object') {
    return icon;
  }
  
  // If it's an emoji, map it
  if (iconMap[icon]) {
    return iconMap[icon];
  }
  
  // If it's a string key, return the icon
  if (Icons[icon]) {
    return Icons[icon];
  }
  
  // Default
  return Icons.page;
}

/**
 * Render icon helper - handles both old string icons and new component icons
 */
export function renderIcon(icon, size = 20, className = "") {
  const IconComponent = normalizeIcon(icon);
  
  // If it's a React component, render it
  if (typeof IconComponent === 'function' || typeof IconComponent === 'object') {
    const Component = IconComponent;
    return <Component size={size} className={className} aria-hidden="true" />;
  }
  
  // Fallback to string (for backward compatibility)
  return <span className={className} aria-hidden="true">{IconComponent}</span>;
}
