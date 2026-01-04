/**
 * Advanced search parser for CRM
 * Supports operators like: value > 1000, status:won, tag:important
 */

export interface SearchQuery {
  text?: string;
  operators: {
    field: string;
    operator: ">" | "<" | ">=" | "<=" | "=" | ":" | "!=";
    value: string | number;
  }[];
}

export function parseSearchQuery(query: string): SearchQuery {
  const operators: SearchQuery["operators"] = [];
  let textQuery = query;

  // Parse field operators (field:value or field=value)
  const fieldPattern = /(\w+)[:=](["']?)([^"'\s]+)\2/g;
  let match;
  while ((match = fieldPattern.exec(query)) !== null) {
    const [, field, , value] = match;
    operators.push({
      field: field.toLowerCase(),
      operator: ":",
      value: parseValue(value),
    });
    textQuery = textQuery.replace(match[0], "").trim();
  }

  // Parse comparison operators (field > value, field < value, etc.)
  const comparisonPattern = /(\w+)\s*(>=|<=|>|<|!=)\s*(\d+)/g;
  while ((match = comparisonPattern.exec(query)) !== null) {
    const [, field, op, value] = match;
    operators.push({
      field: field.toLowerCase(),
      operator: op as any,
      value: parseFloat(value),
    });
    textQuery = textQuery.replace(match[0], "").trim();
  }

  return {
    text: textQuery || undefined,
    operators,
  };
}

function parseValue(value: string): string | number {
  // Try to parse as number
  const num = parseFloat(value);
  if (!isNaN(num) && isFinite(num)) {
    return num;
  }
  return value;
}

export function applySearchQuery<T extends Record<string, any>>(
  items: T[],
  query: SearchQuery,
  fieldMappings: Record<string, (item: T) => any>
): T[] {
  return items.filter((item) => {
    // Text search
    if (query.text) {
      const searchText = query.text.toLowerCase();
      const matchesText = Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchText);
        }
        return false;
      });
      if (!matchesText) return false;
    }

    // Operator filters
    for (const op of query.operators) {
      const getValue = fieldMappings[op.field] || ((item: T) => item[op.field]);
      const itemValue = getValue(item);

      if (itemValue === undefined || itemValue === null) {
        if (op.operator === "!=") continue;
        return false;
      }

      let matches = false;
      switch (op.operator) {
        case ">":
          matches = Number(itemValue) > Number(op.value);
          break;
        case "<":
          matches = Number(itemValue) < Number(op.value);
          break;
        case ">=":
          matches = Number(itemValue) >= Number(op.value);
          break;
        case "<=":
          matches = Number(itemValue) <= Number(op.value);
          break;
        case "=":
        case ":":
          if (Array.isArray(itemValue)) {
            matches = itemValue.some((v) =>
              String(v).toLowerCase().includes(String(op.value).toLowerCase())
            );
          } else {
            matches = String(itemValue).toLowerCase().includes(String(op.value).toLowerCase());
          }
          break;
        case "!=":
          matches = !String(itemValue).toLowerCase().includes(String(op.value).toLowerCase());
          break;
      }

      if (!matches) return false;
    }

    return true;
  });
}









