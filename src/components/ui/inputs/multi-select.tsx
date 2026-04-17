"use client"

/**
 * MultiSelect — 多选下拉（支持搜索、全选、标签芯片）。
 *
 * Props:
 * - options: SelectOption[]
 * - value?: string[]           受控已选值
 * - defaultValue?: string[]    非受控初始值
 * - onChange?(v: string[]): void
 * - placeholder?: string
 * - searchPlaceholder?: string
 * - maxSelected?: number       最多可选数量
 * - disabled?: boolean
 * - clearable?: boolean        是否显示全部清除按钮，默认 true
 * - className?: string
 */

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, XCircleIcon, XIcon, SearchIcon } from "lucide-react"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/overlays/popover"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: SelectOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  maxSelected?: number
  disabled?: boolean
  clearable?: boolean
  className?: string
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onChange,
  placeholder = "请选择…",
  searchPlaceholder = "搜索选项…",
  maxSelected,
  disabled = false,
  clearable = true,
  className,
}: MultiSelectProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string[]>(defaultValue)
  const selected = isControlled ? value! : internal

  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const emit = (next: string[]) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const toggle = (v: string) => {
    if (selected.includes(v)) {
      emit(selected.filter((s) => s !== v))
    } else {
      if (maxSelected && selected.length >= maxSelected) return
      emit([...selected, v])
    }
  }

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation()
    emit([])
  }

  const removeTag = (v: string, e: React.MouseEvent) => {
    e.stopPropagation()
    emit(selected.filter((s) => s !== v))
  }

  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      o.description?.toLowerCase().includes(search.toLowerCase()),
  )

  const selectedOptions = options.filter((o) => selected.includes(o.value))

  const atMax = maxSelected !== undefined && selected.length >= maxSelected

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-9 h-auto py-1.5 px-3 justify-start text-left font-normal w-full",
              disabled && "opacity-60",
              className,
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {selectedOptions.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedOptions.map((o) => (
                  <Badge
                    key={o.value}
                    variant="secondary"
                    size="sm"
                    className="gap-1 pr-1"
                  >
                    {o.label}
                    <button
                      type="button"
                      aria-label={`移除 ${o.label}`}
                      className="ml-0.5 hover:text-destructive"
                      onClick={(e) => removeTag(o.value, e)}
                      onKeyDown={(e) => e.key === "Enter" && removeTag(o.value, e as unknown as React.MouseEvent)}
                    >
                      <XIcon className="size-2.5" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {clearable && selected.length > 0 && (
                <button
                  type="button"
                  aria-label="清除所有"
                  className="p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={clear}
                  onKeyDown={(e) => e.key === "Enter" && clear(e as unknown as React.MouseEvent)}
                >
                  <XCircleIcon className="size-4" />
                </button>
              )}
              <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
            </div>
          </Button>
        }
      />

      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[220px]" align="start">
        {/* Search */}
        <div className="flex items-center border-b px-2 py-1.5 gap-2">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            aria-label={searchPlaceholder}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="清除搜索">
              <XIcon className="size-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Header with count */}
        {maxSelected && (
          <div className="px-3 py-1 text-[10px] text-muted-foreground border-b">
            已选 {selected.length} / {maxSelected}
          </div>
        )}

        {/* Options list */}
        <div className="max-h-56 overflow-y-auto py-1" role="listbox" aria-label="选项列表" aria-multiselectable="true">
          {filteredOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">无匹配选项</p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selected.includes(option.value)
              const isDisabledOption = option.disabled || (atMax && !isSelected)

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={isDisabledOption}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm text-left",
                    isDisabledOption ? "opacity-40 cursor-not-allowed" : "hover:bg-accent cursor-pointer",
                    isSelected && "text-primary font-medium",
                  )}
                  onClick={() => !isDisabledOption && toggle(option.value)}
                >
                  <div className={cn("size-4 shrink-0 rounded border flex items-center justify-center", isSelected && "bg-primary border-primary text-primary-foreground")}>
                    {isSelected && <CheckIcon className="size-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="leading-none truncate">{option.label}</p>
                    {option.description && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{option.description}</p>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        {selected.length > 0 && clearable && (
          <div className="border-t px-2 py-1.5 flex justify-end">
            <Button variant="ghost" size="xs" onClick={clear} className="text-destructive hover:text-destructive">
              清除全部
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
