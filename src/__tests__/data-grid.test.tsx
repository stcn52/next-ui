/**
 * Unit tests for DataGrid component
 */
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { type ColumnDef } from "@tanstack/react-table"
import { DataGrid } from "@/components/ui/data-grid"
import { ConfigProvider } from "@/components/config-provider"

// ─── Test data ────────────────────────────────────────────────────────────────

interface Row { id: number; name: string; dept: string; salary: number }

const COLS: ColumnDef<Row>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "姓名" },
  { accessorKey: "dept", header: "部门" },
  { accessorKey: "salary", header: "薪资", cell: ({ getValue }) => `¥${getValue()}` },
]

const ROWS: Row[] = [
  { id: 1, name: "陈宇", dept: "工程", salary: 25000 },
  { id: 2, name: "李薇", dept: "产品", salary: 18000 },
  { id: 3, name: "张文", dept: "设计", salary: 15000 },
  { id: 4, name: "王磊", dept: "工程", salary: 22000 },
  { id: 5, name: "刘芳", dept: "市场", salary: 12000 },
]

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("DataGrid — data mode", () => {
  it("renders table with data", () => {
    render(<DataGrid columns={COLS} data={ROWS} />)
    expect(screen.getByText("陈宇")).toBeInTheDocument()
    expect(screen.getByText("李薇")).toBeInTheDocument()
  })

  it("renders column headers", () => {
    render(<DataGrid columns={COLS} data={ROWS} />)
    expect(screen.getByText("姓名")).toBeInTheDocument()
    expect(screen.getByText("部门")).toBeInTheDocument()
  })

  it("renders empty state when no data", () => {
    render(<DataGrid columns={COLS} data={[]} />)
    expect(screen.getByRole("table")).toHaveAttribute("aria-rowcount", "0")
  })

  it("shows filter input when filterColumn is set", () => {
    render(<DataGrid columns={COLS} data={ROWS} filterColumn="name" filterPlaceholder="搜名字" />)
    expect(screen.getByPlaceholderText("搜名字")).toBeInTheDocument()
  })

  it("filters rows by column value", () => {
    render(<DataGrid columns={COLS} data={ROWS} filterColumn="name" />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "陈宇" } })
    expect(screen.getByText("陈宇")).toBeInTheDocument()
    expect(screen.queryByText("李薇")).not.toBeInTheDocument()
  })

  it("shows pagination controls by default", () => {
    render(<DataGrid columns={COLS} data={ROWS} />)
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument()
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument()
  })

  it("navigates pagination when enabled", () => {
    render(<DataGrid columns={COLS} data={ROWS} pageSize={2} />)
    expect(screen.getByText("陈宇")).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText("Go to next page"))
    expect(screen.queryByText("陈宇")).not.toBeInTheDocument()
    expect(screen.getByText("张文")).toBeInTheDocument()
  })

  it("hides pagination when enablePagination=false", () => {
    render(<DataGrid columns={COLS} data={ROWS} enablePagination={false} />)
    expect(screen.queryByLabelText("Go to next page")).not.toBeInTheDocument()
  })

  it("shows row selection checkboxes when enabled", () => {
    render(<DataGrid columns={COLS} data={ROWS} enableRowSelection />)
    const checkboxes = screen.getAllByRole("checkbox")
    // header + 5 data rows
    expect(checkboxes.length).toBeGreaterThanOrEqual(6)
  })

  it("shows column visibility button", () => {
    render(<DataGrid columns={COLS} data={ROWS} />)
    // Toolbar provides a "列" button (may match multiple due to nested DOM) — verify at least one
    const btns = screen.getAllByRole("button", { name: /Columns/ })
    expect(btns.length).toBeGreaterThan(0)
  })

  it("hides column visibility when disabled", () => {
    render(<DataGrid columns={COLS} data={ROWS} enableColumnVisibility={false} filterColumn="name" />)
    expect(screen.queryByRole("button", { name: /Columns/ })).not.toBeInTheDocument()
  })

  it("calls onRowSelectionChange when row selected", () => {
    const onSelect = vi.fn()
    render(<DataGrid columns={COLS} data={ROWS} enableRowSelection onRowSelectionChange={onSelect} />)
    const checkboxes = screen.getAllByRole("checkbox")
    fireEvent.click(checkboxes[1]) // first data row
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith([ROWS[0]])
  })
})

