import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ConversationHeader } from "@/components/ui/conversation-header"
import { ChatInputToolbar } from "@/components/ui/chat-input-toolbar"
import { ChatThread } from "@/components/ui/chat-thread"
import { MessageActions } from "@/components/ui/message-actions"
import { MessageComposer } from "@/components/ui/message-composer"
import { MessageReactions } from "@/components/ui/message-reactions"
import { MessageThreadReply } from "@/components/ui/message-thread-reply"
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
          <ChatInputToolbar onVoiceInput={() => {}} onQuickCommand={() => {}} />
        </div>

        <div className="h-40 px-4 pb-3">
          <ChatThread showUnreadDivider>
            <MessageThreadReply author="Chen" content="这个方案可以，先做最小可用版本。" time="10:20" />
            <MessageThreadReply author="AI" content="收到，我先实现基础版本并补测试。" time="10:21" />
          </ChatThread>
        </div>

        <div className="px-4 pb-3">
          <MessageActions
            onCopy={() => {}}
            onEdit={() => {}}
            onThumbsUp={() => {}}
            onThumbsDown={() => {}}
            onRegenerate={() => {}}
          />
          <div className="mt-2">
            <MessageReactions
              reactions={[
                { emoji: "👍", count: 4, active: true },
                { emoji: "🔥", count: 2 },
                { emoji: "🎯", count: 1 },
              ]}
            />
          </div>
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
