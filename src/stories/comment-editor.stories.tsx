/**
 * CommentEditor stories
 */
import type { Meta, StoryObj } from "@storybook/react"
import { CommentEditor } from "@/components/ui/comment-editor"
import { useState } from "react"

const USERS = [
  { id: "1", name: "张伟", username: "zhangwei", avatar: "" },
  { id: "2", name: "李娜", username: "lina", avatar: "" },
  { id: "3", name: "王芳", username: "wangfang", avatar: "" },
  { id: "4", name: "刘洋", username: "liuyang", avatar: "" },
  { id: "5", name: "陈静", username: "chenjing", avatar: "" },
]

const meta: Meta<typeof CommentEditor> = {
  title: "UI/CommentEditor",
  component: CommentEditor,
  tags: ["autodocs"],
  args: { mentionUsers: USERS },
}

export default meta
type Story = StoryObj<typeof CommentEditor>

export const Default: Story = {}

export const WithCancel: Story = {
  args: { onCancel: () => {} },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithCallback: Story = {
  render: () => {
    const [log, setLog] = useState<string[]>([])
    return (
      <div className="space-y-3">
        <CommentEditor
          mentionUsers={USERS}
          onSubmit={(content, attachments) => {
            setLog((p) => [`提交: "${content}" (附件 ${attachments.length}个)`, ...p])
          }}
          onCancel={() => setLog((p) => ["取消", ...p])}
        />
        {log.length > 0 && (
          <div className="text-xs space-y-0.5 text-muted-foreground">
            {log.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        )}
      </div>
    )
  },
}
