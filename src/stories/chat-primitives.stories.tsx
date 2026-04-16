import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ConversationHeader } from "@/components/ui/conversation-header"
import { MessageActions } from "@/components/ui/message-actions"
import { MessageComposer } from "@/components/ui/message-composer"
import { Button } from "@/components/ui/button"

const meta: Meta = {
  title: "Chat/Primitives",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState("")
    return (
      <div className="w-[560px] rounded-xl border bg-background">
        <ConversationHeader
          title="AI 编码助手"
          subtitle="在线"
          avatarFallback="AI"
          actions={<Button variant="outline" size="sm">切换模型</Button>}
        />

        <div className="px-4 py-3 text-sm text-muted-foreground">这里可以放消息列表区域…</div>

        <div className="px-4 pb-3">
          <MessageActions
            onCopy={() => {}}
            onEdit={() => {}}
            onThumbsUp={() => {}}
            onThumbsDown={() => {}}
            onRegenerate={() => {}}
          />
        </div>

        <MessageComposer
          value={value}
          onChange={setValue}
          onSubmit={() => setValue("")}
          suggestions={["解释代码", "生成测试", "优化性能"]}
          footerText="支持拖拽上传、@提及与重试"
        />
      </div>
    )
  },
}
