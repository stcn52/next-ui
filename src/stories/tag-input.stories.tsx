/**
 * TagInput — 标签/芯片输入框，回车或逗号添加，× 移除。
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import { TagInput } from "@/components/ui/tag-input"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof TagInput> = {
  title: "UI/TagInput",
  component: TagInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "标签输入框 — 支持回车/逗号创建标签、Backspace 删除最后一个标签、最大数量限制和去重。",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof TagInput>

export const Default: Story = {
  render: function Render() {
    const [tags, setTags] = useState<string[]>(["React", "TypeScript"])
    return (
      <div className="flex flex-col gap-1.5 w-80">
        <Label>技术栈</Label>
        <TagInput
          value={tags}
          onChange={setTags}
          placeholder="输入后回车添加…"
        />
        <p className="text-xs text-muted-foreground">已添加 {tags.length} 个标签</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("textbox")
    await userEvent.type(input, "Vue{Enter}")
    await expect(canvas.getByText("Vue")).toBeInTheDocument()
  },
}

export const WithMaxTags: Story = {
  render: function Render() {
    const [tags, setTags] = useState<string[]>(["前端", "后端"])
    return (
      <div className="flex flex-col gap-1.5 w-80">
        <Label>技能标签（最多 4 个）</Label>
        <TagInput
          value={tags}
          onChange={setTags}
          maxTags={4}
          placeholder="最多可添加 4 个标签"
        />
      </div>
    )
  },
}

export const NoDuplicates: Story = {
  name: "去重模式",
  render: function Render() {
    const [tags, setTags] = useState<string[]>([])
    return (
      <div className="flex flex-col gap-1.5 w-80">
        <Label>不允许重复</Label>
        <TagInput
          value={tags}
          onChange={setTags}
          allowDuplicates={false}
          placeholder="重复标签会被忽略"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-80">
      <Label>禁用状态</Label>
      <TagInput value={["前端", "设计"]} disabled />
    </div>
  ),
}
