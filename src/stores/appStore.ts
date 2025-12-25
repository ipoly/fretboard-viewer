import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MusicalKey, DisplayMode } from '../types'
import { logger } from '../utils/logger'
import { CHROMATIC_NOTES } from '../utils/constants/music'

interface AppState {
  selectedKey: MusicalKey
  displayMode: DisplayMode
  fretCount: number

  // Actions
  setSelectedKey: (key: MusicalKey) => void
  setDisplayMode: (mode: DisplayMode) => void
  setFretCount: (count: number) => void
}

// Settings validation function
const validateSettings = (state: any): Partial<AppState> => {
  const validated: Partial<AppState> = {}

  // Validate selectedKey
  if (typeof state.selectedKey === 'string' &&
      CHROMATIC_NOTES.includes(state.selectedKey as MusicalKey)) {
    validated.selectedKey = state.selectedKey
  }

  // Validate displayMode
  if (state.displayMode === 'notes' || state.displayMode === 'degrees') {
    validated.displayMode = state.displayMode
  }

  return validated
}

// Check localStorage availability
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

// Create validated storage wrapper with comprehensive error handling
const createValidatedStorage = () => {
  const isStorageAvailable = isLocalStorageAvailable()

  if (!isStorageAvailable) {
    logger.warn('localStorage is not available, falling back to in-memory storage only')
  }

  // Create base storage once, only if localStorage is available
  const baseStorage = isStorageAvailable ? createJSONStorage(() => localStorage) : null

  return {
    getItem: async (name: string) => {
      // If localStorage is not available, return null to use defaults
      if (!isStorageAvailable || !baseStorage) {
        logger.debug('localStorage unavailable, using default settings')
        return null
      }

      try {
        const result = await baseStorage.getItem(name)
        if (!result) {
          logger.debug('No stored settings found, using defaults')
          return null
        }

        // Handle the result from Zustand's storage
        if (result && typeof result === 'object' && 'state' in result) {
          // Validate the loaded state
          const validatedState = validateSettings(result.state)

          // Check if any validation failed and log appropriately
          const originalState = result.state as any
          const hasInvalidKey = originalState.selectedKey && !validatedState.selectedKey
          const hasInvalidMode = originalState.displayMode && !validatedState.displayMode

          if (hasInvalidKey || hasInvalidMode) {
            logger.warn('Some settings were invalid and replaced with defaults', {
              original: originalState,
              validated: validatedState,
              issues: { invalidKey: hasInvalidKey, invalidMode: hasInvalidMode }
            })
          } else {
            logger.debug('Settings loaded and validated successfully', {
              settings: validatedState,
              version: 1,
              age: Date.now() - (originalState.timestamp || 0)
            })
          }

          return {
            ...result,
            state: {
              ...(result.state as any),
              ...validatedState
            }
          }
        }

        return result
      } catch (error) {
        // Handle JSON parsing errors and other localStorage failures
        if (error instanceof SyntaxError) {
          logger.error('localStorage data is corrupted (JSON parse error), clearing and using defaults', {
            error: error.message,
            fallback: 'using default settings'
          })
        } else {
          logger.error('Failed to load settings from localStorage, using defaults', { error })
        }

        // Clear corrupted data if possible
        try {
          if (isStorageAvailable) {
            localStorage.removeItem(name)
            logger.log('Settings cleared from localStorage')
          }
        } catch (clearError) {
          logger.error('Failed to clear corrupted settings data', { clearError })
        }

        return null
      }
    },

    setItem: async (name: string, value: any) => {
      // If localStorage is not available, silently skip saving
      if (!isStorageAvailable || !baseStorage) {
        logger.debug('localStorage unavailable, skipping save operation')
        return
      }

      try {
        await baseStorage.setItem(name, value)
        logger.log('Settings saved successfully to localStorage')
      } catch (error) {
        // Handle quota exceeded and other storage errors
        if (error instanceof Error) {
          if (error.name === 'QuotaExceededError') {
            logger.error('localStorage quota exceeded, unable to save settings', {
              error: error.message,
              fallback: 'continuing with current in-memory state'
            })
          } else {
            logger.error('Failed to save settings to localStorage', {
              error: error.message,
              fallback: 'continuing with current in-memory state'
            })
          }
        } else {
          logger.error('Unknown error saving settings to localStorage', {
            error: String(error),
            fallback: 'continuing with current in-memory state'
          })
        }
        // Don't throw - let the application continue with in-memory state
      }
    },

    removeItem: async (name: string) => {
      if (!isStorageAvailable || !baseStorage) {
        logger.debug('localStorage unavailable, skipping remove operation')
        return
      }

      try {
        await baseStorage.removeItem(name)
        logger.log('Settings cleared from localStorage')
      } catch (error) {
        logger.error('Failed to clear settings from localStorage', {
          error: error instanceof Error ? error.message : String(error),
          impact: 'corrupted data may persist'
        })
        // Don't throw - this is not critical
      }
    },
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedKey: 'C',
      displayMode: 'notes',
      fretCount: 24,

      setSelectedKey: (key) => set({ selectedKey: key }),
      setDisplayMode: (mode) => set({ displayMode: mode }),
      setFretCount: (count) => set({ fretCount: count }),
    }),
    {
      name: 'guitar-fretboard-settings',
      storage: createValidatedStorage(),
      partialize: (state) => ({
        selectedKey: state.selectedKey,
        displayMode: state.displayMode,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          logger.error('Settings rehydration failed during store initialization', {
            error,
            fallback: 'using default settings'
          })
        } else if (state) {
          logger.debug('Settings rehydrated successfully', {
            selectedKey: state.selectedKey,
            displayMode: state.displayMode,
            timestamp: new Date().toISOString()
          })
        } else {
          logger.debug('No previous settings found, initialized with defaults')
        }
      },
    }
  )
)