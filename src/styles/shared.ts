/**
 * Shared styles for music theory components
 * Common visual elements used across markers and legend
 *
 * 核心概念：
 * 1. 视觉一致性 - 记号和图例使用相同的视觉效果
 * 2. 工厂模式 - 根据音阶度数生成对应颜色
 * 3. 可扩展性 - 易于添加新的音阶度数或颜色主题
 *
 * 使用示例：
 * ```typescript
 * import { circularMarkerBase, getScaleDegreeColorClass } from './shared'
 *
 * const myMarker = css`
 *   ${circularMarkerBase}
 *   ${getScaleDegreeColorClass(1)} // 主音颜色
 *   // 组件特定样式
 *   width: 32px;
 *   height: 32px;
 * `
 * ```
 */

import { css } from '@emotion/react'
import { SCALE_DEGREE_COLORS } from '../utils/constants/music'

/**
 * Base circular marker styles - shared between fretboard markers and legend circles
 * Provides consistent visual appearance with inset shadow effect
 */
export const circularMarkerBase = css`
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
`

/**
 * Scale degree background color classes
 * Provides consistent coloring across all components
 */
export const scaleDegreeColors = {
  1: css`background-color: ${SCALE_DEGREE_COLORS[1]};`, // Root - Red
  2: css`background-color: ${SCALE_DEGREE_COLORS[2]};`, // 2nd - Teal
  3: css`background-color: ${SCALE_DEGREE_COLORS[3]};`, // 3rd - Blue
  4: css`background-color: ${SCALE_DEGREE_COLORS[4]};`, // 4th - Green
  5: css`background-color: ${SCALE_DEGREE_COLORS[5]};`, // 5th - Yellow
  6: css`background-color: ${SCALE_DEGREE_COLORS[6]};`, // 6th - Plum
  7: css`background-color: ${SCALE_DEGREE_COLORS[7]};`, // 7th - Mint
} as const

/**
 * Get the CSS class for a scale degree background color
 */
export function getScaleDegreeColorClass(degree: number | null | undefined) {
  if (!degree || !(degree in scaleDegreeColors)) {
    return css`background-color: #999999;`
  }
  return scaleDegreeColors[degree as keyof typeof scaleDegreeColors]
}