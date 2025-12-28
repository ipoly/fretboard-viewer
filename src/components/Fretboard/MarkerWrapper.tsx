import React from 'react'
import { css } from '@emotion/react'
import { FretPosition, DisplayMode } from '../../types'
import NotePosition from './NotePosition'

interface MarkerWrapperProps {
  position: FretPosition
  displayMode: DisplayMode
}

/**
 * Convert string index to grid row position
 * 8-row system: string 0 -> row 2, string 1 -> row 3, etc. (row 1 is top placeholder, row 8 is bottom placeholder)
 */
function stringToGridRow(stringIndex: number): number {
  return stringIndex + 2 // 0-based string index -> 1-based grid row + 1 for top placeholder row
}

/**
 * Convert fret number to grid column position
 * Simple 1-based grid system: fret 0 -> column 1, fret 1 -> column 2, etc.
 */
function fretToGridColumn(fretNumber: number): number {
  return fretNumber + 1
}

/**
 * Enhanced marker wrapper styles - invisible container that fills entire grid cell
 * with improved responsive design and touch optimization
 */
const markerWrapperStyles = css`
  /* Grid positioning */
  grid-column: var(--note-column);
  grid-row: var(--string-row);
  z-index: 3; /* GridLayers.MARKER_WRAPPER - above strings and frets */

  /* Fill entire grid cell - critical for proper interaction area */
  width: 100%;
  height: 100%;
  min-width: 0; /* Prevent overflow on small screens */
  min-height: 0;

  /* Center the note marker within the wrapper */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Invisible container - no visual impact */
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;

  /* Position relative for future interaction features */
  position: relative;

  /* Ensure wrapper doesn't interfere with scrolling */
  pointer-events: auto;

  /* Accessibility - make wrapper focusable for keyboard navigation */
  &:focus-within {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
    border-radius: 4px;

    /* Responsive outline adjustments */
    @media (max-width: 767px) {
      outline-width: 1px;
      outline-offset: 1px;
      border-radius: 2px;
    }
  }

  /* Future interaction support - hover state preparation */
  &:hover {
    /* Placeholder for future hover interactions */
  }

  /* Enhanced touch device optimization */
  @media (hover: none) and (pointer: coarse) {
    /* Ensure adequate touch target size while maintaining grid cell filling */
    min-width: calc(var(--fret-width) * 0.8);
    min-height: calc(var(--string-height) * 0.8);

    /* Ensure wrapper still fills the cell completely */
    width: 100%;
    height: 100%;

    /* Add subtle touch feedback area */
    &:active {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }
  }

  /* Extra small screen optimizations */
  @media (max-width: 359px) {
    /* Maintain minimum touch target while filling grid cell */
    min-width: 44px;
    min-height: 32px;

    /* Ensure complete cell filling */
    width: 100%;
    height: 100%;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    &:focus-within {
      outline: 2px solid currentColor;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    &:focus-within {
      transition: none;
    }
  }
`

/**
 * MarkerWrapper component - wraps note markers in an invisible container
 * that fills the entire grid cell and provides interaction area
 *
 * UNIFIED PROCESSING: All fret positions (including open strings at fret 0)
 * use the same grid coordinate mapping and wrapper system for consistency.
 */
const MarkerWrapper: React.FC<MarkerWrapperProps> = React.memo(({
  position,
  displayMode
}) => {
  const { string, fret } = position

  // Calculate grid coordinates using simple mapping functions
  const gridRow = stringToGridRow(string)
  const gridColumn = fretToGridColumn(fret)

  return (
    <div
      css={markerWrapperStyles}
      className="marker-wrapper"
      data-string={string}
      data-fret={fret}
      data-layer="marker-wrapper"
      style={{
        '--string-row': gridRow,
        '--note-column': gridColumn
      } as React.CSSProperties}
      role="gridcell"
      aria-label={`Fret ${fret}, String ${string + 1}`}
    >
      {/* Note marker centered within wrapper */}
      <NotePosition
        position={position}
        displayMode={displayMode}
      />
    </div>
  )
})

MarkerWrapper.displayName = 'MarkerWrapper'

export default MarkerWrapper