"use client"

/**
 * GridPagination — 分页控件（兼容 TanStack Table pagination API）
 */
import { type Table } from "@tanstack/react-table"
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PAGE_SIZES = [10, 20, 50, 100]

interface GridPaginationProps<TData> {
  table: Table<TData>
}

export function GridPagination<TData>({ table }: GridPaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()
  const rowCount = table.getFilteredRowModel().rows.length

  const from = pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, rowCount)

  return (
    <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
      {/* Row info */}
      <span className="text-xs">
        {rowCount > 0 ? `${from}–${to} / 共 ${rowCount} 行` : "无数据"}
      </span>

      <div className="flex items-center gap-3">
        {/* Page size */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs">每页</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((s) => (
                <SelectItem key={s} value={String(s)} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs">行</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="第一页"
          >
            <ChevronFirstIcon className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="上一页"
          >
            <ChevronLeftIcon className="size-3.5" />
          </Button>

          <span className="text-xs px-2 tabular-nums">
            {pageIndex + 1} / {pageCount || 1}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="下一页"
          >
            <ChevronRightIcon className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            aria-label="最后一页"
          >
            <ChevronLastIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
