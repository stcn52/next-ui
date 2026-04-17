"use client"

import { useState, useEffect, useRef } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type PaginationState,
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
import { Input } from "@/components/ui/inputs/input"
import { useLocale } from "@/components/config-provider"

function parseUrlState() {
  const params = new URLSearchParams(window.location.search)
  const sorting: SortingState = []
  const sortParam = params.get("sort")
  if (sortParam) {
    sortParam.split(",").forEach((s) => {
      const desc = s.startsWith("-")
      sorting.push({ id: desc ? s.slice(1) : s, desc })
    })
  }

  const filters: ColumnFiltersState = []
  params.forEach((value, key) => {
    if (key.startsWith("f_")) {
      filters.push({ id: key.slice(2), value })
    }
  })

  const page = parseInt(params.get("page") ?? "0", 10)
  const pageSize = parseInt(params.get("pageSize") ?? "10", 10)

  return { sorting, filters, pagination: { pageIndex: page, pageSize } }
}

function serializeToUrl(
  sorting: SortingState,
  filters: ColumnFiltersState,
  pagination: PaginationState
) {
  const params = new URLSearchParams()

  if (sorting.length > 0) {
    params.set(
      "sort",
      sorting.map((s) => (s.desc ? `-${s.id}` : s.id)).join(",")
    )
  }

  filters.forEach((f) => {
    if (f.value) params.set(`f_${f.id}`, String(f.value))
  })

  if (pagination.pageIndex > 0) {
    params.set("page", String(pagination.pageIndex))
  }
  if (pagination.pageSize !== 10) {
    params.set("pageSize", String(pagination.pageSize))
  }

  const search = params.toString()
  const url = search
    ? `${window.location.pathname}?${search}`
    : window.location.pathname
  window.history.replaceState(null, "", url)
}

interface UrlDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
  filterPlaceholder?: string
  syncUrl?: boolean
}

function UrlDataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder,
  syncUrl = true,
}: UrlDataTableProps<TData, TValue>) {
  const locale = useLocale()
  const initialState = useRef(
    typeof window !== "undefined" && syncUrl
      ? parseUrlState()
      : { sorting: [], filters: [], pagination: { pageIndex: 0, pageSize: 10 } }
  )

  const [sorting, setSorting] = useState<SortingState>(initialState.current.sorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState.current.filters
  )
  const [pagination, setPagination] = useState<PaginationState>(
    initialState.current.pagination
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, pagination },
  })

  useEffect(() => {
    if (syncUrl) {
      serializeToUrl(sorting, columnFilters, pagination)
    }
  }, [sorting, columnFilters, pagination, syncUrl])

  return (
    <div data-slot="url-data-table" className="flex flex-col gap-4">
      {filterColumn && (
        <Input
          placeholder={filterPlaceholder ?? locale.filter}
          value={
            (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn(filterColumn)?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      )}
      <div className="rounded-md border">
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
                <TableRow key={row.id}>
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
                  className="h-24 text-center"
                >
                  {locale.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={locale.goToPreviousPage}
          >
            {locale.previous}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={locale.goToNextPage}
          >
            {locale.next}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { UrlDataTable, type UrlDataTableProps }
