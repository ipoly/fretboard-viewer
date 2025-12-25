/**
 * CSS Grid utility functions for fretboard layout
 *
 * This module provides coordinate mapping and grid management utilities
 * for the CSS Grid-based fretboard implementation.
 */

// Grid layer z-index constants
export enum GridLayers {
  FRET_LINES = 1,           // 品丝 - 最底层
  STRING_LINES = 2,         // 弦线 - 第二层
  NOTE_MARKERS = 3,         // 音符标记 - 第三层
  OPEN_STRING_MASK = 4,     // 空弦遮罩层 - 第四层
  OPEN_STRING_MARKERS = 5   // 空弦标记 - 最顶层
}

/**
 * Layer management validation and enforcement
 */
export class LayerManager {
  /**
   * Validate that all elements have correct z-index values
   */
  static validateLayerOrder(elements: HTMLElement[]): boolean {
    for (const element of elements) {
      const zIndex = parseInt(getComputedStyle(element).zIndex || '0');
      const expectedLayer = this.getExpectedLayer(element);

      if (expectedLayer !== null && zIndex !== expectedLayer) {
        console.warn(`Layer validation failed: Element ${element.className} has z-index ${zIndex}, expected ${expectedLayer}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get expected layer for an element based on its attributes
   */
  private static getExpectedLayer(element: HTMLElement): number | null {
    if (element.dataset.layer) {
      switch (element.dataset.layer) {
        case 'fret-lines': return GridLayers.FRET_LINES;
        case 'string-lines': return GridLayers.STRING_LINES;
        case 'note-markers': return GridLayers.NOTE_MARKERS;
        case 'open-string-mask': return GridLayers.OPEN_STRING_MASK;
        case 'open-string-markers': return GridLayers.OPEN_STRING_MARKERS;
      }
    }

    // Check by class name
    if (element.classList.contains('note-marker')) return GridLayers.NOTE_MARKERS;
    if (element.classList.contains('open-string-marker')) return GridLayers.OPEN_STRING_MARKERS;

    return null;
  }

  /**
   * Enforce correct layer order on all elements
   */
  static enforceLayerOrder(container: HTMLElement): void {
    const fretLines = container.querySelectorAll('[data-layer="fret-lines"]');
    const stringLines = container.querySelectorAll('[data-layer="string-lines"]');
    const noteMarkers = container.querySelectorAll('[data-layer="note-markers"]');
    const openStringMask = container.querySelectorAll('[data-layer="open-string-mask"]');
    const openStringMarkers = container.querySelectorAll('[data-layer="open-string-markers"]');

    // Enforce z-index values
    fretLines.forEach(el => (el as HTMLElement).style.zIndex = GridLayers.FRET_LINES.toString());
    stringLines.forEach(el => (el as HTMLElement).style.zIndex = GridLayers.STRING_LINES.toString());
    noteMarkers.forEach(el => (el as HTMLElement).style.zIndex = GridLayers.NOTE_MARKERS.toString());
    openStringMask.forEach(el => (el as HTMLElement).style.zIndex = GridLayers.OPEN_STRING_MASK.toString());
    openStringMarkers.forEach(el => (el as HTMLElement).style.zIndex = GridLayers.OPEN_STRING_MARKERS.toString());
  }

  /**
   * Get layer information for debugging
   */
  static getLayerInfo(): Record<string, number> {
    return {
      'Fret Lines (底层)': GridLayers.FRET_LINES,
      'String Lines': GridLayers.STRING_LINES,
      'Note Markers': GridLayers.NOTE_MARKERS,
      'Open String Mask': GridLayers.OPEN_STRING_MASK,
      'Open String Markers (顶层)': GridLayers.OPEN_STRING_MARKERS
    };
  }
}

// Grid dimensions interface
export interface GridDimensions {
  columns: number;        // fretCount + 1 (包含空弦列)
  rows: number;          // 6 (弦的数量)
  cellWidth: string;     // CSS Grid 列宽
  cellHeight: string;    // CSS Grid 行高
}

// Grid position interface
export interface GridPosition {
  column: number;        // 网格列位置 (1-based)
  row: number;          // 网格行位置 (1-based)
  layer: number;        // z-index 层级
}

// Sticky column configuration
export interface StickyColumnConfig {
  position: 'sticky';
  left: 0;
  zIndex: number;
  background: string;    // 与指板底色相同的背景
}

/**
 * Convert string index to grid row position
 * 弦号到网格行的映射 (1-based grid system)
 *
 * @param stringIndex - 0-based string index (0 = high E, 5 = low E)
 * @returns 1-based grid row position
 */
export function stringToGridRow(stringIndex: number): number {
  return stringIndex + 1; // 0-based string index -> 1-based grid row
}

/**
 * Convert fret number to grid column position
 * 品格号到网格列的映射
 *
 * @param fretNumber - 0-based fret number (0 = open string, 1 = first fret, 2 = second fret, etc.)
 * @returns 1-based grid column position
 */
export function fretToGridColumn(fretNumber: number): number {
  return fretNumber + 1; // 0-based fret -> 1-based grid column (open string = column 1, fret 1 = column 2, etc.)
}

/**
 * Get the open string column position (always column 1)
 */
export const OPEN_STRING_COLUMN = 1;

/**
 * Calculate grid dimensions based on fret count
 *
 * @param fretCount - Number of frets to display
 * @returns Grid dimensions configuration
 */
export function calculateGridDimensions(fretCount: number): GridDimensions {
  return {
    columns: fretCount + 1, // +1 for open string column
    rows: 6, // Standard guitar has 6 strings
    cellWidth: 'var(--fret-width)',
    cellHeight: 'var(--string-height)'
  };
}

/**
 * Get grid position for a fret line
 *
 * @param fretNumber - Fret number (1-based for actual frets)
 * @returns Grid position configuration
 */
export function getFretLinePosition(fretNumber: number): GridPosition {
  return {
    column: fretToGridColumn(fretNumber),
    row: 1, // Will span all rows using CSS: 1 / -1
    layer: GridLayers.FRET_LINES
  };
}

/**
 * Get grid position for a string line
 *
 * @param stringIndex - String index (0-based)
 * @returns Grid position configuration
 */
export function getStringLinePosition(stringIndex: number): GridPosition {
  return {
    column: 2, // Will span from column 2 to end using CSS: 2 / -1
    row: stringToGridRow(stringIndex),
    layer: GridLayers.STRING_LINES
  };
}

/**
 * Get grid position for an open string marker
 *
 * @param stringIndex - String index (0-based)
 * @returns Grid position configuration
 */
export function getOpenStringMarkerPosition(stringIndex: number): GridPosition {
  return {
    column: OPEN_STRING_COLUMN, // 固定在第一列
    row: stringToGridRow(stringIndex),
    layer: GridLayers.OPEN_STRING_MARKERS
  };
}

/**
 * Get grid position for a regular note marker
 *
 * @param stringIndex - String index (0-based)
 * @param fretNumber - Fret number (1-based for fretted notes)
 * @returns Grid position configuration
 */
export function getNoteMarkerPosition(stringIndex: number, fretNumber: number): GridPosition {
  return {
    column: fretToGridColumn(fretNumber),
    row: stringToGridRow(stringIndex),
    layer: GridLayers.NOTE_MARKERS
  };
}

/**
 * Get sticky column configuration for open string elements
 *
 * @param layer - Z-index layer for the sticky element
 * @param background - Background color (optional)
 * @returns Sticky column style configuration
 */
export function getStickyColumnConfig(
  layer: GridLayers,
  background: string = 'transparent'
): StickyColumnConfig {
  return {
    position: 'sticky',
    left: 0,
    zIndex: layer,
    background
  };
}

/**
 * Generate CSS custom properties for responsive grid sizing
 * Optimized with fewer breakpoints for better performance
 *
 * @param breakpoint - Responsive breakpoint name
 * @returns CSS custom properties object
 */
export function getResponsiveGridVariables(
  breakpoint: 'desktop' | 'tablet' | 'mobile' | 'small-mobile'
) {
  const sizes = {
    desktop: {
      openStringWidth: '85px',
      fretWidth: '85px',
      stringHeight: '52px',
      gridGap: '2px',
      borderRadius: '8px'
    },
    tablet: {
      openStringWidth: '72px',
      fretWidth: '72px',
      stringHeight: '46px',
      gridGap: '1px',
      borderRadius: '6px'
    },
    mobile: {
      openStringWidth: '56px',
      fretWidth: '56px',
      stringHeight: '38px',
      gridGap: '0px',
      borderRadius: '4px'
    },
    'small-mobile': {
      openStringWidth: '48px',
      fretWidth: '48px',
      stringHeight: '34px',
      gridGap: '0px',
      borderRadius: '3px'
    }
  };

  const config = sizes[breakpoint];

  return {
    '--open-string-width': config.openStringWidth,
    '--fret-width': config.fretWidth,
    '--string-height': config.stringHeight,
    '--grid-gap': config.gridGap,
    '--border-radius': config.borderRadius
  };
}

// Re-export everything from manager and styles for convenience
export * from './manager';
export * from './styles';