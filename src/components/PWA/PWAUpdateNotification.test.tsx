import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock the virtual:pwa-register/react module before importing the component
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: vi.fn()
}))

import { PWAUpdateNotification } from './PWAUpdateNotification'

describe('PWAUpdateNotification', () => {
  const mockUpdateServiceWorker = vi.fn()
  const mockSetOfflineReady = vi.fn()
  const mockSetNeedRefresh = vi.fn()

  // Get the mocked useRegisterSW function
  const mockUseRegisterSW = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()

    // Mock the useRegisterSW hook
    const { useRegisterSW } = await import('virtual:pwa-register/react')
    vi.mocked(useRegisterSW).mockImplementation(() => ({
      offlineReady: [false, mockSetOfflineReady],
      needRefresh: [false, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Service Worker Registration', () => {
    it('should handle service worker registration success', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      // Mock successful registration
      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [false, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      const onUpdateAvailable = vi.fn()
      const onUpdateInstalled = vi.fn()

      render(
        <PWAUpdateNotification
          onUpdateAvailable={onUpdateAvailable}
          onUpdateInstalled={onUpdateInstalled}
        />
      )

      // Should render without errors when service worker is registered
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('should handle service worker registration with offline ready state', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      // Mock offline ready state
      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [true, mockSetOfflineReady],
        needRefresh: [false, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      const onUpdateInstalled = vi.fn()

      render(
        <PWAUpdateNotification
          onUpdateInstalled={onUpdateInstalled}
        />
      )

      // Should show offline ready notification
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByText(/App is ready to work offline/)).toBeInTheDocument()
      expect(screen.getByText(/fretboard viewer without an internet connection/)).toBeInTheDocument()
    })

    it('should handle service worker registration with update needed state', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      // Mock update needed state
      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [true, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      const onUpdateAvailable = vi.fn()

      render(
        <PWAUpdateNotification
          onUpdateAvailable={onUpdateAvailable}
        />
      )

      // Should show update notification
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/A new version of the app is available/)).toBeInTheDocument()
      expect(screen.getByText(/Update now to get the latest features/)).toBeInTheDocument()
    })
  })

  describe('Offline Functionality', () => {
    it('should display offline ready notification when app is cached', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [true, mockSetOfflineReady],
        needRefresh: [false, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      render(<PWAUpdateNotification />)

      // Verify offline notification is displayed
      const offlineNotification = screen.getByRole('status')
      expect(offlineNotification).toBeInTheDocument()
      expect(offlineNotification).toHaveAttribute('aria-live', 'polite')

      // Verify offline message content
      expect(screen.getByText(/App is ready to work offline/)).toBeInTheDocument()
      expect(screen.getByText(/fretboard viewer without an internet connection/)).toBeInTheDocument()
    })

    it('should auto-hide offline ready notification after 5 seconds', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [true, mockSetOfflineReady],
        needRefresh: [false, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      // Mock timers
      vi.useFakeTimers()

      render(<PWAUpdateNotification />)

      // Notification should be visible initially
      expect(screen.getByRole('status')).toBeInTheDocument()

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000)

      // Should call setOfflineReady(false) to hide notification
      await waitFor(() => {
        expect(mockSetOfflineReady).toHaveBeenCalledWith(false)
      })

      vi.useRealTimers()
    })

    it('should handle offline functionality callbacks', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')
      const onUpdateInstalled = vi.fn()

      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [true, mockSetOfflineReady],
        needRefresh: [false, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      render(
        <PWAUpdateNotification
          onUpdateInstalled={onUpdateInstalled}
        />
      )

      // onUpdateInstalled should be called when offline ready
      expect(onUpdateInstalled).toHaveBeenCalled()
    })
  })

  describe('Installation Prompts', () => {
    it('should display update prompt when new version is available', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [true, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      const onUpdateAvailable = vi.fn()

      render(
        <PWAUpdateNotification
          onUpdateAvailable={onUpdateAvailable}
        />
      )

      // Should display update prompt
      const updateAlert = screen.getByRole('alert')
      expect(updateAlert).toBeInTheDocument()
      expect(updateAlert).toHaveAttribute('aria-live', 'polite')

      // Should have update and dismiss buttons
      expect(screen.getByRole('button', { name: /Update to new version/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Dismiss update notification/ })).toBeInTheDocument()

      // Should call onUpdateAvailable callback
      expect(onUpdateAvailable).toHaveBeenCalled()
    })

    it('should handle update button click', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [true, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      mockUpdateServiceWorker.mockResolvedValue(undefined)

      render(<PWAUpdateNotification />)

      const updateButton = screen.getByRole('button', { name: /Update to new version/ })

      // Click update button
      fireEvent.click(updateButton)

      // Should show updating state
      expect(screen.getByText('Updating...')).toBeInTheDocument()
      expect(updateButton).toBeDisabled()

      // Should call updateServiceWorker
      expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true)

      // Wait for update to complete
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })

    it('should handle update failure gracefully', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [true, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      const updateError = new Error('Update failed')
      mockUpdateServiceWorker.mockRejectedValue(updateError)

      // Mock console.error to avoid test output noise
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<PWAUpdateNotification />)

      const updateButton = screen.getByRole('button', { name: /Update to new version/ })

      // Click update button
      fireEvent.click(updateButton)

      // Wait for error handling
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to update service worker:', updateError)
      })

      // Button should be re-enabled after error
      await waitFor(() => {
        expect(updateButton).not.toBeDisabled()
      })

      consoleSpy.mockRestore()
    })

    it('should handle dismiss button click', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [true, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      render(<PWAUpdateNotification />)

      const dismissButton = screen.getByRole('button', { name: /Dismiss update notification/ })

      // Click dismiss button
      fireEvent.click(dismissButton)

      // Should hide the notification
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()

      // Should call setNeedRefresh(false)
      expect(mockSetNeedRefresh).toHaveBeenCalledWith(false)
    })

    it('should have proper accessibility attributes for installation prompts', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [true, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      render(<PWAUpdateNotification />)

      // Check accessibility attributes
      const updateAlert = screen.getByRole('alert')
      expect(updateAlert).toHaveAttribute('aria-live', 'polite')

      const updateButton = screen.getByRole('button', { name: /Update to new version/ })
      expect(updateButton).toHaveAttribute('aria-label', 'Update to new version')

      const dismissButton = screen.getByRole('button', { name: /Dismiss update notification/ })
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss update notification')
    })

    it('should not display any prompts when no updates are available', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [false, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      render(<PWAUpdateNotification />)

      // Should not display any notifications
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('Integration Tests', () => {
    it('should handle multiple state transitions correctly', async () => {
      const { useRegisterSW } = await import('virtual:pwa-register/react')

      // Start with no updates
      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [false, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })

      const { rerender } = render(<PWAUpdateNotification />)

      // Initially no notifications
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()

      // Simulate update available
      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [false, mockSetOfflineReady],
        needRefresh: [true, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })
      rerender(<PWAUpdateNotification />)

      // Should show update prompt
      expect(screen.getByRole('alert')).toBeInTheDocument()

      // Simulate offline ready after update
      vi.mocked(useRegisterSW).mockReturnValue({
        offlineReady: [true, mockSetOfflineReady],
        needRefresh: [false, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
      })
      rerender(<PWAUpdateNotification />)

      // Should show offline ready notification
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })
})