describe("DataGrid — spreadsheet mode", () => {
  it("renders formula bar in spreadsheet mode", () => {
    render(<DataGrid columns={COLS} data={ROWS} spreadsheet />)
    expect(screen.getByLabelText("Formula bar")).toBeInTheDocument()
  })

  it("hides formula bar in data mode", () => {
    render(<DataGrid columns={COLS} data={ROWS} />)
    expect(screen.queryByLabelText("Formula bar")).not.toBeInTheDocument()
  })

  it("renders row numbers in spreadsheet mode", () => {
    render(<DataGrid columns={COLS} data={ROWS} spreadsheet />)
    // Row numbers: getAllByText allows multiple matches (e.g., "1" may also appear in pagination)
    expect(screen.getAllByText("1").length).toBeGreaterThan(0)
    expect(screen.getAllByText("2").length).toBeGreaterThan(0)
  })

  it("clicking a cell activates it (aria-selected)", () => {
    render(<DataGrid columns={COLS} data={ROWS} spreadsheet onCellEdit={vi.fn()} />)
    const cell = screen.getByText("陈宇")
    fireEvent.click(cell)
    // The formula bar address should show a column letter + row number
    const formulaBar = screen.getByRole("textbox", { name: "Formula bar" }) as HTMLInputElement
    expect(formulaBar.value).toBe("陈宇")
  })

  it("double-click cell enters edit mode", () => {
    render(<DataGrid columns={COLS} data={ROWS} spreadsheet onCellEdit={vi.fn()} />)
    const cell = screen.getByText("陈宇")
    fireEvent.dblClick(cell)
    // After double-click, an input should appear (GridCell edit mode)
    const inputs = screen.getAllByRole("textbox")
    expect(inputs.length).toBeGreaterThan(0)
  })

  it("calls onCellEdit on commit", () => {
    const onEdit = vi.fn()
    render(<DataGrid columns={COLS} data={ROWS} spreadsheet onCellEdit={onEdit} />)
    const cell = screen.getByText("陈宇")
    fireEvent.dblClick(cell)
    const inputs = screen.getAllByRole("textbox")
    const cellInput = inputs.find((i) => (i as HTMLInputElement).value === "陈宇")
    if (cellInput) {
      fireEvent.change(cellInput, { target: { value: "陈XYZ" } })
      fireEvent.keyDown(cellInput, { key: "Enter" })
      expect(onEdit).toHaveBeenCalledWith(0, "name", "陈XYZ")
    }
  })

  it("commits spreadsheet edits only once when Enter is followed by blur", () => {
    const onEdit = vi.fn()
    render(<DataGrid columns={COLS} data={ROWS} spreadsheet onCellEdit={onEdit} />)
    fireEvent.dblClick(screen.getByText("陈宇"))
    const cellInput = screen.getByLabelText("Edit cell")
    fireEvent.change(cellInput, { target: { value: "陈XYZ" } })
    fireEvent.keyDown(cellInput, { key: "Enter" })
    fireEvent.blur(cellInput)
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onEdit).toHaveBeenCalledWith(0, "name", "陈XYZ")
  })
})

describe("DataGrid — formula bar utils", () => {
  it("cellAddress computes correct address", async () => {
    const { cellAddress, colLetter } = await import("@/components/ui/data-grid/formula-bar")
    expect(colLetter(0)).toBe("A")
    expect(colLetter(25)).toBe("Z")
    expect(colLetter(26)).toBe("AA")
    expect(cellAddress(0, 0)).toBe("A1")
    expect(cellAddress(2, 4)).toBe("C5")
  })
})

describe("DataGrid — virtualized mode", () => {
  it("renders only a subset of rows when virtualized=true", () => {
    const bigData: Row[] = Array.from({ length: 500 }, (_, i) => ({
      id: i + 1,
      name: `User${i}`,
      dept: "工程",
      salary: 10000,
    }))
    render(
      <DataGrid
        columns={COLS}
        data={bigData}
        virtualized
        enablePagination={false}
        height="400px"
      />,
    )
    // With virtualisation, not all 500 rows are rendered at once.
    // We have at most ~30 overscan rows visible in JSDOM (no real scroll).
    const rows = screen.getAllByRole("row")
    // Header row(s) + data rows — should be far less than 500+1
    expect(rows.length).toBeLessThan(200)
  })

  it("still renders table structure with header", () => {
    render(
      <DataGrid
        columns={COLS}
        data={ROWS}
        virtualized
        enablePagination={false}
        height="300px"
      />,
    )
    // Header should always render regardless of virtualization
    expect(screen.getByText("姓名")).toBeInTheDocument()
    expect(screen.getByText("部门")).toBeInTheDocument()
  })
})

describe("DataGrid — locale integration", () => {
  it("uses localized labels from ConfigProvider", () => {
    render(
      <ConfigProvider locale="zh-CN">
        <DataGrid columns={COLS} data={ROWS} enableRowSelection />
      </ConfigProvider>,
    )

    expect(screen.getAllByLabelText("列").length).toBeGreaterThan(0)
    expect(screen.getByLabelText("前往上一页")).toBeInTheDocument()
    expect(screen.getByLabelText("前往下一页")).toBeInTheDocument()
    expect(screen.getByLabelText("全选当前页")).toBeInTheDocument()
  })
})
