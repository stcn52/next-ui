/**
 * Error Page — 404 / 500 / Maintenance 三种错误状态页
 */
import type { Meta, StoryObj } from "@storybook/react"
import {
  SearchXIcon,
  ServerCrashIcon,
  WrenchIcon,
  HomeIcon,
  RefreshCwIcon,
  MailIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/ErrorPage",
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj

// ─── Generic Error Layout ─────────────────────────────────────────────────────

interface ErrorPageProps {
  code?: string | number
  title: string
  description: string
  icon: React.ElementType
  iconColor?: string
  primaryLabel?: string
  secondaryLabel?: string
  onPrimary?: () => void
  onSecondary?: () => void
  showContactSupport?: boolean
}

function ErrorLayout({
  code,
  title,
  description,
  icon: Icon,
  iconColor = "text-muted-foreground",
  primaryLabel = "返回首页",
  secondaryLabel,
  onPrimary,
  onSecondary,
  showContactSupport = false,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-5">
        {/* Illustration */}
        <div className="flex justify-center">
          <div className={cn("size-20 rounded-2xl bg-muted flex items-center justify-center", iconColor.replace("text-", "bg-").replace("-foreground", "").replace("-500", "-100").replace("-600", "-100"))}>
            <Icon className={cn("size-10", iconColor)} />
          </div>
        </div>

        {/* Code */}
        {code && (
          <p className="text-6xl font-black tracking-tight text-muted-foreground/40">{code}</p>
        )}

        {/* Title + description */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button onClick={onPrimary}>
            <HomeIcon className="size-4" />
            {primaryLabel}
          </Button>
          {secondaryLabel && (
            <Button variant="outline" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          )}
        </div>

        {showContactSupport && (
          <p className="text-xs text-muted-foreground">
            仍然遇到问题？{" "}
            <button type="button" className="underline hover:text-foreground inline-flex items-center gap-0.5">
              <MailIcon className="size-3" />
              联系支持团队
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

// ─── 404 ──────────────────────────────────────────────────────────────────────

function NotFoundPage() {
  return (
    <ErrorLayout
      code={404}
      title="页面不存在"
      description="你访问的页面已被移除或从未存在。请检查地址是否正确，或返回首页继续浏览。"
      icon={SearchXIcon}
      iconColor="text-blue-500"
      primaryLabel="返回首页"
      secondaryLabel="← 返回上一页"
      onPrimary={() => {}}
      onSecondary={() => {}}
    />
  )
}

// ─── 500 ──────────────────────────────────────────────────────────────────────

function ServerErrorPage() {
  return (
    <ErrorLayout
      code={500}
      title="服务器内部错误"
      description="抱歉，服务器遇到了意外错误。我们已自动记录该问题，工程师正在紧急处理。请稍后重试。"
      icon={ServerCrashIcon}
      iconColor="text-red-500"
      primaryLabel="刷新页面"
      secondaryLabel="返回首页"
      onPrimary={() => window.location.reload()}
      onSecondary={() => {}}
      showContactSupport
    />
  )
}

// ─── Maintenance ──────────────────────────────────────────────────────────────

function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-5">
        <div className="flex justify-center">
          <div className="size-20 rounded-2xl bg-amber-100 flex items-center justify-center">
            <WrenchIcon className="size-10 text-amber-600 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">系统维护中</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            我们正在对系统进行计划内升级维护，预计完成时间为
            <strong className="text-foreground"> 2024-12-15 04:00</strong>（北京时间）。
            维护期间服务暂不可用，感谢你的耐心等待。
          </p>
        </div>

        {/* Progress indicator */}
        <div className="rounded-xl border bg-card p-4 text-left space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">维护进度</p>
          {[
            { label: "数据库迁移", done: true },
            { label: "静态资产构建", done: true },
            { label: "服务重启", done: false },
            { label: "健康检查", done: false },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <div className={cn("size-4 rounded-full flex items-center justify-center text-[10px] font-bold", done ? "bg-green-500 text-white" : "bg-muted text-muted-foreground")}>
                {done ? "✓" : "·"}
              </div>
              <span className={done ? "" : "text-muted-foreground"}>{label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCwIcon className="size-4" />
            重新检查
          </Button>
          <Button variant="ghost" asChild>
            <a href="https://status.example.com" target="_blank" rel="noreferrer">
              查看状态页面
            </a>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          需要帮助？发邮件至{" "}
          <a href="mailto:support@example.com" className="underline hover:text-foreground">
            support@example.com
          </a>
        </p>
      </div>
    </div>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const NotFound: Story = { render: () => <NotFoundPage /> }
export const ServerError: Story = { render: () => <ServerErrorPage /> }
export const Maintenance: Story = { render: () => <MaintenancePage /> }
