import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import type { ColumnDef } from "@tanstack/react-table"
import { UrlDataTable } from "@/components/ui/url-data-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

type User = {
  id: number
  name: string
  email: string
  role: string
  status: "active" | "inactive"
}

const data: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Editor", "Viewer"][i % 3],
  status: i % 5 === 0 ? "inactive" as const : "active" as const,
}))

const columns: ColumnDef<User>[] = [
  { accessorKey: "id", header: "ID", size: 60 },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown />
      </Button>
    ),
  },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "status", header: "Status" },
]

const meta: Meta = {
  title: "UI/UrlDataTable",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Sort, filter, and paginate — state is synced to URL query parameters.
        Check the address bar as you interact.
      </p>
      <UrlDataTable
        columns={columns}
        data={data}
        filterColumn="name"
        filterPlaceholder="Filter by name..."
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("table")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("Filter by name...")).toBeInTheDocument()
  },
}
