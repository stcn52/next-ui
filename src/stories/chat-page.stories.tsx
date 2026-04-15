import { useCallback, useRef, useState, useEffect } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Bot,
  BrainCircuit,
  Check,
  ChevronDown,
  Copy,
  MessageSquarePlus,
  Paperclip,
  Pencil,
  RefreshCcw,
  Search,
  Send,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  User,
  X,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type MessageRole = "user" | "assistant" | "system"
type MessageStatus = "sending" | "sent" | "error"

interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  status?: MessageStatus
  /** ThoughtChain thinking steps shown before AI answer */
  thinking?: string[]
  /** Whether this message is currently streaming */
  streaming?: boolean
}

interface Conversation {
  id: string
  title: string
  lastMessage: string
  updatedAt: string
  unread?: number
  group: string
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CONVERSATIONS: Conversation[] = [
  { id: "1", title: "AI 编码助手", lastMessage: "已为你生成代码片段…", updatedAt: "10:30", unread: 2, group: "今天" },
  { id: "2", title: "翻译助手", lastMessage: "翻译已完成", updatedAt: "09:15", group: "今天" },
  { id: "3", title: "PPT 大纲生成", lastMessage: "大纲内容如下…", updatedAt: "昨天", group: "昨天" },
  { id: "4", title: "数据分析报告", lastMessage: "报告已生成，请查收。", updatedAt: "昨天", group: "昨天" },
  { id: "5", title: "学习计划", lastMessage: "推荐以下学习路径…", updatedAt: "3天前", group: "更早" },
]

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "sys-1", role: "system", content: "今天", timestamp: "" },
  {
    id: "m1",
    role: "assistant",
    content: "你好！我是 AI 编码助手 🤖\n\n我可以帮你完成以下任务：\n- 编写和优化代码\n- 解释错误信息\n- 代码审查与重构建议\n- 生成单元测试\n\n请问有什么可以帮你的？",
    timestamp: "10:00",
  },
  { id: "m2", role: "user", content: "帮我写一个 React 自定义 Hook，用来做防抖搜索。", timestamp: "10:05", status: "sent" },
  {
    id: "m3",
    role: "assistant",
    content: "好的，这是一个 `useDebounceSearch` Hook 的实现：\n\n```typescript\nfunction useDebounceSearch(delay = 300) {\n  const [query, setQuery] = useState('')\n  const [debouncedQuery, setDebouncedQuery] = useState('')\n\n  useEffect(() => {\n    const timer = setTimeout(() => {\n      setDebouncedQuery(query)\n    }, delay)\n    return () => clearTimeout(timer)\n  }, [query, delay])\n\n  return { query, setQuery, debouncedQuery }\n}\n```\n\n**主要特点：**\n1. 输入变化后延迟 300ms 才触发实际搜索\n2. 每次输入都会重置计时器，避免频繁请求\n3. 组件卸载时自动清理 timer",
    timestamp: "10:05",
    thinking: ["分析用户需求：React 防抖搜索 Hook", "选择 useState + useEffect 实现方案", "添加清理函数防止内存泄漏"],
  },
  { id: "m4", role: "user", content: "能加上 loading 状态和取消请求的功能吗？", timestamp: "10:28", status: "sent" },
  {
    id: "m5",
    role: "assistant",
    content: "当然可以！这里是增强版本，加入了 `loading` 状态和 `AbortController` 取消请求：\n\n```typescript\nfunction useDebounceSearch<T>(fetcher: (q: string, signal: AbortSignal) => Promise<T>, delay = 300) {\n  const [query, setQuery] = useState('')\n  const [data, setData] = useState<T | null>(null)\n  const [loading, setLoading] = useState(false)\n  const abortRef = useRef<AbortController>()\n\n  useEffect(() => {\n    if (!query) { setData(null); return }\n    const timer = setTimeout(async () => {\n      abortRef.current?.abort()\n      const ctrl = new AbortController()\n      abortRef.current = ctrl\n      setLoading(true)\n      try {\n        const res = await fetcher(query, ctrl.signal)\n        if (!ctrl.signal.aborted) setData(res)\n      } finally {\n        if (!ctrl.signal.aborted) setLoading(false)\n      }\n    }, delay)\n    return () => clearTimeout(timer)\n  }, [query, delay, fetcher])\n\n  return { query, setQuery, data, loading }\n}\n```\n\n**改进点：**\n- 🔄 `loading` 状态跟踪请求进度\n- ❌ 新请求发起前自动取消上一个未完成的请求\n- 🛡️ 使用 `AbortSignal` 防止竞态条件",
    timestamp: "10:30",
    thinking: ["评估需求：loading 状态 + 取消请求", "引入 AbortController 管理请求生命周期", "处理竞态条件：确保旧请求不覆盖新结果", "添加泛型支持以提升复用性"],
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

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Renders a code block with language label and copy button */
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    void navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="my-2 overflow-hidden rounded-lg border bg-zinc-950 text-zinc-50 dark:border-zinc-700">
      <div className="flex items-center justify-between bg-zinc-800 px-3 py-1.5">
        <span className="text-[10px] font-medium text-zinc-400 uppercase">{language}</span>
        <Button variant="ghost" size="icon" className="size-6 text-zinc-400 hover:text-zinc-200" onClick={handleCopy}>
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed"><code>{code}</code></pre>
    </div>
  )
}

