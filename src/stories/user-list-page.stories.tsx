/**
 * User List Page — DataTable with avatar, role badges, actions dropdown.
 * Demonstrates Table, Avatar, Badge, DropdownMenu, Input, Button composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Search, UserPlus } from "lucide-react"

const meta: Meta = {
  title: "Pages/UserList",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "User management page with searchable table, role badges, avatar, bulk selection, and actions dropdown.",
      },
    },
  },
}

export default meta
type Story = StoryObj

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "inactive"
  lastLogin: string
}

const USERS: User[] = [
  { id: "1", name: "张三", email: "zhangsan@example.com", role: "admin", status: "active", lastLogin: "2025-01-15 10:30" },
  { id: "2", name: "李四", email: "lisi@example.com", role: "editor", status: "active", lastLogin: "2025-01-14 16:45" },
  { id: "3", name: "王五", email: "wangwu@example.com", role: "viewer", status: "inactive", lastLogin: "2025-01-10 09:00" },
  { id: "4", name: "赵六", email: "zhaoliu@example.com", role: "editor", status: "active", lastLogin: "2025-01-15 08:20" },
  { id: "5", name: "孙七", email: "sunqi@example.com", role: "viewer", status: "active", lastLogin: "2025-01-13 14:10" },
  { id: "6", name: "周八", email: "zhouba@example.com", role: "admin", status: "active", lastLogin: "2025-01-15 11:05" },
  { id: "7", name: "吴九", email: "wujiu@example.com", role: "viewer", status: "inactive", lastLogin: "2024-12-20 07:30" },
  { id: "8", name: "郑十", email: "zhengshi@example.com", role: "editor", status: "active", lastLogin: "2025-01-14 20:15" },
]

const ROLE_VARIANT: Record<User["role"], "default" | "secondary" | "outline"> = {
  admin: "default",
  editor: "secondary",
  viewer: "outline",
}

function UserListPage() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = USERS.filter(
    (u) =>
      u.name.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.includes(search.toLowerCase()),
  )

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((u) => u.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">用户管理</h1>
          <p className="text-sm text-muted-foreground">管理系统中的用户和权限</p>
        </div>
        <Button>
          <UserPlus className="size-4 mr-2" />
          添加用户
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">所有用户</CardTitle>
              <CardDescription>共 {USERS.length} 名用户</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>用户</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>最后登录</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id} data-state={selected.has(user.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selected.has(user.id)}
                      onCheckedChange={() => toggleOne(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{user.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ROLE_VARIANT[user.role]}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`size-2 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <span className="text-sm">{user.status === "active" ? "活跃" : "未激活"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>编辑</DropdownMenuItem>
                        <DropdownMenuItem>重置密码</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">删除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    无匹配用户
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2 text-sm">
          <span>已选择 {selected.size} 名用户</span>
          <Button variant="outline" size="sm">批量编辑</Button>
          <Button variant="destructive" size="sm">批量删除</Button>
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  name: "User List",
  render: () => <UserListPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("用户管理")).toBeInTheDocument()
    await expect(canvas.getByPlaceholderText("搜索用户…")).toBeInTheDocument()
    await expect(canvas.getAllByRole("row").length).toBeGreaterThan(1)
  },
}

/* Stats cards above the table */
function UserStats() {
  const stats = [
    { label: "总用户", value: USERS.length },
    { label: "管理员", value: USERS.filter((u) => u.role === "admin").length },
    { label: "活跃", value: USERS.filter((u) => u.status === "active").length },
    { label: "未激活", value: USERS.filter((u) => u.status === "inactive").length },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 p-6 max-w-5xl mx-auto">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const Stats: Story = {
  name: "User Stats",
  render: () => <UserStats />,
}
