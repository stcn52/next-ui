/**
 * Unit tests for FileTree component
 */
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { FileTree, type FileTreeItem } from "@/components/ui/file-tree"

const ITEMS: FileTreeItem[] = [
  {
    id: "src",
    name: "src",
    children: [
      { id: "app", name: "App.tsx" },
      {
        id: "components",
        name: "components",
        children: [{ id: "button", name: "button.tsx" }],
      },
    ],
  },
  { id: "readme", name: "README.md" },
]

describe("FileTree", () => {
  it("renders root items", () => {
    render(<FileTree items={ITEMS} />)
    expect(screen.getByText("src")).toBeInTheDocument()
    expect(screen.getByText("README.md")).toBeInTheDocument()
  })

  it("has tree role", () => {
    render(<FileTree items={ITEMS} />)
    expect(screen.getByRole("tree")).toBeInTheDocument()
  })

  it("folders start collapsed by default", () => {
    render(<FileTree items={ITEMS} />)
    // Children of src should not be visible
    expect(screen.queryByText("App.tsx")).not.toBeInTheDocument()
  })

  it("expands folder on click", () => {
    render(<FileTree items={ITEMS} />)
    fireEvent.click(screen.getByText("src"))
    expect(screen.getByText("App.tsx")).toBeInTheDocument()
  })

  it("collapses folder on second click", () => {
    render(<FileTree items={ITEMS} defaultOpen={["src"]} />)
    expect(screen.getByText("App.tsx")).toBeInTheDocument()
    fireEvent.click(screen.getByText("src"))
    expect(screen.queryByText("App.tsx")).not.toBeInTheDocument()
  })

  it("defaultOpen opens specified folders", () => {
    render(<FileTree items={ITEMS} defaultOpen={["src"]} />)
    expect(screen.getByText("App.tsx")).toBeInTheDocument()
    expect(screen.getByText("components")).toBeInTheDocument()
  })

  it("calls onSelect when item is clicked", () => {
    const onSelect = vi.fn()
    render(<FileTree items={ITEMS} onSelect={onSelect} defaultOpen={["src"]} />)
    fireEvent.click(screen.getByText("App.tsx"))
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "app", name: "App.tsx" }),
    )
  })

  it("highlights selected item", () => {
    render(<FileTree items={ITEMS} selected="readme" />)
    const item = screen.getByText("README.md").closest("[role='treeitem']")
    expect(item).toHaveAttribute("aria-selected", "true")
  })

  it("nested folders expand independently", () => {
    render(<FileTree items={ITEMS} defaultOpen={["src"]} />)
    // src is open, components is visible but its children aren't
    expect(screen.getByText("components")).toBeInTheDocument()
    expect(screen.queryByText("button.tsx")).not.toBeInTheDocument()
    // open components
    fireEvent.click(screen.getByText("components"))
    expect(screen.getByText("button.tsx")).toBeInTheDocument()
  })

  it("keyboard Enter toggles folder", () => {
    render(<FileTree items={ITEMS} />)
    const srcItem = screen.getByText("src").closest("[role='treeitem']")!
    fireEvent.keyDown(srcItem, { key: "Enter" })
    expect(screen.getByText("App.tsx")).toBeInTheDocument()
  })

  it("renders file icon for non-folder items", () => {
    render(<FileTree items={[{ id: "f", name: "file.txt" }]} />)
    expect(screen.getByText("file.txt")).toBeInTheDocument()
  })
})
