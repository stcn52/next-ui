# Ant Design 组件尺寸快速参考

## 🎯 核心尺寸规范

### 基础尺寸（适用于大多数组件）
- **Small**: 24px
- **Middle**: 32px (默认)
- **Large**: 40px

## 📦 组件尺寸速查

### 按钮 (Button)

| 尺寸 | 高度 | 水平内边距 | 字体大小 | CSS 变量 |
|------|------|-----------|---------|----------|
| Small | 24px | 7px | 14px | `--btn-height-sm` |
| Middle | 32px | 15px | 14px | `--btn-height` |
| Large | 40px | 15px | 16px | `--btn-height-lg` |

```tsx
// Small
<Button style={{
  height: 'var(--btn-height-sm)',
  padding: '0 var(--btn-padding-horizontal-sm)',
  fontSize: 'var(--btn-font-size-sm)',
  borderRadius: 'var(--btn-border-radius-sm)',
}}>小按钮</Button>

// Middle (默认)
<Button style={{
  height: 'var(--btn-height)',
  padding: '0 var(--btn-padding-horizontal)',
  fontSize: 'var(--btn-font-size)',
  borderRadius: 'var(--btn-border-radius)',
}}>默认按钮</Button>

// Large
<Button style={{
  height: 'var(--btn-height-lg)',
  padding: '0 var(--btn-padding-horizontal-lg)',
  fontSize: 'var(--btn-font-size-lg)',
  borderRadius: 'var(--btn-border-radius-lg)',
}}>大按钮</Button>

// 使用工具类
<Button className="btn-sm">小按钮</Button>
<Button className="btn">默认按钮</Button>
<Button className="btn-lg">大按钮</Button>
```

### 输入框 (Input, Select, DatePicker)

| 尺寸 | 高度 | 水平内边距 | 字体大小 | CSS 变量 |
|------|------|-----------|---------|----------|
| Small | 24px | 7px | 14px | `--input-height-sm` |
| Middle | 32px | 11px | 14px | `--input-height` |
| Large | 40px | 11px | 16px | `--input-height-lg` |

```tsx
// Small
<Input style={{
  height: 'var(--input-height-sm)',
  padding: 'var(--input-padding-vertical-sm) var(--input-padding-horizontal-sm)',
  fontSize: 'var(--input-font-size-sm)',
  borderRadius: 'var(--input-border-radius-sm)',
}} />

// Middle (默认)
<Input style={{
  height: 'var(--input-height)',
  padding: 'var(--input-padding-vertical) var(--input-padding-horizontal)',
  fontSize: 'var(--input-font-size)',
  borderRadius: 'var(--input-border-radius)',
}} />

// Large
<Input style={{
  height: 'var(--input-height-lg)',
  padding: 'var(--input-padding-vertical-lg) var(--input-padding-horizontal-lg)',
  fontSize: 'var(--input-font-size-lg)',
  borderRadius: 'var(--input-border-radius-lg)',
}} />

// 使用工具类
<Input className="input-sm" />
<Input className="input" />
<Input className="input-lg" />
```

### 标签 (Tag)

| 尺寸 | 高度 | 水平内边距 | 字体大小 | CSS 变量 |
|------|------|-----------|---------|----------|
| Small | 18px | 7px | 12px | `--tag-height-sm` |
| Middle | 24px | 8px | 14px | `--tag-height` |
| Large | 32px | 12px | 14px | `--tag-height-lg` |

```tsx
// Small
<div style={{
  height: 'var(--tag-height-sm)',
  padding: '0 var(--tag-padding-horizontal-sm)',
  fontSize: 'var(--tag-font-size-sm)',
  lineHeight: 'var(--tag-height-sm)',
}}>小标签</div>

// Middle (默认)
<div style={{
  height: 'var(--tag-height)',
  padding: '0 var(--tag-padding-horizontal)',
  fontSize: 'var(--tag-font-size)',
  lineHeight: 'var(--tag-height)',
}}>默认标签</div>

// Large
<div style={{
  height: 'var(--tag-height-lg)',
  padding: '0 var(--tag-padding-horizontal-lg)',
  fontSize: 'var(--tag-font-size-lg)',
  lineHeight: 'var(--tag-height-lg)',
}}>大标签</div>

// 使用工具类
<div className="tag-sm">小标签</div>
<div className="tag">默认标签</div>
<div className="tag-lg">大标签</div>
```

