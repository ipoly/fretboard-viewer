import { MusicalKey, DisplayMode } from '../types'
import { CHROMATIC_NOTES } from './constants/music'
import { logger } from './logger'

// Types for persisted settings
export interface PersistedSettings {
  selectedKey: MusicalKey
  displayMode: DisplayMode
  version: number
  timestamp: number
}

// Default settings values
export const DEFAULT_SETTINGS = {
  selectedKey: 'C' as MusicalKey,
  displayMode: 'notes' as DisplayMode,
}

// Storage key for localStorage
export const STORAGE_KEY = 'guitar-fretboard-settings'

/**
 * Settings validation utilities
 */
export class SettingsValidator {
  /**
   * Validates if a value is a valid MusicalKey
   */
  static validateMusicalKey(key: unknown): key is MusicalKey {
    return typeof key === 'string' && CHROMATIC_NOTES.includes(key as MusicalKey)
  }

  /**
   * Validates if a value is a valid DisplayMode
   */
  static validateDisplayMode(mode: unknown): mode is DisplayMode {
    return mode === 'notes' || mode === 'degrees'
  }

  /**
   * Validates and sanitizes loaded settings, returning valid settings with defaults for invalid ones
   */
  static validateSettings(settings: unknown): Partial<PersistedSettings> {
    const validated: Partial<PersistedSettings> = {}

    if (typeof settings === 'object' && settings !== null) {
      const settingsObj = settings as any

      // Validate selectedKey
      if (this.validateMusicalKey(settingsObj.selectedKey)) {
        validated.selectedKey = settingsObj.selectedKey
      }

      // Validate displayMode
      if (this.validateDisplayMode(settingsObj.displayMode)) {
        validated.displayMode = settingsObj.displayMode
      }

      // Validate version (should be a number)
      if (typeof settingsObj.version === 'number') {
        validated.version = settingsObj.version
      }

      // Validate timestamp (should be a number)
      if (typeof settingsObj.timestamp === 'number') {
        validated.timestamp = settingsObj.timestamp
      }
    }

    return validated
  }
}

/**
 * localStorage availability checker
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Custom storage wrapper with validation and comprehensive error handling
 */
export class ValidatedStorage {
  private isAvailable: boolean

  constructor() {
    this.isAvailable = isLocalStorageAvailable()
    if (!this.isAvailable) {
      logger.warn('localStorage is not available, falling back to in-memory storage', {
        reason: 'localStorage unavailable or disabled'
      })
    }
  }

  /**
   * Saves settings to localStorage with comprehensive error handling
   */
  saveSettings(settings: Partial<PersistedSettings>): boolean {
    if (!this.isAvailable) {
      logger.debug('localStorage unavailable, skipping save operation')
      return false
    }

    try {
      const settingsToSave: PersistedSettings = {
        selectedKey: settings.selectedKey || DEFAULT_SETTINGS.selectedKey,
        displayMode: settings.displayMode || DEFAULT_SETTINGS.displayMode,
        version: 1,
        timestamp: Date.now(),
      }

      const serialized = JSON.stringify(settingsToSave)
      localStorage.setItem(STORAGE_KEY, serialized)

      logger.debug('Settings saved successfully', {
        settings: settingsToSave,
        size: serialized.length
      })
      return true
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          logger.error('localStorage quota exceeded, unable to save settings', {
            error: error.message,
            fallback: 'continuing with current in-memory state'
          })
        } else if (error.name === 'SecurityError') {
          logger.error('localStorage access denied (security error)', {
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
      return false
    }
  }

  /**
   * Loads settings from localStorage with validation and comprehensive error handling
   */
  loadSettings(): Partial<PersistedSettings> {
    if (!this.isAvailable) {
      logger.debug('localStorage unavailable, using default settings')
      return DEFAULT_SETTINGS
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        logger.debug('No stored settings found, using defaults')
        return DEFAULT_SETTINGS
      }

      const parsed = JSON.parse(stored)
      const validated = SettingsValidator.validateSettings(parsed)

      // Build result with defaults for any missing/invalid settings
      const result = {
        selectedKey: validated.selectedKey || DEFAULT_SETTINGS.selectedKey,
        displayMode: validated.displayMode || DEFAULT_SETTINGS.displayMode,
      }

      // Log detailed validation results
      const hasInvalidKey = parsed.selectedKey && !validated.selectedKey
      const hasInvalidMode = parsed.displayMode && !validated.displayMode

      if (hasInvalidKey || hasInvalidMode) {
        logger.warn('Some settings were invalid and replaced with defaults', {
          original: parsed,
          validated: result,
          issues: {
            invalidKey: hasInvalidKey,
            invalidMode: hasInvalidMode
          }
        })
      } else {
        logger.debug('Settings loaded and validated successfully', {
          settings: result,
          version: validated.version,
          age: validated.timestamp ? Date.now() - validated.timestamp : 'unknown'
        })
      }

      return result
    } catch (error) {
      if (error instanceof SyntaxError) {
        logger.error('localStorage data is corrupted (JSON parse error), clearing and using defaults', {
          error: error.message,
          fallback: 'using default settings'
        })
      } else if (error instanceof Error) {
        logger.error('Failed to load settings from localStorage, using defaults', {
          error: error.message,
          fallback: 'using default settings'
        })
      } else {
        logger.error('Unknown error loading settings from localStorage, using defaults', {
          error: String(error),
          fallback: 'using default settings'
        })
      }

      // Clear corrupted data and continue with defaults
      this.clearSettings()
      return DEFAULT_SETTINGS
    }
  }

  /**
   * Clears settings from localStorage with error handling
   */
  clearSettings(): boolean {
    if (!this.isAvailable) {
      logger.debug('localStorage unavailable, cannot clear settings')
      return false
    }

    try {
      localStorage.removeItem(STORAGE_KEY)
      logger.debug('Settings cleared from localStorage')
      return true
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Failed to clear settings from localStorage', {
          error: error.message,
          impact: 'corrupted data may persist'
        })
      } else {
        logger.error('Unknown error clearing settings from localStorage', {
          error: String(error),
          impact: 'corrupted data may persist'
        })
      }
      return false
    }
  }

  /**
   * Checks if localStorage is available
   */
  isStorageAvailable(): boolean {
    return this.isAvailable
  }

  /**
   * Re-checks localStorage availability (useful for testing or recovery scenarios)
   */
  recheckAvailability(): boolean {
    this.isAvailable = isLocalStorageAvailable()
    if (this.isAvailable) {
      logger.debug('localStorage availability restored')
    } else {
      logger.warn('localStorage still unavailable after recheck')
    }
    return this.isAvailable
  }
}

// Export a singleton instance
export const validatedStorage = new ValidatedStorage()