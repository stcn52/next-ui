/**
 * Getting Started — Introduction and documentation for @chenyang/ui.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const meta: Meta = {
  title: "Docs/Getting Started",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "@chenyang/ui — 基于 shadcn/ui v3 + Tailwind CSS v4 + React 19 构建的现代化 UI 组件库。" +
          "包含 58+ 组件、ConfigProvider、i18n、主题系统、暗黑模式、dnd-kit 拖拽、motion 动画等特性。",
      },
    },
  },
}

export default meta
type Story = StoryObj

function GettingStartedDoc() {
  const features = [
    "58+ 组件",
    "ConfigProvider",
    "i18n (zh-CN/en/ja-JP)",
    "主题系统 (6 预设 + 动态生成)",
    "暗黑模式",
    "dnd-kit 拖拽",
    "motion 动画",
    "TypeScript",
    "axe-core 无障碍",
  ]

  const pages = [
    { name: "Kanban", desc: "看板项目管理 + 拖拽 + 筛选 + 持久化" },
    { name: "Dashboard", desc: "KPI 卡片 + 项目表格 + 活动动态" },
    { name: "Settings", desc: "多标签设置: 个人 / 通知 / 外观 / 安全" },
    { name: "Auth", desc: "登录 / 注册 / 忘记密码" },
    { name: "Error", desc: "404 / 500 / 维护页" },
    { name: "User List", desc: "用户管理表格 + 搜索 + 批量操作" },
    { name: "File Manager", desc: "文件列表 / 网格浏览 + 存储分析" },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">安装</h2>
        <pre className="mt-2 rounded-lg bg-muted px-4 py-3 text-sm font-mono">
          pnpm add @chenyang/ui
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-bold">快速开始</h2>
        <pre className="mt-2 rounded-lg bg-muted px-4 py-3 text-sm font-mono whitespace-pre">{`import { ConfigProvider, Button } from "@chenyang/ui"
import "@chenyang/ui/styles.css"
import zhCN from "@chenyang/ui/locales/zh-CN.json"

<ConfigProvider size="default" locale={zhCN}>
  <Button>Hello World</Button>
</ConfigProvider>`}</pre>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold mb-3">核心特性</h2>
        <div className="flex flex-wrap gap-2">
          {features.map((f) => (
            <Badge key={f} variant="secondary">{f}</Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold mb-3">页面模板</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {pages.map((p) => (
            <Card key={p.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{p.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Overview: Story = {
  name: "Overview",
  render: () => <GettingStartedDoc />,
}
