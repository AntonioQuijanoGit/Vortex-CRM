import React, { useState } from "react";
import { Icons } from "../../../utils/icons";
import "./GalleryView.css";

/**
 * Gallery View - Card-based view for database items
 */
export default function GalleryView({
  items = [],
  properties = [],
  onUpdate,
  onDelete,
  onToggleComplete,
  onUpdateProperties,
}) {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleSelect = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const getTitleProperty = () => {
    return properties.find((p) => p.type === "title") || properties[0];
  };

  const getDisplayProperties = () => {
    return properties.filter((p) => p.type !== "title").slice(0, 3);
  };

  const formatValue = (value, type) => {
    if (value === null || value === undefined) return "-";
    
    switch (type) {
      case "date":
        return new Date(value).toLocaleDateString();
      case "checkbox":
        return value ? Icons.check : "";
      case "number":
        return typeof value === "number" ? value.toString() : "-";
      case "multi-select":
        return Array.isArray(value) ? value.join(", ") : "-";
      default:
        return String(value);
    }
  };

  const titleProp = getTitleProperty();
  const displayProps = getDisplayProperties();

  return (
    <div className="gallery-view">
      <div className="gallery-grid">
        {items.length === 0 ? (
          <div className="gallery-empty">
            <span>No items to display</span>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`gallery-card ${item.completed ? "completed" : ""} ${
                selectedItems.has(item.id) ? "selected" : ""
              }`}
              onClick={() => toggleSelect(item.id)}
            >
              <div className="gallery-card-header">
                <button
                  className="gallery-checkbox"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(item.id);
                  }}
                >
                  {item.completed && Icons.check}
                </button>
                <button
                  className="gallery-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  aria-label="Delete"
                >
                  {Icons.delete}
                </button>
              </div>

              <div className="gallery-card-content">
                <div className="gallery-card-title">
                  {titleProp && item.properties?.[titleProp.id]
                    ? formatValue(item.properties[titleProp.id], titleProp.type)
                    : "Untitled"}
                </div>

                <div className="gallery-card-properties">
                  {displayProps.map((prop) => (
                    <div key={prop.id} className="gallery-property">
                      <span className="gallery-property-label">{prop.name}:</span>
                      <span className="gallery-property-value">
                        {formatValue(item.properties?.[prop.id], prop.type)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

