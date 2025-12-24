import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  calculateMajorScale,
  getScaleDegree,
  isNoteInScale,
  getNoteAtDegree,
  getChromaticScale
} from './scales'
import { normalizeNoteName } from './fretboard'
import { musicalKeyArbitrary, propertyTestConfig } from '../../test/generators'
import { CHROMATIC_NOTES, MAJOR_SCALE_INTERVALS } from '../constants/music'
import { MusicalKey } from '../../types'

describe('Scale Theory Correctness - Property Tests', () => {
  /**
   * Property 3: Scale Theory Correctness
   * For any selected musical key, all displayed notes should belong to that key's major scale,
   * calculated using the correct chromatic interval pattern (W-W-H-W-W-W-H),
   * and enharmonic equivalents should be handled consistently.
   *
   * Feature: guitar-fretboard-viewer, Property 3: Scale Theory Correctness
   * Validates: Requirements 4.2, 4.3, 4.4
   */

  it('Property 3a: Major scale calculation follows correct interval pattern', () => {
    fc.assert(
      fc.property(musicalKeyArbitrary, (key: MusicalKey) => {
        const scale = calculateMajorScale(key)

        // Verify scale has exactly 7 notes
        expect(scale.notes).toHaveLength(7)
        expect(scale.degrees).toEqual([1, 2, 3, 4, 5, 6, 7])
        expect(scale.intervals).toEqual(MAJOR_SCALE_INTERVALS)

        // Verify interval pattern W-W-H-W-W-W-H (2-2-1-2-2-2-1 semitones)
        const rootIndex = CHROMATIC_NOTES.indexOf(key)
        let expectedIndex = rootIndex

        for (let i = 0; i < scale.notes.length; i++) {
          const actualNote = scale.notes[i]
          const expectedNote = CHROMATIC_NOTES[expectedIndex % CHROMATIC_NOTES.length]

          // The note should match the expected position in chromatic scale
          expect(actualNote).toBe(expectedNote)

          // Move to next note using the interval (except for the last note)
          if (i < MAJOR_SCALE_INTERVALS.length - 1) {
            expectedIndex += MAJOR_SCALE_INTERVALS[i]
          }
        }

        return true
      }),
      propertyTestConfig
    )
  })

  it('Property 3b: All notes in calculated scale belong to the major scale', () => {
    fc.assert(
      fc.property(musicalKeyArbitrary, (key: MusicalKey) => {
        const scale = calculateMajorScale(key)

        // Every note in the scale should be identified as being in the scale
        for (const note of scale.notes) {
          expect(isNoteInScale(note, scale)).toBe(true)
        }

        // Every note should have a valid scale degree (1-7)
        for (const note of scale.notes) {
          const degree = getScaleDegree(note, scale)
          expect(degree).not.toBeNull()
          expect(degree).toBeGreaterThanOrEqual(1)
          expect(degree).toBeLessThanOrEqual(7)
        }

        return true
      }),
      propertyTestConfig
    )
  })

  it('Property 3c: Scale degree mapping is consistent and bijective', () => {
    fc.assert(
      fc.property(musicalKeyArbitrary, (key: MusicalKey) => {
        const scale = calculateMajorScale(key)

        // Test bidirectional mapping between notes and degrees
        for (let degree = 1; degree <= 7; degree++) {
          const noteAtDegree = getNoteAtDegree(degree, scale)
          expect(noteAtDegree).not.toBeNull()

          if (noteAtDegree) {
            const degreeOfNote = getScaleDegree(noteAtDegree, scale)
            expect(degreeOfNote).toBe(degree)
          }
        }

        // Test that each note maps to exactly one degree
        for (const note of scale.notes) {
          const degree = getScaleDegree(note, scale)
          expect(degree).not.toBeNull()

          if (degree) {
            const noteAtDegree = getNoteAtDegree(degree, scale)
            expect(noteAtDegree).toBe(note)
          }
        }

        return true
      }),
      propertyTestConfig
    )
  })

  it('Property 3d: Enharmonic equivalents are handled consistently', () => {
    fc.assert(
      fc.property(musicalKeyArbitrary, (key: MusicalKey) => {
        const scale = calculateMajorScale(key)

        // All notes in the scale should be from the chromatic notes set (no flats)
        for (const note of scale.notes) {
          expect(CHROMATIC_NOTES.includes(note as MusicalKey)).toBe(true)
        }

        // Test that normalization is consistent
        const enharmonicPairs = [
          ['C#', 'Db'],
          ['D#', 'Eb'],
          ['F#', 'Gb'],
          ['G#', 'Ab'],
          ['A#', 'Bb']
        ]

        for (const [sharp, flat] of enharmonicPairs) {
          expect(normalizeNoteName(flat)).toBe(sharp)
          expect(normalizeNoteName(sharp)).toBe(sharp) // Should remain unchanged
        }

        return true
      }),
      propertyTestConfig
    )
  })

  it('Property 3e: Non-scale notes are correctly identified', () => {
    fc.assert(
      fc.property(musicalKeyArbitrary, (key: MusicalKey) => {
        const scale = calculateMajorScale(key)

        // Find notes that are NOT in the scale
        const nonScaleNotes = CHROMATIC_NOTES.filter(note => !scale.notes.includes(note))

        // These notes should not be identified as being in the scale
        for (const note of nonScaleNotes) {
          expect(isNoteInScale(note, scale)).toBe(false)
          expect(getScaleDegree(note, scale)).toBeNull()
        }

        // Should have exactly 5 non-scale notes (12 chromatic - 7 scale = 5)
        expect(nonScaleNotes).toHaveLength(5)

        return true
      }),
      propertyTestConfig
    )
  })

  it('Property 3f: Chromatic scale generation is correct', () => {
    fc.assert(
      fc.property(musicalKeyArbitrary, (key: MusicalKey) => {
        const chromaticScale = getChromaticScale(key)

        // Should have exactly 12 notes
        expect(chromaticScale).toHaveLength(12)

        // Should start with the root note
        expect(chromaticScale[0]).toBe(key)

        // Should contain all chromatic notes exactly once
        const sortedChromatic = [...chromaticScale].sort()
        const sortedExpected = [...CHROMATIC_NOTES].sort()
        expect(sortedChromatic).toEqual(sortedExpected)

        // Each note should appear exactly once
        const noteSet = new Set(chromaticScale)
        expect(noteSet.size).toBe(12)

        return true
      }),
      propertyTestConfig
    )
  })
})

describe('Scale Theory Correctness - Unit Tests', () => {
  it('should calculate C major scale correctly', () => {
    const scale = calculateMajorScale('C')
    expect(scale.notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B'])
    expect(scale.degrees).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('should calculate G major scale correctly', () => {
    const scale = calculateMajorScale('G')
    expect(scale.notes).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F#'])
  })

  it('should handle edge cases for invalid inputs', () => {
    expect(() => calculateMajorScale('X' as MusicalKey)).toThrow('Invalid root note: X')
    expect(getScaleDegree('X', calculateMajorScale('C'))).toBeNull()
    expect(getNoteAtDegree(0, calculateMajorScale('C'))).toBeNull()
    expect(getNoteAtDegree(8, calculateMajorScale('C'))).toBeNull()
  })
})