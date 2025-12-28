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

// Grid positioning is now handled by MarkerWrapper component

/**
 * Note marker base styles using CSS variables for responsive design
 * No longer handles grid positioning - that's handled by MarkerWrapper
 */
const noteMarkerBaseStyles = css`
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
 * Grid positioning is now handled by MarkerWrapper
 */
const regularNoteMarkerStyles = css`
  ${noteMarkerBaseStyles}
  z-index: 4; /* Note markers layer - highest within wrapper */
`

/**
 * Open string marker styles
 * Grid positioning is now handled by MarkerWrapper
 */
const openStringMarkerStyles = css`
  ${noteMarkerBaseStyles}
  z-index: 4; /* Note markers layer - same as regular markers within wrapper */
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