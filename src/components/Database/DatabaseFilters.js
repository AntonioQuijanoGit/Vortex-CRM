import React, { useState } from "react";
import { Icons } from "../../utils/icons";
import "./DatabaseFilters.css";

/**
 * Database Filters Component
 */
export default function DatabaseFilters({ properties, filters, onFiltersChange }) {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const addFilter = (propertyId, operator, value) => {
    const newFilter = {
      id: crypto.randomUUID(),
      propertyId,
      operator,
      value,
    };
    onFiltersChange([...filters, newFilter]);
  };

  const removeFilter = (filterId) => {
    onFiltersChange(filters.filter((f) => f.id !== filterId));
  };

  const updateFilter = (filterId, updates) => {
    onFiltersChange(
      filters.map((f) => (f.id === filterId ? { ...f, ...updates } : f))
    );
  };

  return (
    <div className="database-filters">
      <button
        className="filters-toggle"
        onClick={() => setShowFilterMenu(!showFilterMenu)}
      >
        {Icons.filter} Filters {filters.length > 0 && `(${filters.length})`}
      </button>

      {showFilterMenu && (
        <div className="filters-menu">
          <div className="filters-list">
            {filters.map((filter) => (
              <FilterItem
                key={filter.id}
                filter={filter}
                properties={properties}
                onUpdate={(updates) => updateFilter(filter.id, updates)}
                onRemove={() => removeFilter(filter.id)}
              />
            ))}
          </div>
          <button
            className="add-filter-btn"
            onClick={() => {
              if (properties.length > 0) {
                addFilter(properties[0].id, "equals", "");
              }
            }}
          >
            {Icons.add} Add filter
          </button>
        </div>
      )}

      {filters.length > 0 && (
        <div className="active-filters">
          {filters.map((filter) => {
            const property = properties.find((p) => p.id === filter.propertyId);
            return (
              <span key={filter.id} className="filter-tag">
                {property?.name} {filter.operator} {filter.value}
                <button onClick={() => removeFilter(filter.id)}>{Icons.close}</button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterItem({ filter, properties, onUpdate, onRemove }) {
  const property = properties.find((p) => p.id === filter.propertyId);

  const operators = {
    text: ["equals", "contains", "does not contain", "is empty", "is not empty"],
    number: ["equals", "greater than", "less than", "is empty", "is not empty"],
    date: ["equals", "before", "after", "is empty", "is not empty"],
    checkbox: ["is checked", "is not checked"],
    select: ["equals", "does not equal", "is empty", "is not empty"],
  };

  const getOperators = () => {
    if (!property) return operators.text;
    return operators[property.type] || operators.text;
  };

  return (
    <div className="filter-item">
      <select
        value={filter.propertyId}
        onChange={(e) => onUpdate({ propertyId: e.target.value })}
      >
        {properties.map((prop) => (
          <option key={prop.id} value={prop.id}>
            {prop.name}
          </option>
        ))}
      </select>

      <select
        value={filter.operator}
        onChange={(e) => onUpdate({ operator: e.target.value })}
      >
        {getOperators().map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      {!["is empty", "is not empty", "is checked", "is not checked"].includes(
        filter.operator
      ) && (
        <input
          type={property?.type === "number" ? "number" : "text"}
          value={filter.value}
          onChange={(e) => onUpdate({ value: e.target.value })}
          placeholder="Value"
        />
      )}

      <button onClick={onRemove} aria-label="Remove filter">
        {Icons.delete}
      </button>
    </div>
  );
}

