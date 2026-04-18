# Ant Design 样式系统集成指南

本项目已集成 Ant Design 的精细布局和色彩系统，提供更细腻的间距控制和完整的设计 token。

## 📦 已添加的文件

- `src/styles/antd-layout.css` - 布局系统（间距、尺寸、圆角等）
- `src/styles/antd-colors.css` - 色彩系统（品牌色、中性色、语义色）

## 🎨 核心特性

### 1. 精细的间距梯度

基于 `4px` 基础单位的 8 级间距系统：

```css
--size-xxs: 4px
--size-xs: 8px
--size-sm: 12px
--size: 16px (默认)
--size-md: 20px
--size-lg: 24px
--size-xl: 32px
--size-xxl: 48px
```

### 2. 统一的 Padding/Margin

```tsx
// 使用 CSS 变量
<div style={{ padding: 'var(--padding-lg)' }}>24px padding</div>

// 使用工具类
<div className="p-lg">24px padding</div>
<div className="px-md py-sm">水平 20px，垂直 12px</div>
<div className="gap-xs">8px gap</div>
```

### 3. 控件高度系统

```css
--control-height-xs: 16px
--control-height-sm: 24px
--control-height: 32px (默认)
--control-height-lg: 40px
```

### 4. 圆角梯度

```css
--radius-xs: 2px
--radius-sm: 4px
--radius: 6px (默认)
--radius-lg: 8px
```

### 5. 完整的色彩系统

```tsx
// 品牌色
--color-primary: #1677ff
--color-primary-hover: #4096ff
--color-primary-active: #0958d9

// 语义色
--color-success: #52c41a
--color-warning: #faad14
--color-error: #ff4d4f
--color-info: #1677ff

// 中性色（支持暗色模式）
--color-text: rgba(0, 0, 0, 0.88)
--color-text-secondary: rgba(0, 0, 0, 0.65)
--color-text-tertiary: rgba(0, 0, 0, 0.45)
```

## 🚀 使用方法

### 1. 引入样式文件

在 `src/index.css` 中添加：

```css
@import "./styles/antd-layout.css";
@import "./styles/antd-colors.css";
```

### 2. 在组件中使用

#### 方式 A：使用 CSS 变量

```tsx
<Button
  style={{
    padding: 'var(--padding-sm) var(--padding-md)',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-text-light-solid)',
  }}
>
  按钮
</Button>
```

#### 方式 B：使用工具类

```tsx
<div className="p-lg gap-md rounded">
  <div className="px-md py-sm">内容区域</div>
</div>
```

#### 方式 C：在 Tailwind 中使用

```tsx
// 在 Tailwind 类中引用 CSS 变量
<div className="p-[var(--padding-lg)] rounded-[var(--radius)]">
  内容
</div>
```

### 3. 更新现有组件

#### 示例：优化 Button 组件

```tsx
// 之前：粗糙的间距
<Button className="px-3 py-1.5">按钮</Button>

// 之后：使用 Ant Design 精细间距
<Button className="px-[var(--control-padding-horizontal)] py-[var(--padding-xs)]">
  按钮
</Button>

// 或使用工具类
<Button className="px-md py-xs">按钮</Button>
```

#### 示例：优化 Card 组件

```tsx
// 之前
<Card className="p-4 rounded-lg">内容</Card>

// 之后：更精细的控制
<Card className="p-[var(--padding-content-horizontal)] rounded-[var(--radius-lg)]">
  内容
</Card>

// 或
<Card className="p-lg rounded-lg">内容</Card>
```

## 📐 间距对照表

| 工具类 | CSS 变量 | 值 | 使用场景 |
|--------|----------|-----|----------|
| `p-xxs` | `--padding-xxs` | 4px | 极小间距，图标内边距 |
| `p-xs` | `--padding-xs` | 8px | 小按钮、紧凑布局 |
| `p-sm` | `--padding-sm` | 12px | 常规按钮、输入框 |
| `p` | `--padding` | 16px | 默认间距、卡片内容 |
| `p-md` | `--padding-md` | 20px | 中等间距 |
| `p-lg` | `--padding-lg` | 24px | 大卡片、容器 |
| `p-xl` | `--padding-xl` | 32px | 页面级间距 |

## 🎯 最佳实践

### 1. 保持一致性

```tsx
// ✅ 好：使用统一的间距系统
<div className="gap-md">
  <Button className="px-md py-xs">按钮 1</Button>
  <Button className="px-md py-xs">按钮 2</Button>
</div>

// ❌ 差：混用随意的数值
<div className="gap-3">
  <Button className="px-3 py-1">按钮 1</Button>
  <Button className="px-4 py-2">按钮 2</Button>
</div>
```

### 2. 响应式间距

```tsx
// 根据屏幕尺寸调整间距
<div className="p-[var(--padding-content-horizontal-sm)] md:p-[var(--padding-content-horizontal)] lg:p-[var(--padding-content-horizontal-lg)]">
  响应式内容
</div>
```

### 3. 语义化颜色

```tsx
// ✅ 好：使用语义化颜色
<Alert style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error-text)' }}>
  错误提示
</Alert>

// ❌ 差：硬编码颜色
<Alert style={{ backgroundColor: '#fff2f0', color: '#ff4d4f' }}>
  错误提示
</Alert>
```

## 🔄 迁移现有组件

### 步骤 1：识别需要优化的组件

查找使用了固定间距值的组件：
```bash
grep -r "p-[0-9]" src/components/
grep -r "px-[0-9]" src/components/
grep -r "gap-[0-9]" src/components/
```

### 步骤 2：替换为 Ant Design 间距

```tsx
// 迁移前
<div className="p-4 gap-3 rounded-lg">

// 迁移后
<div className="p-lg gap-md rounded-lg">
```

### 步骤 3：测试视觉效果

确保迁移后的间距在不同屏幕尺寸下都表现良好。

## 📊 与 Tailwind 的对比

| Tailwind | Ant Design | 说明 |
|----------|------------|------|
| `p-4` (16px) | `p` (16px) | 相同 |
| `p-3` (12px) | `p-sm` (12px) | 相同 |
| `p-6` (24px) | `p-lg` (24px) | 相同 |
| `p-2` (8px) | `p-xs` (8px) | 相同 |
| `p-1` (4px) | `p-xxs` (4px) | 相同 |
| `p-5` (20px) | `p-md` (20px) | Ant Design 新增 |
| `p-8` (32px) | `p-xl` (32px) | 相同 |

## 🌓 暗色模式支持

所有颜色变量都支持暗色模式，自动切换：

```tsx
// 自动适配暗色模式
<div style={{ 
  backgroundColor: 'var(--color-bg-container)',
  color: 'var(--color-text)',
  borderColor: 'var(--color-border)'
}}>
  内容会根据主题自动调整颜色
</div>
```

## 🎨 设计 Token 完整列表

查看完整的设计 token：
- 布局 token：`src/styles/antd-layout.css`
- 色彩 token：`src/styles/antd-colors.css`

## 📚 参考资源

- [Ant Design 设计变量](https://ant.design/docs/react/customize-theme-cn)
- [Ant Design 色板生成算法](https://ant.design/docs/spec/colors-cn)
- [Design Token 最佳实践](https://ant.design/docs/spec/design-token-cn)
