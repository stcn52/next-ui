import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send, Square } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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
  /** Callback when message is submitted */
  onSubmit?: (message: string) => void
  /** Callback when value changes */
  onChange?: (value: string) => void
  /** Callback when Stop is clicked during loading */
  onCancel?: () => void
  /** Callback when a suggestion chip is clicked */
  onSuggestionClick?: (suggestion: string) => void
  /** Callback when attachment button is clicked */
  onAttach?: () => void
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
  onSubmit,
  onChange,
  onCancel,
  onSuggestionClick,
  onAttach,
  prefix,
  suffix,
  footerText,
  className,
  ...props
}: ChatSenderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const draft = isControlled ? controlledValue : internalValue

  const updateValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v)
      onChange?.(v)
    },
    [isControlled, onChange],
  )

  const handleSubmit = React.useCallback(() => {
    const text = draft.trim()
    if (!text || loading || disabled) return
    onSubmit?.(text)
    if (!isControlled) setInternalValue("")
  }, [draft, loading, disabled, onSubmit, isControlled])

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
export type { ChatSenderProps }
