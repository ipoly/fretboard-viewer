import React from 'react'
import { FretPosition, DisplayMode } from '../../types'
import { SCALE_DEGREE_COLORS } from '../../utils/constants/music'
import { css } from '@emotion/react'

interface NotePositionProps {
  position: FretPosition
  displayMode: DisplayMode
}

/**
 * Get the color for a scale degree
 */
function getColorForScaleDegree(degree: number): string {
  return SCALE_DEGREE_COLORS[degree as keyof typeof SCALE_DEGREE_COLORS] || '#999999'
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
 * Note marker base styles using CSS variables for responsive design
 */
const noteMarkerBaseStyles = css`
  justify-self: center;
  align-self: center;

  /* Size calculation using CSS variables */
  width: calc(var(--string-height) * 0.64);
  height: calc(var(--string-height) * 0.64);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: calc(var(--string-height) * 0.28);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  /* Minimum usable size */
  min-width: 20px;
  min-height: 20px;

  /* Responsive size adjustments */
  @media (max-width: 1024px) {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 10px;
    min-width: 24px;
    min-height: 24px;
  }

  /* Touch device optimization */
  @media (hover: none) and (pointer: coarse) {
    min-width: 28px;
    min-height: 28px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
  }
`

/**
 * Regular note marker styles (for fretted notes)
 */
const regularNoteMarkerStyles = css`
  ${noteMarkerBaseStyles}
  z-index: 4; /* Note markers layer */
`

/**
 * Open string marker styles (with sticky positioning)
 */
const openStringMarkerStyles = css`
  ${noteMarkerBaseStyles}
  grid-column: 1; /* Always in first column */
  position: sticky;
  left: 0;
  z-index: 6; /* Open string markers - highest layer */
`

const NotePosition: React.FC<NotePositionProps> = React.memo(({
  position,
  displayMode
}) => {
  const { note, scaleDegree, fret, string } = position

  // Memoize display text calculation
  const displayText = React.useMemo(() =>
    displayMode === 'notes' ? note : scaleDegree?.toString() || '',
    [displayMode, note, scaleDegree]
  )

  // Memoize color calculation
  const backgroundColor = React.useMemo(() =>
    scaleDegree ? getColorForScaleDegree(scaleDegree) : '#999999',
    [scaleDegree]
  )

  // Determine if this is an open string marker
  const isOpenString = fret === 0

  // Calculate grid coordinates using simple mapping functions
  const gridRow = stringToGridRow(string) // string 0 -> row 1, string 1 -> row 2, etc.
  const gridColumn = fretToGridColumn(fret) // fret 0 -> column 1, fret 1 -> column 2, etc.

  // Memoize keyboard handler
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      // Could add audio playback or other interaction here
    }
  }, [])

  return (
    <div
      css={isOpenString ? openStringMarkerStyles : regularNoteMarkerStyles}
      className={isOpenString ? 'open-string-marker' : 'note-marker'}
      style={{
        gridRow,
        gridColumn: isOpenString ? undefined : gridColumn, // Open string uses CSS grid-column: 1
        backgroundColor
      } as React.CSSProperties}
      data-string={string}
      data-fret={fret}
      data-scale-degree={scaleDegree}
      data-note={note}
      role="button"
      tabIndex={0}
      aria-label={`${note} (${scaleDegree}${scaleDegree === 1 ? 'st' : scaleDegree === 2 ? 'nd' : scaleDegree === 3 ? 'rd' : 'th'} degree) on fret ${fret}`}
      title={`${note} (${scaleDegree}${scaleDegree === 1 ? 'st' : scaleDegree === 2 ? 'nd' : scaleDegree === 3 ? 'rd' : 'th'} degree) - Fret ${fret}`}
      onKeyDown={handleKeyDown}
    >
      {displayText}
    </div>
  )
})

export default NotePosition