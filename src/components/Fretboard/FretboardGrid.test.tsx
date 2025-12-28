import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import * as fc from 'fast-check'
import FretboardGrid from './FretboardGrid'
import { MusicalKey, DisplayMode } from '../../types'
import { testGenerators, propertyTestConfig } from '../../test/test-helpers'
import { calculateMajorScale } from '../../utils/music/scales'
import { getFretboardPositions } from '../../utils/music/fretboard'

describe('FretboardGrid Display Consistency - Property Tests', () => {
  /**
   * Property 1: Display Mode Consistency
   * For any selected key and display mode toggle action, the fretboard should immediately update
   * to show the correct information (notes or scale degrees) while maintaining the selected key,
   * and all displayed elements should use the appropriate format for the current mode.
   *
   * Feature: guitar-fretboard-viewer, Property 1: Display Mode Consistency
   * Validates: Requirements 3.2, 3.3, 3.4, 3.5
   */

  it('Property 1a: Display mode determines content format consistently', () => {
    fc.assert(
      fc.property(
        testGenerators.musicalKey,
        testGenerators.displayMode,
        fc.integer({ min: 12, max: 24 }),
        (selectedKey: MusicalKey, displayMode: DisplayMode, fretCount: number) => {
          // Render the fretboard with the given parameters
          const { container } = render(
            <FretboardGrid
              selectedKey={selectedKey}
              displayMode={displayMode}
              fretCount={fretCount}
            />
          )

          // Get all note position elements (they have title attributes)
          const noteElements = container.querySelectorAll('[title*="degree"]')

          // Verify that all note positions display content appropriate to the display mode
          for (const element of noteElements) {
            const displayText = element.textContent?.trim() || ''

            if (displayMode === 'notes') {
              // In notes mode, should display note names (A-G with optional #)
              expect(displayText).toMatch(/^[A-G]#?$/)
            } else if (displayMode === 'degrees') {
              // In degrees mode, should display scale degrees (1-7)
              expect(displayText).toMatch(/^[1-7]$/)
            }
          }

          return true
        }
      ),
      {
        ...propertyTestConfig,
        // Tag for property-based test identification
        // Feature: guitar-fretboard-viewer, Property 1: Display Mode Consistency
      }
    )
  })

  it('Property 1b: Key selection affects displayed notes while preserving display mode', () => {
    fc.assert(
      fc.property(
        testGenerators.musicalKey,
        testGenerators.displayMode,
        fc.integer({ min: 12, max: 24 }),
        (selectedKey: MusicalKey, displayMode: DisplayMode, fretCount: number) => {
          // Render the fretboard
          const { container } = render(
            <FretboardGrid
              selectedKey={selectedKey}
              displayMode={displayMode}
              fretCount={fretCount}
            />
          )

          // Get the scale for the selected key
          const scaleInfo = calculateMajorScale(selectedKey)
          const scaleNotes = new Set(scaleInfo.notes)

          // Get all note position elements
          const noteElements = container.querySelectorAll('[title*="degree"]')

          // Verify that all displayed notes belong to the selected key's scale
          for (const element of noteElements) {
            const titleAttr = element.getAttribute('title') || ''

            // Extract note name from title (format: "C (1st degree) - Fret 1")
            const noteMatch = titleAttr.match(/^([A-G]#?) \(/)
            if (noteMatch) {
              const noteName = noteMatch[1]
              expect(scaleNotes.has(noteName)).toBe(true)
            }
          }

          return true
        }
      ),
      propertyTestConfig
    )
  })

  it('Property 1c: All instances of same note/degree use consistent display format', () => {
    fc.assert(
      fc.property(
        testGenerators.musicalKey,
        testGenerators.displayMode,
        fc.integer({ min: 12, max: 24 }),
        (selectedKey: MusicalKey, displayMode: DisplayMode, fretCount: number) => {
          // Render the fretboard
          const { container } = render(
            <FretboardGrid
              selectedKey={selectedKey}
              displayMode={displayMode}
              fretCount={fretCount}
            />
          )

          // Get all note position elements
          const noteElements = container.querySelectorAll('[title*="degree"]')

          // Group elements by their note/degree
          const elementsByContent = new Map<string, HTMLElement[]>()

          for (const element of noteElements) {
            const titleAttr = element.getAttribute('title') || ''
            const displayText = element.textContent?.trim() || ''

            // Extract note and degree from title
            const noteMatch = titleAttr.match(/^([A-G]#?) \((\d+)[a-z]+ degree\)/)
            if (noteMatch) {
              const noteName = noteMatch[1]
              const scaleDegree = noteMatch[2]

              // Use note or degree as key based on display mode
              const contentKey = displayMode === 'notes' ? noteName : scaleDegree

              if (!elementsByContent.has(contentKey)) {
                elementsByContent.set(contentKey, [])
              }
              elementsByContent.get(contentKey)!.push(element as HTMLElement)

              // Verify the displayed text matches the expected format
              if (displayMode === 'notes') {
                expect(displayText).toBe(noteName)
              } else {
                expect(displayText).toBe(scaleDegree)
              }
            }
          }

          // Verify that all instances of the same content display identically
          for (const [, elements] of elementsByContent) {
            if (elements.length > 1) {
              const firstDisplayText = elements[0].textContent?.trim()

              for (const element of elements) {
                expect(element.textContent?.trim()).toBe(firstDisplayText)
              }
            }
          }

          return true
        }
      ),
      propertyTestConfig
    )
  })

  it('Property 1d: Display mode toggle preserves key selection and updates format', () => {
    fc.assert(
      fc.property(
        testGenerators.musicalKey,
        fc.integer({ min: 12, max: 24 }),
        (selectedKey: MusicalKey, fretCount: number) => {
          // Test both display modes with the same key
          const { container: notesContainer } = render(
            <FretboardGrid
              selectedKey={selectedKey}
              displayMode="notes"
              fretCount={fretCount}
            />
          )

          const { container: degreesContainer } = render(
            <FretboardGrid
              selectedKey={selectedKey}
              displayMode="degrees"
              fretCount={fretCount}
            />
          )

          // Get note elements from both renders
          const notesElements = notesContainer.querySelectorAll('[title*="degree"]')
          const degreesElements = degreesContainer.querySelectorAll('[title*="degree"]')

          // Should have the same number of positions (same key, same fret count)
          expect(notesElements.length).toBe(degreesElements.length)

          for (let i = 0; i < notesElements.length; i++) {
            const notesTitle = notesElements[i].getAttribute('title') || ''
            const degreesTitle = degreesElements[i].getAttribute('title') || ''

            // Both should reference the same note and degree
            const notesMatch = notesTitle.match(/^([A-G]#?) \((\d+)[a-z]+ degree\) - Fret (\d+)/)
            const degreesMatch = degreesTitle.match(/^([A-G]#?) \((\d+)[a-z]+ degree\) - Fret (\d+)/)

            if (notesMatch && degreesMatch) {
              // Same note, degree, and fret
              expect(notesMatch[1]).toBe(degreesMatch[1]) // Note name
              expect(notesMatch[2]).toBe(degreesMatch[2]) // Scale degree
              expect(notesMatch[3]).toBe(degreesMatch[3]) // Fret number

              // But different display text
              const notesText = notesElements[i].textContent?.trim()
              const degreesText = degreesElements[i].textContent?.trim()

              expect(notesText).toBe(notesMatch[1]) // Should show note name
              expect(degreesText).toBe(notesMatch[2]) // Should show scale degree
            }
          }

          return true
        }
      ),
      { numRuns: 10 } // Reduce number of runs to prevent timeout
    )
  }, 15000)

  it('Property 1e: Fretboard positions match music theory calculations', () => {
    fc.assert(
      fc.property(
        testGenerators.musicalKey,
        testGenerators.displayMode,
        fc.integer({ min: 12, max: 24 }),
        (selectedKey: MusicalKey, displayMode: DisplayMode, fretCount: number) => {
          // Get expected positions from music theory calculations
          const expectedPositions = getFretboardPositions(selectedKey, fretCount)
          const scaleInfo = calculateMajorScale(selectedKey)

          // Render the fretboard
          const { container } = render(
            <FretboardGrid
              selectedKey={selectedKey}
              displayMode={displayMode}
              fretCount={fretCount}
            />
          )

          // Get all note position elements (look for elements with CSS class names)
          const noteElements = container.querySelectorAll('.note-marker, .open-string-marker')

          // Should have at least as many elements as expected positions
          // (might have more due to open strings)
          expect(noteElements.length).toBeGreaterThanOrEqual(expectedPositions.length)

          // Verify each displayed position has valid content
          for (const element of noteElements) {
            const displayText = element.textContent?.trim() || ''

            if (displayText) {
              if (displayMode === 'notes') {
                // Should be a valid note name
                expect(displayText).toMatch(/^[A-G]#?$/)
                // Should be in the scale
                expect(scaleInfo.notes.includes(displayText)).toBe(true)
              } else {
                // Should be a valid scale degree (1-7)
                expect(displayText).toMatch(/^[1-7]$/)
                const degree = parseInt(displayText)
                expect(degree).toBeGreaterThanOrEqual(1)
                expect(degree).toBeLessThanOrEqual(7)
              }
            }
          }

          return true
        }
      ),
      propertyTestConfig
    )
  })
})

  /**
   * Property 4: Color Consistency
   * For any scale degree or note displayed on the fretboard, all instances of the same degree
   * or note should use identical colors across the entire fretboard interface.
   *
   * Feature: guitar-fretboard-viewer, Property 4: Color Consistency
   * Validates: Requirements 3.6
   */
  it('Property 4: All instances of same scale degree use identical colors', () => {
    fc.assert(
      fc.property(
        testGenerators.musicalKey,
        testGenerators.displayMode,
        fc.integer({ min: 12, max: 15 }), // Reduced fret count for faster testing
        (selectedKey: MusicalKey, displayMode: DisplayMode, fretCount: number) => {
          // Render the fretboard
          const { container } = render(
            <FretboardGrid
              selectedKey={selectedKey}
              displayMode={displayMode}
              fretCount={fretCount}
            />
          )

          // Get all note position elements
          const noteElements = container.querySelectorAll('[title*="degree"]')

          // Group elements by their scale degree
          const elementsByDegree = new Map<number, HTMLElement[]>()

          for (const element of noteElements) {
            const titleAttr = element.getAttribute('title') || ''

            // Extract scale degree from title (format: "C (1st degree) - Fret 1")
            const degreeMatch = titleAttr.match(/\((\d+)[a-z]+ degree\)/)
            if (degreeMatch) {
              const scaleDegree = parseInt(degreeMatch[1])

              if (!elementsByDegree.has(scaleDegree)) {
                elementsByDegree.set(scaleDegree, [])
              }
              elementsByDegree.get(scaleDegree)!.push(element as HTMLElement)
            }
          }

          // Verify that all instances of the same scale degree use identical colors
          for (const [_scaleDegree, elements] of elementsByDegree) {
            if (elements.length > 1) {
              // Use backgroundColor style instead of CSS custom property
              const firstElementColor = (elements[0] as HTMLElement).style.backgroundColor

              for (let i = 1; i < elements.length; i++) {
                const currentElementColor = (elements[i] as HTMLElement).style.backgroundColor
                expect(currentElementColor).toBe(firstElementColor)
              }
            }
          }

          return true
        }
      ),
      {
        numRuns: 20, // Reduced from 100 for performance
        verbose: true,
        seed: 42,
        // Feature: guitar-fretboard-viewer, Property 4: Color Consistency
      }
    )
  }, 15000) // 15 second timeout

describe('FretboardGrid Display Consistency - Unit Tests', () => {
  it('should render fretboard with C major in notes mode', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={12}
      />
    )

    // Should find note elements by their CSS class names
    const noteElements = container.querySelectorAll('.note-marker, .open-string-marker')
    expect(noteElements.length).toBeGreaterThan(0)

    // Verify some expected notes are present in the DOM
    expect(container.textContent).toMatch(/[CDEFGAB]/)
  })

  it('should render fretboard with G major in degrees mode', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="G"
        displayMode="degrees"
        fretCount={12}
      />
    )

    // Should find degree elements by their CSS class names
    const degreeElements = container.querySelectorAll('.note-marker, .open-string-marker')
    expect(degreeElements.length).toBeGreaterThan(0)

    // Verify some expected degrees are present in the DOM
    expect(container.textContent).toMatch(/[1234567]/)
  })

  it('should handle edge case with minimal fret count', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={1}
      />
    )

    // Should still render without errors
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle edge case with maximum fret count', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="F#"
        displayMode="degrees"
        fretCount={24}
      />
    )

    // Should render without errors
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should apply responsive CSS variables correctly', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={12}
      />
    )

    // Find the main fretboard grid element
    const fretboardGrid = container.querySelector('[role="application"]')
    expect(fretboardGrid).toBeInTheDocument()

    // Verify that CSS variables are applied
    const computedStyle = window.getComputedStyle(fretboardGrid as Element)

    // Check that the grid template columns uses CSS variables
    const gridTemplateColumns = computedStyle.gridTemplateColumns
    expect(gridTemplateColumns).toContain('var(--fret-width)')
    expect(gridTemplateColumns).toContain('calc(var(--fret-count) + 1)')

    // Check that the grid template rows uses CSS variables
    const gridTemplateRows = computedStyle.gridTemplateRows
    expect(gridTemplateRows).toContain('var(--string-height)')
  })

  it('should have proper grid structure for responsive design', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={15}
      />
    )

    // Find the main fretboard grid element
    const fretboardGrid = container.querySelector('[role="application"]')
    expect(fretboardGrid).toBeInTheDocument()

    // Verify CSS Grid display
    const computedStyle = window.getComputedStyle(fretboardGrid as Element)
    expect(computedStyle.display).toBe('grid')

    // Verify overflow settings for horizontal scrolling
    expect(computedStyle.overflowX).toBe('auto')
    expect(computedStyle.overflowY).toBe('hidden')

    // Verify that fret count CSS variable is set correctly
    const fretCountVar = (fretboardGrid as HTMLElement).style.getPropertyValue('--fret-count')
    expect(fretCountVar).toBe('15')
  })

  it('should maintain grid structure with different fret counts', () => {
    const fretCounts = [12, 15, 18, 24]

    fretCounts.forEach(fretCount => {
      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={fretCount}
        />
      )

      const fretboardGrid = container.querySelector('[role="application"]')
      expect(fretboardGrid).toBeInTheDocument()

      // Verify fret count variable is set correctly
      const fretCountVar = (fretboardGrid as HTMLElement).style.getPropertyValue('--fret-count')
      expect(fretCountVar).toBe(fretCount.toString())

      // Verify grid structure is maintained
      const computedStyle = window.getComputedStyle(fretboardGrid as Element)
      expect(computedStyle.display).toBe('grid')
    })
  })
})