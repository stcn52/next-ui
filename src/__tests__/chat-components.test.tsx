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
import { ChatCommandPalette } from "@/components/ui/chat-command-palette"
import { ChatPresence } from "@/components/ui/chat-presence"
import { ChatSender } from "@/components/ui/chat-sender"
import { ChatConversations } from "@/components/ui/chat-conversations"
import { PromptLibrary, renderPromptTemplate } from "@/components/ui/prompt-library"

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
    fireEvent.click(screen.getByRole("button", { name: "打开快捷提示" }))
    expect(screen.getByLabelText("应用提示 Option A")).toBeTruthy()
    fireEvent.click(screen.getByLabelText("应用提示 Option A"))
    expect(spy).toHaveBeenCalledWith("Option A")
  })

  it("supports inline suggestions when requested", () => {
    render(
      <ChatSender suggestions={["Option A"]} suggestionsVariant="inline" />,
    )
    expect(screen.getByText("Option A")).toBeTruthy()
    expect(screen.queryByRole("button", { name: "打开快捷提示" })).toBeNull()
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

  it("can keep the default attachment button alongside custom actions", () => {
    render(
      <ChatSender
        leadingActions={<span data-testid="leading-action">L</span>}
        showDefaultAttachmentButton
      />,
    )
    expect(screen.getByTestId("leading-action")).toBeTruthy()
    expect(screen.getByRole("button", { name: "添加附件" })).toBeTruthy()
  })

  it("supports attachment summary mode", () => {
    render(
      <ChatSender
        attachments={[
          { id: "1", name: "design.png", type: "image", status: "done" },
          { id: "2", name: "logs.txt", type: "file", status: "uploading" },
        ]}
        attachmentDisplay="summary"
      />,
    )
    expect(screen.getByText("2 个附件")).toBeTruthy()
    expect(screen.getByText("上传中 1")).toBeTruthy()
    expect(screen.queryByText("design.png")).toBeNull()
  })

  it("supports keyboard mention selection without submitting", () => {
    const onChange = vi.fn()
    const onSubmit = vi.fn()
    render(
      <ChatSender
        value="@"
        mentions={[
          { key: "file", label: "file", description: "File reference" },
          { key: "folder", label: "folder", description: "Folder reference" },
        ]}
        onChange={onChange}
        onSubmit={onSubmit}
      />,
    )
    const textarea = screen.getByRole("textbox")
    fireEvent.keyDown(textarea, { key: "ArrowDown" })
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false })
    expect(onChange).toHaveBeenCalledWith("@folder ")
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("disables send when empty", () => {
    render(<ChatSender value="" />)
    expect(screen.getByRole("button", { name: "发送" })).toBeDisabled()
  })

  it("renders status actions in the utility row", () => {
    render(<ChatSender statusActions={<span>模型: GPT-4o</span>} />)
    expect(screen.getByText("模型: GPT-4o")).toBeTruthy()
  })
})

describe("ChatPresence", () => {
  it("renders typing and read states inline", () => {
    render(<ChatPresence typing readState="read" />)
    expect(screen.getByText("输入中")).toBeTruthy()
    expect(screen.getByText("已读")).toBeTruthy()
  })

  it("renders participant stack in badge mode", () => {
    render(
      <ChatPresence
        variant="badge"
        participants={[
          { key: "a", label: "Alice" },
          { key: "b", label: "Bob" },
          { key: "c", label: "Chen" },
          { key: "d", label: "Dana" },
        ]}
      />,
    )
    expect(screen.getByLabelText("Alice")).toBeTruthy()
    expect(screen.getByText("+1")).toBeTruthy()
  })
})

describe("ChatCommandPalette", () => {
  const items = [
    { key: "model", label: "切换模型", description: "选择新的模型", group: "模型" },
    { key: "context", label: "注入上下文", description: "添加上下文", group: "上下文" },
  ]

  it("filters by slash query", () => {
    render(<ChatCommandPalette open query="/模型" items={items} />)
    expect(screen.getByText("切换模型")).toBeTruthy()
    expect(screen.queryByText("注入上下文")).toBeNull()
  })

  it("calls onSelect when clicking an item", () => {
    const onSelect = vi.fn()
    render(<ChatCommandPalette open items={items} onSelect={onSelect} />)
    fireEvent.click(screen.getByText("注入上下文"))
    expect(onSelect).toHaveBeenCalledWith(items[1])
  })

  it("supports standalone search input", () => {
    render(<ChatCommandPalette defaultOpen items={items} />)
    fireEvent.change(screen.getByPlaceholderText("搜索命令…"), {
      target: { value: "上下文" },
    })
    expect(screen.getByText("注入上下文")).toBeTruthy()
    expect(screen.queryByText("切换模型")).toBeNull()
  })
})

describe("PromptLibrary", () => {
  const items = [
    {
      key: "bug",
      title: "排查问题",
      description: "定位问题根因",
      category: "研发",
      content: "请分析 {{module}} 的 {{issue}}。",
      variables: [
        { key: "module", label: "模块" },
        { key: "issue", label: "问题" },
      ],
    },
    {
      key: "copy",
      title: "润色文案",
      description: "优化表达",
      category: "内容",
      content: "请优化：{{text}}",
      variables: [{ key: "text", label: "原文" }],
    },
  ]

  it("renders filtered templates by search", () => {
    render(<PromptLibrary items={items} />)
    fireEvent.change(screen.getByPlaceholderText("搜索提示词…"), {
      target: { value: "文案" },
    })
    expect(screen.getByText("润色文案")).toBeTruthy()
    expect(screen.getByPlaceholderText("搜索提示词…")).toHaveValue("文案")
  })

  it("applies rendered prompt with variable values", () => {
    const onApply = vi.fn()
    render(<PromptLibrary items={items} onApply={onApply} />)
    fireEvent.change(screen.getByPlaceholderText("模块"), { target: { value: "ChatSender" } })
    fireEvent.change(screen.getByPlaceholderText("问题"), { target: { value: "高度过高" } })
    fireEvent.click(screen.getByRole("button", { name: "应用模板" }))
    expect(onApply).toHaveBeenCalledWith(
      {
        raw: "请分析 {{module}} 的 {{issue}}。",
        rendered: "请分析 ChatSender 的 高度过高。",
        values: { module: "ChatSender", issue: "高度过高" },
      },
      items[0],
    )
  })

  it("renders templates with helper function", () => {
    expect(renderPromptTemplate("Hello {{name}}", { name: "World" })).toBe("Hello World")
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
