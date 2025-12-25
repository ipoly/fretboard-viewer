import React from 'react'
import { css } from '@emotion/react'
import { MusicalKey, DisplayMode } from '../../types'
import { getFretboardPositions } from '../../utils/music/fretboard'
import {
  FretboardGridManager,
  fretboardGridStyles,
  fretLineStyles,
  stringLineStyles,
  openStringMaskStyles
} from '../../utils/grid'
import NotePosition from './NotePosition'

interface FretboardGridProps {
  selectedKey: MusicalKey
  displayMode: DisplayMode
  fretCount: number
}

// Container styles that wrap the grid system
const fretboardContainer = css`
  position: relative;
  width: 100%;
  height: 500px;
  padding: 0 20px 20px 20px; /* 移除顶部边距，因为指板网格自身已有padding */

  /* Responsive height adjustments */
  @media (max-width: 1024px) {
    height: 400px;
    padding: 0 18px 18px 18px;
  }

  @media (max-width: 768px) {
    height: 350px;
    padding: 0 15px 15px 15px;
  }

  @media (max-width: 480px) {
    height: 300px;
    padding: 0 12px 12px 12px;
  }
`

const FretboardGrid: React.FC<FretboardGridProps> = ({
  selectedKey,
  displayMode,
  fretCount
}) => {
  // Initialize grid manager
  const gridManager = new FretboardGridManager(fretCount)
  const layoutConfig = gridManager.getLayoutConfig()

  // Get all fret positions for the selected key
  const fretPositions = getFretboardPositions(selectedKey, fretCount)

  // Keyboard navigation handler (keeping the same functionality)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const fretWidth = 80 // Keep for scroll calculations
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.scrollLeft = Math.max(0, e.currentTarget.scrollLeft - fretWidth)
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.scrollLeft = Math.min(
            e.currentTarget.scrollWidth - e.currentTarget.clientWidth,
            e.currentTarget.scrollLeft + fretWidth
          )
        }
        break
      case 'Home':
        e.preventDefault()
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.scrollLeft = 0
        }
        break
      case 'End':
        e.preventDefault()
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.scrollLeft = e.currentTarget.scrollWidth - e.currentTarget.clientWidth
        }
        break
    }
  }

  return (
    <div css={fretboardContainer}>
      {/* Main fretboard grid */}
      <div
        css={fretboardGridStyles}
        style={{
          '--fret-count': fretCount,
          ...layoutConfig.cssVariables
        } as React.CSSProperties}
        role="application"
        aria-label={`Guitar fretboard showing ${selectedKey} major scale in ${displayMode} mode`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-describedby="fretboard-instructions"
      >
        {/* Layer 1: 品丝层 (Fret Lines) */}
        <div style={{ display: 'contents' }} data-layer="fret-lines" data-z-index="1">
          {layoutConfig.elements
            .filter(element => element.type === 'fret-line')
            .map((element) => {
              const elementStyles = gridManager.getElementStyles(element)
              return (
                <div
                  key={`fret-line-${element.data?.fretNumber}`}
                  css={fretLineStyles}
                  style={elementStyles as React.CSSProperties}
                  data-fret-number={element.data?.fretNumber}
                  role="presentation"
                  aria-hidden="true"
                />
              )
            })}
        </div>

        {/* Layer 2: 弦线层 (String Lines) */}
        <div style={{ display: 'contents' }} data-layer="string-lines" data-z-index="2">
          {layoutConfig.elements
            .filter(element => element.type === 'string-line')
            .map((element) => {
              const elementStyles = gridManager.getElementStyles(element)
              return (
                <div
                  key={`string-line-${element.data?.stringIndex}`}
                  css={stringLineStyles}
                  data-string={element.data?.stringIndex}
                  style={elementStyles as React.CSSProperties}
                  role="presentation"
                  aria-hidden="true"
                />
              )
            })}
        </div>

        {/* Layer 3: 音符标记层 (Note Markers) */}
        <div style={{ display: 'contents' }} data-layer="note-markers" data-z-index="3">
          {fretPositions
            .filter(position => position.fret > 0) // 只显示品格上的音符，不包括空弦
            .map(position => (
              <NotePosition
                key={`note-${position.string}-${position.fret}`}
                position={position}
                displayMode={displayMode}
              />
            ))}
        </div>

        {/* Layer 4: 空弦遮罩层 (Open String Mask) - 单独元素，占满第一列 */}
        {layoutConfig.elements
          .filter(element => element.type === 'open-string-mask')
          .map((element) => {
            const elementStyles = gridManager.getElementStyles(element)
            return (
              <div
                key="open-string-mask"
                css={openStringMaskStyles}
                style={elementStyles as React.CSSProperties}
                data-layer="open-string-mask"
                data-z-index="4"
                role="presentation"
                aria-hidden="true"
              />
            )
          })}

        {/* Layer 5: 空弦标记层 (Open String Markers) - 最顶层 */}
        <div style={{ display: 'contents' }} data-layer="open-string-markers" data-z-index="5">
          {fretPositions
            .filter(position => position.fret === 0) // 只显示空弦音符
            .map(position => (
              <NotePosition
                key={`note-${position.string}-${position.fret}`}
                position={position}
                displayMode={displayMode}
              />
            ))}
        </div>
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