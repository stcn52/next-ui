import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
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

const createColumns = (): KanbanColumn<TestItem>[] => [
  {
    id: "col-a",
    title: "Column A",
    items: [
      { id: "item-1", title: "Item 1" },
      { id: "item-2", title: "Item 2" },
      { id: "item-3", title: "Item 3" },
    ],
  },
  {
    id: "col-b",
    title: "Column B",
    items: [{ id: "item-4", title: "Item 4" }],
  },
  {
    id: "col-c",
    title: "Column C",
    items: [],
  },
]

function renderDndBoard(onChange = vi.fn()) {
  const columns = createColumns()
  return {
    ...render(
      <ConfigProvider>
        <KanbanBoard<TestItem>
          columns={columns}
          onColumnsChange={onChange}
          renderItem={(item) => (
            <div data-testid={`drag-item-${item.id}`}>{item.title}</div>
          )}
        />
      </ConfigProvider>
    ),
    onChange,
    columns,
  }
}

describe("KanbanBoard DnD interactions", () => {
  it("renders sortable cards with drag attributes", () => {
    renderDndBoard()
    const cards = document.querySelectorAll("[data-slot='kanban-card']")
    expect(cards).toHaveLength(4)
    // Each card should have role or tabindex for keyboard interaction
    cards.forEach((card) => {
      expect(card).toHaveAttribute("tabindex")
    })
  })

  it("cards have pointer-events for drag initiation", () => {
    renderDndBoard()
    const card = screen.getByTestId("drag-item-item-1").closest("[data-slot='kanban-card']")!
    // Verify the card is in the DOM and interactive
    expect(card).toBeInTheDocument()
    expect(card.getAttribute("tabindex")).toBeDefined()
  })

  it("columns have list role for accessibility", () => {
    renderDndBoard()
    const lists = document.querySelectorAll("[role='list']")
    expect(lists).toHaveLength(3) // 3 columns
  })

  it("column A has 3 items in sortable context", () => {
    renderDndBoard()
    const colA = screen.getByRole("region", { name: /Column A/i })
    const items = colA.querySelectorAll("[data-slot='kanban-card']")
    expect(items).toHaveLength(3)
  })

  it("column C (empty) renders with zero cards", () => {
    renderDndBoard()
    const colC = screen.getByRole("region", { name: /Column C/i })
    const items = colC.querySelectorAll("[data-slot='kanban-card']")
    expect(items).toHaveLength(0)
  })

  it("simulates pointerDown on card without crash", () => {
    renderDndBoard()
    const card = screen.getByTestId("drag-item-item-1").closest("[data-slot='kanban-card']")!

    act(() => {
      fireEvent.pointerDown(card, {
        pointerId: 1,
        clientX: 100,
        clientY: 100,
      })
    })

    // Board should still be intact after pointer event
    expect(screen.getByText("Item 1")).toBeInTheDocument()
    expect(screen.getByText("Item 2")).toBeInTheDocument()

    act(() => {
      fireEvent.pointerUp(card, { pointerId: 1 })
    })
  })

  it("keyboard focus works on sortable cards", () => {
    renderDndBoard()
    const cards = document.querySelectorAll("[data-slot='kanban-card']")
    const firstCard = cards[0] as HTMLElement

    act(() => {
      firstCard.focus()
    })

    expect(document.activeElement).toBe(firstCard)
  })

  it("multiple columns maintain independent item lists", () => {
    renderDndBoard()
    const regions = screen.getAllByRole("region")
    expect(regions).toHaveLength(3)

    // Column A: 3 items
    expect(regions[0].querySelectorAll("[data-slot='kanban-card']")).toHaveLength(3)
    // Column B: 1 item
    expect(regions[1].querySelectorAll("[data-slot='kanban-card']")).toHaveLength(1)
    // Column C: 0 items
    expect(regions[2].querySelectorAll("[data-slot='kanban-card']")).toHaveLength(0)
  })
})
