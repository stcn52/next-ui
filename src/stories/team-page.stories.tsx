/**
 * Team Page — team member management with roles, invites, and permissions.
 * Demonstrates Table, Avatar, Badge, Button, Dialog, Input composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect, userEvent } from "storybook/test"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Crown,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/Team",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "团队管理 — 成员列表、角色分配、邀请成员，展示企业级用户管理页面模式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

type Role = "owner" | "admin" | "member" | "viewer"

interface Member {
  id: string
  name: string
  initial: string
  email: string
  role: Role
  status: "active" | "invited"
  joinDate: string
  lastActive: string
}

const ROLE_CONFIG: Record<Role, { label: string; icon: typeof Crown; className: string }> = {
  owner: { label: "所有者", icon: Crown, className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  admin: { label: "管理员", icon: ShieldCheck, className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  member: { label: "成员", icon: Shield, className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  viewer: { label: "访客", icon: Shield, className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
}

const MEMBERS: Member[] = [
  { id: "1", name: "Chen Yang", initial: "C", email: "chen@example.com", role: "owner", status: "active", joinDate: "2025-01-15", lastActive: "今天" },
  { id: "2", name: "Alice Li", initial: "A", email: "alice@example.com", role: "admin", status: "active", joinDate: "2025-03-20", lastActive: "今天" },
  { id: "3", name: "Bob Zhang", initial: "B", email: "bob@example.com", role: "member", status: "active", joinDate: "2025-06-08", lastActive: "昨天" },
  { id: "4", name: "Eve Wang", initial: "E", email: "eve@example.com", role: "member", status: "active", joinDate: "2025-08-12", lastActive: "3 天前" },
  { id: "5", name: "Frank Liu", initial: "F", email: "frank@example.com", role: "viewer", status: "active", joinDate: "2026-01-05", lastActive: "1 周前" },
  { id: "6", name: "Grace Wu", initial: "G", email: "grace@example.com", role: "member", status: "invited", joinDate: "2026-04-14", lastActive: "-" },
  { id: "7", name: "Henry Zhao", initial: "H", email: "henry@example.com", role: "viewer", status: "invited", joinDate: "2026-04-15", lastActive: "-" },
]

function TeamPage() {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")

  const filtered = MEMBERS.filter((m) => {
    const matchTab =
      tab === "all" ||
      (tab === "admins" && (m.role === "owner" || m.role === "admin")) ||
      (tab === "members" && m.role === "member") ||
      (tab === "invited" && m.status === "invited")
    const matchSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const activeCount = MEMBERS.filter((m) => m.status === "active").length
  const invitedCount = MEMBERS.filter((m) => m.status === "invited").length

  return (
    <div className="min-h-175 bg-background text-foreground">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Users className="size-5 text-primary" />
              <h1 className="text-xl font-semibold">团队管理</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              管理团队成员、分配角色及权限
            </p>
          </div>
          <Button size="sm">
            <UserPlus className="mr-1.5 size-3.5" /> 邀请成员
          </Button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">总成员</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{MEMBERS.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">活跃成员</CardTitle>
              <ShieldCheck className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">待接受邀请</CardTitle>
              <Mail className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{invitedCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="admins">管理员</TabsTrigger>
              <TabsTrigger value="members">成员</TabsTrigger>
              <TabsTrigger value="invited">已邀请</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="搜索成员..."
              className="pl-9"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>成员</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>加入日期</TableHead>
                <TableHead>最近活跃</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => {
                const roleConfig = ROLE_CONFIG[member.role]
                const RoleIcon = roleConfig.icon
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">{member.initial}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", roleConfig.className)}>
                        <RoleIcon className="size-3" />
                        {roleConfig.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {member.status === "active" ? (
                        <Badge variant="secondary" className="text-xs">活跃</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">已邀请</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{member.joinDate}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{member.lastActive}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-8" aria-label="更多操作">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    没有匹配的成员
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Invite section */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="text-sm font-semibold">邀请新成员</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            输入邮箱地址邀请新成员加入团队
          </p>
          <div className="mt-3 flex gap-2">
            <Input placeholder="email@example.com" className="max-w-sm" />
            <Button size="sm">发送邀请</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <TeamPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("团队管理")).toBeInTheDocument()
    await expect(canvas.getByText("Chen Yang")).toBeInTheDocument()
    await expect(canvas.getByText("Alice Li")).toBeInTheDocument()
    await expect(canvas.getByText("邀请新成员")).toBeInTheDocument()
  },
}

export const FilterAdmins: Story = {
  render: () => <TeamPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("tab", { name: "管理员" }))
    await expect(canvas.getByText("Chen Yang")).toBeInTheDocument()
    await expect(canvas.getByText("Alice Li")).toBeInTheDocument()
    await expect(canvas.queryByText("Bob Zhang")).not.toBeInTheDocument()
  },
}
