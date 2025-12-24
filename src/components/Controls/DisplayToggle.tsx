import React from 'react'
import { css } from '@emotion/react'
import { DisplayMode } from '../../types'
import { useAppStore } from '../../stores/appStore'

const displayToggleStyles = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const labelStyles = css`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`

const toggleContainerStyles = css`
  display: flex;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  position: relative;
`

const toggleButtonStyles = css`
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  z-index: 2;

  /* Touch-friendly sizing */
  @media (max-width: 768px) {
    padding: 14px 20px;
    font-size: 16px;
    min-height: 48px;
  }

  @media (max-width: 480px) {
    padding: 12px 18px;
    font-size: 14px;
    min-height: 44px;
  }

  &:focus {
    outline: 2px solid #45B7D1;
    outline-offset: 2px;
  }

  /* Enhanced touch feedback */
  @media (hover: none) {
    &:active {
      transform: scale(0.95);
    }
  }
`

const activeToggleButtonStyles = css`
  background: white;
  color: #45B7D1;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const inactiveToggleButtonStyles = css`
  color: #666;

  &:hover {
    color: #333;
  }
`

export const DisplayToggle: React.FC = () => {
  const { displayMode, setDisplayMode } = useAppStore()

  const handleModeChange = (mode: DisplayMode) => {
    setDisplayMode(mode)
  }

  return (
    <div css={displayToggleStyles}>
      <label css={labelStyles}>Display Mode</label>
      <div css={toggleContainerStyles} role="group" aria-label="Toggle display mode">
        <button
          css={[
            toggleButtonStyles,
            displayMode === 'notes' ? activeToggleButtonStyles : inactiveToggleButtonStyles
          ]}
          onClick={() => handleModeChange('notes')}
          aria-pressed={displayMode === 'notes'}
          aria-label="Show note names"
        >
          Notes
        </button>
        <button
          css={[
            toggleButtonStyles,
            displayMode === 'degrees' ? activeToggleButtonStyles : inactiveToggleButtonStyles
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