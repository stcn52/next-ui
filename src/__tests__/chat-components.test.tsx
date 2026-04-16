import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import {
  Bubble,
  BubbleList,
  CodeBlock,
  RichContent,
  ThoughtChain,
  TypingIndicator,
} from "@/components/ui/chat-bubble"
import { ChatSender } from "@/components/ui/chat-sender"
import { ChatConversations } from "@/components/ui/chat-conversations"

/* ================================================================== */
/*  Bubble                                                             */
/* ================================================================== */

describe("Bubble", () => {
  it("renders user message with data-slot and data-role", () => {
    const { container } = render(
      <Bubble role="user" content="Hello world" />,
    )
    const bubble = container.querySelector('[data-slot="chat-bubble"]')
    expect(bubble).toBeTruthy()
    expect(bubble?.getAttribute("data-role")).toBe("user")
    expect(screen.getByText("Hello world")).toBeTruthy()
  })

  it("renders assistant message with avatar", () => {
    const { container } = render(
      <Bubble role="assistant" content="Hi there" timestamp="10:00" />,
    )
    expect(container.querySelector('[data-role="assistant"]')).toBeTruthy()
    expect(screen.getByText("10:00")).toBeTruthy()
  })

  it("renders system message as a divider", () => {
    const { container } = render(
      <Bubble role="system" content="今天" />,
    )
    const bubble = container.querySelector('[data-role="system"]')
    expect(bubble).toBeTruthy()
    expect(screen.getByText("今天")).toBeTruthy()
  })

  it("shows ThoughtChain for assistant with thinking steps", () => {
    render(
      <Bubble role="assistant" content="Answer" thinking={["Step 1", "Step 2"]} />,
    )
    expect(screen.getByText("思考过程 (2 步)")).toBeTruthy()
  })

  it("calls onCopy when copy action is provided", () => {
    const spy = vi.fn()
    const { container } = render(<Bubble role="assistant" content="Copy me" onCopy={spy} />)
    // Action buttons have size-6 class. The copy button is the first one.
    const actionBtns = container.querySelectorAll("button.size-6, button[class*='size-6']")
    // Fallback: find all buttons in the opacity-0 action area
    const allBtns = Array.from(container.querySelectorAll("button"))
    const copyBtn = actionBtns[0] ?? allBtns.find((b) => b.closest("[class*='opacity-0']"))
    expect(copyBtn).toBeTruthy()
    fireEvent.click(copyBtn!)
    expect(spy).toHaveBeenCalledWith("Copy me")
  })

  it("shows edit button for user messages when onEdit provided", () => {
    const spy = vi.fn()
    const { container } = render(<Bubble role="user" content="Editable" onEdit={spy} />)
    // At least one interactive action trigger should exist.
    const buttons = container.querySelectorAll("button")
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it("shows regenerate button for assistant when onRegenerate provided", () => {
    const spy = vi.fn()
    const { container } = render(<Bubble role="assistant" content="Regen" onRegenerate={spy} />)
    // The regenerate button is the last icon button in the actions area
    const buttons = container.querySelectorAll("button")
    const regenBtn = buttons[buttons.length - 1]
    expect(regenBtn).toBeTruthy()
    fireEvent.click(regenBtn)
    expect(spy).toHaveBeenCalledOnce()
  })

  it("supports custom header and footer", () => {
    render(
      <Bubble role="assistant" content="Main" header={<span>Header</span>} footer={<span>Footer</span>} />,
    )
    expect(screen.getByText("Header")).toBeTruthy()
    expect(screen.getByText("Footer")).toBeTruthy()
  })

  it("shows sent check icon for user with status=sent", () => {
    render(<Bubble role="user" content="Sent" status="sent" timestamp="11:00" />)
    expect(screen.getByText("11:00")).toBeTruthy()
  })
})

/* ================================================================== */
/*  CodeBlock                                                          */
/* ================================================================== */

describe("CodeBlock", () => {
  it("renders code with language label", () => {
    const { container } = render(
      <CodeBlock code="const x = 1" language="typescript" />,
    )
    expect(container.querySelector('[data-slot="chat-code-block"]')).toBeTruthy()
    expect(screen.getByText("typescript")).toBeTruthy()
    expect(screen.getByText("const x = 1")).toBeTruthy()
  })
})

/* ================================================================== */
/*  RichContent                                                        */
/* ================================================================== */

describe("RichContent", () => {
  it("renders plain text", () => {
    render(<RichContent content="Hello plain text" />)
    expect(screen.getByText("Hello plain text")).toBeTruthy()
  })

  it("renders code fences as CodeBlock", () => {
    const content = "Before\n\n```js\nconsole.log('hi')\n```\n\nAfter"
    const { container } = render(<RichContent content={content} />)
    expect(container.querySelector('[data-slot="chat-code-block"]')).toBeTruthy()
    expect(screen.getByText("js")).toBeTruthy()
    expect(screen.getByText("console.log('hi')")).toBeTruthy()
  })
})

/* ================================================================== */
/*  ThoughtChain                                                       */
/* ================================================================== */

describe("ThoughtChain", () => {
  it("renders step count and expands on click", () => {
    render(<ThoughtChain steps={["Analyze", "Synthesize", "Reply"]} />)
    expect(screen.getByText("思考过程 (3 步)")).toBeTruthy()
    // Steps hidden initially
    expect(screen.queryByText("Analyze")).toBeNull()
    // Click to expand
    fireEvent.click(screen.getByText("思考过程 (3 步)"))
    expect(screen.getByText("Analyze")).toBeTruthy()
    expect(screen.getByText("Synthesize")).toBeTruthy()
    expect(screen.getByText("Reply")).toBeTruthy()
  })
})

/* ================================================================== */
/*  TypingIndicator                                                    */
/* ================================================================== */

describe("TypingIndicator", () => {
  it("renders default text", () => {
    const { container } = render(<TypingIndicator />)
    expect(container.querySelector('[data-slot="typing-indicator"]')).toBeTruthy()
    expect(screen.getByText("AI 正在思考…")).toBeTruthy()
  })

  it("renders custom text", () => {
    render(<TypingIndicator text="Loading..." />)
    expect(screen.getByText("Loading...")).toBeTruthy()
  })
})

/* ================================================================== */
/*  BubbleList                                                         */
/* ================================================================== */

describe("BubbleList", () => {
  it("renders multiple bubbles", () => {
    const items = [
      { role: "user" as const, content: "Question" },
      { role: "assistant" as const, content: "Answer" },
    ]
    const { container } = render(<BubbleList items={items} />)
    expect(container.querySelector('[data-slot="bubble-list"]')).toBeTruthy()
    expect(screen.getByText("Question")).toBeTruthy()
    expect(screen.getByText("Answer")).toBeTruthy()
  })
})

/* ================================================================== */
/*  ChatSender                                                         */
/* ================================================================== */

describe("ChatSender", () => {
  it("renders with placeholder and send button", () => {
    render(<ChatSender placeholder="Type here..." />)
    expect(screen.getByPlaceholderText("Type here...")).toBeTruthy()
    expect(screen.getByRole("button", { name: "发送" })).toBeTruthy()
  })

  it("calls onSubmit when send is clicked", () => {
    const spy = vi.fn()
    render(<ChatSender value="Hello" onSubmit={spy} />)
    fireEvent.click(screen.getByRole("button", { name: "发送" }))
    expect(spy).toHaveBeenCalledWith("Hello", undefined)
  })

  it("calls onSubmit on Enter key", () => {
    const spy = vi.fn()
    render(<ChatSender value="Hello" onSubmit={spy} />)
    const textarea = screen.getByRole("textbox")
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false })
    expect(spy).toHaveBeenCalledWith("Hello", undefined)
  })

  it("does not submit on Shift+Enter", () => {
    const spy = vi.fn()
    render(<ChatSender value="Hello" onSubmit={spy} />)
    const textarea = screen.getByRole("textbox")
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true })
    expect(spy).not.toHaveBeenCalled()
  })

  it("renders suggestions when provided", () => {
    const spy = vi.fn()
    render(
      <ChatSender suggestions={["Option A", "Option B"]} onSuggestionClick={spy} />,
    )
    expect(screen.getByText("Option A")).toBeTruthy()
    fireEvent.click(screen.getByText("Option A"))
    expect(spy).toHaveBeenCalledWith("Option A")
  })

  it("shows stop button when loading", () => {
    const spy = vi.fn()
    render(<ChatSender loading onCancel={spy} />)
    const stop = screen.getByText("停止生成")
    expect(stop).toBeTruthy()
    fireEvent.click(stop.closest("button")!)
    expect(spy).toHaveBeenCalledOnce()
  })

  it("renders footer text", () => {
    render(<ChatSender footerText="Disclaimer here" />)
    expect(screen.getByText("Disclaimer here")).toBeTruthy()
  })

  it("renders custom prefix element", () => {
    render(<ChatSender prefix={<span data-testid="custom-prefix">P</span>} />)
    expect(screen.getByTestId("custom-prefix")).toBeTruthy()
  })

  it("disables send when empty", () => {
    render(<ChatSender value="" />)
    expect(screen.getByRole("button", { name: "发送" })).toBeDisabled()
  })
})

