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
 * Marker wrapper styles - invisible container that fills entire grid cell
 */
const markerWrapperStyles = css`
  /* Grid positioning */
  grid-column: var(--note-column);
  grid-row: var(--string-row);
  z-index: 3; /* Marker wrapper layer - above strings and frets */

  /* Fill entire grid cell */
  width: 100%;
  height: 100%;

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
  }

  /* Future interaction support - hover state preparation */
  &:hover {
    /* Placeholder for future hover interactions */
  }

  /* Touch device optimization */
  @media (hover: none) and (pointer: coarse) {
    /* Ensure adequate touch target size */
    min-width: 44px;
    min-height: 44px;
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