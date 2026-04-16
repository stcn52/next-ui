/**
 * RichTextEditor stories
 */
import type { Meta, StoryObj } from "@storybook/react"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

const meta: Meta<typeof RichTextEditor> = {
  title: "UI/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
  args: {
    placeholder: "支持 Markdown 格式……",
    minRows: 6,
    maxRows: 20,
  },
}

export default meta
type Story = StoryObj<typeof RichTextEditor>

export const Default: Story = {}

export const Prefilled: Story = {
  args: {
    defaultValue: `# 标题

**加粗文字** 和 *斜体文字*。

\`\`\`javascript
const hello = "world"
console.log(hello)
\`\`\`

> 引用段落示例

- 无序列表 A
- 无序列表 B

1. 有序列表 1
2. 有序列表 2
`,
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "只读内容，无法编辑。" },
}

export const Compact: Story = {
  args: { minRows: 3, maxRows: 8 },
}
