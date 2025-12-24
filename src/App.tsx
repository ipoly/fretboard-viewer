/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useAppStore } from './stores/appStore'
import { FretboardGrid } from './components/Fretboard'

const appStyles = css`
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`

const headerStyles = css`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`

const fretboardContainer = css`
  margin: 2rem 0;
  display: flex;
  justify-content: center;
`

function App() {
  const { selectedKey, displayMode } = useAppStore()
  const fretCount = 12 // Limit to 12 frets for better visibility

  return (
    <div css={appStyles}>
      <h1 css={headerStyles}>Guitar Fretboard Viewer</h1>
      <div css={fretboardContainer}>
        <FretboardGrid
          selectedKey={selectedKey}
          displayMode={displayMode}
          fretCount={fretCount}
        />
      </div>
    </div>
  )
}

export default App