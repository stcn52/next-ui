/**
 * DataGrid Stories — 数据表模式 + 电子表格模式
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataGrid } from "@/components/ui/data-grid"
import { Badge } from "@/components/ui/badge"

const meta: Meta<typeof DataGrid> = {
  title: "Components/DataGrid",
  component: DataGrid,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof DataGrid>

// ─── Sample data ──────────────────────────────────────────────────────────────

interface Employee {
  id: number
  name: string
  department: string
  role: string
  salary: number
  status: "active" | "inactive" | "onleave"
}

const STATUS_MAP = {
  active: { label: "在职", variant: "default" as const },
  inactive: { label: "离职", variant: "secondary" as const },
  onleave: { label: "休假", variant: "outline" as const },
}

const EMPLOYEES: Employee[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: ["陈宇", "李薇", "张文", "王磊", "刘芳", "赵阳", "黄静", "周涛"][i % 8],
  department: ["工程", "产品", "设计", "市场", "运营"][i % 5],
  role: ["高级工程师", "产品经理", "UI设计师", "市场专员", "运营主管"][i % 5],
  salary: 15000 + (i % 10) * 3000,
  status: (["active", "inactive", "onleave"] as const)[i % 3],
}))

const EMPLOYEE_COLUMNS: ColumnDef<Employee>[] = [
  { accessorKey: "id", header: "ID", size: 60 },
  { accessorKey: "name", header: "姓名", size: 100 },
  { accessorKey: "department", header: "部门", size: 100 },
  { accessorKey: "role", header: "职位", size: 140 },
  {
    accessorKey: "salary",
    header: "薪资",
    size: 100,
    cell: ({ getValue }) => `¥${(getValue() as number).toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "状态",
    size: 80,
    cell: ({ getValue }) => {
      const s = getValue() as Employee["status"]
      const { label, variant } = STATUS_MAP[s]
      return <Badge variant={variant} className="text-xs">{label}</Badge>
    },
  },
]

// ─── Stories ──────────────────────────────────────────────────────────────────

/** 基础数据表 */
export const Default: Story = {
  render: () => (
    <DataGrid
      columns={EMPLOYEE_COLUMNS}
      data={EMPLOYEES}
      filterColumn="name"
      filterPlaceholder="搜索姓名…"
      pageSize={10}
    />
  ),
}

/** 启用排序 + 列固定 + 列调宽 + 行选择 */
export const FullFeatures: Story = {
  render: () => (
    <DataGrid
      columns={EMPLOYEE_COLUMNS}
      data={EMPLOYEES}
      filterColumn="department"
      enableSorting
      enablePinning
      enableResizing
      enableRowSelection
      pageSize={8}
    />
  ),
}

/** 电子表格模式 — 公式栏 + 行号 + 单元格编辑 */
export const SpreadsheetMode: Story = {
  render: () => {
    function SpreadsheetDemo() {
      const cols: ColumnDef<Record<string, string>>[] = [
        { id: "name", header: "姓名", accessorKey: "name" },
        { id: "department", header: "部门", accessorKey: "department" },
        { id: "role", header: "职位", accessorKey: "role" },
        { id: "salary", header: "薪资", accessorKey: "salary" },
      ]
      const [rows, setRows] = useState(
        EMPLOYEES.slice(0, 15).map((e) => ({
          name: e.name,
          department: e.department,
          role: e.role,
          salary: String(e.salary),
        })),
      )

      return (
        <DataGrid
          columns={cols}
          data={rows}
          spreadsheet
          enablePagination={false}
          enableColumnVisibility={false}
          height="420px"
          onCellEdit={(ri, colId, value) =>
            setRows((prev) => prev.map((r, i) => (i === ri ? { ...r, [colId]: value } : r)))
          }
        />
      )
    }
    return <SpreadsheetDemo />
  },
}

/** 大数据集（50行，分页） */
export const LargeDataset: Story = {
  render: () => (
    <DataGrid
      columns={EMPLOYEE_COLUMNS}
      data={EMPLOYEES}
      filterColumn="name"
      enableSorting
      enableRowSelection
      pageSize={20}
    />
  ),
}

/** 无分页（固定高度 + 滚动） */
export const NoPagination: Story = {
  render: () => (
    <DataGrid
      columns={EMPLOYEE_COLUMNS}
      data={EMPLOYEES.slice(0, 20)}
      enablePagination={false}
      height="360px"
    />
  ),
}

/** 虚拟滚动 — 5000 行仅渲染可视区域 */
export const Virtualized: Story = {
  render: () => {
    const bigData: Employee[] = Array.from({ length: 5000 }, (_, i) => ({
      id: i + 1,
      name: ["陈宇", "李薇", "张文", "王磊", "刘芳", "赵阳", "黄静", "周涛"][i % 8],
      department: ["工程", "产品", "设计", "市场", "运营"][i % 5],
      role: ["高级工程师", "产品经理", "UI设计师", "市场专员", "运营主管"][i % 5],
      salary: 15000 + (i % 10) * 3000,
      status: (["active", "inactive", "onleave"] as const)[i % 3],
    }))
    return (
      <DataGrid
        columns={EMPLOYEE_COLUMNS}
        data={bigData}
        virtualized
        enablePagination={false}
        height="480px"
        filterColumn="name"
        filterPlaceholder="搜索姓名…"
        enableSorting
      />
    )
  },
}
