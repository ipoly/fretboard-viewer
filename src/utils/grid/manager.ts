/**
 * Grid management system for CSS Grid-based fretboard
 *
 * This module provides high-level management functions for coordinating
 * grid layout, positioning, and responsive behavior.
 */

import { FretPosition } from '../../types';
import {
  GridPosition,
  GridDimensions,
  GridLayers,
  MarkerWrapperConfig,
  calculateGridDimensions,
  getFretLinePosition,
  getStringLinePosition,
  getNoteMarkerPosition,
  getMarkerWrapperPosition,
  getTopPlaceholderPosition,
  getBottomPlaceholderPosition,
  getStickyColumnConfig
} from './index';

/**
 * Grid element type definitions
 */
export type GridElementType = 'fret-line' | 'string-line' | 'note-marker' | 'marker-wrapper' | 'placeholder-row';

/**
 * Complete grid element configuration
 */
export interface GridElement {
  type: GridElementType;
  position: GridPosition;
  data?: any; // Additional data specific to element type
}

/**
 * Grid layout configuration
 */
export interface GridLayoutConfig {
  fretCount: number;
  dimensions: GridDimensions;
  elements: GridElement[];
  cssVariables: Record<string, string>;
}

/**
 * Grid manager class for coordinating all grid operations
 */
export class FretboardGridManager {
  private fretCount: number;
  private dimensions: GridDimensions;

  constructor(fretCount: number) {
    this.fretCount = fretCount;
    this.dimensions = calculateGridDimensions(fretCount);
  }

  /**
   * Get complete grid layout configuration
   */
  getLayoutConfig(): GridLayoutConfig {
    return {
      fretCount: this.fretCount,
      dimensions: this.dimensions,
      elements: this.generateAllElements(),
      cssVariables: this.generateCSSVariables()
    };
  }

  /**
   * Generate all grid elements for the fretboard
   */
  private generateAllElements(): GridElement[] {
    const elements: GridElement[] = [];

    // Add placeholder rows
    elements.push({
      type: 'placeholder-row',
      position: getTopPlaceholderPosition(),
      data: { type: 'top' }
    });

    elements.push({
      type: 'placeholder-row',
      position: getBottomPlaceholderPosition(),
      data: { type: 'bottom' }
    });

    // Add fret lines (starting from fret 1)
    for (let fret = 1; fret <= this.fretCount; fret++) {
      elements.push({
        type: 'fret-line',
        position: getFretLinePosition(fret),
        data: { fretNumber: fret }
      });
    }

    // Add string lines (6 strings)
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      elements.push({
        type: 'string-line',
        position: getStringLinePosition(stringIndex),
        data: { stringIndex }
      });
    }

