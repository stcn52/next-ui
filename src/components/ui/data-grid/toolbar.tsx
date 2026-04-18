"use client"

/**
 * DataGrid Toolbar — 全局搜索 + 列可见性切换 + 导出/重置 + 已选行计数
 */
import { type Table } from "@tanstack/react-table"
import { CopyIcon, DownloadIcon, SearchIcon, RotateCcwIcon, SlidersHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inputs/input"
import { Badge } from "@/components/ui/display/badge"
import { formatMessage, useLocale } from "@/components/config-provider"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/overlays/dropdown-menu"

interface ToolbarProps<TData> {
  table: Table<TData>
  filterColumn?: string
  filterPlaceholder?: string
  enableColumnVisibility?: boolean
  enableClipboardCopy?: boolean
  canCopyClipboard?: boolean
  enableCsvExport?: boolean
  enableResetView?: boolean
  onCopyClipboard?: () => void
  onExportCsv?: () => void
  onResetView?: () => void
}

export function Toolbar<TData>({
  table,
  filterColumn,
  filterPlaceholder,
  enableColumnVisibility = true,
  enableClipboardCopy = false,
  canCopyClipboard = false,
  enableCsvExport = false,
  enableResetView = false,
  onCopyClipboard,
  onExportCsv,
  onResetView,
}: ToolbarProps<TData>) {
  const locale = useLocale()
  const selectedCount = table.getSelectedRowModel().rows.length
  const selectedTotal = table.getFilteredRowModel().rows.length
  const filterLabel = filterPlaceholder ?? locale.filter ?? "Filter..."
  const copyLabel = locale.copy ?? "Copy"
  const columnsLabel = locale.columns ?? "Columns"
  const resetLabel = locale.reset ?? "Reset"

  return (
    <div className="flex items-center gap-2 pb-2">
      {/* Filter input */}
      {filterColumn && (
        <div className="relative flex-1 max-w-xs">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={filterLabel}
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
            className="h-8 pl-8 text-sm"
            aria-label={filterLabel}
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {/* Selected rows badge */}
        {selectedCount > 0 && (
          <Badge variant="secondary" className="text-xs h-7">
            {formatMessage(locale.rowsSelected, { count: selectedCount, total: selectedTotal })}
          </Badge>
        )}

        {enableClipboardCopy && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={onCopyClipboard}
            disabled={!canCopyClipboard}
            aria-label={copyLabel}
          >
            <CopyIcon className="size-3.5" />
            {copyLabel}
          </Button>
        )}

        {enableCsvExport && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={onExportCsv}
            aria-label="导出 CSV"
          >
            <DownloadIcon className="size-3.5" />
            CSV
          </Button>
        )}

        {enableResetView && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={onResetView}
            aria-label={resetLabel}
          >
            <RotateCcwIcon className="size-3.5" />
            {resetLabel}
          </Button>
        )}

        {/* Column visibility */}
        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" aria-label={columnsLabel}>
                  <SlidersHorizontalIcon className="size-3.5" />
                  {columnsLabel}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-xs">{columnsLabel}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize text-xs"
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(v)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
