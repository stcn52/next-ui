import type { Meta, StoryObj } from '@storybook/react';
import AntdComponentSizesExample from '../examples/AntdComponentSizesExample';

const meta = {
  title: 'Examples/Ant Design Component Sizes',
  component: AntdComponentSizesExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Ant Design 组件尺寸系统

展示所有组件的统一尺寸规范。

## 核心尺寸

### 基础尺寸（适用于大多数组件）
- **Small**: 24px
- **Middle**: 32px (默认)
- **Large**: 40px

### 特殊尺寸
- **Avatar**: XS(24px), SM(32px), MD(40px), LG(60px), XL(80px)
- **Tag**: SM(18px), MD(24px), LG(32px)
- **Badge**: SM(14px), MD(20px), Dot(6px)

## 使用方法

### 按钮
\`\`\`tsx
// Small
<Button style={{
  height: 'var(--btn-height-sm)',
  padding: '0 var(--btn-padding-horizontal-sm)',
  fontSize: 'var(--btn-font-size-sm)',
}}>小按钮</Button>

// Middle (默认)
<Button style={{
  height: 'var(--btn-height)',
  padding: '0 var(--btn-padding-horizontal)',
  fontSize: 'var(--btn-font-size)',
}}>默认按钮</Button>

// Large
<Button style={{
  height: 'var(--btn-height-lg)',
  padding: '0 var(--btn-padding-horizontal-lg)',
  fontSize: 'var(--btn-font-size-lg)',
}}>大按钮</Button>
\`\`\`

### 输入框
\`\`\`tsx
// Small
<Input style={{
  height: 'var(--input-height-sm)',
  padding: 'var(--input-padding-vertical-sm) var(--input-padding-horizontal-sm)',
  fontSize: 'var(--input-font-size-sm)',
}} />

// Middle (默认)
<Input style={{
  height: 'var(--input-height)',
  padding: 'var(--input-padding-vertical) var(--input-padding-horizontal)',
  fontSize: 'var(--input-font-size)',
}} />

// Large
<Input style={{
  height: 'var(--input-height-lg)',
  padding: 'var(--input-padding-vertical-lg) var(--input-padding-horizontal-lg)',
  fontSize: 'var(--input-font-size-lg)',
}} />
\`\`\`

### 使用工具类
\`\`\`tsx
<Button className="btn-sm">小按钮</Button>
<Button className="btn">默认按钮</Button>
<Button className="btn-lg">大按钮</Button>

<Input className="input-sm" />
<Input className="input" />
<Input className="input-lg" />
\`\`\`

## 组件尺寸对照表

| 组件 | Small | Middle | Large |
|------|-------|--------|-------|
| Button | 24px | 32px | 40px |
| Input | 24px | 32px | 40px |
| Select | 24px | 32px | 40px |
| Tag | 18px | 24px | 32px |
| Pagination | 24px | 32px | 40px |
| Switch | 16px | 22px | - |
| Checkbox | 14px | 16px | 16px |

查看完整文档：\`docs/ANTD_COMPONENT_SIZES.md\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AntdComponentSizesExample>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 完整的组件尺寸系统示例，展示：
 * - 按钮尺寸（Small, Middle, Large）
 * - 输入框尺寸
 * - 标签尺寸
 * - 头像尺寸（XS, SM, MD, LG, XL）
 * - 徽章尺寸
 * - 组件尺寸对照表
 */
export const Default: Story = {};

/**
 * 暗色模式下的组件尺寸
 */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};
