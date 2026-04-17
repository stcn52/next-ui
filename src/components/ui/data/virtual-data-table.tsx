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
} from "@/components/ui/display/table"
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

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0
  const paddingBottom =
    virtualItems.length > 0 ? totalSize - virtualItems[virtualItems.length - 1].end : 0

  return (
    <div
      ref={parentRef}
      data-slot="virtual-data-table"
      role="region"
      aria-label="Scrollable data table"
      className={className ?? "h-[500px] overflow-auto rounded-md border"}
      style={{ willChange: "scroll-position" }}
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
              {/* Top spacer — fills the height of rows above the visible window */}
              {paddingTop > 0 && (
                <TableRow aria-hidden>
                  <TableCell
                    colSpan={columns.length}
                    style={{ height: paddingTop, padding: 0, border: "none" }}
                  />
                </TableRow>
              )}
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
              {/* Bottom spacer — fills the height of rows below the visible window */}
              {paddingBottom > 0 && (
                <TableRow aria-hidden>
                  <TableCell
                    colSpan={columns.length}
                    style={{ height: paddingBottom, padding: 0, border: "none" }}
                  />
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export { VirtualDataTable, type VirtualDataTableProps }
