/**
 * Orders Page — e-commerce order management with table, status badges, and filters.
 * Demonstrates Table, Badge, Avatar, Button, Input, Tabs, Card composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect, userEvent } from "storybook/test"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/display/card"
import { Input } from "@/components/ui/inputs/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/display/table"
import {
  DollarSign,
  Download,
  Eye,
  Package,
  Search,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/Orders",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "订单管理 — 订单列表、状态过滤、统计卡片、表格操作，展示数据表格在电商场景的组合模式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

interface Order {
  id: string
  customer: string
  email: string
  product: string
  amount: number
  status: OrderStatus
  date: string
}

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "待处理", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  processing: { label: "处理中", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  shipped: { label: "已发货", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  delivered: { label: "已送达", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
}

const ORDERS: Order[] = [
  { id: "ORD-001", customer: "张伟", email: "zhang@example.com", product: "MacBook Pro 16\"", amount: 18999, status: "delivered", date: "2026-04-15" },
  { id: "ORD-002", customer: "李娜", email: "lina@example.com", product: "iPhone 17 Pro", amount: 9999, status: "shipped", date: "2026-04-14" },
  { id: "ORD-003", customer: "王明", email: "wangming@example.com", product: "AirPods Pro 3", amount: 1899, status: "processing", date: "2026-04-14" },
  { id: "ORD-004", customer: "刘洋", email: "liuyang@example.com", product: "iPad Air M3", amount: 5499, status: "pending", date: "2026-04-13" },
  { id: "ORD-005", customer: "陈静", email: "chenjing@example.com", product: "Apple Watch Ultra 3", amount: 6299, status: "delivered", date: "2026-04-12" },
  { id: "ORD-006", customer: "赵磊", email: "zhaolei@example.com", product: "Studio Display", amount: 11499, status: "cancelled", date: "2026-04-11" },
  { id: "ORD-007", customer: "孙芳", email: "sunfang@example.com", product: "Mac Mini M4", amount: 4499, status: "processing", date: "2026-04-11" },
  { id: "ORD-008", customer: "周杰", email: "zhoujie@example.com", product: "Magic Keyboard", amount: 999, status: "shipped", date: "2026-04-10" },
]

const KPI = [
  { title: "总收入", value: "¥59,693", change: "+12.5%", icon: DollarSign },
  { title: "订单数", value: "8", change: "+3", icon: ShoppingCart },
  { title: "已发货", value: "2", change: "处理中", icon: Package },
  { title: "转化率", value: "3.2%", change: "+0.4%", icon: TrendingUp },
]

function OrdersPage() {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")

  const filtered = ORDERS
    .filter((o) => {
      if (tab === "pending") return o.status === "pending"
      if (tab === "processing") return o.status === "processing"
      if (tab === "shipped") return o.status === "shipped"
      if (tab === "delivered") return o.status === "delivered"
      return true
    })
    .filter(
      (o) =>
        !search ||
        o.customer.includes(search) ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.product.toLowerCase().includes(search.toLowerCase()),
    )

  return (
    <div className="min-h-175 bg-background text-foreground">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h1 className="text-xl font-semibold">订单管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">管理您的全部订单与发货状态</p>
      </div>

      <div className="space-y-5 p-5">
        {/* KPI */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KPI.map((k) => (
            <Card key={k.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{k.title}</CardTitle>
                <k.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{k.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="pending">待处理</TabsTrigger>
              <TabsTrigger value="processing">处理中</TabsTrigger>
              <TabsTrigger value="shipped">已发货</TabsTrigger>
              <TabsTrigger value="delivered">已送达</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="搜索订单..."
                className="pl-9"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 size-3.5" /> 导出
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">订单号</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>商品</TableHead>
                <TableHead className="text-right">金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>日期</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const s = STATUS_MAP[order.status]
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{order.product}</TableCell>
                    <TableCell className="text-right font-medium">
                      ¥{order.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", s.className)}>
                        {s.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-8" aria-label="查看详情">
                        <Eye className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    没有匹配的订单
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <OrdersPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("订单管理")).toBeInTheDocument()
    await expect(canvas.getByText("ORD-001")).toBeInTheDocument()
    await expect(canvas.getByText("¥59,693")).toBeInTheDocument()
  },
}

export const FilterByStatus: Story = {
  render: () => <OrdersPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("tab", { name: "已发货" }))
    await expect(canvas.getByText("ORD-002")).toBeInTheDocument()
    await expect(canvas.getByText("ORD-008")).toBeInTheDocument()
    await expect(canvas.queryByText("ORD-001")).not.toBeInTheDocument()
  },
}
