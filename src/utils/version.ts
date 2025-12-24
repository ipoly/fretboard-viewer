/**
 * Version management utilities for PWA update detection
 */

export interface VersionInfo {
  version: string
  buildTime: string
  gitHash?: string
}

// This would typically be injected at build time
export const APP_VERSION: VersionInfo = {
  version: __APP_VERSION__,
  buildTime: __BUILD_TIME__,
  gitHash: __GIT_HASH__
}

/**
 * Compare two version strings
 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)

  const maxLength = Math.max(parts1.length, parts2.length)

  for (let i = 0; i < maxLength; i++) {
    const part1 = parts1[i] || 0
    const part2 = parts2[i] || 0

    if (part1 < part2) return -1
    if (part1 > part2) return 1
  }

  return 0
}

/**
 * Check if a version is newer than the current version
 */
export function isNewerVersion(newVersion: string, currentVersion: string = APP_VERSION.version): boolean {
  return compareVersions(newVersion, currentVersion) > 0
}

/**
 * Get version info from localStorage (cached from previous session)
 */
export function getCachedVersionInfo(): VersionInfo | null {
  try {
    const cached = localStorage.getItem('app-version-info')
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

/**
 * Cache version info to localStorage
 */
export function setCachedVersionInfo(versionInfo: VersionInfo): void {
  try {
    localStorage.setItem('app-version-info', JSON.stringify(versionInfo))
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Check if the current version is different from the cached version
 */
export function hasVersionChanged(): boolean {
  const cached = getCachedVersionInfo()
  if (!cached) {
    // First time running, cache current version
    setCachedVersionInfo(APP_VERSION)
    return false
  }

  return cached.version !== APP_VERSION.version || cached.buildTime !== APP_VERSION.buildTime
}

/**
 * Update the cached version to the current version
 */
export function updateCachedVersion(): void {
  setCachedVersionInfo(APP_VERSION)
}

/**
 * Get a human-readable version string
 */
export function getVersionString(versionInfo: VersionInfo = APP_VERSION): string {
  const { version, buildTime, gitHash } = versionInfo
  const buildDate = new Date(buildTime).toLocaleDateString()

  if (gitHash && gitHash !== 'unknown') {
    return `v${version} (${buildDate}, ${gitHash.substring(0, 7)})`
  }

  return `v${version} (${buildDate})`
}

export default {
  APP_VERSION,
  compareVersions,
  isNewerVersion,
  getCachedVersionInfo,
  setCachedVersionInfo,
  hasVersionChanged,
  updateCachedVersion,
  getVersionString,
}