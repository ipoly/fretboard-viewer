// Core musical types
export type MusicalKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
export type DisplayMode = 'notes' | 'degrees'

// Guitar-specific types
export interface GuitarString {
  number: number
  openNote: string
  tuning: string
}

export interface FretPosition {
  string: number
  fret: number
  note: string
  scaleDegree: number | null
  isInScale: boolean
}

// UI State types
export interface ViewportState {
  scrollPosition: number
  visibleFretRange: [number, number]
}

// Application configuration
export interface AppConfig {
  defaultKey: MusicalKey
  defaultDisplayMode: DisplayMode
  maxFrets: number
  standardTuning: string[]
  colorScheme: Record<number, string>
}