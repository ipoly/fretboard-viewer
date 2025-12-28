/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FretboardGrid } from '../Fretboard'
import { ScaleLegend } from '../Controls'
import { useAppStore } from '../../stores/appStore'

const containerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;

  /* Enhanced responsive padding adjustments */
  @media (max-width: 1023px) {
    padding: 0 0.75rem;
  }

  @media (max-width: 767px) {
    padding: 0 0.5rem;
  }

  @media (max-width: 479px) {
    padding: 0 0.25rem;
  }

  @media (max-width: 359px) {
    padding: 0 0.125rem;
  }
`

const fretboardWrapperStyles = css`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 1rem 0;

  /* Enhanced custom scrollbar styling with responsive design */
  &::-webkit-scrollbar {
    height: 8px;

    @media (max-width: 1023px) {
      height: 10px;
    }

    @media (max-width: 767px) {
      height: 12px; /* Larger scrollbar for touch devices */
    }

    @media (max-width: 479px) {
      height: 14px; /* Even larger for small touch screens */
    }
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;

    @media (max-width: 767px) {
      background: #e1e1e1; /* More visible track on mobile */
    }
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    @media (max-width: 767px) {
      background: #999; /* More visible on touch devices */
    }

    @media (max-width: 479px) {
      background: #777; /* Even more visible on small screens */
    }
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;

    @media (max-width: 767px) {
      background: #666; /* Darker hover state on mobile */
    }
  }

  /* Enhanced touch-friendly scrolling */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    scroll-snap-type: x proximity;

    /* Add subtle scroll indicators */
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 20px;
      pointer-events: none;
      z-index: 1;
    }

    &::before {
      left: 0;
      background: linear-gradient(to right, rgba(245, 245, 245, 0.8), transparent);
    }

    &::after {
      right: 0;
      background: linear-gradient(to left, rgba(245, 245, 245, 0.8), transparent);
    }
  }

  /* Enhanced responsive padding */
  @media (max-width: 1023px) {
    padding: 0.75rem 0;
  }

  @media (max-width: 767px) {
    padding: 0.5rem 0;
  }

  @media (max-width: 479px) {
    padding: 0.25rem 0;
  }

  @media (max-width: 359px) {
    padding: 0.125rem 0;
  }

  /* Prevent horizontal overflow on very small screens */
  @media (max-width: 359px) {
    min-width: 0;
    max-width: 100vw;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    &::-webkit-scrollbar-track {
      background: #000000;
    }

    &::-webkit-scrollbar-thumb {
      background: #ffffff;
      border: 1px solid #000000;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`

const legendWrapperStyles = css`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  width: 100%;

  /* Enhanced responsive margin adjustments */
  @media (max-width: 1023px) {
    margin-top: 1.25rem;
  }

  @media (max-width: 767px) {
    margin-top: 1rem;
  }

  @media (max-width: 479px) {
    margin-top: 0.75rem;
  }

  @media (max-width: 359px) {
    margin-top: 0.5rem;
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
      <div css={legendWrapperStyles}>
        <ScaleLegend />
      </div>
    </main>
  )
}