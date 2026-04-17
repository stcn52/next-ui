"use client"

/**
 * RichTextEditor — 轻量 Markdown 富文本编辑器。
 *
 * 特性:
 * - 工具栏按钮：加粗 / 斜体 / 代码块 / 无序列表 / 有序列表 / 引用 / 链接
 * - 预览模式切换（Markdown → 渲染以模拟 MDX）
 * - 受控 value / 非受控 defaultValue
 * - 快捷键：Ctrl+B 加粗、Ctrl+I 斜体、Ctrl+` 行内代码
 *
 * Props:
 * - value?: string
 * - defaultValue?: string
 * - onChange?(v: string): void
 * - placeholder?: string
 * - minRows?: number
 * - maxRows?: number
 * - disabled?: boolean
 */

import * as React from "react"
import {
  BoldIcon,
  ItalicIcon,
  CodeIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  LinkIcon,
  EyeIcon,
  EditIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/display/separator"
import { Toggle } from "@/components/ui/inputs/toggle"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  minRows?: number
  maxRows?: number
  disabled?: boolean
  className?: string
}

// ─── Simple Markdown preview renderer ────────────────────────────────────────

function renderMarkdown(md: string): React.ReactNode {
  const lines = md.split("\n")
  const nodes: React.ReactNode[] = []
  let i = 0

  const inlineRender = (text: string, key: string | number): React.ReactNode => {
    // Bold **text**
    const bold = text.replace(/\*\*(.+?)\*\*/g, (_, t) => `<b>${t}</b>`)
    // Italic *text*
    const italic = bold.replace(/\*(.+?)\*/g, (_, t) => `<i>${t}</i>`)
    // Inline code `code`
    const code = italic.replace(/`(.+?)`/g, (_, t) => `<code>${t}</code>`)
    return <span key={key} dangerouslySetInnerHTML={{ __html: code }} />
  }

  while (i < lines.length) {
    const line = lines[i]

    if (/^#{1,3} /.test(line)) {
      const level = line.match(/^(#+)/)?.[1].length ?? 1
      const text = line.replace(/^#+\s/, "")
      const Tag = `h${level}` as "h1" | "h2" | "h3"
      const sizes = { h1: "text-xl font-bold", h2: "text-lg font-semibold", h3: "text-base font-semibold" }
      nodes.push(<Tag key={i} className={cn("mt-3 mb-1", sizes[Tag])}>{text}</Tag>)
    } else if (/^> /.test(line)) {
      nodes.push(
        <blockquote key={i} className="border-l-4 border-muted-foreground/40 pl-3 text-muted-foreground italic text-sm my-1">
          {inlineRender(line.replace(/^> /, ""), i)}
        </blockquote>,
      )
    } else if (/^- /.test(line)) {
      nodes.push(
        <li key={i} className="list-disc ml-4 text-sm">
          {inlineRender(line.replace(/^- /, ""), i)}
        </li>,
      )
    } else if (/^\d+\. /.test(line)) {
      nodes.push(
        <li key={i} className="list-decimal ml-4 text-sm">
          {inlineRender(line.replace(/^\d+\. /, ""), i)}
        </li>,
      )
    } else if (/^```/.test(line)) {
      // language tag (unused)
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i])
        i++
      }
      nodes.push(
        <pre key={i} className="rounded-md bg-muted px-3 py-2 my-2 text-xs font-mono overflow-x-auto">
          <code>{code.join("\n")}</code>
        </pre>,
      )
    } else if (line.trim() === "") {
      nodes.push(<div key={i} className="h-2" />)
    } else {
      nodes.push(
        <p key={i} className="text-sm leading-relaxed">
          {inlineRender(line, i)}
        </p>,
      )
    }
    i++
  }
  return nodes
}

// ─── Toolbar action ───────────────────────────────────────────────────────────

type WrapAction = {
  prefix: string
  suffix: string
  placeholder: string
}

function applyWrap(
  textarea: HTMLTextAreaElement,
  { prefix, suffix, placeholder }: WrapAction,
): string {
  const { selectionStart: start, selectionEnd: end, value } = textarea
  const selected = value.slice(start, end) || placeholder
  const before = value.slice(0, start)
  const after = value.slice(end)
  const next = `${before}${prefix}${selected}${suffix}${after}`
  // Restore selection after state update
  setTimeout(() => {
    const newStart = start + prefix.length
    const newEnd = newStart + selected.length
    textarea.setSelectionRange(newStart, newEnd)
    textarea.focus()
  }, 0)
  return next
}

// ─── Static toolbar config (no closures, no ref access) ──────────────────────

const TOOLBAR: Array<{ label: string; icon: React.ElementType; wrap: WrapAction } | null> = [
  { label: "加粗 (Ctrl+B)", icon: BoldIcon, wrap: { prefix: "**", suffix: "**", placeholder: "加粗文字" } },
  { label: "斜体 (Ctrl+I)", icon: ItalicIcon, wrap: { prefix: "*", suffix: "*", placeholder: "斜体文字" } },
  { label: "行内代码", icon: CodeIcon, wrap: { prefix: "`", suffix: "`", placeholder: "code" } },
  null,
  { label: "无序列表", icon: ListIcon, wrap: { prefix: "\n- ", suffix: "", placeholder: "列表项" } },
  { label: "有序列表", icon: ListOrderedIcon, wrap: { prefix: "\n1. ", suffix: "", placeholder: "列表项" } },
  { label: "引用", icon: QuoteIcon, wrap: { prefix: "\n> ", suffix: "", placeholder: "引用文字" } },
  { label: "链接", icon: LinkIcon, wrap: { prefix: "[", suffix: "](url)", placeholder: "链接文字" } },
]

// ─── Main ────────────────────────────────────────────────────────────────────

export function RichTextEditor({
  value,
  defaultValue = "",
  onChange,
  placeholder = "支持 Markdown 格式……",
  minRows = 6,
  maxRows = 20,
  disabled = false,
  className,
}: RichTextEditorProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const text = isControlled ? value! : internal
  const [preview, setPreview] = React.useState(false)
  const taRef = React.useRef<HTMLTextAreaElement>(null)

  const update = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  const wrap = React.useCallback(
    (action: WrapAction) => {
      if (!taRef.current) return
      update(applyWrap(taRef.current, action))
    },
    [update],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      if (e.key === "b") { e.preventDefault(); wrap({ prefix: "**", suffix: "**", placeholder: "加粗文字" }) }
      if (e.key === "i") { e.preventDefault(); wrap({ prefix: "*", suffix: "*", placeholder: "斜体文字" }) }
      if (e.key === "`") { e.preventDefault(); wrap({ prefix: "`", suffix: "`", placeholder: "行内代码" }) }
    }
  }

  const TOOLS = React.useMemo(() => TOOLBAR, [])

  return (
    <div
      aria-label="富文本编辑器"
      className={cn(
        "rounded-md border bg-card text-card-foreground",
        disabled && "opacity-60 pointer-events-none",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
        {TOOLS.map((tool, idx) =>
          tool === null ? (
            <Separator key={`sep-${idx}`} orientation="vertical" className="h-5 mx-1" />
          ) : (
            <Button
              key={tool.label}
              variant="ghost"
              size="icon"
              className="size-7 rounded-md"
              title={tool.label}
              aria-label={tool.label}
              onClick={() => wrap(tool.wrap)}
              disabled={preview}
            >
              <tool.icon className="size-3.5" />
            </Button>
          ),
        )}
        <div className="ml-auto flex items-center">
          <Toggle
            size="sm"
            pressed={preview}
            onPressedChange={setPreview}
            aria-label={preview ? "切换到编辑模式" : "切换到预览模式"}
            className="gap-1.5 text-xs h-7 px-2"
          >
            {preview ? <EditIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
            {preview ? "编辑" : "预览"}
          </Toggle>
        </div>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div
          className="px-3 py-2 min-h-[120px] text-sm"
          style={{ minHeight: `${minRows * 1.5}rem`, maxHeight: `${maxRows * 1.5}rem`, overflowY: "auto" }}
          aria-label="预览区域"
        >
          {text.trim() ? renderMarkdown(text) : <p className="text-muted-foreground">{placeholder}</p>}
        </div>
      ) : (
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => update(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Markdown 编辑器"
          className="w-full resize-none bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
          style={{ minHeight: `${minRows * 1.5}rem`, maxHeight: `${maxRows * 1.5}rem` }}
        />
      )}

      {/* Footer */}
      <div className="border-t px-3 py-1.5 flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          支持 Markdown · Ctrl+B 加粗 · Ctrl+I 斜体
        </p>
        <p className="text-[10px] text-muted-foreground">{text.length} 字符</p>
      </div>
    </div>
  )
}
