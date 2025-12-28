# Requirements Document

## Introduction

重构现有的吉他指板组件实现，从基于 JavaScript 计算像素位置的布局方式改为使用 CSS Grid 系统。这将简化代码，提高性能，并提供更好的对齐和定位控制。外观和功能应与现有实现保持一致。

## Glossary

- **CSS_Grid**: CSS 网格布局系统，允许二维布局控制
- **Grid_Cell**: 网格中的单个单元格，由行和列交叉点定义
- **Fret_Column**: 网格中代表品格的列
- **String_Row**: 网格中代表弦的行
- **Fret_Zero_Column**: 网格的第一列，对应空弦（品格 0），与其他品格列统一处理

- **Grid_Layer**: 通过 z-index 控制的网格层级，允许元素堆叠
- **Fretboard_Grid**: 重构后的指板网格组件
- **Position_Calculation**: 当前基于像素计算的定位方式
- **Marker_Wrapper**: 记号元素的不可见包裹容器，填充整个网格单元格，便于定位和交互

## Requirements

### Requirement 1: CSS Grid 基础架构

**User Story:** 作为开发者，我希望使用 CSS Grid 作为指板的主要布局系统，这样可以简化定位逻辑并提高性能。

#### Acceptance Criteria

1. THE Fretboard_Grid SHALL 使用 CSS Grid 作为主要布局系统替代当前的像素计算方式
2. THE Fretboard_Grid SHALL 定义网格列数等于品格数量加一（包含空弦列，从品格 0 开始）
3. THE Fretboard_Grid SHALL 定义网格行数等于弦的数量（6行）
4. THE Fretboard_Grid SHALL 对所有品格列（包括空弦列）使用统一的处理方式
5. THE Fretboard_Grid SHALL 支持网格元素的层级堆叠通过 z-index 控制
6. THE Fretboard_Grid SHALL 保持与现有实现相同的视觉外观和尺寸比例

### Requirement 2: 统一品格列处理

**User Story:** 作为开发者，我希望所有品格列（包括空弦）都使用统一的处理方式，简化代码逻辑并提高一致性。

#### Acceptance Criteria

1. THE Fret_Zero_Column SHALL 位于网格的第一列（column 1），对应空弦品格
2. THE 所有品格列 SHALL 使用相同的网格定位和样式处理逻辑
3. THE 空弦标记 SHALL 与其他品格上的音符标记使用相同的定位方式
4. THE 网格列索引 SHALL 直接对应品格号（第1列=品格0，第2列=品格1，以此类推）
5. THE 统一处理方式 SHALL 简化代码逻辑，减少特殊情况处理

### Requirement 3: 弦和品丝网格定位

**User Story:** 作为开发者，我希望弦和品丝能够通过简单的网格坐标定位，而不需要复杂的像素计算。

#### Acceptance Criteria

1. THE 弦线 SHALL 从网格的第一列开始绘制（column 1 开始，对应品格 0）
2. THE 品丝 SHALL 从网格的第二列开始绘制（column 2 开始，对应品格 1）
3. THE 弦线 SHALL 使用 grid-row 属性定位到对应的弦行
4. THE 品丝 SHALL 使用 grid-column 属性定位到对应的品格列
5. THE 弦线和品丝 SHALL 通过 CSS Grid 自动对齐，无需手动像素调整

### Requirement 4: 音符标记网格定位与包裹元素

**User Story:** 作为开发者，我希望音符标记能够通过弦号和品格号简单定位，并使用包裹元素便于未来的定位和交互功能扩展。

#### Acceptance Criteria

1. THE 音符标记 SHALL 使用网格坐标 (string_number, fret_number) 进行定位
2. WHEN 定位音符标记时，THE Fretboard_Grid SHALL 使用 grid-row 对应弦号
3. WHEN 定位音符标记时，THE Fretboard_Grid SHALL 使用 grid-column 对应品格号加一（第1列=品格0）
4. THE 每个音符标记 SHALL 包裹在一个 Marker_Wrapper 容器中
5. THE Marker_Wrapper SHALL 填充整个网格单元格，提供完整的交互区域
6. THE Marker_Wrapper SHALL 是不可见的容器，不影响视觉外观
7. THE 音符标记 SHALL 在 Marker_Wrapper 内自动居中对齐
8. THE Marker_Wrapper SHALL 便于未来添加点击、悬停等交互功能

