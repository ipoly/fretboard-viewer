/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Header, FretboardContainer, Footer } from './components/Layout'

const appStyles = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  background-color: #ffffff;
`

const mainContentStyles = css`
  flex: 1;
  display: flex;
  flex-direction: column;
`

function App() {
  return (
    <div css={appStyles}>
      <Header />
      <div css={mainContentStyles}>
        <FretboardContainer />
      </div>
      <Footer />
    </div>
  )
}

export default App