import React from 'react'
import { css } from '@emotion/react'
import { MusicalKey } from '../../types'
import { CHROMATIC_NOTES } from '../../utils/constants/music'
import { useAppStore } from '../../stores/appStore'

const keySelectorStyles = css`
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

const buttonGroupStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  justify-content: center;

  /* iPad specific - reduce button size to fit in one row */
  @media (min-width: 768px) and (max-width: 1200px) {
    gap: 2px;
    padding: 6px 4px;
  }

  /* Responsive adjustments for smaller screens */
  @media (max-width: 767px) {
    gap: 6px;
    padding: 10px;
  }

  @media (max-width: 480px) {
    gap: 4px;
    padding: 8px;
  }
`

const keyButtonStyles = css`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 40px;
  text-align: center;

  /* iPad specific - smaller buttons to fit in one row */
  @media (min-width: 768px) and (max-width: 1200px) {
    padding: 8px 6px;
    font-size: 13px;
    min-width: 32px;
    min-height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Touch-friendly sizing for phones */
  @media (max-width: 767px) {
    padding: 12px 16px;
    font-size: 16px;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 14px;
    min-width: 40px;
    min-height: 40px;
  }

  &:hover {
    background: #e8f4f8;
    border-color: #45B7D1;
  }

  &:focus {
    outline: 2px solid #45B7D1;
    outline-offset: 2px;
  }

  /* Enhanced touch feedback */
  @media (hover: none) {
    &:active {
      background: #d0e8f0;
      transform: scale(0.95);
    }
  }
`

const selectedKeyButtonStyles = css`
  background: #45B7D1;
  color: white;
  border-color: #45B7D1;
  font-weight: 600;

  &:hover {
    background: #3a9bc1;
    border-color: #3a9bc1;
  }
`

export const KeySelector: React.FC = () => {
  const { selectedKey, setSelectedKey } = useAppStore()

  const handleKeySelect = (key: MusicalKey) => {
    setSelectedKey(key)
  }

  return (
    <div css={keySelectorStyles}>
      <label css={labelStyles}>Musical Key</label>
      <div css={buttonGroupStyles} role="group" aria-label="Select musical key">
        {CHROMATIC_NOTES.map((key) => (
          <button
            key={key}
            css={[
              keyButtonStyles,
              selectedKey === key && selectedKeyButtonStyles
            ]}
            onClick={() => handleKeySelect(key)}
            aria-pressed={selectedKey === key}
            aria-label={`Select key ${key}`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}