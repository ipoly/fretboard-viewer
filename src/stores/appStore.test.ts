import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAppStore } from './appStore'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('AppStore with Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    useAppStore.setState({
      selectedKey: 'C',
      displayMode: 'notes',
      fretCount: 24,
    })
  })

  it('should initialize with default values', () => {
    const state = useAppStore.getState()
    expect(state.selectedKey).toBe('C')
    expect(state.displayMode).toBe('notes')
    expect(state.fretCount).toBe(24)
  })

  it('should update selectedKey', () => {
    const { setSelectedKey } = useAppStore.getState()
    setSelectedKey('G')

    const state = useAppStore.getState()
    expect(state.selectedKey).toBe('G')
  })

  it('should update displayMode', () => {
    const { setDisplayMode } = useAppStore.getState()
    setDisplayMode('degrees')

    const state = useAppStore.getState()
    expect(state.displayMode).toBe('degrees')
  })

  it('should update fretCount', () => {
    const { setFretCount } = useAppStore.getState()
    setFretCount(12)

    const state = useAppStore.getState()
    expect(state.fretCount).toBe(12)
  })
})