/** Parse content into text segments and code blocks */
function RichContent({ content }: { content: string }) {
  const parts = content.split(/(```\w*\n[\s\S]*?```)/g)
  return (
    <>
      {parts.map((part, i) => {
        const codeMatch = part.match(/^```(\w*)\n([\s\S]*?)```$/)
        if (codeMatch) {
          return <CodeBlock key={i} language={codeMatch[1] || "text"} code={codeMatch[2].trimEnd()} />
        }
        if (!part) return null
        return <span key={i} className="whitespace-pre-wrap">{part}</span>
      })}
    </>
  )
}

/** Streaming text that renders char by char */
function StreamingText({ content, onComplete }: { content: string; onComplete: () => void }) {
  const [displayed, setDisplayed] = useState(content)

  useEffect(() => {
    let charIndex = 0
    const interval = setInterval(() => {
      charIndex += 2
      if (charIndex >= content.length) {
        setDisplayed(content)
        clearInterval(interval)
        onComplete()
      } else {
        setDisplayed(content.slice(0, charIndex))
      }
    }, 15)
    return () => clearInterval(interval)
  }, [content, onComplete])

  return <RichContent content={displayed} />
}

/** ThoughtChain — collapsible thinking process */
function ThoughtChain({ steps }: { steps: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-1">
      <CollapsibleTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted">
          <BrainCircuit className="size-3.5 text-violet-500" />
          <span>思考过程 ({steps.length} 步)</span>
          <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-2 mt-1 border-l-2 border-violet-500/30 pl-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-1.5 py-0.5">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-[9px] font-medium text-violet-600">
                {i + 1}
              </span>
              <span className="text-xs text-muted-foreground">{step}</span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      <div className="flex gap-1">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-muted-foreground">AI 正在思考…</span>
    </div>
  )
}

