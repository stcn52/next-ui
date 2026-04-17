/**
 * Usage Page — API 用量统计仪表板
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  BarChart3Icon,
  ZapIcon,
  DollarSignIcon,
  TrendingUpIcon,
  AlertCircleIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/display/badge"
import { Progress } from "@/components/ui/display/progress"
import { Separator } from "@/components/ui/display/separator"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/UsagePage",
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  trend?: string
  trendUp?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RANGES = ["今日", "本周", "本月", "全年"] as const
type Range = (typeof RANGES)[number]

const DATA: Record<Range, { requests: string; tokens: string; cost: string; trend: string }> = {
  今日: { requests: "12,840", tokens: "4.2M", cost: "¥18.63", trend: "+8%" },
  本周: { requests: "89,430", tokens: "29.7M", cost: "¥131.88", trend: "+15%" },
  本月: { requests: "348,210", tokens: "115.6M", cost: "¥513.50", trend: "+12%" },
  全年: { requests: "3,182,400", tokens: "1.06B", cost: "¥4,721.30", trend: "+38%" },
}

// Bar chart data (relative heights %)
const BARS: Record<Range, number[]> = {
  今日: [30, 45, 60, 55, 70, 65, 80, 75, 88, 72, 60, 50, 40, 55, 65, 70, 78, 82, 76, 68, 72, 66, 55, 45],
  本周: [40, 55, 70, 65, 80, 72, 60],
  本月: [45, 50, 60, 55, 70, 65, 72, 68, 75, 80, 78, 82, 76, 70, 65, 60, 68, 72, 78, 82, 80, 75, 70, 65, 68, 72, 76, 80, 78, 75],
  全年: [50, 55, 60, 65, 70, 75, 80, 82, 78, 72, 65, 70],
}

function StatCard({ icon: Icon, label, value, sub, trend, trendUp }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Icon className="size-4" />
          {label}
        </div>
        {trend && (
          <Badge variant="outline" className={cn("text-xs", trendUp ? "text-green-600 border-green-200" : "text-red-600 border-red-200")}>
            {trend}
          </Badge>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ bars }: { bars: number[] }) {
  return (
    <div className="flex items-end gap-1 h-32">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-sm transition-colors" style={{ height: `${h}%` }} />
      ))}
    </div>
  )
}

// ─── Model usage rows ─────────────────────────────────────────────────────────

const MODELS = [
  { name: "GPT-4o", requests: 48, tokens: "55.1M", cost: "¥245.40", quota: 60 },
  { name: "GPT-4o Mini", requests: 35, tokens: "42.8M", cost: "¥95.20", quota: 45 },
  { name: "Claude Sonnet 4", requests: 12, tokens: "14.3M", cost: "¥143.60", quota: 20 },
  { name: "Gemini Flash", requests: 5, tokens: "3.4M", cost: "¥29.30", quota: 8 },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

function UsagePage() {
  const [range, setRange] = useState<Range>("本月")
  const d = DATA[range]
  const bars = BARS[range]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart3Icon className="size-5 text-primary" />
            API 用量统计
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">监控 API 调用、Token 消耗与费用</p>
        </div>
        <Button variant="outline" size="sm">导出报告</Button>
      </header>

      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Range selector */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm transition-colors font-medium",
                range === r ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={ZapIcon} label="API 请求" value={d.requests} sub="次调用" trend={d.trend} trendUp />
          <StatCard icon={TrendingUpIcon} label="Token 消耗" value={d.tokens} sub="输入+输出 tokens" trend={d.trend} trendUp />
          <StatCard icon={DollarSignIcon} label="费用" value={d.cost} sub="本周期合计" trend={d.trend} trendUp />
        </div>

        {/* Chart */}
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">请求趋势</h2>
            <p className="text-xs text-muted-foreground">{range}概览</p>
          </div>
          <BarChart bars={bars} />
          <p className="text-xs text-muted-foreground text-center">（每格代表一个{range === "今日" ? "小时" : range === "本周" ? "天" : range === "本月" ? "天" : "月"}）</p>
        </div>

        {/* Model breakdown */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold text-sm">模型用量分布</h2>
          <Separator />
          <div className="space-y-4">
            {MODELS.map((m) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-muted-foreground text-xs">{m.tokens}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{m.requests}%</span>
                    <span className="font-medium text-foreground">{m.cost}</span>
                  </div>
                </div>
                <Progress value={m.quota} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Rate limit warning */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-4 flex gap-3 items-start">
          <AlertCircleIcon className="size-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">即将触达配额上限</p>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
              本月已使用 87% 的 Token 配额。建议在超额前升级套餐或优化调用策略。
            </p>
            <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700 text-white text-xs h-7">升级套餐</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Default: Story = { render: () => <UsagePage /> }
