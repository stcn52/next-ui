import type { Meta, StoryObj } from '@storybook/react';
import AntdLayoutExample from '../examples/AntdLayoutExample';

const meta = {
  title: 'Examples/Ant Design Layout',
  component: AntdLayoutExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Ant Design 布局系统

展示如何使用 Ant Design 的精细布局和色彩系统。

## 核心特性

- **精细间距梯度**：基于 4px 的 8 级间距系统（4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px）
- **统一控件高度**：16px, 24px, 32px, 40px
- **圆角梯度**：2px, 4px, 6px, 8px
- **完整色彩系统**：品牌色、语义色、中性色，支持暗色模式

## 使用方法

### 方式 1：CSS 变量
\`\`\`tsx
<div style={{ padding: 'var(--padding-lg)' }}>24px padding</div>
\`\`\`

### 方式 2：工具类
\`\`\`tsx
<div className="p-lg">24px padding</div>
\`\`\`

### 方式 3：Tailwind 中使用
\`\`\`tsx
<div className="p-[var(--padding-lg)]">24px padding</div>
\`\`\`

## 间距对照表

| 变量 | 值 | 使用场景 |
|------|-----|----------|
| \`--padding-xxs\` | 4px | 极小间距 |
| \`--padding-xs\` | 8px | 小按钮 |
| \`--padding-sm\` | 12px | 常规按钮 |
| \`--padding\` | 16px | 默认间距 |
| \`--padding-md\` | 20px | 中等间距 |
| \`--padding-lg\` | 24px | 大卡片 |
| \`--padding-xl\` | 32px | 页面级间距 |

查看完整文档：\`docs/ANT_DESIGN_INTEGRATION.md\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AntdLayoutExample>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 完整的 Ant Design 布局系统示例，展示：
 * - 间距梯度（Spacing Scale）
 * - 控件高度（Control Height）
 * - 圆角梯度（Border Radius）
 * - 色彩系统（Color System）
 * - 实际应用示例（表单）
 */
export const Default: Story = {};

/**
 * 暗色模式下的布局系统
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
