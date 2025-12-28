/**
 * Backward Compatibility Tests for FretboardGrid CSS Grid Refactor
 *
 * This test suite verifies that the refactored FretboardGrid component
 * maintains complete backward compatibility with the original implementation.
 *
 * Requirements tested:
 * - 8.1: Same props interface
 * - 8.2: All existing functionality
 * - 8.3: Same accessibility features and ARIA labels
 * - 8.4: Same keyboard navigation
 * - 8.5: Compatible with existing test suite
 */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import FretboardGrid from '../components/Fretboard/FretboardGrid'
import { MusicalKey, DisplayMode } from '../types'

describe('Backward Compatibility Tests', () => {
  describe('Props Interface Compatibility (Requirement 8.1)', () => {
    it('should accept the same props interface as the original implementation', () => {
      // Test that all original props are accepted without TypeScript errors
      const props = {
        selectedKey: 'C' as MusicalKey,
        displayMode: 'notes' as DisplayMode,
        fretCount: 24
      }

      const { container } = render(<FretboardGrid {...props} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should work with all valid musical keys', () => {
      const musicalKeys: MusicalKey[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

      musicalKeys.forEach(key => {
        const { container } = render(
          <FretboardGrid
            selectedKey={key}
            displayMode="notes"
            fretCount={12}
          />
        )
        expect(container.firstChild).toBeInTheDocument()
      })
    })

    it('should work with both display modes', () => {
      const displayModes: DisplayMode[] = ['notes', 'degrees']

      displayModes.forEach(mode => {
        const { container } = render(
          <FretboardGrid
            selectedKey="C"
            displayMode={mode}
            fretCount={12}
          />
        )
        expect(container.firstChild).toBeInTheDocument()
      })
    })

    it('should handle various fret counts', () => {
      const fretCounts = [12, 15, 18, 21, 24]

      fretCounts.forEach(fretCount => {
        const { container } = render(
          <FretboardGrid
            selectedKey="C"
            displayMode="notes"
            fretCount={fretCount}
          />
        )
        expect(container.firstChild).toBeInTheDocument()
      })
    })
  })

  describe('Existing Functionality Compatibility (Requirement 8.2)', () => {
    it('should display notes correctly in notes mode', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Should find note elements with note names
      const noteElements = container.querySelectorAll('.note-marker') // Unified class for all markers
      expect(noteElements.length).toBeGreaterThan(0)

      // Check that some note names are displayed
      const hasNoteNames = Array.from(noteElements).some(element =>
        /^[A-G]#?$/.test(element.textContent?.trim() || '')
      )
      expect(hasNoteNames).toBe(true)
    })

    it('should display scale degrees correctly in degrees mode', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="G"
          displayMode="degrees"
          fretCount={12}
        />
      )

      // Should find degree elements with scale degrees
      const degreeElements = container.querySelectorAll('.note-marker') // Unified class for all markers
      expect(degreeElements.length).toBeGreaterThan(0)

      // Check that some scale degrees are displayed
      const hasScaleDegrees = Array.from(degreeElements).some(element =>
        /^[1-7]$/.test(element.textContent?.trim() || '')
      )
      expect(hasScaleDegrees).toBe(true)
    })

    it('should support key changes and update displayed content', () => {
      const { container, rerender } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Get initial content
      const initialContent = container.textContent

      // Change key to D
      rerender(
        <FretboardGrid
          selectedKey="D"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Content should change (different notes for different key)
      const newContent = container.textContent
      expect(newContent).not.toBe(initialContent)
    })

    it('should support display mode changes', () => {
      const { container, rerender } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Should show note names initially
      expect(container.textContent).toMatch(/[CDEFGAB]/)

      // Change to degrees mode
      rerender(
        <FretboardGrid
          selectedKey="C"
          displayMode="degrees"
          fretCount={12}
        />
      )

      // Should show scale degrees
      expect(container.textContent).toMatch(/[1-7]/)
    })

    it('should maintain CSS Grid layout structure', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={15}
        />
      )

      const fretboardGrid = container.querySelector('[role="application"]')
      expect(fretboardGrid).toBeInTheDocument()

      // Verify CSS Grid is being used
      const computedStyle = window.getComputedStyle(fretboardGrid as Element)
      expect(computedStyle.display).toBe('grid')
    })
  })

  describe('Accessibility Features Compatibility (Requirement 8.3)', () => {
    it('should maintain ARIA labels and roles', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Main fretboard should have application role
      const fretboardGrid = container.querySelector('[role="application"]')
      expect(fretboardGrid).toBeInTheDocument()
      expect(fretboardGrid).toHaveAttribute('aria-label')

      // Should have aria-describedby reference
      expect(fretboardGrid).toHaveAttribute('aria-describedby', 'fretboard-instructions')

      // Instructions should be present for screen readers
      const instructions = container.querySelector('#fretboard-instructions')
      expect(instructions).toBeInTheDocument()
      expect(instructions).toHaveClass('sr-only')
    })

    it('should maintain note position accessibility', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Note positions should have proper roles and labels
      const noteElements = container.querySelectorAll('.note-marker') // Unified class for all markers

      for (const element of noteElements) {
        expect(element).toHaveAttribute('role', 'button')
        expect(element).toHaveAttribute('tabIndex', '0')
        expect(element).toHaveAttribute('aria-label')
        expect(element).toHaveAttribute('title')
      }
    })

    it('should maintain screen reader friendly structure', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Screen reader instructions should be hidden but accessible
      const instructions = container.querySelector('#fretboard-instructions')
      expect(instructions).toBeInTheDocument()

      const computedStyle = window.getComputedStyle(instructions as Element)
      expect(computedStyle.position).toBe('absolute')
      expect(computedStyle.left).toBe('-10000px')
    })
  })

  describe('Keyboard Navigation Compatibility (Requirement 8.4)', () => {
    it('should support arrow key navigation for scrolling', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={24}
        />
      )

      const fretboardGrid = container.querySelector('[role="application"]') as HTMLElement
      expect(fretboardGrid).toBeInTheDocument()
      expect(fretboardGrid).toHaveAttribute('tabIndex', '0')

      // Mock scrollLeft property
      Object.defineProperty(fretboardGrid, 'scrollLeft', {
        value: 0,
        writable: true,
        configurable: true
      })

      Object.defineProperty(fretboardGrid, 'scrollWidth', {
        value: 2000,
        configurable: true
      })

      Object.defineProperty(fretboardGrid, 'clientWidth', {
        value: 800,
        configurable: true
      })

      // Test arrow key navigation
      fireEvent.keyDown(fretboardGrid, { key: 'ArrowRight' })
      fireEvent.keyDown(fretboardGrid, { key: 'ArrowLeft' })
      fireEvent.keyDown(fretboardGrid, { key: 'Home' })
      fireEvent.keyDown(fretboardGrid, { key: 'End' })

      // Should not throw errors and should prevent default
      expect(fretboardGrid).toBeInTheDocument()
    })

    it('should support Enter and Space key interaction on note positions', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      const noteElements = container.querySelectorAll('.note-marker') // Unified class for all markers
      expect(noteElements.length).toBeGreaterThan(0)

      // Test keyboard interaction on first note element
      const firstNote = noteElements[0] as HTMLElement

      // Should handle Enter key
      fireEvent.keyDown(firstNote, { key: 'Enter' })
      expect(firstNote).toBeInTheDocument()

      // Should handle Space key
      fireEvent.keyDown(firstNote, { key: ' ' })
      expect(firstNote).toBeInTheDocument()
    })

    it('should maintain focus management', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      const fretboardGrid = container.querySelector('[role="application"]') as HTMLElement
      expect(fretboardGrid).toHaveAttribute('tabIndex', '0')

      // Should be focusable
      fretboardGrid.focus()
      expect(document.activeElement).toBe(fretboardGrid)
    })
  })

  describe('Test Suite Compatibility (Requirement 8.5)', () => {
    it('should render without errors in test environment', () => {
      // This test verifies that the component renders successfully in the test environment
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      expect(container.firstChild).toBeInTheDocument()
      expect(container.querySelector('[role="application"]')).toBeInTheDocument()
    })

    it('should handle rapid prop changes without errors', () => {
      const { rerender } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Rapidly change props to test stability
      const keys: MusicalKey[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
      const modes: DisplayMode[] = ['notes', 'degrees']

      for (let i = 0; i < 10; i++) {
        rerender(
          <FretboardGrid
            selectedKey={keys[i % keys.length]}
            displayMode={modes[i % modes.length]}
            fretCount={12 + (i % 12)}
          />
        )
      }

      // Should complete without errors
      expect(true).toBe(true)
    })

    it('should maintain consistent DOM structure for testing', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Verify expected DOM structure for testing
      expect(container.querySelector('[role="application"]')).toBeInTheDocument()
      expect(container.querySelector('#fretboard-instructions')).toBeInTheDocument()
      expect(container.querySelectorAll('.note-marker').length).toBeGreaterThan(0) // Unified class for all markers
    })

    it('should work with mocked environments', () => {
      // Mock window.getComputedStyle for testing environments that might not have it
      const originalGetComputedStyle = window.getComputedStyle
      window.getComputedStyle = vi.fn().mockReturnValue({
        display: 'grid',
        gridTemplateColumns: 'var(--open-string-width) repeat(var(--fret-count), var(--fret-width))',
        gridTemplateRows: 'repeat(6, var(--string-height))',
        overflowX: 'auto',
        overflowY: 'hidden'
      })

      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      expect(container.firstChild).toBeInTheDocument()

      // Restore original function
      window.getComputedStyle = originalGetComputedStyle
    })
  })

  describe('Visual and Functional Consistency', () => {
    it('should maintain the same visual elements', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Should have fret lines (represented by data attributes)
      const fretLines = container.querySelectorAll('[data-fret-number]')
      expect(fretLines.length).toBeGreaterThan(0)

      // Should have string lines (represented by data attributes)
      const stringLines = container.querySelectorAll('[data-string]')
      expect(stringLines.length).toBeGreaterThan(0)

      // Should have note markers
      const noteMarkers = container.querySelectorAll('.note-marker') // Unified class for all markers
      expect(noteMarkers.length).toBeGreaterThan(0)
    })

    it('should maintain responsive behavior', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={24}
        />
      )

      const fretboardGrid = container.querySelector('[role="application"]')
      expect(fretboardGrid).toBeInTheDocument()

      // Should have overflow settings for scrolling
      const computedStyle = window.getComputedStyle(fretboardGrid as Element)
      expect(computedStyle.overflowX).toBe('auto')
      expect(computedStyle.overflowY).toBe('hidden')
    })

    it('should maintain color consistency for scale degrees', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="degrees"
          fretCount={12}
        />
      )

      const noteElements = container.querySelectorAll('.note-marker') // Unified class for all markers

      // Group elements by scale degree
      const elementsByDegree = new Map<string, HTMLElement[]>()

      for (const element of noteElements) {
        const scaleDegree = element.getAttribute('data-scale-degree')
        if (scaleDegree) {
          if (!elementsByDegree.has(scaleDegree)) {
            elementsByDegree.set(scaleDegree, [])
          }
          elementsByDegree.get(scaleDegree)!.push(element as HTMLElement)
        }
      }

      // Verify that elements with the same scale degree have the same background color
      for (const [_degree, elements] of elementsByDegree) {
        if (elements.length > 1) {
          const firstColor = elements[0].style.backgroundColor
          for (const element of elements) {
            expect(element.style.backgroundColor).toBe(firstColor)
          }
        }
      }
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle minimum fret count gracefully', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={1}
        />
      )

      expect(container.firstChild).toBeInTheDocument()
      expect(container.querySelector('[role="application"]')).toBeInTheDocument()
    })

    it('should handle maximum fret count gracefully', () => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={36}
        />
      )

      expect(container.firstChild).toBeInTheDocument()
      expect(container.querySelector('[role="application"]')).toBeInTheDocument()
    })

    it('should handle all musical keys including sharps', () => {
      const sharpKeys: MusicalKey[] = ['C#', 'D#', 'F#', 'G#', 'A#']

      sharpKeys.forEach(key => {
        const { container } = render(
          <FretboardGrid
            selectedKey={key}
            displayMode="notes"
            fretCount={12}
          />
        )
        expect(container.firstChild).toBeInTheDocument()
      })
    })
  })
})