import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ConfigProvider } from "@/components/config-provider"
import {
  KanbanBoard,
  type KanbanColumn,
  type KanbanItem,
} from "@/components/ui/kanban"

interface TestItem extends KanbanItem {
  id: string
  title: string
}

const MOCK_COLUMNS: KanbanColumn<TestItem>[] = [
  {
    id: "todo",
    title: "Todo",
    items: [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
    ],
  },
  {
    id: "done",
    title: "Done",
    items: [{ id: "3", title: "Task 3" }],
  },
]

function renderBoard(
  columns = MOCK_COLUMNS,
  onChange = vi.fn(),
) {
  return render(
    <ConfigProvider>
      <KanbanBoard<TestItem>
        columns={columns}
        onColumnsChange={onChange}
        renderItem={(item) => (
          <div data-testid={`item-${item.id}`}>{item.title}</div>
        )}
      />
    </ConfigProvider>
  )
}

describe("KanbanBoard", () => {
  it("renders all columns with titles", () => {
    renderBoard()
    expect(screen.getByText("Todo")).toBeInTheDocument()
    expect(screen.getByText("Done")).toBeInTheDocument()
  })

  it("renders all items via renderItem", () => {
    renderBoard()
    expect(screen.getByTestId("item-1")).toHaveTextContent("Task 1")
    expect(screen.getByTestId("item-2")).toHaveTextContent("Task 2")
    expect(screen.getByTestId("item-3")).toHaveTextContent("Task 3")
  })

  it("renders item counts per column", () => {
    renderBoard()
    // Default header shows count
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("renders custom column header via renderColumnHeader", () => {
    render(
      <ConfigProvider>
        <KanbanBoard<TestItem>
          columns={MOCK_COLUMNS}
          onColumnsChange={vi.fn()}
          renderItem={(item) => <div>{item.title}</div>}
          renderColumnHeader={(col) => (
            <div data-testid={`header-${col.id}`}>
              Custom: {col.title} ({col.items.length})
            </div>
          )}
        />
      </ConfigProvider>
    )

    expect(screen.getByTestId("header-todo")).toHaveTextContent("Custom: Todo (2)")
    expect(screen.getByTestId("header-done")).toHaveTextContent("Custom: Done (1)")
  })

  it("renders empty columns gracefully", () => {
    const emptyColumns: KanbanColumn<TestItem>[] = [
      { id: "empty", title: "Empty", items: [] },
    ]
    renderBoard(emptyColumns)
    expect(screen.getByText("Empty")).toBeInTheDocument()
    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("has proper ARIA labels for columns", () => {
    renderBoard()
    const todoColumn = screen.getByRole("region", { name: /Todo column/i })
    expect(todoColumn).toBeInTheDocument()
  })

  it("cards have kanban-card data-slot", () => {
    renderBoard()
    const cards = document.querySelectorAll("[data-slot='kanban-card']")
    expect(cards).toHaveLength(3)
  })
})
