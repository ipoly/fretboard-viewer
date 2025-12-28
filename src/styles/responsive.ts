/**
 * Unified responsive design system
 * Centralized breakpoints and responsive utilities
 *
 * 核心设计原则：
 * 1. 单一数据源 - 所有断点定义在此处
 * 2. 语义化命名 - xs/sm/md/lg/xl 对应不同设备
 * 3. 移动优先 - 从小屏幕向大屏幕扩展
 *
 * 使用示例：
 * ```typescript
 * import { media, responsiveGridVariables } from './responsive'
 *
 * const myComponent = css`
 *   ${responsiveGridVariables}
 *   padding: 1rem;
 *
 *   ${media.lg} {
 *     padding: 0.5rem;
 *   }
 * `
 * ```
 */

import { css } from '@emotion/react'

/**
 * Standard breakpoints used across the application
 */
export const breakpoints = {
  xs: '359px',      // Extra small mobile
  sm: '479px',      // Small mobile
  md: '639px',      // Mobile
  lg: '767px',      // Small tablet
  xl: '1023px',     // Tablet
  xxl: '1199px',    // Large tablet
  xxxl: '2560px'    // Ultra-wide
} as const

/**
 * Media query helpers
 */
export const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  xxl: `@media (max-width: ${breakpoints.xxl})`,
  ultraWide: `@media (min-width: ${breakpoints.xxxl})`,

  // Special queries
  touch: '@media (hover: none) and (pointer: coarse)',
  highContrast: '@media (prefers-contrast: high)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',

  // iPad specific
  ipad: '@media (min-width: 768px) and (max-width: 1200px)'
} as const

/**
 * Responsive grid variables for fretboard components
 */
export const responsiveGridVariables = css`
  /* Desktop default values (1200px+) */
  --fret-width: 80px;
  --string-height: 50px;
  --grid-gap: 2px;
  --border-radius: 8px;
  --scrollbar-height: 12px;
  --marker-size-ratio: 0.64;
  --font-size-ratio: 0.28;

  /* Large tablet (1024px - 1199px) */
  ${media.xxl} {
    --fret-width: 75px;
    --string-height: 47px;
    --grid-gap: 1px;
    --scrollbar-height: 11px;
  }

  /* Tablet (768px - 1023px) */
  ${media.xl} {
    --fret-width: 70px;
    --string-height: 45px;
    --grid-gap: 1px;
    --border-radius: 6px;
    --scrollbar-height: 10px;
  }

  /* Small tablet (640px - 767px) */
  ${media.lg} {
    --fret-width: 65px;
    --string-height: 42px;
    --grid-gap: 0px;
    --border-radius: 5px;
    --scrollbar-height: 9px;
  }

  /* Mobile (480px - 639px) */
  ${media.md} {
    --fret-width: 60px;
    --string-height: 40px;
    --grid-gap: 0px;
    --border-radius: 4px;
    --scrollbar-height: 8px;
    --marker-size-ratio: 0.68;
    --font-size-ratio: 0.30;
  }

  /* Small mobile (360px - 479px) */
  ${media.sm} {
    --fret-width: 55px;
    --string-height: 38px;
    --grid-gap: 0px;
    --border-radius: 3px;
    --scrollbar-height: 6px;
    --marker-size-ratio: 0.70;
    --font-size-ratio: 0.32;
  }

  /* Extra small mobile (320px - 359px) */
  ${media.xs} {
    --fret-width: 50px;
    --string-height: 35px;
    --grid-gap: 0px;
    --border-radius: 2px;
    --scrollbar-height: 5px;
    --marker-size-ratio: 0.72;
    --font-size-ratio: 0.34;
  }

  /* Ultra-wide screens (2560px+) */
  ${media.ultraWide} {
    --fret-width: 100px;
    --string-height: 60px;
    --grid-gap: 3px;
    --border-radius: 12px;
    --scrollbar-height: 16px;
    --marker-size-ratio: 0.60;
    --font-size-ratio: 0.26;
  }
`

/**
 * Common responsive spacing utilities
 */
export const spacing = {
  responsive: css`
    padding: 0 1rem;

    ${media.xl} {
      padding: 0 0.75rem;
    }

    ${media.lg} {
      padding: 0 0.5rem;
    }

    ${media.sm} {
      padding: 0 0.25rem;
    }

    ${media.xs} {
      padding: 0 0.125rem;
    }
  `,

  responsiveMargin: css`
    margin-top: 1.5rem;

    ${media.xl} {
      margin-top: 1.25rem;
    }

    ${media.lg} {
      margin-top: 1rem;
    }

    ${media.sm} {
      margin-top: 0.75rem;
    }

    ${media.xs} {
      margin-top: 0.5rem;
    }
  `
} as const

/**
 * Touch-friendly button sizing
 */
export const touchFriendly = css`
  min-height: 44px;
  min-width: 44px;

  ${media.lg} {
    min-height: 48px;
    padding: 14px 20px;
    font-size: 16px;
  }

  ${media.sm} {
    min-height: 44px;
    padding: 12px 18px;
    font-size: 14px;
  }

  ${media.touch} {
    &:active {
      transform: scale(0.95);
    }
  }
`