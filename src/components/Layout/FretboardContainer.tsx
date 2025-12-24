/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FretboardGrid } from '../Fretboard'
import { useAppStore } from '../../stores/appStore'

const containerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;

  /* Responsive padding adjustments */
  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.25rem;
  }
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

    @media (max-width: 768px) {
      height: 12px; /* Larger scrollbar for touch devices */
    }
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    @media (max-width: 768px) {
      background: #999; /* More visible on touch devices */
    }
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Touch-friendly scrolling */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Responsive padding */
  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }

  @media (max-width: 480px) {
    padding: 0.25rem 0;
  }
`

export function FretboardContainer() {
  const { selectedKey, displayMode } = useAppStore()
  const fretCount = 24 // Full fretboard as per requirements

  return (
    <main css={containerStyles} id="main-content">
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