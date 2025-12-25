import React from 'react'
import { FretPosition, DisplayMode } from '../../types'
import { SCALE_DEGREE_COLORS } from '../../utils/constants/music'
import { css } from '@emotion/react'
import { GridLayers } from '../../utils/grid'

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

/**
 * Unified note marker styles using CSS classes with enhanced responsive design
 */
const noteMarkerBaseStyles = css`
  justify-self: center;
  align-self: center;

  /* 基础尺寸使用CSS变量计算 */
  width: calc(var(--string-height) * 0.64); /* 动态计算基于弦高度 */
  height: calc(var(--string-height) * 0.64);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: calc(var(--string-height) * 0.28); /* 动态字体大小 */
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  /* 确保最小可用尺寸 */
  min-width: 20px;
  min-height: 20px;

  /* 响应式尺寸微调 - 基于断点的精确控制 */
  @media (max-width: 1200px) {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
    /* 在小屏幕上增强可见性 */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 640px) {
    width: 26px;
    height: 26px;
    font-size: 11px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 10px;
    /* 触摸友好的最小尺寸 */
    min-width: 24px;
    min-height: 24px;
  }

  @media (max-width: 360px) {
    width: 22px;
    height: 22px;
    font-size: 9px;
    /* 保持最小触摸目标 */
    min-width: 22px;
    min-height: 22px;
  }

  /* 触摸设备优化 */
  @media (hover: none) and (pointer: coarse) {
    /* 触摸设备上稍大的目标区域 */
    min-width: 28px;
    min-height: 28px;

    /* 更明显的视觉反馈 */
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
  }
`

/**
 * Regular note marker styles (for fretted notes)
 */
const regularNoteMarkerStyles = css`
  ${noteMarkerBaseStyles}
  z-index: ${GridLayers.NOTE_MARKERS}; /* Use proper layer constant */
  /* Grid positioning will be set via style prop */
`

/**
 * Open string marker styles (with sticky positioning)
 */
const openStringMarkerStyles = css`
  ${noteMarkerBaseStyles}
  grid-column: 1; /* Always in first column */
  position: sticky;
  left: 0;
  z-index: ${GridLayers.OPEN_STRING_MARKERS}; /* Use proper layer constant - highest */
`

const NotePosition: React.FC<NotePositionProps> = ({
  position,
  displayMode
}) => {
  const { note, scaleDegree, fret, string } = position

  // Determine what to display based on display mode
  const displayText = displayMode === 'notes' ? note : scaleDegree?.toString() || ''

  // Get color based on scale degree
  const backgroundColor = scaleDegree ? getColorForScaleDegree(scaleDegree) : '#999999'

  // Determine if this is an open string marker
  const isOpenString = fret === 0

  // Calculate grid coordinates directly using the grid coordinate system
  const gridRow = string + 1 // Convert 0-based string index to 1-based grid row
  const gridColumn = isOpenString ? 1 : fret + 1 // Open string = column 1, frets = fret + 1 (correct mapping)

  // Create unified CSS class name for styling
  const markerClassName = isOpenString ? 'open-string-marker' : 'note-marker'

  return (
    <div
      css={isOpenString ? openStringMarkerStyles : regularNoteMarkerStyles}
      className={markerClassName}
      style={{
        gridRow,
        gridColumn: isOpenString ? undefined : gridColumn, // Open string uses CSS grid-column: 1
        backgroundColor
      } as React.CSSProperties}
      data-string={string}
      data-fret={fret}
      data-scale-degree={scaleDegree}
      data-note={note}
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