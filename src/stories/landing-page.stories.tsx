/**
 * Landing Page — product marketing hero with features, testimonials, and CTA.
 * Demonstrates Card, Badge, Avatar, Button, Separator composition in a marketing context.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect } from "storybook/test"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/display/card"
import { Separator } from "@/components/ui/display/separator"
import { Avatar, AvatarFallback } from "@/components/ui/display/avatar"
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Globe,
  Layers,
  Palette,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react"

const meta: Meta = {
  title: "Pages/Landing",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "产品落地页 — Hero 区域、特性网格、用户评价、CTA 区块，展示营销型页面组合模式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

const FEATURES = [
  {
    icon: Layers,
    title: "50+ 组件",
    description: "开箱即用的高质量 React 组件，覆盖表单、数据展示、导航、反馈等场景。",
  },
  {
    icon: Palette,
    title: "主题系统",
    description: "基于 OKLCH 色彩空间，支持预设主题切换和自定义 Token。",
  },
  {
    icon: Globe,
    title: "国际化",
    description: "内置中文、英文、日文三种语言，可轻松扩展更多 locale。",
  },
  {
    icon: Zap,
    title: "极致性能",
    description: "ESM 175KB、CJS 152KB，Tree-shaking 友好，零冗余依赖。",
  },
  {
    icon: Shield,
    title: "无障碍",
    description: "遵循 WAI-ARIA 规范，键盘导航、屏幕阅读器全面支持。",
  },
  {
    icon: Code2,
    title: "TypeScript",
    description: "100% TypeScript 编写，完整的类型定义和智能提示。",
  },
]

const TESTIMONIALS = [
  {
    name: "Alice Li",
    initial: "A",
    role: "Frontend Lead @ ByteFlow",
    content: "next-ui 极大提升了我们团队的开发效率，主题系统和 i18n 支持非常出色。",
    stars: 5,
  },
  {
    name: "Bob Zhang",
    initial: "B",
    role: "CTO @ CloudNest",
    content: "组件质量很高，文档清晰，从 MUI 迁移过来后 bundle 体积减少了 60%。",
    stars: 5,
  },
  {
    name: "Grace Wu",
    initial: "G",
    role: "Designer @ PixelCraft",
    content: "设计系统和代码完美对齐，OKLCH 支持让主题定制变得直观且一致。",
    stars: 5,
  },
]

const STATS = [
  { value: "50+", label: "组件" },
  { value: "175KB", label: "ESM 体积" },
  { value: "100%", label: "TypeScript" },
  { value: "3", label: "语言" },
]

function LandingPage() {
  return (
    <div className="min-h-175 bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-1 size-3" /> v0.1.0 已发布
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            构建精美 React 应用
            <br />
            <span className="text-primary">只需更少的代码</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            next-ui 是一个基于 shadcn/ui v3 和 Tailwind CSS v4 的现代 React 组件库，
            提供 50+ 高质量组件、主题系统和国际化支持。
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg">
              开始使用 <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button variant="outline" size="lg">
              查看文档
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold">为什么选择 next-ui</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            一站式解决组件、主题、国际化和无障碍需求
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <f.icon className="mb-2 size-8 text-primary" />
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold">用户评价</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            来自真实开发者的反馈
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardContent className="pt-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">{t.initial}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold">准备好了吗？</h2>
        <p className="mt-2 text-muted-foreground">
          一行命令安装，几分钟内开始构建
        </p>
        <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-lg border bg-muted/50 px-4 py-3">
          <code className="flex-1 text-left text-sm">
            npm install @stcn52/next-ui
          </code>
          <Button variant="ghost" size="sm">
            复制
          </Button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <CheckCircle2 className="size-4 text-green-500" />
          <span className="text-sm text-muted-foreground">MIT 开源许可证</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">持续更新</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">社区驱动</span>
        </div>
      </section>
    </div>
  )
}

export const Default: Story = {
  render: () => <LandingPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("构建精美 React 应用")).toBeInTheDocument()
    await expect(canvas.getByText("50+ 组件")).toBeInTheDocument()
    await expect(canvas.getByText("用户评价")).toBeInTheDocument()
    await expect(canvas.getByText("npm install @stcn52/next-ui")).toBeInTheDocument()
  },
}
