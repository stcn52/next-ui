import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/inputs/textarea"
import { FileText, Image as ImageIcon, Lightbulb, Paperclip, Send, Square, X } from "lucide-react"

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
  /** Upload state */
  status?: "uploading" | "done" | "error"
  /** Upload progress percent */
  progress?: number
  /** Error message when upload fails */
  error?: string
}

interface MentionItem {
  key: string
  label: string
  description?: string
}

type Density = "default" | "compact" | "dense"
type SuggestionsVariant = "inline" | "overlay"
type AttachmentLayout = "scroll" | "wrap"
type AttachmentDisplay = "preview" | "summary"

interface ChatSenderProps
  extends Omit<
    React.ComponentProps<"div">,
    "defaultValue" | "onChange" | "onSubmit" | "prefix"
  > {
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
  /** Layout density for spacing and controls */
  density?: Density
  /** Whether suggestions are rendered inline or in an overlay */
  suggestionsVariant?: SuggestionsVariant
  /** Whether attachments wrap to multiple lines or stay in a scroll row */
  attachmentLayout?: AttachmentLayout
  /** Whether attachments render as previews or compact summary */
  attachmentDisplay?: AttachmentDisplay
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
  /** Callback when files are dropped or selected */
  onAttachFiles?: (files: FileList | File[]) => void
  /** Callback when an attachment is removed */
  onRemoveAttachment?: (id: string) => void
  /** Callback when retry upload is clicked */
  onRetryAttachment?: (id: string) => void
  /** Callback when a mention is selected */
  onMentionSelect?: (item: MentionItem) => void
  /** Show the default attachment trigger even when custom actions are present */
  showDefaultAttachmentButton?: boolean
  /** Additional leading actions next to the input */
  leadingActions?: React.ReactNode
  /** Additional trailing actions before submit/cancel */
  trailingActions?: React.ReactNode
  /** Status/meta actions rendered in the bottom utility row */
  statusActions?: React.ReactNode
  /** Custom attachment summary node */
  attachmentSummary?: React.ReactNode
  /** Custom prefix content (left of textarea) */
  prefix?: React.ReactNode
  /** Custom suffix content (right of textarea) */
  suffix?: React.ReactNode
  /** Footer text below the sender */
  footerText?: string
  /**
   * Maximum number of visible rows before the textarea enters scroll mode.
   * Defaults to 6.
   */
  maxRows?: number
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
  density = "default",
  suggestionsVariant = "overlay",
  attachmentLayout = "scroll",
  attachmentDisplay = "summary",
  onSubmit,
  onChange,
  onCancel,
  onSuggestionClick,
  onAttach,
  onAttachFiles,
  onRemoveAttachment,
  onRetryAttachment,
  onMentionSelect,
  showDefaultAttachmentButton,
  leadingActions,
  trailingActions,
  statusActions,
  attachmentSummary,
  prefix,
  suffix,
  footerText,
  maxRows = 6,
  className,
  ...props
}: ChatSenderProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [isComposing, setIsComposing] = React.useState(false)
  const [showMentions, setShowMentions] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [mentionQuery, setMentionQuery] = React.useState("")
  const [activeMentionIndex, setActiveMentionIndex] = React.useState(0)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const isControlled = controlledValue !== undefined
  const draft = isControlled ? controlledValue : internalValue
  const hasSuggestions = Boolean(suggestions?.length)
  const hasInlineSuggestions = suggestionsVariant === "inline" && hasSuggestions
  const hasOverlaySuggestions = suggestionsVariant === "overlay" && hasSuggestions
  const densityStyles = {
    default: {
      root: "gap-2",
      cardContent: "gap-2 p-2",
      inputRow: "gap-2",
      textarea: "min-h-10",
      attachment: "gap-2 pb-1",
      attachmentItemPadding: "px-2.5 py-1.5",
      meta: "gap-2 pt-1.5",
      chip: "px-2.5 py-1",
      metaText: "text-[10px]",
      controlButtonSize: "icon" as const,
      stopButtonSize: "sm" as const,
    },
    compact: {
      root: "gap-1.5",
      cardContent: "gap-1.5 p-2",
      inputRow: "gap-1.5",
      textarea: "min-h-9",
      attachment: "gap-1.5 pb-0.5",
      attachmentItemPadding: "px-2 py-1",
      meta: "gap-1.5 pt-1",
      chip: "px-2 py-0.5",
      metaText: "text-[10px]",
      controlButtonSize: "icon-sm" as const,
      stopButtonSize: "xs" as const,
    },
    dense: {
      root: "gap-1",
      cardContent: "gap-1.5 p-1.5",
      inputRow: "gap-1",
      textarea: "min-h-8",
      attachment: "gap-1 pb-0.5",
      attachmentItemPadding: "px-1.5 py-0.5",
      meta: "gap-1 pt-1",
      chip: "px-2 py-0.5",
      metaText: "text-[9px]",
      controlButtonSize: "icon-sm" as const,
      stopButtonSize: "xs" as const,
    },
  }[density]
  const attachmentCount = attachments?.length ?? 0
  const uploadingCount = attachments?.filter((attachment) => attachment.status === "uploading").length ?? 0
  const errorCount = attachments?.filter((attachment) => attachment.status === "error").length ?? 0
  const showAttachmentButton = allowAttachment && (showDefaultAttachmentButton ?? !prefix)

  const setDraftValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) setInternalValue(nextValue)
      onChange?.(nextValue)
    },
    [isControlled, onChange],
  )

  const closePanels = React.useCallback(() => {
    setShowMentions(false)
    setShowSuggestions(false)
  }, [])

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closePanels()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [closePanels])

  const updateValue = React.useCallback(
    (nextValue: string) => {
      setDraftValue(nextValue)

      if (!mentions?.length) {
        setShowMentions(false)
        return
      }

      const lastAt = nextValue.lastIndexOf("@")
      const mentionText = lastAt >= 0 ? nextValue.slice(lastAt + 1) : ""
      const mentionIsActive = lastAt >= 0 && !mentionText.includes(" ")

      if (mentionIsActive) {
        setMentionQuery(mentionText.toLowerCase())
        setShowMentions(true)
        setShowSuggestions(false)
        setActiveMentionIndex(0)
      } else {
        setShowMentions(false)
      }
    },
    [mentions, setDraftValue],
  )

  React.useEffect(() => {
    if (!mentions?.length) {
      setShowMentions(false)
      return
    }

    const lastAt = draft.lastIndexOf("@")
    const mentionText = lastAt >= 0 ? draft.slice(lastAt + 1) : ""
    const mentionIsActive = lastAt >= 0 && !mentionText.includes(" ")

    if (mentionIsActive) {
      setMentionQuery(mentionText.toLowerCase())
      setShowMentions(true)
    } else {
      setShowMentions(false)
    }
  }, [draft, mentions])

  const handleSubmit = React.useCallback(() => {
    const text = draft.trim()
    if (!text || loading || disabled) return
    onSubmit?.(text, attachments)
    if (!isControlled) setInternalValue("")
    closePanels()
  }, [attachments, closePanels, disabled, draft, isControlled, loading, onSubmit])

  const filteredMentions = React.useMemo(() => {
    if (!mentions) return []
    if (!mentionQuery) return mentions
    return mentions.filter(
      (item) =>
        item.label.toLowerCase().includes(mentionQuery) ||
        item.description?.toLowerCase().includes(mentionQuery),
    )
  }, [mentionQuery, mentions])

  React.useEffect(() => {
    setActiveMentionIndex(0)
  }, [mentionQuery, showMentions])

  const handleMentionClick = React.useCallback(
    (item: MentionItem) => {
      const lastAt = draft.lastIndexOf("@")
      if (lastAt >= 0) {
        const nextValue = `${draft.slice(0, lastAt)}@${item.label} `
        setDraftValue(nextValue)
      }
      setShowMentions(false)
      onMentionSelect?.(item)
    },
    [draft, onMentionSelect, setDraftValue],
  )

  const handleSuggestionClick = React.useCallback(
    (suggestion: string) => {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion)
      } else {
        setDraftValue(suggestion)
      }
      setShowSuggestions(false)
    },
    [onSuggestionClick, setDraftValue],
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Escape" && (showMentions || showSuggestions)) {
        event.preventDefault()
        closePanels()
        return
      }

      if (showMentions && filteredMentions.length > 0) {
        if (event.key === "ArrowDown") {
          event.preventDefault()
          setActiveMentionIndex((current) => (current + 1) % filteredMentions.length)
          return
        }

        if (event.key === "ArrowUp") {
          event.preventDefault()
          setActiveMentionIndex((current) => (current - 1 + filteredMentions.length) % filteredMentions.length)
          return
        }

        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault()
          handleMentionClick(filteredMentions[activeMentionIndex] ?? filteredMentions[0])
          return
        }
      }

      if (event.key === "Enter" && !event.shiftKey && !isComposing) {
        event.preventDefault()
        handleSubmit()
      }
    },
    [
      activeMentionIndex,
      closePanels,
      filteredMentions,
      handleMentionClick,
      handleSubmit,
      isComposing,
      showMentions,
      showSuggestions,
    ],
  )

  const overlayMode =
    showMentions && filteredMentions.length > 0
      ? "mentions"
      : showSuggestions && hasOverlaySuggestions
        ? "suggestions"
        : null

  const attachmentSummaryNode =
    attachmentCount > 0 ? (
      attachmentSummary ?? (
        <div
          data-slot="attachment-summary"
          className={cn(
            "inline-flex items-center gap-1 rounded-full border bg-muted/60 text-muted-foreground",
            densityStyles.chip,
            densityStyles.metaText,
          )}
        >
          <Paperclip className="size-3" />
          <span>{attachmentCount} 个附件</span>
          {uploadingCount > 0 && <span>上传中 {uploadingCount}</span>}
          {errorCount > 0 && <span className="text-destructive">失败 {errorCount}</span>}
        </div>
      )
    ) : null

    const hasMetaRow = true

  return (
    <div
      ref={rootRef}
      data-slot="chat-sender"
      className={cn(
        "flex flex-col",
        densityStyles.root,
        isDragOver && "rounded-lg border-2 border-dashed border-primary/60",
        className,
      )}
      onDragOver={(event) => {
        event.preventDefault()
        if (disabled) return
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragOver(false)
        if (disabled) return
        const files = event.dataTransfer.files
        if (files && files.length > 0) onAttachFiles?.(files)
      }}
      {...props}
    >
      {hasInlineSuggestions && (
        <div className={cn("flex flex-wrap", densityStyles.attachment)}>
          {suggestions?.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        {overlayMode === "mentions" && (
          <div
            data-slot="mention-list"
            role="listbox"
            aria-label="提及建议"
            className="absolute inset-x-0 bottom-full z-20 mb-2 max-h-64 overflow-y-auto rounded-lg border bg-popover p-1 shadow-md"
          >
            {filteredMentions.map((item, index) => (
              <button
                key={item.key}
                type="button"
                role="option"
                aria-selected={activeMentionIndex === index}
                onClick={() => handleMentionClick(item)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                  activeMentionIndex === index && "bg-accent",
                )}
              >
                <span className="font-medium">@{item.label}</span>
                {item.description && (
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {overlayMode === "suggestions" && (
          <div
            data-slot="suggestion-list"
            aria-label="快捷提示"
            className="absolute inset-x-0 bottom-full z-20 mb-2 rounded-lg border bg-popover p-2 shadow-md"
          >
            <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto">
              {suggestions?.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  aria-label={`应用提示 ${suggestion}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={cn(
          "relative overflow-visible rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col",
          densityStyles.cardContent,
        )}>
          {isDragOver && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-primary/5">
              <p className="text-xs font-medium text-primary">释放文件以上传</p>
            </div>
          )}
            {attachmentDisplay === "preview" && attachments && attachments.length > 0 && (
              <div
                data-slot="attachment-preview"
                className={cn(
                  "flex",
                  densityStyles.attachment,
                  attachmentLayout === "scroll" && "overflow-x-auto",
                  attachmentLayout === "wrap" && "flex-wrap",
                )}
              >
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className={cn(
                      "group/att relative flex min-w-0 items-center gap-2 rounded-lg border bg-muted/50",
                      densityStyles.attachmentItemPadding,
                      attachmentLayout === "scroll" && "max-w-60 shrink-0",
                    )}
                  >
                    {attachment.type === "image" ? (
                      attachment.previewUrl ? (
                        <img
                          src={attachment.previewUrl}
                          alt={attachment.name}
                          className="size-8 rounded object-cover"
                        />
                      ) : (
                        <ImageIcon className="size-4 text-blue-500" />
                      )
                    ) : (
                      <FileText className="size-4 text-green-500" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{attachment.name}</p>
                      {attachment.size && (
                        <p className="text-[10px] text-muted-foreground">{attachment.size}</p>
                      )}
                      {attachment.status === "uploading" && (
                        <div className="mt-1 w-24 overflow-hidden rounded bg-muted">
                          <div
                            className="h-1 bg-primary transition-all"
                            style={{
                              width: `${Math.min(100, Math.max(0, attachment.progress ?? 0))}%`,
                            }}
                          />
                        </div>
                      )}
                      {attachment.status === "error" && (
                        <div className="mt-0.5 flex items-center gap-1">
                          <p className="text-[10px] text-destructive">
                            {attachment.error ?? "上传失败"}
                          </p>
                          {onRetryAttachment && (
                            <button
                              type="button"
                              className="text-[10px] text-primary underline-offset-2 hover:underline"
                              onClick={() => onRetryAttachment(attachment.id)}
                            >
                              重试
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {onRemoveAttachment && (
                      <button
                        type="button"
                        onClick={() => onRemoveAttachment(attachment.id)}
                        className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover/att:opacity-100"
                        aria-label={`移除 ${attachment.name}`}
                      >
                        <X className="size-2.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className={cn("flex items-end", densityStyles.inputRow)}>
              {showAttachmentButton && (
                <Button
                  type="button"
                  variant="ghost"
                  size={densityStyles.controlButtonSize}
                  className="shrink-0"
                  aria-label="添加附件"
                  disabled={disabled}
                  onClick={onAttach}
                >
                  <Paperclip className="size-4" />
                </Button>
              )}
              {hasOverlaySuggestions && (
                <Button
                  type="button"
                  variant="ghost"
                  size={densityStyles.controlButtonSize}
                  className="shrink-0"
                  aria-label="打开快捷提示"
                  aria-expanded={showSuggestions}
                  disabled={disabled}
                  onClick={() => {
                    setShowSuggestions((current) => !current)
                    setShowMentions(false)
                  }}
                >
                  <Lightbulb className="size-3.5" />
                </Button>
              )}
              {prefix}
              {leadingActions}
              <Textarea
                placeholder={placeholder}
                value={draft}
                onChange={(event) => updateValue(event.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={(event) => {
                  setIsComposing(false)
                  updateValue(event.currentTarget.value)
                }}
                disabled={disabled}
                style={{ maxHeight: `${maxRows * 1.5}rem` }}
                className={cn(
                  "flex-1 resize-none overflow-y-auto border-0 bg-transparent shadow-none focus-visible:ring-0",
                  densityStyles.textarea,
                )}
              />
              {trailingActions}
              {suffix ?? (
                loading && onCancel ? (
                  <Button
                    type="button"
                    variant="outline"
                    size={densityStyles.stopButtonSize}
                    className="shrink-0"
                    onClick={onCancel}
                    aria-label="停止生成"
                  >
                    <Square className="size-3" />
                    停止生成
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size={densityStyles.controlButtonSize}
                    className="shrink-0"
                    disabled={!draft.trim() || disabled}
                    onClick={handleSubmit}
                    aria-label="发送"
                  >
                    <Send className="size-4" />
                  </Button>
                )
              )}
            </div>

            {hasMetaRow && (
              <div className={cn("flex items-center", densityStyles.meta)}>
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  {attachmentDisplay === "summary" && attachmentSummaryNode}
                  {footerText && (
                    <p className={cn("truncate text-muted-foreground", densityStyles.metaText)}>
                      {footerText}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {statusActions}
                  {!statusActions && (
                    <p className={cn("text-muted-foreground/60 select-none", densityStyles.metaText)}>
                      ⇧↵ 换行
                    </p>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export { ChatSender }
export type {
  Attachment,
  AttachmentDisplay,
  AttachmentLayout,
  ChatSenderProps,
  Density,
  MentionItem,
  SuggestionsVariant,
}
