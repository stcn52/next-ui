import { useMemo } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import type { ColumnDef } from "@tanstack/react-table"
import { VirtualDataTable } from "@/components/ui/virtual-data-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

type Row = {
  id: number
  name: string
  email: string
  department: string
  salary: number
}

function makeData(count: number): Row[] {
  const departments = ["Engineering", "Design", "Marketing", "Sales", "Support", "HR", "Finance"]
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]

  return Array.from({ length: count }, (_, i) => {
    const first = firstNames[i % firstNames.length]
    const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
    return {
      id: i + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      department: departments[i % departments.length],
      salary: 50000 + Math.floor(Math.random() * 100000),
    }
  })
}

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Department
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-end"
      >
        Salary
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("salary") as number
      return (
        <div className="text-right font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(amount)}
        </div>
      )
    },
  },
]

const meta: Meta = {
  title: "UI/VirtualDataTable",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const TenThousandRows: Story = {
  name: "10,000 Rows",
  render: () => {
    const data = useMemo(() => makeData(10_000), [])
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          {data.length.toLocaleString()} rows with virtual scrolling — only visible rows are rendered in the DOM.
        </p>
        <VirtualDataTable columns={columns} data={data} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("table")).toBeInTheDocument()
    // Click a column header to sort
    const nameHeader = canvas.getByText("Name")
    await userEvent.click(nameHeader)
  },
}

export const HundredThousandRows: Story = {
  name: "100,000 Rows",
  render: () => {
    const data = useMemo(() => makeData(100_000), [])
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          {data.length.toLocaleString()} rows — still smooth with virtual scrolling.
        </p>
        <VirtualDataTable columns={columns} data={data} />
      </div>
    )
  },
}
