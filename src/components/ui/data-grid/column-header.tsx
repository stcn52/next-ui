"use client"

/**
 * ColumnHeader — 可排序 + 可调宽 + 可固定的列头单元格
 */
import { type Column, type Header } from "@tanstack/react-table"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
  PinIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/config-provider"
import { cn } from "@/lib/utils"

interface ColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  header: Header<TData, TValue>
  title: string
  enablePinning?: boolean
  enableResizing?: boolean
}

export function ColumnHeader<TData, TValue>({
  column,
  header,
  title,
  enablePinning = false,
  enableResizing = false,
}: ColumnHeaderProps<TData, TValue>) {
  const sorted = column.getIsSorted()
  const pinned = column.getIsPinned()
  const locale = useLocale()

  return (
    <div className="group relative flex items-center gap-1 select-none h-full pr-3">
      {/* Sort trigger */}
      {column.getCanSort() ? (
        <button
          type="button"
          className="flex flex-1 items-center gap-1 text-left font-medium text-xs hover:text-foreground"
          onClick={() => column.toggleSorting(sorted === "asc")}
          aria-label={(locale.sortByColumn ?? "Sort by {title}").replace("{title}", title)}
        >
          <span className="truncate">{title}</span>
          {sorted === "asc" ? (
            <ArrowUpIcon className="size-3 shrink-0 text-primary" />
          ) : sorted === "desc" ? (
            <ArrowDownIcon className="size-3 shrink-0 text-primary" />
          ) : (
            <ArrowUpDownIcon className="size-3 shrink-0 opacity-0 group-hover:opacity-50" />
          )}
        </button>
      ) : (
        <span className="flex-1 truncate font-medium text-xs">{title}</span>
      )}

      {/* Pin toggle */}
      {enablePinning && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-5 opacity-0 group-hover:opacity-100 shrink-0",
            pinned && "opacity-100 text-primary",
          )}
          aria-label={pinned ? (locale.unpinColumn ?? "Unpin column") : (locale.pinColumn ?? "Pin column to left")}
          onClick={() => column.pin(pinned ? false : "left")}
        >
          <PinIcon className="size-3" style={{ transform: pinned ? "none" : "rotate(45deg)" }} />
        </Button>
      )}

      {/* Resize handle */}
      {enableResizing && column.getCanResize() && (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={cn(
            "absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none",
            "opacity-0 group-hover:opacity-100 hover:bg-primary/40",
            column.getIsResizing() && "opacity-100 bg-primary",
          )}
          aria-hidden
        />
      )}
    </div>
  )
}
