"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Users, TrendingUp, BarChart3, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./welcome-screen.css";

export function WelcomeScreen() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("vortex-crm-welcome-seen");
    if (hasSeenWelcome === "true") {
      setShowWelcome(false);
    }
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("vortex-crm-welcome-seen", "true");
  };

  const getStarted = () => {
    closeWelcome();
    setTimeout(() => {
      const mainContent = document.querySelector("main");
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  if (!showWelcome) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="welcome-overlay"
        onClick={closeWelcome}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="welcome-container crm-welcome"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Background decorative elements */}
          <div className="welcome-bg crm-bg">
            <div className="crm-grid-lines">
              <div className="grid-line line-1"></div>
              <div className="grid-line line-2"></div>
              <div className="grid-line line-3"></div>
            </div>
            <div className="crm-geometric-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>

          {/* Close button */}
          <button
            className="welcome-close"
            onClick={closeWelcome}
            aria-label="Close welcome screen"
          >
            <X size={20} strokeWidth={2} />
          </button>

          {/* Content */}
          <div className="welcome-content">
            <div className="welcome-icon-wrapper crm-icon-wrapper">
              <div className="crm-icon-large">📊</div>
              <div className="crm-pulse-dots">
                <div className="pulse-dot"></div>
                <div className="pulse-dot"></div>
                <div className="pulse-dot"></div>
              </div>
            </div>

            <h1 className="welcome-title">Vortex CRM</h1>

            <p className="welcome-description">
              Manage contacts, track deals, and analyze sales performance. Streamline your 
              customer relationship management with powerful tools and enterprise-level architecture.
            </p>

            <div className="welcome-features">
              <div className="welcome-feature crm-feature">
                <div className="feature-icon-wrapper crm-icon">
                  <Users size={20} strokeWidth={2} />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Contact Management</h3>
                  <p className="feature-desc">
                    Comprehensive contact profiles with notes and interaction history
                  </p>
                </div>
              </div>

              <div className="welcome-feature crm-feature">
                <div className="feature-icon-wrapper crm-icon">
                  <TrendingUp size={20} strokeWidth={2} />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Sales Pipeline</h3>
                  <p className="feature-desc">
                    Visual pipeline with drag-and-drop deal management
                  </p>
                </div>
              </div>

              <div className="welcome-feature crm-feature">
                <div className="feature-icon-wrapper crm-icon">
                  <BarChart3 size={20} strokeWidth={2} />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Analytics Dashboard</h3>
                  <p className="feature-desc">
                    Real-time metrics, charts, and performance indicators
                  </p>
                </div>
              </div>
            </div>

            <button className="welcome-button crm-button" onClick={getStarted}>
              Get Started
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

