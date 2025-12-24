import { useState, useEffect, useCallback } from 'react'

interface PWAUpdateState {
  isUpdateAvailable: boolean
  isOfflineReady: boolean
  isUpdating: boolean
  lastUpdateCheck: Date | null
  updateError: string | null
}

interface PWAUpdateActions {
  checkForUpdate: () => Promise<void>
  installUpdate: () => Promise<void>
  dismissUpdate: () => void
  clearError: () => void
}

export function usePWAUpdate(): PWAUpdateState & PWAUpdateActions {
  const [state, setState] = useState<PWAUpdateState>({
    isUpdateAvailable: false,
    isOfflineReady: false,
    isUpdating: false,
    lastUpdateCheck: null,
    updateError: null,
  })

  // Check for updates periodically
  const checkForUpdate = useCallback(async () => {
    try {
      // In a real implementation, this would check the service worker
      // For now, we'll simulate the check
      setState(prev => ({
        ...prev,
        lastUpdateCheck: new Date(),
        updateError: null,
      }))

      // Simulate checking for updates
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          await registration.update()
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        updateError: error instanceof Error ? error.message : 'Failed to check for updates',
      }))
    }
  }, [])

  const installUpdate = useCallback(async () => {
    setState(prev => ({ ...prev, isUpdating: true, updateError: null }))

    try {
      // In a real implementation, this would trigger the service worker update
      // For now, we'll simulate the update process
      await new Promise(resolve => setTimeout(resolve, 1000))

      setState(prev => ({
        ...prev,
        isUpdating: false,
        isUpdateAvailable: false,
      }))

      // Reload the page to apply updates
      window.location.reload()
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUpdating: false,
        updateError: error instanceof Error ? error.message : 'Failed to install update',
      }))
    }
  }, [])

  const dismissUpdate = useCallback(() => {
    setState(prev => ({
      ...prev,
      isUpdateAvailable: false,
      updateError: null,
    }))
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, updateError: null }))
  }, [])

  // Check for updates on mount and periodically
  useEffect(() => {
    checkForUpdate()

    // Check for updates every 30 minutes
    const interval = setInterval(checkForUpdate, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [checkForUpdate])

  // Listen for service worker updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setState(prev => ({ ...prev, isOfflineReady: true }))
      })

      // Listen for waiting service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          setState(prev => ({ ...prev, isUpdateAvailable: true }))
        }
      })
    }
  }, [])

  return {
    ...state,
    checkForUpdate,
    installUpdate,
    dismissUpdate,
    clearError,
  }
}

export default usePWAUpdate