    return elements;
  }

  /**
   * Generate CSS variables for the current grid configuration
   * Enhanced with responsive grid variables
   */
  private generateCSSVariables(): Record<string, string> {
    return {
      '--fret-count': this.fretCount.toString(),
      '--grid-columns': this.dimensions.columns.toString(),
      '--grid-rows': this.dimensions.rows.toString()
    };
  }

  /**
   * Convert FretPosition to GridElement with marker wrapper support
   */
  fretPositionToGridElement(position: FretPosition): GridElement {
    // Unified processing for all markers (including open strings)
    return {
      type: 'note-marker', // Unified type for all markers (including open strings)
      position: getNoteMarkerPosition(position.string, position.fret), // Unified positioning
      data: position
    };
  }

  /**
   * Convert FretPosition to marker wrapper GridElement
   */
  fretPositionToMarkerWrapperElement(position: FretPosition): GridElement {
    return {
      type: 'marker-wrapper',
      position: getMarkerWrapperPosition(position.string, position.fret),
      data: position
    };
  }

  /**
   * Convert multiple FretPositions to GridElements with marker wrapper support
   */
  fretPositionsToGridElements(positions: FretPosition[]): GridElement[] {
    return positions.map(pos => this.fretPositionToGridElement(pos));
  }

  /**
   * Convert multiple FretPositions to marker wrapper GridElements
   */
  fretPositionsToMarkerWrapperElements(positions: FretPosition[]): GridElement[] {
    return positions.map(pos => this.fretPositionToMarkerWrapperElement(pos));
  }

  /**
   * Get CSS style object for a grid element
   * Enhanced with marker wrapper support
   */
  getElementStyles(element: GridElement): Record<string, any> {
    const baseStyles = {
      gridColumn: element.position.column,
      gridRow: element.position.row,
      zIndex: element.position.layer
    };

    // Add element-specific styles
    switch (element.type) {
      case 'fret-line':
        return {
          ...baseStyles,
          gridColumn: element.position.column,
          gridRow: '2 / 8', // Span from row 2 (first string) to row 7 (last string) + 1
        };

      case 'string-line':
        return {
          ...baseStyles,
          gridColumn: '1 / -1', // Span from column 1 to end (updated for unified handling)
          gridRow: element.position.row,
          '--string-thickness': this.getStringThickness(element.data?.stringIndex || 0),
          '--string-gradient': this.getStringGradient(element.data?.stringIndex || 0),
          '--string-shadow': this.getStringShadow(element.data?.stringIndex || 0)
        };

      case 'marker-wrapper':
        return {
          gridColumn: element.position.column,
          gridRow: element.position.row,
          zIndex: element.position.layer,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        };

      case 'note-marker':
        // Direct CSS Grid positioning - no custom properties needed
        return {
          gridColumn: element.position.column,
          gridRow: element.position.row,
          zIndex: element.position.layer
        };

      case 'placeholder-row':
        return {
          ...baseStyles,
          gridColumn: '1 / -1', // Span all columns
          gridRow: element.position.row,
          background: 'transparent',
          height: '100%'
        };

      default:
        return baseStyles;
    }
  }

  /**
   * Get string thickness based on string index
   */
  private getStringThickness(stringIndex: number): string {
    // High strings (0-2) are thinner, low strings (3-5) are thicker
    return stringIndex < 3 ? '2px' : '4px';
  }

  /**
   * Get string gradient based on string index
   */
  private getStringGradient(stringIndex: number): string {
    if (stringIndex < 3) {
      // Plain steel strings (high strings)
      return 'linear-gradient(to right, #F0F0F0, #D0D0D0, #F0F0F0)';
    } else {
      // Wound strings with texture (low strings)
      return `repeating-linear-gradient(
        75deg,
        #A0826D 0px,
        #E8E8E8 0.8px,
        #F0F0F0 1.6px,
        #E8E8E8 2.4px,
        #A0826D 3.2px
      )`;
    }
  }

  /**
   * Get string shadow based on string index
   */
  private getStringShadow(stringIndex: number): string {
    if (stringIndex < 3) {
      return '0 2px 4px rgba(0, 0, 0, 0.3)';
    } else {
      return '0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)';
    }
  }

  /**
   * Update fret count and recalculate dimensions
   */
  updateFretCount(newFretCount: number): void {
    this.fretCount = newFretCount;
    this.dimensions = calculateGridDimensions(newFretCount);
  }

  /**
   * Get dimensions for the current configuration
   */
  getDimensions(): GridDimensions {
    return { ...this.dimensions };
  }

  /**
   * Get fret count
   */
  getFretCount(): number {
    return this.fretCount;
  }

  /**
   * Validate grid position
   */
  isValidPosition(position: GridPosition): boolean {
    return (
      position.column >= 1 &&
      position.column <= this.dimensions.columns &&
      position.row >= 1 &&
      position.row <= this.dimensions.rows &&
      Object.values(GridLayers).includes(position.layer)
    );
  }

  /**
   * Get sticky configuration for open string elements
   */
  getStickyConfig(layer: GridLayers, background?: string) {
    return getStickyColumnConfig(layer, background);
  }

  /**
   * Get marker wrapper configuration
   */
  getMarkerWrapperConfig(): MarkerWrapperConfig {
    return {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    };
  }
}