/**
 * Reusable component styles
 * Common UI patterns used across the application
 *
 * 设计模式：
 * 1. 组合优于继承 - 通过小而专的样式组合构建复杂样式
 * 2. 原子设计 - 从基础样式到复合组件的层次结构
 * 3. 一致性 - 统一的交互行为和视觉效果
 *
 * 使用示例：
 * ```typescript
 * import { primaryButton, flexCenter } from './components'
 *
 * const myButton = css`
 *   ${primaryButton}
 *   ${flexCenter}
 *   // 只添加组件特定样式
 *   margin-top: 1rem;
 * `
 * ```
 */

import { css } from '@emotion/react'
import { media, touchFriendly } from './responsive'

/**
 * Base button styles
 */
export const baseButton = css`
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: 2px solid #45B7D1;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${media.reducedMotion} {
    transition: none;
  }
`

/**
 * Primary button variant
 */
export const primaryButton = css`
  ${baseButton}
  ${touchFriendly}
  background: #45B7D1;
  color: white;
  border: 1px solid #45B7D1;

  &:hover:not(:disabled) {
    background: #3a9bc1;
    border-color: #3a9bc1;
  }

  &:active:not(:disabled) {
    background: #2e8ba8;
  }
`

/**
 * Secondary button variant
 */
export const secondaryButton = css`
  ${baseButton}
  ${touchFriendly}
  background: white;
  color: #333;
  border: 1px solid #ddd;

  &:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #45B7D1;
  }

  &:active:not(:disabled) {
    background: #e9ecef;
  }
`

/**
 * Toggle button styles
 */
export const toggleButton = css`
  ${baseButton}
  flex: 1;
  padding: 10px 16px;
  background: transparent;
  border-radius: 6px;
  font-size: 14px;
  position: relative;
  z-index: 2;

  ${media.lg} {
    padding: 14px 20px;
    font-size: 16px;
    min-height: 48px;
  }

  ${media.sm} {
    padding: 12px 18px;
    font-size: 14px;
    min-height: 44px;
  }
`

export const activeToggleButton = css`
  background: white;
  color: #45B7D1;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

export const inactiveToggleButton = css`
  color: #666;

  &:hover {
    color: #333;
  }
`

/**
 * Form label styles
 */
export const formLabel = css`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  display: block;
`

/**
 * Container with background
 */
export const backgroundContainer = css`
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  position: relative;
`

/**
 * Scrollbar styles
 */
export const customScrollbar = css`
  &::-webkit-scrollbar {
    height: 8px;

    ${media.xl} {
      height: 10px;
    }

    ${media.lg} {
      height: 12px;
    }

    ${media.sm} {
      height: 14px;
    }
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;

    ${media.lg} {
      background: #e1e1e1;
    }
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    ${media.lg} {
      background: #999;
    }

    ${media.sm} {
      background: #777;
    }
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;

    ${media.lg} {
      background: #666;
    }
  }

  ${media.highContrast} {
    &::-webkit-scrollbar-track {
      background: #000000;
    }

    &::-webkit-scrollbar-thumb {
      background: #ffffff;
      border: 1px solid #000000;
    }
  }
`

/**
 * Card/panel styles
 */
export const card = css`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;

  ${media.lg} {
    padding: 0.75rem;
  }

  ${media.sm} {
    padding: 0.5rem;
  }
`

/**
 * Flex utilities
 */
export const flexColumn = css`
  display: flex;
  flex-direction: column;
`

export const flexRow = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`