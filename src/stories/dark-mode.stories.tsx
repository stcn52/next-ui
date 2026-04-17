/**
 * Dark Mode Showcase — Side-by-side light/dark comparison for composite pages.
 * Uses the dark class to demonstrate theme switching.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/display/card"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/display/progress"
import { Input } from "@/components/ui/inputs/input"
import { Label } from "@/components/ui/inputs/label"
import { Switch } from "@/components/ui/inputs/switch"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarFooter,
} from "@/components/ui/navigation/sidebar"
import {
  LayoutDashboard,
  Settings,
  ListTodo,
  Users,
  Moon,
  Sun,
} from "lucide-react"

const meta: Meta = {
  title: "Theme/Dark Mode",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Dark mode showcase demonstrating how all composite components adapt to dark theme. " +
          "Use the Storybook toolbar theme switcher to toggle between light and dark modes.",
      },
    },
  },
}

export default meta
type Story = StoryObj

function ThemePanel({ mode, children }: { mode: "light" | "dark"; children: React.ReactNode }) {
  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <div className="bg-background text-foreground p-6 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          {mode === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          <span className="text-sm font-medium capitalize">{mode === "dark" ? "深色模式" : "浅色模式"}</span>
        </div>
        {children}
      </div>
    </div>
  )
}

function SampleCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>KPI 卡片</CardTitle>
          <CardDescription>项目进度概览</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">78%</span>
            <Badge>进行中</Badge>
          </div>
          <Progress value={78} />
          <div className="flex gap-2">
            <Badge variant="outline">前端</Badge>
            <Badge variant="secondary">Q2</Badge>
            <Badge variant="destructive">紧急</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>表单控件</CardTitle>
          <CardDescription>输入与交互</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`name-sample`}>用户名</Label>
            <Input id={`name-sample`} defaultValue="chenyang" />
          </div>
          <div className="flex items-center justify-between">
            <Label>通知开关</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex gap-2">
            <Button size="sm">保存</Button>
            <Button size="sm" variant="outline">取消</Button>
            <Button size="sm" variant="ghost">重置</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SampleSidebar() {
  return (
    <div className="h-[300px] flex rounded-lg overflow-hidden border">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex size-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
              W
            </div>
            <span className="text-sm font-medium">工作区</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>导航</SidebarGroupLabel>
            <SidebarItem active>
              <LayoutDashboard className="size-4" />
              总览
            </SidebarItem>
            <SidebarItem>
              <ListTodo className="size-4" />
              事项
            </SidebarItem>
            <SidebarItem>
              <Users className="size-4" />
              团队
            </SidebarItem>
            <SidebarItem>
              <Settings className="size-4" />
              设置
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarFallback className="text-[10px]">CY</AvatarFallback>
            </Avatar>
            <span className="text-xs">chenyang</span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 bg-background p-4">
        <p className="text-sm text-muted-foreground">主内容区域</p>
      </div>
    </div>
  )
}

/** Side-by-side comparison of light and dark modes */
export const Comparison: Story = {
  name: "Light vs Dark",
  parameters: { themes: { disable: true } },
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-100">
      <ThemePanel mode="light">
        <div className="space-y-4">
          <SampleCards />
          <SampleSidebar />
        </div>
      </ThemePanel>
      <ThemePanel mode="dark">
        <div className="space-y-4">
          <SampleCards />
          <SampleSidebar />
        </div>
      </ThemePanel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText("KPI 卡片")).toHaveLength(2)
    await expect(canvas.getAllByText("深色模式")).toHaveLength(1)
    await expect(canvas.getAllByText("浅色模式")).toHaveLength(1)
  },
}

/** Dark mode only — use the toolbar to switch to dark for best viewing */
export const DarkCards: Story = {
  name: "Cards (Dark)",
  parameters: {
    themes: { default: "dark" },
  },
  render: () => (
    <div className="p-6">
      <SampleCards />
    </div>
  ),
}

/** Sidebar in dark mode */
export const DarkSidebar: Story = {
  name: "Sidebar (Dark)",
  parameters: {
    themes: { default: "dark" },
  },
  render: () => (
    <div className="p-6">
      <SampleSidebar />
    </div>
  ),
}

/** All badge variants in dark mode */
export const DarkBadges: Story = {
  name: "Badges (Dark)",
  parameters: {
    themes: { default: "dark" },
  },
  render: () => (
    <div className="flex flex-wrap gap-3 p-6">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
}

/** Button variants in dark mode */
export const DarkButtons: Story = {
  name: "Buttons (Dark)",
  parameters: {
    themes: { default: "dark" },
  },
  render: () => (
    <div className="flex flex-wrap gap-3 p-6">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}
