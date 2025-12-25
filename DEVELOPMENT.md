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