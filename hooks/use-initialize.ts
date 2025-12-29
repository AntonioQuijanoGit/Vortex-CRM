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
      initialize();
      initialized.current = true;
    }
  }, [initialize]);
}



