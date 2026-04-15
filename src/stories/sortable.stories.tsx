import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { SortableList, useSortableList } from "@/components/ui/sortable"
import { Badge } from "@/components/ui/badge"

const meta: Meta = {
  title: "UI/Sortable",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

type Task = { id: number; title: string; status: string }

const initialTasks: Task[] = [
  { id: 1, title: "Design system architecture", status: "done" },
  { id: 2, title: "Implement DataTable component", status: "in-progress" },
  { id: 3, title: "Add virtual scrolling", status: "in-progress" },
  { id: 4, title: "Write Storybook stories", status: "todo" },
  { id: 5, title: "Set up CI/CD pipeline", status: "todo" },
  { id: 6, title: "Performance optimization", status: "todo" },
]

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  done: "default",
  "in-progress": "secondary",
  todo: "outline",
}

function SortableListDemo() {
  const { items, onReorder } = useSortableList(initialTasks)

  return (
    <SortableList
      items={items}
      onReorder={onReorder}
      className="flex flex-col gap-2 max-w-md"
      renderItem={(item, dragHandle) => (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
          {dragHandle}
          <span className="flex-1 text-sm font-medium">{item.title}</span>
          <Badge variant={statusColors[item.status] ?? "outline"}>
            {item.status}
          </Badge>
        </div>
      )}
    />
  )
}

export const Default: Story = {
  render: () => <SortableListDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Design system architecture")).toBeInTheDocument()
  },
}

type KanbanItem = { id: number; title: string }

const initialTodo: KanbanItem[] = [
  { id: 1, title: "Research competitors" },
  { id: 2, title: "Draft wireframes" },
  { id: 3, title: "User interviews" },
]

const initialDoing: KanbanItem[] = [
  { id: 4, title: "Build prototype" },
  { id: 5, title: "Design tokens" },
]

const initialDone: KanbanItem[] = [
  { id: 6, title: "Project kickoff" },
]

function KanbanDemo() {
  const todo = useSortableList(initialTodo)
  const doing = useSortableList(initialDoing)
  const done = useSortableList(initialDone)

  const columns = [
    { title: "To Do", ...todo },
    { title: "In Progress", ...doing },
    { title: "Done", ...done },
  ]

  return (
    <div className="flex gap-4">
      {columns.map((col) => (
        <div
          key={col.title}
          className="flex w-64 flex-col gap-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <Badge variant="outline">{col.items.length}</Badge>
          </div>
          <SortableList
            items={col.items}
            onReorder={col.onReorder}
            className="flex flex-col gap-2"
            renderItem={(item, dragHandle) => (
              <div className="flex items-center gap-2 rounded-md border bg-card p-2.5 shadow-sm">
                {dragHandle}
                <span className="text-sm">{item.title}</span>
              </div>
            )}
          />
        </div>
      ))}
    </div>
  )
}

export const Kanban: Story = {
  name: "Kanban Board",
  render: () => <KanbanDemo />,
}
