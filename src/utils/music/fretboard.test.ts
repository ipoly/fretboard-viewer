import { describe, it, expect } from 'vitest'
import {
  getNoteAtPosition,
  getFretboardPositions,
  getPositionsForNote,
  getPositionsForScaleDegree,
  normalizeNoteName,
  getStringNames,
  getOpenNote
} from './fretboard'
import { MusicalKey } from '../../types'
import { STANDARD_TUNING, CHROMATIC_NOTES } from '../constants/music'

describe('Fretboard Calculations - Unit Tests', () => {
  describe('getNoteAtPosition', () => {
    it('should return correct notes for open strings', () => {
      // Test all open strings (fret 0)
      expect(getNoteAtPosition(0, 0)).toBe('E') // Low E string
      expect(getNoteAtPosition(1, 0)).toBe('B') // B string
      expect(getNoteAtPosition(2, 0)).toBe('G') // G string
      expect(getNoteAtPosition(3, 0)).toBe('D') // D string
      expect(getNoteAtPosition(4, 0)).toBe('A') // A string
      expect(getNoteAtPosition(5, 0)).toBe('E') // High E string
    })

    it('should calculate correct notes for specific fret positions', () => {
      // Test known positions
      expect(getNoteAtPosition(0, 1)).toBe('F')  // Low E string, 1st fret = F
      expect(getNoteAtPosition(0, 3)).toBe('G')  // Low E string, 3rd fret = G
      expect(getNoteAtPosition(0, 5)).toBe('A')  // Low E string, 5th fret = A
      expect(getNoteAtPosition(0, 12)).toBe('E') // Low E string, 12th fret = E (octave)

      expect(getNoteAtPosition(1, 1)).toBe('C')  // B string, 1st fret = C
      expect(getNoteAtPosition(2, 2)).toBe('A')  // G string, 2nd fret = A
      expect(getNoteAtPosition(3, 2)).toBe('E')  // D string, 2nd fret = E
      expect(getNoteAtPosition(4, 2)).toBe('B')  // A string, 2nd fret = B
      expect(getNoteAtPosition(5, 3)).toBe('G')  // High E string, 3rd fret = G
    })

    it('should handle chromatic progression correctly', () => {
      // Test chromatic progression on low E string
      const expectedNotes = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E']
      for (let fret = 0; fret <= 12; fret++) {
        expect(getNoteAtPosition(0, fret)).toBe(expectedNotes[fret])
      }
    })

    it('should handle higher fret numbers correctly', () => {
      // Test that fret 24 is two octaves higher than open
      expect(getNoteAtPosition(0, 24)).toBe('E') // Low E string, 24th fret = E
      expect(getNoteAtPosition(1, 24)).toBe('B') // B string, 24th fret = B
      expect(getNoteAtPosition(5, 24)).toBe('E') // High E string, 24th fret = E
    })

    it('should throw error for invalid string numbers', () => {
      expect(() => getNoteAtPosition(-1, 0)).toThrow('Invalid string number: -1')
      expect(() => getNoteAtPosition(6, 0)).toThrow('Invalid string number: 6')
      expect(() => getNoteAtPosition(10, 0)).toThrow('Invalid string number: 10')
    })

    it('should throw error for invalid fret numbers', () => {
      expect(() => getNoteAtPosition(0, -1)).toThrow('Invalid fret number: -1')
      expect(() => getNoteAtPosition(0, -5)).toThrow('Invalid fret number: -5')
    })
  })

  describe('getFretboardPositions', () => {
    it('should return positions only for notes in the selected key', () => {
      const positions = getFretboardPositions('C', 12)

      // All positions should be in C major scale
      const cMajorNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
      for (const position of positions) {
        expect(cMajorNotes).toContain(position.note)
        expect(position.isInScale).toBe(true)
        expect(position.scaleDegree).toBeGreaterThanOrEqual(1)
        expect(position.scaleDegree).toBeLessThanOrEqual(7)
      }
    })

    it('should exclude open strings (fret 0)', () => {
      const positions = getFretboardPositions('C', 12)

      // No position should have fret 0
      for (const position of positions) {
        expect(position.fret).toBeGreaterThan(0)
      }
    })

    it('should respect maxFrets parameter', () => {
      const positions5 = getFretboardPositions('C', 5)
      const positions12 = getFretboardPositions('C', 12)

      // All positions in 5-fret should be <= 5
      for (const position of positions5) {
        expect(position.fret).toBeLessThanOrEqual(5)
      }

      // 12-fret should have more positions than 5-fret
      expect(positions12.length).toBeGreaterThan(positions5.length)
    })

    it('should handle different keys correctly', () => {
      const cPositions = getFretboardPositions('C', 12)
      const gPositions = getFretboardPositions('G', 12)

      // Should have different notes for different keys
      const cNotes = new Set(cPositions.map(p => p.note))
      const gNotes = new Set(gPositions.map(p => p.note))

      expect(cNotes).not.toEqual(gNotes)

      // G major should include F# but not F
      expect([...gNotes]).toContain('F#')
      expect([...gNotes]).not.toContain('F')
    })

    it('should have valid string and fret ranges', () => {
      const positions = getFretboardPositions('C', 24)

      for (const position of positions) {
        expect(position.string).toBeGreaterThanOrEqual(0)
        expect(position.string).toBeLessThan(STANDARD_TUNING.length)
        expect(position.fret).toBeGreaterThan(0)
        expect(position.fret).toBeLessThanOrEqual(24)
      }
    })
  })

  describe('getPositionsForNote', () => {
    it('should find all positions for a specific note', () => {
      const cPositions = getPositionsForNote('C', 12)

      // Verify each position actually contains the note C
      for (const position of cPositions) {
        const noteAtPosition = getNoteAtPosition(position.string, position.fret)
        expect(noteAtPosition).toBe('C')
      }
    })

    it('should include open string positions when applicable', () => {
      const ePositions = getPositionsForNote('E', 12)

      // Should include open E strings (string 0 and 5, fret 0)
      const openPositions = ePositions.filter(p => p.fret === 0)
      expect(openPositions).toHaveLength(2) // Two E strings
      expect(openPositions.some(p => p.string === 0)).toBe(true) // Low E
      expect(openPositions.some(p => p.string === 5)).toBe(true) // High E
    })

    it('should respect maxFrets parameter', () => {
      const positions5 = getPositionsForNote('C', 5)
      const positions12 = getPositionsForNote('C', 12)

      // All positions should be within fret limit
      for (const position of positions5) {
        expect(position.fret).toBeLessThanOrEqual(5)
      }

      // Should find more positions with higher fret limit
      expect(positions12.length).toBeGreaterThan(positions5.length)
    })

    it('should find positions across all strings', () => {
      const cPositions = getPositionsForNote('C', 24)

      // Should find C on multiple strings
      const stringsWithC = new Set(cPositions.map(p => p.string))
      expect(stringsWithC.size).toBeGreaterThan(1)
    })
  })

  describe('getPositionsForScaleDegree', () => {
    it('should find positions for scale degrees in C major', () => {
      // Test root note (degree 1) in C major
      const rootPositions = getPositionsForScaleDegree(1, 'C', 12)

      // All positions should be C notes
      for (const position of rootPositions) {
        expect(position.note).toBe('C')
        const noteAtPosition = getNoteAtPosition(position.string, position.fret)
        expect(noteAtPosition).toBe('C')
      }
    })

    it('should find positions for different scale degrees', () => {
      // Test different degrees in G major
      const degree1 = getPositionsForScaleDegree(1, 'G', 12) // G
      const degree3 = getPositionsForScaleDegree(3, 'G', 12) // B
      const degree7 = getPositionsForScaleDegree(7, 'G', 12) // F#

      // Should all be different notes
      expect(degree1[0].note).toBe('G')
      expect(degree3[0].note).toBe('B')
      expect(degree7[0].note).toBe('F#')
    })

    it('should throw error for invalid scale degrees', () => {
      expect(() => getPositionsForScaleDegree(0, 'C', 12)).toThrow('Invalid scale degree: 0')
      expect(() => getPositionsForScaleDegree(8, 'C', 12)).toThrow('Invalid scale degree: 8')
      expect(() => getPositionsForScaleDegree(-1, 'C', 12)).toThrow('Invalid scale degree: -1')
    })

    it('should respect maxFrets parameter', () => {
      const positions5 = getPositionsForScaleDegree(1, 'C', 5)
      const positions12 = getPositionsForScaleDegree(1, 'C', 12)

      // All positions should be within fret limit
      for (const position of positions5) {
        expect(position.fret).toBeLessThanOrEqual(5)
      }

      // Should find more positions with higher fret limit
      expect(positions12.length).toBeGreaterThan(positions5.length)
    })
  })

  describe('normalizeNoteName', () => {
    it('should convert flat notes to sharp equivalents', () => {
      expect(normalizeNoteName('Db')).toBe('C#')
      expect(normalizeNoteName('Eb')).toBe('D#')
      expect(normalizeNoteName('Gb')).toBe('F#')
      expect(normalizeNoteName('Ab')).toBe('G#')
      expect(normalizeNoteName('Bb')).toBe('A#')
    })

    it('should leave sharp and natural notes unchanged', () => {
      expect(normalizeNoteName('C')).toBe('C')
      expect(normalizeNoteName('C#')).toBe('C#')
      expect(normalizeNoteName('D')).toBe('D')
      expect(normalizeNoteName('F#')).toBe('F#')
      expect(normalizeNoteName('G')).toBe('G')
    })

    it('should handle unknown notes by returning them unchanged', () => {
      expect(normalizeNoteName('X')).toBe('X')
      expect(normalizeNoteName('H')).toBe('H')
    })
  })

  describe('getStringNames', () => {
    it('should return standard tuning string names', () => {
      const stringNames = getStringNames()
      expect(stringNames).toEqual(['E', 'B', 'G', 'D', 'A', 'E'])
      expect(stringNames).toHaveLength(6)
    })

    it('should return a copy of the tuning array', () => {
      const stringNames = getStringNames()
      stringNames[0] = 'X' // Modify the returned array

      // Original should be unchanged
      expect(getStringNames()[0]).toBe('E')
    })
  })

  describe('getOpenNote', () => {
    it('should return correct open notes for all strings', () => {
      expect(getOpenNote(0)).toBe('E') // Low E
      expect(getOpenNote(1)).toBe('B') // B
      expect(getOpenNote(2)).toBe('G') // G
      expect(getOpenNote(3)).toBe('D') // D
      expect(getOpenNote(4)).toBe('A') // A
      expect(getOpenNote(5)).toBe('E') // High E
    })

    it('should throw error for invalid string numbers', () => {
      expect(() => getOpenNote(-1)).toThrow('Invalid string number: -1')
      expect(() => getOpenNote(6)).toThrow('Invalid string number: 6')
      expect(() => getOpenNote(10)).toThrow('Invalid string number: 10')
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle maximum fret numbers correctly', () => {
      // Test with very high fret numbers
      const note = getNoteAtPosition(0, 100)
      expect(CHROMATIC_NOTES.includes(note as MusicalKey)).toBe(true)
    })

    it('should handle all chromatic notes as input', () => {
      for (const note of CHROMATIC_NOTES) {
        const positions = getPositionsForNote(note, 12)
        expect(positions.length).toBeGreaterThan(0)
      }
    })

    it('should handle all musical keys for fretboard positions', () => {
      for (const key of CHROMATIC_NOTES) {
        const positions = getFretboardPositions(key, 12)
        expect(positions.length).toBeGreaterThan(0)

        // All positions should have valid scale degrees
        for (const position of positions) {
          expect(position.scaleDegree).toBeGreaterThanOrEqual(1)
          expect(position.scaleDegree).toBeLessThanOrEqual(7)
        }
      }
    })

    it('should handle zero maxFrets parameter', () => {
      const positions = getFretboardPositions('C', 0)
      expect(positions).toHaveLength(0) // No frets means no positions
    })

    it('should handle single fret parameter', () => {
      const positions = getFretboardPositions('C', 1)

      // All positions should be on fret 1
      for (const position of positions) {
        expect(position.fret).toBe(1)
      }
    })
  })
})