import React, { useState } from "react";
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS, getDefaultPropertyValue, validatePropertyValue } from "./PropertyTypes";
import { Icons } from "../../utils/icons";
import "./PropertyEditor.css";

/**
 * Property Editor - Add/Edit database properties
 */
export default function PropertyEditor({ property, onSave, onCancel }) {
  const [name, setName] = useState(property?.name || "");
  const [type, setType] = useState(property?.type || PROPERTY_TYPES.TEXT);
  const [options, setOptions] = useState(property?.options || {});
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("Property name is required");
      return;
    }

    const propertyData = {
      id: property?.id || crypto.randomUUID(),
      name: name.trim(),
      type,
      options: getOptionsForType(type, options),
    };

    onSave(propertyData);
  };

  const getOptionsForType = (propType, currentOptions) => {
    switch (propType) {
      case PROPERTY_TYPES.SELECT:
      case PROPERTY_TYPES.MULTI_SELECT:
        return {
          ...currentOptions,
          choices: currentOptions.choices || [],
        };
      case PROPERTY_TYPES.FORMULA:
        return {
          ...currentOptions,
          formula: currentOptions.formula || "",
        };
      case PROPERTY_TYPES.RELATION:
        return {
          ...currentOptions,
          relatedDatabaseId: currentOptions.relatedDatabaseId || null,
        };
      case PROPERTY_TYPES.ROLLUP:
        return {
          ...currentOptions,
          relationPropertyId: currentOptions.relationPropertyId || null,
          rollupPropertyId: currentOptions.rollupPropertyId || null,
          function: currentOptions.function || "count",
        };
      default:
        return {};
    }
  };

  return (
    <div className="property-editor">
      <div className="property-editor-header">
        <h3>{property ? "Edit Property" : "Add Property"}</h3>
        <button className="close-btn" onClick={onCancel} aria-label="Close">
          {Icons.close}
        </button>
      </div>

      <div className="property-editor-content">
        <div className="property-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Property name"
            autoFocus
          />
        </div>

        <div className="property-field">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Type-specific options */}
        {(type === PROPERTY_TYPES.SELECT || type === PROPERTY_TYPES.MULTI_SELECT) && (
          <SelectOptionsEditor
            choices={options.choices || []}
            onChange={(choices) => setOptions({ ...options, choices })}
          />
        )}

        {type === PROPERTY_TYPES.FORMULA && (
          <div className="property-field">
            <label>Formula</label>
            <input
              type="text"
              value={options.formula || ""}
              onChange={(e) => setOptions({ ...options, formula: e.target.value })}
              placeholder="e.g., prop('Price') * prop('Quantity')"
            />
          </div>
        )}

        {error && <div className="property-error">{error}</div>}

        <div className="property-editor-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            {property ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SelectOptionsEditor({ choices, onChange }) {
  const [newChoice, setNewChoice] = useState("");

  const addChoice = () => {
    if (newChoice.trim() && !choices.includes(newChoice.trim())) {
      onChange([...choices, newChoice.trim()]);
      setNewChoice("");
    }
  };

  const removeChoice = (index) => {
    onChange(choices.filter((_, i) => i !== index));
  };

  return (
    <div className="select-options-editor">
      <label>Options</label>
      <div className="choices-list">
        {choices.map((choice, index) => (
          <div key={index} className="choice-item">
            <span>{choice}</span>
            <button onClick={() => removeChoice(index)} aria-label="Remove">
              {Icons.delete}
            </button>
          </div>
        ))}
      </div>
      <div className="add-choice">
        <input
          type="text"
          value={newChoice}
          onChange={(e) => setNewChoice(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addChoice()}
          placeholder="Add option"
        />
        <button onClick={addChoice}>{Icons.add}</button>
      </div>
    </div>
  );
}

