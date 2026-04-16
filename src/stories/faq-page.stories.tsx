/**
 * FAQ Page — expandable Q&A with category filtering.
 * Demonstrates Accordion, Badge, Tabs, Input composition.
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { within, expect, userEvent } from "storybook/test"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, Search } from "lucide-react"

const meta: Meta = {
  title: "Pages/FAQ",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "常见问题 — 手风琴式问答列表、分类过滤、搜索功能，展示知识库页面组合模式。",
      },
    },
  },
}

export default meta
type Story = StoryObj

interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "1",
    question: "如何安装 next-ui？",
    answer: "运行 npm install @stcn52/next-ui 即可安装。组件库需要 React 19+ 和 Tailwind CSS v4 作为 peer dependency。安装后按照文档中的 Getting Started 指南配置 Tailwind 和导入样式。",
    category: "入门",
  },
  {
    id: "2",
    question: "如何切换主题？",
    answer: "使用 ThemeProvider 包裹应用，然后调用 ThemeToggle 组件或使用 useTheme() hook 切换 light/dark/system 模式。也可以通过 Theme Customizer 预览和导出自定义主题 Token。",
    category: "入门",
  },
  {
    id: "3",
    question: "支持哪些语言？",
    answer: "内置支持三种语言：简体中文（zh-CN）、英文（en）和日文（ja-JP）。你可以通过 registerLocale() 添加更多语言包，所有自定义组件（如 DataTable、DatePicker）都已支持多语言。",
    category: "国际化",
  },
  {
    id: "4",
    question: "如何导入自定义主题 CSS？",
    answer: "使用 parseThemeCSS() 函数可以将来自 shadcnthemer.com 等工具生成的 CSS 变量文本解析为 ThemePreset 对象。具体用法参考 Theme Import Playground 示例。",
    category: "主题",
  },
  {
    id: "5",
    question: "包体积有多大？",
    answer: "ESM 格式约 179KB（gzip 39KB），CJS 约 155KB（gzip 37KB），CSS 约 238KB（gzip 84KB）。所有重依赖（date-fns、motion、react-day-picker 等）已通过 external 配置排除，使用 Tree-shaking 可进一步减小实际引用体积。",
    category: "性能",
  },
  {
    id: "6",
    question: "是否支持 Tree-shaking？",
    answer: "是的。库以 ESM + CJS 双格式发布，每个组件都是独立的 export，打包工具可以按需引入。推荐使用 ESM 格式获得最佳 Tree-shaking 效果。",
    category: "性能",
  },
  {
    id: "7",
    question: "如何自定义组件样式？",
    answer: "所有组件都接受 className prop 并使用 Tailwind CSS 类名。你可以通过 className 覆盖默认样式，或通过修改 CSS 变量（如 --primary、--radius）全局调整主题。",
    category: "主题",
  },
  {
    id: "8",
    question: "DataTable 支持服务端分页吗？",
    answer: "UrlDataTable 组件支持将分页、排序、过滤参数同步到 URL query string。你可以通过 onPaginationChange 回调实现服务端分页逻辑。",
    category: "组件",
  },
  {
    id: "9",
    question: "Kanban 看板支持持久化吗？",
    answer: "是的。使用 useKanbanStorage() hook 可以将看板数据持久化到 localStorage。它支持自定义序列化、初始值和自动同步。",
    category: "组件",
  },
  {
    id: "10",
    question: "如何贡献代码？",
    answer: "Fork 仓库后创建 feature 分支，提交 PR 到 main 分支。请确保代码通过 lint（eslint）、单元测试（vitest）和 E2E 测试（playwright）。推荐在 PR 中附带 Storybook story 和 play test。",
    category: "入门",
  },
]

const CATEGORIES = ["全部", ...new Set(FAQ_DATA.map((f) => f.category))]

function FaqPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("全部")

  const filtered = FAQ_DATA.filter((f) => {
    const matchCat = category === "全部" || f.category === category
    const matchSearch =
      !search ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-175 bg-background text-foreground">
      {/* Header */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-transparent px-6 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <HelpCircle className="mx-auto mb-3 size-8 text-primary" />
          <h1 className="text-2xl font-bold">常见问题</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            关于 next-ui 的常见疑问和解答
          </p>
          <div className="relative mx-auto mt-6 max-w-md">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="搜索问题..."
              className="pl-10"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mx-auto max-w-3xl px-6 pt-6">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="flex-wrap">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
                {cat !== "全部" && (
                  <Badge variant="secondary" className="ml-1.5 text-[10px]">
                    {FAQ_DATA.filter((f) => f.category === cat).length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* FAQ list */}
      <div className="mx-auto max-w-3xl px-6 py-4">
        {filtered.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-2">
            {filtered.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="rounded-lg border px-4">
                <AccordionTrigger className="text-left text-sm font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-foreground/80">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            没有匹配的问题
          </div>
        )}
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <FaqPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("常见问题")).toBeInTheDocument()
    await expect(canvas.getByText("如何安装 next-ui？")).toBeInTheDocument()
    // Expand a question
    await userEvent.click(canvas.getByText("如何切换主题？"))
    await expect(canvas.getByText(/ThemeProvider/)).toBeInTheDocument()
  },
}

export const FilterByCategory: Story = {
  render: () => <FaqPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("tab", { name: /主题/ }))
    await expect(canvas.getByText("如何导入自定义主题 CSS？")).toBeInTheDocument()
    await expect(canvas.getByText("如何自定义组件样式？")).toBeInTheDocument()
  },
}
