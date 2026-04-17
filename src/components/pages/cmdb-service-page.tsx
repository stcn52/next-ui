"use client"

import { useMemo, useState, type ComponentType } from "react"
import {
  AlertCircle,
  ArrowRightLeft,
  Clock3,
  Database,
  Layers3,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
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
  SERVICE_DETAILS,
  SERVICE_ICON_MAP,
  SERVICE_SUMMARIES,
  type CMDBServiceSummary,
} from "./cmdb-service-page.data"

function StateBadge({ status }: { status: CMDBServiceSummary["status"] }) {
  const variant =
    status === "正常" ? "secondary" : status === "告警" ? "destructive" : "outline"

  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {status}
    </Badge>
  )
}

function TierBadge({ tier }: { tier: CMDBServiceSummary["tier"] }) {
  return (
    <Badge variant="outline" size="sm" className="px-1.5 text-[10px]">
      {tier}
    </Badge>
  )
}

function ServiceMetric({
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

function ServiceSummaryCard({
  service,
  selected,
  onSelect,
}: {
  service: CMDBServiceSummary
  selected: boolean
  onSelect: () => void
}) {
  const Icon = SERVICE_ICON_MAP[service.name] ?? Layers3

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
            <p className="truncate text-sm font-semibold">{service.name}</p>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {service.team} · {service.owner}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <TierBadge tier={service.tier} />
          <StateBadge status={service.status} />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Progress value={service.health} className="h-1.5 flex-1" />
        <span className="text-[10px] tabular-nums text-muted-foreground">{service.health}%</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {service.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" size="sm" className="px-1.5 text-[10px]">
            {tag}
          </Badge>
        ))}
      </div>
    </button>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium leading-tight">{value}</p>
    </div>
  )
}

function StateChip({
  state,
}: {
  state: "已同步" | "待核验" | "异常"
}) {
  const variant =
    state === "已同步" ? "secondary" : state === "待核验" ? "outline" : "destructive"

  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {state}
    </Badge>
  )
}

