"use client"

/**
 * DataGrid — 融合 TanStack Table 数据表 + 电子表格（Spreadsheet）两种模式的统一组件
 *
 * 数据表模式（spreadsheet=false，默认）：
 *   - 排序 / 过滤 / 分页 / 列固定 / 列调宽 / 行选择
 *   - 与现有 data-table.tsx API 兼容，可无缝替换
 *
 * 电子表格模式（spreadsheet=true）：
 *   - 公式栏（FormulaBar）显示活跃单元格地址与可编辑内容
 *   - 行号列（1, 2, 3…），列头字母（A, B, C…）
 *   - 单击激活，双击 / F2 进入编辑，方向键导航
 *   - 参考 fortune-sheet 的交互范式
 *
 * Props：
 *   columns          ColumnDef[]     列定义
 *   data             TData[]         数据
 *   --- 功能标志 ---
 *   enableSorting    boolean         列排序（默认 true）
 *   enablePinning    boolean         列固定（默认 false）
 *   enableResizing   boolean         列调宽（默认 false）
 *   enableRowSelection boolean       行选择（默认 false）
 *   enablePagination boolean         分页（默认 true）
 *   pageSize         number          每页行数（默认 20）
 *   filterColumn     string          按列过滤（显示搜索框）
 *   --- 电子表格模式 ---
 *   spreadsheet      boolean         启用电子表格模式（默认 false）
 *   onCellEdit       fn              单元格编辑回调
 *   --- 布局 ---
 *   height           string          固定高度（如 "500px"）
 *   className        string
 */

import * as React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnSizingState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnHeader } from "./column-header"
import { Toolbar } from "./toolbar"
import { FormulaBar, cellAddress } from "./formula-bar"
import { GridCell } from "./cell"
import { GridPagination } from "./pagination"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataGridProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // Feature flags
  enableSorting?: boolean
  enablePinning?: boolean
  enableResizing?: boolean
  enableRowSelection?: boolean
  enablePagination?: boolean
  enableColumnVisibility?: boolean
  pageSize?: number
  filterColumn?: string
  filterPlaceholder?: string
  // Spreadsheet mode
  spreadsheet?: boolean
  onCellEdit?: (rowIndex: number, columnId: string, value: string) => void
  // Virtualized mode
  virtualized?: boolean
  estimateRowHeight?: number
  // Layout
  height?: string
  className?: string
  // Callbacks
  onRowSelectionChange?: (rows: TData[]) => void
}

// ─── Helper: row-number column def ───────────────────────────────────────────

function rowNumberColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "__row_num__",
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    enablePinning: false,
    size: 40,
    header: () => <div className="text-center text-[10px] text-muted-foreground">#</div>,
    cell: ({ row }) => (
      <div className="text-center text-xs text-muted-foreground tabular-nums select-none">
        {row.index + 1}
      </div>
    ),
  }
}

// ─── Helper: row-selection column def ────────────────────────────────────────

function selectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "__select__",
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 36,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || undefined}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="全选当前页"
        className="mx-auto block"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label={`选择第 ${row.index + 1} 行`}
        className="mx-auto block"
      />
    ),
  }
}

// ─── Active-cell state ────────────────────────────────────────────────────────

