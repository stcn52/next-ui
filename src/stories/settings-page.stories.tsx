/**
 * Settings Page — Composite page with sidebar navigation + form sections.
 * Demonstrates Sidebar, Tabs, Form, Input, Select, Switch, Button composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { SettingsPage as NewSettingsPageComponent } from "@/components/pages/settings-page"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
} from "@/components/ui/navigation/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Input } from "@/components/ui/inputs/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/inputs/switch"
import { Label } from "@/components/ui/inputs/label"
import { Separator } from "@/components/ui/display/separator"
import { Badge } from "@/components/ui/display/badge"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/display/card"
import {
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Settings,
  Key,
  Monitor,
} from "lucide-react"

const meta: Meta = {
  title: "Pages/Settings",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Composite settings page with sidebar navigation and tabbed form sections. " +
          "Shows how to compose Sidebar, Tabs, Card, Form, Input, Switch, and other components.",
      },
    },
  },
}

export default meta
type Story = StoryObj

type SettingsSection = "profile" | "notifications" | "appearance" | "security" | "language"

const SECTIONS: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "个人资料", icon: User },
  { id: "notifications", label: "通知", icon: Bell },
  { id: "appearance", label: "外观", icon: Palette },
  { id: "security", label: "安全", icon: Shield },
  { id: "language", label: "语言", icon: Globe },
]

function ProfileSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>个人资料</CardTitle>
        <CardDescription>管理你的公开信息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="text-lg">CY</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">更换头像</Button>
        </div>
          <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">用户名</Label>
            <Input id="name" defaultValue="chenyang" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" defaultValue="cy@example.com" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="bio">简介</Label>
            <Input id="bio" placeholder="介绍一下自己..." />
          </div>
        </div>
        <div className="flex justify-end">
          <Button>保存</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function NotificationsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>通知设置</CardTitle>
        <CardDescription>配置通知方式与频率</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { id: "email-notif", label: "邮件通知", desc: "通过邮件接收任务变更通知" },
          { id: "push-notif", label: "浏览器推送", desc: "通过浏览器接收实时通知" },
          { id: "mention-notif", label: "@提及通知", desc: "有人提及你时通知" },
          { id: "digest", label: "每日摘要", desc: "每天发送一封项目摘要邮件" },
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Switch id={item.id} defaultChecked={item.id !== "digest"} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function AppearanceSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>外观设置</CardTitle>
        <CardDescription>自定义显示方式</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label>主题</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light", label: "浅色", icon: Monitor },
              { value: "dark", label: "深色", icon: Monitor },
              { value: "system", label: "跟随系统", icon: Monitor },
            ].map((theme) => (
              <button
                key={theme.value}
                className="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm hover:bg-accent transition-colors data-[active]:ring-2 data-[active]:ring-primary"
                data-active={theme.value === "system" ? "" : undefined}
              >
                <theme.icon className="size-5" />
                {theme.label}
              </button>
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">紧凑模式</p>
            <p className="text-xs text-muted-foreground">减小间距和字体大小</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  )
}

function SecuritySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>安全设置</CardTitle>
        <CardDescription>管理密码和登录方式</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-pw">当前密码</Label>
          <Input id="current-pw" type="password" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new-pw">新密码</Label>
            <Input id="new-pw" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pw">确认密码</Label>
            <Input id="confirm-pw" type="password" />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="size-4" />
            <div>
              <p className="text-sm font-medium">两步验证</p>
              <p className="text-xs text-muted-foreground">使用验证器 App 进行两步验证</p>
            </div>
          </div>
          <Badge variant="secondary">未启用</Badge>
        </div>
        <div className="flex justify-end">
          <Button>更新密码</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")

  const sectionComponents: Record<SettingsSection, React.ReactNode> = {
    profile: <ProfileSection />,
    notifications: <NotificationsSection />,
    appearance: <AppearanceSection />,
    security: <SecuritySection />,
    language: (
      <Card>
        <CardHeader>
          <CardTitle>语言设置</CardTitle>
          <CardDescription>选择界面语言</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {["简体中文", "English", "日本語"].map((lang) => (
              <button
                key={lang}
                className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent transition-colors"
                data-active={lang === "简体中文" ? "" : undefined}
              >
                <Globe className="size-4" />
                {lang}
                {lang === "简体中文" && <Badge className="ml-auto" variant="secondary">当前</Badge>}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    ),
  }

  return (
    <div className="flex h-[700px] bg-background text-foreground">
      {/* Settings sidebar */}
      <Sidebar className="hidden md:flex">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Settings className="size-5" />
            <span className="text-sm font-semibold">设置</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>偏好</SidebarGroupLabel>
            {SECTIONS.map((s) => (
              <SidebarItem
                key={s.id}
                active={activeSection === s.id}
                onClick={() => setActiveSection(s.id)}
              >
                <s.icon className="size-4" />
                {s.label}
              </SidebarItem>
            ))}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile: Tabs instead of sidebar */}
        <div className="md:hidden border-b">
          <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as SettingsSection)}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {SECTIONS.map((s) => (
                <TabsTrigger key={s.id} value={s.id} className="text-xs">
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="max-w-2xl mx-auto p-5">
          <h1 className="hidden mb-1 text-xl font-semibold md:block">
            {SECTIONS.find((s) => s.id === activeSection)?.label}
          </h1>
          <p className="hidden mb-3 text-sm text-muted-foreground md:block">
            管理你的账户设置和偏好
          </p>
          {sectionComponents[activeSection]}
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  name: "Settings Page",
  render: () => <SettingsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("个人资料")).toBeInTheDocument()
    await expect(canvas.getByDisplayValue("chenyang")).toBeInTheDocument()
  },
}

export const Notifications: Story = {
  name: "Notifications Section",
  render: () => <NotificationsSection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("邮件通知")).toBeInTheDocument()
    await expect(canvas.getByText("浏览器推送")).toBeInTheDocument()
  },
}

export const Security: Story = {
  name: "Security Section",
  render: () => <SecuritySection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("安全设置")).toBeInTheDocument()
    await expect(canvas.getByText("两步验证")).toBeInTheDocument()
  },
}

/** 新版设置页 — 多 Tab 侧边栏导航 + 表单 + 危险操作区 */
export const NewSettingsPage: Story = {
  name: "New Settings Page",
  render: () => <NewSettingsPageComponent />,
}