function MessageBubble({
  message,
  onCopy,
  onRegenerate,
  onEdit,
}: {
  message: ChatMessage
  onCopy: (text: string) => void
  onRegenerate?: (id: string) => void
  onEdit?: (id: string, newContent: string) => void
}) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"
  const [liked, setLiked] = useState<"up" | "down" | null>(null)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(message.content)

  if (isSystem) {
    return (
      <div className="flex items-center gap-3 py-2">
        <Separator className="flex-1" />
        <span className="shrink-0 text-xs text-muted-foreground">{message.content}</span>
        <Separator className="flex-1" />
      </div>
    )
  }

  const handleEditSubmit = () => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== message.content) {
      onEdit?.(message.id, trimmed)
    }
    setEditing(false)
  }

  return (
    <div className={`group flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <Avatar className="mt-0.5 size-8 shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              <User className="size-3.5" />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
            <Bot className="size-3.5" />
          </AvatarFallback>
        )}
      </Avatar>

      {/* Content */}
      <div className={`flex max-w-[75%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        {/* ThoughtChain */}
        {!isUser && message.thinking && message.thinking.length > 0 && (
          <ThoughtChain steps={message.thinking} />
        )}

        {/* Bubble */}
        {editing ? (
          <div className="flex w-full flex-col gap-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="min-h-20 text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEditSubmit}>保存并重发</Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditText(message.content) }}>
                <X className="mr-1 size-3" /> 取消
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              isUser
                ? "rounded-br-md bg-primary text-primary-foreground"
                : "rounded-bl-md bg-muted"
            }`}
          >
            {message.streaming ? (
              <StreamingText content={message.content} onComplete={() => {}} />
            ) : (
              <RichContent content={message.content} />
            )}
            {message.streaming && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-text-bottom" />
            )}
          </div>
        )}

        {/* Footer: timestamp + actions */}
        {!editing && (
          <div className={`flex items-center gap-1.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <span className="text-[10px] text-muted-foreground/60">{message.timestamp}</span>
            {message.status === "sent" && isUser && (
              <Check className="size-3 text-muted-foreground/60" />
            )}

            {/* Actions (visible on hover) */}
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-6" onClick={() => onCopy(message.content)}>
                      <Copy className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>复制</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {isUser && onEdit && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6" onClick={() => setEditing(true)}>
                        <Pencil className="size-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>编辑</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {!isUser && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`size-6 ${liked === "up" ? "text-green-500" : ""}`}
                        onClick={() => setLiked(liked === "up" ? null : "up")}
                      >
                        <ThumbsUp className="size-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>有帮助</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`size-6 ${liked === "down" ? "text-red-500" : ""}`}
                        onClick={() => setLiked(liked === "down" ? null : "down")}
                      >
                        <ThumbsDown className="size-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>无帮助</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {!isUser && onRegenerate && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6" onClick={() => onRegenerate(message.id)}>
                        <RefreshCcw className="size-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>重新生成</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function WelcomeScreen({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
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

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Pages/Chat",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
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

  const simulateAIReply = useCallback((userText: string) => {
    setIsTyping(true)
    const thinkSteps = [
      `分析用户输入："${userText.slice(0, 20)}…"`,
      "检索相关上下文和知识库",
      "生成回复内容",
    ]
    const replyContent = `收到你的消息："${userText}"\n\n这是一条模拟的 AI 回复。在实际应用中，这里会接入大语言模型 API 来返回智能回答。`

    // Phase 1: thinking (800ms), Phase 2: streaming
    setTimeout(() => {
      setIsTyping(false)
      const id = `a-${Date.now()}`
      streamIdRef.current += 1
      const currentStream = streamIdRef.current
      const aiMsg: ChatMessage = {
        id,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        thinking: thinkSteps,
        streaming: true,
      }
      setMessages((prev) => [...prev, aiMsg])

      // Simulate streaming by gradually updating content
      let charIndex = 0
      const streamInterval = setInterval(() => {
        if (currentStream !== streamIdRef.current) {
          clearInterval(streamInterval)
          return
        }
        charIndex += 3
        if (charIndex >= replyContent.length) {
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, content: replyContent, streaming: false } : m)),
          )
          clearInterval(streamInterval)
        } else {
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, content: replyContent.slice(0, charIndex) } : m)),
          )
        }
      }, 20)
    }, 800)
  }, [])

  const handleSend = useCallback(() => {
    const text = draft.trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }
    setMessages((prev) => [...prev, userMsg])
    setDraft("")
    simulateAIReply(text)
  }, [draft, simulateAIReply])

  const handleRegenerate = useCallback((msgId: string) => {
    setMessages((prev) => {
      // Find the AI message and remove it, find the preceding user message
      const idx = prev.findIndex((m) => m.id === msgId)
      if (idx < 0) return prev
      const userMsg = [...prev].slice(0, idx).reverse().find((m) => m.role === "user")
      const updated = prev.filter((m) => m.id !== msgId)
      if (userMsg) {
        setTimeout(() => simulateAIReply(userMsg.content), 0)
      }
      return updated
    })
  }, [simulateAIReply])

  const handleEdit = useCallback((msgId: string, newContent: string) => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === msgId)
      if (idx < 0) return prev
      // Update user message, remove all messages after it
      const updated = prev.slice(0, idx + 1).map((m) => (m.id === msgId ? { ...m, content: newContent } : m))
      setTimeout(() => simulateAIReply(newContent), 0)
      return updated
    })
  }, [simulateAIReply])

  const handleStopStreaming = useCallback(() => {
    streamIdRef.current += 1
    setMessages((prev) =>
      prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)),
    )
    setIsTyping(false)
  }, [])

  const handleCopy = useCallback((text: string) => {
    void navigator.clipboard?.writeText(text)
  }, [])

  const handleQuickReply = useCallback((text: string) => {
    setDraft(text)
  }, [])

  const grouped = CONVERSATIONS.reduce<Record<string, Conversation[]>>((acc, c) => {
    ;(acc[c.group] ??= []).push(c)
    return acc
  }, {})

  const filteredGroups = Object.entries(grouped).reduce<Record<string, Conversation[]>>((acc, [group, items]) => {
    const filtered = items.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    if (filtered.length) acc[group] = filtered
    return acc
  }, {})

  return (
    <div className="mx-auto flex h-175 max-w-7xl overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* ---- Conversations sidebar ---- */}
      <div className="flex w-72 shrink-0 flex-col border-r">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">会话列表</h2>
          <Button variant="ghost" size="icon" className="size-8" aria-label="新建会话">
            <MessageSquarePlus className="size-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-2.5 py-1.5">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="搜索会话…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 px-2 py-1">
            {Object.entries(filteredGroups).map(([group, items]) => (
              <div key={group}>
                <p className="px-2 pt-3 pb-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  {group}
                </p>
                {items.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConv(c.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                      activeConv === c.id ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-xs">
                        <Bot className="size-3.5 text-violet-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-medium">{c.title}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{c.updatedAt}</span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                    </div>
                    {c.unread && (
                      <Badge className="size-5 shrink-0 justify-center rounded-full px-0 text-[10px]">
                        {c.unread}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* ---- Chat area ---- */}
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
          <Badge variant="outline" className="gap-1">
            <span className="size-1.5 rounded-full bg-green-500" />
            在线
          </Badge>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="flex flex-col gap-4 px-5 py-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} onCopy={handleCopy} onRegenerate={handleRegenerate} onEdit={handleEdit} />
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
        </ScrollArea>

        {/* Stop streaming button */}
        {(isTyping || messages.some((m) => m.streaming)) && (
          <div className="flex justify-center pb-1">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleStopStreaming}>
              <Square className="size-3" />
              停止生成
            </Button>
          </div>
        )}

        {/* Quick replies */}
        <div className="flex gap-2 border-t px-5 pt-3">
          {QUICK_REPLIES.map((r) => (
            <button
              key={r}
              onClick={() => handleQuickReply(r)}
              className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {r}
            </button>
          ))}
        </div>

        {/* Sender */}
        <div className="px-5 pb-4 pt-2">
          <Card className="overflow-hidden">
            <CardContent className="flex items-end gap-2 p-2">
              <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-label="添加附件">
                <Paperclip className="size-4" />
              </Button>
              <Textarea
                placeholder="输入消息… (Enter 发送, Shift+Enter 换行)"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="min-h-10 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                rows={1}
              />
              <Button
                size="icon"
                className="size-8 shrink-0"
                disabled={!draft.trim()}
                onClick={handleSend}
                aria-label="发送"
              >
                <Send className="size-4" />
              </Button>
            </CardContent>
          </Card>
          <p className="mt-1 text-center text-[10px] text-muted-foreground">
            AI 回复仅供参考，请以实际为准
          </p>
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
    (text?: string) => {
      const content = (text ?? draft).trim()
      if (!content) return

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      }
      setMessages((prev) => [...prev, userMsg])
      setDraft("")

      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: `好的，关于「${content}」，我来帮你处理。\n\n这是一条模拟的 AI 回复，在实际应用中会对接大语言模型。`,
            timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      }, 1500)
    },
    [draft],
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
        <WelcomeScreen onPrompt={(text) => handleSend(text)} />
      ) : (
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="flex flex-col gap-4 px-5 py-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} onCopy={handleCopy} />
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
        </ScrollArea>
      )}

      {/* Sender */}
      <div className="px-5 pb-4 pt-2">
        <Card className="overflow-hidden">
          <CardContent className="flex items-end gap-2 p-2">
            <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-label="添加附件">
              <Paperclip className="size-4" />
            </Button>
            <Textarea
              placeholder="输入消息… (Enter 发送)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="min-h-10 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              rows={1}
            />
            <Button
              size="icon"
              className="size-8 shrink-0"
              disabled={!draft.trim()}
              onClick={() => handleSend()}
              aria-label="发送"
            >
              <Send className="size-4" />
            </Button>
          </CardContent>
        </Card>
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
    await expect(canvas.getByText("AI 编码助手")).toBeInTheDocument()
    await expect(canvas.getByText("翻译助手")).toBeInTheDocument()

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
    // Welcome should disappear, message should appear
    await expect(canvas.getByText("帮我写一个组件")).toBeInTheDocument()
  },
}
