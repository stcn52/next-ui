/**
 * Search Results Page — 全文搜索结果页，含过滤侧栏、关键词高亮、分页。
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  SearchIcon,
  FilterIcon,
  XIcon,
  CalendarIcon,
  TagIcon,
  FolderIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/SearchResultsPage",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface SearchResult {
  id: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  date: string
  readTime: number
}

const RESULTS: SearchResult[] = [
  {
    id: "1",
    title: "React 19 并发特性深入解析",
    excerpt: "React 19 带来了全新的 use() Hook、Server Actions 以及增强的并发渲染模型，让我们深入了解这些特性对性能优化的影响……",
    category: "技术文章",
    tags: ["React", "并发", "性能"],
    date: "2024-12-08",
    readTime: 8,
  },
  {
    id: "2",
    title: "Tailwind CSS v4 设计令牌体系",
    excerpt: "Tailwind CSS v4 引入了基于 CSS 自定义属性的设计令牌，彻底改变了主题定制方式。本文介绍如何迁移现有项目并充分利用新特性……",
    category: "教程",
    tags: ["Tailwind", "CSS", "设计系统"],
    date: "2024-12-05",
    readTime: 6,
  },
  {
    id: "3",
    title: "使用 shadcn/ui 构建企业级组件库",
    excerpt: "shadcn/ui 提供了高度可定制的无样式组件，结合设计令牌和主题系统，能快速搭建符合企业需求的组件库……",
    category: "实践指南",
    tags: ["shadcn/ui", "组件库", "TypeScript"],
    date: "2024-11-28",
    readTime: 10,
  },
  {
    id: "4",
    title: "虚拟滚动列表性能优化实战",
    excerpt: "@tanstack/virtual 让大数据量列表渲染成为可能。本文以 VirtualDataTable 为例，讲解如何消除滚动抖动、优化内存占用……",
    category: "技术文章",
    tags: ["虚拟滚动", "性能", "React"],
    date: "2024-11-20",
    readTime: 7,
  },
  {
    id: "5",
    title: "Playwright E2E 测试最佳实践",
    excerpt: "在 Next.js 应用中配置 Playwright，实现跨浏览器端对端测试。包含 Page Object Model、CI 集成、视觉回归测试等实践……",
    category: "测试",
    tags: ["Playwright", "E2E", "CI/CD"],
    date: "2024-11-12",
    readTime: 9,
  },
  {
    id: "6",
    title: "TypeScript 类型体操：实用工具类型",
    excerpt: "深入 TypeScript 高级类型，掌握 Infer、Template Literal Types、Conditional Types 等，提升代码类型安全性……",
    category: "技术文章",
    tags: ["TypeScript", "类型系统"],
    date: "2024-11-05",
    readTime: 12,
  },
]

const CATEGORIES = ["全部", "技术文章", "教程", "实践指南", "测试"]
const ALL_TAGS = ["React", "TypeScript", "Tailwind", "CSS", "性能", "测试", "CI/CD", "组件库"]

// ---------------------------------------------------------------------------
// Highlight helper
// ---------------------------------------------------------------------------

function Highlight({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword.trim()) return <>{text}</>
  const parts = text.split(new RegExp(`(${keyword})`, "gi"))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part}</mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Result Card
// ---------------------------------------------------------------------------

function ResultCard({ result, keyword }: { result: SearchResult; keyword: string }) {
  return (
    <article className="group rounded-lg border bg-card hover:shadow-sm transition-shadow p-4 space-y-2 cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">
            <Highlight text={result.title} keyword={keyword} />
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            <Highlight text={result.excerpt} keyword={keyword} />
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px]">{result.category}</Badge>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><CalendarIcon className="size-3" />{result.date}</span>
        <span className="flex items-center gap-1"><ClockIcon className="size-3" />{result.readTime} 分钟阅读</span>
        <span className="flex items-center gap-1.5">
          {result.tags.map((t) => (
            <span key={t} className="flex items-center gap-0.5">
              <TagIcon className="size-2.5" />{t}
            </span>
          ))}
        </span>
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function SearchResultsPage() {
  const [query, setQuery] = useState("React")
  const [activeCategory, setActiveCategory] = useState("全部")
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [page, setPage] = useState(1)

  const PER_PAGE = 4

  const filtered = RESULTS.filter((r) => {
    if (activeCategory !== "全部" && r.category !== activeCategory) return false
    if (activeTags.length > 0 && !activeTags.some((t) => r.tags.includes(t))) return false
    if (query.trim()) {
      const q = query.toLowerCase()
      return r.title.toLowerCase().includes(q) || r.excerpt.toLowerCase().includes(q)
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    setPage(1)
  }

  const clearFilters = () => {
    setActiveCategory("全部")
    setActiveTags([])
    setPage(1)
  }

  const hasFilters = activeCategory !== "全部" || activeTags.length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Search header */}
      <div className="border-b bg-card px-6 py-4 space-y-3">
        <div className="relative max-w-xl">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            placeholder="搜索文章、文档……"
            className="pl-9 h-9"
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setQuery("")}
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            共 <strong className="text-foreground">{filtered.length}</strong> 条结果
            {query ? <> ·「<span className="text-primary">{query}</span>」</> : null}
          </p>
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <SlidersHorizontalIcon className="size-3.5" />
            {sidebarOpen ? "收起筛选" : "展开筛选"}
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="xs" className="text-muted-foreground" onClick={clearFilters}>
              <XIcon className="size-3.5" />
              清除筛选
            </Button>
          )}
        </div>
      </div>

      <div className="flex max-w-5xl mx-auto">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-52 shrink-0 border-r px-4 py-5 space-y-5">
            {/* Category */}
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5">
                <FolderIcon className="size-3.5 text-muted-foreground" />
                分类
              </p>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setActiveCategory(c); setPage(1) }}
                    className={cn(
                      "w-full text-left text-xs px-2 py-1 rounded transition-colors",
                      activeCategory === c
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted text-muted-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5">
                <FilterIcon className="size-3.5 text-muted-foreground" />
                标签
              </p>
              <div className="space-y-1.5">
                {ALL_TAGS.map((tag) => (
                  <div key={tag} className="flex items-center gap-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={activeTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="text-xs cursor-pointer">{tag}</Label>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Results */}
        <main className="flex-1 px-5 py-5">
          {paged.length > 0 ? (
            <div className="space-y-3">
              {paged.map((r) => (
                <ResultCard key={r.id} result={r} keyword={query} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
              <SearchIcon className="size-10 opacity-30" />
              <p className="text-sm">未找到匹配结果</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>清除筛选条件</Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                第 {page} / {totalPages} 页
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeftIcon className="size-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon-sm"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="icon-sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <SearchResultsPage />,
}
