# 项目文档

## 📚 文档目录

### Ant Design 设计系统
完整的 Ant Design 设计规范和实施指南

👉 **[进入 Ant Design 文档](./antd/README.md)**

**包含内容**：
- 设计价值观和原则
- 全局样式系统（色彩、布局、字体、图标、阴影、暗黑模式）
- 设计模式和页面模板（7 种）
- 组件规范（20+ 组件）
- 迁移指南和集成方案
- 700+ 设计 Token
- 100+ 代码示例

**官方文档覆盖率**：✅ 100%（41/41项）

---

### 发布与回归

记录发布复盘、视觉回归约束和 CI 稳定性经验。

👉 **[0.3.3 发布复盘](./release-0.3.3-retrospective.md)**

👉 **[发布复盘模板](./release-retrospective-template.md)**

👉 **[视觉回归指南](./visual-regression.md)**

---

## 📊 统计

- **Ant Design 文档**：10 份（156KB）
- **CSS 样式文件**：5 个
- **示例组件**：2 个
- **Storybook 故事**：2 个

---

## 🚀 快速开始

### 查看 Ant Design 设计规范
```bash
cd docs/antd
```

### 运行 Storybook 查看示例
```bash
pnpm storybook
```

### 更新视觉快照基线
页面级视觉回归基线位于 `e2e/*.spec.ts-snapshots/`，当前 FileManager 默认态和暗色态都已纳入基线。
完整流程说明见 [visual-regression.md](./visual-regression.md)。

建议只更新受影响的快照，避免误改其他页面：

```bash
pnpm exec playwright test e2e/data-grid-file-tree.spec.ts --grep "FileManager"
pnpm exec playwright test e2e/data-grid-file-tree.spec.ts --grep "FileManager" --update-snapshots
pnpm exec playwright test e2e/data-grid-file-tree.spec.ts --grep "dark story" --update-snapshots
```

只有在视觉改动是预期行为且已经评审通过时才更新基线，并在 PR 中检查变更后的 `.png` 文件。

---

## 📝 更新日志

### 2026-04-19
- ✅ 整理 Ant Design 文档到独立目录
- ✅ 完成官方文档 100% 覆盖
- ✅ 创建完整的设计系统文档
- ✅ 补充 `0.3.3` 发布复盘与视觉回归稳定性记录
