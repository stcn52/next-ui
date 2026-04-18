import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { PromptLibrary, type PromptLibraryApplyResult, type PromptLibraryItem } from "@/components/ui/prompt-library"

const ITEMS: PromptLibraryItem[] = [
  {
    key: "bug-report",
    title: "问题排查助手",
    description: "结构化收集报错上下文并输出排查路径",
    category: "研发",
    content: "请帮我排查 {{module}} 中的 {{issue}}，并给出最可能的 3 个根因。",
    variables: [
      { key: "module", label: "模块", placeholder: "例如 ChatSender", required: true },
      { key: "issue", label: "问题", placeholder: "例如 Enter 会误触发送", required: true },
    ],
  },
  {
    key: "copy-rewrite",
    title: "文案润色",
    description: "把输入文案改写成更专业但更简洁的版本",
    category: "内容",
    content: "请将以下内容改写为简洁、专业、自然的中文：{{text}}",
    variables: [
      { key: "text", label: "原文", placeholder: "输入待润色的文案", required: true },
    ],
  },
]

const meta: Meta<typeof PromptLibrary> = {
  title: "Chat/PromptLibrary",
  component: PromptLibrary,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof PromptLibrary>

export const Default: Story = {
  render: function Render() {
    const [result, setResult] = useState<PromptLibraryApplyResult | null>(null)
    return (
      <div className="w-[980px] space-y-3">
        {result && (
          <div className="rounded-lg border bg-muted/50 p-3 text-xs">
            已应用: {result.rendered}
          </div>
        )}
        <PromptLibrary items={ITEMS} onApply={(payload) => setResult(payload)} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("问题排查助手")).toBeInTheDocument()
    await userEvent.type(canvas.getByPlaceholderText("例如 ChatSender"), "ChatSender")
    await userEvent.type(canvas.getByPlaceholderText("例如 Enter 会误触发送"), "布局过高")
    await userEvent.click(canvas.getByRole("button", { name: "应用模板" }))
    await expect(canvas.getByText(/ChatSender 中的 布局过高/)).toBeInTheDocument()
  },
}

export const Filtered: Story = {
  args: {
    items: ITEMS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByPlaceholderText("搜索提示词…"), "文案")
    await expect(canvas.getByText("文案润色")).toBeInTheDocument()
  },
}

export const EmbeddedCompact: Story = {
  args: {
    items: ITEMS,
    density: "compact",
    showItemDescription: false,
    showTemplateDescription: false,
    showTemplateContent: false,
  },
}
