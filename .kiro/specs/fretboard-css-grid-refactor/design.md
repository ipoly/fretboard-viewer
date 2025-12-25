# Design Document: 吉他指板 CSS Grid 重构

## Overview

本设计文档描述了如何将现有的基于 JavaScript 像素计算的吉他指板布局重构为使用 CSS Grid 系统的实现。重构的目标是简化代码、提高性能、改善可维护性，同时保持与现有实现完全一致的视觉外观和功能。

新的实现将利用 CSS Grid 的原生布局能力，消除复杂的位置计算，并通过网格坐标系统提供更直观的元素定位方式。

## Architecture

### 核心设计原则

1. **网格优先**: 使用 CSS Grid 作为主要布局系统，替代像素计算
2. **层级分离**: 通过 z-index 和网格层级管理不同元素的显示顺序
3. **粘性定位**: 空弦列使用 sticky positioning 保持固定可见
4. **响应式适配**: 网格系统自适应不同屏幕尺寸
5. **向后兼容**: 保持现有组件接口和功能不变

### 技术栈保持不变

- **React 19** with TypeScript
- **Emotion** for CSS-in-JS styling
- **现有的音乐理论工具函数**
- **现有的状态管理和 props 接口**

### 新增技术要素

- **CSS Grid Layout**: 主要布局系统
- **CSS Sticky Positioning**: 空弦列固定定位
- **CSS Custom Properties**: 动态网格尺寸控制
- **CSS Layering**: z-index 层级管理系统

## Components and Interfaces

### 重构后的 FretboardGrid 组件

#### 保持不变的接口

```typescript
interface FretboardGridProps {
  selectedKey: MusicalKey;
  displayMode: DisplayMode;
  fretCount: number;
}
```

#### 新增的内部类型定义

```typescript
interface GridDimensions {
  columns: number;        // fretCount + 1 (包含空弦列)
  rows: number;          // 6 (弦的数量)
  cellWidth: string;     // CSS Grid 列宽
  cellHeight: string;    // CSS Grid 行高
}

interface GridPosition {
  column: number;        // 网格列位置 (1-based)
  row: number;          // 网格行位置 (1-based)
  layer: number;        // z-index 层级
}

interface StickyColumnConfig {
  position: 'sticky';
  left: 0;
  zIndex: number;
  background: string;    // 与指板底色相同的背景
}
```

### CSS Grid 布局结构

#### 网格定义

```css
.fretboard-grid {
  display: grid;
  grid-template-columns: var(--open-string-width) repeat(var(--fret-count), var(--fret-width));
  grid-template-rows: repeat(6, var(--string-height));
  align-items: start;    /* 防止元素拉伸，支持 sticky positioning */
  overflow-x: auto;
  overflow-y: hidden;
}
```

#### 响应式网格变量

```css
:root {
  /* 桌面端 */
  --open-string-width: 80px;
  --fret-width: 80px;
  --string-height: 50px;
}

@media (max-width: 1024px) {
  :root {
    --open-string-width: 70px;
    --fret-width: 70px;
    --string-height: 45px;
  }
}

@media (max-width: 768px) {
  :root {
    --open-string-width: 60px;
    --fret-width: 60px;
    --string-height: 40px;
  }
}

@media (max-width: 480px) {
  :root {
    --open-string-width: 50px;
    --fret-width: 50px;
    --string-height: 35px;
  }
}
```

## Data Models

### 网格坐标系统

#### 坐标映射规则

```typescript
// 弦号到网格行的映射 (1-based grid system)
function stringToGridRow(stringIndex: number): number {
  return stringIndex + 1; // 0-based string index -> 1-based grid row
}

// 品格号到网格列的映射
function fretToGridColumn(fretNumber: number): number {
  return fretNumber + 2; // +1 for 1-based, +1 for open string column
}

// 空弦列固定在第一列
const OPEN_STRING_COLUMN = 1;
```

**坐标计算详解：**

网格布局结构：

```
列:  1      2      3      4      5      6  ...
    空弦   品格0   品格1   品格2   品格3   品格4 ...
行1  E弦(5)  ●      ●      ●      ●      ●
行2  A弦(4)  ●      ●      ●      ●      ●
行3  D弦(3)  ●      ●      ●      ●      ●
行4  G弦(2)  ●      ●      ●      ●      ●
行5  B弦(1)  ●      ●      ●      ●      ●
行6  E弦(0)  ●      ●      ●      ●      ●
```

