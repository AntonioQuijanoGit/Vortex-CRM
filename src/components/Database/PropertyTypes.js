/**
 * Database Property Types
 */
export const PROPERTY_TYPES = {
  TITLE: "title",
  TEXT: "text",
  NUMBER: "number",
  SELECT: "select",
  MULTI_SELECT: "multi-select",
  DATE: "date",
  CHECKBOX: "checkbox",
  URL: "url",
  EMAIL: "email",
  PHONE: "phone",
  FORMULA: "formula",
  RELATION: "relation",
  ROLLUP: "rollup",
  CREATED_TIME: "created-time",
  LAST_EDITED_TIME: "last-edited-time",
  CREATED_BY: "created-by",
  LAST_EDITED_BY: "last-edited-by",
};

export const PROPERTY_TYPE_LABELS = {
  [PROPERTY_TYPES.TITLE]: "Title",
  [PROPERTY_TYPES.TEXT]: "Text",
  [PROPERTY_TYPES.NUMBER]: "Number",
  [PROPERTY_TYPES.SELECT]: "Select",
  [PROPERTY_TYPES.MULTI_SELECT]: "Multi-select",
  [PROPERTY_TYPES.DATE]: "Date",
  [PROPERTY_TYPES.CHECKBOX]: "Checkbox",
  [PROPERTY_TYPES.URL]: "URL",
  [PROPERTY_TYPES.EMAIL]: "Email",
  [PROPERTY_TYPES.PHONE]: "Phone",
  [PROPERTY_TYPES.FORMULA]: "Formula",
  [PROPERTY_TYPES.RELATION]: "Relation",
  [PROPERTY_TYPES.ROLLUP]: "Rollup",
  [PROPERTY_TYPES.CREATED_TIME]: "Created time",
  [PROPERTY_TYPES.LAST_EDITED_TIME]: "Last edited time",
  [PROPERTY_TYPES.CREATED_BY]: "Created by",
  [PROPERTY_TYPES.LAST_EDITED_BY]: "Last edited by",
};

/**
 * Get default value for a property type
 */
export function getDefaultPropertyValue(type) {
  switch (type) {
    case PROPERTY_TYPES.TITLE:
    case PROPERTY_TYPES.TEXT:
    case PROPERTY_TYPES.URL:
    case PROPERTY_TYPES.EMAIL:
    case PROPERTY_TYPES.PHONE:
      return "";
    case PROPERTY_TYPES.NUMBER:
      return 0;
    case PROPERTY_TYPES.SELECT:
      return null;
    case PROPERTY_TYPES.MULTI_SELECT:
      return [];
    case PROPERTY_TYPES.DATE:
      return null;
    case PROPERTY_TYPES.CHECKBOX:
      return false;
    case PROPERTY_TYPES.FORMULA:
      return "";
    case PROPERTY_TYPES.RELATION:
      return [];
    case PROPERTY_TYPES.ROLLUP:
      return null;
    case PROPERTY_TYPES.CREATED_TIME:
    case PROPERTY_TYPES.LAST_EDITED_TIME:
      return new Date().toISOString();
    default:
      return null;
  }
}

/**
 * Validate property value
 */
export function validatePropertyValue(type, value) {
  switch (type) {
    case PROPERTY_TYPES.EMAIL:
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case PROPERTY_TYPES.URL:
      try {
        new URL(value);
        return true;
      } catch {
        return value === "" || value.startsWith("http://") || value.startsWith("https://");
      }
    case PROPERTY_TYPES.NUMBER:
      return typeof value === "number" && !isNaN(value);
    default:
      return true;
  }
}

