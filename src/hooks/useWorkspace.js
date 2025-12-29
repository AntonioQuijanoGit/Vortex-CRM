/**
 * Unified Workspace Hook - Single source of truth for all data
 * This replaces the fragmented useTodos, useEvents, useMovies approach
 * with a unified data model similar to Notion
 */

import { useState, useEffect, useCallback } from "react";
import { safeGetItem, safeSetItem } from "../utils/storage";
import { logger } from "../utils/logger";
import { STORAGE_KEYS } from "../constants";

/**
 * Workspace Data Structure:
 * {
 *   pages: Page[],
 *   databases: {
 *     [databaseId]: {
 *       schema: Property[],
 *       rows: Row[]
 *     }
 *   },
 *   blocks: {
 *     [blockId]: BlockData
 *   }
 * }
 */

const WORKSPACE_KEY = "notion-workspace-v2";

// Initialize workspace structure
function getInitialWorkspace() {
  const saved = safeGetItem(WORKSPACE_KEY, null);
  if (saved && saved.version === 2) {
    return saved;
  }
  
  // Migrate from old structure or create new
  return {
    version: 2,
    pages: [],
    databases: {},
    blocks: {},
    metadata: {
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    },
  };
}

export function useWorkspace() {
  const [workspace, setWorkspace] = useState(() => getInitialWorkspace());

  // Save to localStorage whenever workspace changes
  useEffect(() => {
    try {
      const updatedWorkspace = {
        ...workspace,
        metadata: {
          ...workspace.metadata,
          lastModified: new Date().toISOString(),
        },
      };
      safeSetItem(WORKSPACE_KEY, updatedWorkspace);
    } catch (error) {
      logger.error("Failed to save workspace:", error);
    }
  }, [workspace]);

  // Database operations
  const getDatabase = useCallback((databaseId) => {
    return workspace.databases[databaseId] || null;
  }, [workspace]);

  const createDatabase = useCallback((databaseId, schema = []) => {
    setWorkspace((prev) => ({
      ...prev,
      databases: {
        ...prev.databases,
        [databaseId]: {
          schema,
          rows: [],
          createdAt: new Date().toISOString(),
        },
      },
    }));
  }, []);

  const updateDatabaseSchema = useCallback((databaseId, schema) => {
    setWorkspace((prev) => {
      const db = prev.databases[databaseId];
      if (!db) return prev;
      
      return {
        ...prev,
        databases: {
          ...prev.databases,
          [databaseId]: {
            ...db,
            schema,
          },
        },
      };
    });
  }, []);

  const addDatabaseRow = useCallback((databaseId, row) => {
    setWorkspace((prev) => {
      const db = prev.databases[databaseId];
      if (!db) {
        logger.warn(`Database ${databaseId} not found`);
        return prev;
      }

      const newRow = {
        id: row.id || crypto.randomUUID(),
        properties: row.properties || {},
        createdAt: new Date().toISOString(),
        ...row,
      };

      return {
        ...prev,
        databases: {
          ...prev.databases,
          [databaseId]: {
            ...db,
            rows: [...db.rows, newRow],
          },
        },
      };
    });
  }, []);

  const updateDatabaseRow = useCallback((databaseId, rowId, updates) => {
    setWorkspace((prev) => {
      const db = prev.databases[databaseId];
      if (!db) return prev;

      return {
        ...prev,
        databases: {
          ...prev.databases,
          [databaseId]: {
            ...db,
            rows: db.rows.map((row) =>
              row.id === rowId ? { ...row, ...updates, properties: { ...row.properties, ...updates.properties } } : row
            ),
          },
        },
      };
    });
  }, []);

  const deleteDatabaseRow = useCallback((databaseId, rowId) => {
    setWorkspace((prev) => {
      const db = prev.databases[databaseId];
      if (!db) return prev;

      return {
        ...prev,
        databases: {
          ...prev.databases,
          [databaseId]: {
            ...db,
            rows: db.rows.filter((row) => row.id !== rowId),
          },
        },
      };
    });
  }, []);

  const getDatabaseRows = useCallback((databaseId) => {
    const db = workspace.databases[databaseId];
    return db ? db.rows : [];
  }, [workspace]);

  // Block data operations
  const getBlockData = useCallback((blockId) => {
    return workspace.blocks[blockId] || null;
  }, [workspace]);

  const setBlockData = useCallback((blockId, data) => {
    setWorkspace((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [blockId]: {
          ...data,
          lastModified: new Date().toISOString(),
        },
      },
    }));
  }, []);

  const deleteBlockData = useCallback((blockId) => {
    setWorkspace((prev) => {
      const { [blockId]: removed, ...rest } = prev.blocks;
      return {
        ...prev,
        blocks: rest,
      };
    });
  }, []);

  return {
    workspace,
    // Database operations
    getDatabase,
    createDatabase,
    updateDatabaseSchema,
    addDatabaseRow,
    updateDatabaseRow,
    deleteDatabaseRow,
    getDatabaseRows,
    // Block operations
    getBlockData,
    setBlockData,
    deleteBlockData,
  };
}

