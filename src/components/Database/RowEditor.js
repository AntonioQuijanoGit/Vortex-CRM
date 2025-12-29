import React, { useState, useEffect } from "react";
import { Icons } from "../../utils/icons";
import { PROPERTY_TYPES } from "./PropertyTypes";
import "./RowEditor.css";

export function RowEditor({ row, schema, onSave, onCancel }) {
  const [properties, setProperties] = useState({});

  useEffect(() => {
    if (row) {
      setProperties(row.properties || {});
    } else {
      // Initialize with default values
      const defaults = {};
      schema.forEach((prop) => {
        defaults[prop.id] = getDefaultValue(prop);
      });
      setProperties(defaults);
    }
  }, [row, schema]);

  const getDefaultValue = (property) => {
    if (row && row.properties && row.properties[property.id] !== undefined) {
      return row.properties[property.id];
    }
    
    switch (property.type) {
      case PROPERTY_TYPES.TEXT:
        return "";
      case PROPERTY_TYPES.NUMBER:
        return 0;
      case PROPERTY_TYPES.CHECKBOX:
        return false;
      case PROPERTY_TYPES.DATE:
        return "";
      case PROPERTY_TYPES.SELECT:
        return "";
      case PROPERTY_TYPES.MULTI_SELECT:
        return [];
      default:
        return null;
    }
  };

  const handlePropertyChange = (propertyId, value) => {
    setProperties((prev) => ({
      ...prev,
      [propertyId]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      properties,
    });
  };

  return (
    <div className="row-editor">
      <div className="row-editor-header">
        <h3>{row ? "Edit Row" : "New Row"}</h3>
        <button className="row-editor-close" onClick={onCancel} aria-label="Close">
          {Icons.close}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="row-editor-form">
        {schema.map((property) => (
          <div key={property.id} className="row-editor-field">
            <label htmlFor={property.id}>
              {property.name}
              {property.required && <span className="required">*</span>}
            </label>
            
            {property.type === PROPERTY_TYPES.TEXT && (
              <input
                type="text"
                id={property.id}
                value={properties[property.id] || ""}
                onChange={(e) => handlePropertyChange(property.id, e.target.value)}
                required={property.required}
                placeholder={`Enter ${property.name.toLowerCase()}`}
              />
            )}

            {property.type === PROPERTY_TYPES.NUMBER && (
              <input
                type="number"
                id={property.id}
                value={properties[property.id] || 0}
                onChange={(e) => handlePropertyChange(property.id, parseFloat(e.target.value) || 0)}
                required={property.required}
              />
            )}

            {property.type === PROPERTY_TYPES.CHECKBOX && (
              <input
                type="checkbox"
                id={property.id}
                checked={properties[property.id] || false}
                onChange={(e) => handlePropertyChange(property.id, e.target.checked)}
              />
            )}

            {property.type === PROPERTY_TYPES.DATE && (
              <input
                type="date"
                id={property.id}
                value={properties[property.id] || ""}
                onChange={(e) => handlePropertyChange(property.id, e.target.value)}
                required={property.required}
              />
            )}

            {property.type === PROPERTY_TYPES.SELECT && (
              <select
                id={property.id}
                value={properties[property.id] || ""}
                onChange={(e) => handlePropertyChange(property.id, e.target.value)}
                required={property.required}
              >
                <option value="">Select...</option>
                {(property.options?.choices || []).map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            )}

            {property.type === PROPERTY_TYPES.MULTI_SELECT && (
              <div className="multi-select-editor">
                {(property.options?.choices || []).map((choice) => (
                  <label key={choice} className="multi-select-option">
                    <input
                      type="checkbox"
                      checked={(properties[property.id] || []).includes(choice)}
                      onChange={(e) => {
                        const current = properties[property.id] || [];
                        const updated = e.target.checked
                          ? [...current, choice]
                          : current.filter((c) => c !== choice);
                        handlePropertyChange(property.id, updated);
                      }}
                    />
                    {choice}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="row-editor-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {row ? "Update" : "Create"} Row
          </button>
        </div>
      </form>
    </div>
  );
}

