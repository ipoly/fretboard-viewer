/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { KeySelector, DisplayToggle, ScaleLegend } from '../Controls'

const headerStyles = css`
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
`

const titleStyles = css`
  color: #333;
  margin: 0 0 1.5rem 0;
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
`

const controlsContainerStyles = css`
  display: flex;
  gap: 3rem;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 2rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
`

const mainControlsStyles = css`
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`

export function Header() {
  return (
    <header css={headerStyles}>
      <h1 css={titleStyles}>Guitar Fretboard Viewer</h1>
      <div css={controlsContainerStyles}>
        <div css={mainControlsStyles}>
          <KeySelector />
          <DisplayToggle />
        </div>
        <ScaleLegend />
      </div>
    </header>
  )
}