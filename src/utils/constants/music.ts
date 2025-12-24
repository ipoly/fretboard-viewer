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
  1: '#E74C3C', // Root - Red
  2: '#F39C12', // Second - Orange
  3: '#F1C40F', // Third - Yellow
  4: '#27AE60', // Fourth - Green
  5: '#3498DB', // Fifth - Blue
  6: '#9B59B6', // Sixth - Purple
  7: '#E91E63', // Seventh - Pink
}