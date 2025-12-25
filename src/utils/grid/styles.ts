/**
 * CSS Grid styles for fretboard components
 *
 * This module provides CSS-in-JS styles for the CSS Grid-based fretboard layout.
 */

import { css } from '@emotion/react';

// Define GridLayers locally to avoid circular imports
const GridLayers = {
  FRET_LINES: 1,           // 品丝 - 最底层
  STRING_LINES: 2,         // 弦线 - 第二层
  NOTE_MARKERS: 3,         // 音符标记 - 第三层
  OPEN_STRING_MASK: 4,     // 空弦遮罩层 - 第四层
  OPEN_STRING_MARKERS: 5   // 空弦标记 - 最顶层
} as const;

/**
 * Enhanced CSS custom properties for responsive grid variables
 * Optimized with fewer breakpoints and better performance
 */
export const responsiveGridVariables = css`
  /* Desktop default values - optimized for performance */
  --open-string-width: 85px;
  --fret-width: 85px;
  --string-height: 52px;
  --grid-gap: 2px;
  --border-radius: 8px;
  --scrollbar-height: 12px;

  /* Tablet (1024px and below) - consolidated breakpoint */
  @media (max-width: 1024px) {
    --open-string-width: 72px;
    --fret-width: 72px;
    --string-height: 46px;
    --grid-gap: 1px;
    --border-radius: 6px;
    --scrollbar-height: 10px;
  }

  /* Mobile (768px and below) - consolidated breakpoint */
  @media (max-width: 768px) {
    --open-string-width: 56px;
    --fret-width: 56px;
    --string-height: 38px;
    --grid-gap: 0px;
    --border-radius: 4px;
    --scrollbar-height: 8px;
  }

  /* Small mobile (480px and below) - final breakpoint */
  @media (max-width: 480px) {
    --open-string-width: 48px;
    --fret-width: 48px;
    --string-height: 34px;
    --grid-gap: 0px;
    --border-radius: 3px;
  }
`;

/**
 * Main fretboard grid container styles with optimized responsive design
 */
export const fretboardGridStyles = css`
  ${responsiveGridVariables} /* Ensure CSS variables are available in grid container */

  display: grid;
  grid-template-columns: var(--open-string-width) repeat(var(--fret-count), var(--fret-width));
  grid-template-rows: repeat(6, var(--string-height));
  gap: var(--grid-gap, 0px);

  /* Optimized padding using CSS variables */
  padding: var(--string-height) 0;

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
 * String line styles
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
 * Open string mask layer styles with optimized responsive design
 */
export const openStringMaskStyles = css`
  grid-column: 1;
  grid-row: 1 / -1;
  z-index: ${GridLayers.OPEN_STRING_MASK};

  position: sticky;
  left: 0;
  align-self: stretch;
  height: 100%;

  /* Background matching fretboard */
  background: linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #8B4513 100%);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  pointer-events: none;

  /* Responsive border */
  @media (max-width: 768px) {
    border-right-width: 0.5px;
  }

  /* Optimized open string number pseudo-element */
  &::before {
    content: "0";
    position: absolute;
    top: calc(-1 * var(--string-height) / 2 - 0.5em);
    right: 1.5px;
    transform: translateX(50%);

    font-size: calc(var(--string-height) * 0.32);
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    pointer-events: auto;

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

  /* Optimized right fret pseudo-element */
  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;

    width: 3px;
    height: 100%;
    background: linear-gradient(to bottom, #FFD700, #FFA500, #FFD700);
    border-radius: 1.5px;
    pointer-events: auto;
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.6), 2px 0 8px rgba(0, 0, 0, 0.3);

    /* Responsive fret width */
    @media (max-width: 768px) {
      width: 2px;
      border-radius: 1px;
      box-shadow: 0 0 4px rgba(255, 215, 0, 0.6), 1px 0 6px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 480px) {
      width: 1.5px;
      border-radius: 0.75px;
      box-shadow: 0 0 3px rgba(255, 215, 0, 0.5), 1px 0 4px rgba(0, 0, 0, 0.3);
    }
  }
`;

/**
 * Base note marker styles with optimized responsive design
 */
export const baseNoteMarkerStyles = css`
  justify-self: center;
  align-self: center;

  /* Optimized size calculation using CSS variables */
  width: calc(var(--string-height) * 0.64);
  height: calc(var(--string-height) * 0.64);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: calc(var(--string-height) * 0.28);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  /* Minimum usable size */
  min-width: 20px;
  min-height: 20px;

  /* Simplified responsive size adjustments */
  @media (max-width: 1024px) {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 10px;
    min-width: 24px;
    min-height: 24px;
  }

  /* Touch device optimization */
  @media (hover: none) and (pointer: coarse) {
    min-width: 28px;
    min-height: 28px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
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

/**
 * Open string marker styles (with sticky positioning)
 * Uses direct CSS Grid positioning and sticky behavior
 */
export const openStringMarkerStyles = css`
  ${baseNoteMarkerStyles}
  grid-column: 1; /* Always in first column */
  position: sticky;
  left: 0;
  z-index: ${GridLayers.OPEN_STRING_MARKERS}; /* Highest layer */
  /* gridRow will be set via style prop */
`;