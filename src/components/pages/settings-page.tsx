"use client"

import { useState } from "react"
import {
  BellIcon,
  LockIcon,
  PaletteIcon,
  ShieldAlertIcon,
  UserIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
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
import { Label } from "@/components/ui/inputs/label"
import { Separator } from "@/components/ui/display/separator"
import { Switch } from "@/components/ui/inputs/switch"
import { Textarea } from "@/components/ui/inputs/textarea"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "profile" | "security" | "notifications" | "appearance" | "danger"

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: Tab[] = [
  { id: "profile", label: "个人信息", icon: <UserIcon className="size-4" /> },
  { id: "security", label: "安全设置", icon: <LockIcon className="size-4" /> },
  { id: "notifications", label: "通知偏好", icon: <BellIcon className="size-4" /> },
  { id: "appearance", label: "外观", icon: <PaletteIcon className="size-4" /> },
  { id: "danger", label: "危险操作", icon: <ShieldAlertIcon className="size-4 text-destructive" /> },
]

// ─── Tab panels ───────────────────────────────────────────────────────────────

function ProfileTab() {
  const [name, setName] = useState("陈宇")
  const [email, setEmail] = useState("chenyu@example.com")
  const [bio, setBio] = useState("全栈工程师，专注于前端技术与开源社区贡献。")
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex items-center gap-3">
        <Avatar className="size-16">
          <AvatarFallback className="text-lg bg-primary/10 text-primary">
            {name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" size="sm">更换头像</Button>
          <p className="text-xs text-muted-foreground mt-1">支持 JPG、PNG，最大 2 MB</p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-3 max-w-lg">
        <div className="space-y-1.5">
          <Label htmlFor="s-name">显示名称</Label>
          <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-email">邮箱</Label>
          <Input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-bio">个人简介</Label>
          <Textarea
            id="s-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="resize-none"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave}>
            {saved ? "已保存 ✓" : "保存更改"}
          </Button>
          <Button variant="outline">取消</Button>
        </div>
      </div>
    </div>
  )
}

function SecurityTab() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(true)

  return (
    <div className="space-y-4 max-w-lg">
      {/* Password */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">修改密码</CardTitle>
          <CardDescription>建议使用包含大小写字母、数字和特殊字符的强密码</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="s-old-pw">当前密码</Label>
            <Input id="s-old-pw" type="password" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-new-pw">新密码</Label>
            <Input id="s-new-pw" type="password" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-confirm-pw">确认新密码</Label>
            <Input id="s-confirm-pw" type="password" />
          </div>
          <Button className="mt-2">更新密码</Button>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card>
        <CardContent className="flex items-center justify-between gap-3 pt-4">
          <div>
            <p className="font-medium text-sm">双因素认证 (2FA)</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              使用 TOTP 应用（如 Google Authenticator）增强账号安全
            </p>
          </div>
          <Switch
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
            aria-label="启用双因素认证"
          />
        </CardContent>
      </Card>

      {/* Session */}
      <Card>
        <CardContent className="flex items-center justify-between gap-3 pt-4">
          <div>
            <p className="font-medium text-sm">自动退出登录</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              空闲 30 分钟后自动退出
            </p>
          </div>
          <Switch
            checked={sessionTimeout}
            onCheckedChange={setSessionTimeout}
            aria-label="自动退出登录"
          />
        </CardContent>
      </Card>
    </div>
  )
}

interface NotifSetting {
  id: string
  label: string
  desc: string
  enabled: boolean
}

function NotificationsTab() {
  const [settings, setSettings] = useState<NotifSetting[]>([
    { id: "email-digest", label: "每日邮件摘要", desc: "每天发送一封包含所有动态的摘要邮件", enabled: true },
    { id: "mentions", label: "@提及通知", desc: "有人在评论或任务中提到你时通知", enabled: true },
    { id: "task-assign", label: "任务分配", desc: "被指派新任务时发送通知", enabled: false },
    { id: "pr-review", label: "代码审查请求", desc: "收到 PR Review 请求时通知", enabled: true },
    { id: "security-alerts", label: "安全警告", desc: "检测到异常登录或安全风险时立即通知", enabled: true },
  ])

  function toggle(id: string) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    )
  }

  return (
    <div className="space-y-3 max-w-lg">
      {settings.map((s, i) => (
        <div key={s.id}>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
            <Switch
              checked={s.enabled}
              onCheckedChange={() => toggle(s.id)}
              aria-label={s.label}
            />
          </div>
          {i < settings.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  )
}

type ThemeMode = "light" | "dark" | "system"

function AppearanceTab() {
  const [theme, setTheme] = useState<ThemeMode>("system")
  const [compact, setCompact] = useState(false)

  const THEMES: { id: ThemeMode; label: string }[] = [
    { id: "light", label: "浅色" },
    { id: "dark", label: "深色" },
    { id: "system", label: "跟随系统" },
  ]

  return (
    <div className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <p className="text-sm font-medium">界面主题</p>
        <div className="flex gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm border transition-colors",
                theme === t.id
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-input hover:bg-accent",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">紧凑模式</p>
          <p className="text-xs text-muted-foreground">减少元素间距，显示更多内容</p>
        </div>
        <Switch
          checked={compact}
          onCheckedChange={setCompact}
          aria-label="紧凑模式"
        />
      </div>
    </div>
  )
}

function DangerTab() {
  const [confirmDelete, setConfirmDelete] = useState("")

  return (
    <div className="space-y-4 max-w-lg">
      {/* Export data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">导出数据</CardTitle>
          <CardDescription>下载你账号的所有数据，包含个人信息、历史记录</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">请求数据导出</Button>
        </CardContent>
      </Card>

      {/* Deactivate */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">停用账号</CardTitle>
          <CardDescription>暂时停用账号，保留数据，可随时重新激活</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/5">
            停用我的账号
          </Button>
        </CardContent>
      </Card>

      {/* Delete */}
      <Card className="border-destructive/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-destructive flex items-center gap-1.5">
            <ShieldAlertIcon className="size-4" /> 删除账号
          </CardTitle>
          <CardDescription>
            永久删除账号及所有数据，此操作<strong>不可撤销</strong>。请输入 <code className="bg-muted px-1 rounded text-xs">DELETE</code> 确认。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            placeholder="输入 DELETE 确认"
            className="max-w-xs"
            aria-label="确认删除"
          />
          <Button
            variant="destructive"
            disabled={confirmDelete !== "DELETE"}
          >
            永久删除账号
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile")

  const PANEL: Record<TabId, React.ReactNode> = {
    profile: <ProfileTab />,
    security: <SecurityTab />,
    notifications: <NotificationsTab />,
    appearance: <AppearanceTab />,
    danger: <DangerTab />,
  }

  return (
    <div className="flex h-full min-h-150 bg-background">
      {/* Sidebar nav */}
      <nav className="w-48 shrink-0 border-r px-2 py-3 space-y-0.5" aria-label="设置导航">
        <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground">
          设置
        </p>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm text-left transition-colors",
              activeTab === tab.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground hover:bg-accent",
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.id === "security" && (
              <Badge
                variant="secondary"
                aria-hidden="true"
                className="ml-auto text-[10px] py-0 h-4"
              >
                推荐
              </Badge>
            )}
          </button>
        ))}
      </nav>

      {/* Content area */}
      <main className="flex-1 overflow-auto px-4 py-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>
          <p className="text-sm text-muted-foreground">
            管理你的{TABS.find((t) => t.id === activeTab)?.label}偏好
          </p>
        </div>
        {PANEL[activeTab]}
      </main>
    </div>
  )
}
