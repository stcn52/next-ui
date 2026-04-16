import { useCallback, useRef, useState, useEffect } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bubble,
  type BubbleProps,
  TypingIndicator,
} from "@/components/ui/chat-bubble"
import { ChatConversations, type ConversationItem } from "@/components/ui/chat-conversations"
import { ChatSender, type Attachment, type MentionItem } from "@/components/ui/chat-sender"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bot, FileText, FileUp, Image, Search, Sparkles, X } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  status?: "sending" | "sent" | "error"
  thinking?: string[]
  streaming?: boolean
  model?: string
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CONVERSATIONS: ConversationItem[] = [
  { key: "1", label: "AI 编码助手", description: "已为你生成代码片段…", time: "10:30", unread: 2, group: "今天" },
  { key: "2", label: "翻译助手", description: "翻译已完成", time: "09:15", group: "今天" },
  { key: "3", label: "PPT 大纲生成", description: "大纲内容如下…", time: "昨天", group: "昨天" },
  { key: "4", label: "数据分析报告", description: "报告已生成，请查收。", time: "昨天", group: "昨天" },
  { key: "5", label: "学习计划", description: "推荐以下学习路径…", time: "3天前", group: "更早" },
]

const MODELS = [
  { id: "gpt-4o", label: "GPT-4o" },
  { id: "claude-4", label: "Claude Opus 4" },
  { id: "deepseek-v3", label: "DeepSeek V3" },
]

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "sys-1", role: "system", content: "今天", timestamp: "" },
  {
    id: "m1",
    role: "assistant",
    content: "你好！我是 AI 编码助手 🤖\n\n我可以帮你完成以下任务：\n- 编写和优化代码\n- 解释错误信息\n- 代码审查与重构建议\n- 生成单元测试\n\n请问有什么可以帮你的？",
    timestamp: "10:00",
    model: "gpt-4o",
  },
  { id: "m2", role: "user", content: "帮我写一个 React 自定义 Hook，用来做防抖搜索。", timestamp: "10:05", status: "sent" },
  {
    id: "m3",
    role: "assistant",
    content: "好的，这是一个 `useDebounceSearch` Hook 的实现：\n\n```typescript\nfunction useDebounceSearch(delay = 300) {\n  const [query, setQuery] = useState('')\n  const [debouncedQuery, setDebouncedQuery] = useState('')\n\n  useEffect(() => {\n    const timer = setTimeout(() => {\n      setDebouncedQuery(query)\n    }, delay)\n    return () => clearTimeout(timer)\n  }, [query, delay])\n\n  return { query, setQuery, debouncedQuery }\n}\n```\n\n**主要特点：**\n1. 输入变化后延迟 300ms 才触发实际搜索\n2. 每次输入都会重置计时器，避免频繁请求\n3. 组件卸载时自动清理 timer",
    timestamp: "10:05",
    thinking: ["分析用户需求：React 防抖搜索 Hook", "选择 useState + useEffect 实现方案", "添加清理函数防止内存泄漏"],
    model: "gpt-4o",
  },
  { id: "m4", role: "user", content: "能加上 loading 状态和取消请求的功能吗？", timestamp: "10:28", status: "sent" },
  {
    id: "m5",
    role: "assistant",
    content: "当然可以！这里是增强版本，加入了 `loading` 状态和 `AbortController` 取消请求：\n\n```typescript\nfunction useDebounceSearch<T>(fetcher: (q: string, signal: AbortSignal) => Promise<T>, delay = 300) {\n  const [query, setQuery] = useState('')\n  const [data, setData] = useState<T | null>(null)\n  const [loading, setLoading] = useState(false)\n  const abortRef = useRef<AbortController>()\n\n  useEffect(() => {\n    if (!query) { setData(null); return }\n    const timer = setTimeout(async () => {\n      abortRef.current?.abort()\n      const ctrl = new AbortController()\n      abortRef.current = ctrl\n      setLoading(true)\n      try {\n        const res = await fetcher(query, ctrl.signal)\n        if (!ctrl.signal.aborted) setData(res)\n      } finally {\n        if (!ctrl.signal.aborted) setLoading(false)\n      }\n    }, delay)\n    return () => clearTimeout(timer)\n  }, [query, delay, fetcher])\n\n  return { query, setQuery, data, loading }\n}\n```\n\n**改进点：**\n- 🔄 `loading` 状态跟踪请求进度\n- ❌ 新请求发起前自动取消上一个未完成的请求\n- 🛡️ 使用 `AbortSignal` 防止竞态条件",
    timestamp: "10:30",
    thinking: ["评估需求：loading 状态 + 取消请求", "引入 AbortController 管理请求生命周期", "处理竞态条件：确保旧请求不覆盖新结果", "添加泛型支持以提升复用性"],
    model: "gpt-4o",
  },
]

