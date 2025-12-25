/**
 * Tests for CSS Grid utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  stringToGridRow,
  fretToGridColumn,
  OPEN_STRING_COLUMN,
  calculateGridDimensions,
  getFretLinePosition,
  getStringLinePosition,
  getOpenStringMarkerPosition,
  getNoteMarkerPosition,
  GridLayers,
  FretboardGridManager
} from './index';

describe('Grid Coordinate Mapping', () => {
  it('should map string index to grid row correctly', () => {
    expect(stringToGridRow(0)).toBe(1); // High E string -> row 1
    expect(stringToGridRow(1)).toBe(2); // B string -> row 2
    expect(stringToGridRow(5)).toBe(6); // Low E string -> row 6
  });

  it('should map fret number to grid column correctly', () => {
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
    expect(dimensions.rows).toBe(6); // 6 strings
    expect(dimensions.cellWidth).toBe('var(--fret-width)');
    expect(dimensions.cellHeight).toBe('var(--string-height)');
  });
});

describe('Grid Positions', () => {
  it('should get fret line position correctly', () => {
    const position = getFretLinePosition(5);
    expect(position.column).toBe(6); // 5th fret -> column 6
    expect(position.row).toBe(1); // Will span all rows
    expect(position.layer).toBe(GridLayers.FRET_LINES);
  });

  it('should get string line position correctly', () => {
    const position = getStringLinePosition(2);
    expect(position.column).toBe(2); // Will span from column 2
    expect(position.row).toBe(3); // 3rd string -> row 3
    expect(position.layer).toBe(GridLayers.STRING_LINES);
  });

  it('should get open string marker position correctly', () => {
    const position = getOpenStringMarkerPosition(1);
    expect(position.column).toBe(OPEN_STRING_COLUMN);
    expect(position.row).toBe(2); // 2nd string -> row 2
    expect(position.layer).toBe(GridLayers.OPEN_STRING_MARKERS);
  });

  it('should get note marker position correctly', () => {
    const position = getNoteMarkerPosition(3, 7);
    expect(position.column).toBe(8); // 7th fret -> column 8
    expect(position.row).toBe(4); // 4th string -> row 4
    expect(position.layer).toBe(GridLayers.NOTE_MARKERS);
  });
});

describe('FretboardGridManager', () => {
  it('should initialize with correct dimensions', () => {
    const manager = new FretboardGridManager(15);
    const dimensions = manager.getDimensions();

    expect(manager.getFretCount()).toBe(15);
    expect(dimensions.columns).toBe(16); // 15 frets + 1 open string
    expect(dimensions.rows).toBe(6);
  });

  it('should generate layout config correctly', () => {
    const manager = new FretboardGridManager(12);
    const config = manager.getLayoutConfig();

    expect(config.fretCount).toBe(12);
    expect(config.dimensions.columns).toBe(13);
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
      row: 7, // Beyond 6 strings
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
    expect(frettedElement.position.row).toBe(3); // 3rd string -> row 3

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
    expect(openElement.position.row).toBe(2); // 2nd string -> row 2
  });
});