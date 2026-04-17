"use client"

import { useMemo, useState, type ComponentType } from "react"
import {
  Activity,
  Clock3,
  KeyRound,
  Monitor,
  ShieldCheck,
  Sparkles,
  Video,
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
  TERMINAL_ICON_MAP,
  TERMINAL_SESSION_DETAILS,
  TERMINAL_SESSION_SUMMARIES,
  type TerminalSessionSummary,
} from "./web-terminal-service-page.data"

function StatusBadge({ status }: { status: TerminalSessionSummary["status"] }) {
  const variant =
    status === "在线" ? "secondary" : status === "录屏中" ? "destructive" : status === "待审批" ? "outline" : "ghost"

  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {status}
    </Badge>
  )
}

function ProtocolBadge({ protocol }: { protocol: TerminalSessionSummary["protocol"] }) {
  return (
    <Badge variant="outline" size="sm" className="px-1.5 text-[10px]">
      {protocol}
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

function SessionCard({
  session,
  selected,
  onSelect,
}: {
  session: TerminalSessionSummary
  selected: boolean
  onSelect: () => void
}) {
  const Icon = TERMINAL_ICON_MAP[session.name] ?? Monitor

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
            <p className="truncate text-sm font-semibold">{session.name}</p>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {session.host} · {session.user}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <ProtocolBadge protocol={session.protocol} />
          <StatusBadge status={session.status} />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Progress value={session.health} className="h-1.5 flex-1" />
        <span className="text-[10px] tabular-nums text-muted-foreground">{session.health}%</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {session.tags.slice(0, 2).map((tag) => (
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

function AuditBadge({
  state,
}: {
  state: "已留痕" | "待复核" | "风险"
}) {
  const variant = state === "已留痕" ? "secondary" : state === "待复核" ? "outline" : "destructive"
  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {state}
    </Badge>
  )
}

function RecordBadge({
  state,
}: {
  state: "已保存" | "录制中" | "待审批"
}) {
  const variant = state === "已保存" ? "secondary" : state === "录制中" ? "destructive" : "outline"
  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {state}
    </Badge>
  )
}

function ResultBadge({
  result,
}: {
  result: "成功" | "失败" | "审计中"
}) {
  const variant = result === "成功" ? "secondary" : result === "失败" ? "destructive" : "outline"
  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {result}
    </Badge>
  )
}

export function WebTerminalServicePage() {
  const [selectedId, setSelectedId] = useState(TERMINAL_SESSION_SUMMARIES[0].id)
  const [search, setSearch] = useState("")

  const filteredSessions = useMemo(
    () =>
      TERMINAL_SESSION_SUMMARIES.filter((session) => {
        const text = `${session.name} ${session.host} ${session.user} ${session.bastion} ${session.tags.join(" ")}`
          .toLowerCase()
        return text.includes(search.trim().toLowerCase())
      }),
    [search],
  )

  const selected = TERMINAL_SESSION_DETAILS[selectedId] ?? TERMINAL_SESSION_DETAILS[TERMINAL_SESSION_SUMMARIES[0].id]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">Web Terminal 服务</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              浏览器 SSH 终端 · XTerm · 堡垒机录屏，最近会话 {selected.lastSeen}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="px-1.5">
              审计已开启
            </Badge>
            <Button variant="outline" size="sm">
              <Sparkles className="mr-1.5 size-4" />
              终端校验
            </Button>
            <Button variant="outline" size="sm">
              <Wand2 className="mr-1.5 size-4" />
              生成录屏
            </Button>
            <Button size="sm">
              <Monitor className="mr-1.5 size-4" />
              新建会话
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-4 p-5">
        <section className="grid gap-3 md:grid-cols-4">
          <StatCard label="在线会话" value="3" icon={Activity} />
          <StatCard label="录屏中" value="2" icon={Video} />
          <StatCard label="待审批" value="1" icon={Clock3} />
          <StatCard label="MFA 覆盖" value="100%" icon={ShieldCheck} />
        </section>

        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-[780px] overflow-hidden rounded-xl border bg-card"
        >
          <ResizablePanel defaultSize={28} minSize={22}>
            <div className="flex h-full flex-col border-r bg-muted/20">
              <div className="border-b p-3">
                <div className="relative">
                  <KeyRound className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索主机、用户、标签…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["SSH", "RDP", "XTerm", "录屏"].map((tag) => (
                    <Badge key={tag} variant="secondary" size="sm" className="px-1.5 text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-2">
                <div className="space-y-1.5">
                  {filteredSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      selected={session.id === selectedId}
                      onSelect={() => setSelectedId(session.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t px-3 py-2 text-[11px] text-muted-foreground">
                {filteredSessions.length} 个会话 ·{" "}
                {TERMINAL_SESSION_SUMMARIES.filter((item) => item.status === "录屏中").length} 个录屏中
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
                      <ProtocolBadge protocol={selected.protocol} />
                      <StatusBadge status={selected.status} />
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
                      申请提权
                    </Button>
                    <Button size="sm">开始录屏</Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>主机：{selected.host}</span>
                  <span>IP：{selected.ip}</span>
                  <span>堡垒机：{selected.bastion}</span>
                  <span>用户：{selected.user}</span>
                  <span>最后命令：{selected.lastCommand}</span>
                </div>
              </div>

              <Tabs defaultValue="terminal" className="flex min-h-0 flex-1 flex-col">
                <div className="border-b px-4 pt-3">
                  <TabsList className="h-8">
                    <TabsTrigger value="terminal">终端</TabsTrigger>
                    <TabsTrigger value="audit">审计</TabsTrigger>
                    <TabsTrigger value="recording">录屏</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="terminal" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">XTerm 终端</CardTitle>
                        <CardDescription className="text-xs">
                          浏览器内 SSH 会话，支持录屏、审计和高危命令追踪
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="rounded-lg border bg-zinc-950 px-3 py-3 text-[11px] text-emerald-300 shadow-inner">
                          <div data-slot="xterm-terminal" className="font-mono leading-5 whitespace-pre-wrap">
                            {selected.terminalLines.map((line) => (
                              <p key={line} className="whitespace-pre-wrap">
                                {line}
                              </p>
                            ))}
                            <p className="flex items-center gap-1">
                              <span>
                                {selected.user}@{selected.host} $
                              </span>
                              <span className="inline-block h-3 w-1 animate-pulse bg-emerald-300 align-middle" />
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <InfoField label="XTerm" value={selected.xterm} />
                          <InfoField label="鉴权" value={selected.auth} />
                          <InfoField label="MFA 覆盖" value={selected.mfa} />
                          <InfoField label="录屏策略" value={selected.recordingPolicy} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">连接摘要</CardTitle>
                        <CardDescription className="text-xs">
                          关注通道、审批和审计策略
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>会话健康</span>
                            <span className="font-medium">{selected.health}%</span>
                          </div>
                          <Progress value={selected.health} className="h-2" />
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                          <p className="font-medium">审计策略</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.auditPolicy}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                          <p className="font-medium">最近心跳</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.lastSeen}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                          <p className="font-medium">通道</p>
                          <p className="mt-1 text-xs text-muted-foreground">{selected.channels.join(" · ")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-3 grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">快捷键</CardTitle>
                        <CardDescription className="text-xs">
                          提升终端操作效率的常用组合键
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.shortcuts.map((shortcut) => (
                          <div key={shortcut.combo} className="flex items-center justify-between rounded-lg border px-3 py-2">
                            <span className="text-sm font-medium">{shortcut.combo}</span>
                            <span className="text-xs text-muted-foreground">{shortcut.meaning}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">基础信息</CardTitle>
                        <CardDescription className="text-xs">
                          终端、主机与审批元数据
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <InfoField label="区域" value={selected.region} />
                        <InfoField label="最后命令" value={selected.lastCommand} />
                        <InfoField label="说明" value={selected.description} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="audit" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">命令审计</CardTitle>
                        <CardDescription className="text-xs">
                          登录、提权、执行命令按时间倒序记录
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>命令</TableHead>
                              <TableHead>目标</TableHead>
                              <TableHead>时间</TableHead>
                              <TableHead>结果</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selected.commands.map((command) => (
                              <TableRow key={`${command.command}-${command.time}`}>
                                <TableCell className="py-2">
                                  <p className="text-sm font-medium">{command.command}</p>
                                </TableCell>
                                <TableCell className="py-2 text-xs text-muted-foreground">{command.target}</TableCell>
                                <TableCell className="py-2 text-xs text-muted-foreground">{command.time}</TableCell>
                                <TableCell className="py-2">
                                  <ResultBadge result={command.result} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">审计摘要</CardTitle>
                        <CardDescription className="text-xs">
                          审批、风险和脱敏状态
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.audits.map((audit) => (
                          <div key={audit.title} className="rounded-lg border px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">{audit.title}</p>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  {audit.detail} · {audit.time}
                                </p>
                              </div>
                              <AuditBadge state={audit.state} />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recording" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">录屏片段</CardTitle>
                        <CardDescription className="text-xs">
                          支持回放、书签和片段下载
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.recordings.map((recording) => (
                          <div key={recording.title} className="rounded-lg border px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">{recording.title}</p>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  {recording.operator} · {recording.time} · {recording.duration}
                                </p>
                              </div>
                              <RecordBadge state={recording.state} />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">录屏策略</CardTitle>
                        <CardDescription className="text-xs">
                          录屏、审批与回放规则
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <InfoField label="录屏策略" value={selected.recordingPolicy} />
                        <InfoField label="审计策略" value={selected.auditPolicy} />
                        <InfoField label="通道" value={selected.channels.join(" · ")} />
                        <InfoField label="MFA" value={selected.mfa} />
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
