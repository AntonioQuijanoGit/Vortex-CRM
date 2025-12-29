import React from "react";
import { Icons } from "../../utils/icons";
import "./DatabaseToolbar.css";

export function DatabaseToolbar({
  page,
  viewType,
  onViewTypeChange,
  onAddProperty,
  onAddRow,
  schema,
  rowCount,
}) {
  const viewTypes = [
    { id: "list", label: "List", icon: Icons.list },
    { id: "table", label: "Table", icon: Icons.table },
    { id: "board", label: "Board", icon: Icons.board },
    { id: "gallery", label: "Gallery", icon: Icons.gallery },
    { id: "calendar", label: "Calendar", icon: Icons.calendar },
  ];

  return (
    <div className="database-toolbar">
      <div className="database-toolbar-left">
        <div className="database-toolbar-views">
          {viewTypes.map((view) => (
            <button
              key={view.id}
              className={`database-toolbar-view-btn ${viewType === view.id ? "active" : ""}`}
              onClick={() => onViewTypeChange(view.id)}
              aria-label={`Switch to ${view.label} view`}
              title={view.label}
            >
              <span className="view-icon">{view.icon}</span>
              <span className="view-label">{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="database-toolbar-right">
        <div className="database-toolbar-stats">
          <span className="database-row-count">{rowCount} {rowCount === 1 ? "row" : "rows"}</span>
          <span className="database-property-count">{schema.length} {schema.length === 1 ? "property" : "properties"}</span>
        </div>
        <button
          className="database-toolbar-btn"
          onClick={onAddProperty}
          aria-label="Add property"
          title="Add property"
        >
          <span>{Icons.add}</span>
          <span>Property</span>
        </button>
        <button
          className="database-toolbar-btn database-toolbar-btn-primary"
          onClick={onAddRow}
          aria-label="Add row"
          title="Add row"
        >
          <span>{Icons.add}</span>
          <span>Add Row</span>
        </button>
      </div>
    </div>
  );
}

