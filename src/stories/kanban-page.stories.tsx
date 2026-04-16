/**
 * Kanban Page — Full-featured project management board.
 * Implements issues #1-#7 + dnd-kit drag & drop + responsive + i18n
 */
import { useState, useMemo, useCallback } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent } from "storybook/test"
import type { UniqueIdentifier } from "@dnd-kit/core"
import {
  KanbanBoard,
  type KanbanItem,
  type KanbanColumn as KanbanCol,
} from "@/components/ui/kanban"
import { useKanbanStorage } from "@/components/ui/use-kanban-storage"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Inbox,
  ListTodo,
  LayoutGrid,
  Settings,
  Bot,
  Play,
  Wrench,
  ChevronDown,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  LayoutDashboard,
  User,
  AlertCircle,
  Loader2,
  GripVertical,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
} from "lucide-react"

const meta: Meta = {
  title: "Pages/Kanban",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-featured kanban project management page. Integrates Sidebar navigation, " +
          "KanbanBoard with drag & drop (via @dnd-kit), filter toolbar, and multiple " +
          "state displays (loading, error, empty). Responsive: sidebar collapses on mobile.",
      },
    },
  },
}

export default meta
type Story = StoryObj

// ─── Issue #6: Data Structures ──────────────────────────────────

type Priority = "urgent" | "high" | "medium" | "low"
type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked"
type FilterTab = "all" | "member" | "agent"

interface Task extends KanbanItem {
  id: UniqueIdentifier
  title: string
  status: TaskStatus
  priority: Priority
  assignee?: string
  checklistTotal: number
  checklistCompleted: number
  labels?: string[]
}

interface StatusColumnDef {
  id: TaskStatus
  title: string
  color: string
}

const STATUS_COLUMNS: StatusColumnDef[] = [
  { id: "backlog", title: "待梳理", color: "bg-gray-400" },
  { id: "todo", title: "待处理", color: "bg-blue-500" },
  { id: "in-progress", title: "进行中", color: "bg-amber-500" },
  { id: "review", title: "评审中", color: "bg-purple-500" },
  { id: "done", title: "已完成", color: "bg-green-500" },
  { id: "blocked", title: "阻塞", color: "bg-red-500" },
]

const PRIORITY_MAP: Record<Priority, { label: string; color: string }> = {
  urgent: { label: "紧急", color: "text-red-600 bg-red-50" },
  high: { label: "高", color: "text-orange-600 bg-orange-50" },
  medium: { label: "中", color: "text-blue-600 bg-blue-50" },
  low: { label: "低", color: "text-gray-500 bg-gray-50" },
}

// ─── Mock Data ──────────────────────────────────────────────────

const MOCK_TASKS: Task[] = [
  { id: "KAN-101", title: "用户登录流程重构", status: "backlog", priority: "high", assignee: "Alice", checklistTotal: 5, checklistCompleted: 0, labels: ["前端"] },
  { id: "KAN-102", title: "数据库迁移脚本编写", status: "backlog", priority: "medium", checklistTotal: 3, checklistCompleted: 0 },
  { id: "KAN-103", title: "支付接口对接", status: "todo", priority: "urgent", assignee: "Bob", checklistTotal: 8, checklistCompleted: 2, labels: ["后端", "支付"] },
  { id: "KAN-104", title: "UI 组件库更新", status: "todo", priority: "medium", assignee: "Alice", checklistTotal: 12, checklistCompleted: 5 },
  { id: "KAN-105", title: "消息推送服务", status: "todo", priority: "low", checklistTotal: 4, checklistCompleted: 0 },
  { id: "KAN-106", title: "Dashboard 图表实现", status: "in-progress", priority: "high", assignee: "Carol", checklistTotal: 6, checklistCompleted: 4, labels: ["前端"] },
  { id: "KAN-107", title: "API 限流策略", status: "in-progress", priority: "medium", assignee: "Dave", checklistTotal: 3, checklistCompleted: 2 },
  { id: "KAN-108", title: "文档站点搭建", status: "in-progress", priority: "low", assignee: "Alice", checklistTotal: 10, checklistCompleted: 7, labels: ["文档"] },
  { id: "KAN-109", title: "单元测试覆盖率提升", status: "review", priority: "high", assignee: "Bob", checklistTotal: 15, checklistCompleted: 14 },
  { id: "KAN-110", title: "权限管理模块", status: "review", priority: "medium", assignee: "Carol", checklistTotal: 7, checklistCompleted: 6, labels: ["后端"] },
  { id: "KAN-111", title: "CI/CD 流水线优化", status: "done", priority: "high", assignee: "Dave", checklistTotal: 5, checklistCompleted: 5 },
  { id: "KAN-112", title: "日志采集方案", status: "done", priority: "low", checklistTotal: 4, checklistCompleted: 4 },
  { id: "KAN-113", title: "第三方 SDK 集成", status: "blocked", priority: "urgent", assignee: "Bob", checklistTotal: 6, checklistCompleted: 3, labels: ["阻塞"] },
]

