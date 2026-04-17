/**
 * API Keys Page — 开发者 API 密钥管理页。
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  KeyIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  TrashIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/display/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/overlays/dialog"
import { Input } from "@/components/ui/inputs/input"
import { Label } from "@/components/ui/inputs/label"
import { Separator } from "@/components/ui/display/separator"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/ApiKeysPage",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface ApiKey {
  id: string
  name: string
  prefix: string
  created: string
  lastUsed: string | null
  scopes: string[]
  status: "active" | "revoked"
}

const INITIAL_KEYS: ApiKey[] = [
  { id: "1", name: "生产环境", prefix: "sk-prod-Ax9K", created: "2024-10-01", lastUsed: "2024-12-10", scopes: ["read", "write", "delete"], status: "active" },
  { id: "2", name: "开发测试", prefix: "sk-dev-Bz2Q", created: "2024-11-15", lastUsed: "2024-12-09", scopes: ["read", "write"], status: "active" },
  { id: "3", name: "CI/CD 流水线", prefix: "sk-ci-Ky7R", created: "2024-09-05", lastUsed: "2024-12-08", scopes: ["read"], status: "active" },
  { id: "4", name: "旧版集成（已弃用）", prefix: "sk-old-Rd4M", created: "2024-06-01", lastUsed: null, scopes: ["read"], status: "revoked" },
]

const SCOPE_COLORS: Record<string, string> = {
  read: "bg-blue-100 text-blue-700",
  write: "bg-amber-100 text-amber-700",
  delete: "bg-red-100 text-red-700",
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function ApiKeyRow({ apiKey, onRevoke }: { apiKey: ApiKey; onRevoke: (id: string) => void }) {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)
  const fullKey = `${apiKey.prefix}••••••••••••••••`
  const visibleKey = `${apiKey.prefix}xxxxxxxxxxxx`

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.prefix).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={cn("flex items-center gap-4 py-3 px-4", apiKey.status === "revoked" && "opacity-50")}>
      <div className="size-9 shrink-0 rounded-lg bg-muted flex items-center justify-center">
        <KeyIcon className="size-4 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-medium text-sm">{apiKey.name}</p>
          {apiKey.status === "revoked" && <Badge variant="destructive" size="sm">已吊销</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <code className="text-xs text-muted-foreground font-mono">
            {show ? visibleKey : fullKey}
          </code>
          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            className="text-muted-foreground hover:text-foreground"
            aria-label={show ? "隐藏密钥" : "显示密钥"}
          >
            {show ? <EyeOffIcon className="size-3" /> : <EyeIcon className="size-3" />}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground"
            aria-label="复制密钥前缀"
          >
            <CopyIcon className="size-3" />
          </button>
          {copied && <span className="text-[10px] text-green-600">已复制!</span>}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-[10px] text-muted-foreground">创建 {apiKey.created}</p>
          <p className="text-[10px] text-muted-foreground">
            最后使用: {apiKey.lastUsed ?? "从未使用"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {apiKey.scopes.map((s) => (
          <span key={s} className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium", SCOPE_COLORS[s])}>
            {s}
          </span>
        ))}
      </div>

      {apiKey.status === "active" && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onRevoke(apiKey.id)}
          aria-label={`吊销 ${apiKey.name}`}
        >
          <TrashIcon className="size-4" />
        </Button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)

  const activeKeys = keys.filter((k) => k.status === "active")
  const revokedKeys = keys.filter((k) => k.status === "revoked")

  const handleCreate = () => {
    if (!newKeyName.trim()) return
    const fake = `sk-new-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName.trim(),
      prefix: fake,
      created: new Date().toISOString().split("T")[0],
      lastUsed: null,
      scopes: ["read", "write"],
      status: "active",
    }
    setKeys((prev) => [newKey, ...prev])
    setCreatedKey(fake + "xxxxxxxx_FULL_KEY_SHOWN_ONCE")
    setNewKeyName("")
  }

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k)))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">API 密钥</h1>
          <p className="text-sm text-muted-foreground mt-0.5">管理用于访问 API 的密钥凭证</p>
        </div>
        <Dialog open={newKeyDialogOpen} onOpenChange={setNewKeyDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setCreatedKey(null)}>
              <PlusIcon className="size-4" />
              创建密钥
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{createdKey ? "密钥已创建" : "创建新密钥"}</DialogTitle>
              <DialogDescription>
                {createdKey
                  ? "请立即复制并妥善保存，之后将无法再次查看完整密钥。"
                  : "为密钥起一个便于识别的名称。"}
              </DialogDescription>
            </DialogHeader>
            {createdKey ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2">
                  <code className="flex-1 text-xs font-mono break-all">{createdKey}</code>
                  <Button variant="ghost" size="icon-sm" onClick={() => {}}>
                    <CopyIcon className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <ShieldAlertIcon className="size-4 shrink-0" />
                  请记录此密钥，关闭后将无法恢复
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>密钥名称</Label>
                  <Input
                    placeholder="例如：生产环境、CI/CD 流水线"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              {createdKey ? (
                <Button onClick={() => setNewKeyDialogOpen(false)}>完成</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setNewKeyDialogOpen(false)}>取消</Button>
                  <Button onClick={handleCreate} disabled={!newKeyName.trim()}>创建</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {/* Usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">本月用量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {[
                { label: "API 调用次数", value: "847,202" },
                { label: "令牌消耗", value: "2.3M" },
                { label: "费用估算", value: "¥98.40" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-bold text-lg mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active keys */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">有效密钥 ({activeKeys.length})</CardTitle>
              <Button variant="ghost" size="xs">
                <RefreshCwIcon className="size-3.5" />
                刷新
              </Button>
            </div>
            <CardDescription className="text-xs">每个密钥都可以单独设置权限范围</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {activeKeys.map((k) => (
                <ApiKeyRow key={k.id} apiKey={k} onRevoke={handleRevoke} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revoked keys */}
        {revokedKeys.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">已吊销密钥 ({revokedKeys.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {revokedKeys.map((k) => (
                  <ApiKeyRow key={k.id} apiKey={k} onRevoke={handleRevoke} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Docs link */}
        <p className="text-xs text-center text-muted-foreground">
          需要帮助？阅读我们的{" "}
          <button type="button" className="underline hover:text-foreground">API 文档</button>
          {" "}了解如何安全使用密钥。
        </p>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <ApiKeysPage />,
}
