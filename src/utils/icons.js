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
  Menu,
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
  Menu,
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
  menu: Menu,
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
 * Convert icon component to its string key name
 * Used for serialization to localStorage
 */
export function iconToKey(icon) {
  if (!icon) {
    console.log('[iconToKey] No icon, returning page');
    return 'page';
  }
  
  // If it's already a string key, return it
  if (typeof icon === 'string') {
    console.log('[iconToKey] Icon is string:', icon);
    return icon;
  }
  
  // If it's a function (component), find its key in Icons
  if (typeof icon === 'function') {
    for (const [key, value] of Object.entries(Icons)) {
      if (value === icon) {
        console.log('[iconToKey] Found function match:', key);
        return key;
      }
    }
    console.warn('[iconToKey] Function icon not found in Icons, returning page');
    return 'page';
  }
  
  // If it's a forwardRef or React component object
  if (typeof icon === 'object' && icon !== null) {
    // Check if it's a forwardRef (has render property)
    if (icon.render && typeof icon.render === 'function') {
      const iconDisplayName = icon.displayName || 'unknown';
      console.log('[iconToKey] Icon is forwardRef, displayName:', iconDisplayName);
      for (const [key, value] of Object.entries(Icons)) {
        if (value && typeof value === 'object' && value.render === icon.render) {
          console.log('[iconToKey] Found forwardRef match by render:', key);
          return key;
        }
        // Also check direct function comparison
        if (value === icon.render) {
          console.log('[iconToKey] Found forwardRef match by direct comparison:', key);
          return key;
        }
      }
      console.warn('[iconToKey] ForwardRef not found in Icons, returning page. displayName:', iconDisplayName);
      return 'page';
    }
    
    // If it's a React element, try to extract the component
    if (icon.$$typeof) {
      if (icon.type && typeof icon.type === 'function') {
        for (const [key, value] of Object.entries(Icons)) {
          if (value === icon.type) {
            return key;
          }
        }
      }
    }
  }
  
  // Default fallback
  return 'page';
}

/**
 * Normalize icon - converts old emoji icons to new system
 * Always returns a function (React component) or falls back to Icons.page
 * Handles serialized icons from localStorage
 */
export function normalizeIcon(icon) {
  if (!icon) {
    console.log('[normalizeIcon] No icon, returning page');
    return Icons.page;
  }
  
  // If it's already a Lucide component (function), return it directly
  if (typeof icon === 'function') {
    console.log('[normalizeIcon] Icon is function, returning as-is');
    return icon;
  }
  
  // If it's a forwardRef object (has $$typeof: Symbol(react.forward_ref) or render property)
  if (typeof icon === 'object' && icon !== null) {
    // Check if it's a forwardRef - has both $$typeof and render property
    // Lucide React icons are forwardRef components
    if (icon.$$typeof && icon.render && typeof icon.render === 'function') {
      // It's a forwardRef component, return it as-is
      const displayName = icon.displayName || 'unknown';
      const renderFnString = icon.render.toString().substring(0, 100);
      console.log('[normalizeIcon] Icon is forwardRef, returning as-is. displayName:', displayName, 'render preview:', renderFnString);
      return icon;
    }
    // Also check if it has render property (forwardRef without $$typeof check)
    if (icon.render && typeof icon.render === 'function') {
      const displayName = icon.displayName || 'unknown';
      console.log('[normalizeIcon] Icon has render property, returning as-is. displayName:', displayName);
      return icon;
    }
    
    // If it's a React element (has $$typeof but not forward_ref), extract the component type
    if (icon.$$typeof) {
      // This is a React element - extract the component
      if (icon.type && typeof icon.type === 'function') {
        return icon.type;
      }
      // If type is a forwardRef, return it
      if (icon.type && typeof icon.type === 'object' && icon.type.render) {
        return icon.type;
      }
      // If type is not a function, it's invalid - fallback
      return Icons.page;
    }
    // If it's a serialized object from localStorage (functions become {} or null)
    // Just fallback to default - we can't recover the original function
    return Icons.page;
  }
  
  // If it's an emoji, map it to a component
  if (iconMap[icon]) {
    return iconMap[icon];
  }
  
  // If it's a string key, return the icon component
  if (typeof icon === 'string' && Icons[icon]) {
    return Icons[icon];
  }
  
  // Default fallback
  return Icons.page;
}

