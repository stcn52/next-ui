import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { KanbanBoard, type KanbanColumn, type KanbanItem } from "@/components/ui/kanban"
import { Badge } from "@/components/ui/badge"

const meta: Meta = {
  title: "Patterns/Kanban Board",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

interface Task extends KanbanItem {
  id: number
  title: string
  priority: "low" | "medium" | "high"
  assignee: string
}

const priorityColors: Record<string, "default" | "secondary" | "destructive"> = {
  high: "destructive",
  medium: "default",
  low: "secondary",
}

const initialColumns: KanbanColumn<Task>[] = [
  {
    id: "backlog",
    title: "Backlog",
    items: [
      { id: 1, title: "User authentication flow", priority: "high", assignee: "Alice" },
      { id: 2, title: "API rate limiting", priority: "medium", assignee: "Bob" },
      { id: 3, title: "Dark mode polish", priority: "low", assignee: "Carol" },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    items: [
      { id: 4, title: "Database migration scripts", priority: "high", assignee: "Dave" },
      { id: 5, title: "Error boundary component", priority: "medium", assignee: "Eve" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    items: [
      { id: 6, title: "DataTable virtual scrolling", priority: "high", assignee: "Alice" },
      { id: 7, title: "Theme customizer UI", priority: "medium", assignee: "Carol" },
    ],
  },
  {
    id: "done",
    title: "Done",
    items: [
      { id: 8, title: "Project setup & CI", priority: "medium", assignee: "Bob" },
      { id: 9, title: "Component library init", priority: "high", assignee: "Dave" },
    ],
  },
]

function KanbanDemo() {
  const [columns, setColumns] = useState(initialColumns)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Drag cards between columns to move tasks. Drag within a column to reorder.
      </p>
      <KanbanBoard
        columns={columns}
        onColumnsChange={setColumns}
        renderColumnHeader={(col) => (
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <Badge variant="outline">{col.items.length}</Badge>
          </div>
        )}
        renderItem={(item) => (
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-sm font-medium">{item.title}</span>
            <div className="flex items-center justify-between">
              <Badge
                variant={priorityColors[item.priority]}
                className="text-[10px]"
              >
                {item.priority}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {item.assignee}
              </span>
            </div>
          </div>
        )}
        renderOverlay={(item) => (
          <div className="flex flex-col gap-1 rounded-md border bg-card p-2.5 shadow-lg w-[264px]">
            <span className="text-sm font-medium">{item.title}</span>
            <div className="flex items-center justify-between">
              <Badge
                variant={priorityColors[item.priority]}
                className="text-[10px]"
              >
                {item.priority}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {item.assignee}
              </span>
            </div>
          </div>
        )}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <KanbanDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Backlog")).toBeInTheDocument()
    await expect(canvas.getByText("In Progress")).toBeInTheDocument()
    await expect(canvas.getByText("Done")).toBeInTheDocument()
    await expect(canvas.getByText("User authentication flow")).toBeInTheDocument()
    // Verify drag handles are focusable
    const dragHandles = canvasElement.querySelectorAll('[aria-label="Drag to reorder"]')
    if (dragHandles.length > 0) {
      (dragHandles[0] as HTMLElement).focus()
      await expect(dragHandles[0]).toHaveFocus()
    }
  },
}
