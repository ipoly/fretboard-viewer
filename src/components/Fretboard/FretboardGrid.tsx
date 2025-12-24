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
  padding: 60px 60px 40px 80px; /* 减少左侧padding，去掉琴头空间 */
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
  top: -20px;
  bottom: -20px;
  width: 3px;
  background: linear-gradient(to bottom, #FFD700, #FFA500, #FFD700);
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
  border-radius: 1.5px;
`

const fretNumberContainer = css`
  position: absolute;
  top: -50px; /* 向上移动更多，避免与音符重叠 */
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
`

const fretNumber = css`
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  width: 80px;
  transform: translateX(-50%);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
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
    <div css={fretboardStyles}>
      <div css={fretboardContainer} style={{ width: `${totalWidth}px` }}>
        {/* Fret number markers */}
        <div css={fretNumberContainer}>
          {Array.from({ length: fretCount + 1 }, (_, fret) => (
            <div
              key={fret}
              css={fretNumber}
              style={{ left: `${fret * fretWidth}px` }}
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
          />
        ))}

        {/* Strings and note positions */}
        {STANDARD_TUNING.map((openNote, stringIndex) => {
          // Different string thicknesses (1st string thinnest, 6th string thickest)
          const stringThickness = stringIndex === 0 ? 2 : stringIndex === 1 ? 2.5 : stringIndex === 2 ? 3 : stringIndex === 3 ? 3.5 : stringIndex === 4 ? 4 : 4.5;

          const openStringPosition = getOpenStringPosition(stringIndex, openNote)

          return (
            <div key={stringIndex} css={stringContainer}>
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
                    : 'linear-gradient(to right, #CD853F, #8B4513, #CD853F)'  // Wound strings (low strings)
                }}
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
    </div>
  )
}

export default FretboardGrid