### 头像 (Avatar)

| 尺寸 | 大小 | 字体大小 | CSS 变量 |
|------|------|---------|----------|
| XS | 24px | 14px | `--avatar-size-xs` |
| Small | 32px | 18px | `--avatar-size-sm` |
| Middle | 40px | 22px | `--avatar-size` |
| Large | 60px | 36px | `--avatar-size-lg` |
| XL | 80px | 48px | `--avatar-size-xl` |

```tsx
// XS
<Avatar style={{
  width: 'var(--avatar-size-xs)',
  height: 'var(--avatar-size-xs)',
  fontSize: 'var(--avatar-font-size-xs)',
}}>XS</Avatar>

// Small
<Avatar style={{
  width: 'var(--avatar-size-sm)',
  height: 'var(--avatar-size-sm)',
  fontSize: 'var(--avatar-font-size-sm)',
}}>SM</Avatar>

// Middle (默认)
<Avatar style={{
  width: 'var(--avatar-size)',
  height: 'var(--avatar-size)',
  fontSize: 'var(--avatar-font-size)',
}}>MD</Avatar>

// Large
<Avatar style={{
  width: 'var(--avatar-size-lg)',
  height: 'var(--avatar-size-lg)',
  fontSize: 'var(--avatar-font-size-lg)',
}}>LG</Avatar>

// XL
<Avatar style={{
  width: 'var(--avatar-size-xl)',
  height: 'var(--avatar-size-xl)',
  fontSize: 'var(--avatar-font-size-xl)',
}}>XL</Avatar>

// 使用工具类
<Avatar className="avatar-xs">XS</Avatar>
<Avatar className="avatar-sm">SM</Avatar>
<Avatar className="avatar">MD</Avatar>
<Avatar className="avatar-lg">LG</Avatar>
<Avatar className="avatar-xl">XL</Avatar>
```

### 徽章 (Badge)

| 尺寸 | 高度 | 字体大小 | CSS 变量 |
|------|------|---------|----------|
| Small | 14px | 12px | `--badge-height-sm` |
| Default | 20px | 12px | `--badge-height` |
| Dot | 6px | - | `--badge-dot-size` |

```tsx
// Small
<Badge style={{
  height: 'var(--badge-height-sm)',
  fontSize: 'var(--badge-font-size-sm)',
}}>5</Badge>

// Default
<Badge style={{
  height: 'var(--badge-height)',
  fontSize: 'var(--badge-font-size)',
}}>99+</Badge>

// Dot
<div style={{
  width: 'var(--badge-dot-size)',
  height: 'var(--badge-dot-size)',
  borderRadius: '50%',
}} />
```

### 开关 (Switch)

| 尺寸 | 高度 | 最小宽度 | CSS 变量 |
|------|------|---------|----------|
| Small | 16px | 28px | `--switch-height-sm` |
| Default | 22px | 44px | `--switch-height` |

```tsx
// Small
<Switch style={{
  height: 'var(--switch-height-sm)',
  minWidth: 'var(--switch-min-width-sm)',
}} />

// Default
<Switch style={{
  height: 'var(--switch-height)',
  minWidth: 'var(--switch-min-width)',
}} />
```

### 复选框/单选框 (Checkbox, Radio)

| 尺寸 | 大小 | CSS 变量 |
|------|------|----------|
| Small | 14px | `--checkbox-size-sm` |
| Default | 16px | `--checkbox-size` |

```tsx
// Small
<Checkbox style={{
  width: 'var(--checkbox-size-sm)',
  height: 'var(--checkbox-size-sm)',
}} />

// Default
<Checkbox style={{
  width: 'var(--checkbox-size)',
  height: 'var(--checkbox-size)',
}} />
```

