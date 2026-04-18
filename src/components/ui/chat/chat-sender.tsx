import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/inputs/textarea"
import type { FieldControlProps } from "@/components/form-engine/widget-adapter"
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
type AttachmentSummaryPlacement = "utility" | "input"
type UtilityVisibility = "auto" | "always" | "hidden"

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
  /** Where summary-mode attachments are rendered */
  attachmentSummaryPlacement?: AttachmentSummaryPlacement
  /** Custom prefix content (left of textarea) */
  prefix?: React.ReactNode
  /** Custom suffix content (right of textarea) */
  suffix?: React.ReactNode
  /** Footer text below the sender */
  footerText?: string
  /** Whether to show the keyboard hint in the utility row */
  showKeyboardHint?: boolean
  /** Controls when the utility row is rendered */
  utilityVisibility?: UtilityVisibility
  /** Form-engine field wiring */
  fieldProps?: Pick<FieldControlProps, "id" | "name" | "aria-describedby" | "aria-invalid" | "aria-labelledby" | "aria-required" | "onBlur">
  /**
   * Minimum visible rows before auto-resize kicks in.
   * Defaults to 2 for default/compact and 1 for dense.
   */
  minRows?: number
  /**
   * Maximum number of visible rows before the textarea enters scroll mode.
   * Defaults to 6.
   */
  maxRows?: number
  /** Whether the textarea should grow with content until maxRows */
  autoResize?: boolean
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
  attachmentSummaryPlacement,
  prefix,
  suffix,
  footerText,
  showKeyboardHint = false,
  utilityVisibility = "auto",
  fieldProps,
  minRows,
  maxRows = 6,
  autoResize = true,
  className,
  ...props
}: ChatSenderProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
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
      root: "gap-1.5",
      cardContent: "gap-1.5 p-1.5",
      inputRow: "gap-1.5",
      textarea: "text-sm leading-6",
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
      cardContent: "gap-1.5 p-1.5",
      inputRow: "gap-1.5",
      textarea: "text-sm leading-6",
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
      cardContent: "gap-1 p-1.5",
      inputRow: "gap-1",
      textarea: "text-xs leading-5",
      attachment: "gap-1 pb-0.5",
      attachmentItemPadding: "px-1.5 py-0.5",
      meta: "gap-1 pt-1",
      chip: "px-2 py-0.5",
      metaText: "text-[9px]",
      controlButtonSize: "icon-sm" as const,
      stopButtonSize: "xs" as const,
    },
  }[density]
  const resolvedMinRows = minRows ?? (density === "dense" ? 1 : 2)
  const resolvedMaxRows = Math.max(maxRows, resolvedMinRows)
  const resolvedAttachmentSummaryPlacement =
    attachmentSummaryPlacement ?? (density === "dense" ? "input" : "utility")
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

  const syncTextareaHeight = React.useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    if (!autoResize) {
      textarea.style.removeProperty("height")
      textarea.style.removeProperty("overflow-y")
      return
    }

    const styles = window.getComputedStyle(textarea)
    const lineHeight = Number.parseFloat(styles.lineHeight) || (density === "dense" ? 20 : 24)
    const paddingY =
      Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom)
    const borderY =
      Number.parseFloat(styles.borderTopWidth) + Number.parseFloat(styles.borderBottomWidth)
    const minHeight = lineHeight * resolvedMinRows + paddingY + borderY
    const maxHeight = lineHeight * resolvedMaxRows + paddingY + borderY

    textarea.style.height = "auto"
    const nextHeight = Math.min(maxHeight, Math.max(minHeight, textarea.scrollHeight))
    textarea.style.height = `${nextHeight}px`
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [autoResize, density, resolvedMaxRows, resolvedMinRows])

  React.useEffect(() => {
    syncTextareaHeight()
  }, [draft, syncTextareaHeight])

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
            "inline-flex max-w-full items-center gap-1 rounded-full border bg-muted/60 text-muted-foreground",
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

  const showAttachmentSummaryInInput =
    attachmentDisplay === "summary" &&
    resolvedAttachmentSummaryPlacement === "input" &&
    attachmentSummaryNode

  const showAttachmentSummaryInUtility =
    attachmentDisplay === "summary" &&
    resolvedAttachmentSummaryPlacement === "utility" &&
    attachmentSummaryNode

  const hasUtilityContent = Boolean(
    showAttachmentSummaryInUtility || footerText || statusActions || showKeyboardHint,
  )

  const hasMetaRow =
    utilityVisibility === "always"
      ? true
      : utilityVisibility === "hidden"
        ? false
        : hasUtilityContent

  return (
    <div
      ref={rootRef}
      data-slot="chat-sender"
      className={cn(
        "flex flex-col",
        densityStyles.root,
        isDragOver && "rounded-md border-2 border-dashed border-primary/60",
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
            className="absolute inset-x-0 bottom-full z-20 mb-2 max-h-64 overflow-y-auto rounded-md border bg-popover p-0.5 shadow-sm"
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
            className="absolute inset-x-0 bottom-full z-20 mb-2 rounded-md border bg-popover p-1 shadow-sm"
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
          "relative flex flex-col overflow-visible rounded-lg border bg-card text-card-foreground shadow-sm",
          densityStyles.cardContent,
        )}>
          {isDragOver && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-primary/5">
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
                      "group/att relative flex min-w-0 items-center gap-2 rounded-md border bg-muted/50",
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

            <div
              data-slot="chat-sender-input-row"
              className={cn("flex items-end", densityStyles.inputRow)}
            >
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
              {showAttachmentSummaryInInput}
              <Textarea
                ref={textareaRef}
                id={fieldProps?.id}
                name={fieldProps?.name}
                rows={resolvedMinRows}
                placeholder={placeholder}
                value={draft}
                onChange={(event) => updateValue(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={fieldProps?.onBlur}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={(event) => {
                  setIsComposing(false)
                  updateValue(event.currentTarget.value)
                }}
                disabled={disabled}
                aria-labelledby={fieldProps?.["aria-labelledby"]}
                aria-describedby={fieldProps?.["aria-describedby"]}
                aria-invalid={fieldProps?.["aria-invalid"]}
                aria-required={fieldProps?.["aria-required"]}
                style={autoResize ? undefined : { maxHeight: `${resolvedMaxRows * 1.5}rem` }}
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
              <div
                data-slot="chat-sender-meta"
                className={cn("flex items-center", densityStyles.meta)}
              >
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  {showAttachmentSummaryInUtility}
                  {footerText && (
                    <p className={cn("truncate text-muted-foreground", densityStyles.metaText)}>
                      {footerText}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {statusActions}
                  {!statusActions && showKeyboardHint && (
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
  AttachmentSummaryPlacement,
  ChatSenderProps,
  Density,
  MentionItem,
  SuggestionsVariant,
  UtilityVisibility,
}
