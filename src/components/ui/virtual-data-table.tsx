"use client"

import { useRef, useState } from "react"
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useLocale } from "@/components/config-provider"

interface VirtualDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  estimateSize?: number
  className?: string
}

function VirtualDataTable<TData, TValue>({
  columns,
  data,
  estimateSize = 35,
  className,
}: VirtualDataTableProps<TData, TValue>) {
  const locale = useLocale()
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  })

  const { rows } = table.getRowModel()

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 20,
  })

  return (
    <div
      ref={parentRef}
      data-slot="virtual-data-table"
      role="region"
      aria-label="Scrollable data table"
      className={className ?? "h-[500px] overflow-auto rounded-md border"}
    >
      <Table aria-rowcount={rows.length} aria-colcount={columns.length}>
        <TableHeader className="sticky top-0 z-10 bg-background">
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
          {virtualizer.getVirtualItems().length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-16 text-center"
              >
                {locale.noResults}
              </TableCell>
            </TableRow>
          ) : (
            <>
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <TableRow
                    key={row.id}
                    data-index={virtualRow.index}
                    style={{
                      height: `${virtualRow.size}px`,
                    }}
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
                )
              })}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export { VirtualDataTable, type VirtualDataTableProps }
