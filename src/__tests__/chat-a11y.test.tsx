import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Bubble } from "@/components/ui/chat-bubble"
import { ChatSender } from "@/components/ui/chat-sender"
import { ChatConversations } from "@/components/ui/chat-conversations"

describe("Chat a11y", () => {
  it("exposes aria-labels for bubble action triggers", () => {
    render(
      <Bubble
        role="assistant"
        content="hello"
        onCopy={() => {}}
        onFeedback={() => {}}
        onRegenerate={() => {}}
      />,
    )

    expect(screen.getByLabelText("复制消息")).toBeInTheDocument()
    expect(screen.getByLabelText("点赞")).toBeInTheDocument()
    expect(screen.getByLabelText("点踩")).toBeInTheDocument()
    expect(screen.getByLabelText("重新生成消息")).toBeInTheDocument()
  })

  it("supports keyboard submit in sender", () => {
    const onSubmit = vi.fn()
    render(<ChatSender value="ping" onSubmit={onSubmit} />)
    const textbox = screen.getByRole("textbox")
    fireEvent.keyDown(textbox, { key: "Enter" })
    expect(onSubmit).toHaveBeenCalledWith("ping", undefined)
  })

  it("supports searching conversations accessibly", async () => {
    render(
      <ChatConversations
        items={[
          { key: "1", label: "Chat A", description: "A" },
          { key: "2", label: "Chat B", description: "B" },
        ]}
      />,
    )

    const search = screen.getByPlaceholderText("搜索会话…")
    fireEvent.change(search, { target: { value: "Chat B" } })
    await waitFor(() => {
      expect(screen.getByText("Chat B")).toBeInTheDocument()
      expect(screen.queryByText("Chat A")).toBeNull()
    })
  })
})
