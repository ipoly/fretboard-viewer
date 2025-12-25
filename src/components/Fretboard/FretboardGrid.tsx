import React from 'react'
import { css } from '@emotion/react'
import { MusicalKey, DisplayMode, FretPosition } from '../../types'
import { getFretboardPositions } from '../../utils/music/fretboard'
import { STANDARD_TUNING } from '../../utils/constants/music'
import { calculateMajorScale, getScaleDegree } from '../../utils/music/scales'
import NotePosition from './NotePosition'

interface FretboardGridProps {
  selectedKey: MusicalKey
  displayMode: DisplayMode
  fretCount: number
}

const fretboardStyles = css`
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  height: 500px;
  background: linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #8B4513 100%);
  border: 2px solid #654321;
  border-radius: 8px;
  padding: var(--top-padding) var(--right-padding-desktop) var(--bottom-padding-desktop) var(--left-padding);

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    height: 400px;
    padding: var(--top-padding) var(--right-padding-tablet) var(--bottom-padding-tablet) var(--left-padding);
  }

  @media (max-width: 768px) {
    height: 350px;
    padding: var(--top-padding) var(--right-padding-mobile) var(--bottom-padding-mobile) var(--left-padding);
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    height: 300px;
    padding: var(--top-padding) var(--right-padding-phone) var(--bottom-padding-phone) var(--left-padding);
    border-radius: 4px;
  }

  /* Touch-friendly scrolling */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Enhanced scrollbar for touch devices */
  &::-webkit-scrollbar {
    height: 12px;

    @media (max-width: 768px) {
      height: 8px;
    }
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
`



const fretboardContainer = css`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const stringContainer = css`
  position: relative;
  height: 50px;
  display: flex;
  align-items: center;
`

const stringLine = css`
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, #E0E0E0, #C0C0C0, #E0E0E0);
  border-radius: 1.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`

const fretLine = css`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #FFD700, #FFA500, #FFD700);
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
  border-radius: 1.5px;
`

const fretNumberContainer = css`
  position: absolute;
  top: calc(-1 * var(--top-padding)); /* 使用动态顶部边距 */
  left: 0;
  right: 0;
  height: var(--top-padding); /* 高度等于顶部边距 */
  display: flex;
  align-items: center; /* 垂直居中 */
