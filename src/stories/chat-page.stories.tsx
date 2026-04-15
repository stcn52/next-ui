import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

const meta: Meta = {
  title: "Pages/Chat",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj

function ChatPage() {
  const [draft, setDraft] = useState("")

  const messages = [
    { id: 1, user: "Alice", text: "今天上线的版本回归过了吗？", mine: false },
    { id: 2, user: "我", text: "主流程已通过，正在补边界用例。", mine: true },
    { id: 3, user: "Bob", text: "看板里我加了两个阻塞项。", mine: false },
  ]

  return (
    <div className="mx-auto grid h-[700px] max-w-6xl grid-cols-1 gap-4 p-6 md:grid-cols-[280px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">会话列表</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <button className="rounded-lg border bg-accent px-3 py-2 text-left text-sm">
            产品群
          </button>
          <button className="rounded-lg border px-3 py-2 text-left text-sm">研发群</button>
          <button className="rounded-lg border px-3 py-2 text-left text-sm">设计评审</button>
        </CardContent>
      </Card>

      <Card className="flex min-h-0 flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">产品群</CardTitle>
            <Badge variant="secondary">3 在线</Badge>
          </div>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col p-0">
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${m.mine ? "justify-end" : "justify-start"}`}
                >
                  {!m.mine && (
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs">{m.user[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {!m.mine && <p className="mb-0.5 text-xs text-muted-foreground">{m.user}</p>}
                    <p>{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="输入消息…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <Button size="icon" aria-label="发送">
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Default: Story = {
  render: () => <ChatPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("会话列表")).toBeInTheDocument()
    const input = canvas.getByPlaceholderText("输入消息…")
    await userEvent.type(input, "收到，今晚前补齐")
    await expect(input).toHaveValue("收到，今晚前补齐")
  },
}
