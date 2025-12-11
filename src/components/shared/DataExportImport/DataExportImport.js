import { useState } from "react";
import { safeGetItem } from "../../../utils/storage";
import { useToast } from "../../../hooks/useToast";
import { Icons } from "../../../utils/icons";
import { logger } from "../../../utils/logger";
import "./DataExportImport.css";

export default function DataExportImport({ onClose }) {
  const { showSuccess, showError } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const exportData = () => {
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
      
      // Get movies
      const movies = safeGetItem("movies", []);
      
      const exportData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        pages,
        todos: allTodos,
        events,
        movies,
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `task-list-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccess("Data exported successfully!");
      onClose();
    } catch (error) {
      logger.error("Failed to export data:", error);
      showError("Failed to export data. Please try again.");
    }
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
        
        // Import pages (using the correct key from usePages)
        if (importData.pages && importData.pages.length > 0) {
          localStorage.setItem("notion-pages", JSON.stringify(importData.pages));
        }
        
        // Import todos
        if (importData.todos) {
          Object.keys(importData.todos).forEach((key) => {
            localStorage.setItem(`todos-${key}`, JSON.stringify(importData.todos[key]));
          });
        }
        
        // Import events
        if (importData.events && Array.isArray(importData.events)) {
          localStorage.setItem("events", JSON.stringify(importData.events));
        }
        
        // Movies functionality has been removed, skip importing movies data
        
        showSuccess("Data imported successfully! Please refresh the page.");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
          {Icons.close}
        </button>
      </div>
      
      <div className="data-export-import-content">
        <div className="data-section">
          <h4>Export Data</h4>
          <p>Download all your pages, tasks, habits, events, and movies as a JSON file.</p>
          <button
            className="button buttonExport"
            onClick={exportData}
            aria-label="Export data"
          >
            <span className="buttonIcon">{Icons.arrowDown}</span>
            <span className="buttonText">Export Data</span>
          </button>
        </div>
        
        <div className="data-section">
          <h4>Import Data</h4>
          <p>Import data from a previously exported JSON file. This will replace all current data.</p>
          <label className="button buttonImport" htmlFor="import-file">
            <span className="buttonIcon">{Icons.arrowUp}</span>
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