**计算逻辑：**

1. **弦号映射**: 弦索引(0-5) → 网格行(1-6)
   - `gridRow = stringIndex + 1`
   - 例：第1弦(stringIndex=0) → 第6行(gridRow=6)

2. **品格号映射**: 品格号(0-N) → 网格列(2-N+2)
   - `gridColumn = fretNumber + 2`
   - +1: CSS Grid 是 1-based 坐标
   - +1: 第一列被空弦占用
   - 例：第5品格(fretNumber=5) → 第7列(gridColumn=7)

**实际例子：**

- 第1弦第12品格的音符: gridRow=1, gridColumn=14
- 第6弦第0品格的音符: gridRow=6, gridColumn=2
- 第3弦空弦音符: gridRow=4, gridColumn=1 (粘性列)

#### 网格元素定位

```typescript
interface GridElement {
  gridColumn: number;
  gridRow: number;
  zIndex: number;
  element: 'fret-line' | 'string-line' | 'note-marker' | 'open-string-marker';
}

// 品丝定位
const fretLinePosition = (fretNumber: number): GridElement => ({
  gridColumn: fretToGridColumn(fretNumber),
  gridRow: 1, // span all rows: 1 / -1
  zIndex: 1,
  element: 'fret-line'
});

// 弦线定位
const stringLinePosition = (stringIndex: number): GridElement => ({
  gridColumn: 2, // span from column 2 to end: 2 / -1
  gridRow: stringToGridRow(stringIndex),
  zIndex: 2,
  element: 'string-line'
});

// 空弦标记定位（包含空弦音符标记）
const openStringMarkerPosition = (stringIndex: number): GridElement => ({
  gridColumn: OPEN_STRING_COLUMN, // 固定在第一列
  gridRow: stringToGridRow(stringIndex),
  zIndex: 4, // 最高层级
  element: 'open-string-marker'
});

// 普通音符标记定位（品格上的音符）
const noteMarkerPosition = (stringIndex: number, fretNumber: number): GridElement => ({
  gridColumn: fretToGridColumn(fretNumber),
  gridRow: stringToGridRow(stringIndex),
  zIndex: 3,
  element: 'note-marker'
});
```

**空弦音符标记的特殊处理：**

```typescript
// 使用 CSS 类名和独立遮罩层的渲染逻辑
const renderFretboard = () => {
  return (
    <div className="fretboard-grid">
      {/* 独立的空弦遮罩层 */}
      <div className="open-string-mask" />

      {/* 品丝 */}
      {Array.from({ length: fretCount }, (_, fret) => (
        <div
          key={`fret-${fret + 1}`}
          className="fret-line"
          style={{ '--fret-column': fret + 2 } as React.CSSProperties}
        />
      ))}

      {/* 弦线 */}
      {STANDARD_TUNING.map((_, stringIndex) => (
        <div
          key={`string-${stringIndex}`}
          className="string-line"
          data-string={stringIndex}
          style={{ '--string-row': stringIndex + 1 } as React.CSSProperties}
        />
      ))}

      {/* 音符标记 */}
      {fretPositions.map(position => (
        <NoteMarker
          key={`note-${position.string}-${position.fret}`}
          position={position}
          displayMode={displayMode}
        />
      ))}
    </div>
  );
};

const NoteMarker = ({ position, displayMode }: { position: FretPosition, displayMode: DisplayMode }) => {
  const isOpenString = position.fret === 0;

  return (
    <div
      className={isOpenString ? 'open-string-marker' : 'note-marker'}
      data-string={position.string}
      data-fret={position.fret}
      data-scale-degree={position.scaleDegree}
      style={{
        '--note-color': getColorForScaleDegree(position.scaleDegree),
        '--string-row': position.string + 1,
        '--note-column': isOpenString ? 1 : position.fret + 2
      } as React.CSSProperties}
    >
      <span>
        {displayMode === 'notes' ? position.note : position.scaleDegree}
      </span>
    </div>
  );
};
```

