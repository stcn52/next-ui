"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
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
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocale } from "@/components/config-provider"

// ---------------------------------------------------------------------------
// Editable cell – click to edit, blur/Enter to commit, Escape to cancel
// ---------------------------------------------------------------------------

interface EditableCellProps {
  value: string
  onSave: (value: string) => void
}

function EditableCell({ value, onSave }: EditableCellProps) {
  const locale = useLocale()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commit = useCallback(() => {
    setEditing(false)
    if (draft !== value) onSave(draft)
  }, [draft, value, onSave])

  const cancel = useCallback(() => {
    setEditing(false)
    setDraft(value)
  }, [value])

  if (!editing) {
    return (
      <span
        className="block w-full cursor-pointer rounded px-2 py-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        onClick={() => setEditing(true)}
        role="button"
        tabIndex={0}
        aria-label={`${locale.clickToEdit}: ${value || 'empty'}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setEditing(true)
          }
        }}
      >
        {value || <span className="text-muted-foreground italic">empty</span>}
      </span>
    )
  }

  return (
    <Input
      ref={inputRef}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit()
        if (e.key === "Escape") cancel()
      }}
      className="h-8"
    />
  )
}

// ---------------------------------------------------------------------------
// createEditableColumn – helper to make a column editable
// ---------------------------------------------------------------------------

function createEditableColumn<TData extends Record<string, unknown>>(
  accessorKey: string & keyof TData,
  header: string,
  options?: Partial<ColumnDef<TData, string>>
): ColumnDef<TData, string> {
  return {
    accessorKey,
    header,
    cell: ({ row, table }) => {
      const onSave = (val: string) => {
        ;(table.options.meta as EditableTableMeta<TData>)?.updateData(
          row.index,
          accessorKey,
          val
        )
      }
      return (
        <EditableCell
          value={String(row.getValue(accessorKey) ?? "")}
          onSave={onSave}
        />
      )
    },
    ...options,
  } as ColumnDef<TData, string>
}

// ---------------------------------------------------------------------------
// Table meta type for carrying the updateData callback
// ---------------------------------------------------------------------------

interface EditableTableMeta<TData> {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
  getData?: () => TData[]
}

// ---------------------------------------------------------------------------
// EditableDataTable
// ---------------------------------------------------------------------------

interface EditableDataTableProps<TData extends Record<string, unknown>> {
  columns: ColumnDef<TData, string>[]
  data: TData[]
  onDataChange?: (data: TData[]) => void
  filterColumn?: string
  filterPlaceholder?: string
  pageSize?: number
}

function EditableDataTable<TData extends Record<string, unknown>>({
  columns,
  data: initialData,
  onDataChange,
  filterColumn,
  filterPlaceholder,
  pageSize = 10,
}: EditableDataTableProps<TData>) {
  const locale = useLocale()
  const [data, setData] = useState(initialData)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const updateData = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      setData((prev) => {
        const next = prev.map((row, idx) =>
          idx === rowIndex ? { ...row, [columnId]: value } : row
        )
        onDataChange?.(next)
        return next
      })
    },
    [onDataChange]
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
    state: { sorting, columnFilters },
    initialState: { pagination: { pageSize } },
    meta: { updateData, getData: () => data } satisfies EditableTableMeta<TData>,
  })

  return (
    <div data-slot="editable-data-table" className="flex flex-col gap-3">
      {filterColumn && (
        <div className="flex items-center">
          <Input
            placeholder={filterPlaceholder ?? locale.filter}
            aria-label={`Filter by ${filterColumn}`}
            value={
              (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn(filterColumn)?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
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
                  className="h-16 text-center"
                >
                  {locale.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-2">
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
  )
}

export {
  EditableDataTable,
  EditableCell,
  createEditableColumn,
  type EditableDataTableProps,
  type EditableCellProps,
  type EditableTableMeta,
}
