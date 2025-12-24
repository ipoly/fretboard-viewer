import * as fc from 'fast-check'
import { MusicalKey, DisplayMode } from '../types'

// Test data generators for guitar fretboard application
export const testGenerators = {
  musicalKey: fc.constantFrom<MusicalKey>(
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ),

  displayMode: fc.constantFrom<DisplayMode>('notes', 'degrees'),

  fretNumber: fc.integer({ min: 0, max: 24 }),

  stringNumber: fc.integer({ min: 1, max: 6 }),

  scaleDegree: fc.integer({ min: 1, max: 7 }),

  chromaticNote: fc.constantFrom(
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ),
}

// Property test configuration as specified in design document
export const propertyTestConfig = {
  numRuns: 100, // Minimum 100 iterations per property test
  verbose: true,
  seed: 42, // For reproducible tests
}

// Helper function to create property test tags
export const createPropertyTestTag = (featureName: string, propertyNumber: number, propertyText: string) => {
  return `Feature: ${featureName}, Property ${propertyNumber}: ${propertyText}`
}

// Common test constants
export const TEST_CONSTANTS = {
  STANDARD_TUNING: ['E', 'A', 'D', 'G', 'B', 'E'],
  CHROMATIC_NOTES: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  MAJOR_SCALE_INTERVALS: [2, 2, 1, 2, 2, 2, 1],
  DEFAULT_FRET_COUNT: 24,
}