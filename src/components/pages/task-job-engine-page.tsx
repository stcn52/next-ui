"use client"

import { useMemo, useState, type ComponentType } from "react"
import {
  Clock3,
  FileDown,
  Layers3,
  PlayCircle,
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
  JOB_DETAILS,
  JOB_ICON_MAP,
  JOB_SUMMARIES,
  type JobSummary,
} from "./task-job-engine-page.data"

function StatusBadge({ status }: { status: JobSummary["status"] }) {
  const variant = status === "运行中" ? "secondary" : status === "等待" ? "outline" : status === "失败" ? "destructive" : "ghost"
  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {status}
    </Badge>
  )
}

function TypeBadge({ type }: { type: JobSummary["type"] }) {
  return (
    <Badge variant="outline" size="sm" className="px-1.5 text-[10px]">
      {type}
    </Badge>
  )
}

function StatCard({
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

function JobCard({
  job,
  selected,
  onSelect,
}: {
  job: JobSummary
  selected: boolean
  onSelect: () => void
}) {
  const Icon = JOB_ICON_MAP[job.name] ?? PlayCircle

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
            <p className="truncate text-sm font-semibold">{job.name}</p>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {job.team} · {job.owner}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <TypeBadge type={job.type} />
          <StatusBadge status={job.status} />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Progress value={job.successRate} className="h-1.5 flex-1" />
        <span className="text-[10px] tabular-nums text-muted-foreground">{job.successRate}%</span>
      </div>

      <div className="mt-2 text-[11px] text-muted-foreground">
        {job.schedule} · 最近执行 {job.lastRun}
      </div>
    </button>
  )
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium leading-tight">{value}</p>
    </div>
  )
}

export function TaskJobEnginePage() {
  const [selectedId, setSelectedId] = useState(JOB_SUMMARIES[0].id)
  const [search, setSearch] = useState("")

  const filteredJobs = useMemo(
    () =>
      JOB_SUMMARIES.filter((job) => {
        const text = `${job.name} ${job.owner} ${job.team} ${job.schedule} ${job.tags.join(" ")}`
          .toLowerCase()
        return text.includes(search.trim().toLowerCase())
      }),
    [search],
  )

  const selected = JOB_DETAILS[selectedId] ?? JOB_DETAILS[JOB_SUMMARIES[0].id]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">作业调度服务</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              批量脚本、文件分发和 Cron 任务统一管理，最近执行 {selected.lastRun}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="px-1.5">
              审批流已开启
            </Badge>
            <Button variant="outline" size="sm">
              <Sparkles className="mr-1.5 size-4" />
              任务校验
            </Button>
            <Button variant="outline" size="sm">
              <Wand2 className="mr-1.5 size-4" />
              调整策略
            </Button>
            <Button size="sm">
              <PlayCircle className="mr-1.5 size-4" />
              新建任务
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-4 p-5">
        <section className="grid gap-3 md:grid-cols-4">
          <StatCard label="运行中" value="1" icon={PlayCircle} />
          <StatCard label="等待队列" value="2" icon={Clock3} />
          <StatCard label="成功率" value="96%" icon={Layers3} />
          <StatCard label="超时任务" value="0" icon={TimerReset} />
        </section>

        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-[720px] overflow-hidden rounded-xl border bg-card"
        >
          <ResizablePanel defaultSize={28} minSize={22}>
            <div className="flex h-full flex-col border-r bg-muted/20">
              <div className="border-b p-3">
                <div className="relative">
                  <FileDown className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索任务、队列、标签…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Cron", "Batch", "Distribution", "Adhoc"].map((type) => (
                    <Badge key={type} variant="secondary" size="sm" className="px-1.5 text-[10px]">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-2">
                <div className="space-y-1.5">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      selected={job.id === selectedId}
                      onSelect={() => setSelectedId(job.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t px-3 py-2 text-[11px] text-muted-foreground">
                {filteredJobs.length} 个任务 · {JOB_SUMMARIES.filter((item) => item.status === "失败").length} 个失败
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
                      <TypeBadge type={selected.type} />
                      <StatusBadge status={selected.status} />
                    </div>
                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                      {selected.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      预演
                    </Button>
                    <Button size="sm">
                      执行任务
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>负责人：{selected.owner}</span>
                  <span>队列：{selected.queue}</span>
                  <span>超时：{selected.timeout}</span>
                  <span>重试：{selected.retryPolicy}</span>
                  <span>目标数：{selected.targetCount}</span>
                </div>
              </div>

              <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
                <div className="border-b px-4 pt-3">
                  <TabsList className="h-8">
                    <TabsTrigger value="overview">执行概览</TabsTrigger>
                    <TabsTrigger value="history">历史执行</TabsTrigger>
                    <TabsTrigger value="schedule">调度策略</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">执行配置</CardTitle>
                        <CardDescription className="text-xs">
                          脚本任务、分发任务和 Cron 作业统一配置
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          <MetaField label="调度队列" value={selected.queue} />
                          <MetaField label="执行目标" value={`${selected.targetCount} 个目标`} />
                          <MetaField label="演练模式" value={selected.dryRun ? "开启" : "关闭"} />
                          <MetaField label="集成" value={selected.integration.join(" · ")} />
                        </div>

                        <Separator />

                        <div className="grid gap-2 sm:grid-cols-2">
                          {selected.scheduleRules.map((item) => (
                            <MetaField key={item.label} label={item.label} value={item.value} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">运行状态</CardTitle>
                        <CardDescription className="text-xs">关注成功率和队列压力</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>成功率</span>
                            <span className="font-medium">{selected.successRate}%</span>
                          </div>
                          <Progress value={selected.successRate} className="h-2" />
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                          <p className="font-medium">最近执行</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.lastRun}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                          <p className="font-medium">触发方式</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.schedule}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="m-0 flex-1 overflow-auto p-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">最近执行记录</CardTitle>
                      <CardDescription className="text-xs">按时间倒序排列，支持快速追踪失败和重试</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>任务</TableHead>
                            <TableHead>时间</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>耗时</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selected.history.map((item) => (
                            <TableRow key={`${item.task}-${item.time}`}>
                              <TableCell className="py-2">
                                <p className="text-sm font-medium">{item.task}</p>
                              </TableCell>
                              <TableCell className="py-2 text-xs text-muted-foreground">{item.time}</TableCell>
                              <TableCell className="py-2">
                                <Badge
                                  variant={
                                    item.status === "成功"
                                      ? "secondary"
                                      : item.status === "重试"
                                        ? "outline"
                                        : "destructive"
                                  }
                                  size="sm"
                                  className="px-1.5"
                                >
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-2 text-xs text-muted-foreground">{item.duration}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schedule" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">调度策略</CardTitle>
                        <CardDescription className="text-xs">Cron、窗口和审批策略</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.scheduleRules.map((item) => (
                          <div key={item.label} className="rounded-lg border px-3 py-2">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="mt-1 text-sm font-medium">{item.value}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">集成通道</CardTitle>
                        <CardDescription className="text-xs">
                          执行引擎对接的外部系统和工具链
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.integration.map((item) => (
                          <div key={item} className="flex items-center justify-between rounded-lg border px-3 py-2">
                            <span className="text-sm font-medium">{item}</span>
                            <Badge variant="outline" size="sm" className="px-1.5">
                              已接入
                            </Badge>
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