interface ActiveCell {
  ri: number   // row index in page
  ci: number   // visual column index (excl. row-num + select cols)
  colId: string
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DataGrid<TData, TValue = unknown>({
  columns: userColumns,
  data,
  enableSorting = true,
  enablePinning = false,
  enableResizing = false,
  enableRowSelection = false,
  enablePagination = true,
  enableColumnVisibility = true,
  pageSize: initialPageSize = 20,
  filterColumn,
  filterPlaceholder,
  spreadsheet = false,
  onCellEdit,
  virtualized = false,
  estimateRowHeight = 32,
  height,
  className,
  onRowSelectionChange,
}: DataGridProps<TData, TValue>) {
  // ── Table state ────────────────────────────────────────────────────────────
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({})
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})

  // ── Spreadsheet state ──────────────────────────────────────────────────────
  const [activeCell, setActiveCell] = React.useState<ActiveCell | null>(null)
  const [editingCell, setEditingCell] = React.useState<ActiveCell | null>(null)
  const [formulaDraft, setFormulaDraft] = React.useState("")

  // ── Build final column list ────────────────────────────────────────────────
  const columns = React.useMemo(() => {
    const cols: ColumnDef<TData, unknown>[] = []
    if (spreadsheet) cols.push(rowNumberColumn<TData>())
    if (enableRowSelection) cols.push(selectionColumn<TData>())
    cols.push(...(userColumns as ColumnDef<TData, unknown>[]))
    return cols
  }, [userColumns, spreadsheet, enableRowSelection])

  // ── Data columns (excl. __row_num__ / __select__) for CI calculation ───────
  const dataColIds = React.useMemo(
    () => userColumns.map((c) => (c as { id?: string; accessorKey?: string }).id ?? (c as { accessorKey?: string }).accessorKey ?? ""),
    [userColumns],
  )

  // ── TanStack Table instance ────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      setRowSelection((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater
        onRowSelectionChange?.(
          table.getRowModel().rows.filter((r) => next[r.id]).map((r) => r.original),
        )
        return next
      })
    },
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnPinning,
      columnSizing,
      ...(enablePagination ? { pagination: { pageIndex: 0, pageSize: initialPageSize } } : {}),
    },
    enableSorting,
    enableColumnResizing: enableResizing,
    enablePinning,
    enableRowSelection,
  })

  // ── Spreadsheet helpers ────────────────────────────────────────────────────

  const activateCell = React.useCallback((ri: number, colId: string) => {
    const ci = dataColIds.indexOf(colId)
    setActiveCell({ ri, ci, colId })
    setEditingCell(null)
    // Sync formula bar with row data
    const row = table.getRowModel().rows[ri]
    setFormulaDraft(row ? String((row.original as Record<string, unknown>)[colId] ?? "") : "")
  }, [dataColIds, table])

  const startEdit = React.useCallback((ri: number, colId: string) => {
    const ci = dataColIds.indexOf(colId)
    setEditingCell({ ri, ci, colId })
    setActiveCell({ ri, ci, colId })
  }, [dataColIds])

  const commitEdit = React.useCallback((ri: number, colId: string, value: string) => {
    onCellEdit?.(ri, colId, value)
    setEditingCell(null)
    setFormulaDraft(value)
  }, [onCellEdit])

  const cancelEdit = React.useCallback(() => {
    setEditingCell(null)
  }, [])

  // Arrow-key navigation in spreadsheet mode
  const handleKeyNav = React.useCallback((e: React.KeyboardEvent, ri: number, colId: string) => {
    if (!spreadsheet || editingCell) return
    const ci = dataColIds.indexOf(colId)
    const rowCount = table.getRowModel().rows.length
    const colCount = dataColIds.length
    if (e.key === "ArrowDown" && ri < rowCount - 1) activateCell(ri + 1, dataColIds[ci])
    if (e.key === "ArrowUp" && ri > 0) activateCell(ri - 1, dataColIds[ci])
    if (e.key === "ArrowRight" && ci < colCount - 1) activateCell(ri, dataColIds[ci + 1])
    if (e.key === "ArrowLeft" && ci > 0) activateCell(ri, dataColIds[ci - 1])
    if (e.key === "Tab") { e.preventDefault(); if (ci < colCount - 1) activateCell(ri, dataColIds[ci + 1]) }
  }, [spreadsheet, editingCell, dataColIds, table, activateCell])

  // ── Computed address string ────────────────────────────────────────────────
  const address = activeCell ? cellAddress(activeCell.ci, activeCell.ri) : ""

  // ── Sticky pinning style helper ───────────────────────────────────────────
  const getPinStyle = (col: ReturnType<typeof table.getAllLeafColumns>[0]): React.CSSProperties => {
    if (!enablePinning) return {}
    const pin = col.getIsPinned()
    if (!pin) return {}
    return {
      position: "sticky",
      left: pin === "left" ? col.getStart("left") : undefined,
      right: pin === "right" ? col.getAfter("right") : undefined,
      zIndex: 1,
      background: "hsl(var(--background))",
    }
  }

  // ── Virtualization ────────────────────────────────────────────────────────
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const allRows = table.getRowModel().rows

  const virtualizer = useVirtualizer({
    count: allRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 10,
    enabled: virtualized,
  })

  const virtualItems = virtualized ? virtualizer.getVirtualItems() : null
  const totalVirtualSize = virtualized ? virtualizer.getTotalSize() : 0

  // ── Render ─────────────────────────────────────────────────────────────────
  const rows = virtualized ? allRows : allRows

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {/* Toolbar */}
      {(filterColumn || enableColumnVisibility) && (
        <Toolbar
          table={table}
          filterColumn={filterColumn}
          filterPlaceholder={filterPlaceholder}
          enableColumnVisibility={enableColumnVisibility}
        />
      )}

      {/* Formula bar (spreadsheet mode only) */}
      {spreadsheet && (
        <FormulaBar
          address={address}
          value={formulaDraft}
          editing={editingCell !== null}
          onChange={setFormulaDraft}
          onCommit={() => editingCell && commitEdit(editingCell.ri, editingCell.colId, formulaDraft)}
          onCancel={cancelEdit}
        />
      )}

      {/* Table */}
      <div
        ref={scrollRef}
        className={cn("rounded-md border overflow-auto", height && "overflow-auto")}
        style={height ? { height } : undefined}
      >
        <Table
          style={enableResizing ? { width: table.getTotalSize() } : undefined}
          aria-rowcount={data.length}
          aria-colcount={userColumns.length}
        >
          <TableHeader className="sticky top-0 z-20 bg-background">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  const isSpecial = header.column.id === "__row_num__" || header.column.id === "__select__"
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: enableResizing ? header.getSize() : undefined,
                        ...getPinStyle(header.column),
                      }}
                      className={cn(
                        "h-9 py-0 px-2 border-r last:border-r-0",
                        header.column.id === "__row_num__" && "w-10",
                        header.column.id === "__select__" && "w-9",
                        spreadsheet && !isSpecial && "font-mono text-[10px] text-center tracking-widest",
                      )}
                    >
                      {header.isPlaceholder ? null : isSpecial ? (
                        flexRender(header.column.columnDef.header, header.getContext())
                      ) : (
                        <ColumnHeader
                          column={header.column}
                          title={flexRender(header.column.columnDef.header, header.getContext()) as string}
                          enablePinning={enablePinning}
                          enableResizing={enableResizing}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {allRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center text-sm text-muted-foreground"
                >
                  暂无数据
                </TableCell>
              </TableRow>
            ) : virtualized && virtualItems ? (
              // ── Virtualized body ─────────────────────────────────────────
              <>
                <tr style={{ height: virtualItems[0]?.start ?? 0 }} aria-hidden />
                {virtualItems.map((vItem) => {
                  const row = allRows[vItem.index]
                  const ri = vItem.index
                  return (
                    <TableRow
                      key={row.id}
                      data-index={vItem.index}
                      ref={virtualizer.measureElement}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      className={cn(row.getIsSelected() && "bg-primary/5")}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const colId = cell.column.id
                        const isSpecial = colId === "__row_num__" || colId === "__select__"
                        const isDataCol = !isSpecial
                        const isActive = activeCell?.ri === ri && activeCell?.colId === colId
                        const isEditing = editingCell?.ri === ri && editingCell?.colId === colId
                        const editable = spreadsheet && isDataCol && !!onCellEdit
                        return (
                          <TableCell
                            key={cell.id}
                            className="p-0 border-r last:border-r-0 h-8 max-h-8 overflow-hidden"
                            style={getPinStyle(cell.column)}
                          >
                            {isDataCol && spreadsheet ? (
                              <GridCell
                                value={(row.original as Record<string, unknown>)[colId]}
                                active={isActive}
                                editing={isEditing}
                                editable={editable}
                                rowSelected={row.getIsSelected()}
                                onActivate={() => activateCell(ri, colId)}
                                onStartEdit={() => startEdit(ri, colId)}
                                onCommit={(v) => commitEdit(ri, colId, v)}
                                onCancel={cancelEdit}
                                onKeyNav={(e) => handleKeyNav(e, ri, colId)}
                              />
                            ) : (
                              <div className={cn("px-2 py-1.5 text-sm", isSpecial && "flex justify-center")}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
                <tr style={{ height: totalVirtualSize - (virtualItems[virtualItems.length - 1]?.end ?? 0) }} aria-hidden />
              </>
            ) : (
              // ── Standard body ────────────────────────────────────────────
              rows.map((row, ri) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={cn(row.getIsSelected() && "bg-primary/5")}
                >
                  {row.getVisibleCells().map((cell) => {
                    const colId = cell.column.id
                    const isSpecial = colId === "__row_num__" || colId === "__select__"
                    const isDataCol = !isSpecial
                    const isActive = activeCell?.ri === ri && activeCell?.colId === colId
                    const isEditing = editingCell?.ri === ri && editingCell?.colId === colId
                    const editable = spreadsheet && isDataCol && !!onCellEdit

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn("p-0 border-r last:border-r-0 h-8 max-h-8 overflow-hidden")}
                        style={getPinStyle(cell.column)}
                      >
                        {isDataCol && spreadsheet ? (
                          <GridCell
                            value={(row.original as Record<string, unknown>)[colId]}
                            active={isActive}
                            editing={isEditing}
                            editable={editable}
                            rowSelected={row.getIsSelected()}
                            onActivate={() => activateCell(ri, colId)}
                            onStartEdit={() => startEdit(ri, colId)}
                            onCommit={(v) => commitEdit(ri, colId, v)}
                            onCancel={cancelEdit}
                            onKeyNav={(e) => handleKeyNav(e, ri, colId)}
                          />
                        ) : (
                          <div className={cn("px-2 py-1.5 text-sm", isSpecial && "flex justify-center")}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
          {/* ^^^ ternary: empty | virtual | standard */}
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && <GridPagination table={table} />}
    </div>
  )
}
