import React, { useRef } from 'react'
import { css } from '@emotion/react'
import { MusicalKey, DisplayMode } from '../../types'
import { getFretboardPositions } from '../../utils/music/fretboard'
import { STANDARD_TUNING } from '../../utils/constants/music'
import MarkerWrapper from './MarkerWrapper'
import { useLayerManagement } from '../../utils/grid/useLayerManagement'

interface FretboardGridProps {
  selectedKey: MusicalKey
  displayMode: DisplayMode
  fretCount: number
}

// Enhanced CSS Grid responsive variables system with comprehensive breakpoints
const responsiveGridVariables = css`
  /* Desktop default values (1200px+) */
  --fret-width: 80px;
  --string-height: 50px;
  --grid-gap: 2px;
  --border-radius: 8px;
  --scrollbar-height: 12px;
  --marker-size-ratio: 0.64; /* Marker size as ratio of string height */
  --font-size-ratio: 0.28; /* Font size as ratio of string height */

  /* Large tablet (1024px - 1199px) */
  @media (max-width: 1199px) {
    --fret-width: 75px;
    --string-height: 47px;
    --grid-gap: 1px;
    --scrollbar-height: 11px;
  }

  /* Tablet (768px - 1023px) */
  @media (max-width: 1023px) {
    --fret-width: 70px;
    --string-height: 45px;
    --grid-gap: 1px;
    --border-radius: 6px;
    --scrollbar-height: 10px;
  }

  /* Small tablet (640px - 767px) */
  @media (max-width: 767px) {
    --fret-width: 65px;
    --string-height: 42px;
    --grid-gap: 0px;
    --border-radius: 5px;
    --scrollbar-height: 9px;
  }

  /* Mobile (480px - 639px) */
  @media (max-width: 639px) {
    --fret-width: 60px;
    --string-height: 40px;
    --grid-gap: 0px;
    --border-radius: 4px;
    --scrollbar-height: 8px;
    --marker-size-ratio: 0.68; /* Slightly larger markers on mobile for touch */
    --font-size-ratio: 0.30;
  }

  /* Small mobile (360px - 479px) */
  @media (max-width: 479px) {
    --fret-width: 55px;
    --string-height: 38px;
    --grid-gap: 0px;
    --border-radius: 3px;
    --scrollbar-height: 6px;
    --marker-size-ratio: 0.70; /* Even larger markers for small screens */
    --font-size-ratio: 0.32;
  }

  /* Extra small mobile (320px - 359px) */
  @media (max-width: 359px) {
    --fret-width: 50px;
    --string-height: 35px;
    --grid-gap: 0px;
    --border-radius: 2px;
    --scrollbar-height: 5px;
    --marker-size-ratio: 0.72; /* Maximum marker size for tiny screens */
    --font-size-ratio: 0.34;
  }

  /* Ultra-wide screens (2560px+) - prevent excessive scaling */
  @media (min-width: 2560px) {
    --fret-width: 100px;
    --string-height: 60px;
    --grid-gap: 3px;
    --border-radius: 12px;
    --scrollbar-height: 16px;
    --marker-size-ratio: 0.60; /* Smaller ratio for large screens */
    --font-size-ratio: 0.26;
  }
`

// Main CSS Grid container styles with enhanced responsive design
const fretboardGridStyles = css`
  ${responsiveGridVariables}

  display: grid;
  grid-template-columns: repeat(calc(var(--fret-count) + 1), var(--fret-width));
  grid-template-rows: repeat(8, var(--string-height)); /* 6 strings + 2 placeholder rows */
  gap: var(--grid-gap, 0px);

  /* Key setting: prevent child elements from stretching */
  align-items: start;

  /* Scroll settings */
  overflow-x: auto;
  overflow-y: hidden;

  /* Fretboard background */
  background: linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #8B4513 100%);
  border: 2px solid #654321;
  border-radius: var(--border-radius, 8px);

  /* Touch-friendly scrolling */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Responsive border adjustment */
  @media (max-width: 767px) {
    border-width: 1px;
  }

  @media (max-width: 359px) {
    border-width: 1px;
    border-radius: 2px;
  }

  /* Enhanced scrollbar styles with CSS variables */
  &::-webkit-scrollbar {
    height: var(--scrollbar-height, 12px);
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: calc(var(--scrollbar-height, 12px) / 2);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: calc(var(--scrollbar-height, 12px) / 2);
    border: 1px solid rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x proximity;

    /* Larger scrollbar for touch devices */
    &::-webkit-scrollbar {
      height: calc(var(--scrollbar-height, 12px) + 4px);
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.4);

      &:active {
        background: rgba(255, 255, 255, 0.6);
      }
    }
  }

  /* Prevent horizontal overflow on very small screens */
  @media (max-width: 359px) {
    min-width: 0;
    max-width: 100vw;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border-color: currentColor;
    background: linear-gradient(to bottom, #654321 0%, #8B4513 50%, #654321 100%);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`

