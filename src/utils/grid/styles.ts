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
 * CSS custom properties for responsive grid variables
 */
export const responsiveGridVariables = css`
  /* 桌面端默认值 */
  --open-string-width: 80px;
  --fret-width: 80px;
  --string-height: 50px;

  @media (max-width: 1024px) {
    --open-string-width: 70px;
    --fret-width: 70px;
    --string-height: 45px;
  }

  @media (max-width: 768px) {
    --open-string-width: 60px;
    --fret-width: 60px;
    --string-height: 40px;
  }

  @media (max-width: 480px) {
    --open-string-width: 50px;
    --fret-width: 50px;
    --string-height: 35px;
  }
`;

/**
 * Main fretboard grid container styles
 */
export const fretboardGridStyles = css`
  ${responsiveGridVariables} /* 确保CSS变量在网格容器中可用 */

  display: grid;
  grid-template-columns: var(--open-string-width) repeat(var(--fret-count), var(--fret-width));
  grid-template-rows: repeat(6, var(--string-height));

  /* 为品格编号留出上下空间 */
  padding: var(--string-height) 0; /* 上下各留出一行高度的空间 */

  /* 滚动设置 */
  overflow-x: auto;
  overflow-y: hidden;

  /* 指板背景 */
  background: linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #8B4513 100%);
  border: 2px solid #654321;
  border-radius: 8px;

  /* 触摸友好的滚动 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* 响应式调整 */
  @media (max-width: 1024px) {
    border-radius: 6px;
  }

  @media (max-width: 768px) {
    border-radius: 4px;
  }

  /* 增强的滚动条样式 */
  &::-webkit-scrollbar {
    height: 12px;

    @media (max-width: 768px) {
      height: 8px;
    }
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

/**
 * Fret line styles
 */
export const fretLineStyles = css`
  /* Grid positioning will be set via style prop */
  z-index: ${GridLayers.FRET_LINES};

  width: 3px;
  height: 100%; /* Ensure fret lines span the full height of the grid */
  background: linear-gradient(to bottom, #FFD700, #FFA500, #FFD700);
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
  border-radius: 1.5px;
  justify-self: right; /* 在网格单元格中居右*/
  position: relative; /* 为伪元素定位 */

  /* 品格编号伪元素 */
  &::before {
    content: attr(data-fret-number);
    position: absolute;
    top: calc(-1 * var(--string-height)/2 - 1em /2); /* 位于指板padding区域内 */
    left: 50%;
    transform: translateX(-50%);

    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);

    /* 响应式字体大小 */
    @media (max-width: 1024px) {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      font-size: 12px;
    }

    @media (max-width: 480px) {
      font-size: 10px;
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
 * Open string mask layer styles
 */
export const openStringMaskStyles = css`
  grid-column: 1;
  grid-row: 1 / -1; /* 跨越所有行 */
  z-index: ${GridLayers.OPEN_STRING_MASK};

  position: sticky;
  left: 0;

  /* 确保元素填满整个网格区域 */
  align-self: stretch; /* 覆盖父容器的默认对齐 */
  height: 100%; /* 确保高度填满 */

  /* 与指板底色相同的背景遮挡 */
  background: linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #8B4513 100%);

  /* 可选的分隔线 */
  border-right: 1px solid rgba(0, 0, 0, 0.1);

  /* 确保不会遮挡空弦标记 */
  pointer-events: none; /* 允许点击穿透到空弦标记 */

  /* 空弦编号伪元素 - 位于品丝上方 */
  &::before {
    content: "0";
    position: absolute;
    top: calc(-1 * var(--string-height)/2 - 1em/2); /* 位于指板padding区域内 */
    right: 1.5px; /* 对齐右侧品丝 */
    transform: translateX(50%);

    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    pointer-events: auto; /* 恢复伪元素的点击事件 */

    /* 响应式字体大小 */
    @media (max-width: 1024px) {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      font-size: 12px;
    }

    @media (max-width: 480px) {
      font-size: 10px;
    }
  }

  /* 右侧品丝伪元素 - 使用品丝样式 */
  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;

    /* 品丝样式 */
    width: 3px;
    height: 100%;
    background: linear-gradient(to bottom, #FFD700, #FFA500, #FFD700);
    border-radius: 1.5px;
    pointer-events: auto; /* 恢复伪元素的点击事件 */

    /* 品丝投影效果 - 从整个遮罩层移动到品丝上 */
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.6), 2px 0 8px rgba(0, 0, 0, 0.3);
  }
`;

/**
 * Base note marker styles (shared by both regular and open string markers)
 */
export const baseNoteMarkerStyles = css`
  grid-row: var(--string-row);
  justify-self: center;
  align-self: center;
  z-index: ${GridLayers.NOTE_MARKERS};

  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: var(--note-color);

  /* 响应式尺寸调整 */
  @media (max-width: 1024px) {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    width: 26px;
    height: 26px;
    font-size: 11px;
  }
`;

/**
 * Regular note marker styles (for fretted notes)
 */
export const noteMarkerStyles = css`
  ${baseNoteMarkerStyles}
  grid-column: var(--note-column);
`;

/**
 * Open string marker styles (with sticky positioning)
 */
export const openStringMarkerStyles = css`
  ${baseNoteMarkerStyles}
  grid-column: 1;
  position: sticky;
  left: 0;
  z-index: ${GridLayers.OPEN_STRING_MARKERS}; /* 最顶层 */
`;