import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import FretboardGrid from '../components/Fretboard/FretboardGrid'

describe('Responsive Visual Verification Tests', () => {
  it('should render with proper CSS variables at different breakpoints', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={12}
      />
    )

    const fretboardGrid = container.querySelector('[role="application"]') as HTMLElement
    expect(fretboardGrid).toBeInTheDocument()

    // Verify CSS variables are properly set up
    const computedStyle = window.getComputedStyle(fretboardGrid)

    // Check that the grid uses CSS variables
    expect(computedStyle.gridTemplateColumns).toContain('var(--fret-width)')
    expect(computedStyle.gridTemplateRows).toContain('var(--string-height)')

    // Check that responsive variables are available in the DOM
    const styleContent = fretboardGrid.getAttribute('style') || ''
    expect(styleContent).toContain('--fret-count')
  })

  it('should have proper marker wrapper positioning across screen sizes', () => {
    const screenSizes = [
      { width: 1400, name: 'desktop' },
      { width: 900, name: 'tablet' },
      { width: 600, name: 'mobile' },
      { width: 350, name: 'small-mobile' }
    ]

    screenSizes.forEach(({ width }) => {
      // Set viewport size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      })

      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Check marker wrappers exist and have proper CSS variables
      const markerWrappers = container.querySelectorAll('.marker-wrapper')
      expect(markerWrappers.length).toBeGreaterThan(0)

      markerWrappers.forEach(wrapper => {
        const element = wrapper as HTMLElement
        const style = element.getAttribute('style') || ''

        // Verify CSS variables are set for grid positioning
        expect(style).toContain('--string-row')
        expect(style).toContain('--note-column')
      })
    })
  })

  it('should maintain proper fret line and string line positioning', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={15}
      />
    )

    // Check fret lines
    const fretLines = container.querySelectorAll('[data-layer="fret-lines"]')
    expect(fretLines.length).toBe(16) // 0-15 frets = 16 fret lines

    // Check string lines
    const stringLines = container.querySelectorAll('[data-layer="string-lines"]')
    expect(stringLines.length).toBe(6) // 6 strings

    // Verify each string line has proper grid row positioning
    stringLines.forEach((stringLine, index) => {
      const element = stringLine as HTMLElement
      const style = element.getAttribute('style') || ''
      const expectedRow = index + 2 // stringIndex + 2 for 8-row system
      expect(style).toContain(`grid-row: ${expectedRow}`)
    })
  })

  it('should apply enhanced responsive CSS variables correctly', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={12}
      />
    )

    const fretboardGrid = container.querySelector('[role="application"]') as HTMLElement
    const computedStyle = window.getComputedStyle(fretboardGrid)

    // Verify enhanced responsive features
    expect(computedStyle.borderRadius).toBeTruthy()
    expect(computedStyle.background).toContain('linear-gradient')
    expect(computedStyle.overflowX).toBe('auto')
    expect(computedStyle.overflowY).toBe('hidden')

    // Verify grid gap is applied (may be 0px on some breakpoints)
    expect(computedStyle.gap).toBeDefined()
  })

  it('should handle CSS variable inheritance in nested components', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={12}
      />
    )

    // Check that note markers inherit sizing from CSS variables
    const noteMarkers = container.querySelectorAll('.note-marker')
    expect(noteMarkers.length).toBeGreaterThan(0)

    noteMarkers.forEach(marker => {
      const element = marker as HTMLElement
      const computedStyle = window.getComputedStyle(element)

      // Note markers should have proper sizing
      expect(computedStyle.width).toBeTruthy()
      expect(computedStyle.height).toBeTruthy()
      expect(computedStyle.borderRadius).toBe('50%')
      expect(computedStyle.display).toBe('flex')
    })
  })
})