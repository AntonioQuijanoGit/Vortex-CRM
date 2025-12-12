# Inconsistencias Encontradas en la Aplicación

## 🔴 Críticas (Alta Prioridad)

### 1. **Border-radius Hardcodeados**
- **Problema**: Muchos componentes usan valores hardcodeados en lugar de variables CSS
- **Ubicaciones**:
  - `QuickSearch.css`: `border-radius: 12px` (línea 29) - debería ser `var(--radius-lg)`
  - `QuickSearch.css`: `border-radius: 6px` (línea 84, 114) - debería ser `var(--radius-md)`
  - `QuickSearch.css`: `border-radius: 4px` (línea 152, 182) - debería ser `var(--radius-sm)`
  - `PageItem.css`: `border-radius: 6px` (línea 14) - debería ser `var(--radius-md)`
  - `PageItem.css`: `border-radius: 3px` (línea 58, 140) - debería ser `var(--radius-sm)`
  - `PageItem.css`: `border-radius: 10px` (línea 109) - debería ser `var(--radius-lg)`
  - `Dashboard.css`: `border-radius: 3px` (línea 355) - debería ser `var(--radius-sm)`
  - `Dashboard.css`: `border-radius: 4px` (línea 401) - debería ser `var(--radius-sm)`
  - `Dashboard.css`: `border-radius: 8px` (línea 420) - debería ser `var(--radius-md)`
  - `Sidebar.css`: `border-radius: 6px` (línea 59) - debería ser `var(--radius-md)`

### 2. **Font-sizes Hardcodeados**
- **Problema**: Muchos componentes usan tamaños de fuente en px/rem en lugar de variables CSS
- **Ubicaciones**:
  - `ConfirmDialog.css`: `font-size: 20px` (línea 39), `font-size: 15px` (línea 68), `font-size: 18px` (línea 57)
  - `Toast.css`: `font-size: 20px` (línea 73), `font-size: 14px` (línea 79), `font-size: 16px` (línea 98)
  - `QuickSearch.css`: `font-size: 20px` (línea 60), `font-size: 16px` (línea 68), `font-size: 18px` (línea 89), `font-size: 14px` (línea 139), `font-size: 11px` (línea 145), `font-size: 10px` (línea 183)
  - `PageItem.css`: `font-size: 9px` (línea 54), `font-size: 13px` (línea 83, 156), `font-size: 14px` (línea 90), `font-size: 10px` (línea 104), `font-size: 7px` (línea 132)
  - `ProgressCircle.css`: `font-size: 24px` (línea 35), `font-size: 10px` (línea 44)
  - `DateDetailsModal.css`: `font-size: 16px` (línea 80)
  - `Dashboard.css`: Múltiples valores hardcodeados (clamp, px)

### 3. **Z-index Inconsistente**
- **Problema**: No hay un sistema claro de z-index
- **Valores encontrados**:
  - `Sidebar`: `z-index: 3000`
  - `ConfirmDialog`: `z-index: 10000` y `10001`
  - `QuickSearch`: `z-index: 1000`
  - `ThemeToggle`: Probablemente necesita z-index definido
- **Solución**: Crear un sistema de z-index con variables CSS

### 4. **Padding/Margin Hardcodeados**
- **Problema**: Algunos componentes usan valores hardcodeados
- **Ubicaciones**:
  - `QuickSearch.css`: `padding-top: 20vh` (línea 13)
  - `QuickSearch.css`: `padding: 2px 6px` (línea 179), `padding: 2px 8px` (línea 150)
  - `PageItem.css`: Múltiples valores hardcodeados

## 🟡 Medias (Prioridad Media)

### 5. **Inconsistencias en Modales**
- **Problema**: Diferentes estilos de overlay y animaciones
- **Diferencias**:
  - `ConfirmDialog`: `background: rgba(0, 0, 0, 0.6)`, `backdrop-filter: blur(4px)`
  - `QuickSearch`: `background: rgba(0, 0, 0, 0.4)`, `backdrop-filter: blur(4px)`
  - Diferentes animaciones (`fadeIn` vs `slideDown`)

### 6. **Inconsistencias en Botones**
- **Problema**: Diferentes tamaños, padding y estilos
- **Ejemplos**:
  - `ConfirmDialog`: `min-width: 100px`, `padding: var(--spacing-sm) var(--spacing-lg)`
  - `QuickSearch`: `width: 32px`, `height: 32px`
  - `Toast`: `width: 24px`, `height: 24px`
  - `PageItem`: Diferentes tamaños de botones de opciones

### 7. **Inconsistencias en Colores**
- **Problema**: Algunos componentes usan valores hardcodeados
- **Ejemplos**:
  - `QuickSearch.css`: `background: rgba(0, 0, 0, 0.4)` - debería usar variable
  - `ConfirmDialog.css`: `background: rgba(0, 0, 0, 0.6)` - debería usar variable

### 8. **Inconsistencias en Espaciado de Grids**
- **Problema**: Diferentes gaps y layouts
- **Ejemplos**:
  - `Dashboard`: `gap: var(--spacing-xl)` en visual-data-grid
  - `Dashboard`: `gap: var(--spacing-lg)` en stats-grid
  - Diferentes valores en diferentes secciones

## 🟢 Menores (Baja Prioridad)

### 9. **Inconsistencias en Animaciones**
- **Problema**: Diferentes duraciones y easing
- **Ejemplos**:
  - `ConfirmDialog`: `0.2s ease-out`
  - `QuickSearch`: `0.2s ease-out`
  - `Toast`: `0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)`
  - Algunos usan `var(--transition-base)`, otros valores hardcodeados

### 10. **Inconsistencias en Hover Effects**
- **Problema**: Diferentes transformaciones y efectos
- **Ejemplos**:
  - `Toast`: `transform: translateY(-3px) scale(1.02)`
  - `ConfirmDialog`: `transform: translateY(-1px)`
  - `QuickSearch`: Sin transform en hover
  - `PageItem`: Diferentes efectos

### 11. **Inconsistencias en Shadows**
- **Problema**: Algunos componentes usan valores hardcodeados
- **Ejemplos**:
  - La mayoría usa variables CSS (`var(--shadow-sm)`, etc.)
  - Pero algunos podrían tener valores inconsistentes

### 12. **Inconsistencias en Tipografía**
- **Problema**: Diferentes font-weights y letter-spacing
- **Ejemplos**:
  - `ConfirmDialog`: `font-weight: 700` para título
  - `Toast`: `font-weight: 500` para mensaje
  - `QuickSearch`: `font-weight: 500` para título
  - No hay sistema claro de weights

## 📋 Recomendaciones

### Sistema de Z-index
```css
:root {
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 1000;
  --z-modal: 1001;
  --z-popover: 1100;
  --z-tooltip: 1200;
  --z-sidebar: 3000;
}
```

### Sistema de Font-sizes
- Usar siempre variables CSS: `var(--font-size-xs)`, `var(--font-size-sm)`, etc.
- Evitar valores hardcodeados

### Sistema de Border-radius
- Usar siempre variables CSS: `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`
- Evitar valores hardcodeados

### Sistema de Spacing
- Usar siempre variables CSS: `var(--spacing-xs)`, `var(--spacing-sm)`, etc.
- Evitar valores hardcodeados

### Estandarización de Modales
- Mismo overlay style
- Mismas animaciones
- Mismo border-radius
- Mismo z-index system

### Estandarización de Botones
- Tamaños consistentes (small, medium, large)
- Padding consistente
- Border-radius consistente
- Hover effects consistentes

