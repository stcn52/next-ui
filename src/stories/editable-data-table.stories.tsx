import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import {
  EditableDataTable,
  createEditableColumn,
} from "@/components/ui/editable-data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"

type Employee = {
  id: number
  name: string
  department: string
  email: string
  salary: string
}

const initialData: Employee[] = [
  { id: 1, name: "Alice Chen", department: "Engineering", email: "alice@co.com", salary: "120,000" },
  { id: 2, name: "Bob Wang", department: "Design", email: "bob@co.com", salary: "95,000" },
  { id: 3, name: "Carol Li", department: "Product", email: "carol@co.com", salary: "110,000" },
  { id: 4, name: "Dave Zhang", department: "Engineering", email: "dave@co.com", salary: "105,000" },
  { id: 5, name: "Eve Liu", department: "Marketing", email: "eve@co.com", salary: "88,000" },
  { id: 6, name: "Frank Wu", department: "Engineering", email: "frank@co.com", salary: "130,000" },
  { id: 7, name: "Grace Xu", department: "Design", email: "grace@co.com", salary: "92,000" },
  { id: 8, name: "Henry Sun", department: "Product", email: "henry@co.com", salary: "115,000" },
]

const columns: ColumnDef<Employee, string>[] = [
  { accessorKey: "id", header: "ID", cell: ({ row }) => row.getValue("id") },
  createEditableColumn<Employee>("name", "Name"),
  createEditableColumn<Employee>("department", "Department"),
  createEditableColumn<Employee>("email", "Email"),
  createEditableColumn<Employee>("salary", "Salary"),
]

const meta: Meta = {
  title: "UI/EditableDataTable",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const [data, setData] = useState(initialData)
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Click any cell to edit. Press Enter to save, Escape to cancel.
        </p>
        <EditableDataTable
          columns={columns}
          data={data}
          onDataChange={setData}
          filterColumn="name"
          filterPlaceholder="Filter by name..."
        />
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">
            Raw data (JSON)
          </summary>
          <pre className="mt-2 rounded bg-muted p-2 overflow-auto max-h-48">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("table")).toBeInTheDocument()
    // Click on a cell to enter edit mode
    const nameCell = canvas.getByText("Alice Chen")
    await userEvent.click(nameCell)
    // An input should appear
    const input = canvas.getByDisplayValue("Alice Chen")
    await expect(input).toBeInTheDocument()
    // Type a new value and press Enter
    await userEvent.clear(input)
    await userEvent.type(input, "Alice C.{Enter}")
    // The cell should now show the new value
    await expect(canvas.getByText("Alice C.")).toBeInTheDocument()
  },
}
