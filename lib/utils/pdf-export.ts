/**
 * PDF Export Utilities using jsPDF
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PDFColumn {
  header: string;
  dataKey: string;
  width?: number;
}

export function exportToPDF<T extends Record<string, any>>(
  data: T[],
  filename: string,
  title: string,
  columns: PDFColumn[]
) {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  // Prepare table data
  const tableData = data.map((row) =>
    columns.map((col) => {
      const value = row[col.dataKey];
      if (value === null || value === undefined) return "";
      if (Array.isArray(value)) return value.join(", ");
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    })
  );

  const tableHeaders = columns.map((col) => col.header);

  // Add table
  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: 35,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  // Save PDF
  doc.save(`${filename}_${new Date().toISOString().split("T")[0]}.pdf`);
}

export function exportContactsToPDF(contacts: any[]) {
  exportToPDF(
    contacts,
    "contacts",
    "Contacts Export",
    [
      { header: "Name", dataKey: "name", width: 50 },
      { header: "Email", dataKey: "email", width: 60 },
      { header: "Company", dataKey: "company", width: 50 },
      { header: "Value", dataKey: "value", width: 30 },
      { header: "Status", dataKey: "status", width: 30 },
      { header: "Tags", dataKey: "tags", width: 40 },
    ]
  );
}

export function exportDealsToPDF(deals: any[]) {
  exportToPDF(
    deals,
    "deals",
    "Deals Export",
    [
      { header: "Title", dataKey: "title", width: 60 },
      { header: "Value", dataKey: "value", width: 30 },
      { header: "Status", dataKey: "status", width: 30 },
      { header: "Probability", dataKey: "probability", width: 30 },
      { header: "Close Date", dataKey: "closeDate", width: 40 },
      { header: "Tags", dataKey: "tags", width: 40 },
    ]
  );
}



