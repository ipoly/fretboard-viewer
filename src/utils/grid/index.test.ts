/**
 * Tests for CSS Grid utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  stringToGridRow,
  fretToGridColumn,
  OPEN_STRING_COLUMN,
  TOP_PLACEHOLDER_ROW,
  BOTTOM_PLACEHOLDER_ROW,
  calculateGridDimensions,
  getFretLinePosition,
  getStringLinePosition,
  getOpenStringMarkerPosition,
  getNoteMarkerPosition,
  getMarkerWrapperPosition,
  getTopPlaceholderPosition,
  getBottomPlaceholderPosition,
  GridLayers,
  FretboardGridManager
} from './index';

describe('Grid Coordinate Mapping', () => {
  it('should map string index to grid row correctly', () => {
    expect(stringToGridRow(0)).toBe(2); // High E string -> row 2 (row 1 is top placeholder)
    expect(stringToGridRow(1)).toBe(3); // B string -> row 3
    expect(stringToGridRow(5)).toBe(7); // Low E string -> row 7 (row 8 is bottom placeholder)
  });

  it('should map fret number to grid column correctly', () => {
    expect(fretToGridColumn(0)).toBe(1); // Open string -> column 1
    expect(fretToGridColumn(1)).toBe(2); // 1st fret -> column 2
    expect(fretToGridColumn(2)).toBe(3); // 2nd fret -> column 3
    expect(fretToGridColumn(12)).toBe(13); // 12th fret -> column 13
  });

  it('should have open string column as 1', () => {
    expect(OPEN_STRING_COLUMN).toBe(1);
  });
});

describe('Grid Dimensions', () => {
  it('should calculate grid dimensions correctly', () => {
    const dimensions = calculateGridDimensions(12);
    expect(dimensions.columns).toBe(13); // 12 frets + 1 open string column
    expect(dimensions.rows).toBe(8); // 6 strings + 2 placeholder rows
    expect(dimensions.cellWidth).toBe('var(--fret-width)');
    expect(dimensions.cellHeight).toBe('var(--string-height)');
  });
});

describe('Grid Positions', () => {
  it('should get fret line position correctly', () => {
    const position = getFretLinePosition(5);
    expect(position.column).toBe(6); // 5th fret -> column 6
    expect(position.row).toBe(2); // Start from row 2 (first string row)
    expect(position.layer).toBe(GridLayers.FRET_LINES);
  });

  it('should get string line position correctly', () => {
    const position = getStringLinePosition(2);
    expect(position.column).toBe(1); // Will span from column 1 (updated for unified handling)
    expect(position.row).toBe(4); // 3rd string -> row 4 (with top placeholder)
    expect(position.layer).toBe(GridLayers.STRING_LINES);
  });

  it('should get open string marker position correctly', () => {
    const position = getOpenStringMarkerPosition(1);
    expect(position.column).toBe(OPEN_STRING_COLUMN);
    expect(position.row).toBe(3); // 2nd string -> row 3 (with top placeholder)
    expect(position.layer).toBe(GridLayers.OPEN_STRING_MARKERS);
  });

  it('should get note marker position correctly', () => {
    const position = getNoteMarkerPosition(3, 7);
    expect(position.column).toBe(8); // 7th fret -> column 8
    expect(position.row).toBe(5); // 4th string -> row 5 (with top placeholder)
    expect(position.layer).toBe(GridLayers.NOTE_MARKERS);
  });

  it('should get marker wrapper position correctly', () => {
    const position = getMarkerWrapperPosition(2, 5);
    expect(position.column).toBe(6); // 5th fret -> column 6
    expect(position.row).toBe(4); // 3rd string -> row 4 (with top placeholder)
    expect(position.layer).toBe(GridLayers.MARKER_WRAPPER);
  });

  it('should get marker wrapper position for open string correctly', () => {
    const position = getMarkerWrapperPosition(0, 0);
    expect(position.column).toBe(1); // Open string -> column 1
    expect(position.row).toBe(2); // 1st string -> row 2 (with top placeholder)
    expect(position.layer).toBe(GridLayers.MARKER_WRAPPER);
  });

  it('should get top placeholder position correctly', () => {
    const position = getTopPlaceholderPosition();
    expect(position.column).toBe(1); // Will span all columns
    expect(position.row).toBe(TOP_PLACEHOLDER_ROW); // Top row
    expect(position.layer).toBe(GridLayers.STRING_LINES);
  });

  it('should get bottom placeholder position correctly', () => {
    const position = getBottomPlaceholderPosition();
    expect(position.column).toBe(1); // Will span all columns
    expect(position.row).toBe(BOTTOM_PLACEHOLDER_ROW); // Bottom row
    expect(position.layer).toBe(GridLayers.STRING_LINES);
  });
});

describe('FretboardGridManager', () => {
  it('should initialize with correct dimensions', () => {
    const manager = new FretboardGridManager(15);
    const dimensions = manager.getDimensions();

    expect(manager.getFretCount()).toBe(15);
    expect(dimensions.columns).toBe(16); // 15 frets + 1 open string
    expect(dimensions.rows).toBe(8); // 6 strings + 2 placeholder rows
  });

  it('should generate layout config correctly', () => {
    const manager = new FretboardGridManager(12);
    const config = manager.getLayoutConfig();

    expect(config.fretCount).toBe(12);
    expect(config.dimensions.columns).toBe(13);
    expect(config.dimensions.rows).toBe(8); // 6 strings + 2 placeholder rows
    expect(config.elements.length).toBeGreaterThan(0);
    expect(config.cssVariables['--fret-count']).toBe('12');
  });

  it('should validate grid positions correctly', () => {
    const manager = new FretboardGridManager(12);

    // Valid position
    expect(manager.isValidPosition({
      column: 5,
      row: 3,
      layer: GridLayers.NOTE_MARKERS
    })).toBe(true);

    // Invalid column
    expect(manager.isValidPosition({
      column: 15, // Beyond grid
      row: 3,
      layer: GridLayers.NOTE_MARKERS
    })).toBe(false);

    // Invalid row
    expect(manager.isValidPosition({
      column: 5,
      row: 9, // Beyond 8 rows (6 strings + 2 placeholders)
      layer: GridLayers.NOTE_MARKERS
    })).toBe(false);
  });

  it('should convert fret position to grid element correctly', () => {
    const manager = new FretboardGridManager(12);

    // Regular fretted note
    const frettedNote = {
      string: 2,
      fret: 5,
      note: 'A',
      scaleDegree: 3,
      isInScale: true
    };

    const frettedElement = manager.fretPositionToGridElement(frettedNote);
    expect(frettedElement.type).toBe('note-marker');
    expect(frettedElement.position.column).toBe(6); // 5th fret -> column 6
    expect(frettedElement.position.row).toBe(4); // 3rd string -> row 4 (with top placeholder)

    // Open string note
    const openNote = {
      string: 1,
      fret: 0,
      note: 'B',
      scaleDegree: 7,
      isInScale: true
    };

    const openElement = manager.fretPositionToGridElement(openNote);
    expect(openElement.type).toBe('open-string-marker');
    expect(openElement.position.column).toBe(OPEN_STRING_COLUMN);
    expect(openElement.position.row).toBe(3); // 2nd string -> row 3 (with top placeholder)
  });

  it('should convert fret position to marker wrapper element correctly', () => {
    const manager = new FretboardGridManager(12);

    const frettedNote = {
      string: 1,
      fret: 3,
      note: 'D',
      scaleDegree: 2,
      isInScale: true
    };

    const wrapperElement = manager.fretPositionToMarkerWrapperElement(frettedNote);
    expect(wrapperElement.type).toBe('marker-wrapper');
    expect(wrapperElement.position.column).toBe(4); // 3rd fret -> column 4
    expect(wrapperElement.position.row).toBe(3); // 2nd string -> row 3 (with top placeholder)
    expect(wrapperElement.position.layer).toBe(GridLayers.MARKER_WRAPPER);
  });

  it('should get marker wrapper configuration correctly', () => {
    const manager = new FretboardGridManager(12);
    const config = manager.getMarkerWrapperConfig();

    expect(config.width).toBe('100%');
    expect(config.height).toBe('100%');
    expect(config.display).toBe('flex');
    expect(config.alignItems).toBe('center');
    expect(config.justifyContent).toBe('center');
    expect(config.position).toBe('relative');
  });
});