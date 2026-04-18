# Ant Design 布局系统集成 🎨

本项目已集成 **Ant Design 精细布局和色彩系统**，提供企业级的设计 token 和更细腻的间距控制。

## ✨ 新增功能

### 1. 精细间距梯度（8 级）
基于 4px 基础单位：`4px` `8px` `12px` `16px` `20px` `24px` `32px` `48px`

### 2. 统一控件高度
- 小：24px
- 默认：32px  
- 大：40px

### 3. 完整色彩系统
- 品牌色、成功色、警告色、错误色、信息色
- 中性色（文本、背景、边框）
- 自动支持暗色模式

### 4. 圆角梯度
`2px` `4px` `6px` `8px`

## 🚀 快速开始

### 使用 CSS 变量
```tsx
<div style={{ padding: 'var(--padding-lg)' }}>24px padding</div>
<Button style={{ 
  height: 'var(--control-height)',
  backgroundColor: 'var(--color-primary)' 
}}>
  按钮
</Button>
```

### 使用工具类
```tsx
<div className="p-lg gap-md rounded">
  <div className="px-md py-sm">内容</div>
</div>
```

### 在 Tailwind 中使用
```tsx
<div className="p-[var(--padding-lg)] rounded-[var(--radius)]">
  内容
</div>
```

## 📚 文档

- **完整集成指南**：[docs/ANT_DESIGN_INTEGRATION.md](./docs/ANT_DESIGN_INTEGRATION.md)
- **快速参考**：[docs/ANTD_QUICK_REFERENCE.md](./docs/ANTD_QUICK_REFERENCE.md)
- **示例组件**：[src/examples/AntdLayoutExample.tsx](./src/examples/AntdLayoutExample.tsx)

## 🎯 间距速查

| 变量 | 值 | 场景 |
|------|-----|------|
| `--padding-xxs` | 4px | 极小间距 |
| `--padding-xs` | 8px | 小按钮 |
| `--padding-sm` | 12px | 常规按钮 |
| `--padding` | 16px | 默认间距 |
| `--padding-md` | 20px | 中等间距 |
| `--padding-lg` | 24px | 大卡片 |
| `--padding-xl` | 32px | 页面级间距 |

## 🎨 色彩速查

```tsx
// 品牌色
--color-primary: #1677ff
--color-primary-hover: #4096ff
--color-primary-active: #0958d9

// 语义色
--color-success: #52c41a
--color-warning: #faad14
--color-error: #ff4d4f

// 中性色（自动适配暗色模式）
--color-text: rgba(0,0,0,0.88)
--color-text-secondary: rgba(0,0,0,0.65)
--color-bg-container: #ffffff
--color-border: #d9d9d9
```

## 📦 文件结构

```
src/
├── styles/
│   ├── antd-layout.css      # 布局系统（间距、尺寸、圆角）
│   └── antd-colors.css      # 色彩系统（品牌色、语义色、中性色）
├── examples/
│   └── AntdLayoutExample.tsx # 完整示例
└── stories/
    └── antd-layout-example.stories.tsx # Storybook 故事

docs/
├── ANT_DESIGN_INTEGRATION.md  # 完整集成指南
└── ANTD_QUICK_REFERENCE.md    # 快速参考
```

## 🔍 查看示例

运行 Storybook 查看完整示例：

```bash
pnpm storybook
```

然后访问 **Examples > Ant Design Layout**

## 💡 最佳实践

### ✅ 推荐
```tsx
// 使用统一的间距系统
<div className="gap-md">
  <Button className="px-md py-xs">按钮 1</Button>
  <Button className="px-md py-xs">按钮 2</Button>
</div>

// 使用语义化颜色
<Alert style={{ 
  backgroundColor: 'var(--color-error-bg)',
  color: 'var(--color-error-text)' 
}}>
  错误提示
</Alert>
```

### ❌ 避免
```tsx
// 混用随意的数值
<div className="gap-3">
  <Button className="px-3 py-1">按钮 1</Button>
  <Button className="px-4 py-2">按钮 2</Button>
</div>

// 硬编码颜色
<Alert style={{ 
  backgroundColor: '#fff2f0',
  color: '#ff4d4f' 
}}>
  错误提示
</Alert>
```

## 🌓 暗色模式

所有颜色变量自动支持暗色模式，无需额外配置：

```tsx
<div style={{
  backgroundColor: 'var(--color-bg-container)',
  color: 'var(--color-text)',
  borderColor: 'var(--color-border)'
}}>
  自动适配暗色模式
</div>
```

## 🔗 相关资源

- [Ant Design 官方文档](https://ant.design/)
- [Ant Design 设计变量](https://ant.design/docs/react/customize-theme-cn)
- [Ant Design 色板算法](https://ant.design/docs/spec/colors-cn)

---

**提示**：这套布局系统与现有的 Tailwind CSS 完全兼容，可以混合使用。
