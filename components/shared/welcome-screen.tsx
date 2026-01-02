"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Users, TrendingUp, BarChart3, Sparkles } from "lucide-react";
import { VortexIcon } from "./vortex-icon";
import { Button } from "@/components/ui/button";

export function WelcomeScreen() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const hasSeenWelcome = localStorage.getItem("vortex-crm-welcome-seen");
      if (hasSeenWelcome !== "true") {
        // Small delay to ensure page is loaded
        setTimeout(() => setShowWelcome(true), 300);
      }
    }
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("vortex-crm-welcome-seen", "true");
    }
  };

  const getStarted = () => {
    closeWelcome();
  };

  if (!mounted || !showWelcome) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm transition-opacity duration-300"
      onClick={closeWelcome}
    >
      <div
        className="relative w-full max-w-6xl mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-accent transition-colors"
          onClick={closeWelcome}
          aria-label="Close welcome screen"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero Section - Horizontal Layout */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch min-h-[500px]">
          {/* Left side - Branding */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
            <div className="mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center backdrop-blur-sm">
                  <VortexIcon size={48} className="text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Vortex
            </h1>

            <p className="text-lg text-muted-foreground text-center max-w-md">
              Modern CRM built for teams who value design and performance
            </p>
          </div>

          {/* Right side - Features */}
          <div className="flex-1 flex flex-col justify-center p-8 md:p-12 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-foreground">
                Everything you need
              </h2>
              <p className="text-muted-foreground">
                Manage your business relationships in one place
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: Users,
                  title: "Contact Management",
                  description: "Organize and track all your customer relationships",
                },
                {
                  icon: TrendingUp,
                  title: "Sales Pipeline",
                  description: "Visualize and manage deals through every stage",
                },
                {
                  icon: BarChart3,
                  title: "Analytics & Insights",
                  description: "Make data-driven decisions with real-time metrics",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                onClick={getStarted}
                size="lg"
                className="w-full md:w-auto"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
