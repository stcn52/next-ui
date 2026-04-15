import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const data: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@yahoo.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "abe45@gmail.com" },
  { id: "derv1ws0", amount: 837, status: "processing", email: "monserrat44@gmail.com" },
  { id: "5kma53ae", amount: 874, status: "success", email: "silas22@gmail.com" },
  { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@hotmail.com" },
  { id: "p0r3v9x2", amount: 150, status: "pending", email: "alex@example.com" },
  { id: "q7w8e9r0", amount: 430, status: "success", email: "jordan@outlook.com" },
  { id: "t1y2u3i4", amount: 560, status: "processing", email: "taylor@email.com" },
  { id: "o5p6a7s8", amount: 290, status: "failed", email: "pat@webmail.com" },
  { id: "d9f0g1h2", amount: 680, status: "pending", email: "sam@domain.com" },
  { id: "j3k4l5m6", amount: 195, status: "success", email: "casey@tech.io" },
  { id: "n7o8p9q0", amount: 410, status: "processing", email: "drew@corp.com" },
]

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  processing: "secondary",
  pending: "outline",
  failed: "destructive",
}

const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={statusVariant[status] ?? "default"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-end"
      >
        Amount
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]

const simpleColumns: ColumnDef<Payment>[] = [
  { accessorKey: "email", header: "Email" },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `$${row.getValue("amount")}`,
  },
]

const meta: Meta = {
  title: "UI/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  argTypes: {
    columns: {
      control: false,
      description: "Column definitions powered by @tanstack/react-table.",
    },
    data: {
      control: false,
      description: "Row data array.",
    },
    filterColumn: {
      control: "text",
      description: "Column id/key used for filter input.",
    },
    filterPlaceholder: {
      control: "text",
      description: "Placeholder text for filter input.",
    },
    pageSize: {
      control: { type: "number", min: 1, max: 100, step: 1 },
      description: "Initial rows per page.",
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <DataTable
      columns={simpleColumns}
      data={data}
      filterColumn="email"
      filterPlaceholder="Filter emails..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("table")).toBeInTheDocument()
    const filter = canvas.getByPlaceholderText("Filter emails...")
    await expect(filter).toBeInTheDocument()
    // Type a filter value to narrow results
    await userEvent.type(filter, "ken")
    await expect(canvas.getByText("ken99@yahoo.com")).toBeInTheDocument()
    // Clear filter
    await userEvent.clear(filter)
  },
}

export const WithSortingAndSelection: Story = {
  name: "Sorting + Selection + Badge",
  render: () => (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="email"
      filterPlaceholder="Filter emails..."
      pageSize={5}
    />
  ),
}

export const Empty: Story = {
  render: () => (
    <DataTable columns={simpleColumns} data={[]} />
  ),
}
