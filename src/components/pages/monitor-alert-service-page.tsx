"use client"

import { useMemo, useState, type ComponentType } from "react"
import {
  Activity,
  AlertTriangle,
  Bell,
  MessagesSquare,
  Radar,
  Sparkles,
  TimerReset,
  Wand2,
} from "lucide-react"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/display/card"
import { Input } from "@/components/ui/inputs/input"
import { Progress } from "@/components/ui/display/progress"
import { Separator } from "@/components/ui/display/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/navigation/tabs"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/display/table"
import { cn } from "@/lib/utils"
import {
  ALERT_SERVICE_DETAILS,
  ALERT_SERVICE_ICON_MAP,
  ALERT_SERVICE_SUMMARIES,
  type AlertServiceSummary,
} from "./monitor-alert-service-page.data"

function StatusBadge({ status }: { status: AlertServiceSummary["status"] }) {
  const variant =
    status === "正常" ? "secondary" : status === "告警" ? "destructive" : "outline"

  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {status}
    </Badge>
  )
}

function SourceBadge({ source }: { source: AlertServiceSummary["source"] }) {
  return (
    <Badge variant="outline" size="sm" className="px-1.5 text-[10px]">
      {source}
    </Badge>
  )
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-lg font-semibold leading-none tracking-tight">{value}</p>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}

function AlertCard({
  item,
  selected,
  onSelect,
}: {
  item: AlertServiceSummary
  selected: boolean
  onSelect: () => void
}) {
  const Icon = ALERT_SERVICE_ICON_MAP[item.name] ?? AlertTriangle

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-xl border px-3 py-3 text-left transition-colors",
        selected ? "border-primary bg-primary/5 shadow-sm" : "bg-background hover:bg-muted/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon className="size-4 shrink-0 text-muted-foreground" />
            <p className="truncate text-sm font-semibold">{item.name}</p>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {item.team} · {item.owner}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <SourceBadge source={item.source} />
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Progress value={item.health} className="h-1.5 flex-1" />
        <span className="text-[10px] tabular-nums text-muted-foreground">{item.health}%</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {item.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" size="sm" className="px-1.5 text-[10px]">
            {tag}
          </Badge>
        ))}
      </div>
    </button>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium leading-tight">{value}</p>
    </div>
  )
}

function RuleStateBadge({
  state,
}: {
  state: "启用" | "待核验" | "静默"
}) {
  const variant = state === "启用" ? "secondary" : state === "待核验" ? "outline" : "ghost"
  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {state}
    </Badge>
  )
}

function RouteBadge({
  state,
}: {
  state: "已接入" | "灰度" | "待核验"
}) {
  const variant = state === "已接入" ? "secondary" : state === "灰度" ? "outline" : "ghost"
  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {state}
    </Badge>
  )
}

function EventBadge({
  status,
}: {
  status: "已收敛" | "处理中" | "已关闭"
}) {
  const variant =
    status === "处理中" ? "destructive" : status === "已收敛" ? "secondary" : "outline"
  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {status}
    </Badge>
  )
}

