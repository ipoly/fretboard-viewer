import React from 'react'
import { css } from '@emotion/react'
import { DisplayMode } from '../../types'
import { useAppStore } from '../../stores/appStore'
import {
  flexColumn,
  formLabel,
  backgroundContainer,
  toggleButton,
  activeToggleButton,
  inactiveToggleButton
} from '../../styles/components'

const displayToggleStyles = css`
  ${flexColumn}
  gap: 8px;
`

const toggleContainerStyles = css`
  ${backgroundContainer}
  display: flex;
`

export const DisplayToggle: React.FC = () => {
  const { displayMode, setDisplayMode } = useAppStore()

  const handleModeChange = (mode: DisplayMode) => {
    setDisplayMode(mode)
  }

  return (
    <div css={displayToggleStyles}>
      <label css={formLabel}>Display Mode</label>
      <div css={toggleContainerStyles} role="group" aria-label="Toggle display mode">
        <button
          css={[
            toggleButton,
            displayMode === 'notes' ? activeToggleButton : inactiveToggleButton
          ]}
          onClick={() => handleModeChange('notes')}
          aria-pressed={displayMode === 'notes'}
          aria-label="Show note names"
        >
          Notes
        </button>
        <button
          css={[
            toggleButton,
            displayMode === 'degrees' ? activeToggleButton : inactiveToggleButton
          ]}
          onClick={() => handleModeChange('degrees')}
          aria-pressed={displayMode === 'degrees'}
          aria-label="Show scale degrees"
        >
          Degrees
        </button>
      </div>
    </div>
  )
}