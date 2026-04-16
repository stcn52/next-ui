/**
 * Product Catalog Page — 商品列表页，展示筛选侧栏 + 网格/列表视图切换。
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  GridIcon,
  ListIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  ShoppingCartIcon,
  HeartIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RatingInput } from "@/components/ui/rating-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Pages/ProductCatalogPage",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  category: string
  badge?: string
  gradient: string
}

const PRODUCTS: Product[] = [
  { id: "1", name: "专业开发套件", price: 299, originalPrice: 399, rating: 5, reviews: 128, category: "工具", badge: "热销", gradient: "from-violet-500 to-purple-600" },
  { id: "2", name: "UI 设计系统", price: 199, rating: 4, reviews: 64, category: "设计", gradient: "from-blue-500 to-cyan-500" },
  { id: "3", name: "数据分析插件", price: 149, originalPrice: 199, rating: 4, reviews: 42, category: "分析", badge: "折扣", gradient: "from-emerald-500 to-teal-500" },
  { id: "4", name: "AI 写作助手", price: 99, rating: 5, reviews: 210, category: "AI", badge: "新品", gradient: "from-rose-500 to-pink-500" },
  { id: "5", name: "项目管理模板", price: 0, rating: 4, reviews: 88, category: "模板", badge: "免费", gradient: "from-orange-500 to-amber-500" },
  { id: "6", name: "团队协作工具", price: 399, rating: 5, reviews: 56, category: "工具", gradient: "from-indigo-500 to-blue-600" },
]

const CATEGORIES = ["全部", "工具", "设计", "分析", "AI", "模板"]

// ---------------------------------------------------------------------------
// Product card
// ---------------------------------------------------------------------------

function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [wishlisted, setWishlisted] = useState(false)

  if (compact) {
    return (
      <Card className="flex items-center gap-4 p-3">
        <div className={cn("size-16 shrink-0 rounded-lg bg-gradient-to-br", product.gradient)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium truncate text-sm">{product.name}</p>
            {product.badge && <Badge variant="secondary" size="sm">{product.badge}</Badge>}
          </div>
          <RatingInput value={product.rating} readOnly size="sm" />
          <p className="text-xs text-muted-foreground mt-0.5">{product.reviews} 评价</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-semibold text-sm">{product.price === 0 ? "免费" : `¥${product.price}`}</p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">¥{product.originalPrice}</p>
          )}
          <Button size="xs" className="mt-1"><ShoppingCartIcon />购买</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden group">
      <div className={cn("h-36 bg-gradient-to-br flex items-center justify-center", product.gradient)}>
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm" />
      </div>
      <CardContent className="pt-3 pb-2">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-sm leading-tight">{product.name}</p>
          <button
            type="button"
            onClick={() => setWishlisted((p) => !p)}
            className={cn(
              "shrink-0 transition-colors",
              wishlisted ? "text-red-500" : "text-muted-foreground hover:text-red-400",
            )}
            aria-label={wishlisted ? "取消收藏" : "收藏"}
          >
            <HeartIcon className={cn("size-4", wishlisted && "fill-current")} />
          </button>
        </div>
        <RatingInput value={product.rating} readOnly size="sm" showValue />
        <p className="text-xs text-muted-foreground mt-0.5">{product.reviews} 条评价</p>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <div>
          <span className="font-bold">{product.price === 0 ? "免费" : `¥${product.price}`}</span>
          {product.originalPrice && (
            <span className="ml-1.5 text-xs text-muted-foreground line-through">¥{product.originalPrice}</span>
          )}
        </div>
        <Button size="xs">
          <ShoppingCartIcon />
          {product.price === 0 ? "获取" : "购买"}
        </Button>
      </CardFooter>
      {product.badge && (
        <div className="absolute top-2 left-2">
          <Badge variant={product.badge === "热销" ? "default" : product.badge === "免费" ? "secondary" : "outline"} size="sm">
            {product.badge}
          </Badge>
        </div>
      )}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ProductCatalogPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("全部")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [freeOnly, setFreeOnly] = useState(false)

  const filtered = PRODUCTS.filter((p) => {
    if (search && !p.name.includes(search)) return false
    if (category !== "全部" && p.category !== category) return false
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false
    if (freeOnly && p.price !== 0) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">商品列表</h1>
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索商品…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 border-r p-4 space-y-5 lg:block min-h-[calc(100vh-65px)]">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wide">
              分类
            </h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    category === cat
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground tracking-wide">
              价格范围
            </h3>
            <Slider
              value={priceRange}
              onValueChange={(v) => Array.isArray(v) && v.length === 2 && setPriceRange(v as [number, number])}
              min={0}
              max={500}
              step={10}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>¥{priceRange[0]}</span>
              <span>¥{priceRange[1]}</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <Checkbox
              id="free-only"
              checked={freeOnly}
              onCheckedChange={(v) => setFreeOnly(Boolean(v))}
            />
            <Label htmlFor="free-only" className="text-sm cursor-pointer">
              仅显示免费
            </Label>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-5 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              共 <span className="font-medium text-foreground">{filtered.length}</span> 个商品
            </p>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px] h-8 text-sm">
                  <SlidersHorizontalIcon className="size-3.5 mr-1 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">最受欢迎</SelectItem>
                  <SelectItem value="newest">最新上架</SelectItem>
                  <SelectItem value="price-asc">价格从低</SelectItem>
                  <SelectItem value="price-desc">价格从高</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-md border">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn("rounded-r-none", viewMode === "grid" && "bg-accent")}
                  onClick={() => setViewMode("grid")}
                >
                  <GridIcon className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn("rounded-l-none border-l", viewMode === "list" && "bg-accent")}
                  onClick={() => setViewMode("list")}
                >
                  <ListIcon className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <SearchIcon className="size-10 mb-3 opacity-30" />
              <p className="text-sm">没有匹配的商品</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <div key={p.id} className="relative">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} compact />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <ProductCatalogPage />,
}
