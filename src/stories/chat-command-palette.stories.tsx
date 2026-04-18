import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Bot, Eraser, FileText, Sparkles } from "lucide-react"
import { ChatCommandPalette, type ChatCommandItem } from "@/components/ui/chat/chat-command-palette"
import { ChatSender } from "@/components/ui/chat/chat-sender"

const COMMANDS: ChatCommandItem[] = [
  {
    key: "model-gpt-4o",
    label: "切换到 GPT-4o",
    description: "使用更强的通用模型",
    group: "模型",
    icon: <Bot className="size-4" />,
    keywords: ["model", "gpt", "4o"],
  },
  {
    key: "inject-file",
    label: "注入当前文件",
    description: "把当前文件作为上下文附加到对话",
    group: "上下文",
    icon: <FileText className="size-4" />,
    keywords: ["file", "context"],
  },
  {
    key: "prompt-refactor",
    label: "插入重构提示",
    description: "插入预设重构类 system prompt",
    group: "提示词",
    icon: <Sparkles className="size-4" />,
    keywords: ["prompt", "refactor"],
  },
  {
    key: "clear-chat",
    label: "清空会话",
    description: "移除当前线程消息",
    group: "会话",
    icon: <Eraser className="size-4" />,
    keywords: ["clear", "reset"],
  },
]

const meta: Meta<typeof ChatCommandPalette> = {
  title: "Chat/CommandPalette",
  component: ChatCommandPalette,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ChatCommandPalette>

export const Standalone: Story = {
  render: function Render() {
    const [lastCommand, setLastCommand] = useState("暂无")
    return (
      <div className="w-[520px] space-y-3">
        <p className="text-xs text-muted-foreground">最近执行: {lastCommand}</p>
        <ChatCommandPalette
          defaultOpen
          items={COMMANDS}
          onSelect={(item) => setLastCommand(item.label)}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("切换到 GPT-4o")).toBeInTheDocument()
    await userEvent.click(canvas.getByText("清空会话"))
    await expect(canvas.getByText("最近执行: 清空会话")).toBeInTheDocument()
  },
}

export const SlashAttachedToSender: Story = {
  render: function Render() {
    const [value, setValue] = useState("/")
    const [selected, setSelected] = useState("暂无")
    return (
      <div className="w-[520px] space-y-2">
        <div className="rounded-lg border p-3">
          <p className="mb-2 text-xs text-muted-foreground">已选择命令: {selected}</p>
          <ChatCommandPalette
            attachTo="chat-sender"
            query={value}
            items={COMMANDS}
            density="compact"
            layout="embedded"
            onSelect={(item) => {
              setSelected(item.label)
              setValue(`/${item.key} `)
            }}
          />
          <ChatSender
            value={value}
            onChange={setValue}
            placeholder="输入 / 打开命令面板"
          />
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("切换到 GPT-4o")).toBeInTheDocument()
    await userEvent.click(canvas.getByText("注入当前文件"))
    await expect(canvas.getByText("已选择命令: 注入当前文件")).toBeInTheDocument()
  },
}

export const TightSenderOverlay: Story = {
  render: function Render() {
    const [value, setValue] = useState("/注")
    const [selected, setSelected] = useState("暂无")
    return (
      <div className="w-[420px] rounded-lg border bg-muted/20 p-2">
        <div className="space-y-1.5 rounded-md border bg-background p-2">
          <p className="text-[11px] text-muted-foreground">窄高 sender attached 回归场景</p>
          <p className="text-[11px] text-muted-foreground">已选择命令: {selected}</p>
          <ChatCommandPalette
            attachTo="chat-sender"
            query={value}
            items={COMMANDS}
            density="dense"
            layout="embedded"
            onSelect={(item) => {
              setSelected(item.label)
              setValue(`/${item.key} `)
            }}
          />
          <ChatSender
            density="compact"
            value={value}
            onChange={setValue}
            placeholder="输入 / 打开命令面板"
          />
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText("模型")).not.toBeInTheDocument()
    await expect(canvas.getByText("注入当前文件")).toBeInTheDocument()
  },
}
