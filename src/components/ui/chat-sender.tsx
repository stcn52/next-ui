import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Image as ImageIcon, Paperclip, Send, Square, X } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Attachment {
  id: string
  name: string
  type: "image" | "file"
  size?: string
  /** Preview URL for images */
  previewUrl?: string
}

interface MentionItem {
  key: string
  label: string
  description?: string
}

interface ChatSenderProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  /** Current input value (controlled) */
  value?: string
  /** Default input value (uncontrolled) */
  defaultValue?: string
  /** Placeholder text */
  placeholder?: string
  /** Whether in loading/streaming state */
  loading?: boolean
  /** Disable the sender */
  disabled?: boolean
  /** Show attachment button */
  allowAttachment?: boolean
  /** Quick reply suggestions shown above the input */
  suggestions?: string[]
  /** Current attachments */
  attachments?: Attachment[]
  /** Available @mention items */
  mentions?: MentionItem[]
  /** Callback when message is submitted */
  onSubmit?: (message: string, attachments?: Attachment[]) => void
  /** Callback when value changes */
  onChange?: (value: string) => void
  /** Callback when Stop is clicked during loading */
  onCancel?: () => void
  /** Callback when a suggestion chip is clicked */
  onSuggestionClick?: (suggestion: string) => void
  /** Callback when attachment button is clicked */
  onAttach?: () => void
  /** Callback when an attachment is removed */
  onRemoveAttachment?: (id: string) => void
  /** Callback when a mention is selected */
  onMentionSelect?: (item: MentionItem) => void
  /** Custom prefix content (left of textarea) */
  prefix?: React.ReactNode
  /** Custom suffix content (right of textarea) */
  suffix?: React.ReactNode
  /** Footer text below the sender */
  footerText?: string
}

/* ------------------------------------------------------------------ */
/*  ChatSender                                                         */
/* ------------------------------------------------------------------ */

function ChatSender({
  value: controlledValue,
  defaultValue = "",
  placeholder = "输入消息…",
  loading = false,
  disabled = false,
  allowAttachment = true,
  suggestions,
  attachments,
  mentions,
  onSubmit,
  onChange,
  onCancel,
  onSuggestionClick,
  onAttach,
  onRemoveAttachment,
  onMentionSelect,
  prefix,
  suffix,
  footerText,
  className,
  ...props
}: ChatSenderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [showMentions, setShowMentions] = React.useState(false)
  const [mentionQuery, setMentionQuery] = React.useState("")
  const isControlled = controlledValue !== undefined
  const draft = isControlled ? controlledValue : internalValue

  const updateValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v)
      onChange?.(v)

      // Check for @mention trigger
      if (mentions && mentions.length > 0) {
        const lastAt = v.lastIndexOf("@")
        if (lastAt >= 0 && !v.slice(lastAt).includes(" ")) {
          setMentionQuery(v.slice(lastAt + 1).toLowerCase())
          setShowMentions(true)
        } else {
          setShowMentions(false)
        }
      }
    },
    [isControlled, onChange, mentions],
  )

  const handleSubmit = React.useCallback(() => {
    const text = draft.trim()
    if (!text || loading || disabled) return
    onSubmit?.(text, attachments)
    if (!isControlled) setInternalValue("")
    setShowMentions(false)
  }, [draft, loading, disabled, onSubmit, isControlled, attachments])

  const handleMentionClick = React.useCallback(
    (item: MentionItem) => {
      const lastAt = draft.lastIndexOf("@")
      if (lastAt >= 0) {
        const newValue = draft.slice(0, lastAt) + `@${item.label} `
        if (!isControlled) setInternalValue(newValue)
        onChange?.(newValue)
      }
      setShowMentions(false)
      onMentionSelect?.(item)
    },
    [draft, isControlled, onChange, onMentionSelect],
  )

  const filteredMentions = React.useMemo(() => {
    if (!mentions) return []
    if (!mentionQuery) return mentions
    return mentions.filter(
      (m) => m.label.toLowerCase().includes(mentionQuery) || m.description?.toLowerCase().includes(mentionQuery),
    )
  }, [mentions, mentionQuery])

  return (
    <div data-slot="chat-sender" className={cn("flex flex-col gap-1", className)} {...props}>
      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-1">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick?.(s)}
              className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Stop button when loading */}
      {loading && onCancel && (
        <div className="flex justify-center pb-1">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onCancel}>
            <Square className="size-3" />
            停止生成
          </Button>
        </div>
      )}

      {/* Attachment previews */}
      {attachments && attachments.length > 0 && (
        <div data-slot="attachment-preview" className="flex flex-wrap gap-2 pb-1">
          {attachments.map((a) => (
            <div
              key={a.id}
              className="group/att relative flex items-center gap-2 rounded-lg border bg-muted/50 px-2.5 py-1.5"
            >
              {a.type === "image" ? (
                a.previewUrl ? (
                  <img src={a.previewUrl} alt={a.name} className="size-8 rounded object-cover" />
                ) : (
                  <ImageIcon className="size-4 text-blue-500" />
                )
              ) : (
                <FileText className="size-4 text-green-500" />
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{a.name}</p>
                {a.size && <p className="text-[10px] text-muted-foreground">{a.size}</p>}
              </div>
              {onRemoveAttachment && (
                <button
                  onClick={() => onRemoveAttachment(a.id)}
                  className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover/att:opacity-100"
                  aria-label={`移除 ${a.name}`}
                >
                  <X className="size-2.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* @Mention dropdown */}
      {showMentions && filteredMentions.length > 0 && (
        <div data-slot="mention-list" className="rounded-lg border bg-popover p-1 shadow-md">
          {filteredMentions.map((m) => (
            <button
              key={m.key}
              onClick={() => handleMentionClick(m)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
            >
              <span className="font-medium">@{m.label}</span>
              {m.description && <span className="text-xs text-muted-foreground">{m.description}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <Card className="overflow-hidden">
        <CardContent className="flex items-end gap-2 p-2">
          {prefix}
          {allowAttachment && !prefix && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="添加附件"
              disabled={disabled}
              onClick={onAttach}
            >
              <Paperclip className="size-4" />
            </Button>
          )}
          <Textarea
            placeholder={placeholder}
            value={draft}
            onChange={(e) => updateValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            disabled={disabled}
            className="min-h-10 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            rows={1}
          />
          {suffix ?? (
            <Button
              size="icon"
              className="size-8 shrink-0"
              disabled={!draft.trim() || disabled}
              onClick={handleSubmit}
              aria-label="发送"
            >
              <Send className="size-4" />
            </Button>
          )}
        </CardContent>
      </Card>

      {footerText && (
        <p className="text-center text-[10px] text-muted-foreground">{footerText}</p>
      )}
    </div>
  )
}

export { ChatSender }
export type { Attachment, ChatSenderProps, MentionItem }
