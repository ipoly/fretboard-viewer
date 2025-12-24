import { MusicalKey } from '../../types'
import { CHROMATIC_NOTES, MAJOR_SCALE_INTERVALS } from '../constants/music'

/**
 * Interface for scale information
 */
export interface ScaleInfo {
  notes: string[]
  degrees: number[]
  intervals: number[]
}

/**
 * Calculate the major scale for a given root note
 * @param rootNote The root note of the scale
 * @returns ScaleInfo containing notes, degrees, and intervals
 */
export function calculateMajorScale(rootNote: MusicalKey): ScaleInfo {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote)
  if (rootIndex === -1) {
    throw new Error(`Invalid root note: ${rootNote}`)
  }

  const notes: string[] = []
  const degrees = [1, 2, 3, 4, 5, 6, 7]
  let currentIndex = rootIndex

  // Add the root note
  notes.push(CHROMATIC_NOTES[currentIndex])

  // Calculate the rest of the scale using intervals
  for (let i = 0; i < MAJOR_SCALE_INTERVALS.length - 1; i++) {
    currentIndex = (currentIndex + MAJOR_SCALE_INTERVALS[i]) % CHROMATIC_NOTES.length
    notes.push(CHROMATIC_NOTES[currentIndex])
  }

  return {
    notes,
    degrees,
    intervals: MAJOR_SCALE_INTERVALS
  }
}

/**
 * Get the scale degree of a note within a given scale
 * @param note The note to find the degree for
 * @param scale The scale information
 * @returns The scale degree (1-7) or null if not in scale
 */
export function getScaleDegree(note: string, scale: ScaleInfo): number | null {
  const noteIndex = scale.notes.indexOf(note)
  if (noteIndex === -1) {
    return null
  }
  return scale.degrees[noteIndex]
}

/**
 * Get the note at a specific scale degree
 * @param degree The scale degree (1-7)
 * @param scale The scale information
 * @returns The note name or null if invalid degree
 */
export function getNoteAtDegree(degree: number, scale: ScaleInfo): string | null {
  if (degree < 1 || degree > 7) {
    return null
  }
  const degreeIndex = scale.degrees.indexOf(degree)
  if (degreeIndex === -1) {
    return null
  }
  return scale.notes[degreeIndex]
}

/**
 * Check if a note belongs to a given scale
 * @param note The note to check
 * @param scale The scale information
 * @returns True if the note is in the scale
 */
export function isNoteInScale(note: string, scale: ScaleInfo): boolean {
  return scale.notes.includes(note)
}

/**
 * Get all chromatic notes starting from a given root
 * @param rootNote The starting note
 * @returns Array of all 12 chromatic notes starting from root
 */
export function getChromaticScale(rootNote: MusicalKey): string[] {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote)
  if (rootIndex === -1) {
    throw new Error(`Invalid root note: ${rootNote}`)
  }

  const chromaticScale: string[] = []
  for (let i = 0; i < CHROMATIC_NOTES.length; i++) {
    const noteIndex = (rootIndex + i) % CHROMATIC_NOTES.length
    chromaticScale.push(CHROMATIC_NOTES[noteIndex])
  }

  return chromaticScale
}