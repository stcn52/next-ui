# 组件迁移实施方案

## 🎯 迁移目标

将现有组件尺寸从当前标准迁移到 Ant Design 标准，实现：
- ✅ 统一的组件尺寸规范（24px/32px/40px）
- ✅ 更好的视觉层次和一致性
- ✅ 符合企业级设计标准

## 📋 迁移清单

### 阶段 1：核心组件（优先级 P0）

#### 1.1 Button 组件

**当前问题**：
- Small: 28px（应为 24px）
- Large: 36px（应为 40px）
- 内边距不符合标准

**迁移方案**：

```tsx
// 文件：src/components/ui/button.tsx

// 方案 A：使用 Ant Design CSS 变量（推荐）
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // ... 保持不变
      },
      size: {
        // 使用 Ant Design 标准
        sm: "h-[var(--btn-height-sm)] gap-1 px-[var(--btn-padding-horizontal-sm)] text-[var(--btn-font-size-sm)] rounded-[var(--btn-border-radius-sm)]",
        default: "h-[var(--btn-height)] gap-1 px-[var(--btn-padding-horizontal)] text-[var(--btn-font-size)] rounded-[var(--btn-border-radius)]",
        lg: "h-[var(--btn-height-lg)] gap-1.5 px-[var(--btn-padding-horizontal-lg)] text-[var(--btn-font-size-lg)] rounded-[var(--btn-border-radius-lg)]",
        
        // 图标按钮
        icon: "size-[var(--btn-icon-only-width)]",
        "icon-sm": "size-[var(--btn-icon-only-width-sm)] rounded-[var(--btn-border-radius-sm)]",
        "icon-lg": "size-[var(--btn-icon-only-width-lg)] rounded-[var(--btn-border-radius-lg)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// 方案 B：使用固定值（备选）
const buttonVariants = cva(
  "...",
  {
    variants: {
      size: {
        sm: "h-6 gap-1 px-[0.4375rem] text-sm rounded-sm",      // 24px, 7px, 14px, 4px
        default: "h-8 gap-1 px-[0.9375rem] text-sm rounded",    // 32px, 15px, 14px, 6px
        lg: "h-10 gap-1.5 px-[0.9375rem] text-base rounded",    // 40px, 15px, 16px, 6px
        
        icon: "size-8",       // 32px
        "icon-sm": "size-6 rounded-sm",   // 24px
        "icon-lg": "size-10", // 40px
      },
    },
  }
)
```

**测试要点**：
- [ ] Small 按钮在工具栏中的显示
- [ ] Default 按钮在表单中的显示
- [ ] Large 按钮在首页的显示
- [ ] 图标按钮的对齐
- [ ] 按钮组的间距

---

#### 1.2 Input 组件

**当前问题**：
- Small: 28px（应为 24px）
- Large: 36px（应为 40px）
- 内边距不符合标准

**迁移方案**：

```tsx
// 文件：src/components/ui/inputs/input.tsx

// 方案 A：使用 Ant Design CSS 变量（推荐）
const sizeClasses: Record<Size, string> = {
  sm: "h-[var(--input-height-sm)] px-[var(--input-padding-horizontal-sm)] text-[var(--input-font-size-sm)] rounded-[var(--input-border-radius-sm)]",
  md: "h-[var(--input-height)] px-[var(--input-padding-horizontal)] text-[var(--input-font-size)] rounded-[var(--input-border-radius)]",
  lg: "h-[var(--input-height-lg)] px-[var(--input-padding-horizontal-lg)] text-[var(--input-font-size-lg)] rounded-[var(--input-border-radius-lg)]",
}

// 方案 B：使用固定值（备选）
const sizeClasses: Record<Size, string> = {
  sm: "h-6 px-[0.4375rem] text-sm rounded-sm",      // 24px, 7px, 14px, 4px
  md: "h-8 px-[0.6875rem] text-sm rounded",         // 32px, 11px, 14px, 6px
  lg: "h-10 px-[0.6875rem] text-base rounded",      // 40px, 11px, 16px, 6px
}
```

**测试要点**：
- [ ] Small 输入框在紧凑表单中的显示
- [ ] Default 输入框在常规表单中的显示
- [ ] Large 输入框在重要表单中的显示
- [ ] 与 Button 的高度对齐
- [ ] Placeholder 文本的显示

---

### 阶段 2：扩展组件（优先级 P1）

