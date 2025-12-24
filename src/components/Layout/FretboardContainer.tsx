/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FretboardGrid } from '../Fretboard'
import { useAppStore } from '../../stores/appStore'

const containerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
`

const fretboardWrapperStyles = css`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 1rem 0;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`

export function FretboardContainer() {
  const { selectedKey, displayMode } = useAppStore()
  const fretCount = 24 // Full fretboard as per requirements

  return (
    <main css={containerStyles}>
      <div css={fretboardWrapperStyles}>
        <FretboardGrid
          selectedKey={selectedKey}
          displayMode={displayMode}
          fretCount={fretCount}
        />
      </div>
    </main>
  )
}