"use client"

/**
 * DataGrid Toolbar — 全局搜索 + 列可见性切换 + 已选行计数
 */
import { type Table } from "@tanstack/react-table"
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ToolbarProps<TData> {
  table: Table<TData>
  filterColumn?: string
  filterPlaceholder?: string
  enableColumnVisibility?: boolean
}

export function Toolbar<TData>({
  table,
  filterColumn,
  filterPlaceholder = "搜索…",
  enableColumnVisibility = true,
}: ToolbarProps<TData>) {
  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <div className="flex items-center gap-2 pb-2">
      {/* Filter input */}
      {filterColumn && (
        <div className="relative flex-1 max-w-xs">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={filterPlaceholder}
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
            className="pl-8 h-8 text-sm"
            aria-label={filterPlaceholder}
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {/* Selected rows badge */}
        {selectedCount > 0 && (
          <Badge variant="secondary" className="text-xs h-7">
            已选 {selectedCount} 行
          </Badge>
        )}

        {/* Column visibility */}
        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <SlidersHorizontalIcon className="size-3.5" />
                列
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-xs">显示 / 隐藏列</DropdownMenuLabel>
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
