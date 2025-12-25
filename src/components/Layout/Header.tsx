/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { KeySelector, DisplayToggle } from '../Controls'

const headerStyles = css`
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  margin-bottom: 2rem;

  /* Responsive padding */
  @media (max-width: 768px) {
    padding: 1rem 1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.5rem;
    margin-bottom: 0.5rem;
  }
`

const titleStyles = css`
  color: #333;
  margin: 0 0 1.5rem 0;
  text-align: left;
  font-size: 2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  /* Responsive font sizes */
  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin: 0 0 1rem 0;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin: 0 0 0.75rem 0;
    gap: 0.5rem;
  }
`

const iconStyles = css`
  font-size: 2rem;
  background: linear-gradient(135deg, #FFB6C1 0%, #FFA0B4 50%, #FF91A4 100%);
  border-radius: 12px;
  padding: 8px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    border-radius: 10px;
    padding: 6px;
    width: 42px;
    height: 42px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    border-radius: 8px;
    padding: 5px;
    width: 36px;
    height: 36px;
  }
`

const controlsStyles = css`
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`

export function Header() {
  return (
    <header css={headerStyles}>
      <h1 css={titleStyles}>
        <span css={iconStyles}>🐽</span>
        Guitar Fretboard Viewer
      </h1>
      <div css={controlsStyles}>
        <KeySelector />
        <DisplayToggle />
      </div>

      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
        onFocus={(e) => {
          e.target.style.position = 'static'
          e.target.style.left = 'auto'
          e.target.style.width = 'auto'
          e.target.style.height = 'auto'
          e.target.style.overflow = 'visible'
          e.target.style.background = '#000'
          e.target.style.color = '#fff'
          e.target.style.padding = '8px'
          e.target.style.textDecoration = 'none'
          e.target.style.zIndex = '1000'
        }}
        onBlur={(e) => {
          e.target.style.position = 'absolute'
          e.target.style.left = '-10000px'
          e.target.style.width = '1px'
          e.target.style.height = '1px'
          e.target.style.overflow = 'hidden'
        }}
      >
        Skip to main content
      </a>
    </header>
  )
}