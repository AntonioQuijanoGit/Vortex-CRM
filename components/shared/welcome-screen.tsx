"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Users, TrendingUp, BarChart3, LayoutDashboard, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { safeLocalStorageGetItem, safeLocalStorageSetItem } from "@/lib/utils";
import "./welcome-screen.css";

export function WelcomeScreen() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const hasSeenWelcome = safeLocalStorageGetItem("vortex-crm-welcome-seen");
        if (hasSeenWelcome === "true") {
          setShowWelcome(false);
        }
      }
    } catch (error) {
      // Silently fail - show welcome screen if localStorage is not available
      console.warn("Could not check welcome screen status:", error);
    }
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    try {
      if (typeof window !== "undefined") {
        safeLocalStorageSetItem("vortex-crm-welcome-seen", "true");
      }
    } catch (error) {
      // Silently fail - localStorage might not be available
      console.warn("Could not save welcome screen status:", error);
    }
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
            <div className="crm-gradient-orb orb-1"></div>
            <div className="crm-gradient-orb orb-2"></div>
            <div className="crm-gradient-orb orb-3"></div>
            <div className="crm-grid-pattern"></div>
          </div>

          {/* Close button */}
          <button
            className="welcome-close"
            onClick={closeWelcome}
            aria-label="Close welcome screen"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          {/* Content */}
          <div className="welcome-content">
            {/* Main Icon */}
            <motion.div 
              className="welcome-icon-wrapper crm-icon-wrapper"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                damping: 15, 
                stiffness: 200,
                delay: 0.2
              }}
            >
              <div className="crm-icon-bg"></div>
              <LayoutDashboard className="crm-icon-large" size={64} strokeWidth={1.5} />
              <motion.div
                className="crm-icon-glow"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <motion.h1 
              className="welcome-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Vortex CRM
            </motion.h1>

            <motion.p 
              className="welcome-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Modern CRM platform to manage contacts, track deals, and analyze sales performance. 
              Built with Next.js, TypeScript, and Tailwind CSS.
            </motion.p>

            <div className="welcome-features">
              <motion.div 
                className="welcome-feature crm-feature"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="feature-icon-wrapper crm-icon">
                  <Users size={18} strokeWidth={2} />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Contact Management</h3>
                  <p className="feature-desc">
                    Comprehensive contact profiles with notes and interaction history
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="welcome-feature crm-feature"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="feature-icon-wrapper crm-icon">
                  <TrendingUp size={18} strokeWidth={2} />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Sales Pipeline</h3>
                  <p className="feature-desc">
                    Visual pipeline with drag-and-drop deal management
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="welcome-feature crm-feature"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="feature-icon-wrapper crm-icon">
                  <BarChart3 size={18} strokeWidth={2} />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">Analytics Dashboard</h3>
                  <p className="feature-desc">
                    Real-time metrics, charts, and performance indicators
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.button 
              className="welcome-button crm-button" 
              onClick={getStarted}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ArrowRight size={18} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