export function MonitorAlertServicePage() {
  const [selectedId, setSelectedId] = useState(ALERT_SERVICE_SUMMARIES[0].id)
  const [search, setSearch] = useState("")

  const filteredItems = useMemo(
    () =>
      ALERT_SERVICE_SUMMARIES.filter((item) => {
        const text = `${item.name} ${item.team} ${item.owner} ${item.source} ${item.tags.join(" ")}`
          .toLowerCase()
        return text.includes(search.trim().toLowerCase())
      }),
    [search],
  )

  const selected = ALERT_SERVICE_DETAILS[selectedId] ?? ALERT_SERVICE_DETAILS[ALERT_SERVICE_SUMMARIES[0].id]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">监控告警服务</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              聚合 Prometheus / Zabbix 告警并分发到企微、钉钉和邮件，最近同步 {selected.lastSync}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="px-1.5">
              多通道分发
            </Badge>
            <Button variant="outline" size="sm">
              <Sparkles className="mr-1.5 size-4" />
              校验路由
            </Button>
            <Button variant="outline" size="sm">
              <Wand2 className="mr-1.5 size-4" />
              调整策略
            </Button>
            <Button size="sm">
              <Bell className="mr-1.5 size-4" />
              新增规则
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-4 p-5">
        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard label="告警规则" value="19" icon={Radar} />
          <MetricCard label="活跃告警" value="6" icon={AlertTriangle} />
          <MetricCard label="通知通道" value="3" icon={MessagesSquare} />
          <MetricCard label="平均收敛" value="3 分钟" icon={TimerReset} />
        </section>

        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-[760px] overflow-hidden rounded-xl border bg-card"
        >
          <ResizablePanel defaultSize={28} minSize={22}>
            <div className="flex h-full flex-col border-r bg-muted/20">
              <div className="border-b p-3">
                <div className="relative">
                  <Activity className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索监控源、团队、标签…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Prometheus", "Zabbix", "企微", "钉钉"].map((source) => (
                    <Badge key={source} variant="secondary" size="sm" className="px-1.5 text-[10px]">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-2">
                <div className="space-y-1.5">
                  {filteredItems.map((item) => (
                    <AlertCard
                      key={item.id}
                      item={item}
                      selected={item.id === selectedId}
                      onSelect={() => setSelectedId(item.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t px-3 py-2 text-[11px] text-muted-foreground">
                {filteredItems.length} 个监控项 ·{" "}
                {ALERT_SERVICE_SUMMARIES.filter((item) => item.status === "告警").length} 个告警
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={72}>
            <div className="flex h-full min-h-0 flex-col">
              <div className="border-b px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold tracking-tight">{selected.name}</h2>
                      <SourceBadge source={selected.source} />
                      <StatusBadge status={selected.status} />
                    </div>
                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                      {selected.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      预演路由
                    </Button>
                    <Button size="sm">分发告警</Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>负责人：{selected.owner}</span>
                  <span>团队：{selected.team}</span>
                  <span>区域：{selected.region}</span>
                  <span>联系人：{selected.contact}</span>
                  <span>MTTA：{selected.mtta}</span>
                </div>
              </div>

              <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
                <div className="border-b px-4 pt-3">
                  <TabsList className="h-8">
                    <TabsTrigger value="overview">概览</TabsTrigger>
                    <TabsTrigger value="routing">路由</TabsTrigger>
                    <TabsTrigger value="events">事件</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">告警策略</CardTitle>
                        <CardDescription className="text-xs">
                          规则、阈值和抑制窗口统一收口
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          <InfoField label="去重窗口" value={selected.dedupWindow} />
                          <InfoField label="静默窗口" value={selected.muteWindow} />
                          <InfoField label="监控源" value={selected.source} />
                          <InfoField label="通知通道" value={selected.channels.join(" · ")} />
                        </div>

                        <Separator />

                        <div className="grid gap-2 sm:grid-cols-2">
                          {selected.rules.map((rule) => (
                            <div key={rule.name} className="rounded-lg border px-3 py-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium">{rule.name}</p>
                                <RuleStateBadge state={rule.state} />
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {rule.severity} · {rule.threshold}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">运行状态</CardTitle>
                        <CardDescription className="text-xs">
                          关注健康度、收敛率和最近同步
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>收敛度</span>
                            <span className="font-medium">{selected.health}%</span>
                          </div>
                          <Progress value={selected.health} className="h-2" />
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                          <p className="font-medium">最近同步</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.lastSync}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                          <p className="font-medium">分发通道</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.channels.join(" · ")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-3 grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">监控源</CardTitle>
                        <CardDescription className="text-xs">
                          Prometheus 与 Zabbix 告警进入收敛总线的入口
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.rules.slice(0, 3).map((rule) => (
                          <div key={rule.name} className="flex items-center justify-between rounded-lg border px-3 py-2">
                            <div>
                              <p className="text-sm font-medium">{rule.name}</p>
                              <p className="mt-1 text-[11px] text-muted-foreground">{rule.threshold}</p>
                            </div>
                            <Badge variant="outline" size="sm" className="px-1.5">
                              {rule.severity}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">通道摘要</CardTitle>
                        <CardDescription className="text-xs">
                          企微、钉钉和邮件的分发策略
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.routes.map((route) => (
                          <div key={`${route.channel}-${route.target}`} className="rounded-lg border px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">{route.channel}</p>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  {route.target} · {route.policy}
                                </p>
                              </div>
                              <RouteBadge state={route.state} />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="routing" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">路由规则</CardTitle>
                        <CardDescription className="text-xs">
                          按严重级别和业务域分发到不同值班群
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>通道</TableHead>
                              <TableHead>目标</TableHead>
                              <TableHead>策略</TableHead>
                              <TableHead>状态</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selected.routes.map((route) => (
                              <TableRow key={`${route.channel}-${route.target}`}>
                                <TableCell className="py-2">
                                  <p className="text-sm font-medium">{route.channel}</p>
                                </TableCell>
                                <TableCell className="py-2 text-xs text-muted-foreground">{route.target}</TableCell>
                                <TableCell className="py-2 text-xs text-muted-foreground">{route.policy}</TableCell>
                                <TableCell className="py-2">
                                  <RouteBadge state={route.state} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">静默与升级</CardTitle>
                        <CardDescription className="text-xs">
                          在夜间窗口和升级路径上降低噪音
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <InfoField label="去重窗口" value={selected.dedupWindow} />
                        <InfoField label="静默窗口" value={selected.muteWindow} />
                        <InfoField label="MTTA" value={selected.mtta} />
                        <InfoField label="联系人" value={selected.contact} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="events" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">最近事件</CardTitle>
                        <CardDescription className="text-xs">
                          近期告警、收敛和关闭记录
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>事件</TableHead>
                              <TableHead>来源</TableHead>
                              <TableHead>级别</TableHead>
                              <TableHead>状态</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selected.events.map((event) => (
                              <TableRow key={`${event.title}-${event.time}`}>
                                <TableCell className="py-2">
                                  <p className="text-sm font-medium">{event.title}</p>
                                  <p className="mt-1 text-[11px] text-muted-foreground">{event.time}</p>
                                </TableCell>
                                <TableCell className="py-2 text-xs text-muted-foreground">{event.source}</TableCell>
                                <TableCell className="py-2 text-xs text-muted-foreground">{event.severity}</TableCell>
                                <TableCell className="py-2">
                                  <EventBadge status={event.status} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">抑制摘要</CardTitle>
                        <CardDescription className="text-xs">
                          告警降噪和静默窗口配置
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.channels.map((channel) => (
                          <div key={channel} className="rounded-lg border px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">{channel}</p>
                              <Badge variant="outline" size="sm" className="px-1.5">
                                已分发
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
