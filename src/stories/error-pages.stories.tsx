/**
 * Error Pages — 404, 500, and maintenance page templates.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, RefreshCw, Wrench } from "lucide-react"

const meta: Meta = {
  title: "Pages/Error",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Error and status page templates: 404 Not Found, 500 Server Error, and Maintenance.",
      },
    },
  },
}

export default meta
type Story = StoryObj

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="text-8xl font-bold text-muted-foreground/20">404</div>
      <div>
        <h1 className="text-2xl font-semibold">页面未找到</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          抱歉，你访问的页面不存在。可能已移动或删除。
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline">
          <ArrowLeft className="size-4 mr-2" />
          返回上一页
        </Button>
        <Button>
          <Home className="size-4 mr-2" />
          回到首页
        </Button>
      </div>
    </div>
  )
}

function ServerErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="text-8xl font-bold text-destructive/20">500</div>
      <div>
        <h1 className="text-2xl font-semibold">服务器异常</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          服务器遇到了一个错误，请稍后重试。如果问题持续存在，请联系管理员。
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline">
          <RefreshCw className="size-4 mr-2" />
          刷新页面
        </Button>
        <Button>
          <Home className="size-4 mr-2" />
          回到首页
        </Button>
      </div>
    </div>
  )
}

function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Wrench className="size-8 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">系统维护中</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          我们正在进行系统升级维护，预计将在 2 小时内恢复。
          感谢你的耐心等待。
        </p>
      </div>
      <div className="rounded-lg border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        维护时间：2025-01-15 02:00 - 04:00 (UTC+8)
      </div>
    </div>
  )
}

export const NotFound: Story = {
  name: "404 Not Found",
  render: () => <NotFoundPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("404")).toBeInTheDocument()
    await expect(canvas.getByText("页面未找到")).toBeInTheDocument()
  },
}

export const ServerError: Story = {
  name: "500 Server Error",
  render: () => <ServerErrorPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("500")).toBeInTheDocument()
  },
}

export const Maintenance: Story = {
  name: "Maintenance",
  render: () => <MaintenancePage />,
}
