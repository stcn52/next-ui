/**
 * Notifications Page — notification centre with filters, read/unread, and actions.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect, userEvent } from "storybook/test"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bell,
  Check,
  GitPullRequest,
  MessageSquare,
  Settings,
  Star,
  Trash2,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/Notifications",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "通知中心 — 已读/未读标记、分类过滤、批量操作，展示列表交互模式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

interface Notification {
  id: string
  type: "mention" | "follow" | "star" | "pr" | "system"
  title: string
  body: string
  from: string
  fromInitial: string
  time: string
  read: boolean
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "mention",
    title: "评论提及了你",
    body: '@you 这个方案看起来不错，可以合入 main 了。',
    from: "Alice Wang",
    fromInitial: "AW",
    time: "5 分钟前",
    read: false,
  },
  {
    id: "2",
    type: "pr",
    title: "PR #142 已合并",
    body: "feat: add parseThemeCSS for shadcnthemer import",
    from: "CI Bot",
    fromInitial: "CI",
    time: "30 分钟前",
    read: false,
  },
  {
    id: "3",
    type: "follow",
    title: "新关注者",
    body: "Bob Chen 开始关注了你",
    from: "Bob Chen",
    fromInitial: "BC",
    time: "1 小时前",
    read: false,
  },
  {
    id: "4",
    type: "star",
    title: "仓库获得 Star",
    body: "next-ui 被 star 了 ⭐",
    from: "Carol Li",
    fromInitial: "CL",
    time: "2 小时前",
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "安全提醒",
    body: "检测到来自新设备的登录，请确认是否是本人操作。",
    from: "System",
    fromInitial: "S",
    time: "昨天",
    read: true,
  },
  {
    id: "6",
    type: "mention",
    title: "Issue #87 评论",
    body: "虚拟表格在 100K 行时的性能表现很好！",
    from: "David Zhao",
    fromInitial: "DZ",
    time: "昨天",
    read: true,
  },
]

const TYPE_ICONS: Record<string, typeof Bell> = {
  mention: MessageSquare,
  follow: UserPlus,
  star: Star,
  pr: GitPullRequest,
  system: Settings,
}

function NotificationItem({
  notification,
  onToggleRead,
  onDelete,
}: {
  notification: Notification
  onToggleRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  const Icon = TYPE_ICONS[notification.type] ?? Bell

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
        !notification.read && "bg-primary/5",
      )}
    >
      <Avatar className="size-9 mt-0.5">
        <AvatarFallback className="text-xs">{notification.fromInitial}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium truncate">{notification.title}</span>
          {!notification.read && (
            <span className="size-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {notification.body}
        </p>
        <span className="text-xs text-muted-foreground/60 mt-1 block">
          {notification.time}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label={notification.read ? "标为未读" : "标为已读"}
          onClick={() => onToggleRead(notification.id)}
        >
          <Check className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-destructive"
          aria-label="删除通知"
          onClick={() => onDelete(notification.id)}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Bell className="size-5" />
            <h1 className="text-2xl font-bold tracking-tight">通知</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead}>
            全部已读
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="unread">未读</TabsTrigger>
            <TabsTrigger value="mentions">提及</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {notifications.length === 0 ? (
                  <p className="p-6 text-center text-sm text-muted-foreground">
                    暂无通知
                  </p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={n.id}>
                      <NotificationItem
                        notification={n}
                        onToggleRead={toggleRead}
                        onDelete={deleteNotification}
                      />
                      {i < notifications.length - 1 && <Separator />}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {notifications.filter((n) => !n.read).length === 0 ? (
                  <p className="p-6 text-center text-sm text-muted-foreground">
                    没有未读通知
                  </p>
                ) : (
                  notifications
                    .filter((n) => !n.read)
                    .map((n, i, arr) => (
                      <div key={n.id}>
                        <NotificationItem
                          notification={n}
                          onToggleRead={toggleRead}
                          onDelete={deleteNotification}
                        />
                        {i < arr.length - 1 && <Separator />}
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentions" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {notifications
                  .filter((n) => n.type === "mention")
                  .map((n, i, arr) => (
                    <div key={n.id}>
                      <NotificationItem
                        notification={n}
                        onToggleRead={toggleRead}
                        onDelete={deleteNotification}
                      />
                      {i < arr.length - 1 && <Separator />}
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export const Default: Story = {
  render: () => <NotificationsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("通知")).toBeVisible()
    await expect(canvas.getByText("评论提及了你")).toBeVisible()
    await expect(canvas.getByText("全部已读")).toBeVisible()
  },
}

export const MarkAllRead: Story = {
  render: () => <NotificationsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByText("全部已读")
    await userEvent.click(btn)
  },
}
