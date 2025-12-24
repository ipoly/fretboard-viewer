import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock PWA installation functionality
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

describe('PWA Installation Functionality', () => {
  let mockBeforeInstallPrompt: BeforeInstallPromptEvent
  let mockUserChoice: { outcome: 'accepted' | 'dismissed' }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock beforeinstallprompt event
    mockUserChoice = { outcome: 'accepted' }
    mockBeforeInstallPrompt = {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve(mockUserChoice),
      preventDefault: vi.fn(),
      type: 'beforeinstallprompt',
      target: window,
      currentTarget: window,
      eventPhase: 2,
      bubbles: false,
      cancelable: true,
      defaultPrevented: false,
      composed: false,
      isTrusted: true,
      timeStamp: Date.now(),
      stopPropagation: vi.fn(),
      stopImmediatePropagation: vi.fn(),
      initEvent: vi.fn(),
      AT_TARGET: 2,
      BUBBLING_PHASE: 3,
      CAPTURING_PHASE: 1,
      NONE: 0,
    } as BeforeInstallPromptEvent

    // Mock window.addEventListener
    Object.defineProperty(window, 'addEventListener', {
      value: vi.fn(),
      writable: true,
    })

    // Mock window.removeEventListener
    Object.defineProperty(window, 'removeEventListener', {
      value: vi.fn(),
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Installation Prompt Detection', () => {
    it('should detect when installation prompt is available', () => {
      let beforeInstallPromptListener: (event: BeforeInstallPromptEvent) => void = () => {}

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
        .mockImplementation((event: string, listener: any) => {
          if (event === 'beforeinstallprompt') {
            beforeInstallPromptListener = listener
          }
        })

      // Simulate PWA installation detection setup
      const installationState = {
        canInstall: false,
        isInstalled: false,
        deferredPrompt: null as BeforeInstallPromptEvent | null,
      }

      const setupInstallationDetection = () => {
        window.addEventListener('beforeinstallprompt', (event: BeforeInstallPromptEvent) => {
          event.preventDefault()
          installationState.deferredPrompt = event
          installationState.canInstall = true
        })
      }

      setupInstallationDetection()

      // Verify event listener was added
      expect(addEventListenerSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))

      // Simulate beforeinstallprompt event
      beforeInstallPromptListener(mockBeforeInstallPrompt)

      // Verify installation state is updated
      expect(installationState.canInstall).toBe(true)
      expect(installationState.deferredPrompt).toBe(mockBeforeInstallPrompt)
      expect(mockBeforeInstallPrompt.preventDefault).toHaveBeenCalled()
    })

    it('should detect when app is already installed', () => {
      // Mock window.matchMedia for display-mode: standalone
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(display-mode: standalone)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
        writable: true,
      })

      const checkIfInstalled = () => {
        return window.matchMedia('(display-mode: standalone)').matches ||
               (navigator as any).standalone === true ||
               document.referrer.includes('android-app://')
      }

      const isInstalled = checkIfInstalled()
      expect(isInstalled).toBe(true)
    })

    it('should handle missing beforeinstallprompt support', () => {
      const installationState = {
        canInstall: false,
        isInstalled: false,
        deferredPrompt: null as BeforeInstallPromptEvent | null,
      }

      const setupInstallationDetection = () => {
        // Check if beforeinstallprompt is supported
        if ('BeforeInstallPromptEvent' in window) {
          window.addEventListener('beforeinstallprompt', (event: BeforeInstallPromptEvent) => {
            event.preventDefault()
            installationState.deferredPrompt = event
            installationState.canInstall = true
          })
        } else {
          // Fallback for browsers that don't support beforeinstallprompt
          installationState.canInstall = false
        }
      }

      setupInstallationDetection()

      // Should handle gracefully when BeforeInstallPromptEvent is not available
      expect(installationState.canInstall).toBe(false)
      expect(installationState.deferredPrompt).toBeNull()
    })
  })

  describe('Installation Process', () => {
    it('should handle successful installation', async () => {
      mockUserChoice.outcome = 'accepted'

      const installApp = async (deferredPrompt: BeforeInstallPromptEvent) => {
        if (!deferredPrompt) {
          throw new Error('No installation prompt available')
        }

        await deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice

        return choiceResult.outcome === 'accepted'
      }

      const result = await installApp(mockBeforeInstallPrompt)

      expect(mockBeforeInstallPrompt.prompt).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should handle installation dismissal', async () => {
      mockUserChoice.outcome = 'dismissed'
      mockBeforeInstallPrompt.userChoice = Promise.resolve(mockUserChoice)

      const installApp = async (deferredPrompt: BeforeInstallPromptEvent) => {
        if (!deferredPrompt) {
          throw new Error('No installation prompt available')
        }

        await deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice

        return choiceResult.outcome === 'accepted'
      }

      const result = await installApp(mockBeforeInstallPrompt)

      expect(mockBeforeInstallPrompt.prompt).toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should handle installation errors', async () => {
      const error = new Error('Installation failed')
      mockBeforeInstallPrompt.prompt = vi.fn().mockRejectedValue(error)

      const installApp = async (deferredPrompt: BeforeInstallPromptEvent) => {
        if (!deferredPrompt) {
          throw new Error('No installation prompt available')
        }

        try {
          await deferredPrompt.prompt()
          const choiceResult = await deferredPrompt.userChoice
          return choiceResult.outcome === 'accepted'
        } catch (err) {
          console.error('Installation failed:', err)
          return false
        }
      }

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await installApp(mockBeforeInstallPrompt)

      expect(mockBeforeInstallPrompt.prompt).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith('Installation failed:', error)
      expect(result).toBe(false)

      consoleSpy.mockRestore()
    })

    it('should handle missing deferred prompt', async () => {
      const installApp = async (deferredPrompt: BeforeInstallPromptEvent | null) => {
        if (!deferredPrompt) {
          throw new Error('No installation prompt available')
        }

        await deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice

        return choiceResult.outcome === 'accepted'
      }

      await expect(installApp(null)).rejects.toThrow('No installation prompt available')
    })
  })

  describe('Installation State Management', () => {
    it('should track installation state changes', () => {
      let appInstalledListener: () => void = () => {}

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
        .mockImplementation((event: string, listener: any) => {
          if (event === 'appinstalled') {
            appInstalledListener = listener
          }
        })

      const installationState = {
        canInstall: false,
        isInstalled: false,
        deferredPrompt: null as BeforeInstallPromptEvent | null,
      }

      const setupInstallationTracking = () => {
        window.addEventListener('appinstalled', () => {
          installationState.isInstalled = true
          installationState.canInstall = false
          installationState.deferredPrompt = null
        })
      }

      setupInstallationTracking()

      // Verify event listener was added
      expect(addEventListenerSpy).toHaveBeenCalledWith('appinstalled', expect.any(Function))

      // Simulate app installation
      appInstalledListener()

      // Verify state is updated
      expect(installationState.isInstalled).toBe(true)
      expect(installationState.canInstall).toBe(false)
      expect(installationState.deferredPrompt).toBeNull()
    })

    it('should clean up event listeners', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const cleanup = () => {
        window.removeEventListener('beforeinstallprompt', () => {})
        window.removeEventListener('appinstalled', () => {})
      }

      cleanup()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('appinstalled', expect.any(Function))
    })
  })

  describe('Platform-Specific Installation', () => {
    it('should detect iOS Safari installation capability', () => {
      // Mock iOS Safari user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        writable: true,
      })

      // Mock iOS standalone mode
      Object.defineProperty(navigator, 'standalone', {
        value: false,
        writable: true,
      })

      const isIOSSafari = () => {
        const userAgent = navigator.userAgent
        const isIOS = /iPad|iPhone|iPod/.test(userAgent)
        const isSafari = /Safari/.test(userAgent) && !/CriOS|FxiOS|OPiOS|mercury/.test(userAgent)
        const isStandalone = (navigator as any).standalone === true

        return isIOS && isSafari && !isStandalone
      }

      expect(isIOSSafari()).toBe(true)
    })

    it('should detect Android Chrome installation capability', () => {
      // Mock Android Chrome user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        writable: true,
      })

      const isAndroidChrome = () => {
        const userAgent = navigator.userAgent
        const isAndroid = /Android/.test(userAgent)
        const isChrome = /Chrome/.test(userAgent) && !/Edg|OPR/.test(userAgent)

        return isAndroid && isChrome
      }

      expect(isAndroidChrome()).toBe(true)
    })

    it('should provide platform-specific installation instructions', () => {
      const getInstallationInstructions = (userAgent: string) => {
        if (/iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent)) {
          return {
            platform: 'iOS Safari',
            instructions: 'Tap the Share button and select "Add to Home Screen"',
            canShowPrompt: false,
          }
        } else if (/Android/.test(userAgent) && /Chrome/.test(userAgent)) {
          return {
            platform: 'Android Chrome',
            instructions: 'Tap "Add to Home Screen" when prompted, or use the browser menu',
            canShowPrompt: true,
          }
        } else {
          return {
            platform: 'Desktop',
            instructions: 'Look for the install icon in your browser\'s address bar',
            canShowPrompt: true,
          }
        }
      }

      // Test iOS Safari
      const iosInstructions = getInstallationInstructions(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      )
      expect(iosInstructions.platform).toBe('iOS Safari')
      expect(iosInstructions.canShowPrompt).toBe(false)

      // Test Android Chrome
      const androidInstructions = getInstallationInstructions(
        'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120'
      )
      expect(androidInstructions.platform).toBe('Android Chrome')
      expect(androidInstructions.canShowPrompt).toBe(true)

      // Test Desktop
      const desktopInstructions = getInstallationInstructions(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      )
      expect(desktopInstructions.platform).toBe('Desktop')
      expect(desktopInstructions.canShowPrompt).toBe(true)
    })
  })

  describe('PWA Manifest Validation', () => {
    it('should validate PWA manifest requirements', () => {
      const mockManifest = {
        name: 'Guitar Fretboard Viewer',
        short_name: 'Fretboard',
        description: 'Interactive guitar fretboard viewer for learning scales and music theory',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'landscape-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }

      const validateManifest = (manifest: any) => {
        const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons']
        const missingFields = requiredFields.filter(field => !manifest[field])

        const hasValidIcons = manifest.icons &&
          manifest.icons.length > 0 &&
          manifest.icons.some((icon: any) => icon.sizes && icon.src)

        return {
          isValid: missingFields.length === 0 && hasValidIcons,
          missingFields,
          hasValidIcons,
        }
      }

      const validation = validateManifest(mockManifest)

      expect(validation.isValid).toBe(true)
      expect(validation.missingFields).toHaveLength(0)
      expect(validation.hasValidIcons).toBe(true)
    })

    it('should detect invalid PWA manifest', () => {
      const invalidManifest = {
        name: 'Test App',
        // Missing required fields
      }

      const validateManifest = (manifest: any) => {
        const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons']
        const missingFields = requiredFields.filter(field => !manifest[field])

        const hasValidIcons = manifest.icons &&
          manifest.icons.length > 0 &&
          manifest.icons.some((icon: any) => icon.sizes && icon.src)

        return {
          isValid: missingFields.length === 0 && hasValidIcons,
          missingFields,
          hasValidIcons,
        }
      }

      const validation = validateManifest(invalidManifest)

      expect(validation.isValid).toBe(false)
      expect(validation.missingFields).toContain('short_name')
      expect(validation.missingFields).toContain('start_url')
      expect(validation.missingFields).toContain('display')
      expect(validation.missingFields).toContain('icons')
      expect(validation.hasValidIcons).toBe(false)
    })
  })
})