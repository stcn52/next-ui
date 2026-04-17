"use client"

import { useMemo, useState, type ComponentType } from "react"
import {
  ArrowRightLeft,
  Cloud,
  Database,
  Layers3,
  ServerCog,
  Sparkles,
  TreePine,
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
import { cn } from "@/lib/utils"
import {
  ASSET_DETAILS,
  ASSET_ICON_MAP,
  ASSET_SUMMARIES,
  type AssetSummary,
} from "./cmdb-asset-management-page.data"

function TypeBadge({ type }: { type: AssetSummary["type"] }) {
  return (
    <Badge variant="outline" size="sm" className="px-1.5 text-[10px]">
      {type}
    </Badge>
  )
}

function StatusBadge({ status }: { status: AssetSummary["status"] }) {
  const variant = status === "正常" ? "secondary" : status === "告警" ? "destructive" : "outline"
  return (
    <Badge variant={variant} size="sm" className="px-1.5">
      {status}
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

function AssetCard({
  asset,
  selected,
  onSelect,
}: {
  asset: AssetSummary
  selected: boolean
  onSelect: () => void
}) {
  const Icon = ASSET_ICON_MAP[asset.type] ?? Layers3

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
            <p className="truncate text-sm font-semibold">{asset.name}</p>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {asset.team} · {asset.owner}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <TypeBadge type={asset.type} />
          <StatusBadge status={asset.status} />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Progress value={asset.coverage} className="h-1.5 flex-1" />
        <span className="text-[10px] tabular-nums text-muted-foreground">{asset.coverage}%</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {asset.tags.slice(0, 2).map((tag) => (
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

function DetailPill({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border px-2.5 py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  )
}

export function CMDBAssetManagementPage() {
  const [selectedId, setSelectedId] = useState(ASSET_SUMMARIES[0].id)
  const [search, setSearch] = useState("")

  const filteredAssets = useMemo(
    () =>
      ASSET_SUMMARIES.filter((asset) => {
        const text = `${asset.name} ${asset.owner} ${asset.team} ${asset.type} ${asset.tags.join(" ")}`
          .toLowerCase()
        return text.includes(search.trim().toLowerCase())
      }),
    [search],
  )

  const selected = ASSET_DETAILS[selectedId] ?? ASSET_DETAILS[ASSET_SUMMARIES[0].id]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">CMDB 资产管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              主机、云资源、网络设备和应用树统一纳管，最近同步 {selected.lastSync}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="px-1.5">
              动态字段已启用
            </Badge>
            <Button variant="outline" size="sm">
              <Sparkles className="mr-1.5 size-4" />
              发现漂移
            </Button>
            <Button variant="outline" size="sm">
              <Wand2 className="mr-1.5 size-4" />
              扩展字段
            </Button>
            <Button size="sm">
              <ServerCog className="mr-1.5 size-4" />
              新增资产
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-4 p-5">
        <section className="grid gap-3 md:grid-cols-4">
          <StatCard label="纳管资产" value="5,248" icon={Layers3} />
          <StatCard label="动态字段" value="128" icon={Database} />
          <StatCard label="待核验" value="36" icon={Cloud} />
          <StatCard label="应用树" value="17" icon={TreePine} />
        </section>

        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-[760px] overflow-hidden rounded-xl border bg-card"
        >
          <ResizablePanel defaultSize={28} minSize={22}>
            <div className="flex h-full flex-col border-r bg-muted/20">
              <div className="border-b p-3">
                <div className="relative">
                  <ArrowRightLeft className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索资产、负责人、标签…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["主机", "云资源", "网络设备", "应用树"].map((type) => (
                    <Badge key={type} variant="secondary" size="sm" className="px-1.5 text-[10px]">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-2">
                <div className="space-y-1.5">
                  {filteredAssets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      selected={asset.id === selectedId}
                      onSelect={() => setSelectedId(asset.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t px-3 py-2 text-[11px] text-muted-foreground">
                {filteredAssets.length} 个资产 · {ASSET_SUMMARIES.filter((item) => item.status === "告警").length} 个告警
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
                      导出资产
                    </Button>
                    <Button size="sm">
                      生成校验单
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>负责人：{selected.owner}</span>
                  <span>区域：{selected.region}</span>
                  <span>提供方：{selected.provider}</span>
                  <span>版本：{selected.version}</span>
                  <span>联系人：{selected.contact}</span>
                </div>
              </div>

              <Tabs defaultValue="detail" className="flex min-h-0 flex-1 flex-col">
                <div className="border-b px-4 pt-3">
                  <TabsList className="h-8">
                    <TabsTrigger value="detail">详情</TabsTrigger>
                    <TabsTrigger value="tree">应用树</TabsTrigger>
                    <TabsTrigger value="changes">变更</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="detail" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">基础信息</CardTitle>
                        <CardDescription className="text-xs">
                          资产的核心属性和扩展字段统一展示
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          {selected.baseFields.map((field) => (
                            <InfoField key={field.label} label={field.label} value={field.value} />
                          ))}
                        </div>

                        <Separator />

                        <div className="grid gap-2 sm:grid-cols-2">
                          {selected.dynamicFields.map((field) => (
                            <div key={field.key} className="rounded-lg border px-3 py-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium">{field.key}</p>
                                <Badge variant={field.editable ? "secondary" : "outline"} size="sm" className="px-1.5">
                                  {field.editable ? "可扩展" : "只读"}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm">{field.value}</p>
                              <p className="mt-1 text-[11px] text-muted-foreground">{field.source}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">资产概览</CardTitle>
                        <CardDescription className="text-xs">同步、覆盖率和关联对象</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>纳管覆盖率</span>
                            <span className="font-medium">{selected.coverage}%</span>
                          </div>
                          <Progress value={selected.coverage} className="h-2" />
                        </div>
                        <DetailPill label="最后同步" value={selected.lastSync} />
                        <DetailPill label="最后变更" value={selected.lastChange} />
                        <DetailPill label="相关对象" value={selected.related.join(" · ")} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="tree" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <TreePine className="size-4 text-muted-foreground" />
                          应用 - 集群 - 实例
                        </CardTitle>
                        <CardDescription className="text-xs">
                          资产树支持按层级扩展更多节点属性
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="rounded-lg border px-3 py-2">
                          <p className="text-sm font-medium">{selected.tree.application}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Cluster: {selected.tree.cluster}
                          </p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {selected.tree.instances.map((node) => (
                            <div key={node.name} className="rounded-lg border px-3 py-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium">{node.name}</p>
                                <Badge
                                  variant={node.health === "告警" ? "destructive" : "secondary"}
                                  size="sm"
                                  className="px-1.5"
                                >
                                  {node.health}
                                </Badge>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {node.kind} · {node.owner}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">树形属性</CardTitle>
                        <CardDescription className="text-xs">
                          资产树上的扩展字段可按层级继承
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.dynamicFields.slice(0, 3).map((field) => (
                          <div key={field.key} className="rounded-lg border px-3 py-2">
                            <p className="text-sm font-medium">{field.key}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{field.value}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="changes" className="m-0 flex-1 overflow-auto p-4">
                  <div className="grid gap-3 xl:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">近期变更</CardTitle>
                        <CardDescription className="text-xs">
                          资产同步和人工修订记录
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
                        <CardTitle className="text-sm">资产关系</CardTitle>
                        <CardDescription className="text-xs">
                          与主机、网络和应用节点的直接关联
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selected.related.map((item) => (
                          <div key={item} className="rounded-lg border px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">{item}</p>
                              <Badge variant="outline" size="sm" className="px-1.5">
                                关联
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
