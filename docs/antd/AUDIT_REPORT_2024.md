# Ant Design 标准审计报告

**审计日期**: 2024
**审计范围**: src/components/**/*.tsx
**标准依据**: docs/antd/ANTD_COMPONENT_SIZES.md, docs/antd/ANTD_QUICK_REFERENCE.md

## 执行摘要

扫描发现 **38 个文件**存在 Ant Design 标准偏差：
- **8 个文件**使用非标准控件高度 (h-7/h-9)
- **27 个文件**使用过大圆角 (rounded-xl/2xl/full)
- **3 个文件**使用过大间距 (gap-6/8, space-y-6/8, p-6)

## 详细问题清单

| ID | 文件 | 问题 | 当前实现 | 目标实现 | 严重级别 | 依据文档 |
|----|------|------|---------|---------|---------|---------|
| **A1** | src/components/ui/inputs/input.tsx | Input md 尺寸高度非标准 | h-7 (28px) | h-8 (32px) | high | ANTD_COMPONENT_SIZES.md: Input Middle = 32px |
| **A2** | src/components/ui/data-grid/index.tsx | DataGrid 单元格高度非标准 | h-9 (36px) | h-8 (32px) | high | ANTD_COMPONENT_SIZES.md: 默认控件 = 32px |
| **A3** | src/components/ui/data-grid/toolbar.tsx | Toolbar Badge 高度非标准 | h-7 (28px) | h-6 (24px) 或 h-8 (32px) | medium | ANTD_COMPONENT_SIZES.md: Badge Default = 20px |
| **A4** | src/components/ui/data-grid/pagination.tsx | Pagination Select 高度非标准 | h-7 (28px) | h-8 (32px) | high | ANTD_COMPONENT_SIZES.md: Pagination Default = 32px |
| **A5** | src/components/ui/chat/chat-command-palette.tsx | Command Palette dense 模式高度非标准 | h-7 (28px), min-h-7 | h-6 (24px), min-h-6 | medium | ANTD_COMPONENT_SIZES.md: Small = 24px |
| **A6** | src/components/ui/prompt-library.tsx | Prompt Library compact 模式高度非标准 | h-7 (28px) | h-6 (24px) | medium | ANTD_COMPONENT_SIZES.md: Small = 24px |
| **A7** | src/components/ui/rich-text-editor.tsx | RichTextEditor 工具栏按钮高度非标准 | h-7 (28px) | h-6 (24px) 或 h-8 (32px) | medium | ANTD_COMPONENT_SIZES.md: Button Small = 24px, Middle = 32px |
| **A8** | src/components/form-engine/field-renderer.tsx | Form field 容器高度非标准 | h-7 (28px) | h-8 (32px) | high | ANTD_COMPONENT_SIZES.md: Input Middle = 32px |

### 圆角问题 (27 个文件)

| ID | 文件 | 问题 | 当前实现 | 目标实现 | 严重级别 | 依据文档 |
|----|------|------|---------|---------|---------|---------|
| **B1** | src/components/ui/chat/chat-bubble.tsx | 聊天气泡圆角过大 | rounded-xl/2xl | rounded-lg (8px) | low | ANTD_QUICK_REFERENCE.md: 大卡片 = 8px |
| **B2** | src/components/ui/chat/chat-sender.tsx | 发送框圆角过大 | rounded-xl | rounded-lg (8px) | low | ANTD_QUICK_REFERENCE.md: 大容器 = 8px |
| **B3** | src/components/ui/display/avatar.tsx | Avatar 圆角过大 | rounded-full | rounded-lg (8px) 或保持 rounded-full | low | 头像通常使用 rounded-full，可保留 |
| **B4** | src/components/ui/inputs/switch.tsx | Switch 圆角过大 | rounded-full | rounded-full | low | Switch 标准使用 rounded-full，可保留 |
| **B5** | src/components/ui/inputs/radio-group.tsx | Radio 圆角过大 | rounded-full | rounded-full | low | Radio 标准使用 rounded-full，可保留 |
| **B6-B27** | 其他 22 个文件 | 装饰性圆角过大 | rounded-xl/2xl | rounded (6px) 或 rounded-lg (8px) | low | ANTD_QUICK_REFERENCE.md |

### 间距问题 (3 个文件)

