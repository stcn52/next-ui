# 🚀 快速迁移指南

## 立即开始应用 Ant Design 标准

### 📋 核心发现

你的组件当前尺寸：
- **Button Small**: 28px（应为 **24px**）⚠️
- **Button Default**: 32px ✅
- **Button Large**: 36px（应为 **40px**）⚠️
- **Input Small**: 28px（应为 **24px**）⚠️
- **Input Middle**: 32px ✅
- **Input Large**: 36px（应为 **40px**）⚠️

### 🎯 推荐方案

**方案 1：完全迁移（推荐）**
- 修改 Button 和 Input 尺寸以符合 Ant Design 标准
- 预计时间：2-3 天
- 影响：Small 变小 4px，Large 变大 4px

**方案 2：渐进式迁移**
- 新组件使用新标准，旧组件保持不变
- 预计时间：1 周
- 影响：过渡期有两套标准

### ⚡ 快速修改代码

#### Button 组件（推荐修改）

```tsx
// 文件：src/components/ui/button.tsx

// 找到这段代码：
size: {
  sm: "h-7 gap-1 px-2.5",           // 28px ⚠️
  default: "h-8 gap-1 px-2.5",      // 32px ✅
  lg: "h-9 gap-1.5 px-2.5",         // 36px ⚠️
}

// 替换为：
size: {
  sm: "h-6 gap-1 px-[0.4375rem] text-sm rounded-sm",      // 24px, 7px, 14px, 4px
  default: "h-8 gap-1 px-[0.9375rem] text-sm rounded",    // 32px, 15px, 14px, 6px
  lg: "h-10 gap-1.5 px-[0.9375rem] text-base rounded",    // 40px, 15px, 16px, 6px
}

// 或使用 CSS 变量（更灵活）：
size: {
  sm: "h-[var(--btn-height-sm)] gap-1 px-[var(--btn-padding-horizontal-sm)] text-[var(--btn-font-size-sm)] rounded-[var(--btn-border-radius-sm)]",
  default: "h-[var(--btn-height)] gap-1 px-[var(--btn-padding-horizontal)] text-[var(--btn-font-size)] rounded-[var(--btn-border-radius)]",
  lg: "h-[var(--btn-height-lg)] gap-1.5 px-[var(--btn-padding-horizontal-lg)] text-[var(--btn-font-size-lg)] rounded-[var(--btn-border-radius-lg)]",
}
```

#### Input 组件（推荐修改）

```tsx
// 文件：src/components/ui/inputs/input.tsx

// 找到这段代码：
const sizeClasses: Record<Size, string> = {
  sm: "h-7 px-2 text-xs",        // 28px ⚠️
  md: "h-8 px-2.5 text-base",    // 32px ✅
  lg: "h-9 px-3 text-base",      // 36px ⚠️
}

// 替换为：
const sizeClasses: Record<Size, string> = {
  sm: "h-6 px-[0.4375rem] text-sm rounded-sm",      // 24px, 7px, 14px, 4px
  md: "h-8 px-[0.6875rem] text-sm rounded",         // 32px, 11px, 14px, 6px
  lg: "h-10 px-[0.6875rem] text-base rounded",      // 40px, 11px, 16px, 6px
}

// 或使用 CSS 变量：
const sizeClasses: Record<Size, string> = {
  sm: "h-[var(--input-height-sm)] px-[var(--input-padding-horizontal-sm)] text-[var(--input-font-size-sm)] rounded-[var(--input-border-radius-sm)]",
  md: "h-[var(--input-height)] px-[var(--input-padding-horizontal)] text-[var(--input-font-size)] rounded-[var(--input-border-radius)]",
  lg: "h-[var(--input-height-lg)] px-[var(--input-padding-horizontal-lg)] text-[var(--input-font-size-lg)] rounded-[var(--input-border-radius-lg)]",
}
```

### 🧪 测试修改

```bash
# 1. 启动 Storybook 预览变化
pnpm storybook

# 2. 查看 Button 和 Input 组件
# 访问：http://localhost:6006

# 3. 对比新旧尺寸
# - Small: 24px vs 28px（变小 4px）
# - Default: 32px（不变）
# - Large: 40px vs 36px（变大 4px）
```

### 📊 视觉对比

#### Button 尺寸变化

```
Small:   [  28px  ] → [  24px  ]  ⬇️ 更紧凑
Default: [  32px  ] → [  32px  ]  ✅ 不变
Large:   [  36px  ] → [  40px  ]  ⬆️ 更突出
```

#### Input 尺寸变化

```
Small:  [  28px  ] → [  24px  ]  ⬇️ 更紧凑
Middle: [  32px  ] → [  32px  ]  ✅ 不变
Large:  [  36px  ] → [  40px  ]  ⬆️ 更突出
```

### ✅ 验证清单

修改后检查：
- [ ] Small 按钮高度为 24px
- [ ] Default 按钮高度为 32px
- [ ] Large 按钮高度为 40px
- [ ] Small 输入框高度为 24px
- [ ] Middle 输入框高度为 32px
- [ ] Large 输入框高度为 40px
- [ ] Button 和 Input 在表单中对齐
- [ ] 暗色模式下显示正常
- [ ] 所有 Storybook 故事正常

### 🎨 使用新标准

修改完成后，在新代码中使用：

```tsx
// 使用固定尺寸
<Button size="sm">小按钮 (24px)</Button>
<Button>默认按钮 (32px)</Button>
<Button size="lg">大按钮 (40px)</Button>

<Input size="sm" />  {/* 24px */}
<Input size="md" />  {/* 32px */}
<Input size="lg" />  {/* 40px */}

// 或使用 CSS 变量（更灵活）
<Button style={{ height: 'var(--btn-height-sm)' }}>小按钮</Button>
<Input style={{ height: 'var(--input-height-lg)' }} />
```

### 📚 完整文档

- **对比分析**：`docs/COMPONENT_SIZE_COMPARISON.md`
- **迁移计划**：`docs/COMPONENT_MIGRATION_PLAN.md`
- **尺寸标准**：`docs/ANTD_COMPONENT_SIZES.md`
- **快速参考**：`docs/ANTD_QUICK_REFERENCE.md`

### 🆘 需要帮助？

如果遇到问题：
1. 查看对比分析报告了解详细差异
2. 查看迁移计划了解完整步骤
3. 在 Storybook 中预览所有变化
4. 运行测试确保没有破坏现有功能

### 🎯 下一步

1. **立即行动**：修改 Button 和 Input 组件
2. **测试验证**：在 Storybook 中预览
3. **扩展应用**：为其他组件添加尺寸规范
4. **团队同步**：分享迁移指南

---

**提示**：建议先在开发分支测试，确认无问题后再合并到主分支。
