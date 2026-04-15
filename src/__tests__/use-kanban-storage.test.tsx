import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useKanbanStorage } from "@/components/ui/use-kanban-storage"
import type { KanbanColumn, KanbanItem } from "@/components/ui/kanban"

interface TestItem extends KanbanItem {
  id: string
  title: string
}

const INITIAL: KanbanColumn<TestItem>[] = [
  { id: "col-1", title: "Col 1", items: [{ id: "a", title: "A" }] },
  { id: "col-2", title: "Col 2", items: [] },
]

function TestHarness({ storageKey = "test-kanban" }: { storageKey?: string }) {
  const { columns, setColumns, resetColumns } = useKanbanStorage<TestItem>(
    storageKey,
    INITIAL,
  )
  return (
    <div>
      {columns.map((col) => (
        <div key={col.id} data-testid={`col-${col.id}`}>
          <span>{col.title}: {col.items.length}</span>
        </div>
      ))}
      <button
        onClick={() =>
          setColumns([
            ...columns,
            { id: "col-3", title: "Col 3", items: [{ id: "b", title: "B" }] },
          ])
        }
      >
        Add
      </button>
      <button onClick={resetColumns}>Reset</button>
    </div>
  )
}

describe("useKanbanStorage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("initializes with default columns", () => {
    render(<TestHarness />)
    expect(screen.getByTestId("col-col-1")).toHaveTextContent("Col 1: 1")
    expect(screen.getByTestId("col-col-2")).toHaveTextContent("Col 2: 0")
  })

  it("persists to localStorage on change", async () => {
    const user = userEvent.setup()
    render(<TestHarness storageKey="persist-test" />)

    await user.click(screen.getByText("Add"))
    expect(screen.getByTestId("col-col-3")).toHaveTextContent("Col 3: 1")

    const saved = JSON.parse(localStorage.getItem("persist-test")!)
    expect(saved).toHaveLength(3)
    expect(saved[2].id).toBe("col-3")
  })

  it("restores from localStorage on mount", () => {
    const saved: KanbanColumn<TestItem>[] = [
      { id: "saved-1", title: "Saved", items: [{ id: "x", title: "X" }] },
    ]
    localStorage.setItem("restore-test", JSON.stringify(saved))

    render(<TestHarness storageKey="restore-test" />)
    expect(screen.getByTestId("col-saved-1")).toHaveTextContent("Saved: 1")
  })

  it("falls back to initial when localStorage is corrupted", () => {
    localStorage.setItem("corrupt-test", "not-json")
    render(<TestHarness storageKey="corrupt-test" />)
    expect(screen.getByTestId("col-col-1")).toHaveTextContent("Col 1: 1")
  })

  it("resets to initial columns", async () => {
    const user = userEvent.setup()
    render(<TestHarness storageKey="reset-test" />)

    await user.click(screen.getByText("Add"))
    expect(screen.getByTestId("col-col-3")).toBeInTheDocument()

    await user.click(screen.getByText("Reset"))
    expect(screen.queryByTestId("col-col-3")).not.toBeInTheDocument()
    expect(screen.getByTestId("col-col-1")).toHaveTextContent("Col 1: 1")
  })
})