const PROMPT_SUGGESTIONS = [
  { icon: "💡", text: "帮我写一个组件" },
  { icon: "🔍", text: "解释这段代码" },
  { icon: "🧪", text: "生成单元测试" },
  { icon: "📝", text: "优化代码性能" },
]

const QUICK_REPLIES = [
  "能再详细解释一下吗？",
  "帮我加上 TypeScript 类型",
  "写个使用示例",
]

const MENTION_ITEMS: MentionItem[] = [
  { key: "file", label: "文件", description: "引用项目文件" },
  { key: "code", label: "代码块", description: "引用代码片段" },
  { key: "doc", label: "文档", description: "引用技术文档" },
  { key: "web", label: "网页", description: "引用网页内容" },
]

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function WelcomeScreen({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg">
        <Sparkles className="size-8" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold">你好，有什么可以帮你的？</h2>
        <p className="mt-1 text-sm text-muted-foreground">选择以下场景快速开始，或直接输入你的问题</p>
      </div>
      <div className="grid w-full max-w-md grid-cols-2 gap-3">
        {PROMPT_SUGGESTIONS.map((p) => (
          <button
            key={p.text}
            onClick={() => onPrompt(p.text)}
            className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-left text-sm transition-colors hover:bg-accent"
          >
            <span className="text-lg">{p.icon}</span>
            <span>{p.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function AttachmentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-label="添加附件">
          <FileUp className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加附件</DialogTitle>
          <DialogDescription>选择文件类型并上传</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          <button className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent">
            <Image className="size-8 text-blue-500" />
            <span className="text-sm">图片</span>
            <span className="text-[10px] text-muted-foreground">PNG, JPG, GIF</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent">
            <FileText className="size-8 text-green-500" />
            <span className="text-sm">文档</span>
            <span className="text-[10px] text-muted-foreground">PDF, TXT, MD</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ModelSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 w-36 text-xs" aria-label="选择模型">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MODELS.map((m) => (
          <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Pages/Chat",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}

export default meta
type Story = StoryObj

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

function ChatPage() {
  const [activeConv, setActiveConv] = useState("1")
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [draft, setDraft] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [model, setModel] = useState("gpt-4o")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const streamIdRef = useRef(0)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const simulateAIReply = useCallback((userText: string, replyModel: string) => {
    setIsTyping(true)
    const thinkSteps = [
      `分析用户输入："${userText.slice(0, 20)}${userText.length > 20 ? "…" : ""}"`,
      "检索相关上下文和知识库",
      "生成回复内容",
    ]
    const replyContent = `收到你的消息："${userText}"\n\n这是一条模拟的 AI 回复（${replyModel}）。在实际应用中，这里会接入大语言模型 API 来返回智能回答。`

    setTimeout(() => {
      setIsTyping(false)
      const id = `a-${Date.now()}`
      streamIdRef.current += 1
      const currentStream = streamIdRef.current
      setMessages((prev) => [
        ...prev,
        { id, role: "assistant", content: "", timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }), thinking: thinkSteps, streaming: true, model: replyModel },
      ])

      let charIndex = 0
      const interval = setInterval(() => {
        if (currentStream !== streamIdRef.current) {
          clearInterval(interval)
          return
        }
        charIndex += 3
        if (charIndex >= replyContent.length) {
          setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: replyContent, streaming: false } : m)))
          clearInterval(interval)
        } else {
          setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: replyContent.slice(0, charIndex) } : m)))
        }
      }, 20)
    }, 800)
  }, [])

  const handleSend = useCallback((text: string, atts?: Attachment[]) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: atts && atts.length > 0 ? `${text}\n\n📎 ${atts.map((a) => a.name).join(", ")}` : text,
      timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }
    setMessages((prev) => [...prev, userMsg])
    setDraft("")
    setAttachments([])
    simulateAIReply(text, model)
  }, [model, simulateAIReply])

  const handleAddAttachment = useCallback(() => {
    const id = `att-${Date.now()}`
    setAttachments((prev) => [...prev, { id, name: `示例文件-${prev.length + 1}.png`, type: "image" as const, size: "128KB" }])
  }, [])

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const filteredMessages = searchQuery
    ? messages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages

  const handleRegenerate = useCallback((msgId: string) => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === msgId)
      if (idx < 0) return prev
      const userMsg = [...prev].slice(0, idx).reverse().find((m) => m.role === "user")
      const updated = prev.filter((m) => m.id !== msgId)
      if (userMsg) setTimeout(() => simulateAIReply(userMsg.content, model), 0)
      return updated
    })
  }, [simulateAIReply, model])

  const handleEdit = useCallback((msgId: string, newContent: string) => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === msgId)
      if (idx < 0) return prev
      const updated = prev.slice(0, idx + 1).map((m) => (m.id === msgId ? { ...m, content: newContent } : m))
      setTimeout(() => simulateAIReply(newContent, model), 0)
      return updated
    })
  }, [simulateAIReply, model])

  const handleStopStreaming = useCallback(() => {
    streamIdRef.current += 1
    setMessages((prev) => prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)))
    setIsTyping(false)
  }, [])

  const handleCopy = useCallback((text: string) => {
    void navigator.clipboard?.writeText(text)
  }, [])

  const isStreaming = isTyping || messages.some((m) => m.streaming)

  return (
    <div className="mx-auto flex h-175 max-w-7xl overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* Conversations sidebar */}
      <ChatConversations
        items={CONVERSATIONS}
        activeKey={activeConv}
        onChange={(key) => setActiveConv(key)}
        onNewChat={() => setActiveConv("new")}
        className="w-72 shrink-0 border-r"
      />

      {/* Chat area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
                <Bot className="size-3.5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold">AI 编码助手</h3>
              <p className="text-xs text-muted-foreground">基于大语言模型 · 随时为你解答</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModelSelector value={model} onChange={setModel} />
            <Button variant="ghost" size="icon" className="size-8" aria-label="搜索消息" onClick={() => setSearchOpen((o) => !o)}>
              <Search className="size-4" />
            </Button>
            <Badge variant="outline" className="gap-1">
              <span className="size-1.5 rounded-full bg-green-500" />
              在线
            </Badge>
          </div>
        </div>

        {/* Message search bar */}
        {searchOpen && (
          <div className="flex items-center gap-2 border-b px-5 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索聊天记录…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {searchQuery && (
              <span className="text-xs text-muted-foreground">
                {filteredMessages.filter((m) => m.role !== "system").length} 条结果
              </span>
            )}
            <Button variant="ghost" size="icon" className="size-6" aria-label="关闭搜索" onClick={() => { setSearchOpen(false); setSearchQuery("") }}>
              <X className="size-3" />
            </Button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-4 px-5 py-4">
            {filteredMessages.map((m) => {
              const props: BubbleProps = {
                role: m.role,
                content: m.content,
                timestamp: m.timestamp,
                status: m.status,
                thinking: m.thinking,
                streaming: m.streaming,
                header: m.model && m.role === "assistant" ? (
                  <span className="text-[10px] text-muted-foreground">模型: {m.model}</span>
                ) : undefined,
              }
              return <Bubble key={m.id} {...props} onCopy={() => handleCopy(m.content)} onRegenerate={m.role === "assistant" ? () => handleRegenerate(m.id) : undefined} onEdit={m.role === "user" ? (c: string) => handleEdit(m.id, c) : undefined} />
            })}
            {isTyping && (
              <div className="flex items-start gap-2.5">
                <Avatar className="mt-0.5 size-8 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
                    <Bot className="size-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-bl-md bg-muted">
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sender */}
        <div className="px-5 pb-4 pt-2">
          <ChatSender
            value={draft}
            onChange={setDraft}
            placeholder="输入消息… (Enter 发送, Shift+Enter 换行)"
            loading={isStreaming}
            onSubmit={handleSend}
            onCancel={handleStopStreaming}
            suggestions={QUICK_REPLIES}
            onSuggestionClick={(s) => setDraft(s)}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
            mentions={MENTION_ITEMS}
            prefix={<AttachmentDialog />}
            onAttach={handleAddAttachment}
            footerText="AI 回复仅供参考，请以实际为准"
          />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Welcome variant                                                    */
/* ------------------------------------------------------------------ */

function ChatWelcomePage() {
  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const handleSend = useCallback(
    (text: string) => {
      const content = text.trim()
      if (!content) return

      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: "user", content, timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }), status: "sent" },
      ])
      setDraft("")

      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: `好的，关于「${content}」，我来帮你处理。\n\n这是一条模拟的 AI 回复，在实际应用中会对接大语言模型。`, timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) },
        ])
      }, 1500)
    },
    [],
  )

  const handleCopy = useCallback((text: string) => {
    void navigator.clipboard?.writeText(text)
  }, [])

  const showWelcome = messages.length === 0

  return (
    <div className="mx-auto flex h-175 max-w-3xl flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-5 py-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
            <Sparkles className="size-3.5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-semibold">新对话</h3>
          <p className="text-xs text-muted-foreground">请描述你需要的帮助</p>
        </div>
      </div>

      {/* Body */}
      {showWelcome ? (
        <WelcomeScreen onPrompt={handleSend} />
      ) : (
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-4 px-5 py-4">
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} content={m.content} timestamp={m.timestamp} status={m.status} onCopy={() => handleCopy(m.content)} />
            ))}
            {isTyping && (
              <div className="flex items-start gap-2.5">
                <Avatar className="mt-0.5 size-8 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
                    <Bot className="size-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-bl-md bg-muted">
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sender */}
      <div className="px-5 pb-4 pt-2">
        <ChatSender
          value={draft}
          onChange={setDraft}
          placeholder="输入消息… (Enter 发送)"
          onSubmit={handleSend}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: () => <ChatPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Verify conversations sidebar
    await expect(canvas.getByText("会话列表")).toBeInTheDocument()
    await expect(canvas.getByRole("heading", { name: "AI 编码助手" })).toBeInTheDocument()
    await expect(canvas.getByText("翻译助手")).toBeInTheDocument()

    // Verify model selector
    await expect(canvas.getByLabelText("选择模型")).toBeInTheDocument()

    // Verify messages rendered
    await expect(canvas.getByText(/useDebounceSearch/)).toBeInTheDocument()
    await expect(canvas.getByText("帮我写一个 React 自定义 Hook，用来做防抖搜索。")).toBeInTheDocument()

    // Type and send
    const textarea = canvas.getByPlaceholderText("输入消息… (Enter 发送, Shift+Enter 换行)")
    await userEvent.type(textarea, "谢谢，非常有用！")
    await expect(textarea).toHaveValue("谢谢，非常有用！")

    // Click send
    const sendBtn = canvas.getByRole("button", { name: "发送" })
    await userEvent.click(sendBtn)
    await expect(canvas.getByText("谢谢，非常有用！")).toBeInTheDocument()
  },
}

export const Welcome: Story = {
  render: () => <ChatWelcomePage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Welcome screen visible
    await expect(canvas.getByText("你好，有什么可以帮你的？")).toBeInTheDocument()
    await expect(canvas.getByText("帮我写一个组件")).toBeInTheDocument()
    await expect(canvas.getByText("生成单元测试")).toBeInTheDocument()

    // Click a prompt suggestion
    await userEvent.click(canvas.getByText("帮我写一个组件"))
    await expect(canvas.getByText("帮我写一个组件")).toBeInTheDocument()
  },
}