`

const fretNumber = css`
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  width: var(--fret-width);
  transform: translateX(-50%);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);

  /* Responsive font sizes */
  @media (max-width: 1024px) {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`

const FretboardGrid: React.FC<FretboardGridProps> = ({
  selectedKey,
  displayMode,
  fretCount
}) => {
  // Get all fret positions for the selected key
  const fretPositions = getFretboardPositions(selectedKey, fretCount)

  // Calculate the major scale for the selected key
  const scaleInfo = calculateMajorScale(selectedKey)

  // Calculate fret positions (each fret is 80px wide)
  const fretWidth = 80
  const totalWidth = (fretCount + 1) * fretWidth // 计算总宽度，包括所有品格
  const fretPositions_px = Array.from({ length: fretCount + 1 }, (_, i) => i * fretWidth)

  // Use fret width as the base unit for consistent spacing
  const leftPadding = fretWidth // 左边距等于一个品格的宽度，确保空弦音符居中对齐
  const stringSpacing = 50 // 弦间距高度
  const topPadding = stringSpacing // 顶部边距等于弦间距，确保品格数字与弦上音符对齐

  // Calculate responsive paddings based on base units
  const rightPadding = {
    desktop: fretWidth * 0.75,    // 60px (0.75 * 80)
    tablet: fretWidth * 0.5,     // 40px (0.5 * 80)
    mobile: fretWidth * 0.25,    // 20px (0.25 * 80)
    phone: fretWidth * 0.1875    // 15px (0.1875 * 80)
  }

  const bottomPadding = {
    desktop: stringSpacing * 0.8,  // 40px (0.8 * 50)
    tablet: stringSpacing * 0.6,   // 30px (0.6 * 50)
    mobile: stringSpacing * 0.4,   // 20px (0.4 * 50)
    phone: stringSpacing * 0.3     // 15px (0.3 * 50)
  }

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        // Scroll left
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.scrollLeft = Math.max(0, e.currentTarget.scrollLeft - fretWidth)
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        // Scroll right
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.scrollLeft = Math.min(
            e.currentTarget.scrollWidth - e.currentTarget.clientWidth,
            e.currentTarget.scrollLeft + fretWidth
          )
        }
        break
      case 'Home':
        e.preventDefault()
        // Scroll to beginning
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.scrollLeft = 0
        }
        break
      case 'End':
        e.preventDefault()
        // Scroll to end
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.scrollLeft = e.currentTarget.scrollWidth - e.currentTarget.clientWidth
        }
        break
    }
  }

  // Helper function to create FretPosition for open strings
  const getOpenStringPosition = (stringIndex: number, openNote: string): FretPosition | null => {
    const degree = getScaleDegree(openNote, scaleInfo)
    if (degree) {
      return {
        string: stringIndex,
        fret: 0,
        note: openNote,
        scaleDegree: degree,
        isInScale: true
      }
    }
    return null
  }

  return (
    <div
      css={fretboardStyles}
      style={{
        '--left-padding': `${leftPadding}px`,
        '--top-padding': `${topPadding}px`,
        '--fret-width': `${fretWidth}px`,
        '--right-padding-desktop': `${rightPadding.desktop}px`,
        '--right-padding-tablet': `${rightPadding.tablet}px`,
        '--right-padding-mobile': `${rightPadding.mobile}px`,
        '--right-padding-phone': `${rightPadding.phone}px`,
        '--bottom-padding-desktop': `${bottomPadding.desktop}px`,
        '--bottom-padding-tablet': `${bottomPadding.tablet}px`,
        '--bottom-padding-mobile': `${bottomPadding.mobile}px`,
        '--bottom-padding-phone': `${bottomPadding.phone}px`
      } as React.CSSProperties}
      role="application"
      aria-label={`Guitar fretboard showing ${selectedKey} major scale in ${displayMode} mode`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-describedby="fretboard-instructions"
    >
      <div css={fretboardContainer} style={{ width: `${totalWidth}px` }}>
        {/* Fret number markers */}
        <div css={fretNumberContainer} role="row" aria-label="Fret numbers">
          {Array.from({ length: fretCount + 1 }, (_, fret) => (
            <div
              key={fret}
              css={fretNumber}
              style={{ left: `${fret * fretWidth}px` }}
              role="columnheader"
              aria-label={`Fret ${fret}`}
            >
              {fret}
            </div>
          ))}
        </div>

        {/* Fret lines */}
        {fretPositions_px.map((position, fret) => (
          <div
            key={fret}
            css={fretLine}
            style={{ left: `${position}px` }}
            role="presentation"
            aria-hidden="true"
          />
        ))}

        {/* Strings and note positions */}
        {STANDARD_TUNING.map((openNote, stringIndex) => {
          // Different string thicknesses (1st string thinnest, 6th string thickest)
          const stringThickness = stringIndex === 0 ? 2 : stringIndex === 1 ? 2.5 : stringIndex === 2 ? 3 : stringIndex === 3 ? 3.5 : stringIndex === 4 ? 4 : 4.5;

          const openStringPosition = getOpenStringPosition(stringIndex, openNote)

          return (
            <div
              key={stringIndex}
              css={stringContainer}
              role="row"
              aria-label={`String ${6 - stringIndex} (${openNote})`}
            >
              {/* Open string note (if in scale) */}
              {openStringPosition && (
                <NotePosition
                  key={`${stringIndex}-0`}
                  position={openStringPosition}
                  displayMode={displayMode}
                  fretWidth={fretWidth}
                />
              )}

              {/* String line with variable thickness and full width */}
              <div
                css={stringLine}
                style={{
                  height: `${stringThickness}px`,
                  width: `${totalWidth}px`,
                  background: stringIndex < 3
                    ? 'linear-gradient(to right, #F0F0F0, #D0D0D0, #F0F0F0)' // Plain steel strings (high strings)
                    : `repeating-linear-gradient(
                        75deg,
                        #A0826D 0px,
                        #E8E8E8 0.8px,
                        #F0F0F0 1.6px,
                        #E8E8E8 2.4px,
                        #A0826D 3.2px
                      )`, // Wound strings with brown base and light spiral winding texture (low strings)
                  boxShadow: stringIndex >= 3
                    ? '0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
                role="presentation"
                aria-hidden="true"
              />

              {/* Note positions on this string */}
              {fretPositions
                .filter(pos => pos.string === stringIndex)
                .map(position => (
                  <NotePosition
                    key={`${position.string}-${position.fret}`}
                    position={position}
                    displayMode={displayMode}
                    fretWidth={fretWidth}
                  />
                ))}
            </div>
          )
        })}
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