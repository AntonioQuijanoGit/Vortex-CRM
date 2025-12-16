import { useTheme } from "../../../hooks/useTheme";
import { Icons, renderIcon } from "../../../utils/icons";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className="theme-icon" aria-hidden="true">
        {renderIcon(theme === "light" ? Icons.moon : Icons.sun, 18)}
      </span>
    </button>
  );
}

