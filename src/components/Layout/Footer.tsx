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