/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

const notificationStyles = css`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 90vw;
  font-size: 14px;
  line-height: 1.4;

  @media (max-width: 768px) {
    bottom: 16px;
    left: 16px;
    right: 16px;
    transform: none;
    max-width: none;
  }
`

const buttonStyles = css`
  background: white;
  color: #2563eb;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f1f5f9;
  }

  &:active {
    background: #e2e8f0;
  }
`

const dismissButtonStyles = css`
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

interface PWAUpdateNotificationProps {
  onUpdateAvailable?: () => void
  onUpdateInstalled?: () => void
}

export function PWAUpdateNotification({
  onUpdateAvailable,
  onUpdateInstalled
}: PWAUpdateNotificationProps) {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered: ' + registration)
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error)
    },
    onNeedRefresh() {
      console.log('SW needs refresh')
      setShowUpdatePrompt(true)
      onUpdateAvailable?.()
    },
    onOfflineReady() {
      console.log('SW offline ready')
      onUpdateInstalled?.()
    },
  })

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateServiceWorker(true)
      setShowUpdatePrompt(false)
      setIsUpdating(false)
    } catch (error) {
      console.error('Failed to update service worker:', error)
      setIsUpdating(false)
    }
  }

  const handleDismiss = () => {
    setShowUpdatePrompt(false)
    setNeedRefresh(false)
  }

  // Auto-hide offline ready notification after 5 seconds
  useEffect(() => {
    if (offlineReady) {
      const timer = setTimeout(() => {
        setOfflineReady(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [offlineReady, setOfflineReady])

  if (showUpdatePrompt && needRefresh) {
    return (
      <div css={notificationStyles} role="alert" aria-live="polite">
        <span>
          A new version of the app is available. Update now to get the latest features and improvements.
        </span>
        <div>
          <button
            css={buttonStyles}
            onClick={handleUpdate}
            disabled={isUpdating}
            aria-label="Update to new version"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
          <button
            css={dismissButtonStyles}
            onClick={handleDismiss}
            aria-label="Dismiss update notification"
          >
            Later
          </button>
        </div>
      </div>
    )
  }

  if (offlineReady) {
    return (
      <div css={notificationStyles} role="status" aria-live="polite">
        <span>
          App is ready to work offline! You can now use the fretboard viewer without an internet connection.
        </span>
      </div>
    )
  }

  return null
}

export default PWAUpdateNotification