#### 2.1 Select 组件

```tsx
// 文件：src/components/ui/inputs/select.tsx

// 添加尺寸支持
const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm",
  {
    variants: {
      size: {
        sm: "h-[var(--select-height-sm)] px-[var(--select-padding-horizontal-sm)] text-[var(--input-font-size-sm)]",
        md: "h-[var(--select-height)] px-[var(--select-padding-horizontal)] text-[var(--input-font-size)]",
        lg: "h-[var(--select-height-lg)] px-[var(--select-padding-horizontal-lg)] text-[var(--input-font-size-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)
```

#### 2.2 Textarea 组件

```tsx
// 文件：src/components/ui/inputs/textarea.tsx

// 添加尺寸支持
const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
  {
    variants: {
      size: {
        sm: "px-[var(--input-padding-horizontal-sm)] py-[var(--input-padding-vertical-sm)] text-[var(--input-font-size-sm)]",
        md: "px-[var(--input-padding-horizontal)] py-[var(--input-padding-vertical)] text-[var(--input-font-size)]",
        lg: "px-[var(--input-padding-horizontal-lg)] py-[var(--input-padding-vertical-lg)] text-[var(--input-font-size-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)
```

#### 2.3 Badge 组件

```tsx
// 文件：src/components/ui/display/badge.tsx

// 添加尺寸支持
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        // ... 保持不变
      },
      size: {
        sm: "h-[var(--badge-height-sm)] px-2 text-[var(--badge-font-size-sm)]",
        default: "h-[var(--badge-height)] px-2 text-[var(--badge-font-size)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

#### 2.4 Avatar 组件

```tsx
// 文件：src/components/ui/display/avatar.tsx

// 添加尺寸支持
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "size-[var(--avatar-size-xs)] text-[var(--avatar-font-size-xs)]",
        sm: "size-[var(--avatar-size-sm)] text-[var(--avatar-font-size-sm)]",
        md: "size-[var(--avatar-size)] text-[var(--avatar-font-size)]",
        lg: "size-[var(--avatar-size-lg)] text-[var(--avatar-font-size-lg)]",
        xl: "size-[var(--avatar-size-xl)] text-[var(--avatar-font-size-xl)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)
```

---

### 阶段 3：容器组件（优先级 P2）

#### 3.1 Card 组件

```tsx
// 文件：src/components/ui/display/card.tsx

