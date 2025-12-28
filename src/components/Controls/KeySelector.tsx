import React from 'react'
import { css } from '@emotion/react'
import { MusicalKey } from '../../types'
import { CHROMATIC_NOTES } from '../../utils/constants/music'
import { useAppStore } from '../../stores/appStore'
import {
  flexColumn,
  formLabel,
  backgroundContainer,
  secondaryButton,
  primaryButton
} from '../../styles/components'
import { media } from '../../styles/responsive'

const keySelectorStyles = css`
  ${flexColumn}
  gap: 8px;
`

const buttonGroupStyles = css`
  ${backgroundContainer}
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  justify-content: center;

  /* iPad specific - reduce button size to fit in one row */
  ${media.ipad} {
    gap: 2px;
    padding: 6px 4px;
  }

  /* Responsive adjustments for smaller screens */
  ${media.lg} {
    gap: 6px;
    padding: 10px;
  }

  ${media.sm} {
    gap: 4px;
    padding: 8px;
  }
`

const keyButtonStyles = css`
  ${secondaryButton}
  padding: 8px 12px;
  font-size: 14px;
  min-width: 40px;
  min-height: auto;

  /* iPad specific - smaller buttons to fit in one row */
  ${media.ipad} {
    padding: 8px 6px;
    font-size: 13px;
    min-width: 32px;
    min-height: 36px;
  }

  /* Touch-friendly sizing for phones */
  ${media.lg} {
    padding: 12px 16px;
    font-size: 16px;
    min-width: 44px;
    min-height: 44px;
  }

  ${media.sm} {
    padding: 10px 14px;
    font-size: 14px;
    min-width: 40px;
    min-height: 40px;
  }
`

const selectedKeyButtonStyles = css`
  ${primaryButton}
  font-weight: 600;
`

export const KeySelector: React.FC = () => {
  const { selectedKey, setSelectedKey } = useAppStore()

  const handleKeySelect = (key: MusicalKey) => {
    setSelectedKey(key)
  }

  return (
    <div css={keySelectorStyles}>
      <label css={formLabel}>Musical Key</label>
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