/**
 * Inbox Page — email-like inbox with thread list, preview pane, and actions.
 * Demonstrates Card, Badge, Avatar, Button, Input, Tabs, Separator composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect, userEvent } from "storybook/test"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inputs/input"
import { Separator } from "@/components/ui/display/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import {
  Archive,
  Forward,
  Inbox,
  MailOpen,
  Reply,
  Search,
  Star,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/Inbox",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "邮件收件箱 — 线程列表、预览面板、标星/归档/删除操作，展示主从视图交互模式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

interface Email {
  id: string
  from: string
  fromInitial: string
  subject: string
  preview: string
  body: string
  time: string
  read: boolean
  starred: boolean
  labels: string[]
}

const EMAILS: Email[] = [
  {
    id: "1",
    from: "GitHub",
    fromInitial: "G",
    subject: "[next-ui] New pull request #42",
    preview: "feat: add Timeline component with vertical/horizontal modes",
    body: "A new pull request has been opened by @stcn52.\n\nTitle: feat: add Timeline component\n\nDescription:\n- Vertical and horizontal layout modes\n- Customizable connector lines and icons\n- Animation support with motion\n\nPlease review the changes and provide feedback.",
    time: "10:30",
    read: false,
    starred: true,
    labels: ["github"],
  },
  {
    id: "2",
    from: "Vercel",
    fromInitial: "V",
    subject: "Deployment successful: next-ui-docs",
    preview: "Your project next-ui-docs has been deployed to production.",
    body: "Hi there,\n\nYour deployment for next-ui-docs was successful.\n\nProject: next-ui-docs\nURL: https://next-ui-docs.vercel.app\nBranch: main\nCommit: ed70dda\n\nAll checks passed. Your site is now live.",
    time: "09:15",
    read: false,
    starred: false,
    labels: ["deploy"],
  },
  {
    id: "3",
    from: "npm",
    fromInitial: "N",
    subject: "@stcn52/next-ui v0.1.0 published",
    preview: "Your package has been successfully published to npm registry.",
    body: "Hello,\n\nYour package @stcn52/next-ui@0.1.0 has been published.\n\nDetails:\n- Size: 175KB (ESM)\n- Dependencies: 22\n- Files: 68\n\nView on npm: https://npmjs.com/package/@stcn52/next-ui",
    time: "昨天",
    read: true,
    starred: false,
    labels: ["npm"],
  },
  {
    id: "4",
    from: "Alice Chen",
    fromInitial: "A",
    subject: "Component library feedback",
    preview: "Hey! I've been using next-ui and have some suggestions...",
    body: "Hey!\n\nI've been using next-ui for a couple of weeks now and wanted to share some feedback:\n\n1. The theme system is really powerful — love the preset gallery\n2. The Kanban board DnD is smooth\n3. Would be great to have a Timeline component\n4. The i18n support is excellent\n\nKeep up the great work!",
    time: "昨天",
    read: true,
    starred: true,
    labels: [],
  },
  {
    id: "5",
    from: "CI Bot",
    fromInitial: "C",
    subject: "Build #156 passed ✓",
    preview: "All 49 tests passed. Bundle size: 175KB ESM, 152KB CJS.",
    body: "Build Report #156\n\nStatus: PASSED ✓\nTests: 49/49\nE2E: 10/10\nBundle: 175KB ESM, 152KB CJS\nCSS: 228KB\n\nNo regressions detected.",
    time: "周一",
    read: true,
    starred: false,
    labels: ["ci"],
  },
]

const LABEL_COLORS: Record<string, string> = {
  github: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  deploy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  npm: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ci: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

function InboxPage() {
  const [emails, setEmails] = useState(EMAILS)
  const [selectedId, setSelectedId] = useState<string | null>("1")
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")

  const selected = emails.find((e) => e.id === selectedId)

  const filtered = emails
    .filter((e) => {
      if (tab === "unread") return !e.read
      if (tab === "starred") return e.starred
      return true
    })
    .filter(
      (e) =>
        !search ||
        e.subject.toLowerCase().includes(search.toLowerCase()) ||
        e.from.toLowerCase().includes(search.toLowerCase()),
    )

  const unreadCount = emails.filter((e) => !e.read).length

  const toggleStar = (id: string) =>
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)),
    )

  const markRead = (id: string) =>
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, read: true } : e)),
    )

  const archiveEmail = (id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const handleSelect = (id: string) => {
    setSelectedId(id)
    markRead(id)
  }

  return (
    <div className="flex h-175 flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Inbox className="size-5 text-primary" />
          <h1 className="text-xl font-semibold">收件箱</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="搜索邮件..."
            className="pl-9"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Thread list */}
        <div className="flex w-95 flex-col border-r">
          <Tabs value={tab} onValueChange={setTab} className="px-4 pt-3">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                全部
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                未读
              </TabsTrigger>
              <TabsTrigger value="starred" className="flex-1">
                已标星
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1 overflow-y-auto px-2 py-2">
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                没有邮件
              </p>
            )}
            {filtered.map((email) => (
              <button
                key={email.id}
                onClick={() => handleSelect(email.id)}
                className={cn(
                  "flex w-full gap-3 rounded-lg p-3 text-left transition-colors",
                  selectedId === email.id
                    ? "bg-accent"
                    : "hover:bg-muted/50",
                  !email.read && "font-semibold",
                )}
              >
                <Avatar className="mt-0.5 size-9 shrink-0">
                  <AvatarFallback className="text-xs">
                    {email.fromInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm">{email.from}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {email.time}
                    </span>
                  </div>
                  <p className="truncate text-sm">{email.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {email.preview}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    {!email.read && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                    {email.labels.map((l) => (
                      <span
                        key={l}
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-medium",
                          LABEL_COLORS[l] ?? "bg-muted text-muted-foreground",
                        )}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview pane */}
        <div className="flex flex-1 flex-col">
          {selected ? (
            <>
              {/* Preview header */}
              <div className="flex items-center justify-between border-b px-6 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="text-xs">
                      {selected.fromInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{selected.from}</p>
                    <p className="text-xs text-muted-foreground">
                      {selected.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleStar(selected.id)}
                    aria-label={selected.starred ? "取消标星" : "标星"}
                  >
                    <Star
                      className={cn(
                        "size-4",
                        selected.starred
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground",
                      )}
                    />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="归档">
                    <Archive className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => archiveEmail(selected.id)}
                    aria-label="删除"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Preview body */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <h2 className="text-lg font-semibold">{selected.subject}</h2>
                <Separator className="my-3" />
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                  {selected.body}
                </div>
              </div>

              {/* Reply bar */}
              <div className="flex items-center gap-2 border-t px-6 py-3">
                <Button variant="outline" size="sm">
                  <Reply className="mr-1.5 size-3.5" /> 回复
                </Button>
                <Button variant="outline" size="sm">
                  <Forward className="mr-1.5 size-3.5" /> 转发
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
              <MailOpen className="mb-3 size-12 opacity-30" />
              <p className="text-sm">选择一封邮件以查看</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <InboxPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("收件箱")).toBeInTheDocument()
    await expect(canvas.getByText("[next-ui] New pull request #42")).toBeInTheDocument()
    // Click an email to read it
    await userEvent.click(canvas.getByText("Deployment successful: next-ui-docs"))
    await expect(canvas.getByText("Your deployment for next-ui-docs was successful.")).toBeInTheDocument()
  },
}

export const SearchFilter: Story = {
  render: () => <InboxPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText("搜索邮件...")
    await userEvent.type(input, "npm")
    await expect(canvas.getByText("@stcn52/next-ui v0.1.0 published")).toBeInTheDocument()
  },
}
