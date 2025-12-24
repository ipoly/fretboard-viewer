/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const appStyles = css`
  text-align: center;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`

const headerStyles = css`
  color: #333;
  margin-bottom: 2rem;
`

function App() {
  return (
    <div css={appStyles}>
      <h1 css={headerStyles}>Guitar Fretboard Viewer</h1>
      <p>Project setup complete! Ready for development.</p>
    </div>
  )
}

export default App