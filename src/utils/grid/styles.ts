/**
 * CSS Grid styles for fretboard components
 *
 * This module provides CSS-in-JS styles for the CSS Grid-based fretboard layout.
 */

import { css } from '@emotion/react';
import { responsiveGridVariables } from '../../styles/responsive';

// Define GridLayers locally to avoid circular imports
const GridLayers = {
  FRET_LINES: 1,           // 品丝 - 最底层
  STRING_LINES: 2,         // 弦线 - 第二层
  MARKER_WRAPPER: 3,       // 包裹元素 - 第三层
  NOTE_MARKERS: 4,         // 音符标记 - 最顶层（统一处理所有标记）
} as const;

/**
 * Main fretboard grid container styles with enhanced CSS Grid layout
 */
export const fretboardGridStyles = css`
  ${responsiveGridVariables} /* Ensure CSS variables are available in grid container */

  display: grid;
  grid-template-columns: repeat(calc(var(--fret-count) + 1), var(--fret-width));
  grid-template-rows: repeat(8, var(--string-height)); /* 6 strings + 2 placeholder rows */
  gap: var(--grid-gap, 0px);

  /* Key setting: prevent child elements from stretching */
  align-items: start;

  /* Scroll settings */
  overflow-x: auto;
  overflow-y: hidden;

  /* Fretboard background */
  background: linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #8B4513 100%);
  border: 2px solid #654321;
  border-radius: var(--border-radius, 8px);

  /* Touch-friendly scrolling */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Responsive border adjustment */
  @media (max-width: 768px) {
    border-width: 1px;
  }

  /* Optimized scrollbar styles */
  &::-webkit-scrollbar {
    height: var(--scrollbar-height, 12px);
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: calc(var(--scrollbar-height, 12px) / 2);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: calc(var(--scrollbar-height, 12px) / 2);
    border: 1px solid rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }

  /* Touch device optimization */
  @media (max-width: 480px) {
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x proximity;

    & > * {
      scroll-snap-align: start;
    }
  }
`;

/**
 * Fret line styles with optimized responsive design
 */
export const fretLineStyles = css`
  z-index: ${GridLayers.FRET_LINES};

  width: 3px;
  height: 100%;
  background: linear-gradient(to bottom, #FFD700, #FFA500, #FFD700);
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
  border-radius: 1.5px;
  justify-self: right;
  position: relative;

  /* Responsive fret width */
  @media (max-width: 768px) {
    width: 2px;
    border-radius: 1px;
    box-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
  }

  @media (max-width: 480px) {
    width: 1.5px;
    border-radius: 0.75px;
    box-shadow: 0 0 3px rgba(255, 215, 0, 0.5);
  }

  /* Optimized fret number pseudo-element */
  &::before {
    content: attr(data-fret-number);
    position: absolute;
    top: calc(-1 * var(--string-height) / 2 - 0.5em);
    left: 50%;
    transform: translateX(-50%);

    /* Dynamic font size based on grid size */
    font-size: calc(var(--string-height) * 0.32);
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);

    /* Responsive font size adjustments */
    @media (max-width: 1024px) {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      font-size: 12px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
    }

    @media (max-width: 480px) {
      font-size: 10px;
      font-weight: 600;
    }
  }
`;

/**
 * String line styles - Updated for unified column handling
 */
