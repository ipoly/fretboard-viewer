import { MusicalKey } from '../../types'

// Standard guitar tuning (high to low for display purposes)
// 1st string (thinnest) to 6th string (thickest)
export const STANDARD_TUNING = ['E', 'B', 'G', 'D', 'A', 'E']

// Major scale interval pattern (semitones)
export const MAJOR_SCALE_INTERVALS = [2, 2, 1, 2, 2, 2, 1]

// Chromatic scale
export const CHROMATIC_NOTES: MusicalKey[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Color scheme for scale degrees
export const SCALE_DEGREE_COLORS = {
  1: '#FF6B6B', // Root - Red
  2: '#4ECDC4', // Second - Teal
  3: '#45B7D1', // Third - Blue
  4: '#96CEB4', // Fourth - Green
  5: '#FFEAA7', // Fifth - Yellow
  6: '#DDA0DD', // Sixth - Purple
  7: '#98D8C8', // Seventh - Mint
}