| ID | 文件 | 问题 | 当前实现 | 目标实现 | 严重级别 | 依据文档 |
|----|------|------|---------|---------|---------|---------|
| **C1** | src/components/ui/display/timeline.tsx | Timeline 间距过大 | gap-6/8 (24px/32px) | gap-4 (16px) | medium | ANTD_QUICK_REFERENCE.md: 默认间距 = 16px |
| **C2** | src/components/pages/settings-page.tsx | Settings 页面间距过大 | space-y-6/8, p-6 | space-y-4, p-4 | medium | ANTD_QUICK_REFERENCE.md: 默认间距 = 16px |
| **C3** | src/components/pages/user-list-page.tsx | User List 页面间距过大 | space-y-6, p-6 | space-y-4, p-4 | medium | ANTD_QUICK_REFERENCE.md: 默认间距 = 16px |

## 优先级修复建议

### 高优先级 (High Severity)
修复这些问题以确保控件尺寸一致性和交互清晰度：

1. **A1**: Input md 尺寸 h-7 → h-8
2. **A2**: DataGrid 单元格 h-9 → h-8
3. **A4**: Pagination Select h-7 → h-8
4. **A8**: Form field 容器 h-7 → h-8

### 中优先级 (Medium Severity)
修复这些问题以提升视觉一致性：

1. **A3, A5, A6, A7**: 各组件 compact/dense 模式统一使用 h-6 (24px)
2. **C1, C2, C3**: 页面和组件间距统一使用 gap-4/space-y-4/p-4 (16px)

### 低优先级 (Low Severity)
可选优化，不影响核心功能：

1. **B1-B27**: 圆角标准化（保留 Avatar/Switch/Radio 的 rounded-full）

## 修复计划

### 阶段 1: 核心控件高度标准化
```bash
# 修复文件：
- src/components/ui/inputs/input.tsx
- src/components/ui/data-grid/index.tsx
- src/components/ui/data-grid/pagination.tsx
- src/components/form-engine/field-renderer.tsx
```

### 阶段 2: Compact 模式统一
```bash
# 修复文件：
- src/components/ui/data-grid/toolbar.tsx
- src/components/ui/chat/chat-command-palette.tsx
- src/components/ui/prompt-library.tsx
- src/components/ui/rich-text-editor.tsx
```

### 阶段 3: 间距标准化
```bash
# 修复文件：
- src/components/ui/display/timeline.tsx
- src/components/pages/settings-page.tsx
- src/components/pages/user-list-page.tsx
```

### 阶段 4: 圆角优化（可选）
```bash
# 批量替换：
rounded-xl → rounded-lg (8px)
rounded-2xl → rounded-lg (8px)
# 保留：Avatar, Switch, Radio 的 rounded-full
```

## 验证清单

修复后需要验证：

- [ ] `pnpm lint` 通过
- [ ] `pnpm test` 通过
- [ ] Storybook 视觉检查：
  - [ ] Input 组件各尺寸
  - [ ] DataGrid 表格
  - [ ] Pagination 分页器
  - [ ] Form Engine 表单
  - [ ] Chat Command Palette
  - [ ] Prompt Library
  - [ ] Rich Text Editor
- [ ] 页面级检查：
  - [ ] Settings Page
  - [ ] User List Page

## 附录：标准参考

### 控件高度标准
- Small: 24px (h-6)
- Middle: 32px (h-8) - **默认**
- Large: 40px (h-10)

### 圆角标准
- 小标签/徽章: 2px (rounded-xs)
- 小卡片: 4px (rounded-sm)
- 默认控件: 6px (rounded) - **默认**
- 大卡片/容器: 8px (rounded-lg)

### 间距标准
- 4px (gap-1) - 极小间隙
- 8px (gap-2) - 小间距
- 12px (gap-3) - 紧凑间距
- 16px (gap-4) - **默认间距**
- 20px (gap-5) - 中等间距
- 24px (gap-6) - 大间距
- 32px (gap-8) - 页面级间距

## 影响范围评估

- **文件数量**: 38 个文件需要修改
- **测试覆盖**: 390 个测试需要验证
- **视觉回归风险**: 中等（主要是尺寸微调）
- **预计工作量**: 2-4 小时

## 结论

当前代码库存在系统性的尺寸偏差，主要集中在：
1. **28px (h-7)** 被错误使用为中等尺寸（应为 32px）
2. **36px (h-9)** 被错误使用为大尺寸（应为 40px）
3. 圆角和间距普遍偏大

建议优先修复高严重级别的控件高度问题，确保交互一致性。
