"use client"

/**
 * DataGrid Toolbar — 全局搜索 + 列可见性切换 + 已选行计数
 */
import { type Table } from "@tanstack/react-table"
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react"
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
}

export function Toolbar<TData>({
  table,
  filterColumn,
  filterPlaceholder,
  enableColumnVisibility = true,
}: ToolbarProps<TData>) {
  const locale = useLocale()
  const selectedCount = table.getSelectedRowModel().rows.length
  const selectedTotal = table.getFilteredRowModel().rows.length
  const filterLabel = filterPlaceholder ?? locale.filter ?? "Filter..."
  const columnsLabel = locale.columns ?? "Columns"

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
