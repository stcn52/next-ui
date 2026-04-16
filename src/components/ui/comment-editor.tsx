"use client"

/**
 * CommentEditor — 社区评论输入框，结合 RichTextEditor + @提及 + 附件上传。
 *
 * 特性:
 * - 内置 RichTextEditor（可选）
 * - @提及：输入 @ 弹出用户候选列表
 * - 附件列表预览（仅 UI，不实际上传）
 * - 提交 / 取消 按钮
 * - 字符上限提示
 *
 * Props:
 * - placeholder?: string
 * - maxLength?: number          默认 2000
 * - mentionUsers?: MentionUser[]
 * - onSubmit?(content: string, attachments: File[]): void
 * - onCancel?(): void
 * - submitLabel?: string
 * - disabled?: boolean
 * - autoFocus?: boolean
 */

import * as React from "react"
import { AtSignIcon, PaperclipIcon, XIcon, ImageIcon, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MentionUser {
  id: string
  name: string
  username: string
  avatar?: string
}

export interface CommentEditorProps {
  placeholder?: string
  maxLength?: number
  mentionUsers?: MentionUser[]
  onSubmit?: (content: string, attachments: File[]) => void
  onCancel?: () => void
  submitLabel?: string
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

// ─── MentionDropdown ─────────────────────────────────────────────────────────

function MentionDropdown({
  users,
  query,
  onSelect,
}: {
  users: MentionUser[]
  query: string
  onSelect: (user: MentionUser) => void
}) {
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase()),
  )

  if (filtered.length === 0) return null

  return (
    <div
      role="listbox"
      aria-label="提及用户"
      className="absolute z-50 bottom-full mb-1 left-0 w-56 rounded-lg border bg-popover shadow-md overflow-hidden"
    >
      {filtered.slice(0, 6).map((u) => (
        <button
          key={u.id}
          role="option"
          aria-selected={false}
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-left"
          onMouseDown={(e) => { e.preventDefault(); onSelect(u) }}
        >
          <Avatar className="size-6">
            {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
            <AvatarFallback className="text-[10px]">{u.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate leading-none">{u.name}</p>
            <p className="text-[10px] text-muted-foreground">@{u.username}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── AttachmentChip ──────────────────────────────────────────────────────────

function AttachmentChip({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isImage = file.type.startsWith("image/")
  return (
    <div className="flex items-center gap-1.5 rounded-md border bg-muted px-2 py-1 text-xs">
      {isImage ? <ImageIcon className="size-3 shrink-0 text-muted-foreground" /> : <FileIcon className="size-3 shrink-0 text-muted-foreground" />}
      <span className="max-w-[120px] truncate">{file.name}</span>
      <button
        type="button"
        aria-label={`移除附件 ${file.name}`}
        onClick={onRemove}
        className="text-muted-foreground hover:text-foreground"
      >
        <XIcon className="size-3" />
      </button>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function CommentEditor({
  placeholder = "写下你的评论……支持 @提及 用户",
  maxLength = 2000,
  mentionUsers = [],
  onSubmit,
  onCancel,
  submitLabel = "发布评论",
  disabled = false,
  autoFocus = false,
  className,
}: CommentEditorProps) {
  const [content, setContent] = React.useState("")
  const [attachments, setAttachments] = React.useState<File[]>([])
  const [mentionQuery, setMentionQuery] = React.useState<string | null>(null)
  const [mentionOpen, setMentionOpen] = React.useState(false)
  const taRef = React.useRef<HTMLTextAreaElement>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const overLimit = content.length > maxLength

  /** Detect @mention trigger while user types */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setContent(val)

    // Check last word for @
    const cursor = e.target.selectionStart
    const before = val.slice(0, cursor)
    const match = before.match(/@(\w*)$/)
    if (match) {
      setMentionQuery(match[1])
      setMentionOpen(true)
    } else {
      setMentionOpen(false)
      setMentionQuery(null)
    }
  }

  const insertMention = (user: MentionUser) => {
    if (!taRef.current) return
    const cursor = taRef.current.selectionStart
    const before = content.slice(0, cursor)
    const after = content.slice(cursor)
    // Replace the partial @mention
    const replaced = before.replace(/@(\w*)$/, `@${user.username} `)
    const next = replaced + after
    setContent(next)
    setMentionOpen(false)
    setMentionQuery(null)
    setTimeout(() => {
      taRef.current?.focus()
      taRef.current?.setSelectionRange(replaced.length, replaced.length)
    }, 0)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)])
    }
    e.target.value = ""
  }

  const handleSubmit = () => {
    if (!content.trim() || overLimit) return
    onSubmit?.(content, attachments)
    setContent("")
    setAttachments([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionOpen && e.key === "Escape") {
      setMentionOpen(false)
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className={cn("rounded-lg border bg-card focus-within:ring-2 focus-within:ring-ring transition-shadow", className)}
      aria-label="评论编辑器"
    >
      {/* Textarea */}
      <div className="relative">
        {mentionOpen && mentionQuery !== null && (
          <MentionDropdown
            users={mentionUsers}
            query={mentionQuery}
            onSelect={insertMention}
          />
        )}
        <textarea
          ref={taRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setMentionOpen(false), 150)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-label="评论内容"
          aria-multiline="true"
          className="w-full resize-none bg-transparent px-3 pt-3 pb-1 text-sm placeholder:text-muted-foreground focus:outline-none min-h-[96px] max-h-[300px]"
        />
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          {attachments.map((f, idx) => (
            <AttachmentChip
              key={`${f.name}-${idx}`}
              file={f}
              onRemove={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
            />
          ))}
        </div>
      )}

      {/* Footer toolbar */}
      <div className="flex items-center gap-1 border-t px-2 py-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          title="@提及用户"
          aria-label="@提及用户"
          onClick={() => {
            setContent((c) => c + "@")
            setMentionOpen(true)
            setMentionQuery("")
            taRef.current?.focus()
          }}
        >
          <AtSignIcon className="size-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          title="上传附件"
          aria-label="上传附件"
          onClick={() => fileRef.current?.click()}
        >
          <PaperclipIcon className="size-3.5" />
        </Button>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          aria-hidden="true"
          onChange={handleFileChange}
        />

        <div className="ml-auto flex items-center gap-2">
          {maxLength && (
            <p className={cn("text-[10px]", overLimit ? "text-destructive font-medium" : "text-muted-foreground")}>
              {content.length}/{maxLength}
            </p>
          )}
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={disabled}>
              取消
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={disabled || !content.trim() || overLimit}
            title="Ctrl+Enter 快速发布"
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
