import React, { useRef } from 'react'
import { css } from '@emotion/react'
import { MusicalKey, DisplayMode } from '../../types'
import { getFretboardPositions } from '../../utils/music/fretboard'
import { STANDARD_TUNING } from '../../utils/constants/music'
import MarkerWrapper from './MarkerWrapper'

interface FretboardGridProps {
  selectedKey: MusicalKey
  displayMode: DisplayMode
  fretCount: number
}

// CSS Grid responsive variables system
const responsiveGridVariables = css`
  /* Desktop default values */
  --fret-width: 80px;
  --string-height: 50px;

  /* Tablet (1024px and below) */
  @media (max-width: 1024px) {
    --fret-width: 70px;
    --string-height: 45px;
  }

  /* Mobile (768px and below) */
  @media (max-width: 768px) {
    --fret-width: 60px;
    --string-height: 40px;
  }

  /* Small mobile (480px and below) */
  @media (max-width: 480px) {
    --fret-width: 50px;
    --string-height: 35px;
  }
`

// Main CSS Grid container styles
const fretboardGridStyles = css`
  ${responsiveGridVariables}

  display: grid;
  grid-template-columns: repeat(calc(var(--fret-count) + 1), var(--fret-width));
  grid-template-rows: repeat(8, var(--string-height)); /* 6 strings + 2 placeholder rows */

  /* Key setting: prevent child elements from stretching */
  align-items: start;

  /* Scroll settings */
  overflow-x: auto;
  overflow-y: hidden;

  /* Fretboard background */
  background: linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #8B4513 100%);
  border: 2px solid #654321;
  border-radius: 8px;

  /* Touch-friendly scrolling */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Responsive border adjustment */
  @media (max-width: 768px) {
    border-width: 1px;
  }

  /* Scrollbar styles */
  &::-webkit-scrollbar {
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }

  @media (max-width: 768px) {
    &::-webkit-scrollbar {
      height: 8px;
    }
  }
`

// Fret line styles
const fretLineStyles = css`
  grid-row: 2 / 8; /* Span from row 2 (first string) to row 7 (last string) + 1 */
  z-index: 1;

  width: 3px;
  height: 100%; /* 确保品格线有明确的高度 */
  background: linear-gradient(to bottom, #FFD700, #FFA500, #FFD700);
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
  border-radius: 1.5px;
  justify-self: end; /* 品格线靠右对齐，位于品格的右边界 */
  position: relative;

  @media (max-width: 768px) {
    width: 2px;
    border-radius: 1px;
    box-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
  }

  @media (max-width: 480px) {
    width: 1.5px;
    border-radius: 0.75px;
    box-shadow: 0 0 3px rgba(255, 215, 0, 0.5);
  }

  /* Fret number display */
  &::before {
    content: attr(data-fret-number);
    position: absolute;
    top: calc(-1 * var(--string-height) / 2 - 0.5em);
    left: 50%;
    transform: translateX(-50%);

    /* Dynamic font size based on grid size */
    font-size: calc(var(--string-height) * 0.32);
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);

    /* Responsive font size adjustments */
    @media (max-width: 1024px) {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      font-size: 12px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
    }

    @media (max-width: 480px) {
      font-size: 10px;
      font-weight: 600;
    }
  }
`

// String line styles
const stringLineStyles = css`
  grid-column: 1 / -1; /* Span from first column to end */
  z-index: 2;

  height: var(--string-thickness);
  background: var(--string-gradient);
  border-radius: calc(var(--string-thickness) / 2);
  box-shadow: var(--string-shadow);
  align-self: center;

  /* Different string thicknesses and textures */
  &[data-string="0"], /* 1st string */
  &[data-string="1"], /* 2nd string */
  &[data-string="2"] { /* 3rd string */
    --string-thickness: 2px;
    --string-gradient: linear-gradient(to right, #F0F0F0, #D0D0D0, #F0F0F0);
    --string-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &[data-string="3"], /* 4th string */
  &[data-string="4"], /* 5th string */
  &[data-string="5"] { /* 6th string */
    --string-thickness: 4px;
    --string-gradient: repeating-linear-gradient(
      75deg,
      #A0826D 0px,
      #E8E8E8 0.8px,
      #F0F0F0 1.6px,
      #E8E8E8 2.4px,
      #A0826D 3.2px
    );
    --string-shadow: 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
  }
`

// Container styles
const fretboardContainer = css`
  position: relative;
  width: 100%;
`

const FretboardGrid: React.FC<FretboardGridProps> = ({
  selectedKey,
  displayMode,
  fretCount
}) => {
  const fretboardRef = useRef<HTMLDivElement>(null)

  // Get all fret positions for the selected key
  const fretPositions = React.useMemo(() => getFretboardPositions(selectedKey, fretCount), [selectedKey, fretCount])

  // Keyboard navigation with CSS variable-based scroll calculation
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    const target = e.currentTarget as HTMLElement
    if (!target) return

    // Use CSS variable value for consistent scrolling
    const computedStyle = getComputedStyle(target)
    const fretWidth = parseInt(computedStyle.getPropertyValue('--fret-width')) || 80

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        target.scrollLeft = Math.max(0, target.scrollLeft - fretWidth)
        break
      case 'ArrowRight':
        e.preventDefault()
        target.scrollLeft = Math.min(
          target.scrollWidth - target.clientWidth,
          target.scrollLeft + fretWidth
        )
        break
      case 'Home':
        e.preventDefault()
        target.scrollLeft = 0
        break
      case 'End':
        e.preventDefault()
        target.scrollLeft = target.scrollWidth - target.clientWidth
        break
    }
  }, [])

  return (
    <div css={fretboardContainer}>
      {/* Main fretboard grid */}
      <div
        ref={fretboardRef}
        css={fretboardGridStyles}
        style={{
          '--fret-count': fretCount,
        } as React.CSSProperties}
        role="application"
        aria-label={`Guitar fretboard showing ${selectedKey} major scale in ${displayMode} mode`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-describedby="fretboard-instructions"
      >
        {/* Fret lines (starting from fret 0) */}
        {Array.from({ length: fretCount + 1 }, (_, fret) => (
          <div
            key={`fret-${fret}`}
            css={fretLineStyles}
            style={{ gridColumn: fret + 1 } as React.CSSProperties} // fret 0 = column 1, fret 1 = column 2, etc.
            data-fret-number={fret}
            role="presentation"
            aria-hidden="true"
          />
        ))}

        {/* String lines */}
        {STANDARD_TUNING.map((_, stringIndex) => (
          <div
            key={`string-${stringIndex}`}
            css={stringLineStyles}
            data-string={stringIndex}
            style={{ gridRow: stringIndex + 2 } as React.CSSProperties} /* stringIndex + 2 for 8-row system with placeholder */
            role="presentation"
            aria-hidden="true"
          />
        ))}

        {/* Note markers with wrapper elements */}
        {fretPositions.map(position => (
          <MarkerWrapper
            key={`note-${position.string}-${position.fret}`}
            position={position}
            displayMode={displayMode}
          />
        ))}
      </div>

      {/* Screen reader instructions */}
      <div
        id="fretboard-instructions"
        className="sr-only"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        Use arrow keys to scroll the fretboard. Press Home to go to the beginning, End to go to the end.
        Tab through note positions to hear their details.
      </div>
    </div>
  )
}

export default FretboardGrid