/**
 * Layer Management Integration Tests
 *
 * Tests to verify that the layer management system is properly integrated
 * into the FretboardGrid component according to Requirements 5.1, 5.2, 5.3, 5.4, 5.6
 */

import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FretboardGrid from './FretboardGrid'
import { MusicalKey, DisplayMode } from '../../types'
import { GridLayers } from '../../utils/grid'

describe('FretboardGrid Layer Management Integration', () => {
  const defaultProps = {
    selectedKey: 'C' as MusicalKey,
    displayMode: 'notes' as DisplayMode,
    fretCount: 12
  }

  it('should apply correct z-index values to all layer elements', () => {
    const { container } = render(<FretboardGrid {...defaultProps} />)

    // Check fret lines have correct z-index (Requirement 5.1)
    const fretLines = container.querySelectorAll('[data-layer="fret-lines"]')
    expect(fretLines.length).toBeGreaterThan(0)
    fretLines.forEach(element => {
      const zIndex = parseInt(getComputedStyle(element as HTMLElement).zIndex || '0')
      expect(zIndex).toBe(GridLayers.FRET_LINES)
    })

    // Check string lines have correct z-index (Requirement 5.2)
    const stringLines = container.querySelectorAll('[data-layer="string-lines"]')
    expect(stringLines.length).toBe(6) // 6 strings
    stringLines.forEach(element => {
      const zIndex = parseInt(getComputedStyle(element as HTMLElement).zIndex || '0')
      expect(zIndex).toBe(GridLayers.STRING_LINES)
    })

    // Check marker wrappers have correct z-index (Requirement 5.3)
    const markerWrappers = container.querySelectorAll('[data-layer="marker-wrapper"]')
    expect(markerWrappers.length).toBeGreaterThan(0)
    markerWrappers.forEach(element => {
      const zIndex = parseInt(getComputedStyle(element as HTMLElement).zIndex || '0')
      expect(zIndex).toBe(GridLayers.MARKER_WRAPPER)
    })

    // Check note markers have correct z-index (Requirement 5.4)
    const noteMarkers = container.querySelectorAll('[data-layer="note-markers"]')
    expect(noteMarkers.length).toBeGreaterThan(0)
    noteMarkers.forEach(element => {
      const zIndex = parseInt(getComputedStyle(element as HTMLElement).zIndex || '0')
      expect(zIndex).toBe(GridLayers.NOTE_MARKERS)
    })
  })

  it('should maintain proper layer hierarchy (Requirement 5.6)', () => {
    const { container } = render(<FretboardGrid {...defaultProps} />)

    // Verify layer hierarchy: fret lines < string lines < marker wrappers < note markers
    expect(GridLayers.FRET_LINES).toBeLessThan(GridLayers.STRING_LINES)
    expect(GridLayers.STRING_LINES).toBeLessThan(GridLayers.MARKER_WRAPPER)
    expect(GridLayers.MARKER_WRAPPER).toBeLessThan(GridLayers.NOTE_MARKERS)

    // Verify all elements have data-layer attributes for layer management
    const layeredElements = container.querySelectorAll('[data-layer]')
    expect(layeredElements.length).toBeGreaterThan(0)

    // Verify each layer type exists
    const fretLines = container.querySelectorAll('[data-layer="fret-lines"]')
    const stringLines = container.querySelectorAll('[data-layer="string-lines"]')
    const markerWrappers = container.querySelectorAll('[data-layer="marker-wrapper"]')
    const noteMarkers = container.querySelectorAll('[data-layer="note-markers"]')

    expect(fretLines.length).toBeGreaterThan(0)
    expect(stringLines.length).toBe(6)
    expect(markerWrappers.length).toBeGreaterThan(0)
    expect(noteMarkers.length).toBeGreaterThan(0)
  })

  it('should ensure no z-index conflicts between layers', () => {
    const { container } = render(<FretboardGrid {...defaultProps} />)

    const allLayeredElements = container.querySelectorAll('[data-layer]')
    const zIndexValues = Array.from(allLayeredElements).map(element =>
      parseInt(getComputedStyle(element as HTMLElement).zIndex || '0')
    )

    // Check that we have exactly 4 different z-index values (one for each layer)
    const uniqueZIndexes = new Set(zIndexValues)
    expect(uniqueZIndexes.size).toBe(4)
    expect(uniqueZIndexes.has(GridLayers.FRET_LINES)).toBe(true)
    expect(uniqueZIndexes.has(GridLayers.STRING_LINES)).toBe(true)
    expect(uniqueZIndexes.has(GridLayers.MARKER_WRAPPER)).toBe(true)
    expect(uniqueZIndexes.has(GridLayers.NOTE_MARKERS)).toBe(true)
  })

  it('should maintain layer integrity with different fret counts', () => {
    // Test with minimal fret count
    const { container: minContainer } = render(
      <FretboardGrid {...defaultProps} fretCount={1} />
    )

    // Test with maximum fret count
    const { container: maxContainer } = render(
      <FretboardGrid {...defaultProps} fretCount={24} />
    )

    // Both should have proper layer structure
    const checkLayerStructure = (container: HTMLElement) => {
      const fretLines = container.querySelectorAll('[data-layer="fret-lines"]')
      const stringLines = container.querySelectorAll('[data-layer="string-lines"]')
      const markerWrappers = container.querySelectorAll('[data-layer="marker-wrapper"]')
      const noteMarkers = container.querySelectorAll('[data-layer="note-markers"]')

      expect(fretLines.length).toBeGreaterThan(0)
      expect(stringLines.length).toBe(6)
      expect(markerWrappers.length).toBeGreaterThan(0)
      expect(noteMarkers.length).toBeGreaterThan(0)

      // Verify z-index values
      fretLines.forEach(el => {
        expect(parseInt(getComputedStyle(el as HTMLElement).zIndex || '0')).toBe(GridLayers.FRET_LINES)
      })
      stringLines.forEach(el => {
        expect(parseInt(getComputedStyle(el as HTMLElement).zIndex || '0')).toBe(GridLayers.STRING_LINES)
      })
      markerWrappers.forEach(el => {
        expect(parseInt(getComputedStyle(el as HTMLElement).zIndex || '0')).toBe(GridLayers.MARKER_WRAPPER)
      })
      noteMarkers.forEach(el => {
        expect(parseInt(getComputedStyle(el as HTMLElement).zIndex || '0')).toBe(GridLayers.NOTE_MARKERS)
      })
    }

    checkLayerStructure(minContainer)
    checkLayerStructure(maxContainer)
  })

  it('should maintain layer integrity across different keys and display modes', () => {
    const keys: MusicalKey[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F']
    const displayModes: DisplayMode[] = ['notes', 'degrees']

    keys.forEach(key => {
      displayModes.forEach(mode => {
        const { container } = render(
          <FretboardGrid selectedKey={key} displayMode={mode} fretCount={12} />
        )

        // Verify layer structure is consistent regardless of key/mode
        const fretLines = container.querySelectorAll('[data-layer="fret-lines"]')
        const stringLines = container.querySelectorAll('[data-layer="string-lines"]')
        const markerWrappers = container.querySelectorAll('[data-layer="marker-wrapper"]')
        const noteMarkers = container.querySelectorAll('[data-layer="note-markers"]')

        expect(fretLines.length).toBeGreaterThan(0)
        expect(stringLines.length).toBe(6)
        expect(markerWrappers.length).toBeGreaterThan(0)
        expect(noteMarkers.length).toBeGreaterThan(0)

        // Spot check z-index values
        if (fretLines.length > 0) {
          expect(parseInt(getComputedStyle(fretLines[0] as HTMLElement).zIndex || '0')).toBe(GridLayers.FRET_LINES)
        }
        if (stringLines.length > 0) {
          expect(parseInt(getComputedStyle(stringLines[0] as HTMLElement).zIndex || '0')).toBe(GridLayers.STRING_LINES)
        }
        if (markerWrappers.length > 0) {
          expect(parseInt(getComputedStyle(markerWrappers[0] as HTMLElement).zIndex || '0')).toBe(GridLayers.MARKER_WRAPPER)
        }
        if (noteMarkers.length > 0) {
          expect(parseInt(getComputedStyle(noteMarkers[0] as HTMLElement).zIndex || '0')).toBe(GridLayers.NOTE_MARKERS)
        }
      })
    })
  })
})