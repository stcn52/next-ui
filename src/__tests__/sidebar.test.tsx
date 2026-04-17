import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarFooter,
} from "@/components/ui/navigation/sidebar"

describe("Sidebar", () => {
  it("renders with default expanded width", () => {
    render(
      <Sidebar data-testid="sidebar">
        <SidebarContent>content</SidebarContent>
      </Sidebar>
    )
    const sidebar = screen.getByTestId("sidebar")
    expect(sidebar).toHaveAttribute("data-slot", "sidebar")
    expect(sidebar).not.toHaveAttribute("data-collapsed", "true")
  })

  it("renders collapsed state", () => {
    render(
      <Sidebar data-testid="sidebar" collapsed>
        <SidebarContent>content</SidebarContent>
      </Sidebar>
    )
    const sidebar = screen.getByTestId("sidebar")
    expect(sidebar).toHaveAttribute("data-collapsed", "true")
  })

  it("renders all sub-components with correct data-slot", () => {
    render(
      <Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Label</SidebarGroupLabel>
            <SidebarItem>Item 1</SidebarItem>
            <SidebarItem active>Active Item</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>
    )

    expect(screen.getByText("Header").closest("[data-slot='sidebar-header']")).toBeInTheDocument()
    expect(screen.getByText("Label").closest("[data-slot='sidebar-group-label']")).toBeInTheDocument()
    expect(screen.getByText("Footer").closest("[data-slot='sidebar-footer']")).toBeInTheDocument()
  })

  it("SidebarItem shows active state", () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarItem active>Active</SidebarItem>
          <SidebarItem>Inactive</SidebarItem>
        </SidebarContent>
      </Sidebar>
    )

    const activeItem = screen.getByText("Active")
    expect(activeItem).toHaveAttribute("data-active", "true")

    const inactiveItem = screen.getByText("Inactive")
    expect(inactiveItem).not.toHaveAttribute("data-active")
  })

  it("SidebarItem is clickable", async () => {
    const user = userEvent.setup()
    let clicked = false
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarItem onClick={() => { clicked = true }}>Click me</SidebarItem>
        </SidebarContent>
      </Sidebar>
    )

    await user.click(screen.getByText("Click me"))
    expect(clicked).toBe(true)
  })

  it("applies custom className", () => {
    render(
      <Sidebar data-testid="sidebar" className="custom-class">
        <SidebarContent>test</SidebarContent>
      </Sidebar>
    )
    expect(screen.getByTestId("sidebar")).toHaveClass("custom-class")
  })

  it("has aria-label on the sidebar", () => {
    render(
      <Sidebar data-testid="sidebar">
        <SidebarContent>content</SidebarContent>
      </Sidebar>
    )
    expect(screen.getByTestId("sidebar")).toHaveAttribute("aria-label", "Sidebar")
  })

  it("SidebarContent renders as nav element", () => {
    render(
      <Sidebar>
        <SidebarContent data-testid="sidebar-content">nav content</SidebarContent>
      </Sidebar>
    )
    const content = screen.getByTestId("sidebar-content")
    expect(content.tagName).toBe("NAV")
  })

  it("active SidebarItem has aria-current=page", () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarItem active>Active</SidebarItem>
          <SidebarItem>Inactive</SidebarItem>
        </SidebarContent>
      </Sidebar>
    )
    expect(screen.getByText("Active")).toHaveAttribute("aria-current", "page")
    expect(screen.getByText("Inactive")).not.toHaveAttribute("aria-current")
  })
})
