"use client";

import { useEffect, useState } from "react";
import { useExtendedStore } from "@/lib/store-extended";
import { useCRMStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { CustomReportDialog } from "@/components/reports/custom-report-dialog";
import { exportToCSV } from "@/lib/utils/csv-export";

export default function ReportsPage() {
  const customReports = useExtendedStore((state) => state.customReports);
  const deleteCustomReport = useExtendedStore((state) => state.deleteCustomReport);
  const loadExtendedData = useExtendedStore((state) => state.loadExtendedData);
  const contacts = useCRMStore((state) => state.contacts);
  const deals = useCRMStore((state) => state.deals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadExtendedData();
  }, [loadExtendedData]);

  const handleExportReport = (report: typeof customReports[0]) => {
    if (report.type === "contacts") {
      const filtered = useCRMStore.getState().filterContacts(report.filters as any);
      exportToCSV(filtered, report.name, [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "company", label: "Company" },
        { key: "value", label: "Value" },
        { key: "status", label: "Status" },
      ]);
    } else if (report.type === "deals") {
      const filtered = useCRMStore.getState().filterDeals(report.filters as any);
      exportToCSV(filtered, report.name, [
        { key: "title", label: "Title" },
        { key: "value", label: "Value" },
        { key: "status", label: "Status" },
        { key: "closeDate", label: "Close Date" },
      ]);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Custom Reports</h1>
                <p className="text-muted-foreground mt-1">
                  Create and manage custom reports
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Report
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {customReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">
                      {report.type}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {report.fields.length} fields selected
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportReport(report)}
                      >
                        Export
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this report?")) {
                            deleteCustomReport(report.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {customReports.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No custom reports yet
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Report
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      <CustomReportDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => setIsDialogOpen(false)}
      />
    </div>
  );
}









