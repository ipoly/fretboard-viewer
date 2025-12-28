# 开发工作流

## 本地开发最佳实践

为了避免本地测试通过但 CI 失败的情况，请遵循以下工作流：

### 1. 开发前检查

```bash
# 启动开发服务器
npm run dev

# 在另一个终端运行类型检查（监听模式）
npm run typecheck -- --watch
```

### 2. 提交前检查

```bash
# 运行完整的 CI 检查
npm run ci

# 或者分步骤运行：
npm run typecheck  # TypeScript 类型检查
npm run test       # 测试（包含类型检查）
npm run build      # 构建检查
```

### 3. 自动化检查

项目已配置 Husky pre-commit hooks，会在每次提交前自动运行：

- TypeScript 类型检查
- 相关测试

### 4. 常用命令

| 命令 | 说明 |
| ---- | ---- |
| `npm run dev` | 启动开发服务器 |
| `npm run test:watch` | 监听模式运行测试 |
| `npm run typecheck` | 只进行类型检查 |
| `npm run ci` | 完整 CI 检查 |
| `npm run build` | 构建项目 |

### 5. IDE 配置

推荐使用 VS Code，项目已包含 `.vscode/settings.json` 配置：

- 启用严格的 TypeScript 检查
- 保存时自动修复
- 正确的文件关联

### 6. 故障排除

如果遇到类型错误：

1. 先运行 `npm run typecheck` 查看具体错误
2. 修复类型问题
3. 运行 `npm run test` 确保测试通过
4. 最后运行 `npm run build` 确保构建成功

如果遇到 CSS 相关的 UI 问题：

1. 检查浏览器控制台是否有 CSS 错误
2. 运行 `npm run test -- src/test/css-architecture.test.ts` 验证 CSS 架构
3. 确认开发服务器正常启动且无编译错误

### 7. 提交规范

- 每次提交前会自动运行 lint-staged
- 确保所有 TypeScript 文件通过类型检查
- 确保相关测试通过

这样可以确保本地开发环境与 CI 环境保持一致。

## CSS 架构指南

### 样式系统概览

项目采用系统化的 CSS-in-JS 架构，基于以下核心原则：

#### 🎯 设计原则

1. **关注点分离** - 不同类型的样式分别管理
2. **组合优于继承** - 通过小而专的样式组合构建复杂样式
3. **单一数据源** - 统一的断点、颜色、间距定义

#### 🏗️ 文件结构

```
src/styles/
├── shared.ts      # 共享视觉样式（颜色、阴影、边框）
├── responsive.ts  # 响应式系统（断点、媒体查询、CSS变量）
└── components.ts  # UI组件样式（按钮、表单、布局工具）
```

### 使用指南

#### 1. 响应式开发

```typescript
import { media, responsiveGridVariables } from '../styles/responsive'

const myComponent = css`
  ${responsiveGridVariables} /* 获取所有CSS变量 */

  padding: 1rem;

  ${media.lg} {
    padding: 0.5rem;
  }

  ${media.sm} {
    padding: 0.25rem;
  }
`
```

#### 2. 组件样式组合

```typescript
import {
  primaryButton,
  flexCenter,
  touchFriendly
} from '../styles/components'

const myButton = css`
  ${primaryButton}   # 基础按钮样式
  ${touchFriendly}   # 触摸友好增强
  /* 只添加组件特定的样式 */
  margin-top: 1rem;
`
```

#### 3. 共享视觉样式

```typescript
import {
  circularMarkerBase,
  getScaleDegreeColorClass
} from '../styles/shared'

const myMarker = css`
  ${circularMarkerBase}  # 统一的圆形标记样式
  ${getScaleDegreeColorClass(degree)}  # 音阶度数颜色
`
```

### 最佳实践

#### ✅ 推荐做法

```typescript
// 使用预定义的样式组合
const button = css`
  ${primaryButton}
  margin: 1rem 0;
`

// 使用统一的响应式断点
${media.lg} {
  font-size: 14px;
}

// 使用CSS变量进行动态计算
width: calc(var(--fret-width) * 2);
```

#### ❌ 避免做法

```typescript
// 不要重复定义响应式断点
@media (max-width: 768px) { /* 使用 media.lg 代替 */ }

// 不要重复定义按钮样式
const button = css`
  padding: 10px 16px;
  border: 1px solid #ddd;
  /* 使用 primaryButton 代替 */
`

// 不要硬编码颜色值
background: #FF6B6B; /* 使用 getScaleDegreeColorClass(1) 代替 */
```

### 扩展指南

#### 添加新的响应式断点

```typescript
// 在 src/styles/responsive.ts 中
export const breakpoints = {
  // 现有断点...
  newBreakpoint: '1440px'
}

export const media = {
  // 现有媒体查询...
  newBreakpoint: `@media (max-width: ${breakpoints.newBreakpoint})`
}
```

#### 添加新的组件样式

```typescript
// 在 src/styles/components.ts 中
export const newComponentStyle = css`
  ${baseButton}  // 继承基础样式
  /* 新组件特定的样式 */
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
`
```

### 性能考虑

- **样式复用** - 减少重复的CSS规则生成
- **CSS变量** - 利用浏览器原生优化
- **组合模式** - 避免大型单体样式定义
- **类型安全** - 编译时检查样式引用

这个架构确保了样式的一致性、可维护性和性能优化。
