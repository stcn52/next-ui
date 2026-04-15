/**
 * Blog Page — article listing with featured post, tags, and reading time.
 * Demonstrates Card, Badge, Avatar, Tabs, Separator composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect, userEvent } from "storybook/test"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BookOpen,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Search,
  Share2,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/Blog",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "博客列表 — 精选文章、标签筛选、阅读时长估算，展示内容型页面布局模式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

interface Post {
  id: string
  title: string
  excerpt: string
  author: { name: string; initial: string }
  date: string
  readTime: string
  tags: string[]
  featured: boolean
  likes: number
  comments: number
  coverGradient: string
}

const POSTS: Post[] = [
  {
    id: "1",
    title: "构建可扩展的 React 组件库",
    excerpt: "从零开始，探讨如何用 Tailwind CSS v4、shadcn/ui v3 和 Vite 构建现代组件库架构，涵盖 Tree-shaking、DTS 生成和主题系统。",
    author: { name: "Chen Yang", initial: "C" },
    date: "2026-04-15",
    readTime: "8 分钟",
    tags: ["React", "组件库", "Tailwind"],
    featured: true,
    likes: 128,
    comments: 24,
    coverGradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: "2",
    title: "OKLCH 色彩空间实战指南",
    excerpt: "深入了解 OKLCH 色彩模型的优势，以及在设计系统中实现感知均一的色彩主题。",
    author: { name: "Alice Li", initial: "A" },
    date: "2026-04-12",
    readTime: "6 分钟",
    tags: ["CSS", "设计系统", "色彩"],
    featured: false,
    likes: 87,
    comments: 12,
    coverGradient: "from-orange-500/20 to-red-500/20",
  },
  {
    id: "3",
    title: "用 Playwright 做 Storybook E2E 测试",
    excerpt: "编写快速、可靠的端到端测试来覆盖 Storybook 中的交互用例，包括 play 函数与 CI 集成。",
    author: { name: "Bob Zhang", initial: "B" },
    date: "2026-04-10",
    readTime: "5 分钟",
    tags: ["测试", "Playwright", "Storybook"],
    featured: false,
    likes: 65,
    comments: 8,
    coverGradient: "from-green-500/20 to-teal-500/20",
  },
  {
    id: "4",
    title: "TypeScript 6 新特性一览",
    excerpt: "TypeScript 6 带来了哪些改进？本文梳理关键变化及其对日常开发的影响。",
    author: { name: "Eve Wang", initial: "E" },
    date: "2026-04-08",
    readTime: "7 分钟",
    tags: ["TypeScript", "前端"],
    featured: false,
    likes: 112,
    comments: 19,
    coverGradient: "from-indigo-500/20 to-blue-500/20",
  },
  {
    id: "5",
    title: "国际化最佳实践：多语言 React 应用",
    excerpt: "在 React 项目中实现多语言支持的策略，包含翻译管理、日期格式化和 RTL 布局。",
    author: { name: "Grace Wu", initial: "G" },
    date: "2026-04-05",
    readTime: "9 分钟",
    tags: ["i18n", "React", "前端"],
    featured: false,
    likes: 74,
    comments: 11,
    coverGradient: "from-pink-500/20 to-rose-500/20",
  },
]

const ALL_TAGS = [...new Set(POSTS.flatMap((p) => p.tags))]

function BlogPage() {
  const [search, setSearch] = useState("")
  const [activeTag, setActiveTag] = useState("all")

  const filtered = POSTS.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchTag = activeTag === "all" || p.tags.includes(activeTag)
    return matchSearch && matchTag
  })

  const featured = filtered.find((p) => p.featured)
  const rest = filtered.filter((p) => !p.featured)

  return (
    <div className="min-h-175 bg-background text-foreground">
      {/* Header */}
      <div className="border-b px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <BookOpen className="size-5 text-primary" />
            <h1 className="text-2xl font-bold">博客</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            技术文章、实战经验、前端趋势
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="搜索文章..."
                className="pl-9"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>
            <Tabs value={activeTag} onValueChange={setActiveTag}>
              <TabsList className="flex-wrap">
                <TabsTrigger value="all">全部</TabsTrigger>
                {ALL_TAGS.slice(0, 5).map((tag) => (
                  <TabsTrigger key={tag} value={tag}>
                    {tag}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        {/* Featured */}
        {featured && (
          <Card className="overflow-hidden">
            <div className={cn("h-32 bg-gradient-to-br", featured.coverGradient)} />
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-[10px]">精选</Badge>
                {featured.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-xl">{featured.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {featured.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-[10px]">
                      {featured.author.initial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{featured.author.name}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" /> {featured.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" /> {featured.readTime}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="size-3" /> {featured.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="size-3" /> {featured.comments}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Post list */}
        <div className="space-y-4">
          {rest.map((post) => (
            <Card key={post.id} className="transition-shadow hover:shadow-md">
              <div className="flex">
                <div className={cn("hidden w-2 shrink-0 rounded-l-lg bg-gradient-to-b sm:block", post.coverGradient)} />
                <div className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {post.tags.map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px]">
                          <Tag className="mr-0.5 size-2.5" /> {t}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-base">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-6">
                          <AvatarFallback className="text-[10px]">
                            {post.author.initial}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{post.author.name}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="size-3" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" /> {post.readTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="size-7">
                          <Heart className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7">
                          <Share2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            没有匹配的文章
          </div>
        )}
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <BlogPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("博客")).toBeInTheDocument()
    await expect(canvas.getByText("构建可扩展的 React 组件库")).toBeInTheDocument()
    await expect(canvas.getByText("精选")).toBeInTheDocument()
    await expect(canvas.getByText("OKLCH 色彩空间实战指南")).toBeInTheDocument()
  },
}

export const FilterByTag: Story = {
  render: () => <BlogPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("tab", { name: "React" }))
    await expect(canvas.getByText("构建可扩展的 React 组件库")).toBeInTheDocument()
    await expect(canvas.getByText("国际化最佳实践：多语言 React 应用")).toBeInTheDocument()
  },
}
