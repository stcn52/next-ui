/**
 * Unit tests for JsonViewer component
 */
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { JsonViewer } from "@/components/ui/json-viewer"

describe("JsonViewer", () => {
  it("renders string value", () => {
    render(<JsonViewer data="hello" />)
    expect(screen.getByText(/"hello"/)).toBeInTheDocument()
  })

  it("renders number value", () => {
    render(<JsonViewer data={42} />)
    expect(screen.getByText("42")).toBeInTheDocument()
  })

  it("renders boolean true", () => {
    render(<JsonViewer data={true} />)
    expect(screen.getByText("true")).toBeInTheDocument()
  })

  it("renders null", () => {
    render(<JsonViewer data={null} />)
    expect(screen.getByText("null")).toBeInTheDocument()
  })

  it("renders object keys expanded by default", () => {
    render(<JsonViewer data={{ name: "陈宇", age: 28 }} />)
    expect(screen.getByText(/"name"/)).toBeInTheDocument()
    expect(screen.getByText(/"陈宇"/)).toBeInTheDocument()
  })

  it("collapses object when expanded=false", () => {
    render(<JsonViewer data={{ name: "陈宇" }} expanded={false} />)
    // Should show collapsed state — key count visible, not the actual key name
    expect(screen.getByText(/1 keys/)).toBeInTheDocument()
    expect(screen.queryByText(/"name"/)).not.toBeInTheDocument()
  })

  it("renders array items", () => {
    render(<JsonViewer data={["a", "b", "c"]} />)
    expect(screen.getByText(/"a"/)).toBeInTheDocument()
    expect(screen.getByText(/"b"/)).toBeInTheDocument()
  })

  it("shows item count when array is collapsed", () => {
    render(<JsonViewer data={[1, 2, 3, 4, 5]} expanded={false} />)
    expect(screen.getByText(/5 items/)).toBeInTheDocument()
  })

  it("expands node on click", () => {
    render(<JsonViewer data={{ name: "陈宇" }} expanded={false} />)
    const node = screen.getByRole("button")
    fireEvent.click(node)
    expect(screen.getByText(/"name"/)).toBeInTheDocument()
  })

  it("collapses expanded node on click", () => {
    render(<JsonViewer data={{ name: "陈宇" }} />)
    const node = screen.getByRole("button")
    fireEvent.click(node)
    expect(screen.queryByText(/"name"/)).not.toBeInTheDocument()
  })

  it("respects maxDepth — deep nodes start collapsed", () => {
    const data = { level1: { level2: { level3: { value: "深层" } } } }
    render(<JsonViewer data={data} maxDepth={1} />)
    // level1 should be expanded, level2 should be collapsed
    expect(screen.getByText(/"level1"/)).toBeInTheDocument()
    expect(screen.queryByText(/"level2"/)).not.toBeInTheDocument()
  })

  it("keyboard Enter toggles node", () => {
    render(<JsonViewer data={{ x: 1 }} expanded={false} />)
    const node = screen.getByRole("button")
    fireEvent.keyDown(node, { key: "Enter" })
    expect(screen.getByText(/"x"/)).toBeInTheDocument()
  })

  it("nested objects render keys at inner level", () => {
    const data = { user: { name: "王磊", age: 30 } }
    render(<JsonViewer data={data} maxDepth={5} />)
    expect(screen.getByText(/"name"/)).toBeInTheDocument()
    expect(screen.getByText(/"王磊"/)).toBeInTheDocument()
  })
})