// ─── Issue #5: TaskCard Component ───────────────────────────────

function TaskCard({ task }: { task: Task }) {
  const progress = task.checklistTotal > 0
    ? Math.round((task.checklistCompleted / task.checklistTotal) * 100)
    : 0
  const pri = PRIORITY_MAP[task.priority]

  return (
    <div
      data-testid={`task-${task.id}`}
      className="group rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1">
          <GripVertical className="size-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
          <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
        </div>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${pri.color}`}>
          {pri.label}
        </span>
      </div>
      <p className="mt-1.5 text-sm font-medium leading-snug line-clamp-2">{task.title}</p>
      {task.labels && task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.map((l) => (
            <Badge key={l} variant="outline" className="text-[10px] px-1.5 py-0">
              {l}
            </Badge>
          ))}
        </div>
      )}
      {task.checklistTotal > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {task.checklistCompleted}/{task.checklistTotal}
          </span>
        </div>
      )}
      {task.assignee && (
        <div className="mt-2 flex items-center gap-1.5">
          <Avatar className="size-5">
            <AvatarFallback className="text-[10px]">
              {task.assignee.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{task.assignee}</span>
        </div>
      )}
    </div>
  )
}

// ─── Issue #4: KanbanColumn Header ──────────────────────────────

const STATUS_COLOR_MAP: Record<TaskStatus, string> = {
  backlog: "bg-gray-400",
  todo: "bg-blue-500",
  "in-progress": "bg-amber-500",
  review: "bg-purple-500",
  done: "bg-green-500",
  blocked: "bg-red-500",
}

function KanbanColumnHeader({ column }: { column: KanbanCol<Task> }) {
  const color = STATUS_COLOR_MAP[column.id as TaskStatus] ?? "bg-gray-400"
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className={`size-2.5 rounded-full ${color}`} />
      <span className="text-sm font-medium">{column.title}</span>
      <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
        {column.items.length}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon-xs">
            <MoreHorizontal className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>排序</DropdownMenuItem>
          <DropdownMenuItem>折叠</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="icon-xs">
        <Plus className="size-3.5" />
      </Button>
    </div>
  )
}

// ─── Issue #7: Empty/Loading/Error States ───────────────────────

function EmptyColumn() {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
      <ListTodo className="size-8 opacity-40" />
      <p className="text-xs">暂无任务</p>
      <Button variant="outline" size="xs">
        <Plus className="size-3 mr-1" />
        添加任务
      </Button>
    </div>
  )
}

function EmptyFilter() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
      <Search className="size-10 opacity-30" />
      <p className="text-sm font-medium">无匹配结果</p>
      <p className="text-xs">尝试调整筛选条件</p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex gap-4 px-4 py-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex w-[280px] min-w-[280px] flex-col gap-2 rounded-lg bg-muted/40 p-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-2.5 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-4 w-6" />
          </div>
          {Array.from({ length: 2 + (i % 3) }).map((_, j) => (
            <Skeleton key={j} className="h-24 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
      <AlertCircle className="size-10 text-destructive opacity-60" />
      <p className="text-sm font-medium">数据加载失败</p>
      <p className="text-xs">请检查网络连接后重试</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          重试
        </Button>
      )}
    </div>
  )
}

// ─── Issue #2: Left Sidebar Navigation (Responsive) ────────────

function AppSidebar({
  activeItem = "事项",
  collapsed = false,
  onToggle,
}: {
  activeItem?: string
  collapsed?: boolean
  onToggle?: () => void
}) {
  return (
    <Sidebar collapsed={collapsed}>
      <SidebarHeader>
        {!collapsed && (
          <>
            {/* Workspace switcher */}
            <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent text-left">
              <div className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                W
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">工作区</p>
              </div>
              <ChevronDown className="size-3.5 text-sidebar-foreground/50" />
            </button>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-sidebar-foreground/50" />
              <Input
                placeholder="搜索..."
                className="h-7 pl-8 text-xs bg-sidebar-accent/50 border-0"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-sidebar-foreground/40 font-mono">⌘K</kbd>
            </div>
          </>
        )}
        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon-xs"
          className={collapsed ? "mx-auto" : "ml-auto"}
          onClick={onToggle}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </SidebarHeader>

      {!collapsed && (
        <SidebarContent>
          {/* Quick actions */}
          <SidebarGroup>
            <SidebarItem>
              <Search className="size-4" />
              搜索
            </SidebarItem>
            <SidebarItem>
              <Plus className="size-4" />
              新建事项
            </SidebarItem>
            <SidebarItem>
              <Inbox className="size-4" />
              收件箱
              <Badge variant="secondary" className="ml-auto text-[10px] px-1.5">3</Badge>
            </SidebarItem>
            <SidebarItem>
              <User className="size-4" />
              我的事项
            </SidebarItem>
          </SidebarGroup>

          <Separator className="my-1" />

          {/* Workspace nav */}
          <SidebarGroup>
            <SidebarGroupLabel>工作区</SidebarGroupLabel>
            <SidebarItem active={activeItem === "事项"}>
              <ListTodo className="size-4" />
              事项
            </SidebarItem>
            <SidebarItem active={activeItem === "项目"}>
              <LayoutGrid className="size-4" />
              项目
            </SidebarItem>
            <SidebarItem active={activeItem === "智能体"}>
              <Bot className="size-4" />
              智能体
            </SidebarItem>
            <SidebarItem active={activeItem === "运行时"}>
              <Play className="size-4" />
              运行时
            </SidebarItem>
            <SidebarItem active={activeItem === "技能"}>
              <Wrench className="size-4" />
              技能
            </SidebarItem>
          </SidebarGroup>

          <Separator className="my-1" />

          {/* Config */}
          <SidebarGroup>
            <SidebarGroupLabel>配置</SidebarGroupLabel>
            <SidebarItem active={activeItem === "设置"}>
              <Settings className="size-4" />
              设置
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      )}

      {!collapsed && (
        <SidebarFooter>
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">CY</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">chenyang</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">cy@example.com</p>
            </div>
            <Button variant="ghost" size="icon-xs">
              <MoreHorizontal className="size-3.5" />
            </Button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}

// ─── Issue #3: Top Filter & Toolbar ─────────────────────────────

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "member", label: "成员" },
  { id: "agent", label: "智能体" },
]

function TopToolbar({
  activeTab,
  onTabChange,
}: {
  activeTab: FilterTab
  onTabChange: (tab: FilterTab) => void
}) {
  return (
    <div className="border-b">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">工作区</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">事项</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>看板</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Filter + Actions row */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-1">
          {FILTER_TABS.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              size="xs"
              onClick={() => onTabChange(tab.id)}
              data-testid={`filter-${tab.id}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="xs">
            <Filter className="size-3.5 mr-1" />
            筛选
          </Button>
          <Button variant="ghost" size="xs">
            <ArrowUpDown className="size-3.5 mr-1" />
            排序
          </Button>
          <Button variant="ghost" size="xs">
            <LayoutDashboard className="size-3.5 mr-1" />
            视图
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Issue #1: Overall Page Layout (Responsive + DnD) ───────────

function KanbanPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [pageState, setPageState] = useState<"normal" | "loading" | "error">("normal")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Issue #6: Convert data for KanbanBoard with localStorage persistence
  const initialColumns: KanbanCol<Task>[] = useMemo(() => {
    return STATUS_COLUMNS.map((col) => ({
      id: col.id,
      title: col.title,
      items: MOCK_TASKS.filter((t) => t.status === col.id),
    }))
  }, [])

  const { columns, setColumns, resetColumns } = useKanbanStorage<Task>(
    "kanban-page-columns",
    initialColumns,
  )

  // Columns change handler for drag & drop
  const handleColumnsChange = useCallback((newColumns: KanbanCol<Task>[]) => {
    setColumns(newColumns)
  }, [setColumns])

  // Filter visible columns
  const filteredColumns: KanbanCol<Task>[] = useMemo(() => {
    if (activeTab === "all") return columns
    if (activeTab === "agent") {
      return columns.map((col) => ({ ...col, items: [] }))
    }
    return columns.map((col) => ({
      ...col,
      items: col.items.filter((t) => t.assignee),
    }))
  }, [columns, activeTab])

  const totalFiltered = filteredColumns.reduce((acc, c) => acc + c.items.length, 0)

  return (
    <div className="flex h-[700px] bg-background text-foreground">
      {/* Issue #2: Responsive sidebar */}
      <div className="hidden md:block">
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile sidebar toggle */}
        <div className="flex items-center gap-2 px-4 pt-2 md:hidden">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <PanelLeftOpen className="size-4" />
          </Button>
          <span className="text-sm font-medium">看板</span>
        </div>

        {/* Issue #3: Top toolbar */}
        <TopToolbar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Demo controls for states (#7) */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/30 text-xs">
          <span className="text-muted-foreground">演示状态：</span>
          <Button size="xs" variant={pageState === "normal" ? "default" : "ghost"} onClick={() => setPageState("normal")}>正常</Button>
          <Button size="xs" variant={pageState === "loading" ? "default" : "ghost"} onClick={() => setPageState("loading")}>
            <Loader2 className="size-3 mr-1" />加载中
          </Button>
          <Button size="xs" variant={pageState === "error" ? "default" : "ghost"} onClick={() => setPageState("error")}>
            <AlertCircle className="size-3 mr-1" />异常
          </Button>
          <Separator orientation="vertical" className="h-4 mx-1" />
          <Button size="xs" variant="ghost" onClick={resetColumns}>
            <RotateCcw className="size-3 mr-1" />重置
          </Button>
        </div>

        {/* Issue #1: Kanban content area with dnd-kit */}
        {pageState === "loading" ? (
          <LoadingState />
        ) : pageState === "error" ? (
          <ErrorState onRetry={() => setPageState("normal")} />
        ) : totalFiltered === 0 ? (
          <EmptyFilter />
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4 min-w-0">
              <KanbanBoard<Task>
                columns={filteredColumns}
                onColumnsChange={handleColumnsChange}
                renderItem={(task) => <TaskCard task={task} />}
                renderColumnHeader={(col) => <KanbanColumnHeader column={col} />}
                renderOverlay={(task) => (
                  <div className="w-[260px] rotate-2 opacity-90">
                    <TaskCard task={task} />
                  </div>
                )}
                className="gap-4"
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

// ─── Stories ────────────────────────────────────────────────────

export const Default: Story = {
  name: "Complete Kanban Page",
  render: () => <KanbanPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Issue #1: Layout structure
    await expect(canvas.getByText("看板")).toBeInTheDocument()

    // Issue #2: Sidebar navigation
    await expect(canvas.getByText("工作区")).toBeInTheDocument()
    await expect(canvas.getByText("事项")).toBeInTheDocument()

    // Issue #3: Filter toolbar
    const allTab = canvas.getByTestId("filter-all")
    await expect(allTab).toBeInTheDocument()

    // Issue #4: Columns
    await expect(canvas.getByText("待梳理")).toBeInTheDocument()
    await expect(canvas.getByText("进行中")).toBeInTheDocument()
    await expect(canvas.getByText("已完成")).toBeInTheDocument()

    // Issue #5: Task cards
    await expect(canvas.getByTestId("task-KAN-101")).toBeInTheDocument()
    await expect(canvas.getByText("用户登录流程重构")).toBeInTheDocument()

    // Issue #3: Switch filter
    const memberTab = canvas.getByTestId("filter-member")
    await userEvent.click(memberTab)

    // Issue #7: Test loading state
    const loadingBtn = canvas.getByText("加载中")
    await userEvent.click(loadingBtn)

    // Switch back
    const normalBtn = canvas.getByText("正常")
    await userEvent.click(normalBtn)
  },
}

/** Issue #5: Standalone task card variants */
export const TaskCards: Story = {
  name: "Task Card Variants",
  render: () => (
    <div className="max-w-xs flex flex-col gap-3 p-4">
      <TaskCard
        task={{ id: "KAN-001", title: "完整的任务卡片示例", status: "in-progress", priority: "urgent", assignee: "Alice", checklistTotal: 8, checklistCompleted: 5, labels: ["前端", "紧急"] }}
      />
      <TaskCard
        task={{ id: "KAN-002", title: "无负责人、无标签", status: "todo", priority: "low", checklistTotal: 3, checklistCompleted: 0 }}
      />
      <TaskCard
        task={{ id: "KAN-003", title: "多行标题自动截断示例：这是一个非常长的标题用于测试两行截断的效果是否正常", status: "backlog", priority: "medium", assignee: "Bob", checklistTotal: 0, checklistCompleted: 0 }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId("task-KAN-001")).toBeInTheDocument()
    await expect(canvas.getByText("紧急")).toBeInTheDocument()
  },
}

/** Issue #7: State variants */
export const States: Story = {
  name: "Loading / Error / Empty States",
  render: () => (
    <div className="flex flex-col gap-5 p-5 max-w-3xl">
      <div>
        <h3 className="text-sm font-medium mb-2">Loading State</h3>
        <LoadingState />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Error State</h3>
        <ErrorState onRetry={() => alert("重试")} />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Empty Filter</h3>
        <EmptyFilter />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Empty Column</h3>
        <div className="w-[280px] rounded-lg bg-muted/40 p-2">
          <EmptyColumn />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("数据加载失败")).toBeInTheDocument()
    await expect(canvas.getByText("暂无任务")).toBeInTheDocument()
    await expect(canvas.getByText("无匹配结果")).toBeInTheDocument()
  },
}
