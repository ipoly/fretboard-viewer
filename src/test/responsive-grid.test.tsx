import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import FretboardGrid from '../components/Fretboard/FretboardGrid'

describe('Responsive Grid Adaptation Tests', () => {
  // Store original window dimensions
  let originalInnerWidth: number
  let originalInnerHeight: number

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
    originalInnerHeight = window.innerHeight
  })

  afterEach(() => {
    // Restore original dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    })
  })

  const setViewportSize = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    })
  }

  it('should render correctly on desktop (1200px+)', () => {
    setViewportSize(1400, 800)

    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={15}
      />
    )

    const fretboardGrid = container.querySelector('[role="application"]')
    expect(fretboardGrid).toBeInTheDocument()

    // Verify CSS Grid is applied
    const computedStyle = window.getComputedStyle(fretboardGrid as Element)
    expect(computedStyle.display).toBe('grid')
    expect(computedStyle.overflowX).toBe('auto')
  })

  it('should render correctly on tablet (768px - 1024px)', () => {
    setViewportSize(900, 600)

    const { container } = render(
      <FretboardGrid
        selectedKey="G"
        displayMode="degrees"
        fretCount={12}
      />
    )

    const fretboardGrid = container.querySelector('[role="application"]')
    expect(fretboardGrid).toBeInTheDocument()

    // Verify grid structure is maintained
    const computedStyle = window.getComputedStyle(fretboardGrid as Element)
    expect(computedStyle.display).toBe('grid')
    expect(computedStyle.gridTemplateColumns).toContain('var(--open-string-width)')
  })

  it('should render correctly on mobile (480px - 768px)', () => {
    setViewportSize(600, 400)

    const { container } = render(
      <FretboardGrid
        selectedKey="D"
        displayMode="notes"
        fretCount={12}
      />
    )

    const fretboardGrid = container.querySelector('[role="application"]')
    expect(fretboardGrid).toBeInTheDocument()

    // Verify responsive grid structure
    const computedStyle = window.getComputedStyle(fretboardGrid as Element)
    expect(computedStyle.display).toBe('grid')
    expect(computedStyle.overflowX).toBe('auto')
  })

  it('should render correctly on small mobile (360px)', () => {
    setViewportSize(360, 640)

    const { container } = render(
      <FretboardGrid
        selectedKey="A"
        displayMode="degrees"
        fretCount={12}
      />
    )

    const fretboardGrid = container.querySelector('[role="application"]')
    expect(fretboardGrid).toBeInTheDocument()

    // Verify grid maintains structure even on very small screens
    const computedStyle = window.getComputedStyle(fretboardGrid as Element)
    expect(computedStyle.display).toBe('grid')
    expect(computedStyle.gridTemplateRows).toContain('var(--string-height)')
  })

  it('should maintain note markers across different screen sizes', () => {
    const screenSizes = [
      { width: 1400, height: 800, name: 'desktop' },
      { width: 900, height: 600, name: 'tablet' },
      { width: 600, height: 400, name: 'mobile' },
      { width: 360, height: 640, name: 'small-mobile' }
    ]

    screenSizes.forEach(({ width, height }) => {
      setViewportSize(width, height)

      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={12}
        />
      )

      // Should have note markers regardless of screen size
      const noteMarkers = container.querySelectorAll('.note-marker, .open-string-marker')
      expect(noteMarkers.length).toBeGreaterThan(0)

      // Should maintain grid structure
      const fretboardGrid = container.querySelector('[role="application"]')
      const computedStyle = window.getComputedStyle(fretboardGrid as Element)
      expect(computedStyle.display).toBe('grid')
    })
  })

  it('should apply CSS variables correctly across breakpoints', () => {
    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={12}
      />
    )

    const fretboardGrid = container.querySelector('[role="application"]')
    expect(fretboardGrid).toBeInTheDocument()

    // Verify that the responsive CSS variables are included in the styles
    const computedStyle = window.getComputedStyle(fretboardGrid as Element)

    // Check that grid template uses CSS variables
    expect(computedStyle.gridTemplateColumns).toContain('var(--open-string-width)')
    expect(computedStyle.gridTemplateColumns).toContain('var(--fret-width)')
    expect(computedStyle.gridTemplateRows).toContain('var(--string-height)')
  })

  it('should handle fret count changes responsively', () => {
    const fretCounts = [12, 15, 18, 24]

    fretCounts.forEach(fretCount => {
      setViewportSize(800, 600) // Tablet size

      const { container } = render(
        <FretboardGrid
          selectedKey="C"
          displayMode="notes"
          fretCount={fretCount}
        />
      )

      const fretboardGrid = container.querySelector('[role="application"]')
      expect(fretboardGrid).toBeInTheDocument()

      // Verify fret count is set correctly
      const fretCountVar = (fretboardGrid as HTMLElement).style.getPropertyValue('--fret-count')
      expect(fretCountVar).toBe(fretCount.toString())

      // Verify grid structure is maintained
      const computedStyle = window.getComputedStyle(fretboardGrid as Element)
      expect(computedStyle.display).toBe('grid')
    })
  })
})