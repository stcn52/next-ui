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
import { formatMessage, useLocale } from "@/components/config-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs/select"

const PAGE_SIZES = [10, 20, 50, 100]

interface GridPaginationProps<TData> {
  table: Table<TData>
}

export function GridPagination<TData>({ table }: GridPaginationProps<TData>) {
  const locale = useLocale()
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()
  const rowCount = table.getFilteredRowModel().rows.length
  const totalPageCount = pageCount || 1
  const pageLabel = formatMessage(locale.pageOf ?? "Page {page} of {total}", {
    page: pageIndex + 1,
    total: totalPageCount,
  })

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
      {/* Row info */}
      <div className="flex min-w-[140px] flex-col">
        <span className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground/80">
          {locale.page}
        </span>
        <span className="text-sm text-foreground">
          {rowCount > 0 ? pageLabel : locale.noResults}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* Page size */}
        <div className="flex items-center gap-2">
          <span className="text-sm">{locale.rowsPerPage ?? "Rows per page"}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="w-[88px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={locale.goToFirstPage ?? "Go to first page"}
          >
            <ChevronFirstIcon className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={locale.goToPreviousPage}
          >
            <ChevronLeftIcon className="size-3.5" />
          </Button>

          <span className="min-w-[68px] px-2 text-center text-sm tabular-nums text-foreground">
            {pageIndex + 1} / {totalPageCount}
          </span>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={locale.goToNextPage}
          >
            <ChevronRightIcon className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            aria-label={locale.goToLastPage ?? "Go to last page"}
          >
            <ChevronLastIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
