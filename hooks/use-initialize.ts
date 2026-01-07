import { useEffect, useRef } from "react";
import { useCRMStore } from "@/lib/store";

/**
 * Hook to initialize the CRM store only once
 * Prevents multiple initializations across different components
 */
export function useInitialize() {
  const initialize = useCRMStore((state) => state.initialize);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && typeof window !== "undefined") {
      try {
        initialize();
        initialized.current = true;
      } catch (error) {
        // Don't throw - allow app to continue even if initialization fails
        console.error("Error during initialization:", error);
        initialized.current = true; // Mark as initialized to prevent retry loops
      }
    }
  }, [initialize]);
}









