import { create } from 'zustand'
import { MusicalKey, DisplayMode } from '../types'

interface AppState {
  selectedKey: MusicalKey
  displayMode: DisplayMode
  fretCount: number

  // Actions
  setSelectedKey: (key: MusicalKey) => void
  setDisplayMode: (mode: DisplayMode) => void
  setFretCount: (count: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedKey: 'C',
  displayMode: 'notes',
  fretCount: 24,

  setSelectedKey: (key) => set({ selectedKey: key }),
  setDisplayMode: (mode) => set({ displayMode: mode }),
  setFretCount: (count) => set({ fretCount: count }),
}))