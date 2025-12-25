import React from 'react'
import { FretPosition, DisplayMode } from '../../types'
import { SCALE_DEGREE_COLORS } from '../../utils/constants/music'
import { FretboardGridManager, noteMarkerStyles, openStringMarkerStyles } from '../../utils/grid'

interface NotePositionProps {
  position: FretPosition
  displayMode: DisplayMode
  gridManager: FretboardGridManager
}

/**
 * Get the color for a scale degree
 */
function getColorForScaleDegree(degree: number): string {
  return SCALE_DEGREE_COLORS[degree as keyof typeof SCALE_DEGREE_COLORS] || '#999999'
}

const NotePosition: React.FC<NotePositionProps> = ({
  position,
  displayMode,
  gridManager
}) => {
  const { note, scaleDegree, fret } = position

  // Determine what to display based on display mode
  const displayText = displayMode === 'notes' ? note : scaleDegree?.toString() || ''

  // Get color based on scale degree
  const backgroundColor = scaleDegree ? getColorForScaleDegree(scaleDegree) : '#999999'

  // Convert position to grid element and get styles
  const gridElement = gridManager.fretPositionToGridElement(position)
  const elementStyles = gridManager.getElementStyles(gridElement)

  // Determine if this is an open string marker
  const isOpenString = fret === 0

  return (
    <div
      css={isOpenString ? openStringMarkerStyles : noteMarkerStyles}
      style={{
        ...elementStyles,
        '--note-color': backgroundColor
      } as React.CSSProperties}
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