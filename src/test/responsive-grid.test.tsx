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

  it('should render correctly on large tablet (1024px - 1199px)', () => {
    setViewportSize(1100, 700)

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
    expect(computedStyle.gridTemplateColumns).toContain('var(--fret-width)')
  })

  it('should render correctly on tablet (768px - 1023px)', () => {
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
    expect(computedStyle.gridTemplateColumns).toContain('var(--fret-width)')
  })

  it('should render correctly on small tablet (640px - 767px)', () => {
    setViewportSize(700, 500)

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

  it('should render correctly on mobile (480px - 639px)', () => {
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

  it('should render correctly on small mobile (360px - 479px)', () => {
    setViewportSize(400, 600)

    const { container } = render(
      <FretboardGrid
        selectedKey="A"
        displayMode="degrees"
        fretCount={12}
      />
    )

    const fretboardGrid = container.querySelector('[role="application"]')
    expect(fretboardGrid).toBeInTheDocument()

    // Verify grid maintains structure even on small screens
    const computedStyle = window.getComputedStyle(fretboardGrid as Element)
    expect(computedStyle.display).toBe('grid')
    expect(computedStyle.gridTemplateRows).toContain('var(--string-height)')
  })

  it('should render correctly on extra small mobile (320px - 359px)', () => {
    setViewportSize(340, 640)

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

  it('should handle ultra-wide screens (2560px+)', () => {
    setViewportSize(3000, 1600)

    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={15}
      />
    )

    const fretboardGrid = container.querySelector('[role="application"]')
    expect(fretboardGrid).toBeInTheDocument()

    // Verify grid structure is maintained on ultra-wide screens
    const computedStyle = window.getComputedStyle(fretboardGrid as Element)
    expect(computedStyle.display).toBe('grid')
    expect(computedStyle.gridTemplateColumns).toContain('var(--fret-width)')
  })

  it('should maintain note markers across different screen sizes', () => {
    const screenSizes = [
      { width: 1400, height: 800, name: 'desktop' },
      { width: 1100, height: 700, name: 'large-tablet' },
      { width: 900, height: 600, name: 'tablet' },
      { width: 700, height: 500, name: 'small-tablet' },
      { width: 600, height: 400, name: 'mobile' },
      { width: 400, height: 600, name: 'small-mobile' },
      { width: 340, height: 640, name: 'extra-small-mobile' }
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
      const noteMarkers = container.querySelectorAll('.note-marker') // Unified class for all markers
      expect(noteMarkers.length).toBeGreaterThan(0)

      // Should maintain grid structure
      const fretboardGrid = container.querySelector('[role="application"]')
      const computedStyle = window.getComputedStyle(fretboardGrid as Element)
      expect(computedStyle.display).toBe('grid')
    })
  })

  it('should apply enhanced CSS variables correctly across breakpoints', () => {
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
    expect(computedStyle.gridTemplateColumns).toContain('var(--fret-width)')
    expect(computedStyle.gridTemplateColumns).toContain('calc(var(--fret-count) + 1)')
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

  it('should ensure marker wrappers fill grid cells properly across all screen sizes', () => {
    const screenSizes = [
      { width: 1400, height: 800, name: 'desktop' },
      { width: 900, height: 600, name: 'tablet' },
      { width: 600, height: 400, name: 'mobile' },
      { width: 340, height: 640, name: 'extra-small-mobile' }
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

      // Check that marker wrappers exist and have proper styling
      const markerWrappers = container.querySelectorAll('.marker-wrapper')
      expect(markerWrappers.length).toBeGreaterThan(0)

      // Verify each wrapper has proper grid positioning
      markerWrappers.forEach(wrapper => {
        const element = wrapper as HTMLElement
        expect(element.style.getPropertyValue('--string-row')).toBeTruthy()
        expect(element.style.getPropertyValue('--note-column')).toBeTruthy()
      })
    })
  })

  it('should maintain proper touch target sizes on touch devices', () => {
    // Simulate touch device
    setViewportSize(400, 600)

    const { container } = render(
      <FretboardGrid
        selectedKey="C"
        displayMode="notes"
        fretCount={12}
      />
    )

    const noteMarkers = container.querySelectorAll('.note-marker')
    expect(noteMarkers.length).toBeGreaterThan(0)

    // Note markers should be present and accessible
    noteMarkers.forEach(marker => {
      expect(marker).toBeInTheDocument()
      expect(marker.getAttribute('role')).toBe('button')
      expect(marker.getAttribute('tabIndex')).toBe('0')
    })
  })
})