function ServiceRelationCard({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: "upstream" | "downstream"
}) {
  const Icon = tone === "upstream" ? ShieldCheck : ArrowRightLeft
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </CardTitle>
        <CardDescription className="text-xs">高频依赖关系，按影响面从近到远排列</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between rounded-lg border px-3 py-2">
            <span className="text-sm font-medium">{item}</span>
            <Badge variant="outline" size="sm" className="px-1.5 text-[10px]">
              {tone === "upstream" ? "输入" : "输出"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function CMDBServicePage() {
  const [selectedId, setSelectedId] = useState(SERVICE_SUMMARIES[0].id)
  const [search, setSearch] = useState("")

  const filteredServices = useMemo(
    () =>
      SERVICE_SUMMARIES.filter((service) => {
        const text = `${service.name} ${service.owner} ${service.team} ${service.tags.join(" ")}`
          .toLowerCase()
        return text.includes(search.trim().toLowerCase())
      }),
    [search],
  )

  const selected = SERVICE_DETAILS[selectedId] ?? SERVICE_DETAILS[SERVICE_SUMMARIES[0].id]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">CMDB 服务总览</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              核心支付域 · 生产环境 · 最近同步 {selected.lastSync}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="px-1.5">
              全量同步完成
            </Badge>
            <Button variant="outline" size="sm">
              <Sparkles className="mr-1.5 size-4" />
              发现漂移
            </Button>
            <Button variant="outline" size="sm">
              <Wand2 className="mr-1.5 size-4" />
              自动校准
            </Button>
            <Button size="sm">
              <ServerCog className="mr-1.5 size-4" />
              新建关系
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-4 p-5">
        <section className="grid gap-3 md:grid-cols-4">
          <ServiceMetric label="服务总数" value="5" icon={Layers3} />
          <ServiceMetric label="平均健康度" value="90%" icon={ShieldCheck} />
          <ServiceMetric label="待核验 CI" value="3" icon={TriangleAlert} />
          <ServiceMetric label="最近变更" value="2 分钟前" icon={Clock3} />
        </section>

        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-[760px] overflow-hidden rounded-xl border bg-card"
        >
          <ResizablePanel defaultSize={28} minSize={22}>
            <div className="flex h-full flex-col border-r bg-muted/20">
              <div className="border-b p-3">
                <div className="relative">
                  <AlertCircle className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索服务、负责人、标签…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" size="sm" className="px-1.5 text-[10px]">
                    生产
                  </Badge>
                  <Badge variant="outline" size="sm" className="px-1.5 text-[10px]">
                    P0 / P1
                  </Badge>
                  <Badge variant="outline" size="sm" className="px-1.5 text-[10px]">
                    实时依赖
                  </Badge>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-2">
                <div className="space-y-1.5">
                  {filteredServices.map((service) => (
                    <ServiceSummaryCard
                      key={service.id}
                      service={service}
                      selected={service.id === selectedId}
                      onSelect={() => setSelectedId(service.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t px-3 py-2 text-[11px] text-muted-foreground">
                {filteredServices.length} 个服务 · {SERVICE_SUMMARIES.filter((item) => item.status === "告警").length} 个告警
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
                      <TierBadge tier={selected.tier} />
                      <StateBadge status={selected.status} />
                      <Badge variant="outline" size="sm" className="px-1.5">
                        {selected.env}
                      </Badge>
                    </div>
                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                      {selected.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      导出关系
                    </Button>
                    <Button size="sm">
                      生成变更单
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>负责人：{selected.owner}</span>
                  <span>区域：{selected.region}</span>
                  <span>运行环境：{selected.runtime}</span>
                  <span>版本：{selected.version}</span>
                  <span>联系人：{selected.contact}</span>
                </div>
              </div>

              <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
                <div className="border-b px-4 pt-3">
                  <TabsList className="h-8">
                    <TabsTrigger value="overview">概览</TabsTrigger>
                    <TabsTrigger value="relations">关系</TabsTrigger>
                    <TabsTrigger value="changes">变更</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">服务画像</CardTitle>
                        <CardDescription className="text-xs">
                          容量、SLA 和容灾信息集中展示，便于值班快速判断
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          <InfoItem label="SLA" value={selected.sla} />
                          <InfoItem label="RTO" value={selected.rto} />
                          <InfoItem label="RPO" value={selected.rpo} />
                          <InfoItem label="最后变更" value={selected.lastChange} />
                        </div>

                        <Separator />

                        <div className="grid gap-2 sm:grid-cols-2">
                          <InfoItem label="上游依赖" value={selected.upstream.join(" · ")} />
                          <InfoItem label="下游服务" value={selected.downstream.join(" · ")} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">运行状态</CardTitle>
                        <CardDescription className="text-xs">
                          关注健康度、值班与告警信息
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>健康度</span>
                            <span className="font-medium">{selected.health}%</span>
                          </div>
                          <Progress value={selected.health} className="h-2" />
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                          <p className="font-medium">值班联系人</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.contact}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                          <p className="font-medium">最近同步</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.lastSync}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-3 grid gap-3 xl:grid-cols-2">
                    <ServiceRelationCard title="上游服务" items={selected.upstream} tone="upstream" />

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Database className="size-4 text-muted-foreground" />
                          配置项
                        </CardTitle>
                        <CardDescription className="text-xs">
                          服务关联的 CI、数据库和配置单元
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>名称</TableHead>
                              <TableHead>类型</TableHead>
                              <TableHead>状态</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selected.configs.map((config) => (
                              <TableRow key={config.name}>
                                <TableCell className="py-2">
                                  <div className="space-y-0.5">
                                    <p className="text-sm font-medium">{config.name}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {config.owner} · {config.updatedAt}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 text-xs text-muted-foreground">
                                  {config.kind}
                                </TableCell>
                                <TableCell className="py-2">
                                  <StateChip state={config.state} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="relations" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-[1fr_auto_1fr]">
                    <ServiceRelationCard title="上游依赖" items={selected.upstream} tone="upstream" />

                    <Card className="flex min-h-[220px] items-center justify-center">
                      <CardContent className="w-full p-3 text-center">
                        <Badge variant="outline" size="sm" className="px-1.5">
                          当前服务
                        </Badge>
                        <h3 className="mt-2 text-base font-semibold">{selected.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{selected.team}</p>
                        <div className="mx-auto mt-3 flex max-w-[260px] flex-wrap justify-center gap-1.5">
                          {selected.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" size="sm" className="px-1.5 text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-left text-[11px] text-muted-foreground">
                          <div className="rounded-lg border px-2 py-2">
                            <p className="text-foreground">P{selected.tier.slice(1)}</p>
                            <p className="mt-0.5">优先级</p>
                          </div>
                          <div className="rounded-lg border px-2 py-2">
                            <p className="text-foreground">{selected.version}</p>
                            <p className="mt-0.5">当前版本</p>
                          </div>
                          <div className="rounded-lg border px-2 py-2">
                            <p className="text-foreground">{selected.health}%</p>
                            <p className="mt-0.5">健康度</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <ServiceRelationCard title="下游服务" items={selected.downstream} tone="downstream" />
                  </div>
                </TabsContent>

                <TabsContent value="changes" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">近期变更</CardTitle>
                        <CardDescription className="text-xs">
                          变更单与发布记录按时间倒序排列
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.changes.map((change) => (
                          <div key={change.title} className="rounded-lg border px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">{change.title}</p>
                              <Badge
                                variant={
                                  change.status === "成功"
                                    ? "secondary"
                                    : change.status === "审核中"
                                      ? "outline"
                                      : "destructive"
                                }
                                size="sm"
                                className="px-1.5"
                              >
                                {change.status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {change.actor} · {change.time}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <ShieldAlert className="size-4 text-muted-foreground" />
                          关联事件
                        </CardTitle>
                        <CardDescription className="text-xs">
                          服务抖动、告警和已恢复事件
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.incidents.map((incident) => (
                          <div key={incident.title} className="rounded-lg border px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">{incident.title}</p>
                              <Badge
                                variant={
                                  incident.severity === "高"
                                    ? "destructive"
                                    : incident.severity === "中"
                                      ? "outline"
                                      : "secondary"
                                }
                                size="sm"
                                className="px-1.5"
                              >
                                {incident.severity}
                              </Badge>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{incident.time}</span>
                              <span>·</span>
                              <span>{incident.status}</span>
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
