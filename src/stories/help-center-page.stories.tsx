/**
 * Help Center Page — 帮助中心，含分类卡、搜索框、文章列表与联系入口。
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  SearchIcon,
  BookOpenIcon,
  ZapIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  LifeBuoyIcon,
  ChevronRightIcon,
  MessageCircleIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/display/card"
import { Input } from "@/components/ui/inputs/input"
import { Separator } from "@/components/ui/display/separator"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/HelpCenterPage",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { icon: ZapIcon, label: "快速开始", count: 12, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { icon: BookOpenIcon, label: "API 文档", count: 34, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { icon: ShieldCheckIcon, label: "安全与合规", count: 8, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  { icon: CreditCardIcon, label: "计费与账单", count: 15, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { icon: LifeBuoyIcon, label: "故障排查", count: 22, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
  { icon: MessageCircleIcon, label: "社区讨论", count: 88, color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
]

interface Article {
  title: string
  category: string
  views: number
  new?: boolean
}

const POPULAR: Article[] = [
  { title: "如何获取 API Key？", category: "快速开始", views: 8420 },
  { title: "速率限制说明与最佳实践", category: "API 文档", views: 6231 },
  { title: "账单周期和付款方式设置", category: "计费与账单", views: 4850 },
  { title: "OAuth 2.0 集成完整指南", category: "安全与合规", views: 4120, new: true },
  { title: "Webhook 配置与故障排查", category: "故障排查", views: 3970 },
  { title: "如何迁移到 v2 API？", category: "API 文档", views: 3540 },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function HelpCenterPage() {
  const [search, setSearch] = useState("")

  const filtered = POPULAR.filter((a) =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b px-6 py-10 text-center">
        <h1 className="text-3xl font-bold mb-2">帮助中心</h1>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm">
          搜索文档、教程和 FAQ，快速找到你需要的答案
        </p>
        <div className="relative max-w-md mx-auto">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索帮助文章…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-6 space-y-6">
        {/* Categories */}
        {!search && (
          <section>
            <h2 className="text-lg font-semibold mb-4">按分类浏览</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map(({ icon: Icon, label, count, color }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-3 rounded-xl border bg-card px-4 py-4 text-left transition-all hover:shadow-md hover:border-primary/40 group"
                >
                  <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", color)}>
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{label}</p>
                    <p className="text-xs text-muted-foreground">{count} 篇文章</p>
                  </div>
                  <ChevronRightIcon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Articles */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            {search ? `"${search}" 的搜索结果 (${filtered.length})` : "热门文章"}
          </h2>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-muted-foreground gap-3">
              <SearchIcon className="size-10 opacity-30" />
              <p className="text-sm">未找到相关文章</p>
              <Button variant="outline" size="sm" onClick={() => setSearch("")}>清除筛选</Button>
            </div>
          ) : (
            <Card>
              <div className="divide-y">
                {filtered.map((article) => (
                  <button
                    key={article.title}
                    type="button"
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <BookOpenIcon className="size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{article.title}</p>
                        {article.new && <Badge size="sm" className="shrink-0">新</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {article.category} · {article.views.toLocaleString()} 次阅读
                      </p>
                    </div>
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </Card>
          )}
        </section>

        <Separator />

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold mb-4">没找到答案？联系我们</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: MessageCircleIcon, label: "在线聊天", desc: "工作日 9:00–18:00 实时响应", cta: "开始聊天" },
              { icon: MailIcon, label: "发送邮件", desc: "通常 4–8 小时内回复", cta: "写邮件" },
              { icon: PhoneIcon, label: "电话支持", desc: "企业版专属，优先队列接入", cta: "查看号码" },
            ].map(({ icon: Icon, label, desc, cta }) => (
              <Card key={label}>
                <CardContent className="pt-4 pb-4 flex flex-col gap-3">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">{cta}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <HelpCenterPage />,
}
