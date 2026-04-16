import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Bot,
  BrainCircuit,
  Check,
  ChevronDown,
  Copy,
  Pencil,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
  User,
  X,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type BubbleRole = "user" | "assistant" | "system"
type BubbleStatus = "sending" | "sent" | "error"
type BubbleVariant = "filled" | "outlined" | "shadow" | "borderless"
type BubbleShape = "default" | "round" | "corner"
type BubblePlacement = "start" | "end"

interface BubbleProps {
  /** Message role */
  role: BubbleRole
  /** Message content (supports markdown code fences) */
  content: string
  /** Timestamp display */
  timestamp?: string
  /** Message status */
  status?: BubbleStatus
  /** ThoughtChain thinking steps */
  thinking?: string[]
  /** Whether content is currently streaming */
  streaming?: boolean
  /** Visual variant */
  variant?: BubbleVariant
  /** Bubble shape */
  shape?: BubbleShape
  /** Bubble position (start = left, end = right) */
  placement?: BubblePlacement
  /** Avatar element override */
  avatar?: React.ReactNode
  /** Custom header above the bubble */
  header?: React.ReactNode
  /** Custom footer below the bubble */
  footer?: React.ReactNode
  /** Callback when copy is clicked */
  onCopy?: (content: string) => void
  /** Callback when thumbs-up/down is clicked */
  onFeedback?: (type: "up" | "down") => void
  /** Callback to regenerate this AI message */
  onRegenerate?: () => void
  /** Callback to edit a user message */
  onEdit?: (newContent: string) => void
  className?: string
}

interface BubbleListProps extends React.ComponentProps<"div"> {
  /** Array of bubble items */
  items: BubbleProps[]
  /** Auto-scroll to bottom on new items */
  autoScroll?: boolean
}

