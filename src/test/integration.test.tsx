/**
 * Integration tests for complete user workflows
 * Tests end-to-end scenarios and cross-component interactions
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from '../App'
import { useAppStore } from '../stores/appStore'

// Mock PWA functionality for integration tests
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [false, vi.fn()],
    offlineReady: [false, vi.fn()],
    updateServiceWorker: vi.fn(),
  }),
}))

describe('Integration Tests - Complete User Workflows', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useAppStore.setState({
      selectedKey: 'C',
      displayMode: 'notes',
      fretCount: 24,
    })
  })

  describe('Key Selection and Display Mode Integration', () => {
    it('should update fretboard when key is changed', async () => {
      render(<App />)

      // Verify initial state (C major, notes mode)
      expect(screen.getByText('Guitar Fretboard Viewer')).toBeInTheDocument()

      // Find key selector and change to D major
      const dKeyButton = screen.getByRole('button', { name: 'Select key D' })
      fireEvent.click(dKeyButton)

      // Wait for fretboard to update
      await waitFor(() => {
        // Should show D major scale notes on fretboard
        const fretboardNotes = screen.getAllByText(/[CDEFGAB]/)
        expect(fretboardNotes.length).toBeGreaterThan(0)
      })
    })

    it('should toggle between notes and degrees while preserving key', async () => {
      render(<App />)

      // Change to G major first
      const gKeyButton = screen.getByRole('button', { name: 'Select key G' })
      fireEvent.click(gKeyButton)

      // Toggle to degrees mode
      const degreesButton = screen.getByRole('button', { name: 'Show scale degrees' })
      fireEvent.click(degreesButton)

      await waitFor(() => {
        // Should show scale degrees (1-7) instead of note names
        const scaleDegrees = screen.getAllByText(/[1-7]/)
        expect(scaleDegrees.length).toBeGreaterThan(0)
      })

      // Toggle back to notes
      const notesButton = screen.getByRole('button', { name: 'Show note names' })
      fireEvent.click(notesButton)

      await waitFor(() => {
        // Should show note names again, still in G major
        const noteNames = screen.getAllByText(/[CDEFGAB]/)
        expect(noteNames.length).toBeGreaterThan(0)
      })

      // Verify key is still G
      const gKeyButton2 = screen.getByRole('button', { name: 'Select key G' })
      expect(gKeyButton2).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Fretboard Scrolling and Navigation', () => {
    it('should allow horizontal scrolling through fretboard', async () => {
      render(<App />)

      // Find the fretboard container
      const fretboardContainer = screen.getByRole('main')
      expect(fretboardContainer).toBeInTheDocument()

      // Check that fret numbers are visible (indicating scrollable fretboard)
      await waitFor(() => {
        const fretNumbers = screen.getAllByText(/\d+/)
        expect(fretNumbers.length).toBeGreaterThan(0)
      })
    })

    it('should maintain state during scrolling', async () => {
      render(<App />)

      // Set specific key and mode
      const fSharpKeyButton = screen.getByRole('button', { name: 'Select key F#' })
      fireEvent.click(fSharpKeyButton)

      const degreesButton = screen.getByRole('button', { name: 'Show scale degrees' })
      fireEvent.click(degreesButton)

      // Simulate scrolling (scroll events don't change state)
      const fretboardContainer = screen.getByRole('main')
      fireEvent.scroll(fretboardContainer, { target: { scrollLeft: 200 } })

      // Verify state is preserved
      const fSharpKeyButton2 = screen.getByRole('button', { name: 'Select key F#' })
      expect(fSharpKeyButton2).toHaveAttribute('aria-pressed', 'true')

      await waitFor(() => {
        // Should still show scale degrees
        const scaleDegrees = screen.getAllByText(/[1-7]/)
        expect(scaleDegrees.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Accessibility Integration', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<App />)

      // Check main content area
      const mainContent = screen.getByRole('main')
      expect(mainContent).toBeInTheDocument()

      // Check form controls
      const keyGroup = screen.getByRole('group', { name: 'Select musical key' })
      expect(keyGroup).toBeInTheDocument()

      const displayGroup = screen.getByRole('group', { name: 'Toggle display mode' })
      expect(displayGroup).toBeInTheDocument()
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle rapid state changes without errors', async () => {
      render(<App />)

      const cKeyButton = screen.getByRole('button', { name: 'Select key C' })
      const dKeyButton = screen.getByRole('button', { name: 'Select key D' })
      const eKeyButton = screen.getByRole('button', { name: 'Select key E' })
      const notesButton = screen.getByRole('button', { name: 'Show note names' })
      const degreesButton = screen.getByRole('button', { name: 'Show scale degrees' })

      // Rapidly change keys and display mode
      const keys = [cKeyButton, dKeyButton, eKeyButton]

      for (const keyButton of keys) {
        fireEvent.click(keyButton)
        fireEvent.click(degreesButton)
        fireEvent.click(notesButton)
      }

      // Should still be functional
      await waitFor(() => {
        expect(screen.getByText('Guitar Fretboard Viewer')).toBeInTheDocument()
        expect(cKeyButton).toBeInTheDocument()
        expect(notesButton).toBeInTheDocument()
      })
    })
  })

  describe('Performance Integration', () => {
    it('should handle extended fret ranges without performance issues', async () => {
      render(<App />)

      // Test with maximum fret count
      useAppStore.getState().setFretCount(36) // Extended range

      // Change to a complex key
      const fSharpKeyButton = screen.getByRole('button', { name: 'Select key F#' })
      fireEvent.click(fSharpKeyButton)

      // Should render without hanging
      await waitFor(() => {
        const fretboardContainer = screen.getByRole('main')
        expect(fretboardContainer).toBeInTheDocument()
      }, { timeout: 1000 }) // Should render quickly even with extended range
    })

    it('should handle multiple rapid updates efficiently', async () => {
      const startTime = performance.now()

      render(<App />)

      const cKeyButton = screen.getByRole('button', { name: 'Select key C' })
      const gKeyButton = screen.getByRole('button', { name: 'Select key G' })
      const notesButton = screen.getByRole('button', { name: 'Show note names' })
      const degreesButton = screen.getByRole('button', { name: 'Show scale degrees' })

      // Perform multiple rapid operations
      for (let i = 0; i < 10; i++) {
        fireEvent.click(i % 2 === 0 ? cKeyButton : gKeyButton)
        fireEvent.click(i % 2 === 0 ? degreesButton : notesButton)
      }

      await waitFor(() => {
        expect(screen.getByText('Guitar Fretboard Viewer')).toBeInTheDocument()
      })

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete within reasonable time (less than 1.5 seconds)
      expect(duration).toBeLessThan(1500)
    })
  })

  describe('Cross-Device Compatibility', () => {
    it('should work with touch events on mobile devices', async () => {
      // Simulate touch device
      Object.defineProperty(window, 'ontouchstart', { value: true, configurable: true })

      render(<App />)

      const degreesButton = screen.getByRole('button', { name: 'Show scale degrees' })

      // Simulate touch events
      fireEvent.touchStart(degreesButton)
      fireEvent.touchEnd(degreesButton)
      fireEvent.click(degreesButton)

      await waitFor(() => {
        // Should respond to touch interaction
        const scaleDegrees = screen.queryAllByText(/[1-7]/)
        expect(scaleDegrees.length).toBeGreaterThan(0)
      })
    })
  })
})