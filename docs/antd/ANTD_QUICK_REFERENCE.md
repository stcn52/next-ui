# Ant Design 布局系统快速参考

## 🎯 间距速查表

### Padding/Margin

| 工具类 | CSS 变量 | 值 | 常用场景 |
|--------|----------|-----|----------|
| `p-xxs` / `m-xxs` | `--padding-xxs` / `--margin-xxs` | **4px** | 图标内边距、极小间隙 |
| `p-xs` / `m-xs` | `--padding-xs` / `--margin-xs` | **8px** | 小按钮、紧凑列表项 |
| `p-sm` / `m-sm` | `--padding-sm` / `--margin-sm` | **12px** | 常规按钮、输入框 |
| `p` / `m` | `--padding` / `--margin` | **16px** | 默认间距、卡片内容 |
| `p-md` / `m-md` | `--padding-md` / `--margin-md` | **20px** | 中等间距、分组 |
| `p-lg` / `m-lg` | `--padding-lg` / `--margin-lg` | **24px** | 大卡片、容器 |
| `p-xl` / `m-xl` | `--padding-xl` / `--margin-xl` | **32px** | 页面级间距、大容器 |
| `m-xxl` | `--margin-xxl` | **48px** | 页面区块间距 |

### Gap

```tsx
<div className="gap-xxs">  {/* 4px */}
<div className="gap-xs">   {/* 8px */}
<div className="gap-sm">   {/* 12px */}
<div className="gap">      {/* 16px */}
<div className="gap-md">   {/* 20px */}
<div className="gap-lg">   {/* 24px */}
<div className="gap-xl">   {/* 32px */}
<div className="gap-xxl">  {/* 48px */}
```

## 📏 控件高度

| CSS 变量 | 值 | 使用场景 |
|----------|-----|----------|
| `--control-height-xs` | **16px** | 极小控件 |
| `--control-height-sm` | **24px** | 小按钮、小输入框 |
| `--control-height` | **32px** | 默认按钮、输入框 |
| `--control-height-lg` | **40px** | 大按钮、大输入框 |

```tsx
// 按钮示例
<Button style={{ height: 'var(--control-height-sm)' }}>小按钮</Button>
<Button style={{ height: 'var(--control-height)' }}>默认按钮</Button>
<Button style={{ height: 'var(--control-height-lg)' }}>大按钮</Button>
```

## 🔘 圆角

| 工具类 | CSS 变量 | 值 | 使用场景 |
|--------|----------|-----|----------|
| `rounded-xs` | `--radius-xs` | **2px** | 小标签、徽章 |
| `rounded-sm` | `--radius-sm` | **4px** | 小卡片 |
| `rounded` | `--radius` | **6px** | 默认圆角（按钮、输入框） |
| `rounded-lg` | `--radius-lg` | **8px** | 大卡片、容器 |

```tsx
<div className="rounded">默认圆角 6px</div>
<div style={{ borderRadius: 'var(--radius-lg)' }}>大圆角 8px</div>
```

## 🎨 色彩系统

### 品牌色 (Primary)

```tsx
--color-primary           // #1677ff 主色
--color-primary-hover     // #4096ff 悬停
--color-primary-active    // #0958d9 激活
--color-primary-bg        // #e6f4ff 背景
--color-primary-border    // #91caff 边框
```

### 语义色

```tsx
// 成功
--color-success           // #52c41a
--color-success-bg        // #f6ffed
--color-success-border    // #b7eb8f

// 警告
--color-warning           // #faad14
--color-warning-bg        // #fffbe6
--color-warning-border    // #ffe58f

// 错误
--color-error             // #ff4d4f
--color-error-bg          // #fff2f0
--color-error-border      // #ffa39e

// 信息
--color-info              // #1677ff
--color-info-bg           // #e6f4ff
--color-info-border       // #91caff
```

### 中性色