/**
 * Render icon helper - handles both old string icons and new component icons
 * Always returns a valid React element (never an object)
 */
export function renderIcon(icon, size = 20, className = "", strokeWidth = 2) {
  console.log('[renderIcon] Called with icon:', icon?.displayName || (typeof icon === 'string' ? icon : typeof icon), '$$typeof:', icon?.$$typeof?.toString());
  
  // If icon is a forwardRef (has $$typeof: Symbol(react.forward_ref) and render property)
  // This is the most common case for Lucide React icons
  if (icon && typeof icon === 'object' && icon.$$typeof && icon.render && typeof icon.render === 'function') {
    const Component = icon;
    const displayName = Component.displayName || 'unknown';
    console.log('[renderIcon] Rendering forwardRef directly:', displayName);
    return (
      <Component 
        size={size} 
        strokeWidth={strokeWidth}
        className={className}
        style={{ 
          display: 'inline-block',
          verticalAlign: 'middle',
          flexShrink: 0,
          width: `${size}px`,
          height: `${size}px`
        }}
        aria-hidden="true" 
      />
    );
  }
  
  // If icon is already a React element (has $$typeof but not forwardRef), extract the component
  if (icon && typeof icon === 'object' && icon.$$typeof) {
    // It's a React element - extract the component type and render it
    if (icon.type && typeof icon.type === 'function') {
      const Component = icon.type;
      console.log('[renderIcon] Rendering React element component:', Component.name);
      return (
        <Component 
          size={size} 
          strokeWidth={strokeWidth}
          className={className}
          style={{ 
            display: 'inline-block',
            verticalAlign: 'middle',
            flexShrink: 0,
            width: `${size}px`,
            height: `${size}px`
          }}
          aria-hidden="true" 
        />
      );
    }
    // If we can't extract the component, fallback to default
    console.warn('[renderIcon] React element without valid type, using page fallback');
    const DefaultIcon = Icons.page;
    return (
      <DefaultIcon 
        size={size} 
        strokeWidth={strokeWidth}
        className={className}
        style={{ 
          color: 'currentColor',
          display: 'inline-block',
          verticalAlign: 'middle',
          width: `${size}px`,
          height: `${size}px`
        }}
        aria-hidden="true" 
      />
    );
  }
  
  // Normalize the icon to get a component function or forwardRef
  const IconComponent = normalizeIcon(icon);
  const componentDisplayName = IconComponent?.displayName || (typeof IconComponent === 'function' ? IconComponent.name : 'unknown');
  console.log('[renderIcon] After normalizeIcon, component displayName:', componentDisplayName, 'type:', typeof IconComponent);
  
  // IconComponent can be a function or a forwardRef object
  // If it's a function, render it directly
  if (typeof IconComponent === 'function') {
    const Component = IconComponent;
    console.log('[renderIcon] Rendering as function component:', Component.name);
    return (
      <Component 
        size={size} 
        strokeWidth={strokeWidth}
        className={className}
        style={{ 
          display: 'inline-block',
          verticalAlign: 'middle',
          flexShrink: 0,
          width: `${size}px`,
          height: `${size}px`
        }}
        aria-hidden="true" 
      />
    );
  }
  
  // If it's a forwardRef object (has $$typeof and render), render it directly
  // React can render forwardRef components directly
  if (IconComponent && typeof IconComponent === 'object' && 
      IconComponent.$$typeof && IconComponent.render && typeof IconComponent.render === 'function') {
    const Component = IconComponent;
    console.log('[renderIcon] Rendering as forwardRef component:', Component.displayName || 'unknown');
    return (
      <Component 
        size={size} 
        strokeWidth={strokeWidth}
        className={className}
        style={{ 
          display: 'inline-block',
          verticalAlign: 'middle',
          flexShrink: 0,
          width: `${size}px`,
          height: `${size}px`
        }}
        aria-hidden="true" 
      />
    );
  }
  
  console.warn('[renderIcon] IconComponent is not function or forwardRef!', IconComponent);
  
  // Fallback: if somehow we get here, render default icon
  const DefaultIcon = Icons.page;
  return (
    <DefaultIcon 
      size={size} 
      strokeWidth={strokeWidth}
      className={className}
      style={{ 
        color: 'currentColor',
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
      aria-hidden="true" 
    />
  );
}