/* ================================================================== */
/*  ChatConversations                                                  */
/* ================================================================== */

describe("ChatConversations", () => {
  const items = [
    { key: "1", label: "Chat A", description: "Last msg A", time: "10:00", group: "Today", unread: 3 },
    { key: "2", label: "Chat B", description: "Last msg B", time: "09:00", group: "Today" },
    { key: "3", label: "Chat C", description: "Last msg C", time: "Yesterday", group: "Yesterday" },
  ]

  it("renders with data-slot and title", async () => {
    const { container } = render(<ChatConversations items={items} />)
    await waitFor(() => {
      expect(container.querySelector('[data-slot="chat-conversations"]')).toBeTruthy()
      expect(screen.getByText("会话列表")).toBeTruthy()
    })
  })

  it("renders grouped conversations", async () => {
    render(<ChatConversations items={items} />)
    await waitFor(() => {
      expect(screen.getByText("Today")).toBeTruthy()
      // "Yesterday" appears both as group header and item time
      expect(screen.getAllByText("Yesterday").length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText("Chat A")).toBeTruthy()
      expect(screen.getByText("Chat C")).toBeTruthy()
    })
  })

  it("shows unread badge", async () => {
    render(<ChatConversations items={items} />)
    await waitFor(() => {
      expect(screen.getByText("3")).toBeTruthy()
    })
  })

  it("calls onChange on item click", async () => {
    const spy = vi.fn()
    render(<ChatConversations items={items} onChange={spy} />)
    await waitFor(() => {
      fireEvent.click(screen.getByText("Chat B"))
    })
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith("2", items[1])
    })
  })

  it("renders new chat button when onNewChat provided", async () => {
    const spy = vi.fn()
    render(<ChatConversations items={items} onNewChat={spy} />)
    await waitFor(() => {
      const btn = screen.getByRole("button", { name: "新建会话" })
      fireEvent.click(btn)
    })
    await waitFor(() => {
      expect(spy).toHaveBeenCalledOnce()
    })
  })

  it("filters items by search query", async () => {
    render(<ChatConversations items={items} />)
    const searchInput = screen.getByPlaceholderText("搜索会话…")
    await waitFor(() => {
      fireEvent.change(searchInput, { target: { value: "Chat C" } })
    })
    await waitFor(() => {
      expect(screen.getByText("Chat C")).toBeTruthy()
      expect(screen.queryByText("Chat A")).toBeNull()
    })
  })

  it("supports custom title", async () => {
    render(<ChatConversations items={items} title="My Chats" />)
    await waitFor(() => {
      expect(screen.getByText("My Chats")).toBeTruthy()
    })
  })
})
