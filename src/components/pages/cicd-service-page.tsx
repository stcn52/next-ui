"use client"

import { useMemo, useState, type ComponentType } from "react"
import {
  GitBranch,
  PlayCircle,
  Rocket,
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
  CICD_ICON_MAP,
  CICD_PIPELINE_DETAILS,
  CICD_PIPELINE_SUMMARIES,
  type CICDRun,
  type CICDStage,
  type CICDPipelineSummary,
} from "./cicd-service-page.data"

function StatusBadge({ status }: { status: CICDPipelineSummary["status"] }) {
  const variant =
    status === "成功" ? "secondary" : status === "失败" ? "destructive" : "outline"

  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {status}
    </Badge>
  )
}

function EngineBadge({ engine }: { engine: CICDPipelineSummary["engine"] }) {
  return (
    <Badge variant="outline" size="sm" className="px-1.5 text-[10px]">
      {engine}
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

function PipelineCard({
  pipeline,
  selected,
  onSelect,
}: {
  pipeline: CICDPipelineSummary
  selected: boolean
  onSelect: () => void
}) {
  const Icon = CICD_ICON_MAP[pipeline.name] ?? GitBranch

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
            <p className="truncate text-sm font-semibold">{pipeline.name}</p>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {pipeline.team} · {pipeline.repo}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <EngineBadge engine={pipeline.engine} />
          <StatusBadge status={pipeline.status} />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Progress value={pipeline.health} className="h-1.5 flex-1" />
        <span className="text-[10px] tabular-nums text-muted-foreground">{pipeline.health}%</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {pipeline.tags.slice(0, 2).map((tag) => (
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

function StageBadge({
  state,
}: {
  state: CICDStage["state"]
}) {
  const variant =
    state === "成功"
      ? "secondary"
      : state === "失败"
        ? "destructive"
        : state === "运行中"
          ? "outline"
          : "ghost"

  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {state}
    </Badge>
  )
}

function RunBadge({
  status,
}: {
  status: CICDRun["status"]
}) {
  const variant = status === "成功" ? "secondary" : status === "失败" ? "destructive" : "outline"
  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {status}
    </Badge>
  )
}

export function CICDServicePage() {
  const [selectedId, setSelectedId] = useState(CICD_PIPELINE_SUMMARIES[0].id)
  const [search, setSearch] = useState("")

  const filteredPipelines = useMemo(
    () =>
      CICD_PIPELINE_SUMMARIES.filter((pipeline) => {
        const text = `${pipeline.name} ${pipeline.repo} ${pipeline.team} ${pipeline.engine} ${pipeline.branch} ${pipeline.tags.join(" ")}`
          .toLowerCase()
        return text.includes(search.trim().toLowerCase())
      }),
    [search],
  )

  const selected = CICD_PIPELINE_DETAILS[selectedId] ?? CICD_PIPELINE_DETAILS[CICD_PIPELINE_SUMMARIES[0].id]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">CI/CD 流水线</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              GitLab / GitHub / Jenkins / Tekton 统一编排，最近构建 {selected.lastBuild}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="px-1.5">
              多平台接入
            </Badge>
            <Button variant="outline" size="sm">
              <Sparkles className="mr-1.5 size-4" />
              校验流水线
            </Button>
            <Button variant="outline" size="sm">
              <Wand2 className="mr-1.5 size-4" />
              生成发布单
            </Button>
            <Button size="sm">
              <PlayCircle className="mr-1.5 size-4" />
              触发构建
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-4 p-5">
        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard label="流水线总数" value="5" icon={GitBranch} />
          <MetricCard label="运行中" value="2" icon={PlayCircle} />
          <MetricCard label="发布成功率" value="96%" icon={Rocket} />
          <MetricCard label="平均交付时长" value="11 分钟" icon={TimerReset} />
        </section>

        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-[760px] overflow-hidden rounded-xl border bg-card"
        >
          <ResizablePanel defaultSize={28} minSize={22}>
            <div className="flex h-full flex-col border-r bg-muted/20">
              <div className="border-b p-3">
                <div className="relative">
                  <GitBranch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索流水线、仓库、标签…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["GitLab", "GitHub", "Jenkins", "Tekton"].map((engine) => (
                    <Badge key={engine} variant="secondary" size="sm" className="px-1.5 text-[10px]">
                      {engine}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-2">
                <div className="space-y-1.5">
                  {filteredPipelines.map((pipeline) => (
                    <PipelineCard
                      key={pipeline.id}
                      pipeline={pipeline}
                      selected={pipeline.id === selectedId}
                      onSelect={() => setSelectedId(pipeline.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t px-3 py-2 text-[11px] text-muted-foreground">
                {filteredPipelines.length} 个流水线 ·{" "}
                {CICD_PIPELINE_SUMMARIES.filter((item) => item.status === "失败").length} 个失败
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
                      <EngineBadge engine={selected.engine} />
                      <StatusBadge status={selected.status} />
                      <Badge variant="outline" size="sm" className="px-1.5">
                        {selected.branch}
                      </Badge>
                    </div>
                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                      {selected.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      预演发布
                    </Button>
                    <Button size="sm">执行流水线</Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>负责人：{selected.team}</span>
                  <span>仓库：{selected.repo}</span>
                  <span>触发器：{selected.trigger}</span>
                  <span>审批：{selected.approval}</span>
                  <span>制品：{selected.artifact}</span>
                </div>
              </div>

              <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
                <div className="border-b px-4 pt-3">
                  <TabsList className="h-8">
                    <TabsTrigger value="overview">概览</TabsTrigger>
                    <TabsTrigger value="stages">阶段</TabsTrigger>
                    <TabsTrigger value="history">历史</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">流水线配置</CardTitle>
                        <CardDescription className="text-xs">
                          构建、测试、镜像和发布策略统一展示
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          <InfoField label="仓库" value={selected.repo} />
                          <InfoField label="分支" value={selected.branch} />
                          <InfoField label="触发器" value={selected.trigger} />
                          <InfoField label="审批" value={selected.approval} />
                        </div>

                        <Separator />

                        <div className="grid gap-2 sm:grid-cols-2">
                          {selected.checks.map((item) => (
                            <InfoField key={item.label} label={item.label} value={item.value} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">交付状态</CardTitle>
                        <CardDescription className="text-xs">
                          关注健康度、交付时长和接入平台
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
                          <p className="font-medium">交付时长</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.leadTime}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                          <p className="font-medium">最近构建</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.lastBuild}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-3 grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">接入平台</CardTitle>
                        <CardDescription className="text-xs">
                          GitLab / GitHub / Jenkins / Tekton / 发布系统
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.integrations.map((item) => (
                          <div key={item} className="flex items-center justify-between rounded-lg border px-3 py-2">
                            <span className="text-sm font-medium">{item}</span>
                            <Badge variant="outline" size="sm" className="px-1.5">
                              已接入
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">发布环境</CardTitle>
                        <CardDescription className="text-xs">
                          生产、灰度和预发环境按序推进
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.environments.map((item, index) => (
                          <div key={item} className="rounded-lg border px-3 py-2">
                            <p className="text-sm font-medium">{item}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              阶段 {index + 1} · {selected.name}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="stages" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">阶段编排</CardTitle>
                        <CardDescription className="text-xs">
                          从源码到发布的每个阶段都可独立收口
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.stages.map((stage) => (
                          <div key={stage.name} className="rounded-lg border px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">{stage.name}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {stage.owner} · {stage.duration}
                                </p>
                              </div>
                              <StageBadge state={stage.state} />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">阶段关注点</CardTitle>
                        <CardDescription className="text-xs">
                          关键检查项与自动化校验摘要
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.checks.map((item) => (
                          <div key={item.label} className="rounded-lg border px-3 py-2">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="mt-1 text-sm font-medium">{item.value}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="m-0 flex-1 overflow-auto p-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">最近构建记录</CardTitle>
                      <CardDescription className="text-xs">
                        按时间倒序排列，支持快速定位失败和回滚
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>构建号</TableHead>
                            <TableHead>提交</TableHead>
                            <TableHead>触发人</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>耗时</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selected.runs.map((run) => (
                            <TableRow key={`${run.build}-${run.time}`}>
                              <TableCell className="py-2">
                                <p className="text-sm font-medium">{run.build}</p>
                              </TableCell>
                              <TableCell className="py-2 text-xs text-muted-foreground">{run.commit}</TableCell>
                              <TableCell className="py-2 text-xs text-muted-foreground">{run.actor}</TableCell>
                              <TableCell className="py-2">
                                <RunBadge status={run.status} />
                              </TableCell>
                              <TableCell className="py-2 text-xs text-muted-foreground">{run.duration}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
