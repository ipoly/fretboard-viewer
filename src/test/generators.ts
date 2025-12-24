import * as fc from 'fast-check'

// Musical key generator for property-based testing
export const musicalKeyArbitrary = fc.constantFrom(
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
)

// Display mode generator
export const displayModeArbitrary = fc.constantFrom('notes', 'degrees')

// Fret number generator (0-24 frets)
export const fretNumberArbitrary = fc.integer({ min: 0, max: 24 })

// String number generator (1-6 strings)
export const stringNumberArbitrary = fc.integer({ min: 1, max: 6 })

// Scale degree generator (1-7)
export const scaleDegreeArbitrary = fc.integer({ min: 1, max: 7 })

// Chromatic note generator
export const chromaticNoteArbitrary = fc.constantFrom(
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
)

// Fret position generator
export const fretPositionArbitrary = fc.record({
  fret: fretNumberArbitrary,
  string: stringNumberArbitrary,
})

// Property test configuration
export const propertyTestConfig = {
  numRuns: 100, // Minimum 100 iterations as specified in design
  verbose: true,
}