// 添加尺寸支持
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      size: {
        sm: "p-[var(--card-padding-sm)]",
        md: "p-[var(--card-padding)]",
        lg: "p-[var(--card-padding-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)
```

#### 3.2 Table 组件

```tsx
// 文件：src/components/ui/data/table.tsx

// 添加尺寸支持
const tableCellVariants = cva(
  "p-4 align-middle",
  {
    variants: {
      size: {
        sm: "p-[var(--table-padding-vertical-sm)] px-[var(--table-padding-horizontal-sm)] text-[var(--table-font-size-sm)]",
        md: "p-[var(--table-padding-vertical)] px-[var(--table-padding-horizontal)] text-[var(--table-font-size)]",
        lg: "p-[var(--table-padding-vertical-lg)] px-[var(--table-padding-horizontal-lg)] text-[var(--table-font-size-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)
```

---

## 🔧 实施步骤

### Step 1: 准备工作（Day 1）

```bash
# 1. 创建迁移分支
git checkout -b feat/antd-component-sizes

# 2. 确保已引入 Ant Design 样式
# 检查 src/index.css 是否包含：
# @import "./styles/antd-component-sizes.css";

# 3. 备份当前组件（可选）
cp -r src/components/ui src/components/ui.backup
```

### Step 2: 更新 Button 组件（Day 1-2）

```bash
# 1. 修改 button.tsx
# 2. 更新 button.stories.tsx
# 3. 运行 Storybook 预览
pnpm storybook

# 4. 运行测试
pnpm test src/components/ui/button.test.tsx

# 5. 视觉回归测试（如果有）
pnpm test:visual button
```

### Step 3: 更新 Input 组件（Day 2-3）

```bash
# 1. 修改 input.tsx
# 2. 更新 input.stories.tsx
# 3. 运行 Storybook 预览
# 4. 运行测试
# 5. 视觉回归测试
```

### Step 4: 更新其他组件（Day 3-7）

按优先级依次更新：
1. Select, Textarea（Day 3-4）
2. Badge, Avatar（Day 4-5）
3. Card, Table（Day 5-6）
4. 其他组件（Day 6-7）

### Step 5: 文档和测试（Day 7-8）

```bash
# 1. 更新组件文档
# 2. 更新 Storybook 故事
# 3. 运行完整测试套件
pnpm test

# 4. 构建检查
pnpm build:lib

# 5. 发布 Storybook
pnpm build-storybook
```

---

## 🧪 测试策略

### 单元测试

```tsx
// 示例：Button 组件测试
describe('Button with Ant Design sizes', () => {
  it('should render small button with correct height', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ height: '24px' })
  })

  it('should render default button with correct height', () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ height: '32px' })
  })

  it('should render large button with correct height', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ height: '40px' })
  })
})
```

### 视觉回归测试

```tsx
// 使用 Storybook + Chromatic 或 Percy
// 确保所有尺寸变化都被捕获
```

### 手动测试清单

- [ ] Button 在不同尺寸下的显示
- [ ] Input 在不同尺寸下的显示
- [ ] Button 和 Input 高度对齐
- [ ] 表单中的组件对齐
- [ ] 工具栏中的组件对齐
- [ ] 响应式布局下的显示
- [ ] 暗色模式下的显示

---

## 📊 迁移进度追踪

### 核心组件（P0）
- [ ] Button - 预计 1 天
- [ ] Input - 预计 1 天

### 表单组件（P1）
- [ ] Select - 预计 0.5 天
- [ ] Textarea - 预计 0.5 天
- [ ] Checkbox - 预计 0.5 天
- [ ] Radio - 预计 0.5 天
- [ ] Switch - 预计 0.5 天

### 显示组件（P1）
- [ ] Badge - 预计 0.5 天
- [ ] Avatar - 预计 0.5 天
- [ ] Tag - 预计 0.5 天

### 容器组件（P2）
- [ ] Card - 预计 0.5 天
- [ ] Table - 预计 1 天
- [ ] Modal - 预计 0.5 天
- [ ] Drawer - 预计 0.5 天

### 导航组件（P2）
- [ ] Tabs - 预计 0.5 天
- [ ] Breadcrumb - 预计 0.5 天
- [ ] Pagination - 预计 0.5 天
- [ ] Menu - 预计 0.5 天

**总计**：约 10-12 天

---

## ⚠️ 风险和注意事项

### 潜在风险

1. **布局破坏**
   - 风险：尺寸变化可能影响现有布局
   - 缓解：在 Storybook 中预览所有变化

2. **向后兼容性**
   - 风险：现有代码可能依赖旧尺寸
   - 缓解：提供迁移指南和过渡期

3. **视觉不一致**
   - 风险：部分组件迁移后与未迁移组件不协调
   - 缓解：按优先级批量迁移

### 注意事项

1. **保持 ConfigProvider 兼容**
   ```tsx
   // 确保 size prop 仍然工作
   const globalSize = useSize()
   const resolvedSize = size ?? sizeMap[globalSize]
   ```

2. **更新 TypeScript 类型**
   ```tsx
   // 如果添加新尺寸，更新类型定义
   type Size = "xs" | "sm" | "md" | "lg" | "xl"
   ```

3. **更新文档**
   - 组件 API 文档
   - Storybook 故事
   - 使用示例

---

## 📝 迁移检查清单

### 代码修改
- [ ] 更新组件尺寸变量
- [ ] 更新 TypeScript 类型
- [ ] 更新默认值
- [ ] 添加 CSS 变量引用

### 测试
- [ ] 单元测试通过
- [ ] 视觉回归测试通过
- [ ] 手动测试完成
- [ ] 性能测试通过

### 文档
- [ ] 更新组件 API 文档
- [ ] 更新 Storybook 故事
- [ ] 更新使用示例
- [ ] 更新迁移指南

### 发布
- [ ] 更新 CHANGELOG
- [ ] 更新版本号
- [ ] 发布 npm 包
- [ ] 通知团队

---

## 🔗 相关资源

- 对比分析报告：`docs/COMPONENT_SIZE_COMPARISON.md`
- Ant Design 尺寸标准：`docs/ANTD_COMPONENT_SIZES.md`
- 布局系统：`docs/ANTD_QUICK_REFERENCE.md`
- 完整指南：`docs/ANT_DESIGN_INTEGRATION.md`