/* ------------------------------------------------------------------ */
/*  CodeBlock                                                          */
/* ------------------------------------------------------------------ */

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = () => {
    void navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div data-slot="chat-code-block" className="my-2 overflow-hidden rounded-lg border bg-zinc-950 text-zinc-50 dark:border-zinc-700">
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

/* ------------------------------------------------------------------ */
/*  RichContent                                                        */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  ThoughtChain                                                       */
/* ------------------------------------------------------------------ */

function ThoughtChain({ steps }: { steps: string[] }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} data-slot="thought-chain" className="mb-1">
      <CollapsibleTrigger className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted">
        <BrainCircuit className="size-3.5 text-violet-500" />
        <span>思考过程 ({steps.length} 步)</span>
        <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
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

/* ------------------------------------------------------------------ */
/*  TypingIndicator                                                    */
/* ------------------------------------------------------------------ */

function TypingIndicator({ text = "AI 正在思考…" }: { text?: string }) {
  return (
    <div data-slot="typing-indicator" className="flex items-center gap-1.5 px-3 py-2">
      <div className="flex gap-1">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-muted-foreground">{text}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  StreamingText                                                      */
/* ------------------------------------------------------------------ */

function StreamingText({ content, onComplete }: { content: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = React.useState(content)

  React.useEffect(() => {
    let charIndex = 0
    const interval = setInterval(() => {
      charIndex += 2
      if (charIndex >= content.length) {
        setDisplayed(content)
        clearInterval(interval)
        onComplete?.()
      } else {
        setDisplayed(content.slice(0, charIndex))
      }
    }, 15)
    return () => clearInterval(interval)
  }, [content, onComplete])

  return <RichContent content={displayed} />
}

/* ------------------------------------------------------------------ */
/*  Bubble                                                             */
/* ------------------------------------------------------------------ */

const VARIANT_CLASSES: Record<BubbleVariant, { user: string; assistant: string }> = {
  filled: {
    user: "bg-primary text-primary-foreground",
    assistant: "bg-muted",
  },
  outlined: {
    user: "border border-primary text-primary",
    assistant: "border bg-background",
  },
  shadow: {
    user: "bg-primary text-primary-foreground shadow-md",
    assistant: "bg-background shadow-md",
  },
  borderless: {
    user: "",
    assistant: "",
  },
}

const SHAPE_CLASSES: Record<BubbleShape, { user: string; assistant: string }> = {
  default: { user: "rounded-2xl rounded-br-md", assistant: "rounded-2xl rounded-bl-md" },
  round: { user: "rounded-full", assistant: "rounded-full" },
  corner: { user: "rounded-2xl rounded-br-none", assistant: "rounded-2xl rounded-bl-none" },
}

function Bubble({
  role,
  content,
  timestamp,
  status,
  thinking,
  streaming,
  variant = "filled",
  shape = "default",
  avatar,
  header,
  footer,
  onCopy,
  onFeedback,
  onRegenerate,
  onEdit,
  className,
}: BubbleProps) {
  const isUser = role === "user"
  const isSystem = role === "system"
  const [liked, setLiked] = React.useState<"up" | "down" | null>(null)
  const [editing, setEditing] = React.useState(false)
  const [editText, setEditText] = React.useState(content)

  if (isSystem) {
    return (
      <div data-slot="chat-bubble" data-role="system" className={cn("flex items-center gap-3 py-2", className)}>
        <Separator className="flex-1" />
        <span className="shrink-0 text-xs text-muted-foreground">{content}</span>
        <Separator className="flex-1" />
      </div>
    )
  }

  const handleEditSubmit = () => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== content) {
      onEdit?.(trimmed)
    }
    setEditing(false)
  }

  const handleFeedback = (type: "up" | "down") => {
    const next = liked === type ? null : type
    setLiked(next)
    if (next) onFeedback?.(next)
  }

  const defaultAvatar = isUser ? (
    <Avatar className="mt-0.5 size-8 shrink-0">
      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
        <User className="size-3.5" />
      </AvatarFallback>
    </Avatar>
  ) : (
    <Avatar className="mt-0.5 size-8 shrink-0">
      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
        <Bot className="size-3.5" />
      </AvatarFallback>
    </Avatar>
  )

  const variantCls = VARIANT_CLASSES[variant][isUser ? "user" : "assistant"]
  const shapeCls = SHAPE_CLASSES[shape][isUser ? "user" : "assistant"]

  return (
    <div
      data-slot="chat-bubble"
      data-role={role}
      className={cn("group flex items-start gap-2.5", isUser ? "flex-row-reverse" : "flex-row", className)}
    >
      {avatar ?? defaultAvatar}

      <div className={cn("flex max-w-[75%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        {header}

        {!isUser && thinking && thinking.length > 0 && <ThoughtChain steps={thinking} />}

        {editing ? (
          <div className="flex w-full flex-col gap-2">
            <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="min-h-20 text-sm" autoFocus />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEditSubmit}>保存并重发</Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditText(content) }}>
                <X className="mr-1 size-3" /> 取消
              </Button>
            </div>
          </div>
        ) : (
          <div className={cn("px-3.5 py-2.5 text-sm leading-relaxed", variantCls, shapeCls)}>
            {streaming ? (
              <>
                <StreamingText content={content} />
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-text-bottom" />
              </>
            ) : (
              <RichContent content={content} />
            )}
          </div>
        )}

        {!editing && (
          <div className={cn("flex items-center gap-1.5", isUser ? "flex-row-reverse" : "flex-row")}>
            {timestamp && <span className="text-[10px] text-muted-foreground/60">{timestamp}</span>}
            {status === "sent" && isUser && <Check className="size-3 text-muted-foreground/60" />}

            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              {onCopy && (
                <Tooltip>
                  <TooltipTrigger
                    className="inline-flex size-6 items-center justify-center rounded-md hover:bg-muted"
                    onClick={() => onCopy(content)}
                  >
                    <Copy className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>复制</p></TooltipContent>
                </Tooltip>
              )}

              {isUser && onEdit && (
                <Tooltip>
                  <TooltipTrigger
                    className="inline-flex size-6 items-center justify-center rounded-md hover:bg-muted"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>编辑</p></TooltipContent>
                </Tooltip>
              )}

              {!isUser && onFeedback && (
                <>
                  <Tooltip>
                    <TooltipTrigger
                      className={cn("inline-flex size-6 items-center justify-center rounded-md hover:bg-muted", liked === "up" && "text-green-500")}
                      onClick={() => handleFeedback("up")}
                    >
                      <ThumbsUp className="size-3" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>有帮助</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      className={cn("inline-flex size-6 items-center justify-center rounded-md hover:bg-muted", liked === "down" && "text-red-500")}
                      onClick={() => handleFeedback("down")}
                    >
                      <ThumbsDown className="size-3" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>无帮助</p></TooltipContent>
                  </Tooltip>
                </>
              )}

              {!isUser && onRegenerate && (
                <Tooltip>
                  <TooltipTrigger
                    className="inline-flex size-6 items-center justify-center rounded-md hover:bg-muted"
                    onClick={onRegenerate}
                  >
                    <RefreshCcw className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>重新生成</p></TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        )}

        {footer}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  BubbleList                                                         */
/* ------------------------------------------------------------------ */

function BubbleList({ items, autoScroll = true, className, ...props }: BubbleListProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (autoScroll) {
      requestAnimationFrame(() => {
        const el = ref.current
        if (el) el.scrollTop = el.scrollHeight
      })
    }
  }, [items, autoScroll])

  return (
    <div
      data-slot="bubble-list"
      ref={ref}
      className={cn("flex flex-col gap-4 overflow-y-auto", className)}
      {...props}
    >
      {items.map((item, i) => (
        <Bubble key={i} {...item} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Exports                                                            */
/* ------------------------------------------------------------------ */

export {
  Bubble,
  BubbleList,
  CodeBlock,
  RichContent,
  StreamingText,
  ThoughtChain,
  TypingIndicator,
}
export type {
  BubbleListProps,
  BubblePlacement,
  BubbleProps,
  BubbleRole,
  BubbleShape,
  BubbleStatus,
  BubbleVariant,
}
