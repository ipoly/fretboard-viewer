import { MusicalKey, FretPosition } from '../../types'
import { STANDARD_TUNING, CHROMATIC_NOTES } from '../constants/music'
import { calculateMajorScale, getScaleDegree, isNoteInScale } from './scales'

/**
 * Get the note at a specific fret position on a guitar string
 * @param stringNumber The string number (0-5, where 0 is low E)
 * @param fret The fret number (0 = open string)
 * @returns The note name at that position
 */
export function getNoteAtPosition(stringNumber: number, fret: number): string {
  if (stringNumber < 0 || stringNumber >= STANDARD_TUNING.length) {
    throw new Error(`Invalid string number: ${stringNumber}. Must be 0-${STANDARD_TUNING.length - 1}`)
  }

  if (fret < 0) {
    throw new Error(`Invalid fret number: ${fret}. Must be 0 or greater`)
  }

  const openNote = STANDARD_TUNING[stringNumber]
  const openNoteIndex = CHROMATIC_NOTES.indexOf(openNote as MusicalKey)

  if (openNoteIndex === -1) {
    throw new Error(`Invalid open note: ${openNote}`)
  }

  // Calculate the note by adding semitones (frets)
  const noteIndex = (openNoteIndex + fret) % CHROMATIC_NOTES.length
  return CHROMATIC_NOTES[noteIndex]
}

/**
 * Get all fret positions for notes in a given key's major scale
 * @param selectedKey The musical key
 * @param maxFrets Maximum number of frets to calculate (default 24)
 * @returns Array of FretPosition objects for notes in the scale
 */
export function getFretboardPositions(selectedKey: MusicalKey, maxFrets: number = 24): FretPosition[] {
  const scale = calculateMajorScale(selectedKey)
  const positions: FretPosition[] = []

  // Iterate through each string
  for (let stringNum = 0; stringNum < STANDARD_TUNING.length; stringNum++) {
    // Iterate through each fret on this string
    for (let fret = 0; fret <= maxFrets; fret++) {
      const note = getNoteAtPosition(stringNum, fret)
      const scaleDegree = getScaleDegree(note, scale)
      const inScale = isNoteInScale(note, scale)

      // Only include positions that are in the scale
      if (inScale && scaleDegree !== null) {
        positions.push({
          string: stringNum,
          fret,
          note,
          scaleDegree,
          isInScale: true
        })
      }
    }
  }

  return positions
}

/**
 * Get all positions where a specific note appears on the fretboard
 * @param note The note to find
 * @param maxFrets Maximum number of frets to search (default 24)
 * @returns Array of {string, fret} positions where the note appears
 */
export function getPositionsForNote(note: string, maxFrets: number = 24): Array<{string: number, fret: number}> {
  const positions: Array<{string: number, fret: number}> = []

  for (let stringNum = 0; stringNum < STANDARD_TUNING.length; stringNum++) {
    for (let fret = 0; fret <= maxFrets; fret++) {
      const noteAtPosition = getNoteAtPosition(stringNum, fret)
      if (noteAtPosition === note) {
        positions.push({ string: stringNum, fret })
      }
    }
  }

  return positions
}

/**
 * Get all positions where a specific scale degree appears on the fretboard
 * @param degree The scale degree (1-7)
 * @param selectedKey The musical key
 * @param maxFrets Maximum number of frets to search (default 24)
 * @returns Array of {string, fret, note} positions where the degree appears
 */
export function getPositionsForScaleDegree(
  degree: number,
  selectedKey: MusicalKey,
  maxFrets: number = 24
): Array<{string: number, fret: number, note: string}> {
  if (degree < 1 || degree > 7) {
    throw new Error(`Invalid scale degree: ${degree}. Must be 1-7`)
  }

  const scale = calculateMajorScale(selectedKey)
  const noteForDegree = scale.notes[degree - 1] // Convert 1-based to 0-based index
  const positions: Array<{string: number, fret: number, note: string}> = []

  for (let stringNum = 0; stringNum < STANDARD_TUNING.length; stringNum++) {
    for (let fret = 0; fret <= maxFrets; fret++) {
      const noteAtPosition = getNoteAtPosition(stringNum, fret)
      if (noteAtPosition === noteForDegree) {
        positions.push({ string: stringNum, fret, note: noteAtPosition })
      }
    }
  }

  return positions
}

/**
 * Handle enharmonic equivalents by normalizing note names
 * @param note The note name to normalize
 * @returns The normalized note name (prefers sharps over flats)
 */
export function normalizeNoteName(note: string): string {
  // Map of flat notes to their sharp equivalents
  const enharmonicMap: Record<string, string> = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
  }

  return enharmonicMap[note] || note
}

/**
 * Get the string names for display purposes
 * @returns Array of string names from low to high
 */
export function getStringNames(): string[] {
  return [...STANDARD_TUNING]
}

/**
 * Get the open note for a specific string
 * @param stringNumber The string number (0-5)
 * @returns The open note name
 */
export function getOpenNote(stringNumber: number): string {
  if (stringNumber < 0 || stringNumber >= STANDARD_TUNING.length) {
    throw new Error(`Invalid string number: ${stringNumber}`)
  }
  return STANDARD_TUNING[stringNumber]
}