### 分页 (Pagination)

| 尺寸 | 项目大小 | 字体大小 | CSS 变量 |
|------|---------|---------|----------|
| Small | 24px | 14px | `--pagination-item-size-sm` |
| Default | 32px | 14px | `--pagination-item-size` |
| Large | 40px | 16px | `--pagination-item-size-lg` |

### 表格 (Table)

| 尺寸 | 垂直内边距 | 水平内边距 | 字体大小 |
|------|-----------|-----------|---------|
| Small | 8px | 8px | 12px |
| Middle | 12px | 12px | 14px |
| Large | 16px | 16px | 14px |

```tsx
// Small
<td style={{
  padding: 'var(--table-padding-vertical-sm) var(--table-padding-horizontal-sm)',
  fontSize: 'var(--table-font-size-sm)',
}}>内容</td>

// Middle (默认)
<td style={{
  padding: 'var(--table-padding-vertical) var(--table-padding-horizontal)',
  fontSize: 'var(--table-font-size)',
}}>内容</td>

// Large
<td style={{
  padding: 'var(--table-padding-vertical-lg) var(--table-padding-horizontal-lg)',
  fontSize: 'var(--table-font-size-lg)',
}}>内容</td>
```

### 卡片 (Card)

| 尺寸 | 内边距 | 头部高度 | CSS 变量 |
|------|-------|---------|----------|
| Small | 12px | 36px | `--card-padding-sm` |
| Default | 24px | 48px | `--card-padding` |
| Large | 24px | 56px | `--card-padding-lg` |

```tsx
// Small
<Card style={{
  padding: 'var(--card-padding-sm)',
}}>内容</Card>

// Default
<Card style={{
  padding: 'var(--card-padding)',
}}>内容</Card>

// Large
<Card style={{
  padding: 'var(--card-padding-lg)',
}}>内容</Card>
```

## 📊 完整尺寸对照表

| 组件 | Small | Middle (默认) | Large | 备注 |
|------|-------|--------------|-------|------|
| Button | 24px | 32px | 40px | 高度 |
| Input | 24px | 32px | 40px | 高度 |
| Select | 24px | 32px | 40px | 高度 |
| Tag | 18px | 24px | 32px | 高度 |
| Avatar | 24px (XS) / 32px (SM) | 40px | 60px (LG) / 80px (XL) | 宽高 |
| Badge | 14px | 20px | - | 高度 |
| Switch | 16px | 22px | - | 高度 |
| Checkbox | 14px | 16px | - | 宽高 |
| Pagination | 24px | 32px | 40px | 项目大小 |
| Steps | 32px | 32px | 40px | 图标大小 |
| Progress | 6px | 8px | 10px | 线条宽度 |
| Rate | 14px | 20px | 36px | 星星大小 |

## 💡 使用建议

### 1. 保持一致性

```tsx
// ✅ 好：同一表单中使用统一尺寸
<form>
  <Input className="input" />
  <Select className="input" />
  <Button className="btn">提交</Button>
</form>

// ❌ 差：混用不同尺寸
<form>
  <Input className="input-sm" />
  <Select className="input-lg" />
  <Button className="btn">提交</Button>
</form>
```

### 2. 根据场景选择

- **Small (24px)**: 紧凑布局、工具栏、表格内操作
- **Middle (32px)**: 默认场景、表单、常规页面
- **Large (40px)**: 重要操作、首页、营销页面

### 3. 响应式尺寸

```tsx
// 移动端使用小尺寸，桌面端使用默认尺寸
<Button className="btn-sm md:btn">响应式按钮</Button>
```

## 🔗 相关文档

- 完整组件尺寸系统：`src/styles/antd-component-sizes.css`
- 布局系统：`docs/ANTD_QUICK_REFERENCE.md`
- 色彩系统：`docs/ANT_DESIGN_INTEGRATION.md`
- 示例组件：`src/examples/AntdComponentSizesExample.tsx`
- Storybook：运行 `pnpm storybook` 查看 "Examples/Ant Design Component Sizes"
