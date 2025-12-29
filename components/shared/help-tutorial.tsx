"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const tutorialSteps = [
  {
    title: "Welcome to CRM",
    content: (
      <div className="space-y-6 py-2">
        <p className="text-base leading-relaxed text-muted-foreground">
          This is a complete CRM application for managing contacts, deals, and sales pipelines.
        </p>
        <div>
          <h3 className="font-semibold text-lg mb-4">Key Features:</h3>
          <ul className="list-disc list-inside space-y-3 text-base text-muted-foreground leading-relaxed">
            <li>Manage contacts with full CRUD operations</li>
            <li>Track deals through a visual Kanban pipeline</li>
            <li>View analytics and performance metrics</li>
            <li>Export and import your data</li>
          </ul>
        </div>
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <h3 className="font-semibold text-base mb-2">📦 About Your Data</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>All data is stored locally</strong> in your browser's localStorage. When you first open the app, 
            sample data (100 contacts, 60 deals) is automatically generated using realistic fake data. 
            Everything you create, edit, or delete is saved instantly to your browser. 
            <strong className="block mt-2">⚠️ Important:</strong> If you clear your browser data, all your CRM data will be lost. 
            Use the Export feature in Settings to backup your data regularly.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Dashboard",
    content: (
      <div className="space-y-6 py-2">
        <p className="text-base leading-relaxed text-muted-foreground">
          The dashboard gives you a quick overview of your CRM activity.
        </p>
        <div>
          <h3 className="font-semibold text-lg mb-4">What you&apos;ll find:</h3>
          <ul className="list-disc list-inside space-y-3 text-base text-muted-foreground leading-relaxed">
            <li><strong>Stats Cards:</strong> Total contacts, active deals, monthly revenue, and win rate</li>
            <li><strong>Revenue Chart:</strong> Visualize revenue trends over the last 6 months</li>
            <li><strong>Activity Feed:</strong> See recent actions and updates</li>
            <li><strong>Quick Actions:</strong> Fast access to common tasks</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Contacts",
    content: (
      <div className="space-y-6 py-2">
        <p className="text-base leading-relaxed text-muted-foreground">
          Manage all your contacts in one place.
        </p>
        <div>
          <h3 className="font-semibold text-lg mb-4">How to use:</h3>
          <ul className="list-disc list-inside space-y-3 text-base text-muted-foreground leading-relaxed">
            <li><strong>Search:</strong> Use the search bar to find contacts by name, email, or company</li>
            <li><strong>View Details:</strong> Click on any contact to see full information, deals, activity, and notes</li>
            <li><strong>Add Contact:</strong> Click &quot;Add Contact&quot; button to create a new contact</li>
            <li><strong>Edit/Delete:</strong> Use the menu (⋯) on each contact row to edit or delete</li>
            <li><strong>Bulk Actions:</strong> Select multiple contacts to perform bulk operations</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Pipeline (Kanban)",
    content: (
      <div className="space-y-6 py-2">
        <p className="text-base leading-relaxed text-muted-foreground">
          Visualize and manage your sales pipeline with drag & drop.
        </p>
        <div>
          <h3 className="font-semibold text-lg mb-4">Features:</h3>
          <ul className="list-disc list-inside space-y-3 text-base text-muted-foreground leading-relaxed">
            <li><strong>Drag & Drop:</strong> Move deals between stages by dragging them to different columns</li>
            <li><strong>Deal Cards:</strong> Each card shows contact, value, close date, and tags</li>
            <li><strong>Status Columns:</strong> Lead → Contacted → Proposal → Negotiation → Won/Lost</li>
            <li><strong>Add Deal:</strong> Click &quot;Add Deal&quot; button to create a new deal</li>
            <li><strong>View Deal:</strong> Click on any deal card to view and edit details</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Analytics",
    content: (
      <div className="space-y-6 py-2">
        <p className="text-base leading-relaxed text-muted-foreground">
          Analyze your sales performance with visual charts and metrics.
        </p>
        <div>
          <h3 className="font-semibold text-lg mb-4">Available insights:</h3>
          <ul className="list-disc list-inside space-y-3 text-base text-muted-foreground leading-relaxed">
            <li><strong>Revenue Over Time:</strong> Track revenue trends with an interactive line chart</li>
            <li><strong>Deals Won vs Lost:</strong> See conversion rates with a pie chart</li>
            <li><strong>Top Contacts:</strong> View your highest value contacts in a bar chart</li>
            <li><strong>Key Metrics:</strong> Total revenue, average deal size, conversion rate, and more</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Keyboard Shortcuts",
    content: (
      <div className="space-y-6 py-2">
        <p className="text-base leading-relaxed text-muted-foreground">
          Work faster with these keyboard shortcuts:
        </p>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-base font-medium">Open Command Palette</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-foreground bg-background border border-border rounded-md shadow-sm">
              Ctrl + K
            </kbd>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-base font-medium">Close dialogs</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-foreground bg-background border border-border rounded-md shadow-sm">
              Esc
            </kbd>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-base font-medium">Focus search</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-foreground bg-background border border-border rounded-md shadow-sm">
              /
            </kbd>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Data Storage & Management",
    content: (
      <div className="space-y-6 py-2">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-base mb-2 text-blue-900 dark:text-blue-100">
              📦 Where Your Data Lives
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              All your CRM data is stored <strong>locally in your browser</strong> using localStorage. 
              There is no backend server or external database - everything runs entirely in your browser.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Initial Data Generation</h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-3">
              When you first open the app, it automatically generates sample data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground leading-relaxed">
              <li><strong>100 contacts</strong> with realistic names, emails, and companies</li>
              <li><strong>60 deals</strong> across different pipeline stages</li>
              <li><strong>200+ activities</strong> and notes associated with contacts and deals</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3 italic">
              This data is generated using @faker-js/faker for demonstration purposes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Automatic Saving</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Every change you make (create, edit, delete) is <strong>automatically saved</strong> to localStorage. 
              Your data persists between browser sessions, but will be lost if you clear your browser data.
            </p>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold text-base mb-2 text-amber-900 dark:text-amber-100">
              ⚠️ Important: Backup Your Data
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              Since data is stored locally, make sure to <strong>export your data regularly</strong> from Settings. 
              You can export as JSON (for backup) or CSV (for Excel). If you clear your browser cache or use a different browser, 
              you'll need to import your exported data.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Data Export Options</h3>
            <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground leading-relaxed">
              <li><strong>JSON Export:</strong> Complete backup of all your data</li>
              <li><strong>CSV Export:</strong> Export contacts or deals to Excel/Google Sheets</li>
              <li><strong>PDF Reports:</strong> Generate formatted reports</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
];

export function HelpTutorial() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative"
        aria-label="Help & Tutorial"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">CRM Tutorial & Help</DialogTitle>
            <DialogDescription className="text-base">
              Learn how to use the CRM application effectively
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? "bg-primary w-8"
                        : "bg-muted w-2 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {currentStep + 1} / {tutorialSteps.length}
              </div>
            </div>

            <div className="min-h-[300px]">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{tutorialSteps[currentStep].title}</h3>
                {tutorialSteps[currentStep].content}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="min-w-[100px]"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={nextStep}
                disabled={currentStep === tutorialSteps.length - 1}
                className="min-w-[100px]"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end pt-4">
            <Button onClick={() => setOpen(false)} className="min-w-[100px]">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
