import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
} from "@/components/ui/navigation/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inputs/input"
import { BarChart3, Home, Search, Settings, Users } from "lucide-react"

const meta: Meta<typeof Sidebar> = {
  title: "UI/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    collapsed: {
      control: "boolean",
      description: "Whether the sidebar is collapsed to icon-only mode.",
    },
    onCollapsedChange: {
      action: "collapsedChanged",
      description: "Callback when collapsed state changes.",
    },
    className: {
      control: "text",
      description: "Additional class names for the sidebar root.",
    },
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

function SidebarDemo({ collapsed: initialCollapsed = false }: { collapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(initialCollapsed)

  return (
    <div className="flex h-155 bg-background p-4">
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed}>
        <SidebarHeader>
          {!collapsed && <p className="text-sm font-semibold">Workspace</p>}
          <Button size="sm" variant="outline" onClick={() => setCollapsed((v) => !v)}>
            {collapsed ? "Expand" : "Collapse"}
          </Button>
          {!collapsed && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-8 pl-8" placeholder="Search" />
            </div>
          )}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarItem active>
              <Home className="size-4" />
              {!collapsed && "Home"}
            </SidebarItem>
            <SidebarItem>
              <BarChart3 className="size-4" />
              {!collapsed && "Analytics"}
            </SidebarItem>
            <SidebarItem>
              <Users className="size-4" />
              {!collapsed && "Team"}
            </SidebarItem>
            <SidebarItem>
              <Settings className="size-4" />
              {!collapsed && "Settings"}
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">CY</AvatarFallback>
            </Avatar>
            {!collapsed && <span className="text-sm">chenyang</span>}
          </div>
        </SidebarFooter>
      </Sidebar>

      <div className="flex-1 rounded-r-md border border-l-0 p-6">
        <h2 className="text-base font-semibold">Main Content</h2>
        <p className="text-sm text-muted-foreground">Sidebar interaction preview area.</p>
      </div>
    </div>
  )
}

export const Default: Story = {
  args: {
    collapsed: false,
  },
  render: (args) => <SidebarDemo collapsed={args.collapsed} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Main Content")).toBeInTheDocument()
    await expect(canvas.getByText("Workspace")).toBeInTheDocument()
  },
}

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
  render: (args) => <SidebarDemo collapsed={args.collapsed} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Main Content")).toBeInTheDocument()
    await expect(canvas.queryByText("Workspace")).not.toBeInTheDocument()
  },
}
