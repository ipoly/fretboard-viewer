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
 * Enhanced note marker base styles using CSS variables for responsive design
 * No longer handles grid positioning - that's handled by MarkerWrapper
 */
const noteMarkerBaseStyles = css`
  /* Size calculation using CSS variables with responsive ratios */
  width: calc(var(--string-height) * var(--marker-size-ratio, 0.64));
  height: calc(var(--string-height) * var(--marker-size-ratio, 0.64));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: calc(var(--string-height) * var(--font-size-ratio, 0.28));
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  /* Minimum usable size for accessibility */
  min-width: 20px;
  min-height: 20px;

  /* Responsive size adjustments with fallback values */
  @media (max-width: 1199px) {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  @media (max-width: 1023px) {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }

  @media (max-width: 767px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 639px) {
    width: 27px;
    height: 27px;
    font-size: 12px;
    min-width: 27px;
    min-height: 27px;
  }

  @media (max-width: 479px) {
    width: 26px;
    height: 26px;
    font-size: 11px;
    min-width: 26px;
    min-height: 26px;
  }

  @media (max-width: 359px) {
    width: 25px;
    height: 25px;
    font-size: 10px;
    min-width: 25px;
    min-height: 25px;
    font-weight: 600;
  }

  /* Enhanced touch device optimization */
  @media (hover: none) and (pointer: coarse) {
    /* Ensure minimum touch target size */
    min-width: 28px;
    min-height: 28px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);

    /* Better touch feedback */
    &:active {
      transform: scale(0.95);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    }
  }

  /* Ultra-wide screen optimization */
  @media (min-width: 2560px) {
    width: calc(var(--string-height) * 0.60);
    height: calc(var(--string-height) * 0.60);
    font-size: calc(var(--string-height) * 0.26);
    max-width: 48px;
    max-height: 48px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border: 2px solid currentColor;
    text-shadow: none;
    font-weight: bold;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    &:active {
      transform: none;
    }
  }

  /* Focus styles for keyboard navigation */
  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;

    @media (max-width: 767px) {
      outline-width: 1px;
      outline-offset: 1px;
    }
  }
`

/**
 * Unified note marker styles for all fret positions (including open strings)
 * Grid positioning is now handled by MarkerWrapper
 *
 * OPTIMIZATION: Removed separate styling for open string vs fretted markers
 * as they are functionally identical and use the same grid positioning system.
 */
const noteMarkerStyles = css`
  ${noteMarkerBaseStyles}
  z-index: 4; /* GridLayers.NOTE_MARKERS - highest layer within wrapper */
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

  // Determine if this is an open string marker (for accessibility labeling only)
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
      css={noteMarkerStyles}
      className="note-marker" // Unified class name for all markers
      style={{
        backgroundColor
      } as React.CSSProperties}
      data-string={string}
      data-fret={fret}
      data-scale-degree={scaleDegree}
      data-note={note}
      data-layer="note-markers"
      data-is-open-string={isOpenString} // Data attribute for styling/testing if needed
      role="button"
      tabIndex={0}
      aria-label={`${note} (${scaleDegree}${scaleDegree === 1 ? 'st' : scaleDegree === 2 ? 'nd' : scaleDegree === 3 ? 'rd' : 'th'} degree) on ${isOpenString ? 'open string' : `fret ${fret}`}`}
      title={`${note} (${scaleDegree}${scaleDegree === 1 ? 'st' : scaleDegree === 2 ? 'nd' : scaleDegree === 3 ? 'rd' : 'th'} degree) - ${isOpenString ? 'Open string' : `Fret ${fret}`}`}
      onKeyDown={handleKeyDown}
    >
      {displayText}
    </div>
  )
})

export default NotePosition