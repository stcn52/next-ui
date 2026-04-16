/**
 * Projects Page — project management overview with status, progress, and team.
 * Demonstrates Card, Badge, Progress, Avatar, Tabs, Button composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect, userEvent } from "storybook/test"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  FolderKanban,
  Plus,
  Search,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/Projects",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "项目管理总览 — 项目状态、进度条、团队成员、标签过滤，展示卡片网格布局模式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

type Status = "active" | "completed" | "paused" | "planning"

interface Project {
  id: string
  name: string
  description: string
  status: Status
  progress: number
  team: { name: string; initial: string }[]
  tags: string[]
  dueDate: string
  starred: boolean
  tasks: { done: number; total: number }
}

const STATUS_CONFIG: Record<Status, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "进行中", variant: "default" },
  completed: { label: "已完成", variant: "secondary" },
  paused: { label: "暂停", variant: "outline" },
  planning: { label: "规划中", variant: "destructive" },
}

const PROJECTS: Project[] = [
  {
    id: "1",
    name: "next-ui",
    description: "React 组件库，基于 shadcn/ui v3 + Tailwind CSS v4",
    status: "active",
    progress: 78,
    team: [
      { name: "Chen Yang", initial: "C" },
      { name: "Alice Li", initial: "A" },
    ],
    tags: ["React", "TypeScript", "UI"],
    dueDate: "2026-05-01",
    starred: true,
    tasks: { done: 42, total: 54 },
  },
  {
    id: "2",
    name: "API Gateway",
    description: "微服务 API 网关 — 限流、鉴权、日志",
    status: "active",
    progress: 45,
    team: [
      { name: "Bob Zhang", initial: "B" },
      { name: "Eve Wang", initial: "E" },
      { name: "Chen Yang", initial: "C" },
    ],
    tags: ["Go", "gRPC", "DevOps"],
    dueDate: "2026-06-15",
    starred: false,
    tasks: { done: 18, total: 40 },
  },
  {
    id: "3",
    name: "Data Pipeline",
    description: "实时数据流处理平台",
    status: "planning",
    progress: 10,
    team: [{ name: "Frank Liu", initial: "F" }],
    tags: ["Kafka", "Flink", "Python"],
    dueDate: "2026-07-01",
    starred: false,
    tasks: { done: 2, total: 20 },
  },
  {
    id: "4",
    name: "Design System v2",
    description: "全新设计系统迭代 — Token 规范、组件升级",
    status: "completed",
    progress: 100,
    team: [
      { name: "Grace Wu", initial: "G" },
      { name: "Alice Li", initial: "A" },
    ],
    tags: ["Figma", "Design", "CSS"],
    dueDate: "2026-03-01",
    starred: true,
    tasks: { done: 32, total: 32 },
  },
  {
    id: "5",
    name: "Mobile App",
    description: "React Native 客户端 — iOS & Android",
    status: "paused",
    progress: 30,
    team: [
      { name: "Henry Zhao", initial: "H" },
      { name: "Bob Zhang", initial: "B" },
    ],
    tags: ["React Native", "Mobile"],
    dueDate: "2026-08-01",
    starred: false,
    tasks: { done: 9, total: 30 },
  },
  {
    id: "6",
    name: "CI/CD Platform",
    description: "自建 CI/CD 平台 — GitHub Actions + ArgoCD",
    status: "active",
    progress: 62,
    team: [
      { name: "Eve Wang", initial: "E" },
      { name: "Frank Liu", initial: "F" },
    ],
    tags: ["DevOps", "K8s", "Docker"],
    dueDate: "2026-05-20",
    starred: false,
    tasks: { done: 25, total: 40 },
  },
]

function ProjectsPage() {
  const [projects, setProjects] = useState(PROJECTS)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")

  const filtered = projects
    .filter((p) => {
      if (tab === "active") return p.status === "active"
      if (tab === "completed") return p.status === "completed"
      if (tab === "starred") return p.starred
      return true
    })
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
    )

  const toggleStar = (id: string) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p)),
    )

  return (
    <div className="min-h-175 bg-background text-foreground">
      {/* Header */}
      <div className="border-b px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderKanban className="size-5 text-primary" />
            <h1 className="text-xl font-semibold">项目</h1>
            <Badge variant="secondary" className="text-xs">
              {projects.length}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="搜索项目..."
                className="pl-9"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>
            <Button size="sm">
              <Plus className="mr-1.5 size-3.5" /> 新建项目
            </Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="active">进行中</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
            <TabsTrigger value="starred">已标星</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Project Grid */}
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => {
          const cfg = STATUS_CONFIG[project.status]
          return (
            <Card key={project.id} className="group relative transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="truncate text-base">{project.name}</CardTitle>
                      <Badge variant={cfg.variant} className="shrink-0 text-[10px]">
                        {cfg.label}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1 line-clamp-2 text-xs">
                      {project.description}
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => toggleStar(project.id)}
                    className="ml-2 shrink-0 text-muted-foreground transition-colors hover:text-yellow-500"
                    aria-label={project.starred ? "取消标星" : "标星"}
                  >
                    <Star
                      className={cn(
                        "size-4",
                        project.starred && "fill-yellow-400 text-yellow-400",
                      )}
                    />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Progress */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      任务 {project.tasks.done}/{project.tasks.total}
                    </span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t pt-2">
                  <div className="flex -space-x-2">
                    {project.team.map((m) => (
                      <Avatar key={m.name} className="size-7 border-2 border-background">
                        <AvatarFallback className="text-[10px]">{m.initial}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    <span>{project.dueDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          没有匹配的项目
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <ProjectsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("项目")).toBeInTheDocument()
    await expect(canvas.getByText("next-ui")).toBeInTheDocument()
    await expect(canvas.getByText("API Gateway")).toBeInTheDocument()
    await expect(canvas.getByText("Design System v2")).toBeInTheDocument()
  },
}

export const FilterActive: Story = {
  render: () => <ProjectsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Switch to active tab
    await userEvent.click(canvas.getByRole("tab", { name: "进行中" }))
    await expect(canvas.getByText("next-ui")).toBeInTheDocument()
    await expect(canvas.getByText("API Gateway")).toBeInTheDocument()
    // Completed project should not be visible
    await expect(canvas.queryByText("Design System v2")).not.toBeInTheDocument()
  },
}
