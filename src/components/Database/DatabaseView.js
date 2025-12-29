import React, { useState, useEffect, useMemo } from "react";
import { useWorkspace } from "../../hooks/useWorkspace";
import { TodoApp } from "../Todo";
import { TableView } from "../Views/TableView";
import { BoardView } from "../Views/BoardView";
import GalleryView from "../Views/GalleryView/GalleryView";
import { DatabaseToolbar } from "./DatabaseToolbar";
import PropertyEditor from "./PropertyEditor";
import { RowEditor } from "./RowEditor";
import { PROPERTY_TYPES } from "./PropertyTypes";
import { adaptRowsToTodos } from "./adapters/rowToTodoAdapter";
import "./DatabaseView.css";

/**
 * DatabaseView - Main component for database pages
 * Handles schema, rows, and multiple view types (table, board, gallery, calendar)
 */
export default function DatabaseView({ page, onUpdatePage }) {
  const {
    getDatabase,
    createDatabase,
    updateDatabaseSchema,
    addDatabaseRow,
    updateDatabaseRow,
    deleteDatabaseRow,
    getDatabaseRows,
  } = useWorkspace();

  const [viewType, setViewType] = useState(page.viewType || "list");
  const [showPropertyEditor, setShowPropertyEditor] = useState(false);
  const [showRowEditor, setShowRowEditor] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [filters, setFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  // Initialize database if it doesn't exist
  useEffect(() => {
    if (page.type === "database" && !getDatabase(page.id)) {
      // Create default schema based on page title
      const defaultSchema = getDefaultSchema(page.title);
      createDatabase(page.id, defaultSchema);
    }
  }, [page.id, page.type, page.title, getDatabase, createDatabase]);

  const database = getDatabase(page.id);
  const rows = database ? getDatabaseRows(page.id) : [];
  const schema = database ? database.schema : [];

  // Adapt rows to todos format for compatibility with existing views
  const adaptedTodos = useMemo(() => adaptRowsToTodos(rows, schema), [rows, schema]);

  // Get default schema based on page title
  function getDefaultSchema(title) {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("task") || lowerTitle.includes("todo")) {
      return [
        { id: "name", name: "Name", type: PROPERTY_TYPES.TEXT, required: true },
        { id: "status", name: "Status", type: PROPERTY_TYPES.SELECT, options: { choices: ["todo", "in-progress", "done"] } },
        { id: "priority", name: "Priority", type: PROPERTY_TYPES.SELECT, options: { choices: ["high", "medium", "low"] } },
        { id: "dueDate", name: "Due Date", type: PROPERTY_TYPES.DATE },
      ];
    }
    
    if (lowerTitle.includes("event") || lowerTitle.includes("calendar")) {
      return [
        { id: "name", name: "Name", type: PROPERTY_TYPES.TEXT, required: true },
        { id: "date", name: "Date", type: PROPERTY_TYPES.DATE, required: true },
        { id: "time", name: "Time", type: PROPERTY_TYPES.TEXT },
        { id: "description", name: "Description", type: PROPERTY_TYPES.TEXT },
      ];
    }

    // Default schema
    return [
      { id: "name", name: "Name", type: PROPERTY_TYPES.TEXT, required: true },
    ];
  }

  const handleAddProperty = (property) => {
    const newSchema = [...schema, property];
    updateDatabaseSchema(page.id, newSchema);
    setShowPropertyEditor(false);
    setEditingProperty(null);
  };

  const handleUpdateProperty = (propertyId, updates) => {
    const newSchema = schema.map((prop) =>
      prop.id === propertyId ? { ...prop, ...updates } : prop
    );
    updateDatabaseSchema(page.id, newSchema);
    setShowPropertyEditor(false);
    setEditingProperty(null);
  };

  const handleAddRow = (rowData) => {
    // Ensure row has all required properties
    const properties = {};
    schema.forEach((prop) => {
      if (prop.required && !rowData.properties[prop.id]) {
        properties[prop.id] = getDefaultPropertyValue(prop.type);
      } else {
        properties[prop.id] = rowData.properties[prop.id] || getDefaultPropertyValue(prop.type);
      }
    });

    addDatabaseRow(page.id, {
      properties,
      ...rowData,
    });
    setShowRowEditor(false);
    setEditingRow(null);
  };

  const handleUpdateRow = (rowId, updates) => {
    updateDatabaseRow(page.id, rowId, updates);
    setShowRowEditor(false);
    setEditingRow(null);
  };

  const handleDeleteRow = (rowId) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      deleteDatabaseRow(page.id, rowId);
    }
  };

  const handleViewTypeChange = (newViewType) => {
    setViewType(newViewType);
    onUpdatePage(page.id, { viewType: newViewType });
  };

  // Get default value for a property type
  function getDefaultPropertyValue(type) {
    switch (type) {
      case PROPERTY_TYPES.TEXT:
        return "";
      case PROPERTY_TYPES.NUMBER:
        return 0;
      case PROPERTY_TYPES.CHECKBOX:
        return false;
      case PROPERTY_TYPES.DATE:
        return null;
      case PROPERTY_TYPES.SELECT:
      case PROPERTY_TYPES.MULTI_SELECT:
        return [];
      default:
        return null;
    }
  }

  // For backward compatibility: if this is a legacy "Tasks" database, show TodoApp
  const isLegacyTasks = page.title.toLowerCase().includes("task") && rows.length === 0 && !database;

  if (isLegacyTasks) {
    return (
      <section className="database-view" aria-label={`${page.title} database view`}>
        <TodoApp pageId={page.id} viewType={viewType} />
      </section>
    );
  }

  if (!database) {
    return (
      <section className="database-view">
        <div className="database-loading">Loading database...</div>
      </section>
    );
  }

  return (
    <section className="database-view" aria-label={`${page.title} database view`}>
      <DatabaseToolbar
        page={page}
        viewType={viewType}
        onViewTypeChange={handleViewTypeChange}
        onAddProperty={() => {
          setEditingProperty(null);
          setShowPropertyEditor(true);
        }}
        onAddRow={() => {
          setEditingRow(null);
          setShowRowEditor(true);
        }}
        schema={schema}
        rowCount={rows.length}
      />

      {/* View Content */}
      <div className="database-view-content">
        {viewType === "table" && (
          <TableView
            todos={adaptedTodos}
            onUpdate={(rowId, value) => {
              const row = rows.find(r => r.id === rowId);
              if (row) {
                const nameProp = schema.find(p => p.id === "name") || schema[0];
                handleUpdateRow(rowId, { properties: { ...row.properties, [nameProp?.id]: value } });
              }
            }}
            onDelete={handleDeleteRow}
            onToggleComplete={(rowId) => {
              const row = rows.find(r => r.id === rowId);
              if (row) {
                const statusProp = schema.find(p => p.id === "status");
                if (statusProp) {
                  const currentStatus = row.properties[statusProp.id] || "todo";
                  const newStatus = currentStatus === "done" ? "todo" : "done";
                  handleUpdateRow(rowId, { properties: { ...row.properties, [statusProp.id]: newStatus } });
                }
              }
            }}
            onUpdateProperties={(rowId, updates) => {
              const row = rows.find(r => r.id === rowId);
              if (row) {
                handleUpdateRow(rowId, { properties: { ...row.properties, ...updates } });
              }
            }}
          />
        )}

        {viewType === "board" && (
          <BoardView
            rows={rows}
            schema={schema}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
            filters={filters}
          />
        )}

        {viewType === "gallery" && (
          <GalleryView
            rows={rows}
            schema={schema}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
            filters={filters}
          />
        )}

        {viewType === "calendar" && (
          <CalendarView
            rows={rows}
            schema={schema}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
          />
        )}

        {viewType === "list" && (
          <ListView
            rows={rows}
            schema={schema}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
            filters={filters}
            sorting={sorting}
          />
        )}

        {rows.length === 0 && (
          <div className="database-empty-state">
            <p>No rows yet. Click "Add Row" to get started.</p>
          </div>
        )}
      </div>

      {/* Property Editor Modal */}
      {showPropertyEditor && (
        <div className="modal-overlay" onClick={() => setShowPropertyEditor(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <PropertyEditor
              property={editingProperty}
              onSave={editingProperty ? (updates) => handleUpdateProperty(editingProperty.id, updates) : handleAddProperty}
              onCancel={() => {
                setShowPropertyEditor(false);
                setEditingProperty(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Row Editor Modal */}
      {showRowEditor && (
        <div className="modal-overlay" onClick={() => setShowRowEditor(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <RowEditor
              row={editingRow}
              schema={schema}
              onSave={editingRow ? (updates) => handleUpdateRow(editingRow.id, updates) : handleAddRow}
              onCancel={() => {
                setShowRowEditor(false);
                setEditingRow(null);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}

// Simple List View Component
function ListView({ rows, schema, onUpdateRow, onDeleteRow, filters, sorting }) {
  const nameProperty = schema.find((p) => p.id === "name") || schema[0];

  return (
    <div className="list-view">
      {rows.map((row) => (
        <div key={row.id} className="list-view-row">
          <div className="list-view-row-content">
            <div className="list-view-row-title">
              {row.properties[nameProperty?.id] || "Untitled"}
            </div>
            <div className="list-view-row-properties">
              {schema.slice(1, 4).map((prop) => (
                <div key={prop.id} className="list-view-row-property">
                  <span className="property-label">{prop.name}:</span>
                  <span className="property-value">
                    {formatPropertyValue(row.properties[prop.id], prop.type)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="list-view-row-actions">
            <button onClick={() => onUpdateRow(row.id, {})}>Edit</button>
            <button onClick={() => onDeleteRow(row.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Calendar View Component
function CalendarView({ rows, schema, onUpdateRow, onDeleteRow }) {
  const dateProperty = schema.find((p) => p.type === PROPERTY_TYPES.DATE) || schema.find((p) => p.id === "date");
  const nameProperty = schema.find((p) => p.id === "name") || schema[0];

  // Group rows by date
  const rowsByDate = {};
  rows.forEach((row) => {
    const date = row.properties[dateProperty?.id];
    if (date) {
      const dateKey = new Date(date).toDateString();
      if (!rowsByDate[dateKey]) {
        rowsByDate[dateKey] = [];
      }
      rowsByDate[dateKey].push(row);
    }
  });

  return (
    <div className="calendar-view">
      {Object.entries(rowsByDate).map(([date, dateRows]) => (
        <div key={date} className="calendar-view-day">
          <h4>{date}</h4>
          {dateRows.map((row) => (
            <div key={row.id} className="calendar-view-event">
              {row.properties[nameProperty?.id] || "Untitled"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function formatPropertyValue(value, type) {
  if (value === null || value === undefined) return "-";
  
  switch (type) {
    case PROPERTY_TYPES.CHECKBOX:
      return value ? "✓" : "✗";
    case PROPERTY_TYPES.DATE:
      return value ? new Date(value).toLocaleDateString() : "-";
    case PROPERTY_TYPES.SELECT:
    case PROPERTY_TYPES.MULTI_SELECT:
      return Array.isArray(value) ? value.join(", ") : value;
    default:
      return String(value);
  }
}

