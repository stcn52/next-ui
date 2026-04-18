"use client"

import { useState } from "react"
import { SearchIcon } from "lucide-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/display/table"
import { Button } from "@/components/ui/button"
import { GridPagination } from "@/components/ui/data-grid/pagination"
import { Input } from "@/components/ui/inputs/input"
import { useLocale, formatMessage } from "@/components/config-provider"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
  filterPlaceholder?: string
  pageSize?: number
}

function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const locale = useLocale()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: { pageSize },
    },
  })

  const resolvedPlaceholder = filterPlaceholder ?? locale.filter
  const filteredRowCount = table.getFilteredRowModel().rows.length
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length
  const hasActiveFilter = columnFilters.length > 0
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = Math.max(table.getPageCount(), 1)
  const pageSummary = formatMessage(locale.pageOf, {
    page: pageIndex + 1,
    total: pageCount,
  })

  return (
    <div data-slot="data-table" className="flex flex-col gap-3">
      {filterColumn && (
        <div className="flex items-center">
          <div className="relative max-w-sm flex-1">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={resolvedPlaceholder}
              aria-label={`Filter results by ${filterColumn}`}
              value={
                (table
                  .getColumn(filterColumn)
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(filterColumn)
                  ?.setFilterValue(event.target.value)
              }
              className="pl-8"
            />
          </div>
        </div>
      )}
      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-36"
                >
                  <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
                    <p className="text-sm font-medium text-foreground">{locale.noResults}</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {hasActiveFilter ? (locale.adjustFilter ?? locale.noResults) : locale.noResults}
                    </p>
                    {hasActiveFilter && filterColumn && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.getColumn(filterColumn)?.setFilterValue("")}
                      >
                        {locale.clear}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 rounded-md border border-border/60 bg-muted/20 px-3 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2" role="status" aria-live="polite">
          <div className="text-sm text-muted-foreground">
            {selectedRowCount > 0
              ? `${pageSummary} · ${formatMessage(locale.rowsSelected, {
                  count: selectedRowCount,
                  total: filteredRowCount,
                })}`
              : filteredRowCount > 0
                ? pageSummary
                : locale.noResults}
          </div>
          {filteredRowCount > 0 && (
            <div className="text-sm text-muted-foreground tabular-nums">
              {filteredRowCount} / {data.length}
            </div>
          )}
        </div>
        <GridPagination table={table} />
      </div>
    </div>
  )
}

export { DataTable, type DataTableProps }
