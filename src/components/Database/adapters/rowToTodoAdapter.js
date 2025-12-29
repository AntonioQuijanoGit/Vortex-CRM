/**
 * Adapter to convert database rows to todo-like format for compatibility with existing views
 */

export function adaptRowsToTodos(rows, schema) {
  if (!rows || !Array.isArray(rows)) return [];
  
  const nameProp = schema.find(p => p.id === "name") || schema[0];
  const statusProp = schema.find(p => p.id === "status");
  const priorityProp = schema.find(p => p.id === "priority");
  const dueDateProp = schema.find(p => p.id === "dueDate" || p.id === "due_date");
  const tagsProp = schema.find(p => p.id === "tags");
  const typeProp = schema.find(p => p.id === "type");

  return rows.map(row => {
    const properties = row.properties || {};
    
    return {
      id: row.id,
      title: properties[nameProp?.id] || "Untitled",
      completed: statusProp ? (properties[statusProp.id] === "done") : false,
      status: statusProp ? (properties[statusProp.id] || "todo") : "todo",
      priority: priorityProp ? (properties[priorityProp.id] || null) : null,
      dueDate: dueDateProp ? (properties[dueDateProp.id] || null) : null,
      tags: tagsProp ? (Array.isArray(properties[tagsProp.id]) ? properties[tagsProp.id] : []) : [],
      type: typeProp ? (properties[typeProp.id] || "task") : "task",
      createdAt: row.createdAt || new Date().toISOString(),
      // Store original row for reference
      _row: row,
      _properties: properties,
    };
  });
}

