"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, X } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to CRM!",
    description: "This is your dashboard where you can see an overview of your contacts, deals, and revenue. All data is stored locally in your browser - when you first open the app, sample data is automatically generated. Click the help icon (?) in the header for a complete tutorial.",
  },
  {
    title: "Contacts",
    description: "Manage all your contacts here. You can add, edit, and organize them with tags and filters.",
    target: 'a[href="/contacts"]',
  },
  {
    title: "Pipeline",
    description: "Track your deals through the sales pipeline. Drag and drop deals between stages or use the table view.",
    target: 'a[href="/pipeline"]',
  },
  {
    title: "Analytics",
    description: "View detailed analytics and reports about your sales performance and revenue trends.",
    target: 'a[href="/analytics"]',
  },
  {
    title: "Quick Actions",
    description: "Use Ctrl+K (or Cmd+K on Mac) to open the command palette for quick navigation and search.",
  },
];

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSeenTour = localStorage.getItem("vortex-has-seen-tour");
    if (!hasSeenTour) {
      // Show tour after a short delay
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    if (dontShowAgain && typeof window !== "undefined") {
      localStorage.setItem("vortex-has-seen-tour", "true");
    }
    setIsOpen(false);
  };

  const currentStepData = tourSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription>{currentStepData.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <Label htmlFor="dont-show" className="text-sm">
              Don&apos;t show this again
            </Label>
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleFinish}>
                Skip
              </Button>
              <Button onClick={handleNext}>
                {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
                {currentStep < tourSteps.length - 1 && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



