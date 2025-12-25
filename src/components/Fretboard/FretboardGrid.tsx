import React, { useEffect, useRef } from 'react'
import { css } from '@emotion/react'
import { MusicalKey, DisplayMode } from '../../types'
import { getFretboardPositions } from '../../utils/music/fretboard'
import {
  FretboardGridManager,
  fretboardGridStyles,
  fretLineStyles,
  stringLineStyles,
  openStringMaskStyles,
  LayerManager
} from '../../utils/grid'
import NotePosition from './NotePosition'

interface FretboardGridProps {
  selectedKey: MusicalKey
  displayMode: DisplayMode
  fretCount: number
}

// Optimized container styles with simplified responsive design using CSS variables
const fretboardContainer = css`
  position: relative;
  width: 100%;

  /* Simplified height calculation using CSS variables */
  height: calc(var(--string-height) * 8); /* Optimized: 6 strings + padding */

  /* Simplified responsive padding using CSS variables */
  padding: 0 calc(var(--open-string-width) * 0.2) calc(var(--string-height) * 0.3) calc(var(--open-string-width) * 0.2);

  /* Touch device optimization */
  @media (hover: none) and (pointer: coarse) {
    padding: 0 calc(var(--open-string-width) * 0.25) calc(var(--string-height) * 0.35) calc(var(--open-string-width) * 0.25);
  }
`

const FretboardGrid: React.FC<FretboardGridProps> = ({
  selectedKey,
  displayMode,
  fretCount
}) => {
  // Optimize: Create grid manager only once and memoize layout config
  const gridManager = React.useMemo(() => new FretboardGridManager(fretCount), [fretCount])
  const layoutConfig = React.useMemo(() => gridManager.getLayoutConfig(), [gridManager])
  const fretboardRef = useRef<HTMLDivElement>(null)

  // Get all fret positions for the selected key
  const fretPositions = React.useMemo(() => getFretboardPositions(selectedKey, fretCount), [selectedKey, fretCount])

  // Optimize: Reduce layer management overhead - only run when necessary
  useEffect(() => {
    if (fretboardRef.current) {
      LayerManager.enforceLayerOrder(fretboardRef.current)

      // Only validate in development and reduce frequency
      if (import.meta.env.DEV && Math.random() < 0.1) { // Only 10% of the time
        const allElements = Array.from(fretboardRef.current.querySelectorAll('[data-layer], .note-marker, .open-string-marker')) as HTMLElement[]
        const isValid = LayerManager.validateLayerOrder(allElements)

        if (!isValid) {
          console.warn('Layer validation failed. Layer info:', LayerManager.getLayerInfo())
        }
      }
    }
  }, [selectedKey, displayMode, fretCount])

  // Optimized keyboard navigation with CSS variable-based scroll calculation
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