export const stringLineStyles = css`
  /* Grid positioning will be set via style prop */
  z-index: ${GridLayers.STRING_LINES};

  height: var(--string-thickness);
  background: var(--string-gradient);
  border-radius: calc(var(--string-thickness) / 2);
  box-shadow: var(--string-shadow);
  align-self: center; /* 在网格单元格中垂直居中 */

  /* 不同弦的厚度和纹理 */
  &[data-string="0"], /* 1st string */
  &[data-string="1"], /* 2nd string */
  &[data-string="2"] { /* 3rd string */
    --string-thickness: 2px;
    --string-gradient: linear-gradient(to right, #F0F0F0, #D0D0D0, #F0F0F0);
    --string-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &[data-string="3"], /* 4th string */
  &[data-string="4"], /* 5th string */
  &[data-string="5"] { /* 6th string */
    --string-thickness: 4px;
    --string-gradient: repeating-linear-gradient(
      75deg,
      #A0826D 0px,
      #E8E8E8 0.8px,
      #F0F0F0 1.6px,
      #E8E8E8 2.4px,
      #A0826D 3.2px
    );
    --string-shadow: 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
  }
`;

/**
 * Placeholder row styles for future functionality
 */
export const placeholderRowStyles = css`
  z-index: ${GridLayers.STRING_LINES};

  /* Invisible placeholder - no visual styling by default */
  background: transparent;
  border: none;
  height: 100%;

  /* Span all columns */
  grid-column: 1 / -1;

  /* For debugging - uncomment to see placeholder rows */
  /* background: rgba(255, 0, 0, 0.1); */
  /* border: 1px dashed rgba(255, 0, 0, 0.3); */
`;

/**
 * Marker wrapper styles for note positioning
 */
export const markerWrapperStyles = css`
  z-index: ${GridLayers.MARKER_WRAPPER};

  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  /* Invisible container - no visual styling */
  background: transparent;
  border: none;
  pointer-events: auto; /* Allow interaction for future features */
`;

/**
 * Enhanced base note marker styles with optimized responsive design
 * Focuses on sizing and positioning, visual appearance handled by shared styles
 */
export const baseNoteMarkerStyles = css`
  justify-self: center;
  align-self: center;

  /* Enhanced size calculation using CSS variables with responsive ratios */
  width: calc(var(--string-height) * var(--marker-size-ratio, 0.64));
  height: calc(var(--string-height) * var(--marker-size-ratio, 0.64));
  font-size: calc(var(--string-height) * var(--font-size-ratio, 0.28));

  /* Minimum usable size for accessibility */
  min-width: 20px;
  min-height: 20px;

  /* Comprehensive responsive size adjustments with fallback values */
  @media (max-width: 1199px) {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  @media (max-width: 1023px) {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }

  @media (max-width: 767px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 639px) {
    width: 27px;
    height: 27px;
    font-size: 12px;
    min-width: 27px;
    min-height: 27px;
  }

  @media (max-width: 479px) {
    width: 26px;
    height: 26px;
    font-size: 11px;
    min-width: 26px;
    min-height: 26px;
  }

  @media (max-width: 359px) {
    width: 25px;
    height: 25px;
    font-size: 10px;
    min-width: 25px;
    min-height: 25px;
    font-weight: 600;
  }

  /* Enhanced touch device optimization */
  @media (hover: none) and (pointer: coarse) {
    min-width: 28px;
    min-height: 28px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);

    /* Better touch feedback */
    &:active {
      transform: scale(0.95);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    }
  }

  /* Ultra-wide screen optimization */
  @media (min-width: 2560px) {
    width: calc(var(--string-height) * 0.60);
    height: calc(var(--string-height) * 0.60);
    font-size: calc(var(--string-height) * 0.26);
    max-width: 48px;
    max-height: 48px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border: 2px solid currentColor;
    text-shadow: none;
    font-weight: bold;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    &:active {
      transform: none;
    }
  }

  /* Focus styles for keyboard navigation */
  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;

    @media (max-width: 767px) {
      outline-width: 1px;
      outline-offset: 1px;
    }
  }
`;

/**
 * Regular note marker styles (for fretted notes)
 * Uses direct CSS Grid positioning instead of CSS custom properties
 */
export const noteMarkerStyles = css`
  ${baseNoteMarkerStyles}
  z-index: ${GridLayers.NOTE_MARKERS};
  /* Grid positioning (gridRow and gridColumn) will be set via style prop */
`;