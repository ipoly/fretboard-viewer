import React from 'react'
import { css } from '@emotion/react'
import { SCALE_DEGREE_COLORS } from '../../utils/constants/music'
import { calculateMajorScale } from '../../utils/music/scales'
import { useAppStore } from '../../stores/appStore'

const legendStyles = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const legendTitleStyles = css`
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
`

const legendItemsStyles = css`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
`

const legendItemStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

const legendCircleStyles = css`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
  font-family: 'Comic Sans MS', 'Marker Felt', 'Chalkduster', cursive, sans-serif;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
`

const legendLabelStyles = css`
  font-size: 10px;
  color: #666;
  text-align: center;
  min-width: 24px;
`

export const ScaleLegend: React.FC = () => {
  const { selectedKey, displayMode } = useAppStore()

  // Calculate the major scale for the selected key
  const scaleInfo = calculateMajorScale(selectedKey)

  return (
    <div css={legendStyles}>
      <div css={legendTitleStyles}>
        {selectedKey} Major
      </div>

      <div css={legendItemsStyles}>
        {scaleInfo.degrees.map((degree, index) => {
          const note = scaleInfo.notes[index]
          const color = SCALE_DEGREE_COLORS[degree as keyof typeof SCALE_DEGREE_COLORS]
          const displayText = displayMode === 'notes' ? note : degree.toString()

          return (
            <div key={degree} css={legendItemStyles}>
              <div
                css={legendCircleStyles}
                style={{ backgroundColor: color }}
              >
                {displayText}
              </div>
              <div css={legendLabelStyles}>
                {displayMode === 'notes' ? `${degree}` : note}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}