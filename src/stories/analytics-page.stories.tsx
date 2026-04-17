/**
 * Analytics Page — data visualisation dashboard with KPIs, charts, and filters.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect } from "storybook/test"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/display/card"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/display/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Progress } from "@/components/ui/display/progress"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Globe,
  TrendingUp,
  Users,
} from "lucide-react"

const meta: Meta = {
  title: "Pages/Analytics",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "数据分析仪表盘 — KPI 卡片、流量趋势、渠道分布、设备统计，展示组件在数据可视化场景中的组合方式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

const KPI_DATA = [
  {
    title: "Total Visitors",
    value: "45,231",
    change: "+20.1%",
    trend: "up" as const,
    icon: Users,
    description: "from last month",
  },
  {
    title: "Page Views",
    value: "128,430",
    change: "+14.2%",
    trend: "up" as const,
    icon: BarChart3,
    description: "from last month",
  },
  {
    title: "Bounce Rate",
    value: "24.3%",
    change: "-4.5%",
    trend: "down" as const,
    icon: TrendingUp,
    description: "from last month",
  },
  {
    title: "Avg. Session",
    value: "3m 42s",
    change: "+12s",
    trend: "up" as const,
    icon: Globe,
    description: "from last month",
  },
]

const CHANNEL_DATA = [
  { name: "Organic Search", visitors: 18_420, share: 40.7, color: "bg-primary" },
  { name: "Direct", visitors: 11_308, share: 25.0, color: "bg-chart-2" },
  { name: "Social Media", visitors: 7_694, share: 17.0, color: "bg-chart-3" },
  { name: "Referral", visitors: 5_428, share: 12.0, color: "bg-chart-4" },
  { name: "Email", visitors: 2_381, share: 5.3, color: "bg-chart-5" },
]

const PAGES_DATA = [
  { path: "/", views: 32_140, unique: 24_320, bounce: "18%" },
  { path: "/pricing", views: 18_200, unique: 14_810, bounce: "32%" },
  { path: "/docs/getting-started", views: 12_460, unique: 9_870, bounce: "22%" },
  { path: "/blog/react-19", views: 8_740, unique: 7_210, bounce: "45%" },
  { path: "/dashboard", views: 6_320, unique: 5_440, bounce: "12%" },
]

const DEVICE_DATA = [
  { device: "Desktop", percentage: 58 },
  { device: "Mobile", percentage: 32 },
  { device: "Tablet", percentage: 10 },
]

function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">
              April 1 – April 15, 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Live</Badge>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </div>
      </header>

      <main className="p-5 space-y-5">
        {/* KPI Cards */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {KPI_DATA.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {kpi.trend === "up" ? (
                    <ArrowUp className="size-3 text-green-600" />
                  ) : (
                    <ArrowDown className="size-3 text-green-600" />
                  )}
                  <span className="text-green-600 font-medium">{kpi.change}</span>
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs: Overview / Pages / Channels */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-5 lg:grid-cols-7">
              {/* Traffic chart placeholder */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Traffic Trend</CardTitle>
                  <CardDescription>
                    Daily visitor count over the last 14 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Simplified bar chart using pure CSS */}
                  <div className="flex items-end gap-1 h-40">
                    {[65, 40, 55, 78, 82, 45, 30, 68, 90, 72, 85, 60, 95, 88].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
                          style={{ height: `${h}%` }}
                          title={`Day ${i + 1}: ${Math.round(h * 45)} visitors`}
                        />
                      ),
                    )}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Apr 1</span>
                    <span>Apr 7</span>
                    <span>Apr 14</span>
                  </div>
                </CardContent>
              </Card>

              {/* Device breakdown */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Devices</CardTitle>
                  <CardDescription>Visitor breakdown by device type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {DEVICE_DATA.map((d) => (
                    <div key={d.device} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{d.device}</span>
                        <span className="font-medium">{d.percentage}%</span>
                      </div>
                      <Progress value={d.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pages" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border text-sm">
                  <div className="grid grid-cols-4 gap-4 border-b bg-muted/50 px-4 py-2.5 font-medium">
                    <span>Page</span>
                    <span className="text-right">Views</span>
                    <span className="text-right">Unique</span>
                    <span className="text-right">Bounce</span>
                  </div>
                  {PAGES_DATA.map((page) => (
                    <div
                      key={page.path}
                      className="grid grid-cols-4 gap-4 border-b px-4 py-2.5 last:border-0"
                    >
                      <code className="text-xs">{page.path}</code>
                      <span className="text-right font-medium">
                        {page.views.toLocaleString()}
                      </span>
                      <span className="text-right text-muted-foreground">
                        {page.unique.toLocaleString()}
                      </span>
                      <span className="text-right text-muted-foreground">
                        {page.bounce}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Channels</CardTitle>
                <CardDescription>
                  Where your visitors come from
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Stacked bar */}
                <div className="flex h-4 rounded-full overflow-hidden mb-4">
                  {CHANNEL_DATA.map((ch) => (
                    <div
                      key={ch.name}
                      className={cn(ch.color, "transition-all")}
                      style={{ width: `${ch.share}%` }}
                      title={`${ch.name}: ${ch.share}%`}
                    />
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="space-y-3">
                  {CHANNEL_DATA.map((ch) => (
                    <div key={ch.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn("size-3 rounded-full", ch.color)} />
                        <span>{ch.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          {ch.visitors.toLocaleString()}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {ch.share}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// Need cn for conditional classes in channel chart
import { cn } from "@/lib/utils"

export const Default: Story = {
  render: () => <AnalyticsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Analytics")).toBeVisible()
    await expect(canvas.getByText("45,231")).toBeVisible()
    await expect(canvas.getByText("Total Visitors")).toBeVisible()
  },
}
