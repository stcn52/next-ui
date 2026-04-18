"use client"

/**
 * DataGrid Toolbar — 全局搜索 + 列可见性切换 + 导出/重置 + 已选行计数
 */
import { type Table } from "@tanstack/react-table"
import { CopyIcon, DownloadIcon, EllipsisIcon, SearchIcon, RotateCcwIcon, SlidersHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inputs/input"
import { Badge } from "@/components/ui/display/badge"
import { formatMessage, useLocale } from "@/components/config-provider"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const exportLabel = locale.exportCsv ?? "Export CSV"
  const columnsLabel = locale.columns ?? "Columns"
  const resetLabel = locale.reset ?? "Reset"
  const moreActionsLabel = locale.moreActions ?? "More actions"
  const hasSecondaryActions = enableClipboardCopy || enableCsvExport || enableResetView

  return (
    <div className="flex flex-wrap items-center gap-2 pb-2">
      {/* Filter input */}
      {filterColumn && (
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={filterLabel}
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
            className="pl-8"
            aria-label={filterLabel}
          />
        </div>
      )}

      <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
        {/* Selected rows badge */}
        {selectedCount > 0 && (
          <Badge variant="secondary" className="h-6 px-2 text-sm">
            {formatMessage(locale.rowsSelected, { count: selectedCount, total: selectedTotal })}
          </Badge>
        )}

        {/* Column visibility */}
        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" aria-label={columnsLabel}>
                  <SlidersHorizontalIcon className="size-3.5" />
                  {columnsLabel}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                {columnsLabel}
              </div>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(v)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {hasSecondaryActions && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" aria-label={moreActionsLabel}>
                  <EllipsisIcon className="size-4" />
                  {moreActionsLabel}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                {moreActionsLabel}
              </div>
              <DropdownMenuSeparator />
              {enableClipboardCopy && (
                <DropdownMenuItem
                  onClick={onCopyClipboard}
                  disabled={!canCopyClipboard}
                >
                  <CopyIcon className="size-4" />
                  {copyLabel}
                </DropdownMenuItem>
              )}
              {enableCsvExport && (
                <DropdownMenuItem onClick={onExportCsv}>
                  <DownloadIcon className="size-4" />
                  {exportLabel}
                </DropdownMenuItem>
              )}
              {enableResetView && (
                <DropdownMenuItem onClick={onResetView}>
                  <RotateCcwIcon className="size-4" />
                  {resetLabel}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
