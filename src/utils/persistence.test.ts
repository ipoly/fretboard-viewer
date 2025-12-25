import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  SettingsValidator,
  ValidatedStorage,
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  isLocalStorageAvailable
} from './persistence'
import { MusicalKey, DisplayMode } from '../types'

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

describe('SettingsValidator', () => {
  describe('validateMusicalKey', () => {
    it('should validate correct musical keys', () => {
      expect(SettingsValidator.validateMusicalKey('C')).toBe(true)
      expect(SettingsValidator.validateMusicalKey('F#')).toBe(true)
      expect(SettingsValidator.validateMusicalKey('B')).toBe(true)
    })

    it('should reject invalid musical keys', () => {
      expect(SettingsValidator.validateMusicalKey('H')).toBe(false)
      expect(SettingsValidator.validateMusicalKey('C##')).toBe(false)
      expect(SettingsValidator.validateMusicalKey(123)).toBe(false)
      expect(SettingsValidator.validateMusicalKey(null)).toBe(false)
    })
  })

  describe('validateDisplayMode', () => {
    it('should validate correct display modes', () => {
      expect(SettingsValidator.validateDisplayMode('notes')).toBe(true)
      expect(SettingsValidator.validateDisplayMode('degrees')).toBe(true)
    })

    it('should reject invalid display modes', () => {
      expect(SettingsValidator.validateDisplayMode('invalid')).toBe(false)
      expect(SettingsValidator.validateDisplayMode(123)).toBe(false)
      expect(SettingsValidator.validateDisplayMode(null)).toBe(false)
    })
  })

  describe('validateSettings', () => {
    it('should validate and return valid settings', () => {
      const validSettings = {
        selectedKey: 'G' as MusicalKey,
        displayMode: 'degrees' as DisplayMode,
        version: 1,
        timestamp: 1234567890,
      }

      const result = SettingsValidator.validateSettings(validSettings)
      expect(result).toEqual(validSettings)
    })

    it('should filter out invalid settings', () => {
      const mixedSettings = {
        selectedKey: 'G' as MusicalKey,
        displayMode: 'invalid',
        version: 'not-a-number',
        timestamp: 1234567890,
      }

      const result = SettingsValidator.validateSettings(mixedSettings)
      expect(result).toEqual({
        selectedKey: 'G',
        timestamp: 1234567890,
      })
    })

    it('should handle null and non-object inputs', () => {
      expect(SettingsValidator.validateSettings(null)).toEqual({})
      expect(SettingsValidator.validateSettings('string')).toEqual({})
      expect(SettingsValidator.validateSettings(123)).toEqual({})
    })
  })
})

describe('isLocalStorageAvailable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true when localStorage is available', () => {
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})

    expect(isLocalStorageAvailable()).toBe(true)
  })

  it('should return false when localStorage throws an error', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage not available')
    })

    expect(isLocalStorageAvailable()).toBe(false)
  })
})

describe('ValidatedStorage', () => {
  let storage: ValidatedStorage

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.getItem.mockImplementation(() => null)
    localStorageMock.removeItem.mockImplementation(() => {})
    storage = new ValidatedStorage()
  })

  describe('saveSettings', () => {
    it('should save valid settings to localStorage', () => {
      const settings = {
        selectedKey: 'G' as MusicalKey,
        displayMode: 'degrees' as DisplayMode,
      }

      const result = storage.saveSettings(settings)
      expect(result).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.stringContaining('"selectedKey":"G"')
      )
    })

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const result = storage.saveSettings(DEFAULT_SETTINGS)
      expect(result).toBe(false)
    })

    it('should handle quota exceeded errors', () => {
      const quotaError = new Error('Quota exceeded')
      quotaError.name = 'QuotaExceededError'
      localStorageMock.setItem.mockImplementation(() => {
        throw quotaError
      })

      const result = storage.saveSettings(DEFAULT_SETTINGS)
      expect(result).toBe(false)
    })
  })

  describe('loadSettings', () => {
    it('should load and validate settings from localStorage', () => {
      const storedSettings = {
        selectedKey: 'F#',
        displayMode: 'degrees',
        version: 1,
        timestamp: 1234567890,
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedSettings))

      const result = storage.loadSettings()
      expect(result.selectedKey).toBe('F#')
      expect(result.displayMode).toBe('degrees')
    })

    it('should return defaults when no settings are stored', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = storage.loadSettings()
      expect(result).toEqual(DEFAULT_SETTINGS)
    })

    it('should handle corrupted JSON gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      const result = storage.loadSettings()
      expect(result).toEqual(DEFAULT_SETTINGS)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
    })

    it('should use defaults for invalid settings', () => {
      const invalidSettings = {
        selectedKey: 'INVALID',
        displayMode: 'invalid',
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidSettings))

      const result = storage.loadSettings()
      expect(result).toEqual(DEFAULT_SETTINGS)
    })
  })

  describe('clearSettings', () => {
    it('should clear settings from localStorage', () => {
      const result = storage.clearSettings()
      expect(result).toBe(true)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
    })

    it('should handle errors when clearing', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Clear error')
      })

      const result = storage.clearSettings()
      expect(result).toBe(false)
    })
  })
})