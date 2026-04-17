"use client"

/**
 * GridCell — 单元格（显示 / 编辑双模式）
 *
 * 在 DataGrid 的数据模式下：双击进入编辑，Enter 确认，Escape 取消。
 * 在电子表格模式下：单击激活，双击 / F2 进入编辑，方向键导航。
 */
import * as React from "react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/config-provider"

export interface GridCellProps {
  /** 显示 / 编辑的值（字符串化后展示） */
  value: unknown
  /** 电子表格模式下是否为当前活跃单元格（主边框高亮） */
  active?: boolean
  /** 是否处于编辑状态 */
  editing?: boolean
  /** 是否可编辑 */
  editable?: boolean
  /** 所在行是否被选中（行背景高亮） */
  rowSelected?: boolean
  /** 单击激活（电子表格模式） */
  onActivate?: () => void
  /** 触发进入编辑（双击 / F2） */
  onStartEdit?: () => void
  /** 编辑完成 */
  onCommit?: (value: string) => void
  /** 取消编辑 */
  onCancel?: () => void
  /** 键盘导航 —— 由外部处理方向键等 */
  onKeyNav?: (e: React.KeyboardEvent) => void
  className?: string
}

export function GridCell({
  value,
  active = false,
  editing = false,
  editable = false,
  rowSelected = false,
  onActivate,
  onStartEdit,
  onCommit,
  onCancel,
  onKeyNav,
  className,
}: GridCellProps) {
  const displayValue = value == null ? "" : String(value)
  const [draft, setDraft] = React.useState(displayValue)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const ignoreBlurRef = React.useRef(false)
  const locale = useLocale()

  // Sync draft when value changes externally
  React.useEffect(() => {
    if (!editing) setDraft(displayValue)
  }, [displayValue, editing])

  // Focus input when entering edit mode
  React.useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const commit = () => onCommit?.(draft)
  const cancel = () => {
    setDraft(displayValue)
    onCancel?.()
  }

  if (editing && editable) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (ignoreBlurRef.current) {
            ignoreBlurRef.current = false
            return
          }
          commit()
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            ignoreBlurRef.current = true
            commit()
          }
          if (e.key === "Escape") {
            e.preventDefault()
            ignoreBlurRef.current = true
            cancel()
          }
          onKeyNav?.(e)
        }}
        className={cn(
          "w-full h-full px-2 py-1 text-sm outline-none bg-background",
          "border-2 border-primary ring-2 ring-primary/20",
          className,
        )}
        aria-label={locale.editCell ?? "Edit cell"}
      />
    )
  }

  return (
    <div
      role={editable ? "button" : undefined}
      tabIndex={active ? 0 : -1}
      onClick={onActivate}
      onDoubleClick={editable ? onStartEdit : undefined}
      onKeyDown={(e) => {
        if (editable && (e.key === "F2" || e.key === "Enter")) {
          e.preventDefault()
          onStartEdit?.()
        }
        onKeyNav?.(e)
      }}
      className={cn(
        "w-full h-full px-2 py-1.5 text-sm truncate select-none",
        active && "outline outline-2 outline-primary outline-offset-[-2px] z-10",
        rowSelected && !active && "bg-primary/5",
        editable && "cursor-cell hover:bg-accent/30",
        className,
      )}
      aria-selected={active}
    >
      {displayValue || <span className="text-muted-foreground/50">—</span>}
    </div>
  )
}
