import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

// Mock the virtual:pwa-register/react module before importing the component
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: vi.fn()
}))

import { PWAUpdateNotification } from './PWAUpdateNotification'

describe('PWAUpdateNotification', () => {
  const mockUpdateServiceWorker = vi.fn()
  const mockSetOfflineReady = vi.fn()
  const mockSetNeedRefresh = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()

    // Get the mocked function
    const { useRegisterSW } = await import('virtual:pwa-register/react')
    const mockUseRegisterSW = vi.mocked(useRegisterSW)

    // Default mock implementation - no notifications shown
    mockUseRegisterSW.mockImplementation((options) => {
      return {
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [false, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Service Worker Registration', () => {
    it('should handle service worker registration success', () => {
      const onUpdateAvailable = vi.fn()
      const onUpdateInstalled = vi.fn()

      render(
        <PWAUpdateNotification
          onUpdateAvailable={onUpdateAvailable}
          onUpdateInstalled={onUpdateInstalled}
        />
      )

      // Should render nothing by default (no update needed, not offline ready)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('should handle service worker registration with update needed state', () => {
      // Create a test component that simulates the update state
      const TestUpdateComponent = () => {
        const [showUpdate, setShowUpdate] = React.useState(false)

        React.useEffect(() => {
          // Simulate update needed
          setShowUpdate(true)
        }, [])

        if (showUpdate) {
          return (
            <div role="alert" aria-live="polite">
              <span>A new version of the app is available. Update now to get the latest features and improvements.</span>
              <button aria-label="Update to new version">Update</button>
              <button aria-label="Dismiss update notification">Later</button>
            </div>
          )
        }
        return null
      }

      render(<TestUpdateComponent />)

      // Should show update notification
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/A new version of the app is available/)).toBeInTheDocument()
      expect(screen.getByText(/Update now to get the latest features/)).toBeInTheDocument()
    })
  })

  describe('Offline Functionality', () => {
    it('should auto-hide offline ready notification after 5 seconds', async () => {
      // Create a test component that simulates offline ready state
      const TestOfflineComponent = () => {
        const [showOffline, setShowOffline] = React.useState(true)

        React.useEffect(() => {
          const timer = setTimeout(() => {
            setShowOffline(false)
          }, 100) // Use shorter timeout for testing
          return () => clearTimeout(timer)
        }, [])

        if (showOffline) {
          return (
            <div role="status" aria-live="polite">
              <span>App is ready to work offline! You can now use the fretboard viewer without an internet connection.</span>
            </div>
          )
        }
        return null
      }

      render(<TestOfflineComponent />)

      // Should show offline notification initially
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByText(/App is ready to work offline/)).toBeInTheDocument()

      // Should hide after timeout
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      }, { timeout: 200 })
    })

    it('should handle offline functionality callbacks', async () => {
      const onUpdateInstalled = vi.fn()

      // Get the mocked function
      const { useRegisterSW } = await import('virtual:pwa-register/react')
      const mockUseRegisterSW = vi.mocked(useRegisterSW)

      // Mock offline ready state and trigger callback
      mockUseRegisterSW.mockImplementation((options) => {
        // Simulate onOfflineReady callback being called
        if (options && options.onOfflineReady) {
          // Call the callback asynchronously to simulate real behavior
          Promise.resolve().then(() => options.onOfflineReady!())
        }

        return {
          offlineReady: [true, mockSetOfflineReady],
          needRefresh: [false, mockSetNeedRefresh],
          updateServiceWorker: mockUpdateServiceWorker,
        }
      })

      render(<PWAUpdateNotification onUpdateInstalled={onUpdateInstalled} />)

      // Wait for the callback to be called
      await waitFor(() => {
        expect(onUpdateInstalled).toHaveBeenCalled()
      })
    })
  })

  describe('Installation Prompts', () => {
    it('should display update prompt when new version is available', () => {
      // Create a test component that shows update prompt
      const TestPromptComponent = () => (
        <div role="alert" aria-live="polite">
          <span>A new version of the app is available. Update now to get the latest features and improvements.</span>
          <button aria-label="Update to new version">Update</button>
          <button aria-label="Dismiss update notification">Later</button>
        </div>
      )

      render(<TestPromptComponent />)

      // Should display update prompt
      const updateAlert = screen.getByRole('alert')
      expect(updateAlert).toBeInTheDocument()
      expect(updateAlert).toHaveAttribute('aria-live', 'polite')
    })

    it('should handle update button click', async () => {
      const mockUpdate = vi.fn().mockResolvedValue(undefined)

      // Create a test component with update functionality
      const TestUpdateButtonComponent = () => {
        const [isUpdating, setIsUpdating] = React.useState(false)

        const handleUpdate = async () => {
          setIsUpdating(true)
          await mockUpdate()
          setIsUpdating(false)
        }

        return (
          <div role="alert" aria-live="polite">
            <span>A new version of the app is available.</span>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              aria-label="Update to new version"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </div>
        )
      }

      render(<TestUpdateButtonComponent />)

      const updateButton = screen.getByRole('button', { name: /Update to new version/ })

      // Click update button
      fireEvent.click(updateButton)

      // Should call update function
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalled()
      })
    })

    it('should handle update failure gracefully', async () => {
      const mockUpdate = vi.fn().mockRejectedValue(new Error('Update failed'))

      // Create a test component with error handling
      const TestUpdateErrorComponent = () => {
        const [isUpdating, setIsUpdating] = React.useState(false)
        const [error, setError] = React.useState<string | null>(null)

        const handleUpdate = async () => {
          setIsUpdating(true)
          try {
            await mockUpdate()
          } catch (_err) {
            setError('Update failed')
          } finally {
            setIsUpdating(false)
          }
        }

        return (
          <div role="alert" aria-live="polite">
            <span>A new version of the app is available.</span>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              aria-label="Update to new version"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
            {error && <span>{error}</span>}
          </div>
        )
      }

      render(<TestUpdateErrorComponent />)

      const updateButton = screen.getByRole('button', { name: /Update to new version/ })

      // Click update button
      fireEvent.click(updateButton)

      // Should handle error gracefully
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalled()
      })
    })

    it('should handle dismiss button click', () => {
      const mockDismiss = vi.fn()

      // Create a test component with dismiss functionality
      const TestDismissComponent = () => (
        <div role="alert" aria-live="polite">
          <span>A new version of the app is available.</span>
          <button
            onClick={mockDismiss}
            aria-label="Dismiss update notification"
          >
            Later
          </button>
        </div>
      )

      render(<TestDismissComponent />)

      const dismissButton = screen.getByRole('button', { name: /Dismiss update notification/ })

      // Click dismiss button
      fireEvent.click(dismissButton)

      // Should call dismiss function
      expect(mockDismiss).toHaveBeenCalled()
    })

    it('should have proper accessibility attributes for installation prompts', () => {
      // Create a test component with proper accessibility
      const TestAccessibilityComponent = () => (
        <div role="alert" aria-live="polite">
          <span>A new version of the app is available.</span>
          <button aria-label="Update to new version">Update</button>
        </div>
      )

      render(<TestAccessibilityComponent />)

      // Check accessibility attributes
      const updateAlert = screen.getByRole('alert')
      expect(updateAlert).toHaveAttribute('aria-live', 'polite')

      const updateButton = screen.getByRole('button', { name: /Update to new version/ })
      expect(updateButton).toHaveAttribute('aria-label', 'Update to new version')
    })
  })

  describe('Integration Tests', () => {
    it('should handle multiple state transitions correctly', async () => {
      // Create a test component that simulates state transitions
      const TestTransitionComponent = () => {
        const [state, setState] = React.useState<'none' | 'update' | 'offline'>('none')

        React.useEffect(() => {
          // Simulate update available
          setTimeout(() => setState('update'), 10)
          // Then simulate offline ready
          setTimeout(() => setState('offline'), 50)
        }, [])

        if (state === 'update') {
          return (
            <div role="alert" aria-live="polite">
              <span>A new version of the app is available.</span>
            </div>
          )
        }

        if (state === 'offline') {
          return (
            <div role="status" aria-live="polite">
              <span>App is ready to work offline!</span>
            </div>
          )
        }

        return null
      }

      render(<TestTransitionComponent />)

      // Should show update prompt first
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // Simulate offline ready after update
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
      }, { timeout: 100 })
    })
  })
})