/**
 * Layer Management Hook
 *
 * React hook for managing CSS Grid layer system with proper z-index ordering
 * according to Requirements 5.1, 5.2, 5.3, 5.4, 5.6
 */

import { useEffect, useCallback, RefObject } from 'react'
import { GridLayers, LayerManager } from './index'

/**
 * Hook for managing layer order in the fretboard grid
 *
 * @param containerRef - Reference to the fretboard grid container
 * @param enabled - Whether layer management is enabled (default: true)
 */
export function useLayerManagement(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean = true
) {
  /**
   * Validate current layer order
   */
  const validateLayers = useCallback((): boolean => {
    if (!enabled || !containerRef.current) return true

    const elements = Array.from(containerRef.current.querySelectorAll('[data-layer]')) as HTMLElement[]
    return LayerManager.validateLayerOrder(elements)
  }, [containerRef, enabled])

  /**
   * Enforce correct layer order
   */
  const enforceLayers = useCallback((): void => {
    if (!enabled || !containerRef.current) return

    LayerManager.enforceLayerOrder(containerRef.current)
  }, [containerRef, enabled])

  /**
   * Get layer information for debugging
   */
  const getLayerInfo = useCallback(() => {
    return LayerManager.getLayerInfo()
  }, [])

  /**
   * Check if all elements are properly layered
   */
  const checkLayerIntegrity = useCallback((): {
    isValid: boolean
    issues: string[]
  } => {
    if (!enabled || !containerRef.current) {
      return { isValid: true, issues: [] }
    }

    const issues: string[] = []
    const container = containerRef.current

    // Check fret lines
    const fretLines = container.querySelectorAll('[data-layer="fret-lines"]')
    fretLines.forEach((el, index) => {
      const zIndex = parseInt(getComputedStyle(el as HTMLElement).zIndex || '0')
      if (zIndex !== GridLayers.FRET_LINES) {
        issues.push(`Fret line ${index} has incorrect z-index: ${zIndex}, expected: ${GridLayers.FRET_LINES}`)
      }
    })

    // Check string lines
    const stringLines = container.querySelectorAll('[data-layer="string-lines"]')
    stringLines.forEach((el, index) => {
      const zIndex = parseInt(getComputedStyle(el as HTMLElement).zIndex || '0')
      if (zIndex !== GridLayers.STRING_LINES) {
        issues.push(`String line ${index} has incorrect z-index: ${zIndex}, expected: ${GridLayers.STRING_LINES}`)
      }
    })

    // Check marker wrappers
    const markerWrappers = container.querySelectorAll('[data-layer="marker-wrapper"]')
    markerWrappers.forEach((el, index) => {
      const zIndex = parseInt(getComputedStyle(el as HTMLElement).zIndex || '0')
      if (zIndex !== GridLayers.MARKER_WRAPPER) {
        issues.push(`Marker wrapper ${index} has incorrect z-index: ${zIndex}, expected: ${GridLayers.MARKER_WRAPPER}`)
      }
    })

    // Check note markers
    const noteMarkers = container.querySelectorAll('[data-layer="note-markers"]')
    noteMarkers.forEach((el, index) => {
      const zIndex = parseInt(getComputedStyle(el as HTMLElement).zIndex || '0')
      if (zIndex !== GridLayers.NOTE_MARKERS) {
        issues.push(`Note marker ${index} has incorrect z-index: ${zIndex}, expected: ${GridLayers.NOTE_MARKERS}`)
      }
    })

    return {
      isValid: issues.length === 0,
      issues
    }
  }, [containerRef, enabled])

  // Automatically enforce layer order on mount and when enabled changes
  useEffect(() => {
    if (enabled && containerRef.current) {
      enforceLayers()
    }
  }, [enforceLayers, enabled])

  // Validate layers after DOM updates (throttled)
  useEffect(() => {
    if (!enabled || !containerRef.current) return

    let timeoutId: number

    const observer = new MutationObserver(() => {
      // Throttle validation to avoid performance issues
      clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        const integrity = checkLayerIntegrity()
        if (!integrity.isValid) {
          console.warn('Layer integrity issues detected:', integrity.issues)
          enforceLayers()
        }
      }, 100) // 100ms throttle
    })

    observer.observe(containerRef.current, {
      childList: true,
      subtree: false, // Only observe direct children
      attributes: true,
      attributeFilter: ['style', 'data-layer'] // Only observe relevant attributes
    })

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [containerRef, enabled, checkLayerIntegrity, enforceLayers])

  return {
    validateLayers,
    enforceLayers,
    getLayerInfo,
    checkLayerIntegrity,
    GridLayers
  }
}

export default useLayerManagement