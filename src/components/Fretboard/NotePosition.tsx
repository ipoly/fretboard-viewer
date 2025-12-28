import React from 'react'
import { FretPosition, DisplayMode } from '../../types'
import { css } from '@emotion/react'
import { noteMarkerStyles } from '../../utils/grid/styles'
import { circularMarkerBase, getScaleDegreeColorClass } from '../../styles/shared'

interface NotePositionProps {
  position: FretPosition
  displayMode: DisplayMode
}

// Grid positioning is now handled by MarkerWrapper component

/**
 * Fretboard note marker styles - combines shared circular base with grid-specific sizing
 * Uses shared visual styles but with fretboard-specific responsive behavior
 */
const fretboardNoteMarkerStyles = css`
  ${circularMarkerBase}
  ${noteMarkerStyles}
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
  const scaleDegreeColorClass = React.useMemo(() =>
    getScaleDegreeColorClass(scaleDegree),
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
      css={[fretboardNoteMarkerStyles, scaleDegreeColorClass]}
      className="note-marker" // Unified class name for all markers
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