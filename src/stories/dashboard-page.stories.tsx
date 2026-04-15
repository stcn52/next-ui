/**
 * Dashboard Page — Analytics overview with cards, charts placeholders, and data table.
 * Demonstrates Card, Progress, Badge, Avatar, Table, Tabs composition.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  ListTodo,
  Clock,
  CheckCircle,
  BarChart3,
  Activity as ActivityIcon,
  Settings,
  ArrowUpRight,
} from "lucide-react"

const meta: Meta = {
  title: "Pages/Dashboard",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Analytics dashboard page with KPI cards, activity feed, project status table, " +
          "and sidebar navigation. Composes Card, Progress, Table, Badge, Avatar, and Tabs.",
      },
    },
  },
}

export default meta
type Story = StoryObj

// ─── Data ──────────────────────────────────────────────────────

const KPI_CARDS = [
  { title: "总任务数", value: "1,284", change: "+12%", up: true, icon: ListTodo },
  { title: "活跃成员", value: "32", change: "+3", up: true, icon: Users },
  { title: "完成率", value: "78%", change: "+5%", up: true, icon: CheckCircle },
  { title: "平均处理时长", value: "2.4 天", change: "-0.3", up: false, icon: Clock },
]

const PROJECTS = [
  { name: "用户系统重构", lead: "Alice", progress: 85, status: "进行中", tasks: 24 },
  { name: "支付网关集成", lead: "Bob", progress: 62, status: "进行中", tasks: 18 },
  { name: "数据分析平台", lead: "Carol", progress: 100, status: "已完成", tasks: 31 },
  { name: "移动端适配", lead: "Dave", progress: 35, status: "进行中", tasks: 12 },
  { name: "文档站点", lead: "Eve", progress: 90, status: "评审中", tasks: 8 },
]

const ACTIVITIES = [
  { user: "Alice", action: "完成了任务", target: "用户登录流程", time: "5 分钟前" },
  { user: "Bob", action: "创建了任务", target: "支付回调接口", time: "12 分钟前" },
  { user: "Carol", action: "评审了", target: "数据可视化 PR", time: "30 分钟前" },
  { user: "Dave", action: "移动了任务到", target: "进行中", time: "1 小时前" },
  { user: "Eve", action: "更新了文档", target: "API 参考手册", time: "2 小时前" },
]

// ─── Components ────────────────────────────────────────────────

function KpiCard({ title, value, change, up, icon: Icon }: typeof KPI_CARDS[number]) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-5 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          {up ? (
            <TrendingUp className="size-3.5 text-green-500" />
          ) : (
            <TrendingDown className="size-3.5 text-red-500" />
          )}
          <span className={`text-xs font-medium ${up ? "text-green-600" : "text-red-600"}`}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground">vs 上周</span>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>项目概览</CardTitle>
            <CardDescription>当前进行中的项目状态</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            查看全部
            <ArrowUpRight className="size-3.5 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>项目</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>进度</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">任务数</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PROJECTS.map((p) => (
              <TableRow key={p.name}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px]">{p.lead[0]}</AvatarFallback>
                    </Avatar>
                    {p.lead}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={p.progress} className="h-1.5 w-20" />
                    <span className="text-xs text-muted-foreground">{p.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={p.status === "已完成" ? "default" : p.status === "评审中" ? "secondary" : "outline"}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{p.tasks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近动态</CardTitle>
        <CardDescription>团队活动概览</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <Avatar className="size-7 mt-0.5">
                <AvatarFallback className="text-[10px]">{a.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{a.user}</span>
                  {" "}{a.action}{" "}
                  <span className="font-medium">{a.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            D
          </div>
          <span className="text-sm font-semibold">工作台</span>
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
            <BarChart3 className="size-4" />
            数据分析
          </SidebarItem>
          <SidebarItem>
            <ActivityIcon className="size-4" />
            动态
          </SidebarItem>
          <SidebarItem>
            <Users className="size-4" />
            团队
          </SidebarItem>
        </SidebarGroup>
        <Separator className="my-1" />
        <SidebarGroup>
          <SidebarGroupLabel>管理</SidebarGroupLabel>
          <SidebarItem>
            <Settings className="size-4" />
            设置
          </SidebarItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">CY</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate">chenyang</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function DashboardPage() {
  return (
    <div className="flex h-[700px] bg-background text-foreground">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold">总览</h1>
            <p className="text-sm text-muted-foreground">项目进展与团队动态一览</p>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {KPI_CARDS.map((kpi) => (
              <KpiCard key={kpi.title} {...kpi} />
            ))}
          </div>

          {/* Tabs for content sections */}
          <Tabs defaultValue="projects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="projects">项目</TabsTrigger>
              <TabsTrigger value="activity">动态</TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
              <ProjectTable />
            </TabsContent>
            <TabsContent value="activity">
              <ActivityFeed />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// ─── Stories ────────────────────────────────────────────────────

export const Default: Story = {
  name: "Dashboard Overview",
  render: () => <DashboardPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("总览")).toBeInTheDocument()
    await expect(canvas.getByText("1,284")).toBeInTheDocument()
    await expect(canvas.getByText("用户系统重构")).toBeInTheDocument()
  },
}

export const KpiCards: Story = {
  name: "KPI Cards",
  render: () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {KPI_CARDS.map((kpi) => (
        <KpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("总任务数")).toBeInTheDocument()
    await expect(canvas.getByText("活跃成员")).toBeInTheDocument()
  },
}

export const ProjectOverview: Story = {
  name: "Project Table",
  render: () => (
    <div className="max-w-3xl p-4">
      <ProjectTable />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("项目概览")).toBeInTheDocument()
    await expect(canvas.getByText("用户系统重构")).toBeInTheDocument()
  },
}

export const Activity: Story = {
  name: "Activity Feed",
  render: () => (
    <div className="max-w-md p-4">
      <ActivityFeed />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("最近动态")).toBeInTheDocument()
    await expect(canvas.getByText("Alice")).toBeInTheDocument()
  },
}
