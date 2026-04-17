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

  return (
    <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
      {/* Row info */}
      <span className="text-xs">
        {rowCount > 0
          ? formatMessage(locale.pageOf ?? "Page {page} of {total}", {
              page: pageIndex + 1,
              total: totalPageCount,
            })
          : locale.noResults}
      </span>

      <div className="flex items-center gap-3">
        {/* Page size */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{locale.rowsPerPage ?? "Rows per page"}</span>
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
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={locale.goToFirstPage ?? "Go to first page"}
          >
            <ChevronFirstIcon className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={locale.goToPreviousPage}
          >
            <ChevronLeftIcon className="size-3.5" />
          </Button>

          <span className="text-xs px-2 tabular-nums">
            {pageIndex + 1} / {totalPageCount}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={locale.goToNextPage}
          >
            <ChevronRightIcon className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
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
