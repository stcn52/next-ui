/**
 * Changelog Page — version history timeline with grouped entries.
 * Demonstrates Timeline, Badge, Card composition.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect } from "storybook/test"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
} from "@/components/ui/timeline"
import {
  GitCommitHorizontal,
  Package,
  Plus,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react"

const meta: Meta = {
  title: "Pages/Changelog",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "更新日志 — 使用 Timeline 展示版本历史、新增特性、修复和改进，展示时间线在文档场景的用法。",
      },
    },
  },
}

export default meta
type Story = StoryObj

type ChangeType = "feature" | "fix" | "improvement" | "breaking"

interface ChangeEntry {
  type: ChangeType
  description: string
}

interface Version {
  version: string
  date: string
  tag: "latest" | "stable" | "previous"
  changes: ChangeEntry[]
}

const TYPE_CONFIG: Record<ChangeType, { label: string; icon: typeof Plus; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  feature: { label: "新增", icon: Plus, variant: "default" },
  fix: { label: "修复", icon: Wrench, variant: "secondary" },
  improvement: { label: "改进", icon: Zap, variant: "outline" },
  breaking: { label: "破坏性", icon: Sparkles, variant: "destructive" },
}

const VERSIONS: Version[] = [
  {
    version: "0.2.0",
    date: "2026-04-16",
    tag: "latest",
    changes: [
      { type: "feature", description: "新增 Timeline 组件 — 支持垂直/水平布局，5 种圆点变体" },
      { type: "feature", description: "新增 Stepper 组件 — 步骤指示器，支持水平/垂直方向" },
      { type: "feature", description: "新增 Blog、Landing、Team、Inbox、Projects、Orders 页面模板" },
      { type: "feature", description: "新增 parseThemeCSS() — 支持从 shadcnthemer.com 导入主题" },
      { type: "improvement", description: "侧边栏无障碍增强：aria-label、<nav> 元素、aria-current" },
      { type: "improvement", description: "全局 cursor: pointer + prefers-reduced-motion 支持" },
      { type: "improvement", description: "包体积优化：ESM 1,380KB → 179KB（-87%）" },
      { type: "fix", description: "修复 InputGroupAddon 错误的 role=\"group\" 属性" },
      { type: "fix", description: "修复 Github icon 在 lucide-react 中缺失的问题" },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-04-16",
    tag: "stable",
    changes: [
      { type: "feature", description: "基于 shadcn/ui v3 + Base UI + Tailwind CSS v4 提供 55+ 组件" },
      { type: "feature", description: "ConfigProvider — 全局尺寸、语言和类名前缀管理" },
      { type: "feature", description: "内置国际化：中文、英文、日文三种语言" },
      { type: "feature", description: "DataTable 系列：排序、过滤、分页、虚拟滚动、行内编辑" },
      { type: "feature", description: "KanbanBoard — 跨列拖拽，SortableList — 拖拽排序" },
      { type: "feature", description: "DatePicker、Combobox、Form、Shortcuts、AnimatedCard 等" },
      { type: "feature", description: "ThemeProvider 深色模式，Storybook 10 文档和 play 测试" },
    ],
  },
]

function ChangelogPage() {
  return (
    <div className="min-h-175 bg-background text-foreground">
      {/* Header */}
      <div className="border-b px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <GitCommitHorizontal className="size-5 text-primary" />
            <h1 className="text-2xl font-bold">更新日志</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            @stcn52/next-ui 的版本历史和变更记录
          </p>
        </div>
      </div>

      {/* Changelog */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Timeline>
          {VERSIONS.map((ver, i) => (
            <TimelineItem key={ver.version} isLast={i === VERSIONS.length - 1}>
              <div className="flex flex-col">
                <TimelineConnector />
                <TimelineDot variant={ver.tag === "latest" ? "primary" : "default"}>
                  <Package className="size-3" />
                </TimelineDot>
              </div>
              <TimelineContent>
                <Card className="mb-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">v{ver.version}</CardTitle>
                      {ver.tag === "latest" && (
                        <Badge variant="default" className="text-[10px]">最新</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{ver.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {ver.changes.map((change, j) => {
                        const cfg = TYPE_CONFIG[change.type]
                        return (
                          <li key={j} className="flex items-start gap-2">
                            <Badge variant={cfg.variant} className="mt-0.5 shrink-0 text-[10px]">
                              {cfg.label}
                            </Badge>
                            <span className="text-sm text-foreground/80">{change.description}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          查看完整日志请访问{" "}
          <span className="font-medium text-foreground">CHANGELOG.md</span>
        </p>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <ChangelogPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("更新日志")).toBeInTheDocument()
    await expect(canvas.getByText("v0.2.0")).toBeInTheDocument()
    await expect(canvas.getByText("v0.1.0")).toBeInTheDocument()
    await expect(canvas.getByText("最新")).toBeInTheDocument()
  },
}
