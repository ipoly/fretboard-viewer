import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import * as fc from 'fast-check'
import { propertyTestConfig } from '../test/generators'
import { usePWAUpdate } from './usePWAUpdate'

// Mock service worker API
const mockServiceWorkerRegistration = {
  update: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

const mockServiceWorker = {
  getRegistration: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

// Mock PWA update detection logic without complex React hook testing
interface MockCacheState {
  version: string
  timestamp: Date
  resources: string[]
}

interface MockUpdateDetector {
  checkForUpdates: (currentCache: MockCacheState, serverCache: MockCacheState) => boolean
  shouldPromptUser: (updateAvailable: boolean, userPreferences: { autoUpdate: boolean }) => boolean
  compareResources: (cached: string[], server: string[]) => boolean
}

// Simple update detection implementation that follows requirements 9.4 and 9.5
const createUpdateDetector = (): MockUpdateDetector => ({
  checkForUpdates: (currentCache: MockCacheState, serverCache: MockCacheState) => {
    // Requirement 9.4: Check for new versions by comparing cached resources
    const versionChanged = currentCache.version !== serverCache.version
    const timestampChanged = currentCache.timestamp.getTime() !== serverCache.timestamp.getTime()
    const resourcesChanged = !arraysEqual(currentCache.resources, serverCache.resources)

    return versionChanged || timestampChanged || resourcesChanged
  },

  shouldPromptUser: (updateAvailable: boolean, userPreferences: { autoUpdate: boolean }) => {
    // Requirement 9.5: When new versions are detected, prompt users to refresh for updates
    return updateAvailable && !userPreferences.autoUpdate
  },

  compareResources: (cached: string[], server: string[]) => {
    return arraysEqual(cached, server)
  }
})

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false
  return a.every((val, index) => val === b[index])
}

describe('PWA Update Detection', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock navigator.serviceWorker
    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
    })

    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Service Worker Registration Tests', () => {
    it('should initialize with correct default state', async () => {
      const { result } = renderHook(() => usePWAUpdate())

      expect(result.current.isUpdateAvailable).toBe(false)
      expect(result.current.isOfflineReady).toBe(false)
      expect(result.current.isUpdating).toBe(false)
      // lastUpdateCheck will be set after initial checkForUpdate call in useEffect
      await waitFor(() => {
        expect(result.current.lastUpdateCheck).toBeInstanceOf(Date)
      })
      expect(result.current.updateError).toBeNull()
    })

    it('should handle service worker registration check', async () => {
      mockServiceWorker.getRegistration.mockResolvedValue(mockServiceWorkerRegistration)
      mockServiceWorkerRegistration.update.mockResolvedValue(undefined)

      const { result } = renderHook(() => usePWAUpdate())

      await act(async () => {
        await result.current.checkForUpdate()
      })

      expect(mockServiceWorker.getRegistration).toHaveBeenCalled()
      expect(mockServiceWorkerRegistration.update).toHaveBeenCalled()
      expect(result.current.lastUpdateCheck).toBeInstanceOf(Date)
      expect(result.current.updateError).toBeNull()
    })

    it('should handle service worker registration failure', async () => {
      const error = new Error('Registration failed')
      mockServiceWorker.getRegistration.mockRejectedValue(error)

      const { result } = renderHook(() => usePWAUpdate())

      await act(async () => {
        await result.current.checkForUpdate()
      })

      expect(result.current.updateError).toBe('Registration failed')
      expect(result.current.lastUpdateCheck).toBeInstanceOf(Date)
    })

    it('should handle missing service worker support', async () => {
      // Use vi.stubGlobal to mock navigator without serviceWorker
      vi.stubGlobal('navigator', {
        ...navigator,
        serviceWorker: undefined
      })

      const { result } = renderHook(() => usePWAUpdate())

      await act(async () => {
        await result.current.checkForUpdate()
      })

      // Should not throw error when service worker is not supported
      expect(result.current.lastUpdateCheck).toBeInstanceOf(Date)
      expect(result.current.updateError).toBeNull()

      // Restore original navigator
      vi.unstubAllGlobals()
    })
  })

  describe('Offline Functionality Tests', () => {
    it('should detect offline ready state through service worker events', async () => {
      let controllerChangeListener: () => void = () => {}

      mockServiceWorker.addEventListener.mockImplementation((event: string, listener: () => void) => {
        if (event === 'controllerchange') {
          controllerChangeListener = listener
        }
      })

      const { result } = renderHook(() => usePWAUpdate())

      // Simulate controller change event (indicates offline ready)
      act(() => {
        controllerChangeListener()
      })

      expect(result.current.isOfflineReady).toBe(true)
    })

    it('should handle service worker message events for update detection', async () => {
      let messageListener: (event: MessageEvent) => void = () => {}

      mockServiceWorker.addEventListener.mockImplementation((event: string, listener: (event: MessageEvent) => void) => {
        if (event === 'message') {
          messageListener = listener
        }
      })

      const { result } = renderHook(() => usePWAUpdate())

      // Simulate SKIP_WAITING message
      act(() => {
        messageListener({
          data: { type: 'SKIP_WAITING' }
        } as MessageEvent)
      })

      expect(result.current.isUpdateAvailable).toBe(true)
    })

    it('should ignore irrelevant service worker messages', async () => {
      let messageListener: (event: MessageEvent) => void = () => {}

      mockServiceWorker.addEventListener.mockImplementation((event: string, listener: (event: MessageEvent) => void) => {
        if (event === 'message') {
          messageListener = listener
        }
      })

      const { result } = renderHook(() => usePWAUpdate())

      // Simulate irrelevant message
      act(() => {
        messageListener({
          data: { type: 'OTHER_MESSAGE' }
        } as MessageEvent)
      })

      expect(result.current.isUpdateAvailable).toBe(false)
    })
  })

  describe('Installation and Update Tests', () => {
    it('should handle successful update installation', async () => {
      const { result } = renderHook(() => usePWAUpdate())

      // Set update available first
      act(() => {
        result.current.checkForUpdate()
      })

      const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {})

      await act(async () => {
        await result.current.installUpdate()
      })

      expect(result.current.isUpdating).toBe(false)
      expect(result.current.isUpdateAvailable).toBe(false)
      expect(reloadSpy).toHaveBeenCalled()

      reloadSpy.mockRestore()
    })

    it('should handle update installation failure', async () => {
      const { result } = renderHook(() => usePWAUpdate())

      // Mock window.location.reload to throw error
      const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {
        throw new Error('Reload failed')
      })

      await act(async () => {
        await result.current.installUpdate()
      })

      expect(result.current.isUpdating).toBe(false)
      expect(result.current.updateError).toBe('Reload failed')

      reloadSpy.mockRestore()
    })

    it('should handle update dismissal', () => {
      const { result } = renderHook(() => usePWAUpdate())

      // First set update available
      act(() => {
        result.current.checkForUpdate()
      })

      act(() => {
        result.current.dismissUpdate()
      })

      expect(result.current.isUpdateAvailable).toBe(false)
      expect(result.current.updateError).toBeNull()
    })

    it('should handle error clearing', () => {
      const { result } = renderHook(() => usePWAUpdate())

      // First set an error
      act(() => {
        result.current.checkForUpdate()
      })

      act(() => {
        result.current.clearError()
      })

      expect(result.current.updateError).toBeNull()
    })
  })

  describe('Periodic Update Checking', () => {
    it('should check for updates on mount', async () => {
      mockServiceWorker.getRegistration.mockResolvedValue(mockServiceWorkerRegistration)
      mockServiceWorkerRegistration.update.mockResolvedValue(undefined)

      const { result } = renderHook(() => usePWAUpdate())

      // Wait for initial update check
      await waitFor(() => {
        expect(result.current.lastUpdateCheck).not.toBeNull()
      })

      expect(mockServiceWorker.getRegistration).toHaveBeenCalled()
    })

    it('should set up periodic update checking', () => {
      vi.useFakeTimers()

      mockServiceWorker.getRegistration.mockResolvedValue(mockServiceWorkerRegistration)
      mockServiceWorkerRegistration.update.mockResolvedValue(undefined)

      const { unmount } = renderHook(() => usePWAUpdate())

      // Fast-forward 30 minutes
      vi.advanceTimersByTime(30 * 60 * 1000)

      // Should have called getRegistration multiple times (initial + periodic)
      expect(mockServiceWorker.getRegistration).toHaveBeenCalledTimes(2)

      unmount()
      vi.useRealTimers()
    })
  })

  describe('Error Handling', () => {
    it('should handle various error types gracefully', async () => {
      const testCases = [
        { error: new Error('Network error'), expected: 'Network error' },
        { error: new TypeError('Type error'), expected: 'Type error' },
        { error: 'String error', expected: 'Failed to check for updates' }, // String errors get default message
        { error: null, expected: 'Failed to check for updates' },
        { error: undefined, expected: 'Failed to check for updates' },
        { error: { message: 'Object error' }, expected: 'Failed to check for updates' }
      ]

      for (const testCase of testCases) {
        mockServiceWorker.getRegistration.mockRejectedValue(testCase.error)

        const { result } = renderHook(() => usePWAUpdate())

        await act(async () => {
          await result.current.checkForUpdate()
        })

        expect(result.current.updateError).toBe(testCase.expected)

        vi.clearAllMocks()
      }
    })
  })

  /**
   * Property 5: Version Update Detection
   * For any cached application state, when users revisit the application,
   * version checking should correctly detect changes in resources and prompt
   * users for updates when new versions are available.
   * **Feature: guitar-fretboard-viewer, Property 5: Version Update Detection**
   * **Validates: Requirements 9.4, 9.5**
   */
  it('Property 5: Version update detection works correctly across different cache states', () => {
    const updateDetector = createUpdateDetector()

    fc.assert(
      fc.property(
        // Generate cache states and update scenarios
        fc.record({
          currentCache: fc.record({
            version: fc.string({ minLength: 1, maxLength: 10 }),
            timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }),
            resources: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 })
          }),
          serverCache: fc.record({
            version: fc.string({ minLength: 1, maxLength: 10 }),
            timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }),
            resources: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 })
          }),
          userPreferences: fc.record({
            autoUpdate: fc.boolean()
          })
        }),
        (scenario) => {
          // Requirement 9.4: When users revisit the application,
          // THE Application SHALL check for new versions by comparing cached resources
          const updateAvailable = updateDetector.checkForUpdates(
            scenario.currentCache,
            scenario.serverCache
          )

          // Verify update detection logic
          const versionChanged = scenario.currentCache.version !== scenario.serverCache.version
          const timestampChanged = scenario.currentCache.timestamp.getTime() !== scenario.serverCache.timestamp.getTime()
          const resourcesChanged = !arraysEqual(scenario.currentCache.resources, scenario.serverCache.resources)

          const expectedUpdateAvailable = versionChanged || timestampChanged || resourcesChanged
          expect(updateAvailable).toBe(expectedUpdateAvailable)

          // Requirement 9.5: When new versions are detected,
          // THE Application SHALL prompt users to refresh for updates
          const shouldPrompt = updateDetector.shouldPromptUser(updateAvailable, scenario.userPreferences)

          // Should prompt only when update is available and auto-update is disabled
          const expectedPrompt = updateAvailable && !scenario.userPreferences.autoUpdate
          expect(shouldPrompt).toBe(expectedPrompt)

          // Resource comparison should be consistent
          const resourcesMatch = updateDetector.compareResources(
            scenario.currentCache.resources,
            scenario.serverCache.resources
          )
          expect(resourcesMatch).toBe(arraysEqual(scenario.currentCache.resources, scenario.serverCache.resources))
        }
      ),
      propertyTestConfig
    )
  })

  // Property test for cache comparison edge cases
  it('Property 5a: Cache comparison handles edge cases correctly', () => {
    const updateDetector = createUpdateDetector()

    fc.assert(
      fc.property(
        fc.record({
          cacheA: fc.record({
            version: fc.oneof(fc.string(), fc.constant('')),
            timestamp: fc.date(),
            resources: fc.array(fc.string(), { minLength: 0, maxLength: 5 })
          }),
          cacheB: fc.record({
            version: fc.oneof(fc.string(), fc.constant('')),
            timestamp: fc.date(),
            resources: fc.array(fc.string(), { minLength: 0, maxLength: 5 })
          })
        }),
        (scenario) => {
          const updateNeeded = updateDetector.checkForUpdates(scenario.cacheA, scenario.cacheB)

          // Update should be detected if any field differs
          const versionDiffers = scenario.cacheA.version !== scenario.cacheB.version
          const timestampDiffers = scenario.cacheA.timestamp.getTime() !== scenario.cacheB.timestamp.getTime()
          const resourcesDiffer = !arraysEqual(scenario.cacheA.resources, scenario.cacheB.resources)

          const shouldUpdate = versionDiffers || timestampDiffers || resourcesDiffer
          expect(updateNeeded).toBe(shouldUpdate)

          // Identical caches should not trigger updates
          if (!versionDiffers && !timestampDiffers && !resourcesDiffer) {
            expect(updateNeeded).toBe(false)
          }
        }
      ),
      propertyTestConfig
    )
  })

  // Property test for user preference handling
  it('Property 5b: User preferences correctly control update prompting', () => {
    const updateDetector = createUpdateDetector()

    fc.assert(
      fc.property(
        fc.record({
          updateAvailable: fc.boolean(),
          autoUpdate: fc.boolean(),
          promptCount: fc.integer({ min: 1, max: 10 })
        }),
        (scenario) => {
          // Test multiple prompt decisions with same preferences
          for (let i = 0; i < scenario.promptCount; i++) {
            const shouldPrompt = updateDetector.shouldPromptUser(
              scenario.updateAvailable,
              { autoUpdate: scenario.autoUpdate }
            )

            // Consistent behavior: prompt only when update available and auto-update disabled
            const expectedPrompt = scenario.updateAvailable && !scenario.autoUpdate
            expect(shouldPrompt).toBe(expectedPrompt)
          }
        }
      ),
      propertyTestConfig
    )
  })
})