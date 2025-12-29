/**
 * CSV Export Utilities
 */

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // If columns not provided, use all keys from first item
  const headers = columns || Object.keys(data[0]).map((key) => ({ key, label: key as string }));

  // Create CSV content
  const csvHeaders = headers.map((col) => escapeCSV(col.label)).join(",");
  const csvRows = data.map((row) =>
    headers
      .map((col) => {
        const value = row[col.key];
        if (value === null || value === undefined) return "";
        if (Array.isArray(value)) return escapeCSV(value.join("; "));
        if (typeof value === "object") return escapeCSV(JSON.stringify(value));
        return escapeCSV(String(value));
      })
      .join(",")
  );

  const csvContent = [csvHeaders, ...csvRows].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportContactsToCSV(contacts: any[]) {
  exportToCSV(
    contacts,
    "contacts",
    [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "company", label: "Company" },
      { key: "position", label: "Position" },
      { key: "value", label: "Value" },
      { key: "status", label: "Status" },
      { key: "tags", label: "Tags" },
      { key: "createdAt", label: "Created At" },
    ]
  );
}

export function exportDealsToCSV(deals: any[]) {
  exportToCSV(
    deals,
    "deals",
    [
      { key: "title", label: "Title" },
      { key: "value", label: "Value" },
      { key: "status", label: "Status" },
      { key: "probability", label: "Probability (%)" },
      { key: "closeDate", label: "Close Date" },
      { key: "tags", label: "Tags" },
      { key: "createdAt", label: "Created At" },
    ]
  );
}









