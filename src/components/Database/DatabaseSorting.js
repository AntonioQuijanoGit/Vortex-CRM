import React, { useState } from "react";
import { Icons } from "../../utils/icons";
import "./DatabaseSorting.css";

/**
 * Database Sorting Component
 */
export default function DatabaseSorting({ properties, sorts, onSortsChange }) {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const addSort = (propertyId, direction = "asc") => {
    const newSort = {
      id: crypto.randomUUID(),
      propertyId,
      direction,
    };
    onSortsChange([...sorts, newSort]);
  };

  const removeSort = (sortId) => {
    onSortsChange(sorts.filter((s) => s.id !== sortId));
  };

  const updateSort = (sortId, updates) => {
    onSortsChange(
      sorts.map((s) => (s.id === sortId ? { ...s, ...updates } : s))
    );
  };

  return (
    <div className="database-sorting">
      <button
        className="sorting-toggle"
        onClick={() => setShowSortMenu(!showSortMenu)}
      >
        {Icons.sort} Sort {sorts.length > 0 && `(${sorts.length})`}
      </button>

      {showSortMenu && (
        <div className="sorting-menu">
          <div className="sorts-list">
            {sorts.map((sort, index) => (
              <SortItem
                key={sort.id}
                sort={sort}
                index={index}
                properties={properties}
                onUpdate={(updates) => updateSort(sort.id, updates)}
                onRemove={() => removeSort(sort.id)}
              />
            ))}
          </div>
          <button
            className="add-sort-btn"
            onClick={() => {
              if (properties.length > 0) {
                addSort(properties[0].id, "asc");
              }
            }}
          >
            {Icons.add} Add sort
          </button>
        </div>
      )}
    </div>
  );
}

function SortItem({ sort, index, properties, onUpdate, onRemove }) {
  return (
    <div className="sort-item">
      <span className="sort-index">{index + 1}</span>
      <select
        value={sort.propertyId}
        onChange={(e) => onUpdate({ propertyId: e.target.value })}
      >
        {properties.map((prop) => (
          <option key={prop.id} value={prop.id}>
            {prop.name}
          </option>
        ))}
      </select>
      <select
        value={sort.direction}
        onChange={(e) => onUpdate({ direction: e.target.value })}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button onClick={onRemove} aria-label="Remove sort">
        {Icons.delete}
      </button>
    </div>
  );
}