```

### 层级管理系统

#### Z-Index 层级定义

```typescript
enum GridLayers {
  FRET_LINES = 1,           // 品丝 - 最底层
  STRING_LINES = 2,         // 弦线 - 第二层
  NOTE_MARKERS = 3,         // 音符标记 - 第三层
  OPEN_STRING_MASK = 4,     // 空弦遮罩层 - 第四层
  OPEN_STRING_MARKERS = 5   // 空弦标记 - 最顶层
}
```

#### 粘性列配置

```typescript
interface StickyColumnStyle {
  position: 'sticky';
  left: 0;
  zIndex: GridLayers.OPEN_STRING_MARKERS;
  background: 'transparent'; // 空弦标记本身不需要背景
}

interface OpenStringMaskStyle {
  position: 'sticky';
  left: 0;
  zIndex: GridLayers.OPEN_STRING_MASK;
  background: 'linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #8B4513 100%)'; // 与指板底色相同
  width: '100%';
  height: '100%';
}
```

## Visual Design Implementation

### CSS Grid 样式系统

#### 主网格容器

```css
.fretboard-grid {
  display: grid;
  grid-template-columns: var(--open-string-width) repeat(var(--fret-count), var(--fret-width));
  grid-template-rows: repeat(6, var(--string-height));

  /* 关键设置：防止子元素拉伸 */
  align-items: start;

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
}
```

#### 品丝样式

```css
.fret-line {
  grid-column: var(--fret-column);
  grid-row: 1 / -1; /* 跨越所有行 */
  z-index: 1;

  width: 3px;
  background: linear-gradient(to bottom, #FFD700, #FFA500, #FFD700);
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
  border-radius: 1.5px;
  justify-self: center; /* 在网格单元格中居中 */
}
```

#### 弦线样式

```css
.string-line {
  grid-column: 2 / -1; /* 从第二列开始到最后一列 */
  grid-row: var(--string-row);
  z-index: 2;

  height: var(--string-thickness);
  background: var(--string-gradient);
  border-radius: calc(var(--string-thickness) / 2);
  box-shadow: var(--string-shadow);
  align-self: center; /* 在网格单元格中垂直居中 */
}

/* 不同弦的厚度和纹理 */
.string-line[data-string="0"], /* 1st string */
.string-line[data-string="1"], /* 2nd string */
.string-line[data-string="2"] { /* 3rd string */
  --string-thickness: 2px;
  --string-gradient: linear-gradient(to right, #F0F0F0, #D0D0D0, #F0F0F0);
  --string-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.string-line[data-string="3"], /* 4th string */
.string-line[data-string="4"], /* 5th string */
.string-line[data-string="5"] { /* 6th string */
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
```

#### 音符标记样式

```css
.note-marker {
  grid-column: var(--note-column);
  grid-row: var(--note-row);
  z-index: 3;

  justify-self: center;
  align-self: center;

  /* 保持现有的音符标记样式 */
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
}
```

#### 音符标记样式系统

```css
/* 独立的空弦遮罩层 */
.open-string-mask {
  grid-column: 1;
  grid-row: 1 / -1; /* 跨越所有行 */
  z-index: 4;

  position: sticky;
  left: 0;

  /* 与指板底色相同的背景遮挡 */
  background: linear-gradient(to bottom, #8B4513 0%, #A0522D 50%, #8B4513 100%);

  /* 可选的分隔线 */
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

/* 统一的音符标记样式 */
.note-marker,
.open-string-marker {
  grid-row: var(--string-row);
  justify-self: center;
  align-self: center;
  z-index: 5; /* 统一层级，都在遮罩层之上 */

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
}

/* 普通音符标记 - 使用计算的列位置 */
.note-marker {
  grid-column: var(--note-column);
}

/* 空弦音符标记 - 唯一区别是粘性定位 */
.open-string-marker {
  grid-column: 1;
  position: sticky;
  left: 0;
}
```

### 品格数字标记

#### 品格数字容器

```css
.fret-numbers {
  display: grid;
  grid-template-columns: var(--open-string-width) repeat(var(--fret-count), var(--fret-width));
  grid-template-rows: 30px; /* 固定高度 */

  /* 定位在指板上方 */
  margin-bottom: 10px;
}

.fret-number {
  grid-column: var(--fret-column);
  grid-row: 1;

  justify-self: center;
  align-self: center;

  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* 空弦列的数字（显示 "0"） */
.fret-number--open {
  grid-column: 1;
}
```

## Performance Optimizations

### CSS Grid 性能优势

1. **原生布局引擎**: 浏览器原生优化的网格布局，比 JavaScript 计算更高效
2. **减少重排重绘**: 网格变化时只影响相关区域，不需要重新计算整个布局
3. **GPU 加速**: CSS Grid 和 transforms 可以利用 GPU 加速
4. **内存效率**: 消除大量的 JavaScript 对象和计算缓存

### 代码简化效果

#### 移除的复杂计算

```typescript
// 移除这些复杂的像素计算
const fretWidth = 80;
const totalWidth = (fretCount + 1) * fretWidth;
const fretPositions_px = Array.from({ length: fretCount + 1 }, (_, i) => i * fretWidth);
const leftPadding = fretWidth;
const rightPadding = { desktop: fretWidth * 0.75, /* ... */ };
const bottomPadding = { desktop: stringSpacing * 0.8, /* ... */ };
```

#### 简化的网格定位

```typescript
// 新的简化定位方式
const noteGridPosition = {
  gridColumn: fretNumber + 2, // 简单的数学映射
  gridRow: stringIndex + 1,
  zIndex: 3
};
```

### 响应式优化

#### CSS 变量驱动的响应式设计

```css
/* 通过 CSS 变量统一管理尺寸 */
@media (max-width: 768px) {
  :root {
    --fret-width: 60px;
    --string-height: 40px;
    --open-string-width: 60px;
  }
}

/* 网格自动适应新的变量值 */
.fretboard-grid {
  grid-template-columns: var(--open-string-width) repeat(var(--fret-count), var(--fret-width));
  grid-template-rows: repeat(6, var(--string-height));
}
```

## Error Handling

### 网格布局错误处理

#### 网格布局安全边界

```css
/* 确保网格在极端情况下不会崩溃 */
.fretboard-grid {
  min-width: 0; /* 防止网格溢出 */
  min-height: 0;
}

/* 网格项目的安全边界 */
.fretboard-grid > * {
  min-width: 0;
  min-height: 0;
  max-width: 100%;
  max-height: 100%;
}
```

### 响应式降级处理

#### 极端屏幕尺寸处理

```css
/* 超小屏幕的最小尺寸保证 */
@media (max-width: 320px) {
  :root {
    --fret-width: 40px;
    --string-height: 30px;
    --open-string-width: 40px;
  }
}

/* 超大屏幕的最大尺寸限制 */
@media (min-width: 2560px) {
  :root {
    --fret-width: 100px;
    --string-height: 60px;
    --open-string-width: 100px;
  }
}
```

## Testing Strategy

### 双重测试方法

重构将使用单元测试和基于属性的测试来确保全面覆盖：

- **单元测试**: 验证特定示例、边缘情况和错误条件
- **属性测试**: 通过随机化测试验证所有输入的通用属性

### 单元测试重点领域

- 网格坐标计算函数的正确性
- 响应式变量的正确应用
- 层级系统的正确实现
- 粘性定位的行为验证
- 组件渲染与特定 props
- 用户交互处理（点击、滚动、切换）
- 错误边界行为
- 特定断点的响应式设计

### 基于属性的测试配置

- **测试库**: fast-check for TypeScript 基于属性的测试
- **最小迭代次数**: 每个属性测试100次迭代
- **测试标记**: 每个属性测试标记格式: **Feature: fretboard-css-grid-refactor, Property {number}: {property_text}**

### 属性测试实现

每个正确性属性将实现为基于属性的测试：

1. **Property 1 Test**: 生成随机品格数量，验证网格结构和架构一致性
2. **Property 2 Test**: 生成随机弦号和品格号，验证网格坐标映射正确性
3. **Property 3 Test**: 生成随机滚动状态，验证空弦粘性定位行为
4. **Property 4 Test**: 生成随机元素组合，验证层级系统正确性
5. **Property 5 Test**: 生成随机视口尺寸，验证响应式网格适配
6. **Property 6 Test**: 生成随机功能调用，验证向后兼容性保证
7. **Property 7 Test**: 生成随机渲染场景，验证性能优化效果
8. **Property 8 Test**: 生成随机视觉状态，验证视觉一致性保持
9. **Property 9 Test**: 分析代码度量，验证代码质量改进

### 视觉回归测试

- 与现有实现的像素级对比
- 不同屏幕尺寸下的布局一致性
- 滚动行为的正确性
- 空弦标记的粘性行为

### 性能测试

- 渲染时间对比（新 vs 旧实现）
- 内存使用量对比
- 滚动性能测试
- 大品格数量下的性能表现

### 可访问性测试

- 键盘导航支持
- 屏幕阅读器兼容性
- 颜色对比度验证
- 触摸目标尺寸验证

这个全面的测试策略确保特定功能正确工作，通用属性在所有可能输入下都成立，为应用程序的正确性和可靠性提供信心。

## Migration Strategy

### 渐进式重构方案

#### 阶段 1: 基础网格结构

1. 实现基本的 CSS Grid 布局
2. 迁移品丝和弦线到网格系统
3. 建立网格坐标映射函数

#### 阶段 2: 音符标记迁移

1. 将音符标记定位改为网格坐标
2. 实现层级管理系统
3. 测试功能一致性

#### 阶段 3: 空弦粘性定位

1. 实现空弦列的粘性定位
2. 添加背景遮挡效果
3. 优化滚动体验

#### 阶段 4: 性能优化和清理

1. 移除旧的像素计算代码
2. 优化 CSS 变量系统
3. 完善错误处理和响应式适配

### 向后兼容保证

#### 接口兼容性

```typescript
// 保持完全相同的组件接口
interface FretboardGridProps {
  selectedKey: MusicalKey;    // 不变
  displayMode: DisplayMode;   // 不变
  fretCount: number;         // 不变
}

// 保持相同的回调和事件处理
const handleKeyDown = (e: React.KeyboardEvent) => {
  // 键盘导航逻辑保持不变
};
```

#### 功能兼容性

- 所有现有功能必须保持完全一致
- 可访问性特性不能降级
- 键盘导航行为保持不变
- 触摸交互体验保持一致

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: CSS Grid 架构一致性

*For any* 重构后的指板组件实例，组件应该使用 CSS Grid 作为主要布局系统，网格列数应该等于品格数加一，网格行数应该等于6（弦的数量），并且不应该包含任何像素位置计算代码。
**Validates: Requirements 1.1, 1.2, 1.3, 7.1, 9.1, 9.3**

### Property 2: 网格坐标映射正确性

*For any* 音符标记、弦线和品丝元素，它们的网格位置应该正确映射到对应的弦号和品格号，其中弦线和品丝从第二列开始，音符标记使用 (弦号+1, 品格号+2) 的坐标系统。
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3**

### Property 3: 空弦粘性定位行为

*For any* 滚动状态下的指板，空弦标记应该始终位于网格第一列，使用 sticky positioning 保持在视口左侧可见，具有与指板相同的背景色，并且与对应弦行完美对齐。
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.6**

### Property 4: 层级系统正确性

*For any* 指板元素集合，z-index 层级应该按照以下顺序递增：品丝(1) < 弦线(2) < 音符标记(3) < 空弦标记(4)，确保所有元素正确显示且不被遮挡。
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.6**

### Property 5: 响应式网格适配

*For any* 屏幕尺寸变化，网格单元格尺寸应该通过 CSS 变量正确调整，保持适当的比例关系，并且在小屏幕设备上进行优化调整。
**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 6: 向后兼容性保证

*For any* 现有功能和接口，重构后的组件应该保持相同的 props 接口、支持所有现有功能、维持相同的可访问性特性和键盘导航，并且与现有测试套件兼容。
**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

### Property 7: 性能优化效果

*For any* 渲染操作，重构后的组件应该减少 JavaScript 计算量，避免重复的位置计算，使用 CSS 变量优化样式计算，并且保持与现有实现相同或更好的渲染性能。
**Validates: Requirements 7.2, 7.3, 7.4, 7.5**

### Property 8: 视觉一致性保持

*For any* 视觉元素，重构后的指板应该保持与现有实现相同的弦线外观和纹理、品丝外观和位置、音符标记样式和颜色、整体布局和比例，以及滚动行为和交互体验。
**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

### Property 9: 代码质量改进

*For any* 代码度量，重构后的组件应该移除所有像素计算和复杂的响应式边距计算逻辑，使用声明式的 CSS Grid 属性，减少组件代码行数至少30%，并且提高代码可读性和维护性。
**Validates: Requirements 9.2, 9.4, 9.5**

这个重构将显著简化代码库，提高性能，同时保持完全的功能和视觉一致性。通过使用现代 CSS Grid 技术，我们可以实现更清晰、更可维护的代码结构。
