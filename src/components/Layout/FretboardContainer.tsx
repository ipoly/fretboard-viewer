/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FretboardGrid } from '../Fretboard'
import { ScaleLegend } from '../Controls'
import { useAppStore } from '../../stores/appStore'
import { flexColumn, flexCenter, customScrollbar } from '../../styles/components'
import { spacing } from '../../styles/responsive'

const containerStyles = css`
  ${flexColumn}
  ${flexCenter}
  ${spacing.responsive}
`

const fretboardWrapperStyles = css`
  ${customScrollbar}
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 1rem 0;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
`

const legendWrapperStyles = css`
  ${spacing.responsiveMargin}
  ${flexCenter}
  width: 100%;
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
      <div css={legendWrapperStyles}>
        <ScaleLegend />
      </div>
    </main>
  )
}