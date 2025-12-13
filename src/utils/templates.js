/**
 * Initial templates and examples for new users
 */

import { Icons } from "./icons";

export const initialTemplates = {
  pages: [
    {
      id: "work-tasks",
      title: "Tareas de Trabajo",
      icon: Icons.task,
      parentId: null,
      type: "database",
      viewType: "list",
      createdAt: new Date().toISOString(),
      content: [],
    },
    {
      id: "personal-habits",
      title: "Hábitos Personales",
      icon: Icons.habit,
      parentId: null,
      type: "database",
      viewType: "list",
      createdAt: new Date().toISOString(),
      content: [],
    },
    {
      id: "project-ideas",
      title: "Ideas de Proyectos",
      icon: Icons.page,
      parentId: null,
      type: "page",
      createdAt: new Date().toISOString(),
      content: [],
    },
  ],
  todos: {
    "work-tasks": [
      {
        id: "task-1",
        title: "Revisar propuesta del cliente",
        type: "task",
        completed: false,
        status: "in-progress",
        priority: "high",
        tags: ["trabajo", "urgente"],
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "task-2",
        title: "Preparar presentación para el equipo",
        type: "task",
        completed: false,
        status: "todo",
        priority: "medium",
        tags: ["trabajo", "presentación"],
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "task-3",
        title: "Actualizar documentación del proyecto",
        type: "task",
        completed: true,
        status: "done",
        priority: "low",
        tags: ["trabajo", "documentación"],
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    "personal-habits": [
      {
        id: "habit-1",
        title: "Ejercicio diario",
        type: "habit",
        completed: false,
        streak: 5,
        bestStreak: 12,
        completedDates: [
          new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toDateString(),
          new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toDateString(),
          new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toDateString(),
          new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toDateString(),
          new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toDateString(),
        ],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "habit-2",
        title: "Leer 30 minutos",
        type: "habit",
        completed: false,
        streak: 3,
        bestStreak: 8,
        completedDates: [
          new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toDateString(),
          new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toDateString(),
          new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toDateString(),
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "habit-3",
        title: "Meditar 10 minutos",
        type: "habit",
        completed: false,
        streak: 0,
        bestStreak: 5,
        completedDates: [],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  blocks: {
    "project-ideas": [
      {
        id: "block-1",
        type: "text",
        data: {
          content: "# Ideas de Proyectos\n\n## Proyectos en Curso\n- Aplicación móvil de productividad\n- Blog personal sobre desarrollo web\n\n## Ideas Futuras\n- Sistema de gestión de tareas colaborativo\n- Plataforma de aprendizaje online",
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: "block-2",
        type: "notes",
        data: {
          content: "Notas sobre posibles mejoras:\n\n- Integración con calendario\n- Sincronización en la nube\n- Modo offline",
        },
        createdAt: new Date().toISOString(),
      },
    ],
  },
};

/**
 * Get template description for display
 */
export function getTemplateDescription() {
  return {
    title: "Plantillas de Ejemplo",
    description: "Crea páginas de ejemplo con tareas, hábitos y contenido para que veas cómo funciona la app.",
    features: [
      {
        icon: Icons.task,
        title: "Tareas de Trabajo",
        description: "Página con ejemplos de tareas con diferentes estados y prioridades",
      },
      {
        icon: Icons.habit,
        title: "Hábitos Personales",
        description: "Ejemplos de hábitos con seguimiento de rachas y estadísticas",
      },
      {
        icon: Icons.page,
        title: "Ideas de Proyectos",
        description: "Página con bloques de texto y notas para organizar ideas",
      },
    ],
  };
}

/**
 * Apply templates to the app
 * @param {Function} addPage - Function to add a page
 * @param {Function} updatePage - Function to update a page
 * @returns {Promise} Promise that resolves when templates are applied
 */
export function applyTemplates(addPage, updatePage) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const templates = initialTemplates;
    const pageIdMap = {}; // Map template IDs to actual page IDs
    
    // Add pages
    templates.pages.forEach((templatePage) => {
      try {
        const newPage = addPage(
          templatePage.title,
          templatePage.parentId,
          templatePage.type,
          templatePage.icon
        );
        // addPage returns the new page object, but we need to get the ID from the state
        // For now, we'll use a workaround: get the latest page with this title
        setTimeout(() => {
          const allPages = JSON.parse(localStorage.getItem("notion-pages") || "[]");
          const createdPage = allPages.find(
            p => p.title === templatePage.title && 
            p.type === templatePage.type &&
            !pageIdMap[templatePage.id]
          );
          if (createdPage) {
            pageIdMap[templatePage.id] = createdPage.id;
          }
        }, 100);
      } catch (error) {
        console.error(`Error adding page ${templatePage.title}:`, error);
      }
    });
    
    // Wait a bit for pages to be created, then add todos and blocks
    setTimeout(() => {
      // Update pageIdMap with actual IDs from localStorage
      const allPages = JSON.parse(localStorage.getItem("notion-pages") || "[]");
      templates.pages.forEach((templatePage) => {
        if (!pageIdMap[templatePage.id]) {
          const createdPage = allPages.find(
            p => p.title === templatePage.title && 
            p.type === templatePage.type
          );
          if (createdPage) {
            pageIdMap[templatePage.id] = createdPage.id;
          }
        }
      });
      
      // Add todos to pages
      Object.keys(templates.todos).forEach((templatePageId) => {
        const actualPageId = pageIdMap[templatePageId];
        if (!actualPageId) return;
        
        const todos = templates.todos[templatePageId];
        const storageKey = `todos-${actualPageId}`;
        
        try {
          const existingTodos = JSON.parse(
            localStorage.getItem(storageKey) || "[]"
          );
          const newTodos = [...existingTodos, ...todos];
          localStorage.setItem(storageKey, JSON.stringify(newTodos));
        } catch (error) {
          console.error(`Error adding todos to ${actualPageId}:`, error);
        }
      });
      
      // Add blocks to pages
      Object.keys(templates.blocks).forEach((templatePageId) => {
        const actualPageId = pageIdMap[templatePageId];
        if (!actualPageId) return;
        
        const blocks = templates.blocks[templatePageId];
        try {
          const allPages = JSON.parse(
            localStorage.getItem("notion-pages") || "[]"
          );
          const page = allPages.find((p) => p.id === actualPageId);
          if (page && updatePage) {
            updatePage(actualPageId, { content: blocks });
          }
        } catch (error) {
          console.error(`Error adding blocks to ${actualPageId}:`, error);
        }
      });
      
      // Mark templates as applied
      localStorage.setItem("templates-applied", "true");
      resolve();
    }, 800);
  });
}

