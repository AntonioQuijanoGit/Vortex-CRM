# Pendientes por Arreglar

## 🔴 Críticos

### 1. **Variable no definida en Sidebar**
- **Problema**: `internalCollapsed` se usa pero no está definido (línea 20)
- **Ubicación**: `src/components/Sidebar/Sidebar.js`
- **Fix**: Agregar `const [internalCollapsed, setInternalCollapsed] = useState(false);`

### 2. **Tools en Sidebar no funcionan**
- **Problema**: Los botones de Tools intentan navegar a páginas que no existen:
  - `focus-timer` → No existe como página
  - `quick-notes` → Ya existe como componente flotante
  - `goals` → No existe como página
  - `achievements` → Debería abrir modal, no navegar
  - `settings` → No existe como página
- **Ubicación**: `src/components/Sidebar/Sidebar.js` líneas 219-253
- **Fix**: 
  - Focus Timer: Abrir modal (como en Dashboard)
  - Quick Notes: Remover (ya está como botón flotante)
  - Goals: Crear vista o modal
  - Achievements: Abrir modal (como en Dashboard)
  - Settings: Crear vista de Settings o remover

## 🟡 Importantes

### 3. **Vista de Tasks incompleta**
- **Problema**: Solo muestra estadísticas, no permite gestionar tareas
- **Ubicación**: `src/components/Page/PageContent.js` función `TasksView`
- **Fix**: Integrar `TodoApp` con filtro de tasks o crear una vista funcional completa

### 4. **Vista de Habits incompleta**
- **Problema**: Solo muestra estadísticas, no permite gestionar hábitos
- **Ubicación**: `src/components/Page/PageContent.js` función `HabitsView`
- **Fix**: Integrar `TodoApp` con filtro de habits o crear una vista funcional completa

### 5. **Botón "View All Tasks" no funcional**
- **Problema**: Solo navega a home, no muestra todas las tareas
- **Ubicación**: `src/components/Page/PageContent.js` línea 330
- **Fix**: Crear una página de base de datos de tasks o mostrar TodoApp completo

## 🟢 Mejoras

### 6. **Settings no implementado**
- **Problema**: No existe vista de configuración
- **Sugerencia**: Crear Settings view con:
  - Tema (light/dark)
  - Export/Import de datos
  - Preferencias de notificaciones
  - Configuración de reminders

### 7. **Goals no tiene vista dedicada**
- **Problema**: Goals está en Dashboard pero no tiene vista propia
- **Sugerencia**: Crear vista de Goals o integrar en Settings

### 8. **Warnings de ESLint (no críticos)**
- Varios warnings de variables no usadas y dependencias de hooks
- No afectan funcionalidad pero deberían limpiarse

## Prioridad de Implementación

1. ✅ Arreglar variable `internalCollapsed` en Sidebar
2. ✅ Arreglar Tools en Sidebar (modales en lugar de navegación)
3. ✅ Mejorar vista de Tasks (integrar TodoApp)
4. ✅ Mejorar vista de Habits (integrar TodoApp)
5. ⚠️ Crear Settings view (opcional)
6. ⚠️ Limpiar warnings de ESLint (opcional)


