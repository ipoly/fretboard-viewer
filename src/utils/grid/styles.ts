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
 * Optimized for better mobile experience and smoother scaling
 */
export const responsiveGridVariables = css`
  /* 桌面端默认值 - 大屏幕优化 */
  --open-string-width: 85px;
  --fret-width: 85px;
  --string-height: 52px;
  --grid-gap: 2px;
  --border-radius: 8px;
  --scrollbar-height: 12px;

  /* 大平板 (1200px - 1024px) */
  @media (max-width: 1200px) {
    --open-string-width: 80px;
    --fret-width: 80px;
    --string-height: 50px;
    --grid-gap: 2px;
    --border-radius: 8px;
  }

  /* 平板 (1024px - 768px) */
  @media (max-width: 1024px) {
    --open-string-width: 72px;
    --fret-width: 72px;
    --string-height: 46px;
    --grid-gap: 1px;
    --border-radius: 6px;
    --scrollbar-height: 10px;
  }

  /* 小平板/大手机 (768px - 640px) */
  @media (max-width: 768px) {
    --open-string-width: 64px;
    --fret-width: 64px;
    --string-height: 42px;
    --grid-gap: 1px;
    --border-radius: 4px;
    --scrollbar-height: 8px;
  }

  /* 手机横屏 (640px - 480px) */
  @media (max-width: 640px) {
    --open-string-width: 56px;
    --fret-width: 56px;
    --string-height: 38px;
    --grid-gap: 0px;
    --border-radius: 4px;
  }

  /* 手机竖屏 (480px - 360px) */
  @media (max-width: 480px) {
    --open-string-width: 48px;
    --fret-width: 48px;
    --string-height: 34px;
    --grid-gap: 0px;
    --border-radius: 3px;
  }

  /* 小手机 (360px 及以下) */
  @media (max-width: 360px) {
    --open-string-width: 42px;
    --fret-width: 42px;
    --string-height: 30px;
    --grid-gap: 0px;
    --border-radius: 2px;
  }
`;

/**
 * Main fretboard grid container styles with enhanced responsive design
 */
export const fretboardGridStyles = css`
  ${responsiveGridVariables} /* 确保CSS变量在网格容器中可用 */

  display: grid;
  grid-template-columns: var(--open-string-width) repeat(var(--fret-count), var(--fret-width));
  grid-template-rows: repeat(6, var(--string-height));
  gap: var(--grid-gap, 0px); /* 使用响应式间距 */

  /* 为品格编号留出上下空间 */
  padding: var(--string-height) 0; /* 上下各留出一行高度的空间 */

  /* 滚动设置 */
  overflow-x: auto;
  overflow-y: hidden;

  /* 指板背景 */
  background: linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #8B4513 100%);
  border: 2px solid #654321;
  border-radius: var(--border-radius, 8px);

  /* 触摸友好的滚动 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* 响应式边框调整 */
  @media (max-width: 768px) {
    border-width: 1px; /* 更细的边框在小屏幕上 */
  }

  @media (max-width: 480px) {
    border-width: 1px;
    /* 在小屏幕上减少内边距 */
    padding: calc(var(--string-height) * 0.8) 0;
  }

  /* 增强的滚动条样式 - 响应式 */
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

    /* 在触摸设备上更明显的滚动条 */
    @media (max-width: 768px) {
      background: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.6);
      }
    }
  }

  /* 优化小屏幕的滚动体验 */
  @media (max-width: 480px) {
    /* 在小屏幕上启用动量滚动 */
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x proximity;

    /* 每个品格作为滚动停靠点 */
    & > * {
      scroll-snap-align: start;
    }
  }
`;

