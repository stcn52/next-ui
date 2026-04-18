import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/display/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/overlays/tooltip"
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
import { Textarea } from "@/components/ui/inputs/textarea"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type BubbleRole = "user" | "assistant" | "system"
type BubbleStatus = "sending" | "sent" | "error"
type BubbleVariant = "filled" | "outlined" | "shadow" | "borderless"
type BubbleShape = "default" | "round" | "corner"
type BubblePlacement = "start" | "end"
type BubbleDensity = "default" | "compact"

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
  /** Bubble density */
  density?: BubbleDensity
  /** Bubble position (start = left, end = right) */
  placement?: BubblePlacement
  /** Avatar element override */
  avatar?: React.ReactNode
  /** Custom header above the bubble */
  header?: React.ReactNode
  /** Compact metadata rendered inside the meta row */
  metaLabel?: React.ReactNode
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
  /** Shared density for the list and child bubbles */
  density?: BubbleDensity
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

function ThoughtChain({ steps, density = "default" }: { steps: string[]; density?: BubbleDensity }) {
  const [open, setOpen] = React.useState(false)
  const densityStyles = density === "compact"
    ? {
        trigger: "gap-1 px-1.5 py-0.5 text-[11px]",
        icon: "size-3",
        count: "text-[11px]",
        container: "ml-1.5 mt-1 pl-2.5",
        row: "gap-1 py-0.5",
        marker: "size-3.5 text-[8px]",
        text: "text-[11px]",
      }
    : {
        trigger: "gap-1.5 px-2 py-1 text-xs",
        icon: "size-3.5",
        count: "text-xs",
        container: "ml-2 mt-1 pl-3",
        row: "gap-1.5 py-0.5",
        marker: "size-4 text-[9px]",
        text: "text-xs",
      }
  return (
    <Collapsible open={open} onOpenChange={setOpen} data-slot="thought-chain" className="mb-1">
      <CollapsibleTrigger className={cn("flex items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted", densityStyles.trigger)}>
        <BrainCircuit className={cn("text-violet-500", densityStyles.icon)} />
        <span className={densityStyles.count}>思考过程 ({steps.length} 步)</span>
        <ChevronDown className={cn("transition-transform", densityStyles.icon, open ? "rotate-180" : "")} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className={cn("border-l-2 border-violet-500/30", densityStyles.container)}>
          {steps.map((step, i) => (
            <div key={i} className={cn("flex items-start", densityStyles.row)}>
              <span className={cn("mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-violet-500/10 font-medium text-violet-600", densityStyles.marker)}>
                {i + 1}
              </span>
              <span className={cn("text-muted-foreground", densityStyles.text)}>{step}</span>
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

function TypingIndicator({
  text = "AI 正在思考…",
  density = "default",
}: {
  text?: string
  density?: BubbleDensity
}) {
  const densityStyles = density === "compact"
    ? {
        wrap: "gap-1 px-2.5 py-1.5",
        dots: "gap-0.5",
        dot: "size-1",
        text: "text-[11px]",
      }
    : {
        wrap: "gap-1.5 px-3 py-2",
        dots: "gap-1",
        dot: "size-1.5",
        text: "text-xs",
      }
  return (
    <div
      data-slot="typing-indicator"
      data-density={density}
      className={cn("flex items-center", densityStyles.wrap)}
    >
      <div className={cn("flex", densityStyles.dots)}>
        <span className={cn("animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]", densityStyles.dot)} />
        <span className={cn("animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]", densityStyles.dot)} />
        <span className={cn("animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]", densityStyles.dot)} />
      </div>
      <span className={cn("text-muted-foreground", densityStyles.text)}>{text}</span>
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
    user: "bg-primary text-primary-foreground shadow-sm",
    assistant: "bg-background shadow-sm",
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
  density = "default",
  avatar,
  header,
  metaLabel,
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
  const hasActions = !!(onCopy || (isUser && onEdit) || (!isUser && onFeedback) || (!isUser && onRegenerate))
  const densityStyles = density === "compact"
    ? {
        row: "gap-1.5",
        avatar: "size-7",
        avatarFallback: "text-[10px]",
        avatarIcon: "size-3",
        contentWrap: isUser ? "max-w-[72%] items-end" : "max-w-[82%] items-start",
        bubble: "px-2.5 py-1 text-xs leading-5",
        editor: "min-h-14 text-xs",
        meta: "gap-0.5",
        time: "text-[9px]",
        status: "size-2.5",
        metaLabel: "max-w-[11rem] text-[9px]",
        actionRow: "gap-0.5",
        actionButton: "size-5",
        actionIcon: "size-2.5",
        system: "gap-1.5 py-1.5",
        systemText: "text-[11px]",
      }
    : {
        row: "gap-2",
        avatar: "size-8",
        avatarFallback: "text-xs",
        avatarIcon: "size-3.5",
        contentWrap: isUser ? "max-w-[75%] items-end" : "max-w-[85%] items-start",
        bubble: "px-3 py-1.5 text-sm leading-relaxed",
        editor: "min-h-16 text-sm",
        meta: "gap-1",
        time: "text-[10px]",
        status: "size-3",
        metaLabel: "max-w-[12rem] text-[10px]",
        actionRow: "gap-0.5",
        actionButton: "size-6",
        actionIcon: "size-3",
        system: "gap-2 py-2",
        systemText: "text-xs",
      }

  if (isSystem) {
    return (
      <div data-slot="chat-bubble" data-role="system" className={cn("flex items-center", densityStyles.system, className)}>
        <Separator className="flex-1" />
        <span className={cn("shrink-0 text-muted-foreground", densityStyles.systemText)}>{content}</span>
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
    <Avatar className={cn("mt-0.5 shrink-0", densityStyles.avatar)}>
      <AvatarFallback className={cn("bg-primary text-primary-foreground", densityStyles.avatarFallback)}>
        <User className={densityStyles.avatarIcon} />
      </AvatarFallback>
    </Avatar>
  ) : (
    <Avatar className={cn("mt-0.5 shrink-0", densityStyles.avatar)}>
      <AvatarFallback className={cn("bg-gradient-to-br from-violet-500 to-blue-500 text-white", densityStyles.avatarFallback)}>
        <Bot className={densityStyles.avatarIcon} />
      </AvatarFallback>
    </Avatar>
  )

  const variantCls = VARIANT_CLASSES[variant][isUser ? "user" : "assistant"]
  const shapeCls = SHAPE_CLASSES[shape][isUser ? "user" : "assistant"]

  return (
    <div
      data-slot="chat-bubble"
      data-role={role}
      className={cn("group flex items-start", densityStyles.row, isUser ? "flex-row-reverse" : "flex-row", className)}
    >
      {avatar ?? defaultAvatar}

      <div className={cn("flex flex-col gap-0.5", densityStyles.contentWrap)}>
        {header}

        {!isUser && thinking && thinking.length > 0 && <ThoughtChain steps={thinking} density={density} />}

        {editing ? (
          <div className="flex w-full flex-col gap-2">
            <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} className={densityStyles.editor} autoFocus />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEditSubmit}>保存并重发</Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditText(content) }}>
                <X className="mr-1 size-3" /> 取消
              </Button>
            </div>
          </div>
        ) : (
          <div className={cn(densityStyles.bubble, variantCls, shapeCls)}>
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

        {!editing && (metaLabel || timestamp || (status === "sent" && isUser) || hasActions) && (
          <div className={cn("flex items-center", densityStyles.meta, isUser ? "flex-row-reverse" : "flex-row")}>
            {metaLabel && (
              <span className={cn("truncate text-muted-foreground/70", densityStyles.metaLabel)}>
                {metaLabel}
              </span>
            )}
            {timestamp && <span className={cn("text-muted-foreground/60", densityStyles.time)}>{timestamp}</span>}
            {status === "sent" && isUser && <Check className={cn("text-muted-foreground/60", densityStyles.status)} />}

            <div className={cn("flex items-center opacity-0 transition-opacity group-hover:opacity-100", densityStyles.actionRow)}>
              {onCopy && (
                <Tooltip>
                  <TooltipTrigger
                    className={cn("inline-flex items-center justify-center rounded-md hover:bg-muted", densityStyles.actionButton)}
                    onClick={() => onCopy(content)}
                    aria-label="复制消息"
                  >
                    <Copy className={densityStyles.actionIcon} />
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>复制</p></TooltipContent>
                </Tooltip>
              )}

              {isUser && onEdit && (
                <Tooltip>
                  <TooltipTrigger
                    className={cn("inline-flex items-center justify-center rounded-md hover:bg-muted", densityStyles.actionButton)}
                    onClick={() => setEditing(true)}
                    aria-label="编辑消息"
                  >
                    <Pencil className={densityStyles.actionIcon} />
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>编辑</p></TooltipContent>
                </Tooltip>
              )}

              {!isUser && onFeedback && (
                <>
                  <Tooltip>
                    <TooltipTrigger
                      className={cn("inline-flex items-center justify-center rounded-md hover:bg-muted", densityStyles.actionButton, liked === "up" && "text-green-500")}
                      onClick={() => handleFeedback("up")}
                      aria-label="点赞"
                    >
                      <ThumbsUp className={densityStyles.actionIcon} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>有帮助</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      className={cn("inline-flex items-center justify-center rounded-md hover:bg-muted", densityStyles.actionButton, liked === "down" && "text-red-500")}
                      onClick={() => handleFeedback("down")}
                      aria-label="点踩"
                    >
                      <ThumbsDown className={densityStyles.actionIcon} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom"><p>无帮助</p></TooltipContent>
                  </Tooltip>
                </>
              )}

              {!isUser && onRegenerate && (
                <Tooltip>
                  <TooltipTrigger
                    className={cn("inline-flex items-center justify-center rounded-md hover:bg-muted", densityStyles.actionButton)}
                    onClick={onRegenerate}
                    aria-label="重新生成消息"
                  >
                    <RefreshCcw className={densityStyles.actionIcon} />
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

function BubbleList({ items, autoScroll = true, density = "default", className, ...props }: BubbleListProps) {
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
      className={cn("flex flex-col overflow-y-auto", density === "compact" ? "gap-2" : "gap-3", className)}
      {...props}
    >
      {items.map((item, i) => (
        <Bubble key={i} {...item} density={item.density ?? density} />
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
  BubbleDensity,
  BubbleListProps,
  BubblePlacement,
  BubbleProps,
  BubbleRole,
  BubbleShape,
  BubbleStatus,
  BubbleVariant,
}
