import { useState } from "react";
import { safeGetItem, safeSetItem } from "../../../utils/storage";
import { useToast } from "../../../hooks/useToast";
import { Icons, renderIcon } from "../../../utils/icons";
import { logger } from "../../../utils/logger";
import "./DataExportImport.css";

export default function DataExportImport({ onClose }) {
  const { showSuccess, showError } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const exportData = (format = "json") => {
    if (typeof window === 'undefined') {
      showError("Export is only available in the browser.");
      return;
    }
    
    try {
      // Get all pages (using the correct key from usePages)
      const pages = safeGetItem("notion-pages", []);
      
      // Get all todos from all pages
      const allTodos = {};
      pages.forEach((page) => {
        const todos = safeGetItem(`todos-${page.id}`, []);
        if (todos.length > 0) {
          allTodos[page.id] = todos;
        }
      });
      
      // Get todos stored in the old format (without page association)
      const oldFormatTodos = safeGetItem("todos", []);
      if (oldFormatTodos.length > 0) {
        allTodos["orphaned"] = oldFormatTodos;
      }
      
      // Get events
      const events = safeGetItem("events", []);
      
      const exportData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        pages,
        todos: allTodos,
        events,
      };
      
      let dataStr, mimeType, filename;
      const dateStr = new Date().toISOString().split("T")[0];
      
      if (format === "markdown") {
        dataStr = exportToMarkdown(pages, allTodos);
        mimeType = "text/markdown";
        filename = `task-list-export-${dateStr}.md`;
      } else if (format === "csv") {
        dataStr = exportToCSV(pages, allTodos);
        mimeType = "text/csv";
        filename = `task-list-export-${dateStr}.csv`;
      } else {
        dataStr = JSON.stringify(exportData, null, 2);
        mimeType = "application/json";
        filename = `task-list-export-${dateStr}.json`;
      }
      
      const dataBlob = new Blob([dataStr], { type: mimeType });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccess(`Data exported as ${format.toUpperCase()} successfully!`);
      onClose();
    } catch (error) {
      logger.error("Failed to export data:", error);
      showError("Failed to export data. Please try again.");
    }
  };

  const exportToMarkdown = (pages, allTodos) => {
    let markdown = `# Task List Export\n\n`;
    markdown += `Exported on: ${new Date().toLocaleString()}\n\n`;
    markdown += `---\n\n`;
    
    pages.forEach((page) => {
      markdown += `## ${page.title}\n\n`;
      const todos = allTodos[page.id] || [];
      
      if (todos.length === 0) {
        markdown += `_No tasks in this page_\n\n`;
      } else {
        todos.forEach((todo) => {
          const status = todo.completed ? "✓" : "○";
          const type = todo.type === "habit" ? "↻" : "✓";
          markdown += `- ${status} ${type} **${todo.title}**`;
          
          if (todo.dueDate) {
            markdown += ` (Due: ${new Date(todo.dueDate).toLocaleDateString()})`;
          }
          
          if (todo.tags && todo.tags.length > 0) {
            markdown += ` [${todo.tags.join(", ")}]`;
          }
          
          if (todo.type === "habit" && todo.streak) {
            markdown += ` - Streak: ${todo.streak} days`;
          }
          
          markdown += `\n`;
        });
      }
      markdown += `\n`;
    });
    
    return markdown;
  };

  const exportToCSV = (pages, allTodos) => {
    let csv = "Type,Title,Status,Page,Due Date,Tags,Streak,Completed At\n";
    
    pages.forEach((page) => {
      const todos = allTodos[page.id] || [];
      todos.forEach((todo) => {
        const row = [
          todo.type || "task",
          `"${(todo.title || "").replace(/"/g, '""')}"`,
          todo.completed ? "Completed" : "Pending",
          `"${(page.title || "").replace(/"/g, '""')}"`,
          todo.dueDate || "",
          todo.tags ? todo.tags.join("; ") : "",
          todo.streak || "",
          todo.completedAt || "",
        ];
        csv += row.join(",") + "\n";
      });
    });
    
    return csv;
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // Validate data structure
        if (!importData.pages || !Array.isArray(importData.pages)) {
          throw new Error("Invalid data format: pages array is required");
        }
        
        // Only import in browser environment
        if (typeof window === 'undefined') {
          showError("Import is only available in the browser.");
          setIsImporting(false);
          return;
        }
        
        // Import pages (using the correct key from usePages)
        if (importData.pages && importData.pages.length > 0) {
          safeSetItem("notion-pages", importData.pages);
        }
        
        // Import todos
        if (importData.todos) {
          Object.keys(importData.todos).forEach((key) => {
            safeSetItem(`todos-${key}`, importData.todos[key]);
          });
        }
        
        // Import events
        if (importData.events && Array.isArray(importData.events)) {
          safeSetItem("events", importData.events);
        }
        
        // Movies functionality has been removed, skip importing movies data
        
        showSuccess("Data imported successfully! Refreshing page...");
        // Reload is necessary here to load imported data into React state
        // TODO: Consider implementing state refresh mechanism instead
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        logger.error("Failed to import data:", error);
        showError("Failed to import data. Please check the file format.");
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      showError("Failed to read file. Please try again.");
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="data-export-import">
      <div className="data-export-import-header">
        <h3>Export / Import Data</h3>
        <button
          className="data-export-import-close"
          onClick={onClose}
          aria-label="Close"
        >
          {renderIcon(Icons.close, 18)}
        </button>
      </div>
      
      <div className="data-export-import-content">
        <div className="data-section">
          <h4>Export Data</h4>
          <p>Download all your pages, tasks, habits, and events in different formats.</p>
          <div className="export-buttons">
            <button
              className="button buttonExport"
              onClick={() => exportData("json")}
              aria-label="Export as JSON"
            >
              <span className="buttonIcon">{renderIcon(Icons.arrowDown, 16)}</span>
              <span className="buttonText">Export JSON</span>
            </button>
            <button
              className="button buttonExport"
              onClick={() => exportData("markdown")}
              aria-label="Export as Markdown"
            >
              <span className="buttonIcon">{renderIcon(Icons.arrowDown, 16)}</span>
              <span className="buttonText">Export Markdown</span>
            </button>
            <button
              className="button buttonExport"
              onClick={() => exportData("csv")}
              aria-label="Export as CSV"
            >
              <span className="buttonIcon">{renderIcon(Icons.arrowDown, 16)}</span>
              <span className="buttonText">Export CSV</span>
            </button>
          </div>
        </div>
        
        <div className="data-section">
          <h4>Import Data</h4>
          <p>Import data from a previously exported JSON file. This will replace all current data.</p>
          <label className="button buttonImport" htmlFor="import-file">
            <span className="buttonIcon">{renderIcon(Icons.arrowUp, 16)}</span>
            <span className="buttonText">
              {isImporting ? "Importing..." : "Import Data"}
            </span>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              style={{ display: "none" }}
              aria-label="Import data file"
            />
          </label>
        </div>
      </div>
      
      <div className="data-export-import-footer">
        <p className="data-warning">
          <strong>Warning:</strong> Importing data will replace all existing data. Make sure to export your current data first if you want to keep it.
        </p>
      </div>
    </div>
  );
}

