/**
 * Layer Management System Tests
 *
 * Tests for the CSS Grid layer management system to ensure proper z-index ordering
 * and element visibility according to Requirements 5.1, 5.2, 5.3, 5.4, 5.6
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { GridLayers, LayerManager } from './index'

describe('Layer Management System', () => {
  let mockContainer: HTMLElement

  beforeEach(() => {
    // Create a mock DOM container
    mockContainer = document.createElement('div')
    document.body.appendChild(mockContainer)
  })

  describe('GridLayers Constants', () => {
    it('should define correct z-index values in ascending order', () => {
      expect(GridLayers.FRET_LINES).toBe(1)
      expect(GridLayers.STRING_LINES).toBe(2)
      expect(GridLayers.MARKER_WRAPPER).toBe(3)
      expect(GridLayers.NOTE_MARKERS).toBe(4)

      // Verify ascending order
      expect(GridLayers.FRET_LINES).toBeLessThan(GridLayers.STRING_LINES)
      expect(GridLayers.STRING_LINES).toBeLessThan(GridLayers.MARKER_WRAPPER)
      expect(GridLayers.MARKER_WRAPPER).toBeLessThan(GridLayers.NOTE_MARKERS)
    })
  })

  describe('LayerManager.validateLayerOrder', () => {
    it('should validate correct layer order', () => {
      // Create elements with correct z-index values
      const fretLine = document.createElement('div')
      fretLine.dataset.layer = 'fret-lines'
      fretLine.style.zIndex = GridLayers.FRET_LINES.toString()

      const stringLine = document.createElement('div')
      stringLine.dataset.layer = 'string-lines'
      stringLine.style.zIndex = GridLayers.STRING_LINES.toString()

      const markerWrapper = document.createElement('div')
      markerWrapper.dataset.layer = 'marker-wrapper'
      markerWrapper.style.zIndex = GridLayers.MARKER_WRAPPER.toString()

      const noteMarker = document.createElement('div')
      noteMarker.classList.add('note-marker')
      noteMarker.style.zIndex = GridLayers.NOTE_MARKERS.toString()

      // Note: open-string-marker is now unified with note-marker
      const elements = [fretLine, stringLine, markerWrapper, noteMarker]

      expect(LayerManager.validateLayerOrder(elements)).toBe(true)
    })

    it('should detect incorrect layer order', () => {
      // Create element with wrong z-index
      const fretLine = document.createElement('div')
      fretLine.dataset.layer = 'fret-lines'
      fretLine.style.zIndex = '10' // Wrong z-index

      const elements = [fretLine]

      expect(LayerManager.validateLayerOrder(elements)).toBe(false)
    })
  })

  describe('LayerManager.enforceLayerOrder', () => {
    it('should enforce correct z-index values on all elements', () => {
      // Create elements with wrong z-index values
      const fretLine = document.createElement('div')
      fretLine.dataset.layer = 'fret-lines'
      fretLine.style.zIndex = '10' // Wrong

      const stringLine = document.createElement('div')
      stringLine.dataset.layer = 'string-lines'
      stringLine.style.zIndex = '20' // Wrong

      const markerWrapper = document.createElement('div')
      markerWrapper.dataset.layer = 'marker-wrapper'
      markerWrapper.style.zIndex = '25' // Wrong

      const noteMarker = document.createElement('div')
      noteMarker.dataset.layer = 'note-markers'
      noteMarker.style.zIndex = '30' // Wrong

      // Note: open-string-mask is now unified with note-marker

      mockContainer.appendChild(fretLine)
      mockContainer.appendChild(stringLine)
      mockContainer.appendChild(markerWrapper)
      mockContainer.appendChild(noteMarker)

      // Enforce correct layer order
      LayerManager.enforceLayerOrder(mockContainer)

      // Verify correct z-index values were applied
      expect(fretLine.style.zIndex).toBe(GridLayers.FRET_LINES.toString())
      expect(stringLine.style.zIndex).toBe(GridLayers.STRING_LINES.toString())
      expect(markerWrapper.style.zIndex).toBe(GridLayers.MARKER_WRAPPER.toString())
      expect(noteMarker.style.zIndex).toBe(GridLayers.NOTE_MARKERS.toString())
    })
  })

  describe('LayerManager.getLayerInfo', () => {
    it('should return correct layer information for debugging', () => {
      const layerInfo = LayerManager.getLayerInfo()

      expect(layerInfo).toEqual({
        'Fret Lines (底层)': GridLayers.FRET_LINES,
        'String Lines': GridLayers.STRING_LINES,
        'Marker Wrapper': GridLayers.MARKER_WRAPPER,
        'Note Markers (顶层)': GridLayers.NOTE_MARKERS,
      })
    })
  })

  describe('Layer System Requirements Validation', () => {
    it('should ensure fret lines are at the bottom layer (Requirement 5.1)', () => {
      expect(GridLayers.FRET_LINES).toBe(1)

      // Verify it's the lowest layer
      const allLayers = Object.values(GridLayers).filter(v => typeof v === 'number') as number[]
      expect(GridLayers.FRET_LINES).toBe(Math.min(...allLayers))
    })

    it('should ensure string lines are above fret lines (Requirement 5.2)', () => {
      expect(GridLayers.STRING_LINES).toBe(2)
      expect(GridLayers.STRING_LINES).toBeGreaterThan(GridLayers.FRET_LINES)
    })

    it('should ensure note markers are at higher layer (Requirement 5.3)', () => {
      expect(GridLayers.NOTE_MARKERS).toBe(4)
      expect(GridLayers.NOTE_MARKERS).toBeGreaterThan(GridLayers.MARKER_WRAPPER)
    })

    it('should ensure note markers are at the top layer (Requirement 5.4)', () => {
      expect(GridLayers.NOTE_MARKERS).toBe(4)

      // Verify it's the highest layer
      const allLayers = Object.values(GridLayers).filter(v => typeof v === 'number') as number[]
      expect(GridLayers.NOTE_MARKERS).toBe(Math.max(...allLayers))
    })

    it('should ensure all elements display correctly without being obscured (Requirement 5.6)', () => {
      // This test verifies the layer order ensures proper visibility
      const layers = [
        GridLayers.FRET_LINES,
        GridLayers.STRING_LINES,
        GridLayers.MARKER_WRAPPER,
        GridLayers.NOTE_MARKERS,
      ]

      // Each layer should be higher than the previous
      for (let i = 1; i < layers.length; i++) {
        expect(layers[i]).toBeGreaterThan(layers[i - 1])
      }

      // No duplicate z-index values
      const uniqueLayers = new Set(layers)
      expect(uniqueLayers.size).toBe(layers.length)
    })
  })
})