### Requirement 5: 层级控制系统

**User Story:** 作为开发者，我希望通过 CSS 层级控制不同元素的显示顺序，确保正确的视觉层次。

#### Acceptance Criteria

1. THE 品丝 SHALL 位于最底层（z-index: 1）
2. THE 弦线 SHALL 位于品丝之上（z-index: 2）
3. THE Marker_Wrapper SHALL 位于较高层级（z-index: 3）
4. THE 音符标记 SHALL 在 Marker_Wrapper 内显示，继承其层级
5. THE 层级系统 SHALL 确保所有元素正确显示且不被遮挡
6. THE 统一的层级处理 SHALL 适用于所有品格列，包括空弦列

### Requirement 6: 响应式网格适配

**User Story:** 作为用户，我希望在不同设备上都能获得良好的指板显示效果，网格系统应该适应不同屏幕尺寸。

#### Acceptance Criteria

1. THE Fretboard_Grid SHALL 在不同屏幕尺寸下保持正确的网格比例
2. THE 网格单元格尺寸 SHALL 根据屏幕大小进行响应式调整
3. THE 所有品格列宽度 SHALL 使用统一的响应式规则
4. THE 品格列宽度 SHALL 在移动设备上适当缩小以适应屏幕
5. THE 网格间距 SHALL 在小屏幕设备上进行优化调整
6. THE Marker_Wrapper SHALL 在所有设备上正确填充网格单元格

### Requirement 7: 性能优化

**User Story:** 作为用户，我希望重构后的指板组件具有更好的性能，减少不必要的计算和重渲染。

#### Acceptance Criteria

1. THE Fretboard_Grid SHALL 消除所有基于像素的位置计算
2. THE Fretboard_Grid SHALL 减少 JavaScript 计算量，依赖 CSS Grid 的原生性能
3. THE Fretboard_Grid SHALL 避免在每次渲染时重新计算元素位置
4. THE Fretboard_Grid SHALL 使用 CSS 变量优化样式计算
5. THE Fretboard_Grid SHALL 保持与现有实现相同或更好的渲染性能

### Requirement 8: 向后兼容性

**User Story:** 作为开发者，我希望重构后的组件能够与现有的代码和接口保持兼容，不破坏现有功能。

#### Acceptance Criteria

1. THE Fretboard_Grid SHALL 保持与现有组件相同的 props 接口
2. THE Fretboard_Grid SHALL 支持所有现有的功能（调式选择、显示模式切换等）
3. THE Fretboard_Grid SHALL 保持相同的可访问性特性和 ARIA 标签
4. THE Fretboard_Grid SHALL 支持现有的键盘导航功能
5. THE Fretboard_Grid SHALL 与现有的测试套件兼容

### Requirement 9: 代码简化

**User Story:** 作为开发者，我希望重构后的代码更加简洁易懂，减少复杂的计算逻辑。

#### Acceptance Criteria

1. THE Fretboard_Grid SHALL 移除所有像素位置计算相关的代码
2. THE Fretboard_Grid SHALL 移除复杂的响应式边距计算逻辑
3. THE Fretboard_Grid SHALL 移除空弦列的特殊处理逻辑
4. THE Fretboard_Grid SHALL 使用声明式的 CSS Grid 属性替代命令式的位置计算
5. THE Fretboard_Grid SHALL 通过统一的品格列处理减少代码复杂度
6. THE Fretboard_Grid SHALL 减少组件代码行数至少 30%
7. THE Fretboard_Grid SHALL 提高代码可读性和维护性

### Requirement 10: 视觉一致性

**User Story:** 作为用户，我希望重构后的指板外观与现有实现完全一致，不影响使用体验。

#### Acceptance Criteria

1. THE Fretboard_Grid SHALL 保持与现有实现相同的弦线外观和纹理
2. THE Fretboard_Grid SHALL 保持与现有实现相同的品丝外观和位置
3. THE Fretboard_Grid SHALL 保持与现有实现相同的音符标记样式和颜色
4. THE Fretboard_Grid SHALL 保持与现有实现相同的整体布局和比例
5. THE Fretboard_Grid SHALL 保持与现有实现相同的滚动行为和交互体验