```tsx
// 文本
--color-text              // rgba(0,0,0,0.88) 主文本
--color-text-secondary    // rgba(0,0,0,0.65) 次要文本
--color-text-tertiary     // rgba(0,0,0,0.45) 辅助文本
--color-text-placeholder  // rgba(0,0,0,0.25) 占位符

// 背景
--color-bg-container      // #ffffff 容器背景
--color-bg-layout         // #f5f5f5 布局背景
--color-fill-alter        // rgba(0,0,0,0.02) 替代填充

// 边框
--color-border            // #d9d9d9 默认边框
--color-border-secondary  // #f0f0f0 次要边框
```

## 💡 常用代码片段

### 按钮

```tsx
// 主按钮
<Button
  style={{
    height: 'var(--control-height)',
    padding: '0 var(--control-padding-horizontal)',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-text-light-solid)',
  }}
>
  主按钮
</Button>

// 次要按钮
<Button
  style={{
    height: 'var(--control-height)',
    padding: '0 var(--control-padding-horizontal)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-container)',
    color: 'var(--color-text)',
  }}
>
  次要按钮
</Button>
```

### 输入框

```tsx
<input
  type="text"
  placeholder="请输入"
  style={{
    height: 'var(--control-height)',
    padding: '0 var(--control-padding-horizontal)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-container)',
    color: 'var(--color-text)',
  }}
/>
```

### 卡片

```tsx
<div
  className="rounded-[var(--radius-lg)]"
  style={{
    padding: 'var(--padding-lg)',
    backgroundColor: 'var(--color-bg-container)',
    border: '1px solid var(--color-border)',
  }}
>
  卡片内容
</div>
```

### 表单项

```tsx
<div className="space-y-[var(--margin-md)]">
  <div>
    <label
      className="block mb-[var(--margin-xs)]"
      style={{ color: 'var(--color-text-label)' }}
    >
      标签
    </label>
    <input
      style={{
        height: 'var(--control-height)',
        padding: '0 var(--control-padding-horizontal)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-border)',
      }}
    />
  </div>
</div>
```

### 警告提示

```tsx
<div
  className="p-[var(--padding-md)] rounded-[var(--radius)]"
  style={{
    backgroundColor: 'var(--color-warning-bg)',
    border: '1px solid var(--color-warning-border)',
    color: 'var(--color-warning-text)',
  }}
>
  警告信息
</div>
```

### 成功提示

```tsx
<div
  className="p-[var(--padding-md)] rounded-[var(--radius)]"
  style={{
    backgroundColor: 'var(--color-success-bg)',
    border: '1px solid var(--color-success-border)',
    color: 'var(--color-success-text)',
  }}
>
  成功信息
</div>
```

### 错误提示

```tsx
<div
  className="p-[var(--padding-md)] rounded-[var(--radius)]"
  style={{
    backgroundColor: 'var(--color-error-bg)',
    border: '1px solid var(--color-error-border)',
    color: 'var(--color-error-text)',
  }}
>
  错误信息
</div>
```

## 🌓 暗色模式

所有颜色变量自动支持暗色模式：

```tsx
// 自动适配暗色模式
<div style={{
  backgroundColor: 'var(--color-bg-container)',
  color: 'var(--color-text)',
  borderColor: 'var(--color-border)'
}}>
  内容会根据主题自动调整
</div>
```

## 📱 响应式间距

```tsx
// 小屏、中屏、大屏使用不同间距
<div className="
  p-[var(--padding-content-horizontal-sm)]
  md:p-[var(--padding-content-horizontal)]
  lg:p-[var(--padding-content-horizontal-lg)]
">
  响应式内容
</div>
```

## 🔗 相关文档

- 完整集成指南：`docs/ANT_DESIGN_INTEGRATION.md`
- 布局 token：`src/styles/antd-layout.css`
- 色彩 token：`src/styles/antd-colors.css`
- 示例组件：`src/examples/AntdLayoutExample.tsx`
- Storybook：运行 `pnpm storybook` 查看 "Examples/Ant Design Layout"
