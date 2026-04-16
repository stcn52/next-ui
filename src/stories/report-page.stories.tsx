/**
 * Report Page — data report with charts, KPI cards, data table, and export actions.
 * Demonstrates Card, Badge, Table, Progress, DateRangePicker, Button composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  DownloadIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  UsersIcon,
  ShoppingCartIcon,
  DollarSignIcon,
  BarChart3Icon,
  FilterIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import type { DateRange } from "@/components/ui/date-range-picker"

const meta: Meta = {
  title: "Pages/ReportPage",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const KPI = [
  {
    title: "总收入",
    value: "¥128,430",
    change: "+12.5%",
    up: true,
    icon: DollarSignIcon,
  },
  {
    title: "订单数",
    value: "3,842",
    change: "+8.2%",
    up: true,
    icon: ShoppingCartIcon,
  },
  {
    title: "活跃用户",
    value: "24,109",
    change: "-2.1%",
    up: false,
    icon: UsersIcon,
  },
  {
    title: "转化率",
    value: "4.38%",
    change: "+0.6%",
    up: true,
    icon: BarChart3Icon,
  },
]

const CHANNEL_DATA = [
  { channel: "自然搜索", sessions: 14230, conversion: 5.2, revenue: 48320, share: 42 },
  { channel: "付费广告", sessions: 8910, conversion: 6.8, revenue: 36210, share: 28 },
  { channel: "社交媒体", sessions: 5640, conversion: 3.1, revenue: 18740, share: 18 },
  { channel: "邮件营销", sessions: 2380, conversion: 8.4, revenue: 15620, share: 8 },
  { channel: "直接访问", sessions: 1290, conversion: 4.9, revenue: 9540, share: 4 },
]

const PRODUCT_DATA = [
  { name: "专业套餐", sku: "PRO-2024", sold: 1240, revenue: 62000, status: "热销" },
  { name: "企业套餐", sku: "ENT-2024", sold: 380, revenue: 95000, status: "增长" },
  { name: "基础套餐", sku: "BASIC-2024", sold: 2100, revenue: 21000, status: "稳定" },
  { name: "加购存储", sku: "ADD-STORAGE", sold: 890, revenue: 8900, status: "稳定" },
  { name: "技术支持", sku: "SUPPORT-PKG", sold: 210, revenue: 10500, status: "下降" },
]

// ---------------------------------------------------------------------------
// Mini bar chart (CSS-based)
// ---------------------------------------------------------------------------

function MiniBarChart({ data }: { data: { label: string; value: number; max: number }[] }) {
  return (
    <div className="space-y-2">
      {data.map((row) => (
        <div key={row.label} className="flex items-center gap-3 text-sm">
          <div className="w-20 shrink-0 text-muted-foreground">{row.label}</div>
          <div className="flex-1">
            <Progress value={(row.value / row.max) * 100} className="h-2" />
          </div>
          <div className="w-12 text-right font-medium tabular-nums">
            {row.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ReportPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const maxSessions = Math.max(...CHANNEL_DATA.map((d) => d.sessions))

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">数据报表</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">查看业务核心指标与渠道分析</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            placeholder="选择日期范围"
            className="w-[240px]"
          />
          <Button variant="outline" size="sm">
            <FilterIcon />
            筛选
          </Button>
          <Button size="sm">
            <DownloadIcon />
            导出报表
          </Button>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* KPI */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KPI.map((k) => (
            <Card key={k.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {k.title}
                </CardTitle>
                <k.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{k.value}</p>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {k.up ? (
                    <TrendingUpIcon className="size-3 text-green-500" />
                  ) : (
                    <TrendingDownIcon className="size-3 text-destructive" />
                  )}
                  <span className={k.up ? "text-green-500" : "text-destructive"}>
                    {k.change}
                  </span>
                  <span className="text-muted-foreground">vs 上月</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="channels" className="space-y-4">
          <TabsList>
            <TabsTrigger value="channels">渠道分析</TabsTrigger>
            <TabsTrigger value="products">产品销售</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-4">
            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
              {/* Table */}
              <Card>
                <CardHeader>
                  <CardTitle>渠道明细</CardTitle>
                  <CardDescription>各流量渠道的会话数、转化率与收入</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>渠道</TableHead>
                        <TableHead className="text-right">会话数</TableHead>
                        <TableHead className="text-right">转化率</TableHead>
                        <TableHead className="text-right">收入</TableHead>
                        <TableHead className="text-right">占比</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {CHANNEL_DATA.map((row) => (
                        <TableRow key={row.channel}>
                          <TableCell className="font-medium">{row.channel}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.sessions.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.conversion}%
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            ¥{row.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Progress value={row.share} className="h-1.5 w-16" />
                              <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
                                {row.share}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Mini summary chart */}
              <Card>
                <CardHeader>
                  <CardTitle>会话分布</CardTitle>
                  <CardDescription>各渠道流量对比</CardDescription>
                </CardHeader>
                <CardContent>
                  <MiniBarChart
                    data={CHANNEL_DATA.map((d) => ({
                      label: d.channel,
                      value: d.sessions,
                      max: maxSessions,
                    }))}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>产品销售明细</CardTitle>
                <CardDescription>本期各产品销售量与收入</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>产品</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">销售量</TableHead>
                      <TableHead className="text-right">收入</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PRODUCT_DATA.map((row) => (
                      <TableRow key={row.sku}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {row.sku}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{row.sold}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          ¥{row.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.status === "热销"
                                ? "default"
                                : row.status === "增长"
                                  ? "secondary"
                                  : row.status === "下降"
                                    ? "destructive"
                                    : "outline"
                            }
                            size="sm"
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <ReportPage />,
}
