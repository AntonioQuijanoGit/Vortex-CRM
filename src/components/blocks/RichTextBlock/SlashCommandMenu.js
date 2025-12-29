import React, { useState, useEffect } from "react";
import { Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus, Code } from "lucide-react";
import "./SlashCommandMenu.css";

const COMMANDS = [
  { id: "heading1", label: "Heading 1", icon: Heading1, shortcut: "# " },
  { id: "heading2", label: "Heading 2", icon: Heading2, shortcut: "## " },
  { id: "heading3", label: "Heading 3", icon: Heading3, shortcut: "### " },
  { id: "bullet-list", label: "Bullet List", icon: List, shortcut: "- " },
  { id: "numbered-list", label: "Numbered List", icon: ListOrdered, shortcut: "1. " },
  { id: "quote", label: "Quote", icon: Quote, shortcut: "> " },
  { id: "divider", label: "Divider", icon: Minus, shortcut: "---" },
  { id: "code", label: "Code Block", icon: Code, shortcut: "```" },
];

export function SlashCommandMenu({ position, onSelect, onClose }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % COMMANDS.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + COMMANDS.length) % COMMANDS.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        onSelect(COMMANDS[selectedIndex].id);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, onSelect, onClose]);

  return (
    <div
      className="slash-command-menu"
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="slash-command-menu-header">
        <span>Insert</span>
      </div>
      <div className="slash-command-menu-list">
        {COMMANDS.map((command, index) => {
          const Icon = command.icon;
          return (
            <button
              key={command.id}
              className={`slash-command-item ${
                index === selectedIndex ? "selected" : ""
              }`}
              onClick={() => onSelect(command.id)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <Icon size={18} className="slash-command-icon" />
              <div className="slash-command-content">
                <div className="slash-command-label">{command.label}</div>
                <div className="slash-command-shortcut">{command.shortcut}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

