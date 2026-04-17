"use client"

/**
 * FormulaBar — 电子表格模式的公式栏
 *
 * 显示当前活跃单元格的地址（如 "A1"）和可编辑内容，
 * 行为与 Excel / fortune-sheet 公式栏一致。
 */
import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/config-provider"
import { cn } from "@/lib/utils"

/** 将列索引（0-based）转为列字母：0→A, 25→Z, 26→AA */
export function colLetter(idx: number): string {
  let result = ""
  let n = idx
  do {
    result = String.fromCharCode(65 + (n % 26)) + result
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return result
}

/** 单元格地址字符串，如 "B3" */
export function cellAddress(colIdx: number, rowIdx: number): string {
  return `${colLetter(colIdx)}${rowIdx + 1}`
}

interface FormulaBarProps {
  address: string       // e.g. "A1"
  value: string
  editing: boolean
  onChange: (v: string) => void
  onCommit: () => void
  onCancel: () => void
  className?: string
}

export function FormulaBar({
  address,
  value,
  editing,
  onChange,
  onCommit,
  onCancel,
  className,
}: FormulaBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const locale = useLocale()

  React.useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  return (
    <div
      className={cn(
        "flex items-center gap-0 border rounded-md overflow-hidden bg-background text-sm mb-1",
        className,
      )}
    >
      {/* Cell address box */}
      <div className="flex items-center justify-center w-14 shrink-0 text-xs font-mono font-semibold border-r bg-muted px-2 self-stretch">
        {address || "—"}
      </div>

      {/* Formula / value input */}
      <input
        ref={inputRef}
        value={value}
        readOnly={!editing}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); onCommit() }
          if (e.key === "Escape") { e.preventDefault(); onCancel() }
        }}
        placeholder={editing ? (locale.enterValue ?? "Enter value…") : (locale.noCellSelected ?? "No cell selected")}
        className={cn(
          "flex-1 px-2.5 py-1.5 text-sm outline-none bg-transparent",
          !editing && "text-muted-foreground cursor-default",
        )}
        aria-label={locale.formulaBar ?? "Formula bar"}
      />

      {/* Confirm / cancel buttons — only in editing state */}
      {editing && (
        <div className="flex border-l">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-none text-destructive hover:text-destructive"
            onClick={onCancel}
            aria-label={locale.cancel}
          >
            <XIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-none text-primary"
            onClick={onCommit}
            aria-label={locale.confirm}
          >
            <CheckIcon className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
