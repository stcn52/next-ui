import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ChatInputToolbar } from "@/components/ui/chat-input-toolbar"
import { ChatThread } from "@/components/ui/chat-thread"
import { MessageReactions } from "@/components/ui/message-reactions"
import { MessageThreadReply } from "@/components/ui/message-thread-reply"

describe("Chat advanced components", () => {
  it("renders unread divider in ChatThread", async () => {
    render(
      <ChatThread showUnreadDivider unreadLabel="未读">
        <div>msg</div>
      </ChatThread>,
    )
    await waitFor(() => {
      expect(screen.getByText("未读")).toBeInTheDocument()
      expect(screen.getByText("msg")).toBeInTheDocument()
    })
  })

  it("triggers toolbar actions", () => {
    const voice = vi.fn()
    const cmd = vi.fn()
    render(<ChatInputToolbar onVoiceInput={voice} onQuickCommand={cmd} />)

    fireEvent.click(screen.getByLabelText("语音输入"))
    fireEvent.click(screen.getByLabelText("快捷指令"))

    expect(voice).toHaveBeenCalledOnce()
    expect(cmd).toHaveBeenCalledOnce()
  })

  it("toggles reactions", () => {
    const onToggle = vi.fn()
    render(
      <MessageReactions
        reactions={[{ emoji: "👍", count: 2 }, { emoji: "🔥", count: 1 }]}
        onToggle={onToggle}
      />,
    )

    fireEvent.click(screen.getByLabelText("reaction-👍"))
    expect(onToggle).toHaveBeenCalledWith("👍")
  })

  it("renders thread reply", () => {
    render(<MessageThreadReply author="AI" content="done" time="10:30" />)
    expect(screen.getByText("AI")).toBeInTheDocument()
    expect(screen.getByText("done")).toBeInTheDocument()
    expect(screen.getByText("10:30")).toBeInTheDocument()
  })
})