/**
 * Fret line styles with enhanced responsive design
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

  /* 响应式品丝宽度 */
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

  /* 品格编号伪元素 - 响应式定位和字体 */
  &::before {
    content: attr(data-fret-number);
    position: absolute;
    top: calc(-1 * var(--string-height)/2 - 1em /2); /* 位于指板padding区域内 */
    left: 50%;
    transform: translateX(-50%);

    /* 动态字体大小基于网格尺寸 */
    font-size: calc(var(--string-height) * 0.32);
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);

    /* 确保最小可读性 */
    min-font-size: 10px;

    /* 响应式字体大小微调 */
    @media (max-width: 1200px) {
      font-size: 16px;
    }

    @media (max-width: 1024px) {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      font-size: 12px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9); /* 增强对比度 */
    }

    @media (max-width: 640px) {
      font-size: 11px;
    }

    @media (max-width: 480px) {
      font-size: 10px;
      font-weight: 600; /* 在小屏幕上稍微加粗 */
    }

    @media (max-width: 360px) {
      font-size: 9px;
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
 * Open string mask layer styles with enhanced responsive design
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

  /* 响应式分隔线 */
  border-right: 1px solid rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    border-right-width: 0.5px; /* 更细的分隔线 */
  }

  /* 确保不会遮挡空弦标记 */
  pointer-events: none; /* 允许点击穿透到空弦标记 */

  /* 空弦编号伪元素 - 响应式定位和字体 */
  &::before {
    content: "0";
    position: absolute;
    top: calc(-1 * var(--string-height)/2 - 1em/2); /* 位于指板padding区域内 */
    right: 1.5px; /* 对齐右侧品丝 */
    transform: translateX(50%);

    /* 动态字体大小 */
    font-size: calc(var(--string-height) * 0.32);
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    pointer-events: auto; /* 恢复伪元素的点击事件 */

    /* 响应式字体大小微调 */
    @media (max-width: 1200px) {
      font-size: 16px;
    }

    @media (max-width: 1024px) {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      font-size: 12px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
    }

    @media (max-width: 640px) {
      font-size: 11px;
    }

    @media (max-width: 480px) {
      font-size: 10px;
      font-weight: 600;
    }

    @media (max-width: 360px) {
      font-size: 9px;
      font-weight: 600;
    }
  }

  /* 右侧品丝伪元素 - 响应式尺寸 */
  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;

    /* 响应式品丝样式 */
    width: 3px;
    height: 100%;
    background: linear-gradient(to bottom, #FFD700, #FFA500, #FFD700);
    border-radius: 1.5px;
    pointer-events: auto; /* 恢复伪元素的点击事件 */

    /* 品丝投影效果 */
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.6), 2px 0 8px rgba(0, 0, 0, 0.3);

    /* 响应式品丝宽度 */
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
 * Base note marker styles (unified for both regular and open string markers)
 * Enhanced responsive design with smoother scaling
 */
export const baseNoteMarkerStyles = css`
  justify-self: center;
  align-self: center;

  /* 基础尺寸使用CSS变量计算 */
  width: calc(var(--string-height) * 0.64); /* 动态计算基于弦高度 */
  height: calc(var(--string-height) * 0.64);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: calc(var(--string-height) * 0.28); /* 动态字体大小 */
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  /* 确保最小可用尺寸 */
  min-width: 20px;
  min-height: 20px;

  /* 响应式尺寸微调 - 基于断点的精确控制 */
  @media (max-width: 1200px) {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
    /* 在小屏幕上增强可见性 */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 640px) {
    width: 26px;
    height: 26px;
    font-size: 11px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 10px;
    /* 触摸友好的最小尺寸 */
    min-width: 24px;
    min-height: 24px;
  }

  @media (max-width: 360px) {
    width: 22px;
    height: 22px;
    font-size: 9px;
    /* 保持最小触摸目标 */
    min-width: 22px;
    min-height: 22px;
  }

  /* 触摸设备优化 */
  @media (hover: none) and (pointer: coarse) {
    /* 触摸设备上稍大的目标区域 */
    min-width: 28px;
    min-height: 28px;

    /* 更明显的视觉反馈 */
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