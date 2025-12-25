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
 * Unified note marker styles using CSS classes
 * This implements the CSS class-based styling system as required
 */
const noteMarkerBaseStyles = css`
  justify-self: center;
  align-self: center;
  z-index: 3; /* NOTE_MARKERS layer */

  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  /* Responsive sizing */
  @media (max-width: 1024px) {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    width: 26px;
    height: 26px;
    font-size: 11px;
  }
`

/**
 * Regular note marker styles (for fretted notes)
 */
const regularNoteMarkerStyles = css`
  ${noteMarkerBaseStyles}
  /* Grid positioning will be set via style prop */
`

/**
 * Open string marker styles (with sticky positioning)
 */
const openStringMarkerStyles = css`
  ${noteMarkerBaseStyles}
  grid-column: 1; /* Always in first column */
  position: sticky;
  left: 0;
  z-index: 5; /* OPEN_STRING_MARKERS layer - highest */
`

const NotePosition: React.FC<NotePositionProps> = ({
  position,
  displayMode
}) => {
  const { note, scaleDegree, fret, string } = position

  // Determine what to display based on display mode
  const displayText = displayMode === 'notes' ? note : scaleDegree?.toString() || ''

  // Get color based on scale degree
  const backgroundColor = scaleDegree ? getColorForScaleDegree(scaleDegree) : '#999999'

  // Determine if this is an open string marker
  const isOpenString = fret === 0

  // Calculate grid coordinates directly using the grid coordinate system
  const gridRow = string + 1 // Convert 0-based string index to 1-based grid row
  const gridColumn = isOpenString ? 1 : fret + 1 // Open string = column 1, frets = fret + 1

  // Create unified CSS class name for styling
  const markerClassName = isOpenString ? 'open-string-marker' : 'note-marker'

  return (
    <div
      css={isOpenString ? openStringMarkerStyles : regularNoteMarkerStyles}
      className={markerClassName}
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          // Could add audio playback or other interaction here
        }
      }}
    >
      {displayText}
    </div>
  )
}

export default NotePosition