/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Header, FretboardContainer, Footer } from './components/Layout'
import { PWAUpdateNotification } from './components/PWA'

const appStyles = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  background-color: #ffffff;

  /* Ensure proper viewport handling */
  width: 100%;
  overflow-x: hidden;
`

const mainContentStyles = css`
  flex: 1;
  display: flex;
  flex-direction: column;
`

function App() {
  const handleUpdateAvailable = () => {
    console.log('PWA update available')
  }

  const handleUpdateInstalled = () => {
    console.log('PWA update installed and ready')
  }

  return (
    <div css={appStyles}>
      <Header />
      <div css={mainContentStyles}>
        <FretboardContainer />
      </div>
      <Footer />
      <PWAUpdateNotification
        onUpdateAvailable={handleUpdateAvailable}
        onUpdateInstalled={handleUpdateInstalled}
      />
    </div>
  )
}

export default App