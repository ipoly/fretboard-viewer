/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const footerStyles = css`
  margin-top: 3rem;
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.875rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;

  /* Responsive adjustments */
  @media (max-width: 768px) {
    margin-top: 2rem;
    padding: 1.5rem 1rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
    padding: 1rem 0.5rem;
    font-size: 0.75rem;
  }

  p {
    margin: 0.5rem 0;

    @media (max-width: 480px) {
      margin: 0.25rem 0;
    }
  }
`

export function Footer() {
  return (
    <footer css={footerStyles}>
      <p>
        Guitar Fretboard Viewer - A tool for learning scales and fretboard patterns
      </p>
      <p>
        Built with React, TypeScript, and modern web technologies
      </p>
    </footer>
  )
}