// Enhanced fret line styles with improved responsive design
const fretLineStyles = css`
  grid-row: 2 / 8; /* Span from row 2 (first string) to row 7 (last string) + 1 */
  z-index: 1; /* GridLayers.FRET_LINES */

  width: 3px;
  height: 100%; /* 确保品格线有明确的高度 */
  background: linear-gradient(to bottom, #FFD700, #FFA500, #FFD700);
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
  border-radius: 1.5px;
  justify-self: end; /* 品格线靠右对齐，位于品格的右边界 */
  position: relative;

  /* Responsive fret line width */
  @media (max-width: 1023px) {
    width: 2.5px;
    border-radius: 1.25px;
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.6);
  }

  @media (max-width: 767px) {
    width: 2px;
    border-radius: 1px;
    box-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
  }

  @media (max-width: 479px) {
    width: 1.5px;
    border-radius: 0.75px;
    box-shadow: 0 0 3px rgba(255, 215, 0, 0.5);
  }

  @media (max-width: 359px) {
    width: 1px;
    border-radius: 0.5px;
    box-shadow: 0 0 2px rgba(255, 215, 0, 0.5);
  }

  /* Enhanced fret number display with CSS variables */
  &::before {
    content: attr(data-fret-number);
    position: absolute;
    top: calc(-1 * var(--string-height) / 2 - 0.5em);
    left: 50%;
    transform: translateX(-50%);

    /* Dynamic font size using CSS variables */
    font-size: calc(var(--string-height) * var(--font-size-ratio, 0.28));
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);

    /* Minimum readable size */
    min-font-size: 8px;

    /* Responsive font size adjustments */
    @media (max-width: 1199px) {
      font-size: 15px;
    }

    @media (max-width: 1023px) {
      font-size: 14px;
    }

    @media (max-width: 767px) {
      font-size: 12px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
    }

    @media (max-width: 479px) {
      font-size: 10px;
      font-weight: 600;
    }

    @media (max-width: 359px) {
      font-size: 9px;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      color: #000000;
      text-shadow: 0 0 2px #ffffff, 0 0 4px #ffffff;
    }
  }

  /* High contrast mode for fret lines */
  @media (prefers-contrast: high) {
    background: linear-gradient(to bottom, #000000, #333333, #000000);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  }
`

// Enhanced string line styles with improved responsive design
const stringLineStyles = css`
  grid-column: 1 / -1; /* Span from first column to end */
  z-index: 2; /* GridLayers.STRING_LINES */

  height: var(--string-thickness);
  background: var(--string-gradient);
  border-radius: calc(var(--string-thickness) / 2);
  box-shadow: var(--string-shadow);
  align-self: center;

  /* Different string thicknesses and textures with responsive adjustments */
  &[data-string="0"], /* 1st string */
  &[data-string="1"], /* 2nd string */
  &[data-string="2"] { /* 3rd string */
    --string-thickness: 2px;
    --string-gradient: linear-gradient(to right, #F0F0F0, #D0D0D0, #F0F0F0);
    --string-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    /* Responsive string thickness for thin strings */
    @media (max-width: 767px) {
      --string-thickness: 1.5px;
      --string-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 479px) {
      --string-thickness: 1px;
      --string-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
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

    /* Responsive string thickness for thick strings */
    @media (max-width: 767px) {
      --string-thickness: 3px;
      --string-gradient: repeating-linear-gradient(
        75deg,
        #A0826D 0px,
        #E8E8E8 0.6px,
        #F0F0F0 1.2px,
        #E8E8E8 1.8px,
        #A0826D 2.4px
      );
    }

    @media (max-width: 479px) {
      --string-thickness: 2.5px;
      --string-gradient: repeating-linear-gradient(
        75deg,
        #A0826D 0px,
        #E8E8E8 0.5px,
        #F0F0F0 1px,
        #E8E8E8 1.5px,
        #A0826D 2px
      );
    }

    @media (max-width: 359px) {
      --string-thickness: 2px;
      --string-gradient: linear-gradient(to right, #A0826D, #E8E8E8, #A0826D);
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    &[data-string="0"],
    &[data-string="1"],
    &[data-string="2"] {
      --string-gradient: linear-gradient(to right, #000000, #333333, #000000);
      --string-shadow: 0 2px 4px rgba(255, 255, 255, 0.3);
    }

    &[data-string="3"],
    &[data-string="4"],
    &[data-string="5"] {
      --string-gradient: linear-gradient(to right, #000000, #666666, #000000);
      --string-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
    }
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

  // Layer management system - ensures proper z-index ordering (development only)
  const { checkLayerIntegrity } = useLayerManagement(fretboardRef, false) // Disabled during tests

  // Development-time layer validation
  React.useEffect(() => {
    if (typeof window !== 'undefined' && fretboardRef.current) {
      const integrity = checkLayerIntegrity()
      if (!integrity.isValid) {
        console.warn('Fretboard layer integrity issues:', integrity.issues)
      }
    }
  }, [checkLayerIntegrity])

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
        {/* Fret lines - unified processing for all frets (0 to fretCount) */}
        {Array.from({ length: fretCount + 1 }, (_, fret) => (
          <div
            key={`fret-${fret}`}
            css={fretLineStyles}
            style={{ gridColumn: fret + 1 } as React.CSSProperties} // Unified mapping: fret 0 = column 1, fret 1 = column 2, etc.
            data-fret-number={fret}
            data-layer="fret-lines"
            role="presentation"
            aria-hidden="true"
          />
        ))}

        {/* String lines - unified processing for all strings using 8-row system */}
        {STANDARD_TUNING.map((_, stringIndex) => (
          <div
            key={`string-${stringIndex}`}
            css={stringLineStyles}
            data-string={stringIndex}
            data-layer="string-lines"
            style={{ gridRow: stringIndex + 2 } as React.CSSProperties} /* Unified mapping: stringIndex + 2 for 8-row system with placeholder rows */
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