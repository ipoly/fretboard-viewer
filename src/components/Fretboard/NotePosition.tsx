import React from 'react'
import { css } from '@emotion/react'
import { FretPosition, DisplayMode } from '../../types'
import { SCALE_DEGREE_COLORS } from '../../utils/constants/music'

interface NotePositionProps {
  position: FretPosition
  displayMode: DisplayMode
  fretWidth: number
}

const noteCircle = css`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 900;
  font-family: 'Comic Sans MS', 'Marker Felt', 'Chalkduster', cursive, sans-serif;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  border: 3px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: translate(-50%, -50%);
  z-index: 10;

  /* Keyboard focus styles */
  &:focus {
    outline: 3px solid #FFD700;
    outline-offset: 2px;
    transform: translate(-50%, -50%) scale(1.1);
  }

  /* Touch-friendly sizing for tablets and mobile */
  @media (max-width: 1024px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 14px;
    border-width: 2px;
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
    border-width: 2px;
  }

  /* Enhanced touch interactions */
  @media (hover: hover) {
    &:hover {
      transform: translate(-50%, -50%) scale(1.2) rotate(5deg);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.7);
      font-size: 20px;

      @media (max-width: 1024px) {
        font-size: 18px;
      }

      @media (max-width: 768px) {
        font-size: 16px;
      }

      @media (max-width: 480px) {
        font-size: 14px;
      }
    }
  }

  /* Touch feedback for devices without hover */
  @media (hover: none) {
    &:active {
      transform: translate(-50%, -50%) scale(1.1);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.7);
    }
  }

  &:active {
    transform: translate(-50%, -50%) scale(0.95);
    transition: all 0.1s ease;
  }
`

/**
 * Get the color for a scale degree
 */
function getColorForScaleDegree(degree: number): string {
  return SCALE_DEGREE_COLORS[degree as keyof typeof SCALE_DEGREE_COLORS] || '#999999'
}

/**
 * Calculate the horizontal position of a note on the fretboard
 * Notes are positioned between frets (fret 1 is between fret 0 and fret 1)
 * Open strings (fret 0) are positioned at the left edge with some spacing
 */
function calculateNotePosition(fret: number, fretWidth: number): number {
  if (fret === 0) {
    // Position open string notes with some spacing from the left edge
    return -40 // Moved closer to the fretboard, was -60
  }
  // Position notes in the middle of each fret space
  return (fret - 0.5) * fretWidth
}

const NotePosition: React.FC<NotePositionProps> = ({
  position,
  displayMode,
  fretWidth
}) => {
  const { note, scaleDegree, fret } = position

  // Determine what to display based on display mode
  const displayText = displayMode === 'notes' ? note : scaleDegree?.toString() || ''

  // Get color based on scale degree
  const backgroundColor = scaleDegree ? getColorForScaleDegree(scaleDegree) : '#999999'

  // Calculate horizontal position
  const leftPosition = calculateNotePosition(fret, fretWidth)

  return (
    <div
      css={noteCircle}
      style={{
        backgroundColor,
        left: `${leftPosition}px`,
        top: '50%'
      }}
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